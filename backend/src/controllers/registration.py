from fastapi import Depends
from src.services.registration import RegistrationService
from src.dto.registration import RegistrationRequest

class RegistrationController:
    def __init__(self, service: RegistrationService = Depends(RegistrationService)):
        self.service = service

    def list_registrations(self):
        return self.service.get_all()

    def detail_registration(self, registration_id: int):
        return self.service.get_one(registration_id)

    def add_registration(self, data: RegistrationRequest):
        return self.service.create(data)

    def edit_registration(self, registration_id: int, data: RegistrationRequest):
        return self.service.update(registration_id, data)

    def delete_registration(self, registration_id: int):
        return self.service.remove(registration_id)