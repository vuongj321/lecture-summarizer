import boto3, os

aws_key = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret = os.getenv("AWS_SECRET_ACCESS_KEY")
aws_region = os.getenv("AWS_REGION")

bedrock = boto3.client(
    "bedrock-runtime",
    region_name = aws_region,
    aws_access_key_id = aws_key,
    aws_secret_access_key = aws_secret
)

def ask_nova(file_bytes: bytes, question: str) -> str:
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
                            "source": {"bytes": file_bytes}
                        }
                    },
                    {"text": question}
                ]
            }
        ],
        inferenceConfig={"maxTokens": 1000, "temperature": 0.3}
    )

    return response["output"]["message"]["content"][0]["text"]

def summarize_nova(file_bytes: bytes) -> str:
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
                            "source": {"bytes": file_bytes}
                        }
                    },
                    {"text": "Summarize this document in sections and bullet points"}
                ]
            }
        ],
        inferenceConfig={"maxTokens": 1000, "temperature": 0.3}
    )
    return response["output"]["message"]["content"][0]["text"]