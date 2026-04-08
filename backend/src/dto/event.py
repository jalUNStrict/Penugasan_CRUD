from datetime import datetime

from pydantic import BaseModel, Field

from src.dto.base import Response


class EventRequest(BaseModel):
    name: str = Field(default="Event Name", examples=["Event Name"])
    description: str = Field(
        default="Event Description", examples=["Event Description"]
    )
    quota: int = Field(default=100, examples=[100])
    start_date: datetime = Field(
        default_factory=datetime.now, examples=["2026-04-02T00:00:00"]
    )
    end_date: datetime = Field(
        default_factory=datetime.now, examples=["2026-04-02T00:00:00"]
    )


class EventResponse(Response):
    pass


class GetEventRequest(BaseModel):
    id: str = Field(default="1iu2g4i1u24i1u2", examples=["1i27ugi1u2gi41u"])


class GetEventResponse(Response):
    pass


class EventCreate(BaseModel):
    name: str
    description: str | None = None
    date: str  # atau datetime

class EventUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    date: str | None = None