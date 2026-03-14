from fastapi import HTTPException, Security
from fastapi.security import APIKeyHeader
import os

api_key_header = APIKeyHeader(name="X-API-Key")

def verify_key(key: str = Security(api_key_header)):
    if key != os.getenv("APP_API_KEY"):
        raise HTTPException(status_code=403, detail="Unauthorized")