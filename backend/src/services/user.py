from fastapi import HTTPException, Depends
from src.repositories.user import UserRepository
from src.database.models.user import User
from src.dto.user import UserRequest

class UserService:
    def __init__(self, user_repo: UserRepository = Depends(UserRepository)):
        self.user_repo = user_repo

    def get_all(self):
        return self.user_repo.find_all()

    def get_one(self, user_id: int):
        user = self.user_repo.find_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User tidak ditemukan")
        return user

    def create(self, data: UserRequest):
        new_user = User(**data.model_dump())
        return self.user_repo.save(new_user)

    def update(self, user_id: int, data: UserRequest):
        user = self.get_one(user_id)
        user.first_name = data.first_name
        user.last_name = data.last_name
        user.whatsapp_number = data.whatsapp_number
        return self.user_repo.save(user)

    def remove(self, user_id: int):
        user = self.get_one(user_id)
        self.user_repo.delete(user)
        return {"message": f"User dengan ID {user_id} berhasil dihapus"}