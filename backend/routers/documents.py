from fastapi import APIRouter, HTTPException, UploadFile, File, Security

from dependencies import verify_key, api_key_header
from state import stored_file, ALLOWED_TYPES

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), key: str = Security(api_key_header)):
    verify_key(key)
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="File type not allowed")
    
    contents = await file.read()

    stored_file["data"] = contents
    stored_file["name"] = file.filename

    return {
        "message": f"{stored_file['name']} successfully uploaded!"
    }