import uuid
from pydantic import BaseModel, Field
from typing import List, Optional

class TopicBase(BaseModel):
    name: str

class TopicCreate(TopicBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str

class Topic(TopicBase):
    id: str
    user_id: str
    feedback: Optional[float]
    
    class Config:
        from_attributes = True

class FlashcardBase(BaseModel):
    question: str
    answer: str
    topic_id: str

class FlashcardCreate(FlashcardBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id:str

class Flashcard(FlashcardBase):
    id: str
    user_id: str
    confidence: float = 0.9
    
    class Config:
        from_attributes = True

class DocumentProcessRequest(BaseModel):
    card_count: int = 5

class UserCreate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str