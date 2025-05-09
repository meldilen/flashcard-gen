from typing import List
import json
from models import schemas
from models.topic import Topic  
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
import re

llm_model = "llama3.1:8b"
model = ChatOllama(model=llm_model)

prompt = ChatPromptTemplate.from_template(
    """
Your task is to create flashcards from the information provided.
Each flashcard must have a question and an answer.
Your response MUST be a JSON array of flashcards like "[...]".
Do not miss any curly brackets, square brackets, quotation marks and comas!
Don't include any other text in your response.
Follow this example:
[
    {{
        "question": "What is the capital of France?",
        "answer": "Paris"
    }},
    {{
        "question": "What is the largest planet in our solar system?",
        "answer": "Jupiter"
    }}
]
Context:
{text}
Requested number of flashcards: {count}
"""
)
    
class FlashcardGenerator:
    @staticmethod
    async def generate_flashcards(text: str, topic: Topic, count: int) -> List[schemas.FlashcardCreate]:
        """
        Generate flashcards from the provided text using the LLM model.
        """
        
        formatted_input = {
            "text": text,
            "count": count
        }

        chain = (
            RunnablePassthrough()
            | prompt
            | model
            | StrOutputParser()
        )
        
        response = chain.invoke(formatted_input)
        response = re.sub(r"<think>.*?</think>\n?", "", response, flags=re.DOTALL)
        flashcards_data = json.loads(response)
        
        flashcards = [
            schemas.FlashcardCreate(
                question=flashcard["question"],
                answer=flashcard["answer"],
                topic_id=topic.id,
                user_id=topic.user_id
            ) for flashcard in flashcards_data
        ]
    
        return flashcards