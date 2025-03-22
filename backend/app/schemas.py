from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    username: str = None

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    username: str
    profile_picture: Optional[str] = None
    rating: str
    role: str
    phone_number: Optional[str] = None
    address: Optional[str] = None
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Enables ORM mode for SQLAlchemy compatibility

class MealCreate(BaseModel):
    name: str
    description: Optional[str] = None
    ingredients: str
    price: float
    image_url: Optional[str] = None
    latitude: Optional[float] = None  
    longitude: float |  None  

class MealUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    ingredients: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    latitude: Optional[float] = None 
    longitude: Optional[float] = None 

class MealResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    ingredients: str
    price: float
    image_url: Optional[str] = None
    seller_id: str
    seller: UserResponse
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    distance: Optional[float] = None  # To include distance in the response if applicable

    class Config:
        orm_mode = True

class OrderCreate(BaseModel):
    email: str 
    meals: List 
    total_price: float
