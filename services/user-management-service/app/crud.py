import jwt
import datetime
import bcrypt
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from .models import User, ProfileSettings
from .schemas import UserCreate, ProfileSettingsUpdate
import logging

logger = logging.getLogger(__name__)

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

async def get_user_by_login(db: AsyncSession, login: str):
    logging.debug(f"Fetching user by login: {login}")
    result = await db.execute(
        select(User)
        .options(selectinload(User.profile_settings))
        .filter(User.login == login)
    )
    user = result.scalars().first()
    if user:
        logging.debug(f"User found by login: {login}")
    else:
        logging.warning(f"User not found by login: {login}")
    return user

def create_access_token(data: dict, secret_key: str):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm="HS256")
    return encoded_jwt

async def create_user_with_settings(db: AsyncSession, user: UserCreate):
    logger.info(f"Creating user: {user.email}")
    emailLogin = user.email.split('@')[0]
    user.password = hash_password(user.password)
    db_user = User(
        email=user.email,
        login=emailLogin,
        role=user.role,
        hashed_password=user.password
    )
    db.add(db_user)
    await db.flush()
    await db.refresh(db_user)
    logger.info(f"User created with ID: {db_user.id}")

    logger.info(f"Creating profile settings for user_id: {db_user.id}")
    profile_settings = ProfileSettings(user_id=db_user.id)
    db.add(profile_settings)
    await db.flush()
    await db.refresh(profile_settings)
    logger.info(f"Profile settings created for user_id: {db_user.id}")

    return db_user, profile_settings

async def get_user_by_email(db: AsyncSession, email: str):
    logging.debug(f"Fetching user by email: {email}")
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()
    if user:
        logging.debug(f"User found: {email}")
    else:
        logging.warning(f"User not found: {email}")
    return user

async def change_user_password(db: AsyncSession, user_id: int, new_password: str):
    logger.debug(f"Changing password for user_id: {user_id}")
    user_result = await db.execute(select(User).filter(User.id == user_id))
    db_user = user_result.scalars().first()
    if db_user:
        db_user.hashed_password = hash_password(new_password)
        db.add(db_user)
        await db.flush()
        await db.refresh(db_user)
        logger.debug(f"Password for user_id: {user_id} changed successfully")
    else:
        logger.warning(f"User with id {user_id} not found")
        return None
    return db_user

async def get_user_with_settings(db: AsyncSession, user_id: int):
    logger.debug(f"Fetching user with settings by ID: {user_id}")
    user_result = await db.execute(select(User).filter(User.id == user_id))
    user = user_result.scalars().first()
    if user:
        profile_settings = await db.execute(select(ProfileSettings).filter(ProfileSettings.user_id == user_id))
        profile_settings = profile_settings.scalars().first()
        user.profile_settings = profile_settings
        logger.debug(f"User with settings found for ID: {user_id}")
        return user
    else:
        logger.warning(f"User with settings not found for ID: {user_id}")
        return None

async def update_user_login(db: AsyncSession, user_id: int, newLogin: str):
    logger.debug(f"Starting update_user_login for user_id: {user_id} with login: {newLogin}")
    user_result = await db.execute(select(User).filter(User.id == user_id))
    db_user = user_result.scalars().first()
    if db_user:
        db_user.login = newLogin 
        db.add(db_user)
        await db.flush()
        await db.refresh(db_user)
        logger.debug(f"Login for user_id: {user_id} changed successfully")
        return db_user
    else:
        logger.warning(f"User with id {user_id} not found")
        return None

async def update_profile_settings(db: AsyncSession, user_id: int, settings: ProfileSettingsUpdate):
    logger.debug(f"Updating profile settings for user_id: {user_id}")
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
        await db.flush()
        await db.refresh(db_settings)
        logger.debug(f"Profile settings updated for user_id: {user_id}")
        return db_settings
    else:
        new_settings = ProfileSettings(user_id=user_id, **settings.dict())
        db.add(new_settings)
        await db.flush()
        await db.refresh(new_settings)
        logger.debug(f"New profile settings created for user_id: {user_id}")
        return new_settings