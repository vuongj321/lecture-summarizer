from pydantic import BaseModel

class Question(BaseModel):
    text: str
    document_id: int

class SummarizeRequest(BaseModel):
    document_id: int