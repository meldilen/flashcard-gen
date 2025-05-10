from sqlalchemy.orm import Session

from models import schemas
from models.flashcard import Flashcard
from models.topic import Topic
from models.user import User


def create_user(db: Session, user_data: schemas.UserCreate):
    db_user = User(
        id=user_data.id, 
        username=user_data.username)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_topic(db: Session, topic_data: schemas.TopicCreate):
    db_topic = Topic(
        id=topic_data.id,
        name=topic_data.name,
        user_id=topic_data.user_id)
    db.add(db_topic)
    db.commit()
    db.refresh(db_topic)
    return db_topic


def create_flashcards(db: Session, flashcards_data: list):
    db_flashcards = [
        Flashcard(
            id=f.id,
            question=f.question,
            answer=f.answer,
            topic_id=f.topic_id,
            user_id=f.user_id
        ) for f in flashcards_data
    ]
    db.add_all(db_flashcards)
    db.commit()
    return db_flashcards


def get_user_flashcards(db: Session, user_id: str, topic_id: str = None):
    query = db.query(Flashcard).filter(Flashcard.user_id == user_id)
    if topic_id:
        query = query.filter(Flashcard.topic_id == topic_id)
    return query.all()


def get_topic(db: Session, topic_id: str):
    return db.query(Topic).filter(Topic.id == topic_id).first()


def get_topic_flashcards(db: Session, user_id: str, topic_id: str = None):
    query = db.query(Flashcard).filter(Flashcard.user_id == user_id)
    if topic_id:
        query = query.filter(Flashcard.topic_id == topic_id)
    return query.all()


def update_topic_feedback(db: Session, topic_id: str, feedback: float):
    db_topic = get_topic(db, topic_id)
    if not db_topic:
        return None

    db_topic.feedback = feedback
    db.commit()
    db.refresh(db_topic)
    return db_topic
