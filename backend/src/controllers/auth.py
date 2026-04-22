from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.database.connection import get_session
from src.services.auth import AuthService
from src.dto.account import AccountRequest
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_session)):
    token = AuthService.login(db, data.username, data.password)

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username atau password salah",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return {"access_token": token, "token_type": "bearer"}

@router.post("/register")
def register(data: AccountRequest, db: Session = Depends(get_session)):
    return AuthService.register(db, data.username, data.password)