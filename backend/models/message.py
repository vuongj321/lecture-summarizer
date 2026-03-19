from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import Integer, String, Text, DateTime, ForeignKey
from database import Base
from datetime import datetime, timezone

class Message(Base):
    __tablename__ = "messages"

    id = mapped_column(Integer, primary_key=True)
    document_id = mapped_column(Integer, ForeignKey("documents.id"), nullable=False)
    role = mapped_column(String, nullable=False)  # "user" or "assistant"
    content = mapped_column(Text, nullable=False)
    created_at = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    document = relationship("Document", back_populates="messages")