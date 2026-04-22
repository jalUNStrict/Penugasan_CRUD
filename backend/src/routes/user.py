from fastapi import APIRouter, Depends
from src.controllers.user import UserController
from src.dto.user import UserRequest, UserResponse
from src.middlewares.auth import admin_only # Import admin_only

# Memasang dependencies di level router agar semua endpoint di bawahnya otomatis admin_only
router = APIRouter(prefix="/users", tags=["User Management"], dependencies=[Depends(admin_only)])

@router.get("/", response_model=list[UserResponse])
def get_users(ctrl: UserController = Depends(UserController)):
    return ctrl.list_users()

@router.get("/{id}", response_model=UserResponse)
def get_user(id: int, ctrl: UserController = Depends(UserController)):
    return ctrl.detail_user(id)

@router.post("/", response_model=UserResponse)
def create_user(data: UserRequest, ctrl: UserController = Depends(UserController)):
    return ctrl.add_user(data)

@router.put("/{id}", response_model=UserResponse)
def update_user(id: int, data: UserRequest, ctrl: UserController = Depends(UserController)):
    return ctrl.edit_user(id, data)

@router.delete("/{id}")
def delete_user(id: int, ctrl: UserController = Depends(UserController)):
    return ctrl.delete_user(id)