from sqlalchemy import Column, String, Boolean, DateTime, func
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    uid = Column(String, primary_key=True, unique=True, index=True)  # Firebase UID
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    profile_picture = Column(String, nullable=True)
    role = Column(String, default="buyer")  # buyer, seller, admin
    phone_number = Column(String, nullable=True)
    address = Column(String, nullable=True)

    created_at = Column(DateTime, default=func.now())  # Auto timestamp
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)  # Firebase handles verification, but can store locally too