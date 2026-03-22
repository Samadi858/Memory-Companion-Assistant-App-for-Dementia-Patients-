from fastapi import APIRouter

from .routes import activity_logs, alerts, auth, diary, memories, mood, patient, reminders, reports, settings

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(reminders.router, prefix="/reminders", tags=["reminders"])
api_router.include_router(patient.router, prefix="/patient", tags=["patient"])
api_router.include_router(memories.router, prefix="/memories", tags=["memories"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
api_router.include_router(mood.router, prefix="/mood", tags=["mood"])
api_router.include_router(diary.router, prefix="/diary", tags=["diary"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
api_router.include_router(activity_logs.router, prefix="/activity-logs", tags=["activity-logs"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
