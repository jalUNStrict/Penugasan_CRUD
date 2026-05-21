from fastapi import APIRouter, Depends
from src.controllers.user import UserController
from src.dto.user import UserRequest, UserResponse
from src.middlewares.auth import admin_only # Import admin_only

# Memasang dependencies di level router agar semua endpoint di bawahnya otomatis admin_only
router = APIRouter(prefix="/users", tags=["User Management"], dependencies=[Depends(admin_only)])

@router.get("/", response_model=list[UserResponse], description="Hanya admin yang dapat melihat daftar user")
def get_users(ctrl: UserController = Depends(UserController)):
    return ctrl.list_users()

@router.get("/{id}", response_model=UserResponse, description="Hanya admin yang dapat melihat detail user")
def get_user(id: int, ctrl: UserController = Depends(UserController)):
    return ctrl.detail_user(id)

@router.post("/", response_model=UserResponse, description="Hanya admin yang dapat membuat user baru")
def create_user(data: UserRequest, ctrl: UserController = Depends(UserController)):
    return ctrl.add_user(data)

@router.put("/{id}", response_model=UserResponse, description="Hanya admin yang dapat mengubah data user")
def update_user(id: int, data: UserRequest, ctrl: UserController = Depends(UserController)):
    return ctrl.edit_user(id, data)

@router.delete("/{id}", description="Hanya admin yang dapat menghapus user")
def delete_user(id: int, ctrl: UserController = Depends(UserController)):
    return ctrl.delete_user(id)