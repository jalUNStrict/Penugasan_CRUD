from fastapi import Depends
from sqlmodel import Session, select
from src.database.models.account import Account
from src.database.connection import get_session

class AccountRepository:
    def __init__(self, session: Session = Depends(get_session)):
        self.session = session

    def find_all(self):
        return self.session.exec(select(Account)).all()

    def find_by_id(self, account_id: int):
        return self.session.get(Account, account_id)

    def get_by_username(self, username: str):
        return self.session.exec(select(Account).where(Account.username == username)).first()

    @staticmethod
    def get_by_username_static(db: Session, username: str):
        return db.exec(select(Account).where(Account.username == username)).first()

    def save(self, account: Account):
        self.session.add(account)
        self.session.commit()
        self.session.refresh(account)
        return account

    def delete(self, account: Account):
        self.session.delete(account)
        self.session.commit()