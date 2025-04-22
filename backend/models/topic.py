from sqlalchemy import Column, Index, String, ForeignKey, Float
from .base import BaseModel

class Topic(BaseModel):
    __tablename__ = "topics"
    
    name = Column(String(100), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    feedback = Column(Float, nullable=True)

    __table_args__ = (
        Index("idx_topic_user", "user_id"),
    )