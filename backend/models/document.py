from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import Integer, String, DateTime, ForeignKey
from database import Base
from datetime import datetime, timezone

class Document(Base):
    __tablename__ = "documents"

    id = mapped_column(Integer, primary_key=True)
    user_id = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    filename = mapped_column(String, nullable=False)
    s3_key = mapped_column(String, nullable=False)
    uploaded_at = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="documents")
    messages = relationship("Message", back_populates="document")