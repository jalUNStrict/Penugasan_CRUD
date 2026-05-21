from fastapi import Depends
from sqlmodel import Session, select

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

    def find_all(self):
        return self.session.exec(select(Event)).all()

    def get_by_id(self, event_id: int) -> Event:
        event = self.session.get(Event, event_id)
        if not event:
            raise ValueError(f"Event with id {event_id} not found")
        return event

    def update(self, event: Event) -> Event:
        self.session.add(event)
        self.session.commit()
        self.session.refresh(event)
        return event

    def delete(self, event: Event) -> None:
        self.session.delete(event)
        self.session.commit()
