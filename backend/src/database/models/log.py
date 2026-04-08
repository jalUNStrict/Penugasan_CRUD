from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class Log(SQLModel, table=True):
    __tablename__ = "logs"
    __table_args__ = {"extend_existing": True}
    
    # Primary Key dengan Auto-increment
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Foreign Key dan ID lainnya menggunakan Integer
    account_id: int = Field(foreign_key="account.id")
    entity_id: int
    
    # Data Log
    action: str
    ip_address: str
    user_agent: str
    entity: str
    created_at: datetime = Field(default_factory=datetime.now)