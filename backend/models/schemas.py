import uuid
from pydantic import BaseModel, Field, EmailStr
from typing import Optional

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

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    opt_out_communications: Optional[bool] = Field(
        None,
        alias="optOutCommunications",
        validation_alias="optOutCommunications"
    )

class UserResponse(UserBase):
    id: str
    opt_out_communications: bool = False
        
    class Config:
        from_attributes = True