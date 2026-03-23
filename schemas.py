import re
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, field_validator


class ReminderBase(BaseModel):
    time: str
    name: str
    type: str = "task"
    frequency: str = "daily"
    image_url: Optional[str] = None
    color: str = "bg-blue-400"
    icon: str = "📋"
    enabled: bool = True
    status: str = "active"


class ReminderCreate(ReminderBase):
    pass


class ReminderUpdate(BaseModel):
    time: Optional[str] = None
    name: Optional[str] = None
    type: Optional[str] = None
    frequency: Optional[str] = None
    image_url: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    enabled: Optional[bool] = None
    status: Optional[str] = None


class ReminderResponse(ReminderBase):
    id: int
    user_id: Optional[int] = None

    class Config:
        from_attributes = True


class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    confirm_password: str

    @field_validator("full_name")
    @classmethod
    def name_must_be_valid(cls, value: str) -> str:
        value = value.strip()
        if len(value) < 2:
            raise ValueError("Full name must be at least 2 characters")
        if len(value) > 100:
            raise ValueError("Full name must be under 100 characters")
        return value

    @field_validator("password")
    @classmethod
    def password_strength(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[0-9]", value):
            raise ValueError("Password must contain at least one number")
        if not re.search(r"[^A-Za-z0-9]", value):
            raise ValueError("Password must contain at least one special character")
        return value

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, value: str, info):
        if "password" in info.data and value != info.data["password"]:
            raise ValueError("Passwords do not match")
        return value


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class ChangePasswordRequest(BaseModel):
    new_password: str
    confirm_password: str

    @field_validator("new_password")
    @classmethod
    def password_strength(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[0-9]", value):
            raise ValueError("Password must contain at least one number")
        if not re.search(r"[^A-Za-z0-9]", value):
            raise ValueError("Password must contain at least one special character")
        return value

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, value: str, info):
        if "new_password" in info.data and value != info.data["new_password"]:
            raise ValueError("Passwords do not match")
        return value


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse


class AccessTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class MessageResponse(BaseModel):
    message: str
    success: bool = True


class PatientDetailsResponse(BaseModel):
    id: int
    full_name: str
    email: str
    date: str


class PatientReminderResponse(BaseModel):
    id: int
    title: str
    time: str
    type: str
    completed: bool = False
    icon_color: str = "bg-blue-400"
    icon: str = "📋"
    image_url: Optional[str] = None


class ReminderCompletionRequest(BaseModel):
    completed: bool


class PhotoMemoryResponse(BaseModel):
    id: int
    user_id: int
    name: str
    relationship: str
    phone_number: Optional[str] = None
    display_color: Optional[str] = None
    notes: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    created_at: datetime


class PhotoMemoryCreateResponse(BaseModel):
    id: int
    name: str
    relationship: str
    phone_number: Optional[str] = None
    display_color: Optional[str] = None
    notes: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    created_at: datetime


class PhotoMemoryUpdateRequest(BaseModel):
    name: Optional[str] = None
    relationship: Optional[str] = None
    phone_number: Optional[str] = None
    display_color: Optional[str] = None
    notes: Optional[str] = None
    description: Optional[str] = None


class AlertActiveResponse(BaseModel):
    alert_id: int
    reminder_id: int
    title: str
    time: str
    type: str
    icon: str
    image_url: Optional[str] = None
    color: str
    triggered_at: datetime


class AlertDoneResponse(BaseModel):
    message: str


class AlertCheckResponse(BaseModel):
    has_alert: bool
    alert_id: Optional[int] = None
    reminder_id: Optional[int] = None
    title: Optional[str] = None
    time: Optional[str] = None
    type: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None
    color: Optional[str] = None
    triggered_at: Optional[datetime] = None


class ActivityLogCreateRequest(BaseModel):
    event_type: str
    title: str
    description: Optional[str] = None
    status: str = "info"
    source: str = "manual"


class ActivityLogResponse(BaseModel):
    id: int
    user_id: int
    event_type: str
    title: str
    description: Optional[str] = None
    status: str
    source: str
    created_at: datetime

    class Config:
        from_attributes = True


class MoodEntryCreateRequest(BaseModel):
    mood: str
    note: Optional[str] = None
    user_id: Optional[int] = None


class MoodEntryResponse(BaseModel):
    id: int
    user_id: int
    mood: str
    note: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class DiaryEntryCreateRequest(BaseModel):
    activity: str
    icon: str = "📝"
    occurred_at: Optional[datetime] = None
    user_id: Optional[int] = None


class DiaryEntryUpdateRequest(BaseModel):
    activity: Optional[str] = None
    icon: Optional[str] = None
    occurred_at: Optional[datetime] = None
    user_id: Optional[int] = None


class DiaryEntryResponse(BaseModel):
    id: int
    user_id: int
    activity: str
    icon: str
    occurred_at: datetime
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SystemSettingsBase(BaseModel):
    patient_name: str = ""
    primary_caregiver_name: str = ""
    caregiver_relationship: str = ""
    emergency_contact_number: str = ""
    patient_photo_url: str = ""
    caregiver_name: str = ""
    caregiver_phone: str = ""

    font_size: int = 100
    high_contrast: bool = False
    night_mode: bool = False
    animations: bool = True

    audio_alerts: bool = True
    visual_alerts: bool = True
    reminder_volume: int = 70
    snooze_enabled: bool = True
    snooze_duration: str = "5"

    language: str = "english"
    time_format: str = "12h"
    date_format: str = "mdy"

    auto_lock_enabled: bool = True
    auto_lock_time: str = "5"
    require_password_for_settings: bool = True
    activity_logging: bool = True


class SystemSettingsUpdateRequest(SystemSettingsBase):
    pass


class SystemSettingsResponse(SystemSettingsBase):
    caregiver_user_id: int
    updated_at: datetime

    class Config:
        from_attributes = True


class ReportSummary(BaseModel):
    total_activities: int
    medication_count: int
    call_count: int
    mood_count: int
    avg_activities_per_day: str


class MedicationStats(BaseModel):
    taken: int
    expected: int
    rate: str


class ActivityBreakdownItem(BaseModel):
    name: str
    value: int


class DailyTrendItem(BaseModel):
    date: str
    activities: int


class MoodDistributionItem(BaseModel):
    mood: str
    count: int


class HourlyPatternItem(BaseModel):
    hour: str
    activities: int


class InsightItem(BaseModel):
    type: str
    message: str


class FullReportResponse(BaseModel):
    patient_id: int
    days: int
    summary: ReportSummary
    medication: MedicationStats
    activity_breakdown: list[ActivityBreakdownItem]
    daily_trend: list[DailyTrendItem]
    mood_distribution: list[MoodDistributionItem]
    hourly_pattern: list[HourlyPatternItem]
    insights: list[InsightItem]
