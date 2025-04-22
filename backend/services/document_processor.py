from fastapi import UploadFile
import pdfplumber
from typing import Tuple
import io

#should be changed
class DocumentProcessor:
    @staticmethod
    async def extract_text(file: UploadFile) -> str:
        content = await file.read()
        
        if file.content_type == "application/pdf":
            try:
                with pdfplumber.open(io.BytesIO(content)) as pdf:
                    text = "\n".join(page.extract_text() for page in pdf.pages if page.extract_text())
                    return text
            except Exception as e:
                raise ValueError(f"PDF processing error: {str(e)}")
        
        elif file.content_type == "text/plain":
            try:
                return content.decode("utf-8")
            except UnicodeDecodeError:
                raise ValueError("Could not decode text file content")
        
        raise ValueError("Unsupported file type")

    @staticmethod
    async def validate_document(file: UploadFile):
        if file.content_type not in ["application/pdf", "text/plain"]:
            raise ValueError("Invalid file type")
        
        if file.size > 10 * 1024 * 1024:  # 10MB max
            raise ValueError("File too large")