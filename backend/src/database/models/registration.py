from typing import Optional
from datetime import datetime

from sqlmodel import SQLModel, Field

class Registration(SQLModel, table = True):
    
    __table_name__ = "registrations"
    __table_args__={"extend_existing": True}

    #Primary Key 
    id: Optional[int] = Field(default=None, primary_key=True)

    #Foreign Key
    user_id : int = Field(foreign_key = "user.id")
    event_id : int = Field(foreign_key = "event.id")
    