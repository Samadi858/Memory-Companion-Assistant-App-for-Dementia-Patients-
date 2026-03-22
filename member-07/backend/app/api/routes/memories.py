from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from ... import database
from ...core import security, storage
from ...domain import models, schemas
from ...repositories import activity_log_repository, patient_repository, photo_memory_repository

router = APIRouter()


def _legacy_to_structured(description: str) -> tuple[str, str, str | None]:
    parts = [part.strip() for part in description.split("||")]
    if len(parts) >= 2 and parts[0] and parts[1]:
        note = " || ".join(parts[2:]).strip() or None
        return parts[0], parts[1], note
    value = description.strip()
    return value or "Unknown", "Loved One", None


def _to_response(memory: models.PhotoMemory) -> schemas.PhotoMemoryResponse:
    fallback_name, fallback_relationship, fallback_note = _legacy_to_structured(memory.description or "")
    return schemas.PhotoMemoryResponse(
        id=memory.id,
        user_id=memory.user_id,
        name=(memory.name or fallback_name),
        relationship=(memory.relationship or fallback_relationship),
        phone_number=memory.phone_number,
        display_color=memory.display_color,
        notes=memory.notes or fallback_note,
        description=memory.description,
        image_url=(f"/memories/{memory.id}/image" if memory.object_name else None),
        created_at=memory.created_at,
    )


@router.post("/", response_model=schemas.PhotoMemoryCreateResponse)
async def upload_memory(
    name: str | None = Form(default=None),
    relationship: str | None = Form(default=None),
    phone_number: str | None = Form(default=None),
    display_color: str | None = Form(default=None),
    notes: str | None = Form(default=None),
    description: str | None = Form(default=None),
    image: UploadFile | None = File(default=None),
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    raw_description = (description or "").strip()
    raw_name = (name or "").strip()
    raw_relationship = (relationship or "").strip()
    raw_notes = (notes or "").strip()

    if not raw_name or not raw_relationship:
        if raw_description:
            parsed_name, parsed_relationship, parsed_note = _legacy_to_structured(raw_description)
            if not raw_name:
                raw_name = parsed_name
            if not raw_relationship:
                raw_relationship = parsed_relationship
            if not raw_notes and parsed_note:
                raw_notes = parsed_note

    if not raw_name:
        raise HTTPException(status_code=400, detail="Name is required")
    if not raw_relationship:
        raise HTTPException(status_code=400, detail="Relationship is required")

    stored_description = raw_description or f"{raw_name}||{raw_relationship}||{raw_notes}".rstrip("|")
    object_name: str | None = None
    content_type: str | None = None
    if image is not None:
        raw = await image.read()
        if not raw:
            raise HTTPException(status_code=400, detail="Image file is empty")
        object_name = storage.upload_memory_image(raw, image.filename or "upload.jpg", image.content_type)
        content_type = image.content_type or "application/octet-stream"

    memory = await photo_memory_repository.create_memory(
        db,
        user_id=current_user.id,
        name=raw_name,
        relationship=raw_relationship,
        phone_number=(phone_number or "").strip() or None,
        display_color=(display_color or "").strip() or None,
        notes=raw_notes or None,
        description=stored_description,
        object_name=object_name,
        content_type=content_type,
    )
    try:
        await activity_log_repository.create_activity_log(
            db,
            user_id=current_user.id,
            event_type="memory_uploaded",
            title="Photo memory uploaded",
            description=f"{memory.name or raw_name} ({memory.relationship or raw_relationship})",
            status="completed",
            source="memories",
        )
    except Exception:
        pass

    return schemas.PhotoMemoryCreateResponse(
        id=memory.id,
        name=memory.name or raw_name,
        relationship=memory.relationship or raw_relationship,
        phone_number=memory.phone_number,
        display_color=memory.display_color,
        notes=memory.notes,
        description=memory.description,
        image_url=(f"/memories/{memory.id}/image" if memory.object_name else None),
        created_at=memory.created_at,
    )


@router.get("/mine", response_model=list[schemas.PhotoMemoryResponse])
async def list_my_memories(
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    memories = await photo_memory_repository.list_memories_for_user(db, current_user.id)
    return [_to_response(m) for m in memories]


@router.get("/timeline", response_model=list[schemas.PhotoMemoryResponse])
async def list_timeline_memories(
    user_id: int | None = Query(default=None),
    db: AsyncSession = Depends(database.get_db),
):
    patient = await patient_repository.get_patient_user(db, user_id=user_id)
    if patient is None:
        return []

    memories = await photo_memory_repository.list_memories_for_user(db, patient.id)
    return [_to_response(m) for m in memories]


@router.patch("/{memory_id}", response_model=schemas.PhotoMemoryResponse)
async def update_memory_description(
    memory_id: int,
    payload: schemas.PhotoMemoryUpdateRequest,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    memory = await photo_memory_repository.get_memory_for_user(db, memory_id, current_user.id)
    if memory is None:
        raise HTTPException(status_code=404, detail="Memory not found")

    updates: dict[str, str | None] = {}
    if payload.name is not None:
        updates["name"] = payload.name.strip()
    if payload.relationship is not None:
        updates["relationship"] = payload.relationship.strip()
    if payload.phone_number is not None:
        updates["phone_number"] = payload.phone_number.strip() or None
    if payload.display_color is not None:
        updates["display_color"] = payload.display_color.strip() or None
    if payload.notes is not None:
        updates["notes"] = payload.notes.strip() or None
    if payload.description is not None:
        updates["description"] = payload.description.strip()

    next_name = updates.get("name", memory.name or "").strip()
    next_relationship = updates.get("relationship", memory.relationship or "").strip()
    next_notes = (updates.get("notes", memory.notes) or "").strip()

    if not next_name or not next_relationship:
        fallback_name, fallback_relationship, fallback_note = _legacy_to_structured(memory.description or "")
        if not next_name:
            next_name = fallback_name
            updates["name"] = fallback_name
        if not next_relationship:
            next_relationship = fallback_relationship
            updates["relationship"] = fallback_relationship
        if not next_notes and fallback_note:
            updates["notes"] = fallback_note
            next_notes = fallback_note

    if not next_name:
        raise HTTPException(status_code=400, detail="Name is required")
    if not next_relationship:
        raise HTTPException(status_code=400, detail="Relationship is required")

    if "description" not in updates:
        updates["description"] = f"{next_name}||{next_relationship}||{next_notes}".rstrip("|")

    updated = await photo_memory_repository.update_memory_details(
        db,
        memory,
        name=updates.get("name"),
        relationship=updates.get("relationship"),
        phone_number=updates.get("phone_number"),
        display_color=updates.get("display_color"),
        notes=updates.get("notes"),
        description=updates.get("description"),
    )
    try:
        await activity_log_repository.create_activity_log(
            db,
            user_id=current_user.id,
            event_type="memory_updated",
            title="Photo memory updated",
            description=f"{updated.name or next_name} ({updated.relationship or next_relationship})",
            status="completed",
            source="memories",
        )
    except Exception:
        pass
    return _to_response(updated)


@router.delete("/{memory_id}")
async def delete_memory(
    memory_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    memory = await photo_memory_repository.get_memory_for_user(db, memory_id, current_user.id)
    if memory is None:
        raise HTTPException(status_code=404, detail="Memory not found")

    deleted_description = memory.description
    if memory.object_name:
        storage.remove_memory_image(memory.object_name)
    await photo_memory_repository.delete_memory(db, memory)
    try:
        await activity_log_repository.create_activity_log(
            db,
            user_id=current_user.id,
            event_type="memory_deleted",
            title="Photo memory deleted",
            description=deleted_description,
            status="completed",
            source="memories",
        )
    except Exception:
        pass
    return {"message": "Memory deleted", "success": True}


@router.get("/{memory_id}/image")
async def get_memory_image(memory_id: int, db: AsyncSession = Depends(database.get_db)):
    memory = await photo_memory_repository.get_memory_by_id(db, memory_id)
    if memory is None or not memory.object_name:
        raise HTTPException(status_code=404, detail="Memory image not found")

    try:
        image_stream = storage.get_memory_image(memory.object_name)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Memory image not found")

    def iter_file():
        try:
            while True:
                chunk = image_stream.read(1024 * 1024)
                if not chunk:
                    break
                yield chunk
        finally:
            image_stream.close()
            image_stream.release_conn()

    return StreamingResponse(iter_file(), media_type=memory.content_type)
