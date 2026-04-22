from typing import Optional
from sqlmodel import Field, SQLModel

class Registration(SQLModel, table=True):
    __tablename__ = "registration"
    __table_args__ = {"extend_existing": True}

    # Primary Key
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Foreign Keys
    user_id: int = Field(foreign_key="user.id")   # Asumsi model User kamu pakai __tablename__ = "user"
    event_id: int = Field(foreign_key="event.id") # Pastikan ini tulisannya "event.id" (tanpa s)