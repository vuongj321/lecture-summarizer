from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
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
async def upload_file(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="File type not allowed")
    
    contents = await file.read()

    stored_file["data"] = contents
    stored_file["name"] = file.filename

    return {
        "message": f"{stored_file["name"]} successfully uploaded!"
    }

@app.post("/ask")
async def ask_question(body: Question):
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
async def summarize():
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

    answer = response["output"]["message"]["content"][0]["text"]

    print(answer)
    
    return {"answer": answer}

@app.get("/")
async def hello():
    return {
        "message": "hello world"
    }

@app.post("/test-nova")
async def test_nova(question: Question):
    response = bedrock.invoke_model(
        modelId = "us.amazon.nova-2-lite-v1:0",
        body=json.dumps({
            "messages": [
                {
                    "role": "user",
                    "content": [{"text": question.text}]
                }
            ],
            "inferenceConfig": {"maxTokens": 200}
        })
    )

    result = json.loads(response["body"].read())

    answer = result["output"]["message"]["content"][0]["text"]
    return {"answer": answer}

