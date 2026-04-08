from fastapi import HTTPException, Depends
from src.repositories.role import RoleRepository
from src.database.models.role import Role
from src.dto.role import RoleRequest

class RoleService:
    def __init__(self, role_repo: RoleRepository = Depends(RoleRepository)):
        self.role_repo = role_repo

    def get_all_roles(self):
        return self.role_repo.get_all()

    def get_role(self, role_id: int):
        role = self.role_repo.get_by_id(role_id)
        if not role:
            raise HTTPException(status_code=404, detail="Role not found")
        return role

    def create_role(self, req: RoleRequest):
        new_role = Role(name=req.name)
        return self.role_repo.create(new_role)

    def update_role(self, role_id: int, req: RoleRequest):
        role = self.get_role(role_id)
        role.name = req.name
        return self.role_repo.update(role)

    def delete_role(self, role_id: int):
        role = self.get_role(role_id)
        self.role_repo.delete(role)