from pydantic import BaseModel, Field

class Question(BaseModel):
    text: str = Field(min_length=1, max_length=2000)
    document_id: int = Field(gt=0)

class SummarizeRequest(BaseModel):
    document_id: int = Field(gt=0)