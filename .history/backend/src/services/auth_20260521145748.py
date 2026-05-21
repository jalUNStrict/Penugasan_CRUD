from fastapi import HTTPException, status
from src.utils.hash import verify_password, get_password_hash
from src.database.models.account import Account
from src.database.models.role import Role
from src.database.models.user import User
from src.middlewares.auth import create_access_token
import random
import string

class AuthService:
    @staticmethod
    def login(db, username, password):
        # 1. Cari user berdasarkan username atau email
        account = db.query(Account).filter(Account.username == username).first()
        if not account:
            account = db.query(Account).filter(Account.email == username).first()
        if not account:
            return None
        
        # 2. Verifikasi password (input vs hash di db)
        if not verify_password(password, account.password):
            return None
            
        # 3. Generate token (panggil fungsi create_access_token milikmu)
        token = create_access_token(data={"sub": account.username})
        return token

    @staticmethod
    def register(db, email, username, password):
        role = db.query(Role).filter(Role.name == "User").first()
        
        if not role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Role User tidak ditemukan"
            )

        if db.query(Account).filter(Account.email == email).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email sudah terdaftar"
            )

        base_username = username[:16]
        candidate_username = base_username
        suffix = 1
        while db.query(Account).filter(Account.username == candidate_username).first():
            candidate_username = f"{base_username[:16-len(str(suffix))]}{suffix}"
            suffix += 1
            if suffix > 9999:
                break

        if db.query(Account).filter(Account.username == candidate_username).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username tidak tersedia, coba nama lain"
            )

        random_suffix = ''.join(random.choices(string.digits, k=8))
        whatsapp_num = f"{candidate_username}_{random_suffix}"[:20]
        
        new_user = User(
            first_name=candidate_username,
            last_name="",
            whatsapp_number=whatsapp_num
        )
        db.add(new_user)
        db.flush()  # Flush agar user.id tersedia tanpa commit
        
        new_account = Account(
            email=email,
            username=candidate_username,
            password=get_password_hash(password),
            role_id=role.id,
            user_id=new_user.id
        )
        db.add(new_account)
        db.commit()
        db.refresh(new_account)
        return new_account