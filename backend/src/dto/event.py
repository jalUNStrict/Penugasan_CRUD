from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from src.dto.base import Response

# 1. Model untuk Request (Biasanya digunakan di dokumentasi Swagger)
class EventRequest(BaseModel):
    name: str = Field(default="Event Name", examples=["Konser Musik"])
    description: Optional[str] = Field(
        default="Event Description", examples=["Deskripsi event di sini"]
    )
    quota: int = Field(default=100, examples=[100])
    started_at: datetime = Field(
        default_factory=datetime.now, examples=["2026-04-09T19:00:00"]
    )
    ended_at: datetime = Field(
        default_factory=datetime.now, examples=["2026-04-09T22:00:00"]
    )

# 2. Model yang digunakan saat POST /events/ (Create)
# Pastikan nama field di sini SAMA dengan yang dipanggil di service.py
class EventCreate(BaseModel):
    name: str
    description: Optional[str] = None
    quota: int = 100
    started_at: datetime
    ended_at: datetime  # Pakai 'ended_at' (sesuai saran error tadi)

# 3. Model untuk Update (Semua field dibuat Optional agar bisa update salah satu saja)
class EventUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    quota: Optional[int] = None
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None

# 4. Model untuk Get Detail
class GetEventRequest(BaseModel):
    id: int = Field(..., examples=[1]) # ID biasanya integer sesuai ERD kamu

# 5. Model Response
class EventResponse(Response):
    pass

class GetEventResponse(Response):
    pass