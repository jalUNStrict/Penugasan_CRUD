from pydantic import BaseModel
from typing import Optional

class RegistrationRequest(BaseModel):
    user_id: int
    event_id: int

class RegistrationResponse(BaseModel):
    id: int
    user_id: int
    event_id: int

    class Config:
        from_attributes = True