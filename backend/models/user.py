from sqlalchemy import Column, String, Boolean
from .base import BaseModel
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(BaseModel):
    __tablename__ = "users"

    username = Column(String(50), unique=True)
    email = Column(String(100), unique=True)
    hashed_password = Column(String(255))
    optOutCommunications = Column(Boolean(), default=False)

    def verify_password(self, password: str):
        return pwd_context.verify(password, self.hashed_password)
