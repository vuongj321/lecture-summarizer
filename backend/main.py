from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, documents, auth

from limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from typing import cast, Callable

from models import User, Document, Message

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://lecture-summarizer-blond.vercel.app"],  # React app's address
    allow_methods=["*"],   # allow GET, POST, etc.
    allow_headers=["*"],   # allow all headers
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, cast(Callable, _rate_limit_exceeded_handler))

app.include_router(chat.router)
app.include_router(documents.router)
app.include_router(auth.router)