from fastapi import APIRouter, Depends
from src.controllers.account import AccountController
from src.dto.account import AccountRequest, AccountResponse

router = APIRouter(prefix="/accounts", tags=["Account Management"])

@router.get("/", response_model=list[AccountResponse])
def get_accounts(ctrl: AccountController = Depends(AccountController)):
    return ctrl.list_accounts()

@router.get("/{id}", response_model=AccountResponse)
def get_account(id: int, ctrl: AccountController = Depends(AccountController)):
    return ctrl.detail_account(id)

@router.post("/", response_model=AccountResponse)
def create_account(data: AccountRequest, ctrl: AccountController = Depends(AccountController)):
    return ctrl.add_account(data)

@router.put("/{id}", response_model=AccountResponse)
def update_account(id: int, data: AccountRequest, ctrl: AccountController = Depends(AccountController)):
    return ctrl.edit_account(id, data)

@router.delete("/{id}")
def delete_account(id: int, ctrl: AccountController = Depends(AccountController)):
    return ctrl.delete_account(id)