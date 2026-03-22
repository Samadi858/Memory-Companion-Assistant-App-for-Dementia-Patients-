import csv
import io
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..domain import models

COLOMBO_TZ = ZoneInfo("Asia/Colombo")


def _to_colombo(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(COLOMBO_TZ)


def _in_period(dt: datetime, period: str) -> bool:
    period_value = (period or "today").lower()
    if period_value == "all":
        return True

    local_dt = _to_colombo(dt)
    now_local = datetime.now(COLOMBO_TZ)
    today_start = now_local.replace(hour=0, minute=0, second=0, microsecond=0)

    if period_value == "today":
        start = today_start
        end = today_start + timedelta(days=1)
    elif period_value == "yesterday":
        start = today_start - timedelta(days=1)
        end = today_start
    elif period_value == "last_7_days":
        start = today_start - timedelta(days=7)
        end = today_start + timedelta(days=1)
    elif period_value == "last_30_days":
        start = today_start - timedelta(days=30)
        end = today_start + timedelta(days=1)
    else:
        return True

    return start <= local_dt < end


async def create_activity_log(
    db: AsyncSession,
    *,
    user_id: int,
    event_type: str,
    title: str,
    description: str | None = None,
    status: str = "info",
    source: str = "system",
):
    log = models.ActivityLog(
        user_id=user_id,
        event_type=event_type.strip()[:100],
        title=title.strip()[:255],
        description=(description or "").strip() or None,
        status=(status or "info").strip()[:20],
        source=(source or "system").strip()[:50],
    )
    db.add(log)
    await db.commit()
    await db.refresh(log)
    return log


async def get_activity_logs_for_user(
    db: AsyncSession,
    *,
    user_id: int,
    event_type: str = "all",
    period: str = "today",
    skip: int = 0,
    limit: int = 100,
):
    result = await db.execute(
        select(models.ActivityLog)
        .where(models.ActivityLog.user_id == user_id)
        .order_by(models.ActivityLog.created_at.desc())
        .limit(2000)
    )
    logs = result.scalars().all()

    filtered = []
    event_type_value = (event_type or "all").lower()
    for log in logs:
        if event_type_value != "all" and log.event_type.lower() != event_type_value:
            continue
        if log.created_at and not _in_period(log.created_at, period):
            continue
        filtered.append(log)

    return filtered[skip : skip + limit]


async def export_activity_logs_csv_for_user(
    db: AsyncSession,
    *,
    user_id: int,
    event_type: str = "all",
    period: str = "all",
):
    logs = await get_activity_logs_for_user(
        db,
        user_id=user_id,
        event_type=event_type,
        period=period,
        skip=0,
        limit=2000,
    )

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Event Type", "Title", "Description", "Status", "Source", "Created At"])
    for log in logs:
        writer.writerow(
            [
                log.id,
                log.event_type,
                log.title,
                log.description or "",
                log.status,
                log.source,
                _to_colombo(log.created_at).strftime("%Y-%m-%d %H:%M:%S") if log.created_at else "",
            ]
        )

    return output.getvalue(), len(logs)
