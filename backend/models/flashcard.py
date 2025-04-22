from sqlalchemy import Column, Index, Text, Float, ForeignKey, String
from .base import BaseModel

class Flashcard(BaseModel):
    __tablename__ = "flashcards"
    
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    confidence = Column(Float, default=0.9)
    topic_id = Column(String, ForeignKey("topics.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)

    __table_args__ = (
        Index("idx_flashcard_topic", "topic_id"),
        Index("idx_flashcard_user", "user_id"),
    )