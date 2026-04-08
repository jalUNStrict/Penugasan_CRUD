from typing import Optional
from datetime import datetime

from sqlmodel import Field, SQLModel

class Account(SQLModel, table = True):
    __table_Args__={"extend_existing": True}
    id: Optional[int] = Field(default= None, primary_key=True)
    user_id: Optional[int]= Field(foreign_key="user.id")
    role_id:Optional[int] = Field(foreign_key= "role.id")
    email: str 
    username: str = Field(max_length=16) 
    password: str 
    created_at: datetime = Field(default_factory=datetime) 
    updated_at: datetime = Field(default_factory=datetime)  