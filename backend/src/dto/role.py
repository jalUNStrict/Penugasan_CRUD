from pydantic import BaseModel

class RoleRequest(BaseModel):
    name: str

class RoleResponse(BaseModel):
    id: int
    name: str