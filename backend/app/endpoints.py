from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Meal, User
from schemas import MealCreate, MealUpdate, UserCreate, UserResponse, MealResponse
from crud import create_meal, get_meal, get_meals, update_meal, delete_meal, get_cart, create_or_update_cart, get_chef_orders_by_chef
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


@router.get("api/cart/{user_id}")
def read_cart(user_id: str, db: Session = Depends(get_db)):
    return get_cart(db, user_id) or {"user_id": user_id, "items": []}

@router.post("api/cart/{user_id}")
def update_cart(user_id: str, items: list, db: Session = Depends(get_db)):
    return create_or_update_cart(db, user_id, items)

@router.delete("/api/cart/{user_id}/{meal_id}")
def remove_cart_item(user_id: str, meal_id: int, db: Session = Depends(get_db)):
    cart = get_cart(db, user_id)
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    cart.items = [item for item in cart.items if item["mealId"] != meal_id]

    db.commit()
    db.refresh(cart)
    return cart

@router.post("/api/clear-cart")
async def clear_cart(user=Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        db.clear_user_cart(user.id)  # Replace with your actual database logic
        return {"message": "Cart cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to clear cart")
    
@router.get("api/orders/{user_id}")
def read_chef_orders(user_id: str, db: Session = Depends(get_db)):
    return get_chef_orders_by_chef(db, user_id)