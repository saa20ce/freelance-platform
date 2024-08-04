from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from .models import User, GeneralSettings, ProfileSettings
from .schemas import UserCreate, UserGeneralSettings, ProfileSettingsUpdate
import logging

logger = logging.getLogger(__name__)

async def get_user_by_login(db: AsyncSession, login: str):
    logger.info(f"Fetching user by login: {login}")
    result = await db.execute(
        select(User)
        .join(GeneralSettings)
        .filter(GeneralSettings.login == login)
        .options(selectinload(User.general_settings), selectinload(User.profile_settings))
    )
    user = result.scalars().first()
    if user:
        logger.info(f"User found by login: {login}")
    else:
        logger.warning(f"User not found by login: {login}")
    return user

async def create_user(db: AsyncSession, user: UserCreate):
    logger.info(f"Creating user: {user.email}")
    db_user = User(
        email=user.email,
        role=user.role,
        hashed_password=user.password # Сохраняем пароль в открытом виде
    )
    db.add(db_user)
    await db.flush()

    login = user.email.split('@')[0]
    general_settings = GeneralSettings(user_id=db_user.id, login=login)
    profile_settings = ProfileSettings(user_id=db_user.id)

    db.add(general_settings)
    db.add(profile_settings)
    await db.commit()
    await db.refresh(db_user)
    await db.refresh(general_settings)
    await db.refresh(profile_settings)

    logger.info(f"User created with ID: {db_user.id}")
    logger.info(f"GeneralSettings and ProfileSettings created for user ID: {db_user.id}")

    return db_user

async def get_user_by_email(db: AsyncSession, email: str):
    logger.info(f"Fetching user by email: {email}")
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()
    if user:
        logger.info(f"User found: {email}")
    else:
        logger.warning(f"User not found: {email}")
    return user

async def change_user_password(db: AsyncSession, user_id: int, new_password: str):
    logger.info(f"Changing password for user_id: {user_id}")
    user_result = await db.execute(select(User).filter(User.id == user_id))
    db_user = user_result.scalars().first()

    if db_user:
        db_user.hashed_password = new_password  # Просто обновляем пароль
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        logger.info(f"Password for user_id: {user_id} changed successfully")
        return db_user
    else:
        logger.warning(f"User with id {user_id} not found")
        return None

async def get_user_with_settings(db: AsyncSession, user_id: int):
    logger.info(f"Fetching user with settings by ID: {user_id}")
    result = await db.execute(
        select(User)
        .filter(User.id == user_id)
        .options(selectinload(User.general_settings), selectinload(User.profile_settings))
    )
    user = result.scalars().first()
    if user:
        logger.info(f"User with settings found for ID: {user_id}")
        return user
    else:
        logger.warning(f"User with settings not found for ID: {user_id}")
        return None

async def update_general_settings(db: AsyncSession, user_id: int, settings: UserGeneralSettings):
    logger.info(f"Starting update_general_settings for user_id: {user_id} with settings: {settings}")

    settings_result = await db.execute(select(GeneralSettings).filter(GeneralSettings.user_id == user_id))
    db_settings = settings_result.scalars().first()

    if db_settings:
        if settings.login is not None:
            db_settings.login = settings.login
        db.add(db_settings)
        await db.commit()
        await db.refresh(db_settings)
        logger.info(f"Updated general settings for user_id: {user_id}")
        return db_settings
    else:
        new_settings = GeneralSettings(user_id=user_id, **settings.dict(exclude_unset=True))
        db.add(new_settings)
        await db.commit()
        await db.refresh(new_settings)
        logger.info(f"Created new general settings for user_id: {user_id}")
        return new_settings

async def update_profile_settings(db: AsyncSession, user_id: int, settings: ProfileSettingsUpdate):
    result = await db.execute(select(ProfileSettings).filter(ProfileSettings.user_id == user_id))
    db_settings = result.scalars().first()

    if db_settings:
        if settings.name is not None:
            db_settings.name = settings.name
        if settings.specialty is not None:
            db_settings.specialty = settings.specialty
        if settings.bio is not None:
            db_settings.bio = settings.bio
        if settings.country is not None:
            db_settings.country = settings.country
        if settings.city is not None:
            db_settings.city = settings.city
        if settings.photo is not None:
            db_settings.photo = settings.photo

        db.add(db_settings)
        await db.commit()
        await db.refresh(db_settings)
        return db_settings
    else:
        new_settings = ProfileSettings(user_id=user_id, **settings.dict())
        db.add(new_settings)
        await db.commit()
        await db.refresh(new_settings)
        return new_settings
