from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlalchemy.orm import Session
from typing import Optional
import logging

from db.database import get_db, init_db
from db import crud
from models import schemas
from services.document_processor import DocumentProcessor
from services.flashcard_generator import FlashcardGenerator

init_db()

app = FastAPI(docs_url="/docs", redoc_url="/redoc")
logger = logging.getLogger(__name__)
security = HTTPBasic()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def convert_to_user_response(db_user):
    return schemas.UserResponse(
        id=db_user.id,
        username=db_user.username,
        email=db_user.email
    )


async def get_current_user(
    credentials: HTTPBasicCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> schemas.UserResponse:
    user = crud.get_user_by_email(db, credentials.username)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="Email not found",
            headers={"WWW-Authenticate": "Basic"},
        )
    if not user.verify_password(credentials.password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return convert_to_user_response(user)


@app.post("/register/", response_model=schemas.UserResponse)
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user_data.email):
        raise HTTPException(
            status_code=404,
            detail="Email already registered"
        )
    db_user = crud.create_user(db, user_data)
    return convert_to_user_response(db_user)


@app.get("/login", response_model=schemas.UserResponse)
def login(current_user: schemas.UserResponse = Depends(get_current_user)):
    return current_user


@app.get("/users/me", response_model=schemas.UserResponse)
def read_current_user(current_user: schemas.UserResponse = Depends(get_current_user)):
    return current_user


@app.patch("/users/me", response_model=schemas.UserResponse)
def update_current_user(
    user_data: schemas.UserUpdate,
    current_user: schemas.UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated_user = crud.update_user(db, current_user.id, user_data)
    if not updated_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    return convert_to_user_response(updated_user)


@app.post("/process-document/")
async def process_document(
    file: UploadFile = File(...),
    topic_name: str = Form(...),
    card_count: int = Form(5, gt=1, le=15),
    current_user: schemas.UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        await DocumentProcessor.validate_document(file)

        text = await DocumentProcessor.extract_text(file)
        logger.info(f"Extracted text from document (length: {len(text)})")

        if file.content_type not in ["application/pdf", "text/plain"]:
            raise HTTPException(
                status_code=404,
                detail="Invalid file type"
            )

        topic = schemas.TopicCreate(name=topic_name, user_id=current_user.id)
        db_topic = crud.create_topic(db, topic)
        flashcards = await FlashcardGenerator.generate_flashcards(text, db_topic, card_count)

        flashcards = crud.create_flashcards(db, flashcards)

        return JSONResponse(
            content={
                "message": "Flashcards generated successfully",
                "topic_id": db_topic.id,
                "flashcards": [schemas.Flashcard.model_validate(f).model_dump() for f in flashcards]
            },
            status_code=200
        )

    except ValueError as e:
        logger.warning(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Processing error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )


@app.get("/flashcards/", response_model=list[schemas.Flashcard])
def get_flashcards(
    topic_id: Optional[str] = None,
    current_user: schemas.UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        flashcards = crud.get_topic_flashcards(db, current_user.id, topic_id)
        return flashcards
    except Exception as e:
        logger.error(f"Get flashcards error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )


@app.get("/topics/", response_model=list[schemas.Topic])
def get_user_topics(
    current_user: schemas.UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.get_user_topics(db, current_user.id)

@app.delete("/topics/{topic_id}")
def delete_topic(
    topic_id: str,
    current_user: schemas.UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    topic = crud.get_topic(db, topic_id)
    if not topic or topic.user_id != current_user.id:
        raise HTTPException(
            status_code=404,
            detail="Topic not found"
        )
    
    crud.delete_flashcards_by_topic(db, topic_id)
    crud.delete_topic(db, topic_id)
    return {"message": "Topic and associated flashcards deleted successfully"}


@app.patch("/topics/{topic_id}/feedback", response_model=schemas.Topic)
def update_topic_feedback(
    topic_id: str,
    feedback: float,
    current_user: schemas.UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    topic = crud.get_topic(db, topic_id)
    if not topic or topic.user_id != current_user.id:
        raise HTTPException(
            status_code=404,
            detail="Topic not found"
        )
    
    updated_topic = crud.update_topic_feedback(db, topic_id, feedback)
    if not updated_topic:
        raise HTTPException(
            status_code=404,
            detail="Topic not found"
        )
    return updated_topic


@app.get("/topics/{topic_id}/")
def get_topic_flashcards(
    topic_id: str,
    user_id: str,
    db: Session = Depends(get_db)
):
    try:
        flashcards = crud.get_topic_flashcards(db, user_id, topic_id)
        if not flashcards:
            raise HTTPException(status_code=404, detail="No flashcards found for this topic")
        return [schemas.Flashcard.model_validate(f).model_dump() for f in flashcards]
    except Exception as e:
        logger.error(f"Get topic flashcards error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/")
def read_root():
    return {"message": "Flashcard Generator API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
