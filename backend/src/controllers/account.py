from fastapi import Depends
from src.services.account import AccountService
from src.dto.account import AccountRequest

class AccountController:
    def __init__(self, service: AccountService = Depends(AccountService)):
        self.service = service

    def list_accounts(self):
        return self.service.get_all()

    def detail_account(self, account_id: int):
        return self.service.get_one(account_id)

    def add_account(self, data: AccountRequest):
        return self.service.create(data)

    def edit_account(self, account_id: int, data: AccountRequest):
        return self.service.update(account_id, data)

    def delete_account(self, account_id: int):
        return self.service.remove(account_id)