from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas.auth import RegisterRequest, TokenResponse
from services.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth")

@router.post("/register", response_model=TokenResponse)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    if len(body.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    
    # check if email already exists
    existing = db.query(User).filter(User.email == body.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # create user
    user = User(
        email=body.email,
        hashed_password=hash_password(body.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # return token immediately so user is logged in after registering
    return TokenResponse(access_token=create_access_token(user.id))

@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # form_data.username contains the email
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return TokenResponse(access_token=create_access_token(user.id))