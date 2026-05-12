import os
from pathlib import Path
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from src.database.connection import get_session
from src.database.models import Account

# 1. Load env di paling atas dengan path yang eksplisit
env_path = Path(__file__).parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# 2. Ambil nilai dan pastikan nilainya string bersih
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-key-kalo-env-mati")
ALGORITHM = os.getenv("ALGORITHM", "bcrypt")

bearer_scheme = HTTPBearer()

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=60))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_session)
):
    token = credentials.credentials  
    try:
        # Gunakan list [ALGORITHM] untuk verifikasi
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Token invalid")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token expired atau invalid")

    user = db.query(Account).filter(Account.username == username).first()
    if not user:
        raise HTTPException(status_code=401, detail="User tidak ditemukan")
    return user

def admin_only(current_user: Account = Depends(get_current_user)):
    if not current_user.role or current_user.role.name != "Admin":
        raise HTTPException(status_code=403, detail="Akses Ditolak: Khusus Admin")
    return current_user