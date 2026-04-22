from fastapi import APIRouter, Depends
from src.dto.role import RoleResponse, RoleRequest 
from src.controllers.role import RoleController
from src.middlewares.auth import admin_only

router = APIRouter(tags=["Roles"], prefix="/roles", dependencies=[Depends(admin_only)])

@router.post("/", response_model=RoleResponse)
def create_role(req_body: RoleRequest, controller: RoleController = Depends(RoleController)):
    return controller.create_role(req_body)

@router.get("/", response_model=list[RoleResponse])
def get_roles(controller: RoleController = Depends(RoleController)):
    return controller.get_all_roles()

@router.get("/{id}", response_model=RoleResponse)
def get_role(id: int, controller: RoleController = Depends(RoleController)):
    return controller.get_role(id)

@router.put("/{id}", response_model=RoleResponse)
def update_role(id: int, req_body: RoleRequest, controller: RoleController = Depends(RoleController)):
    return controller.update_role(id, req_body)

@router.delete("/{id}")
def delete_role(id: int, controller: RoleController = Depends(RoleController)):
    return controller.delete_role(id)