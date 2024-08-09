import os
import base64
from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.middleware.cors import CORSMiddleware
from . import models, schemas, crud
from .database import engine, get_db
import logging

logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s %(name)s %(levelname)s %(message)s',
                    handlers=[logging.FileHandler("/app/log.txt"),
                              logging.StreamHandler()])

logger = logging.getLogger(__name__)

secret_key_base64 = os.getenv("JWT_SECRET")
if not secret_key_base64:
    raise ValueError("JWT_SECRET environment variable not set")
try:
    SECRET_KEY = base64.b64decode(secret_key_base64).decode("utf-8")
except Exception as e:
    raise ValueError(f"Error decoding JWT_SECRET: {str(e)}")

logging.debug(f"SECRET_KEY successfully decoded: {SECRET_KEY}")

logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_request_response(request: Request, call_next):
    logging.debug(f"Request headers: {request.headers}")
    body = await request.body()
    logging.debug(f"Request body: {body}")
    response = await call_next(request)
    logging.debug(f"Response headers: {response.headers}")
    return response

@app.on_event("startup")
async def startup():
    logging.debug("Starting up and trying to connect to the database")
    try:
        async with engine.begin() as conn:
            await conn.run_sync(models.Base.metadata.create_all)
        logging.debug("Successfully connected to the database and initialized tables")
    except Exception as e:
        logging.error(f"Error during startup: {str(e)}")

@app.post("/api/users/profile", response_model=schemas.UserWithSettings)
async def get_user_profile(data: schemas.UserLoginSetting, db: AsyncSession = Depends(get_db)):
    async with db.begin():
        login = data.login
        logging.debug(f"Fetching profile for login: {login}") 
        db_user = await crud.get_user_by_login(db, login=login)
        if not db_user:
            logging.warning(f"User not found for login: {login}")
            raise HTTPException(status_code=404, detail="User not found")
        logging.debug(f"User found: {db_user}")
        
        return schemas.UserWithSettings(
            id=db_user.id,
            email=db_user.email,
            login=db_user.login,
            role=db_user.role,
            profile_settings=db_user.profile_settings
        )

@app.post("/api/register/", response_model=schemas.UserWithSettings)
async def register_user(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    async with db.begin():
        db_user = await crud.get_user_by_email(db, email=user.email)
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        db_user, profile_settings = await crud.create_user_with_settings(db=db, user=user)
        if not db_user:
            raise HTTPException(status_code=500, detail="Failed to create user")

        if not profile_settings:
            raise HTTPException(status_code=500, detail="Failed to create profile settings")

        user_with_settings = await crud.get_user_with_settings(db, db_user.id)
        if not user_with_settings:
            raise HTTPException(status_code=500, detail="Failed to retrieve user with settings")

        token = crud.create_access_token(data={"id": db_user.id, "role": db_user.role, "email": db_user.email}, secret_key=SECRET_KEY)

        return {"id": user_with_settings.id, 
                "email": user_with_settings.email, 
                "login": user_with_settings.login, 
                "role": user_with_settings.role, 
                "profile_settings": user_with_settings.profile_settings,
                "token": token}


@app.post("/api/login", response_model=schemas.UserWithSettings)
async def login_user(user: schemas.UserLogIn, db: AsyncSession = Depends(get_db)):
    async with db.begin():
        db_user = await crud.get_user_by_email(db, email=user.email)
        if not db_user or not crud.verify_password(user.password, db_user.hashed_password):
            logging.warning(f"Invalid email or password for user: {user.email}")
            raise HTTPException(status_code=400, detail="Invalid email or password")
        user_with_settings = await crud.get_user_with_settings(db, db_user.id)
        if not user_with_settings:
            raise HTTPException(status_code=500, detail="Failed to retrieve user with settings")
        token = crud.create_access_token(data={"id": db_user.id, "role": db_user.role, "email": db_user.email}, secret_key=SECRET_KEY)
        logging.info(f"User logged in: {user.email}")
        
        return {
            "id": user_with_settings.id,
            "email": user_with_settings.email,
            "login": user_with_settings.login,
            "role": user_with_settings.role,
            "profile_settings": user_with_settings.profile_settings,
            "token": token
        }

@app.put("/api/users/{user_id}/update-login", response_model=schemas.UserLoginSetting)
async def update_user_login(user_id: int, newLogin: schemas.UserLoginSetting, db: AsyncSession = Depends(get_db)):
    async with db.begin():
        updated_login = await crud.update_user_login(db, user_id=user_id, newLogin=newLogin.login)
        if not updated_login:
            raise HTTPException(status_code=404, detail="User not found")
        return updated_login

@app.put("/api/users/{user_id}/change-password")
async def change_password(user_id: int, password_data: schemas.PasswordChange, db: AsyncSession = Depends(get_db)):
    async with db.begin():
        new_password = password_data.newPassword
        if not new_password:
            raise HTTPException(status_code=400, detail="New password is required")
        
        user = await crud.change_user_password(db, user_id, new_password)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "Password changed successfully"}

@app.put("/api/users/{user_id}/profile", response_model=schemas.ProfileSettingsUpdate)
async def update_profile_settings(user_id: int, settings: schemas.ProfileSettingsUpdate, db: AsyncSession = Depends(get_db)):
    async with db.begin():
        updated_settings = await crud.update_profile_settings(db, user_id=user_id, settings=settings)
        if not updated_settings:
            raise HTTPException(status_code=404, detail="User not found")
        return updated_settings
