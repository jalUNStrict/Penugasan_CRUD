from sqlmodel import Session, create_engine
from src.utils.env import DATABASE_URL
from src.database.models import Role, Account, User
from src.utils.hash import get_password_hash

engine = create_engine(DATABASE_URL)

# Konfigurasi seed data - mudah diubah
ROLES = ["Admin", "User"]

SEED_USERS = [
    {
        "first_name": "Admin",
        "last_name": "User",
        "whatsapp_number": "0800000000",
        "accounts": [
            {
                "username": "admin",
                "email": "admin@example.com",
                "password": "admin123",
                "role": "Admin"
            }
        ]
    },
    {
        "first_name": "John",
        "last_name": "Doe",
        "whatsapp_number": "08123456789",
        "accounts": [
            {
                "username": "user1",
                "email": "user1@example.com",
                "password": "user123",
                "role": "User"
            }
        ]
    }
]

def seed_database():
    with Session(engine) as db:
        # Seed roles
        for r_name in ROLES:
            if not db.query(Role).filter(Role.name == r_name).first():
                db.add(Role(name=r_name))
        db.commit()
        
        # Seed users dan accounts
        for user_data in SEED_USERS:
            # Cek duplikasi user dengan kombinasi field
            existing_user = db.query(User).filter(
                User.first_name == user_data["first_name"],
                User.last_name == user_data["last_name"],
                User.whatsapp_number == user_data["whatsapp_number"]
            ).first()
            
            if not existing_user:
                new_user = User(
                    first_name=user_data["first_name"],
                    last_name=user_data["last_name"],
                    whatsapp_number=user_data["whatsapp_number"]
                )
                db.add(new_user)
                db.commit()
                db.refresh(new_user)
            else:
                new_user = existing_user
            
            # Seed accounts untuk user ini
            for acc_data in user_data.get("accounts", []):
                if not db.query(Account).filter(Account.username == acc_data["username"]).first():
                    role = db.query(Role).filter(Role.name == acc_data["role"]).first()
                    db.add(Account(
                        user_id=new_user.id,
                        username=acc_data["username"],
                        email=acc_data["email"],
                        password=get_password_hash(acc_data["password"]),
                        role_id=role.id
                    ))
        
        db.commit()