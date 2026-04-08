from fastapi import APIRouter, Depends
from sqlmodel import Session
from typing import List
from src.database import get_session
from src.services.event import EventService
from src.dto.event import (
    EventRequest,
    GetEventRequest,
    EventResponse,
    EventCreate,
    EventUpdate
)
router = APIRouter(prefix="/events", tags=["Events"])

def get_event_service(session: Session = Depends(get_session)):
    return EventService(session)

@router.get("/", response_model=List[EventResponse])
def get_events(service: EventService = Depends(get_event_service)):
    return service.get_all_events()

@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: int, service: EventService = Depends(get_event_service)):
    return service.get_event(event_id)

@router.post("/", response_model=EventResponse)
def create_event(event: EventCreate, service: EventService = Depends(get_event_service)):
    return service.create_event(event)

@router.put("/{event_id}", response_model=EventResponse)
def update_event(event_id: int, event: EventUpdate, service: EventService = Depends(get_event_service)):
    return service.update_event(event_id, event)

@router.delete("/{event_id}")
def delete_event(event_id: int, service: EventService = Depends(get_event_service)):
    service.delete_event(event_id)
    return {"message": "Event deleted successfully"}