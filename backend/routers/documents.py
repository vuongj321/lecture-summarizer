from fastapi import APIRouter, Depends, HTTPException, UploadFile, File

from sqlalchemy.orm import Session
from database import get_db
from services.s3 import upload_to_s3
from dependencies import get_current_user
from models import User, Document

ALLOWED_TYPES = ["application/pdf"]

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="File type not allowed")
    
    contents = await file.read()

    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is required")

    # Upload document to s3
    s3_key = upload_to_s3(contents, current_user.id, file.filename)

    # Save document metadata to database
    document = Document(user_id = current_user.id, filename = file.filename, s3_key = s3_key)
    db.add(document)
    db.commit()
    db.refresh(document)

    return {
        "message": f"{file.filename} successfully uploaded!",
        "document_id": document.id
    }

@router.get("/documents")
def get_documents(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    documents = db.query(Document).filter(Document.user_id == current_user.id).all()
    return {"documents": [{"id": d.id, "filename": d.filename, "uploaded_at": d.uploaded_at} for d in documents]}