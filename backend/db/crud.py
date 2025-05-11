from sqlalchemy.orm import Session
from models import schemas
from models.flashcard import Flashcard
from models.topic import Topic
from models.user import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_user(db: Session, user_data: schemas.UserCreate):
    hashed_password = pwd_context.hash(user_data.password)
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        opt_out_communications=False)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user(db: Session, user_id: str):
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def update_user(db: Session, user_id: str, user_data: schemas.UserUpdate):
    db_user = db.query(User).filter(User.id == user_id).first()
    if user_data.username:
        db_user.username = user_data.username
    if user_data.email:
        db_user.email = user_data.email
    if user_data.password:
        db_user.hashed_password = pwd_context.hash(user_data.password)
    if user_data.opt_out_communications is not None:
        db_user.opt_out_communications = user_data.opt_out_communications
    db.commit()
    db.refresh(db_user)
    return db_user


def create_topic(db: Session, topic_data: schemas.TopicCreate):
    db_topic = Topic(
        id=topic_data.id,
        name=topic_data.name,
        user_id=topic_data.user_id,
        feedback=None)
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


def get_user_topics(db: Session, user_id: str):
    return db.query(Topic)\
             .filter(Topic.user_id == user_id)\
             .all()


def delete_topic(db: Session, topic_id: str):
    db_topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not db_topic:
        return None

    db.delete(db_topic)
    db.commit()
    return True


def get_topic_flashcards(db: Session, user_id: str, topic_id: str = None):
    query = db.query(Flashcard).filter(Flashcard.user_id == user_id)
    if topic_id:
        query = query.filter(Flashcard.topic_id == topic_id)
    return query.all()


def get_topic(db: Session, topic_id: str):
    return db.query(Topic).filter(Topic.id == topic_id).first()


def delete_flashcards_by_topic(db: Session, topic_id: str):
    db.query(Flashcard).filter(Flashcard.topic_id == topic_id).delete()
    db.commit()
    return True


def update_topic_feedback(db: Session, topic_id: str, feedback: float):
    db_topic = get_topic(db, topic_id)
    if not db_topic:
        return None

    db_topic.feedback = feedback
    db.commit()
    db.refresh(db_topic)
    return db_topic
