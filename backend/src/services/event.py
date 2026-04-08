from fastapi import Depends, HTTPException
from src.database.connection import get_session
from src.repositories.event import EventRepository
from src.database.models.event import Event
from src.dto.event import EventRequest

class EventService:
    def __init__(self, session=Depends(get_session)):
        self.repository = EventRepository(session)

    def create_event(self, data: EventRequest):
        event = Event(
            name=data.name,
            description=data.description,
            quota=data.quota,
            started_at=data.started_at,
            end_at=data.end_at
        )
        return self.repository.create(event)

    def list_events(self):
        return self.repository.get_all()

    def update_event(self, event_id: int, data: EventRequest):
        event = self.repository.get_by_id(event_id)
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        event.name = data.name
        event.description = data.description
        event.quota = data.quota
        event.started_at = data.started_at
        event.end_at = data.end_at
        
        return self.repository.update(event)

    def remove_event(self, event_id: int):
        event = self.repository.get_by_id(event_id)
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        self.repository.delete(event)
        return {"message": "Event deleted successfully"}