from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, DateTime, Boolean, func, Index
from datetime import datetime
from database import Base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, unique=True, index=True)  # Firebase UID
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    profile_picture = Column(String, nullable=True)
    role = Column(String, default="buyer")  # buyer, seller, admin
    phone_number = Column(String, nullable=True)
    address = Column(String, nullable=True)
    rating = Column(String, nullable=True)

    meals = relationship("Meal", back_populates="seller")
    orders = relationship("Order", back_populates="buyer")


    created_at = Column(DateTime, default=func.now())  # Auto timestamp
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    is_verified = Column(Boolean, default=False)  # Firebase handles verification, but can store locally too

class Meal(Base):
    __tablename__ = "meals"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    ingredients = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)
    seller_id = Column(String, ForeignKey("users.id"), nullable=False)
    latitude = Column(Float, nullable=True)  # New field
    longitude = Column(Float, nullable=True)  # New field
    created_at = Column(DateTime, default=datetime.utcnow)
    
    seller = relationship("User", back_populates="meals")
    orders = relationship("Order", back_populates="meal")

    # Add index for faster location-based queries
    __table_args__ = (Index('idx_meal_location', 'latitude', 'longitude'),)

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(String, ForeignKey("users.id"), nullable=False)
    meal_id = Column(Integer, ForeignKey("meals.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    total_price = Column(Float, nullable=False)
    status = Column(String, default="pending")  # pending, completed, canceled
    created_at = Column(DateTime, default=datetime.utcnow)
    
    buyer = relationship("User", back_populates="orders")
    meal = relationship("Meal", back_populates="orders")
