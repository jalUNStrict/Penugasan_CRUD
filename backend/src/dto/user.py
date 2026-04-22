from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserRequest(BaseModel):
    # Field sesuai dengan skema database [cite: 507, 509, 511]
    first_name: str
    last_name: str
    whatsapp_number: str

class UserResponse(BaseModel):
    # Response menyertakan ID dan timestamp [cite: 504, 513, 515]
    id: int
    first_name: str
    last_name: str
    whatsapp_number: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True