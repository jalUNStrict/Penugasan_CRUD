from fastapi import Depends
from sqlmodel import Session, select
from src.database.models.user import User
from src.database.connection import get_session

class UserRepository:
    def __init__(self, session: Session = Depends(get_session)):
        self.session = session

    def find_all(self):
        return self.session.exec(select(User)).all()

    def find_by_id(self, user_id: int):
        return self.session.get(User, user_id)

    def save(self, user: User):
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

    def delete(self, user: User):
        self.session.delete(user)
        self.session.commit()