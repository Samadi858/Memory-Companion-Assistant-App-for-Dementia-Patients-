from datetime import datetime, timedelta

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..domain import models


def _is_due_today(frequency: str | None, weekday: int) -> bool:
    if not frequency:
        return True

    value = frequency.lower()
    if value == "daily":
        return True
    if value == "weekdays":
        return weekday < 5
    if value == "weekends":
        return weekday >= 5
    return True


async def enqueue_due_alerts(db: AsyncSession, now: datetime) -> None:
    window_start = now - timedelta(minutes=1)
    current_date = now.strftime("%Y-%m-%d")
    weekday = now.weekday()

    result = await db.execute(
        select(models.Reminder).where(
            models.Reminder.enabled == 1,
            models.Reminder.status != "deleted",
            models.Reminder.user_id.is_not(None),
        )
    )
    reminders = result.scalars().all()

    for reminder in reminders:
        if not _is_due_today(reminder.frequency, weekday):
            continue
        if not _is_due_in_window(reminder.time, window_start, now):
            continue

        existing_result = await db.execute(
            select(models.AlertEvent).where(
                models.AlertEvent.reminder_id == reminder.id,
                models.AlertEvent.user_id == reminder.user_id,
                models.AlertEvent.scheduled_date == current_date,
            )
        )
        existing_event = existing_result.scalars().first()
        if existing_event is not None:
            continue

        db.add(
            models.AlertEvent(
                user_id=reminder.user_id,
                reminder_id=reminder.id,
                scheduled_date=current_date,
                status="pending",
            )
        )

    await db.commit()


def _parse_reminder_time(value: str | None):
    if not value:
        return None

    raw = value.strip()
    for fmt in ("%H:%M", "%H.%M", "%I:%M %p"):
        try:
            return datetime.strptime(raw, fmt).time()
        except ValueError:
            continue
    return None


def _is_due_in_window(reminder_time_raw: str | None, start: datetime, end: datetime) -> bool:
    reminder_time = _parse_reminder_time(reminder_time_raw)
    if reminder_time is None:
        return False

    reminder_minutes = reminder_time.hour * 60 + reminder_time.minute
    start_minutes = start.hour * 60 + start.minute
    end_minutes = end.hour * 60 + end.minute

    if start_minutes <= end_minutes:
        return start_minutes <= reminder_minutes <= end_minutes

    # midnight wrap
    return reminder_minutes >= start_minutes or reminder_minutes <= end_minutes


async def get_active_alert_for_user(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(models.AlertEvent, models.Reminder)
        .join(models.Reminder, models.Reminder.id == models.AlertEvent.reminder_id)
        .where(
            and_(
                models.AlertEvent.user_id == user_id,
                models.AlertEvent.status == "pending",
                models.Reminder.status != "deleted",
                models.Reminder.enabled == 1,
            )
        )
        .order_by(models.AlertEvent.triggered_at.asc(), models.AlertEvent.id.asc())
    )
    return result.first()


async def mark_alert_done(db: AsyncSession, alert_id: int, user_id: int) -> int | None:
    result = await db.execute(
        select(models.AlertEvent).where(
            models.AlertEvent.id == alert_id,
            models.AlertEvent.user_id == user_id,
            models.AlertEvent.status == "pending",
        )
    )
    alert_event = result.scalars().first()
    if alert_event is None:
        return None

    alert_event.status = "done"
    alert_event.cleared_at = datetime.utcnow()
    reminder_id = alert_event.reminder_id
    await db.commit()
    return reminder_id
