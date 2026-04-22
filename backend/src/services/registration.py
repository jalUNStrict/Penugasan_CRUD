from fastapi import HTTPException, Depends
from src.repositories.registration import RegistrationRepository
from src.database.models.registration import Registration
from src.dto.registration import RegistrationRequest

class RegistrationService:
    def __init__(self, registration_repo: RegistrationRepository = Depends(RegistrationRepository)):
        self.registration_repo = registration_repo

    def get_all(self):
        return self.registration_repo.find_all()

    def get_one(self, registration_id: int):
        reg = self.registration_repo.find_by_id(registration_id)
        if not reg:
            raise HTTPException(status_code=404, detail="Data pendaftaran tidak ditemukan")
        return reg

    def create(self, data: RegistrationRequest):
        new_reg = Registration(**data.model_dump())
        return self.registration_repo.save(new_reg)

    def update(self, registration_id: int, data: RegistrationRequest):
        reg = self.get_one(registration_id)
        reg.user_id = data.user_id
        reg.event_id = data.event_id
        return self.registration_repo.save(reg)

    def remove(self, registration_id: int):
        reg = self.get_one(registration_id)
        self.registration_repo.delete(reg)
        return {"message": f"Pendaftaran ID {registration_id} berhasil dihapus"}