from fastapi import APIRouter, Depends
from sqlmodel import Session
from src.database.connection import get_session 
from src.services.event import EventService
from src.middlewares.auth import admin_only, get_current_user # Import keduanya
from src.dto.event import EventResponse, EventUpdate, EventRequest  

router = APIRouter(prefix="/events", tags=["Events"])

def get_event_service(session: Session = Depends(get_session)):
    return EventService(session)

# GET — Semua user yang sudah login boleh melihat
@router.get("/", response_model=EventResponse, dependencies=[Depends(get_current_user)], description="Semua user yang sudah login dapat melihat daftar event") 
def get_events(service: EventService = Depends(get_event_service)):
    events = service.list_events()
    return {
        "code": 200,
        "message": "Events retrieved successfully",
        "data": {"events": [event.model_dump() for event in events]}
    }

# POST, PUT, DELETE — Hanya Admin yang diizinkan
@router.post("/", dependencies=[Depends(admin_only)], description="Hanya admin yang dapat membuat event baru")
def create_event(event_data: EventRequest, service: EventService = Depends(get_event_service)):
    new_event = service.create_event(event_data)
    return {"code": 200, "message": "Event created successfully", "data": new_event.model_dump()}

@router.put("/{event_id}", dependencies=[Depends(admin_only)], description="Hanya admin yang dapat mengubah data event")
def update_event(event_id: int, event: EventUpdate, service: EventService = Depends(get_event_service)):
    updated_event = service.update_event(event_id, event)
    return {"code": 200, "message": "Event updated successfully", "data": updated_event.model_dump()}

@router.delete("/{event_id}", dependencies=[Depends(admin_only)], description="Hanya admin yang dapat menghapus event")
def delete_event(event_id: int, service: EventService = Depends(get_event_service)):
    service.remove_event(event_id)
    return {"code": 200, "message": "Event deleted successfully", "data": None}