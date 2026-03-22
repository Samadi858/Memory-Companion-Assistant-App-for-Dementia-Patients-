from collections import defaultdict
from datetime import date, datetime, time, timedelta

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..domain import models, schemas

MEDICATION_KEYWORDS = ("medic", "medicine", "medication", "pill", "tablet", "dose")
CALL_KEYWORDS = ("call", "emergency", "sos")


def _is_medication(event_type: str) -> bool:
    value = (event_type or "").lower()
    return any(keyword in value for keyword in MEDICATION_KEYWORDS)


def _is_call(event_type: str) -> bool:
    value = (event_type or "").lower()
    return any(keyword in value for keyword in CALL_KEYWORDS)


def _is_due_on_day(frequency: str | None, weekday: int) -> bool:
    value = (frequency or "daily").lower()
    if value == "daily":
        return True
    if value == "weekdays":
        return weekday < 5
    if value == "weekends":
        return weekday >= 5
    return True


async def build_report(db: AsyncSession, *, user_id: int, days: int) -> schemas.FullReportResponse:
    today = date.today()
    start_date = today - timedelta(days=max(days - 1, 0))
    since_dt = datetime.combine(start_date, time.min)

    activities_result = await db.execute(
        select(models.ActivityLog)
        .where(
            and_(
                models.ActivityLog.user_id == user_id,
                models.ActivityLog.created_at >= since_dt,
            )
        )
        .order_by(models.ActivityLog.created_at.asc())
    )
    activities = activities_result.scalars().all()

    mood_result = await db.execute(
        select(models.MoodEntry).where(
            and_(
                models.MoodEntry.user_id == user_id,
                models.MoodEntry.created_at >= since_dt,
            )
        )
    )
    moods = mood_result.scalars().all()

    completed_result = await db.execute(
        select(models.ReminderCompletion).join(
            models.Reminder, models.Reminder.id == models.ReminderCompletion.reminder_id
        ).where(
            and_(
                models.ReminderCompletion.user_id == user_id,
                models.ReminderCompletion.completed_date >= start_date,
                models.ReminderCompletion.completed_date <= today,
                models.Reminder.type == "medication",
            )
        )
    )
    medication_taken = len(completed_result.scalars().all())

    medication_reminders_result = await db.execute(
        select(models.Reminder).where(
            and_(
                models.Reminder.user_id == user_id,
                models.Reminder.status != "deleted",
                models.Reminder.enabled == 1,
                models.Reminder.type == "medication",
            )
        )
    )
    medication_reminders = medication_reminders_result.scalars().all()

    expected = 0
    cursor = start_date
    while cursor <= today:
        weekday = cursor.weekday()
        for reminder in medication_reminders:
            if _is_due_on_day(reminder.frequency, weekday):
                expected += 1
        cursor += timedelta(days=1)

    total_activities = len(activities)
    medication_count = sum(1 for item in activities if _is_medication(item.event_type))
    call_count = sum(1 for item in activities if _is_call(item.event_type))
    mood_count = len(moods)
    avg_per_day = round(total_activities / max(days, 1), 1)

    breakdown_counts: dict[str, int] = defaultdict(int)
    for item in activities:
        key = (item.event_type or "Unknown").replace("_", " ").title()
        breakdown_counts[key] += 1
    activity_breakdown = [
        schemas.ActivityBreakdownItem(name=name, value=value)
        for name, value in sorted(breakdown_counts.items(), key=lambda x: -x[1])
    ]

    daily_counts: dict[str, int] = defaultdict(int)
    for item in activities:
        daily_counts[item.created_at.strftime("%Y-%m-%d")] += 1
    daily_trend: list[schemas.DailyTrendItem] = []
    cursor = start_date
    while cursor <= today:
        key = cursor.strftime("%Y-%m-%d")
        daily_trend.append(schemas.DailyTrendItem(date=key, activities=daily_counts.get(key, 0)))
        cursor += timedelta(days=1)
    daily_trend = daily_trend[-31:]

    mood_counts: dict[str, int] = defaultdict(int)
    for mood in moods:
        mood_key = (mood.mood or "Unknown").strip().title()
        mood_counts[mood_key] += 1
    mood_distribution = [
        schemas.MoodDistributionItem(mood=name, count=count)
        for name, count in sorted(mood_counts.items(), key=lambda x: -x[1])
    ]

    hourly_counts: dict[int, int] = defaultdict(int)
    for item in activities:
        hourly_counts[item.created_at.hour] += 1
    hourly_pattern = [
        schemas.HourlyPatternItem(hour=f"{hour:02d}:00", activities=hourly_counts.get(hour, 0))
        for hour in range(24)
    ]

    adherence_rate = round((medication_taken / expected * 100), 1) if expected > 0 else 0.0
    medication_stats = schemas.MedicationStats(
        taken=medication_taken,
        expected=expected,
        rate=str(adherence_rate),
    )

    insights: list[schemas.InsightItem] = []
    if adherence_rate >= 90:
        insights.append(
            schemas.InsightItem(
                type="positive",
                message=f"Excellent medication adherence at {adherence_rate}%.",
            )
        )
    elif expected > 0 and adherence_rate < 70:
        insights.append(
            schemas.InsightItem(
                type="warning",
                message=f"Low medication adherence at {adherence_rate}%. Review schedule barriers.",
            )
        )

    if total_activities < days * 2:
        insights.append(
            schemas.InsightItem(
                type="warning",
                message="Low overall activity level detected.",
            )
        )
    elif total_activities > days * 10:
        insights.append(
            schemas.InsightItem(
                type="positive",
                message="High engagement level observed.",
            )
        )

    return schemas.FullReportResponse(
        patient_id=user_id,
        days=days,
        summary=schemas.ReportSummary(
            total_activities=total_activities,
            medication_count=medication_count,
            call_count=call_count,
            mood_count=mood_count,
            avg_activities_per_day=str(avg_per_day),
        ),
        medication=medication_stats,
        activity_breakdown=activity_breakdown,
        daily_trend=daily_trend,
        mood_distribution=mood_distribution,
        hourly_pattern=hourly_pattern,
        insights=insights,
    )
