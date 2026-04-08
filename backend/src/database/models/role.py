from datetime import datetime
from sqlmodel import Field, SQLModel

class Role(SQLModel, table = True):
    __table_name__ = "roles"
    __table_args__={"extend_existing": True}
    id: int= Field(default= None, primary_key=True)
    name : str = Field(max_length = 255)