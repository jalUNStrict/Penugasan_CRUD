from fastapi import Depends
from sqlmodel import Session, select
from src.database.models.role import Role
from src.database.connection import get_session 

class RoleRepository:
    # ✨ Tambahkan = Depends(get_session) di sini ✨
    def __init__(self, session: Session = Depends(get_session)):
        self.session = session

    def get_all(self):
        return self.session.exec(select(Role)).all()

    def get_by_id(self, role_id: int):
        return self.session.get(Role, role_id)

    def create(self, role: Role):
        self.session.add(role)
        self.session.commit()
        self.session.refresh(role)
        return role

    def update(self, role: Role):
        self.session.add(role)
        self.session.commit()
        self.session.refresh(role)
        return role

    def delete(self, role: Role):
        self.session.delete(role)
        self.session.commit()