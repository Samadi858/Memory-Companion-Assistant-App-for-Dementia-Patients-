from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ... import database
from ...core import config, security
from ...domain import models, schemas
from ...repositories import activity_log_repository

router = APIRouter()


@router.post("/register", response_model=schemas.AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: schemas.RegisterRequest, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.User).where(models.User.email == payload.email))
    existing = result.scalars().first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    user = models.User(
        full_name=payload.full_name,
        email=payload.email,
        hashed_password=security.hash_password(payload.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    access_token = security.create_access_token({"sub": str(user.id)})
    refresh_token = security.create_refresh_token({"sub": str(user.id)})

    user.refresh_token = refresh_token
    await db.commit()
    await db.refresh(user)
    await db.refresh(user)

    expires_in = config.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    try:
        await activity_log_repository.create_activity_log(
            db,
            user_id=user.id,
            event_type="auth_register",
            title="Caregiver account created",
            description=f"New caregiver registered with email {user.email}",
            status="completed",
            source="auth",
        )
    except Exception:
        pass

    return schemas.AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=expires_in,
        user=schemas.UserResponse.model_validate(user),
    )


@router.post("/login", response_model=schemas.AuthResponse)
async def login(payload: schemas.LoginRequest, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.User).where(models.User.email == payload.email))
    user = result.scalars().first()

    if not user or not security.verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    access_token = security.create_access_token({"sub": str(user.id)})
    refresh_token = security.create_refresh_token({"sub": str(user.id)})

    user.refresh_token = refresh_token
    await db.commit()

    expires_in = config.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    try:
        await activity_log_repository.create_activity_log(
            db,
            user_id=user.id,
            event_type="auth_login",
            title="Caregiver logged in",
            description=f"User {user.email} logged in successfully",
            status="completed",
            source="auth",
        )
    except Exception:
        pass

    return schemas.AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=expires_in,
        user=schemas.UserResponse.model_validate(user),
    )


@router.post("/refresh", response_model=schemas.AccessTokenResponse)
async def refresh_token(payload: schemas.RefreshRequest, db: AsyncSession = Depends(database.get_db)):
    token_data = security.decode_token(payload.refresh_token)

    if token_data.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
        )

    user_id = token_data.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload missing subject",
        )

    result = await db.execute(select(models.User).where(models.User.id == int(user_id)))
    user = result.scalars().first()

    if user is None or user.refresh_token != payload.refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has been revoked or already used",
        )

    new_access_token = security.create_access_token({"sub": str(user.id)})
    expires_in = config.ACCESS_TOKEN_EXPIRE_MINUTES * 60

    return schemas.AccessTokenResponse(
        access_token=new_access_token,
        expires_in=expires_in,
    )


@router.post("/logout", response_model=schemas.MessageResponse)
async def logout(
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    try:
        await activity_log_repository.create_activity_log(
            db,
            user_id=current_user.id,
            event_type="auth_logout",
            title="Caregiver logged out",
            description=f"User {current_user.email} logged out",
            status="completed",
            source="auth",
        )
    except Exception:
        pass
    current_user.refresh_token = None
    await db.commit()
    return schemas.MessageResponse(message="Logged out successfully")


@router.post("/change-password", response_model=schemas.MessageResponse)
async def change_password(
    payload: schemas.ChangePasswordRequest,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    if security.verify_password(payload.new_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from current password",
        )

    current_user.hashed_password = security.hash_password(payload.new_password)
    await db.commit()
    try:
        await activity_log_repository.create_activity_log(
            db,
            user_id=current_user.id,
            event_type="auth_password_changed",
            title="Caregiver password changed",
            description="Password updated from system settings",
            status="completed",
            source="auth",
        )
    except Exception:
        pass
    return schemas.MessageResponse(message="Password updated successfully")


@router.get("/me", response_model=schemas.UserResponse)
async def get_me(current_user: models.User = Depends(security.get_current_active_user)):
    return schemas.UserResponse.model_validate(current_user)
