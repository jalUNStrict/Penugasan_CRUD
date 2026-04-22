from src.utils.hash import verify_password, get_password_hash
from src.database.models.account import Account
from src.database.models.role import Role
from src.middlewares.auth import create_access_token

class AuthService:
    @staticmethod
    def login(db, username, password):
        # 1. Cari user berdasarkan username
        account = db.query(Account).filter(Account.username == username).first()
        if not account:
            return None
        
        # 2. Verifikasi password (input vs hash di db)
        if not verify_password(password, account.password):
            return None
            
        # 3. Generate token (panggil fungsi create_access_token milikmu)
        token = create_access_token(data={"sub": account.username})
        return token

    @staticmethod
    def register(db, username, password):
        role = db.query(Role).filter(Role.name == "User").first()
        
        new_account = Account(
            username=username,
            password=get_password_hash(password),
            role_id=role.id if role else None
        )
        db.add(new_account)
        db.commit()
        db.refresh(new_account)
        return new_account