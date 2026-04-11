import os

import resend
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, EmailStr
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database import get_db
from limiter import limiter
from models import WaitlistEntry

router = APIRouter(tags=["waitlist"])


class WaitlistRequest(BaseModel):
    email: EmailStr


def _send_waitlist_emails(subscriber_email: str) -> None:
    api_key = os.getenv("RESEND_API_KEY")
    from_addr = os.getenv("RESEND_WAITLIST_FROM")
    notify_to = os.getenv("RESEND_WAITLIST_TO")

    if not api_key or not from_addr or not notify_to:
        raise HTTPException(
            status_code=503,
            detail="Waitlist is temporarily unavailable.",
        )

    resend.api_key = api_key

    owner_email: resend.Emails.SendParams = {
        "from": from_addr,
        "to": [notify_to],
        "subject": f"New waitlist signup: {subscriber_email}",
        "html": (
            "<p>Someone joined the Monkey Mentor waitlist.</p>"
            f"<p><strong>Email:</strong> {subscriber_email}</p>"
        ),
        "reply_to": subscriber_email,
    }

    confirmation_email: resend.Emails.SendParams = {
        "from": from_addr,
        "to": [subscriber_email],
        "subject": "You're on the Monkey Mentor waitlist",
        "html": (
            "<p>Hi there,</p>"
            "<p>Thanks for joining the <strong>Monkey Mentor</strong> waitlist. "
            "We’ll email you when early access opens.</p>"
            "<p>If you didn’t sign up, you can ignore this message.</p>"
            "<p>— The Monkey Mentor team</p>"
        ),
    }

    try:
        resend.Emails.send(owner_email)
        resend.Emails.send(confirmation_email)
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Could not complete signup. Please try again later.",
        ) from None


@router.post("/waitlist")
@limiter.limit("10/hour")
def join_waitlist(request: Request, body: WaitlistRequest, db: Session = Depends(get_db)):
    # Single canonical form so User+user@host and user@host match.
    email_normalized = body.email.strip().lower()

    entry = WaitlistEntry(email=email_normalized)
    db.add(entry)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        # Already on the list — do not send duplicate emails or notify owner again.
        return {"ok": True, "duplicate": True}

    _send_waitlist_emails(email_normalized)
    return {"ok": True, "duplicate": False}
