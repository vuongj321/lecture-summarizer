import json

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse

from models import User, Document, Message
from services.s3 import download_from_s3
from services.nova import summarize_nova, ask_nova_stream
from schemas.chat import Question, SummarizeRequest

from dependencies import get_current_user
from sqlalchemy.orm import Session
from database import SessionLocal, get_db

router = APIRouter()

@router.post("/ask")
async def ask_question(body: Question, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Fetch document from database and verify it belongs to user
    document = db.query(Document).filter(Document.id == body.document_id, Document.user_id == current_user.id).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Fetch file from s3
    file_bytes = download_from_s3(document.s3_key)

    def generate():
        full_response = []

        # Add text chunks to full_response and return
        for chunk in ask_nova_stream(file_bytes, body.text):
            full_response.append(chunk)
            yield f"data: {json.dumps(chunk)}\n\n"

        # Save text to database after streaming completes
        with SessionLocal() as session:
            session.add(Message(document_id=document.id, role="user", content=body.text))
            session.add(Message(document_id=document.id, role="assistant", content="".join(full_response)))
            session.commit()
            
        yield "data: [DONE]\n\n"
        
    return StreamingResponse(generate(), media_type="text/event-stream")

@router.post("/summarize")
async def summarize(body: SummarizeRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Fetch document from database and verify it belongs to user
    document = db.query(Document).filter(Document.id == body.document_id, Document.user_id == current_user.id).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Fetch file from s3
    file_bytes = download_from_s3(document.s3_key)

    summary = summarize_nova(file_bytes)

    # Save messages to database
    user_message = Message(document_id=document.id, role="user", content="Summarize the document")
    assistant_message = Message(document_id=document.id, role="assistant", content=summary)
    db.add(user_message)
    db.add(assistant_message)
    db.commit()
    
    return {"summary": summary}

@router.get("/documents/{document_id}/messages")
async def get_messages(document_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Fetch document from database
    document = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Fetch chat history for document
    messages = db.query(Message).filter(Message.document_id == document_id).order_by(Message.created_at).all()

    return {"messages": [{"role": m.role, "content": m.content} for m in messages]}