from fastapi import Depends
from src.services.user import UserService
from src.dto.user import UserRequest

class UserController:
    def __init__(self, service: UserService = Depends(UserService)):
        self.service = service

    def list_users(self):
        return self.service.get_all()

    def detail_user(self, user_id: int):
        return self.service.get_one(user_id)

    def add_user(self, data: UserRequest):
        return self.service.create(data)

    def edit_user(self, user_id: int, data: UserRequest):
        return self.service.update(user_id, data)

    def delete_user(self, user_id: int):
        return self.service.remove(user_id)