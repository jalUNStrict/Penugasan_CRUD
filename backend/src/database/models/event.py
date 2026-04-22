from typing import Optional
from datetime import datetime
from sqlmodel import Field, SQLModel

class Event(SQLModel, table=True):
    # Menggunakan "event" (tanpa s) agar cocok dengan tabel Registration
    __tablename__ = "event" 
    __table_args__ = {"extend_existing": True}

    # Primary Key
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    quota: int
    started_at: datetime
    ended_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)