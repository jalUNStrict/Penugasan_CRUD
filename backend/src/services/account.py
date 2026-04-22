from fastapi import HTTPException, Depends
from src.repositories.account import AccountRepository
from src.database.models.account import Account
from src.dto.account import AccountRequest

class AccountService:
    def __init__(self, account_repo: AccountRepository = Depends(AccountRepository)):
        self.account_repo = account_repo

    def get_all(self):
        return self.account_repo.find_all()

    def get_one(self, account_id: int):
        account = self.account_repo.find_by_id(account_id)
        if not account:
            raise HTTPException(status_code=404, detail="Akun tidak ditemukan")
        return account

    def create(self, data: AccountRequest):
        # Opsional: Tambahkan pengecekan ke UserRepository/RoleRepository di sini
        new_account = Account(**data.model_dump())
        return self.account_repo.save(new_account)

    def update(self, account_id: int, data: AccountRequest):
        account = self.get_one(account_id)
        account.user_id = data.user_id
        account.role_id = data.role_id
        account.email = data.email
        account.username = data.username
        account.password = data.password # Sebaiknya di-hash jika untuk produksi
        return self.account_repo.save(account)

    def remove(self, account_id: int):
        account = self.get_one(account_id)
        self.account_repo.delete(account)
        return {"message": f"Akun dengan ID {account_id} berhasil dihapus"}