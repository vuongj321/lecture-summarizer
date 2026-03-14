from fastapi import APIRouter, HTTPException, Security

from services.nova import ask_nova, summarize_nova
from schemas.chat import Question

from dependencies import verify_key, api_key_header
from state import stored_file

router = APIRouter()

@router.post("/ask")
async def ask_question(body: Question, key: str = Security(api_key_header)):
    verify_key(key)
    if not stored_file:
        raise HTTPException(status_code=400, detail="No file uploaded yet")

    answer = ask_nova(stored_file["data"], body.text)

    return {"answer": answer}

@router.post("/summarize")
async def summarize(key: str = Security(api_key_header)):
    verify_key(key)
    if not stored_file:
        raise HTTPException(status_code=400, detail="No file uploaded yet")

    summary = summarize_nova(stored_file["data"])
    
    return {"summary": summary}