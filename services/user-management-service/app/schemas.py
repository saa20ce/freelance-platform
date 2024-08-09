from pydantic import BaseModel, EmailStr
from typing import Literal, Optional

class ProfileSettings(BaseModel):
    id: int
    user_id: int
    name: Optional[str] = None
    specialty: Optional[str] = None
    bio: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    photo: Optional[str] = None

    class Config:
        from_attributes = True

class User(BaseModel):
    id: int
    email: EmailStr
    role: Literal["buyer", "seller"]
    login: str

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email: EmailStr
    role: Literal["buyer", "seller"]
    password: str

class UserWithSettings(BaseModel):
    id: int
    email: EmailStr
    login: str
    role: Literal["buyer", "seller"]
    profile_settings: Optional[ProfileSettings]

    class Config:
        from_attributes = True

class ProfileSettingsUpdate(BaseModel):
    name: Optional[str] = None
    specialty: Optional[str] = None
    bio: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    photo: Optional[str] = None

class UserLogIn(BaseModel):
    email: EmailStr
    password: str

class PasswordChange(BaseModel):
    newPassword: str

class UserLoginSetting(BaseModel):
    login: str

    class Config:
        orm_mode = True
