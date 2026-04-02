from fastapi import APIRouter, Depends, HTTPException, UploadFile, File

from sqlalchemy.orm import Session
from database import get_db
from services.s3 import upload_to_s3, get_presigned_url
from dependencies import get_current_user
from models import User, Document

import os
import magic

MAX_FILE_SIZE = 20 * 1024 * 1024  # 20MB

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check content-length header
    content_length = file.size
    if content_length and content_length > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 20MB.")
    
    contents = await file.read()

    # Check size since content-length can be spoofed
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 20MB.")
    
    # Magic bytes check
    mime = magic.from_buffer(contents[:2048], mime=True)
    if mime != "application/pdf":
        raise HTTPException(status_code=400, detail="File must be a PDF.")
    
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is required")
    
    # Sanitize file name
    safe_filename = os.path.basename(file.filename)
    if not safe_filename:
        raise HTTPException(status_code=400, detail="Invalid filename.")

    # Upload document to s3
    s3_key = upload_to_s3(contents, current_user.id, safe_filename)

    # Save document metadata to database
    document = Document(user_id = current_user.id, filename = safe_filename, s3_key = s3_key)
    db.add(document)
    db.commit()
    db.refresh(document)

    return {
        "message": f"{safe_filename} successfully uploaded!",
        "document_id": document.id
    }

@router.get("/documents")
def get_documents(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Fetch all documents belonging to current user
    documents = db.query(Document).filter(Document.user_id == current_user.id).all()

    return {
        "documents": [
            {"id": d.id, 
             "filename": d.filename, 
             "uploaded_at": d.uploaded_at,
             "url": get_presigned_url(d.s3_key)
            }
            for d in documents
        ]
    }

@router.get("/documents/{document_id}")
def get_document(document_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Fetch document matching user and document id
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return {
        "id": document.id,
        "filename": document.filename,
        "uploaded_at": document.uploaded_at,
        "url": get_presigned_url(document.s3_key)
    }