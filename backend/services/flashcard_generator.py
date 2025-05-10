from typing import List
import json
from models import schemas
from models.topic import Topic  
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.vectorstores import InMemoryVectorStore
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from langchain_text_splitters import RecursiveCharacterTextSplitter
import re

llm_model_name = "llama3.1:8b"
embeddings_model_name = "mxbai-embed-large"

llm_model = ChatOllama(model=llm_model_name)
embeddings_model = OllamaEmbeddings(model=embeddings_model_name)

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=768,
    chunk_overlap=128,
)

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

        docs = text_splitter.split_text(text)
        vector_store = InMemoryVectorStore.from_texts(
            docs,
            embeddings_model
        )
        retriever = vector_store.as_retriever(search_kwargs={"k": count})
        context = '\n'.join(x.page_content for x in retriever.invoke(topic.name))
        
        formatted_input = {
            "text": context,
            "count": count
        }

        chain = (
            RunnablePassthrough()
            | prompt
            | llm_model
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