from datetime import datetime

from sqlmodel import Field, SQLModel

class User(SQLModel, table=True):
    __table_name__ = "users"
    __table_args__ = ({"extend_existing": True}, )
    id: int = Field(default = None, primary_key=True)
    first_name:str = Field(max_length=255)
    last_name:str = Field(max_length=255)
    whatsapp_number:str = Field(max_length=20, unique=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
