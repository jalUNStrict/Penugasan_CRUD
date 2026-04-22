from sqlmodel import Session, create_engine
from sqlalchemy.orm import sessionmaker
from src.utils.env import DATABASE_URL


engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine, class_=Session, expire_on_commit=False)


def get_session():
    with Session(engine) as session:
        yield session
