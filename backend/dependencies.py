from fastapi import Depends, HTTPException, Security
from fastapi.security import APIKeyHeader, OAuth2PasswordBearer
from services.auth import decode_access_token
from sqlalchemy.orm import Session
from database import get_db
from models import User
import os

api_key_header = APIKeyHeader(name="X-API-Key")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def verify_key(key: str = Security(api_key_header)):
    if key != os.getenv("APP_API_KEY"):
        raise HTTPException(status_code=403, detail="Unauthorized")
    
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
    key: str = Security(api_key_header)
) -> User:
    verify_key(key)
    
    user_id = decode_access_token(token)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user