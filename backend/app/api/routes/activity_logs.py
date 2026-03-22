from datetime import datetime

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from ... import database
from ...core import security
from ...domain import models, schemas
from ...repositories import activity_log_repository

router = APIRouter()


@router.post("/", response_model=schemas.ActivityLogResponse, status_code=201)
async def create_activity_log(
    payload: schemas.ActivityLogCreateRequest,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    return await activity_log_repository.create_activity_log(
        db,
        user_id=current_user.id,
        event_type=payload.event_type,
        title=payload.title,
        description=payload.description,
        status=payload.status,
        source=payload.source,
    )


@router.get("/", response_model=list[schemas.ActivityLogResponse])
async def get_activity_logs(
    event_type: str = Query(default="all"),
    period: str = Query(default="today"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    return await activity_log_repository.get_activity_logs_for_user(
        db,
        user_id=current_user.id,
        event_type=event_type,
        period=period,
        skip=skip,
        limit=limit,
    )


@router.get("/export/csv")
async def export_activity_logs_csv(
    event_type: str = Query(default="all"),
    period: str = Query(default="all"),
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    csv_text, count = await activity_log_repository.export_activity_logs_csv_for_user(
        db,
        user_id=current_user.id,
        event_type=event_type,
        period=period,
    )

    filename = f"activity_logs_{current_user.id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    return StreamingResponse(
        iter([csv_text]),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={filename}",
            "X-Total-Records": str(count),
        },
    )
