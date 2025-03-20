from sqlalchemy.orm import Session
from sqlalchemy import func
from models import Meal
from schemas import MealCreate, MealUpdate
from math import radians, cos, sin, sqrt, atan2, dist
from typing import List, Optional
from fastapi import HTTPException

# Create a new meal
def create_meal(db: Session, meal: MealCreate, seller_id: int) -> Meal:
    db_meal = Meal(
        name=meal.name,
        description=meal.description,
        ingredients=meal.ingredients,
        price=meal.price,
        image_url=meal.image_url,
        seller_id=seller_id,
        latitude=meal.latitude,
        longitude=meal.longitude
    )
    try:
        db.add(db_meal)
        db.commit()
        db.refresh(db_meal)
        return db_meal
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Calculate distance between two locations (returns kilometers)
def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Returns distance in kilometers between two latitude/longitude points using Haversine formula."""
    R = 6371  # Radius of Earth in km
    dlat, dlon = radians(lat2 - lat1), radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    return 2 * R * atan2(sqrt(a), sqrt(1 - a))

# Get a meal by ID (raises 404 if not found)
def get_meal(db: Session, meal_id: int) -> Optional[Meal]:
    meal = db.get(Meal, meal_id)
    if meal is None:
        raise HTTPException(status_code=404, detail="Meal not found")
    return meal

# Fetch nearby meals with distance calculation
def get_meals(db: Session, user_lat: float, user_lon: float, radius: float = 10, skip: int = 0, limit: int = 10) -> List[Meal]:
    """
    Retrieve meals within a given radius (km) from the user's location, sorted by distance.
    Supports pagination with `skip` and `limit`.
    Each returned Meal object has an extra attribute 'distance'.
    """
    earth_radius_m = 6371000  # Earth's radius in km

    # Haversine formula for calculating distance in SQLAlchemy
    distance_formula = (
        earth_radius_m
        * func.acos(
            func.cos(func.radians(user_lat))
            * func.cos(func.radians(Meal.latitude))
            * func.cos(func.radians(Meal.longitude) - func.radians(user_lon))
            + func.sin(func.radians(user_lat))
            * func.sin(func.radians(Meal.latitude))
        )
    ).label("distance")

    query = (
        db.query(Meal, distance_formula)
        .filter(Meal.latitude.isnot(None), Meal.longitude.isnot(None))
        .filter(distance_formula < radius)  # Only meals within the radius
        .order_by(distance_formula)
        .offset(skip)
        .limit(limit)
    )

    results = query.all()  # results is a list of tuples: (Meal, distance)
    meals_with_distance = []
    for meal, distance in results:
        meal.distance = round(distance)  # Attach the extra field
        meals_with_distance.append(meal)
        
    return meals_with_distance


# Update a meal (raises 404 if not found)
def update_meal(db: Session, meal_id: int, meal_update: MealUpdate) -> Meal:
    db_meal = get_meal(db, meal_id)  # Reuses `get_meal()` to check existence
    update_data = meal_update.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_meal, key, value)

    try:
        db.commit()
        db.refresh(db_meal)
        return db_meal
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Delete a meal (raises 404 if not found)
def delete_meal(db: Session, meal_id: int) -> dict:
    db_meal = get_meal(db, meal_id)  # Reuses `get_meal()` to check existence

    try:
        db.delete(db_meal)
        db.commit()
        return {"message": "Meal deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
