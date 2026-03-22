from io import BytesIO
from uuid import uuid4

from minio import Minio
from minio.error import S3Error

from . import config


def _client() -> Minio:
    return Minio(
        config.MINIO_ENDPOINT,
        access_key=config.MINIO_ACCESS_KEY,
        secret_key=config.MINIO_SECRET_KEY,
        secure=config.MINIO_SECURE,
    )


def ensure_bucket_exists() -> None:
    client = _client()
    if not client.bucket_exists(config.MINIO_BUCKET_NAME):
        client.make_bucket(config.MINIO_BUCKET_NAME)


def upload_memory_image(file_bytes: bytes, filename: str, content_type: str | None) -> str:
    ext = ""
    if "." in filename:
        ext = filename[filename.rfind("."):]

    object_name = f"memories/{uuid4().hex}{ext}"
    data = BytesIO(file_bytes)
    data.seek(0)

    client = _client()
    client.put_object(
        bucket_name=config.MINIO_BUCKET_NAME,
        object_name=object_name,
        data=data,
        length=len(file_bytes),
        content_type=content_type or "application/octet-stream",
    )
    return object_name


def get_memory_image(object_name: str):
    client = _client()
    try:
        return client.get_object(config.MINIO_BUCKET_NAME, object_name)
    except S3Error as exc:
        raise FileNotFoundError(str(exc)) from exc


def remove_memory_image(object_name: str) -> None:
    client = _client()
    try:
        client.remove_object(config.MINIO_BUCKET_NAME, object_name)
    except S3Error:
        # Keep DB delete resilient even if object was already gone.
        return
