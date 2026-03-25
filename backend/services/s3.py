import boto3
import os

S3_BUCKET = os.getenv("S3_BUCKET_NAME")
assert S3_BUCKET, "S3_BUCKET_NAME environment variable is not set"

s3 = boto3.client(
    "s3",
    region_name=os.getenv("AWS_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

def upload_to_s3(file_bytes: bytes, user_id: int, filename: str) -> str:
    key = f"users/{user_id}/{filename}"
    s3.put_object(
        Bucket=S3_BUCKET,
        Key=key,
        Body=file_bytes,
        ContentType="application/pdf"
    )
    return key

def download_from_s3(key: str) -> bytes:
    response = s3.get_object(Bucket=S3_BUCKET, Key=key)
    return response["Body"].read()

def delete_from_s3(key: str) -> None:
    s3.delete_object(Bucket=S3_BUCKET, Key=key)