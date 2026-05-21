from fastapi import APIRouter, Depends
from src.controllers.registration import RegistrationController
from src.dto.registration import RegistrationRequest, RegistrationResponse
from src.middlewares.auth import admin_only, get_current_user

router = APIRouter(prefix="/registrations", tags=["Event Registrations"])

# Semua user login bisa melihat dan mendaftar
@router.get("/", response_model=list[RegistrationResponse], dependencies=[Depends(get_current_user)], description="Semua user yang sudah login dapat melihat daftar pendaftaran")
def get_registrations(ctrl: RegistrationController = Depends(RegistrationController)):
    return ctrl.list_registrations()

@router.post("/", response_model=RegistrationResponse, dependencies=[Depends(get_current_user)], description="Semua user yang sudah login dapat mendaftar event")
def create_registration(data: RegistrationRequest, ctrl: RegistrationController = Depends(RegistrationController)):
    return ctrl.add_registration(data)

@router.put("/{id}", response_model=RegistrationResponse, dependencies=[Depends(get_current_user)], description="Semua user yang sudah login dapat mengubah pendaftaran mereka")
def update_registration(id: int, data: RegistrationRequest, ctrl: RegistrationController = Depends(RegistrationController)):
    return ctrl.edit_registration(id, data)

# Hanya Admin yang bisa menghapus pendaftaran
@router.delete("/{id}", dependencies=[Depends(admin_only)], description="Hanya admin yang dapat menghapus pendaftaran")
def delete_registration(id: int, ctrl: RegistrationController = Depends(RegistrationController)):
    return ctrl.delete_registration(id)