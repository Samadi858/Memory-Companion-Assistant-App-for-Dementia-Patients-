from sqlalchemy import Boolean, Column, Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.sql import func

from ..database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    refresh_token = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=True)
    time = Column(String(50), index=True)
    name = Column(String(255), index=True)
    type = Column(String(50), default="task")
    frequency = Column(String(50), default="daily")
    image_url = Column(Text, nullable=True)
    color = Column(String(50), default="bg-blue-400")
    icon = Column(String(10))
    enabled = Column(Integer, default=1)
    status = Column(String(50), default="active")


class PhotoMemory(Base):
    __tablename__ = "photo_memories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    name = Column(String(255), nullable=True)
    relationship = Column(String(100), nullable=True)
    phone_number = Column(String(50), nullable=True)
    display_color = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    object_name = Column(String(512), nullable=True, unique=True)
    content_type = Column(String(128), nullable=True, default="image/jpeg")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class AlertEvent(Base):
    __tablename__ = "alert_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    reminder_id = Column(Integer, ForeignKey("reminders.id", ondelete="CASCADE"), index=True, nullable=False)
    scheduled_date = Column(String(10), index=True, nullable=False)
    status = Column(String(20), default="pending", index=True, nullable=False)
    triggered_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    cleared_at = Column(DateTime(timezone=True), nullable=True)


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    event_type = Column(String(100), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(20), default="info", nullable=False)
    source = Column(String(50), default="system", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class ReminderCompletion(Base):
    __tablename__ = "reminder_completions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    reminder_id = Column(Integer, ForeignKey("reminders.id", ondelete="CASCADE"), index=True, nullable=False)
    completed_date = Column(Date, nullable=False, index=True)
    completed_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class MoodEntry(Base):
    __tablename__ = "mood_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    mood = Column(String(50), nullable=False, index=True)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class DiaryEntry(Base):
    __tablename__ = "diary_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    activity = Column(Text, nullable=False)
    icon = Column(String(10), nullable=False, default="📝")
    occurred_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)


class SystemSettings(Base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True, index=True)
    caregiver_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    patient_name = Column(String(255), nullable=True)
    primary_caregiver_name = Column(String(255), nullable=True)
    caregiver_relationship = Column(String(100), nullable=True)
    emergency_contact_number = Column(String(50), nullable=True)
    patient_photo_url = Column(Text, nullable=True)
    caregiver_name = Column(String(255), nullable=True)
    caregiver_phone = Column(String(50), nullable=True)

    font_size = Column(Integer, default=100, nullable=False)
    high_contrast = Column(Boolean, default=False, nullable=False)
    night_mode = Column(Boolean, default=False, nullable=False)
    animations = Column(Boolean, default=True, nullable=False)

    audio_alerts = Column(Boolean, default=True, nullable=False)
    visual_alerts = Column(Boolean, default=True, nullable=False)
    reminder_volume = Column(Integer, default=70, nullable=False)
    snooze_enabled = Column(Boolean, default=True, nullable=False)
    snooze_duration = Column(String(20), default="5", nullable=False)

    language = Column(String(50), default="english", nullable=False)
    time_format = Column(String(20), default="12h", nullable=False)
    date_format = Column(String(20), default="mdy", nullable=False)

    auto_lock_enabled = Column(Boolean, default=True, nullable=False)
    auto_lock_time = Column(String(20), default="5", nullable=False)
    require_password_for_settings = Column(Boolean, default=True, nullable=False)
    activity_logging = Column(Boolean, default=True, nullable=False)

    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
