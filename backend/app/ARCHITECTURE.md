# Backend Clean Architecture (Current)

## Layers
- `api/`: FastAPI routers and API composition.
- `core/`: security and config utilities.
- `domain/`: business entities (`models`) and DTO contracts (`schemas`).
- `repositories/`: data access and persistence logic.
- `main.py`: app bootstrap, CORS, startup migration, router mounting.

## Strict Structure
- Route handlers live only in `api/routes/`.
- Business models and contracts live only in `domain/`.
- Data-access functions live only in `repositories/`.
- Security and shared infrastructure logic live only in `core/`.
- `main.py` only performs wiring/bootstrap concerns.

## Request Flow
1. Route in `api/routes/*`
2. Auth dependency in `core/security.py`
3. Repository call in `repositories/*`
4. SQLAlchemy entities in `domain/models.py`
5. Response contracts in `domain/schemas.py`

## Feature Modules
- `api/routes/auth.py`: caregiver authentication endpoints.
- `api/routes/reminders.py`: authenticated reminder CRUD.
- `api/routes/patient.py`: patient details + today's reminders endpoints.
- `api/routes/memories.py`: photo upload/manage APIs (caregiver + patient timeline).
- `repositories/reminder_repository.py`: reminder persistence.
- `repositories/patient_repository.py`: patient-centric read APIs.
- `repositories/photo_memory_repository.py`: photo memory persistence.
