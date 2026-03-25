from fastapi import APIRouter, Depends, HTTPException

from models import User
from services.nova import ask_nova, summarize_nova
from schemas.chat import Question

from dependencies import get_current_user
from state import stored_file

router = APIRouter()

@router.post("/ask")
async def ask_question(body: Question, current_user: User = Depends(get_current_user)):
    if not stored_file:
        raise HTTPException(status_code=400, detail="No file uploaded yet")

    answer = ask_nova(stored_file["data"], body.text)

    return {"answer": answer}

@router.post("/summarize")
async def summarize(current_user: User = Depends(get_current_user)):
    if not stored_file:
        raise HTTPException(status_code=400, detail="No file uploaded yet")

    summary = summarize_nova(stored_file["data"])
    
    return {"summary": summary}