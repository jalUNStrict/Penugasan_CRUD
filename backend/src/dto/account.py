from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    email: EmailStr
    username: str
    password: str

class AccountRequest(BaseModel):
    user_id: int
    role_id: int
    email: str 
    username: str
    password: str

class AccountResponse(BaseModel):
    id: int
    user_id: int
    role_id: int
    email: str
    username: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True