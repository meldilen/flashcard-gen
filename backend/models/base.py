from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String
import uuid

Base = declarative_base()


def generate_uuid():
    return str(uuid.uuid4())


class BaseModel(Base):
    __abstract__ = True

    id = Column(String, primary_key=True, default=generate_uuid)
