from fastapi import Depends

from src.database.models.event import Event
from src.dto.event import EventRequest, GetEventRequest
from src.services.event import EventService


class EventController:
    def __init__(self, event_service: EventService = Depends(EventService)):
        self.event_service = event_service

    def create_event(self, req_body: EventRequest):
        event_data = Event(
            name=req_body.name,
            description=req_body.description,
            quota=req_body.quota,
            started_at=req_body.started_at,
            ended_at=req_body.ended_at,
        )
        response = self.event_service.create_event(event_data)
        return response

    def get_event(self, req_params: GetEventRequest):
        response = self.event_service.get_event(req_params.id)
        return response

   