from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Optional
import logging

from db.database import get_db, init_db
from db import crud
from models import schemas
from services.document_processor import DocumentProcessor
from services.flashcard_generator import FlashcardGenerator

init_db()

app = FastAPI()
logger = logging.getLogger(__name__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/process-document/")
async def process_document(
    file: UploadFile = File(...),
    topic_name: str = Form(...),
    card_count: int = Form(5, gt=1, le=15),
    user_id: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        await DocumentProcessor.validate_document(file)

        text = await DocumentProcessor.extract_text(file)
        logger.info(f"Extracted text from document (length: {len(text)})")

        if file.content_type not in ["application/pdf", "text/plain"]:
            raise HTTPException(status_code=400, detail="Invalid file type")
        
        topic = schemas.TopicCreate(name=topic_name, user_id=user_id)
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
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Processing error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/users/")
def create_user(username: str, db: Session = Depends(get_db)):
    try:
        db_user = crud.create_user(db, username)
        return JSONResponse(
            content={"id": db_user.id, "username": db_user.username},
            status_code=201
        )
    except Exception as e:
        db.rollback()
        logger.error(f"User creation error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/flashcards/")
def get_flashcards(
    user_id: str,
    topic_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    try:
        flashcards = crud.get_user_flashcards(db, user_id, topic_id)
        return [schemas.Flashcard.model_validate(f).model_dump() for f in flashcards]
    except Exception as e:
        logger.error(f"Get flashcards error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")


@app.patch("/topics/{topic_id}/feedback")
def update_topic_feedback(
    topic_id: str,
    feedback: float,
    db: Session = Depends(get_db)
):
    try:
        updated_topic = crud.update_topic_feedback(db, topic_id, feedback)
        if not updated_topic:
            raise HTTPException(status_code=404, detail="Topic not found")

        return JSONResponse(
            content={
                "message": "Feedback updated successfully",
                "topic_id": updated_topic.id,
                "new_feedback": updated_topic.feedback
            },
            status_code=200
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        db.rollback()
        logger.error(f"Feedback update error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/")
def read_root():
    return {"message": "Flashcard Generator API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
