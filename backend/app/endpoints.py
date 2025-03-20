from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Meal, User
from schemas import MealCreate, MealUpdate, UserCreate, UserResponse, MealResponse
from crud import create_meal, get_meal, get_meals, update_meal, delete_meal
from typing import List
from auth import get_current_user  # Import authentication dependency

router = APIRouter()

# User Routes
@router.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(username=user.username, email=user.email, hashed_password=user.hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.uid == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Meal Routes
@router.post("/meals/", response_model=MealResponse)
def create_meal_route(meal: MealCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_meal(db, meal, seller_id=current_user.uid)  # Use authenticated user's UID

@router.get("/meals/{meal_id}", response_model=MealResponse)
def get_meal_route(meal_id: int, db: Session = Depends(get_db)):
    meal = get_meal(db, meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    return meal

@router.get("/meals/", response_model=List[MealResponse])
def get_meals_route(user_lat: float, user_lon: float, radius: float = 40000.0, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """
    API endpoint to fetch meals near a given location within a specified radius (in km),
    sorted by distance and paginated.
    """
    return get_meals(db, user_lat, user_lon, radius, skip, limit)

@router.put("/meals/{meal_id}", response_model=MealResponse)
def update_meal_route(meal_id: int, meal_update: MealUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    updated_meal = update_meal(db, meal_id, meal_update, seller_id=current_user.uid)
    if not updated_meal:
        raise HTTPException(status_code=404, detail="Meal not found or unauthorized")
    return updated_meal

@router.delete("/meals/{meal_id}", response_model=MealResponse)
def delete_meal_route(meal_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    deleted_meal = delete_meal(db, meal_id, seller_id=current_user.uid)
    if not deleted_meal:
        raise HTTPException(status_code=404, detail="Meal not found or unauthorized")
    return deleted_meal
