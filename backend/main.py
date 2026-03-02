from fastapi import FastAPI, HTTPException, UploadFile, File, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from pydantic import BaseModel
import boto3

from dotenv import load_dotenv
import os

import json
import base64

load_dotenv()

aws_key = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret = os.getenv("AWS_SECRET_ACCESS_KEY")
aws_region = os.getenv("AWS_REGION")

api_key_header = APIKeyHeader(name="X-API-Key")

def verify_key(key: str = Security(api_key_header)):
    if key != os.getenv("APP_API_KEY"):
        raise HTTPException(status_code=403, detail="Unauthorized")

ALLOWED_TYPES = ["application/pdf"]

stored_file = {}

bedrock = boto3.client(
    "bedrock-runtime",
    region_name = aws_region,
    aws_access_key_id = aws_key,
    aws_secret_access_key = aws_secret
)

class Question(BaseModel):
    text: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app's address
    allow_methods=["*"],   # allow GET, POST, etc.
    allow_headers=["*"],   # allow all headers
)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), key: str = Security(api_key_header)):
    verify_key(key)
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="File type not allowed")
    
    contents = await file.read()

    stored_file["data"] = contents
    stored_file["name"] = file.filename

    return {
        "message": f"{stored_file['name']} successfully uploaded!"
    }

@app.post("/ask")
async def ask_question(body: Question, key: str = Security(api_key_header)):
    verify_key(key)
    if not stored_file:
        raise HTTPException(status_code=400, detail="No file uploaded yet")

    response = bedrock.converse(
        modelId="us.amazon.nova-2-lite-v1:0",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "document": {
                            "format": "pdf",
                            "name": "lecture-notes",
                            "source": {"bytes": stored_file["data"]}
                        }
                    },
                    {"text": body.text}
                ]
            }
        ],
        inferenceConfig={"maxTokens": 1000, "temperature": 0.3}
    )

    answer = response["output"]["message"]["content"][0]["text"]
    return {"answer": answer}

@app.post("/summarize")
async def summarize(key: str = Security(api_key_header)):
    verify_key(key)
    if not stored_file:
        raise HTTPException(status_code=400, detail="No file uploaded yet")
    
    response = bedrock.converse(
        modelId="us.amazon.nova-2-lite-v1:0",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "document": {
                            "format": "pdf",
                            "name": "lecture-notes",
                            "source": {"bytes": stored_file["data"]}
                        }
                    },
                    {"text": "Summarize this document in sections and bullet points"}
                ]
            }
        ],
        inferenceConfig={"maxTokens": 1000, "temperature": 0.3}
    )

    summary = response["output"]["message"]["content"][0]["text"]
    
    return {"summary": summary}