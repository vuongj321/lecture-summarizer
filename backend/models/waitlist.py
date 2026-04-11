from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import mapped_column

from database import Base


class WaitlistEntry(Base):
    """One row per unique email that joined the marketing waitlist."""

    __tablename__ = "waitlist_entries"

    id = mapped_column(Integer, primary_key=True, autoincrement=True)
    email = mapped_column(String(254), unique=True, nullable=False)
    created_at = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
