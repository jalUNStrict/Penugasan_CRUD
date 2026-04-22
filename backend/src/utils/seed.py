from sqlmodel import Session, create_engine
from src.utils.env import DATABASE_URL
from src.database.models import Role, Account, User
from src.utils.hash import get_password_hash

engine = create_engine(DATABASE_URL)

def seed_database():
    with Session(engine) as db:
        for r_name in ["Admin", "User"]:
            if not db.query(Role).filter(Role.name == r_name).first():
                db.add(Role(name=r_name))
        db.commit()
        
        admin_user = db.query(User).filter(User.first_name == "Admin").first()
        if not admin_user:
            admin_user = User(
                first_name="Admin",
                last_name="User",
                whatsapp_number="0800000000"
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
        
        # Buat Account admin jika belum ada
        admin_role = db.query(Role).filter(Role.name == "Admin").first()
        if not db.query(Account).filter(Account.username == "admin").first():
            db.add(Account(
                user_id=admin_user.id,
                username="admin",
                email="admin@example.com",
                password=get_password_hash("admin123"), 
                role_id=admin_role.id
            ))

         # Buat Account user jika belum ada
        User_role = db.query(Role).filter(Role.name == "User").first()
        if not db.query(Account).filter(Account.username == "user").first():
            db.add(Account(
                user_id=admin_user.id,
                username="user",
                email="user@example.com",
                password=get_password_hash("user123"),
                role_id=User_role.id
         ))   
        db.commit()