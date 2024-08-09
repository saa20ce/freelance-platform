from sqlalchemy import Column, Integer, String, Enum, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    login = Column(String, unique=True, nullable=True)
    hashed_password = Column(String)
    role = Column(Enum('buyer', 'seller', name="user_roles"))

    profile_settings = relationship("ProfileSettings", back_populates="user", uselist=False)

class ProfileSettings(Base):
    __tablename__ = "profile_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True)
    name = Column(String, nullable=True)
    specialty = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    country = Column(String, nullable=True)
    city = Column(String, nullable=True)
    photo = Column(Text, nullable=True)

    user = relationship("User", back_populates="profile_settings")
