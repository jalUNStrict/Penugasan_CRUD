from fastapi import Depends
from sqlmodel import Session, select
from src.database.models.registration import Registration
# Ganti dengan import koneksi yang sesuai di proyekmu
from src.database.connection import get_session 

class RegistrationRepository:
    def __init__(self, session: Session = Depends(get_session)):
        self.session = session

    def find_all(self):
        return self.session.exec(select(Registration)).all()

    def find_by_id(self, registration_id: int):
        return self.session.get(Registration, registration_id)

    def save(self, registration: Registration):
        self.session.add(registration)
        self.session.commit()
        self.session.refresh(registration)
        return registration

    def delete(self, registration: Registration):
        self.session.delete(registration)
        self.session.commit()