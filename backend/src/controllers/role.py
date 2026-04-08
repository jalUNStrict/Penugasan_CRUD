from fastapi import Depends
from src.database.models.role import Role
from src.dto.role import RoleRequest
from src.services.role import RoleService

class RoleController:
    def __init__(self, role_service: RoleService = Depends(RoleService)):
        self.role_service = role_service

    def create_role(self, req_body: RoleRequest):
        role_data = Role(
            name=req_body.name
        )
        return self.role_service.create_role(role_data)

    def get_role(self, role_id: int):
        return self.role_service.get_role(role_id)

    def get_all_roles(self):
        return self.role_service.get_all_roles()

    def update_role(self, role_id: int, req_body: RoleRequest):
        return self.role_service.update_role(role_id, req_body)

    def delete_role(self, role_id: int):
        return self.role_service.delete_role(role_id)