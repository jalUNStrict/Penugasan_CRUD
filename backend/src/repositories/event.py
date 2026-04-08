from fastapi import Depends
from sqlmodel import Session

from src.database.connection import get_session
from src.database.models.event import Event

from src.dto.event import EventRequest, GetEventRequest 

class EventRepository:
    def __init__(self, session: Session = Depends(get_session)):
        self.session = session

    def create(self, event: Event) -> Event:
        self.session.add(event)
        self.session.commit()
        self.session.refresh(event)
        return event

    def get(self, event_id: str) -> Event:
        event = self.session.get(Event, event_id)
        if not event:
            raise ValueError(f"Event with id {event_id} not found")
        return event

    def update(self, event_id: str, data: Event) -> None:
        event = self.session.get(Event, event_id)
        if not event:
            raise ValueError(f"Event with id {event_id} not found")
        event.sqlmodel_update(event)
        self.session.add(event)
        self.session.commit()

    def delete(self, event_id: str) -> None:
        event = self.session.get(Event, event_id)
        if not event:
            raise ValueError(f"Event with id {event_id} not found")
        self.session.delete(event)
        self.session.commit()
