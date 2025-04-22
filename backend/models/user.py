from sqlalchemy import Column, String
from .base import BaseModel


class User(BaseModel):
    __tablename__ = "users"

    username = Column(String(50), unique=True)
    # email = Column(String(100), unique=True, nullable=True)
    # hashed_password = Column(String(255), nullable=True)
