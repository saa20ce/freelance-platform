from fastapi import FastAPI, Depends, HTTPException, Request, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from fastapi.middleware.cors import CORSMiddleware
from . import models, schemas, crud
from .database import engine, get_db
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=3002)

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
    logging.info(f"Request headers: {request.headers}")
    body = await request.body()
    logging.info(f"Request body: {body}")
    response = await call_next(request)
    logging.info(f"Response headers: {response.headers}")
    return response

@app.on_event("startup")
async def startup():
    logger.info("Starting up and trying to connect to the database")
    async with engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)
    logger.info("Successfully connected to the database and initialized tables")

@app.post("/api/users/profile", response_model=schemas.UserWithSettings)
async def get_user_profile(data: schemas.UserGeneralSettings, db: AsyncSession = Depends(get_db)):
    login = data.login
    logger.info(f"Fetching profile for login: {login}") 
    db_user = await crud.get_user_by_login(db, login=login)
    if not db_user:
        logger.warning(f"User not found for login: {login}")
        raise HTTPException(status_code=404, detail="User not found")
    logger.info(f"User found: {db_user}")
    return db_user

@app.post("/api/register/", response_model=schemas.UserWithSettings)
async def register_user(user: schemas.UserCreate, request: Request, db: AsyncSession = Depends(get_db)):
    body = await request.body()
    logger.info(f"Request body: {body}")
    db_user = await crud.get_user_by_email(db, email=user.email)
    if db_user:
        logger.warning(f"Email already registered: {user.email}")
        raise HTTPException(status_code=400, detail="Email already registered")
    try:
        new_user = await crud.create_user(db=db, user=user)
        logger.info(f"Created new user: {new_user.email}")
        user_with_settings = await crud.get_user_with_settings(db, new_user.id)
        logger.info(f"Retrieved user settings for user: {new_user.email}")
        return user_with_settings
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.put("/api/users/{user_id}/general", response_model=schemas.UserLogin)
async def update_general_settings(user_id: int, settings: schemas.UserLogin, db: AsyncSession = Depends(get_db)):
    updated_settings = await crud.update_general_settings(db, user_id=user_id, settings=settings)
    if not updated_settings:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_settings

@app.put("/api/users/{user_id}/profile", response_model=schemas.ProfileSettings)
async def update_profile_settings(user_id: int, settings: schemas.ProfileSettingsUpdate, db: AsyncSession = Depends(get_db)):
    updated_settings = await crud.update_profile_settings(db, user_id=user_id, settings=settings)
    if not updated_settings:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_settings

@app.post("/api/login", response_model=schemas.UserWithSettings)
async def login_user(user: schemas.UserLogin, db: AsyncSession = Depends(get_db)):
    db_user = await crud.get_user_by_email(db, email=user.email)
    #if not db_user or not crud.verify_password(user.password, db_user.hashed_password):
    if not db_user or db_user.hashed_password != user.password:  # Проверка пароля в открытом виде
        logger.warning(f"Invalid email or password for user: {user.email}")
        raise HTTPException(status_code=400, detail="Invalid email or password")
    user_with_settings = await crud.get_user_with_settings(db, db_user.id)
    logger.info(f"User logged in: {user.email}")
    return user_with_settings


@app.put("/api/users/{user_id}/change-password")
async def change_password(user_id: int, password_data: schemas.PasswordChange, db: AsyncSession = Depends(get_db)):
    new_password = password_data.newPassword
    if not new_password:
        raise HTTPException(status_code=400, detail="New password is required")
    
    user = await crud.change_user_password(db, user_id, new_password)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "Password changed successfully"}

