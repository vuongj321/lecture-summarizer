import os

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import waitlist

from limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from typing import cast, Callable

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://monkeymentor.app",
        "https://www.monkeymentor.app",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, cast(Callable, _rate_limit_exceeded_handler))

app.include_router(waitlist.router)

_marketing_only = os.getenv("MARKETING_ONLY_API") == "true"
if not _marketing_only:
    from routers import auth, chat, documents

    app.include_router(chat.router)
    app.include_router(documents.router)
    app.include_router(auth.router)