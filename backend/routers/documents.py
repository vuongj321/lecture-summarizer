from fastapi import APIRouter, Depends, HTTPException, UploadFile, File

from dependencies import get_current_user
from state import stored_file, ALLOWED_TYPES
from models import User

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="File type not allowed")
    
    contents = await file.read()

    stored_file["data"] = contents
    stored_file["name"] = file.filename

    return {
        "message": f"{stored_file['name']} successfully uploaded!"
    }