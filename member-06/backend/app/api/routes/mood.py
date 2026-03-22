from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ... import database
from ...domain import schemas
from ...repositories import activity_log_repository, mood_repository, patient_repository

router = APIRouter()


@router.post("/entries", response_model=schemas.MoodEntryResponse, status_code=201)
async def create_mood_entry(
    payload: schemas.MoodEntryCreateRequest,
    db: AsyncSession = Depends(database.get_db),
):
    if not payload.mood or not payload.mood.strip():
        raise HTTPException(status_code=400, detail="Mood is required")

    patient = await patient_repository.get_patient_user(db, user_id=payload.user_id)
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    entry = await mood_repository.create_mood_entry(db, patient.id, payload.mood, payload.note)
    try:
        await activity_log_repository.create_activity_log(
            db,
            user_id=patient.id,
            event_type="mood_logged",
            title="Mood diary updated",
            description=f"Mood: {entry.mood}" + (f" | Note: {entry.note}" if entry.note else ""),
            status="info",
            source="mood",
        )
    except Exception:
        pass
    return entry


@router.get("/entries", response_model=List[schemas.MoodEntryResponse])
async def get_mood_entries(
    user_id: Optional[int] = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    db: AsyncSession = Depends(database.get_db),
):
    patient = await patient_repository.get_patient_user(db, user_id=user_id)
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    return await mood_repository.get_mood_history(db, patient.id, skip=skip, limit=limit)
