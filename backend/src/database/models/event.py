from typing import Optional
from datetime import datetime
from sqlmodel import Field, SQLModel


class Event(SQLModel, table=True):
    __table_name__ = "events"
    __table_args__ = {"extend_existing": True}

     # Primary Key dengan Auto-increment
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    quota: int
    started_at: datetime
    end_at: datetime
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
