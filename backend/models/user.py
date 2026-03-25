from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import Integer, LargeBinary, String, DateTime
from database import Base
from datetime import datetime, timezone

class User(Base):
    __tablename__ = "users"

    id = mapped_column(Integer, primary_key=True)
    email = mapped_column(String, unique=True, nullable=False)
    hashed_password = mapped_column(LargeBinary, nullable=False)
    created_at = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    documents = relationship("Document", back_populates="user")