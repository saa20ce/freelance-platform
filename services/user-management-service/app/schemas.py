from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional
from .models import GeneralSettings 

class UserGeneralSettings(BaseModel):
    login: str

    class Config:
        orm_mode = True

class ProfileSettings(BaseModel):
    name: Optional[str] = None
    specialty: Optional[str] = None
    bio: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    photo: Optional[str] = None

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    email: EmailStr
    role: Literal["buyer", "seller"]
    password: str

class UserWithSettings(BaseModel):
    id: int
    email: EmailStr
    role: str
    general_settings: Optional[UserGeneralSettings] = None
    profile_settings: Optional[ProfileSettings] = None

    class Config:
        from_attributes = True

class ProfileSettingsUpdate(BaseModel):
    name: Optional[str] = None
    specialty: Optional[str] = None
    bio: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    photo: Optional[str] = None

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: int
    email: EmailStr
    role: str

    class Config:
        orm_mode = True

class PasswordChange(BaseModel):
    newPassword: str