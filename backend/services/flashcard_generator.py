from typing import List
from models import schemas
from models.topic import Topic

llm_model = "llama3.2:3b"

class FlashcardGenerator:
    @staticmethod
    async def generate_flashcards(text: str, topic: Topic, count: int) -> List[schemas.FlashcardCreate]:
        """заглушка для реальной реализации с AI"""
        # В реальной реализации здесь будет вызов OpenAI API
        return [
            schemas.FlashcardCreate(
                question=f"Sample question {i} about {topic.name}",
                answer=f"Sample answer {i} about {topic.name}",
                topic_id=topic.id,
                user_id=topic.user_id
            )
            for i in range(count)
        ]
