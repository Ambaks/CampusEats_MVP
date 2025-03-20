from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Meal
from datetime import datetime

# Create database tables if they don't exist
Base.metadata.create_all(bind=engine)

# Open a database session
session = SessionLocal()

# Placeholder mapping for chef UUIDs (replace these with actual UUIDs if available)
chef_users = {
    "Chef Marco": "65fe3153-2891-475c-a051-baf4cc6fb38e",
    "Chef Yuki": "1d4cab19-5d0e-4a91-b821-c22272444cf4",
    "Chef Sofia": "3cb4d5a2-3c51-4a79-8f8a-2a4d34a0a0fb",
    "Chef Arjun": "fef26399-2bc7-44dd-abe0-85c69e9a085d",
    "Chef Pierre": "3b3c5fbe-b9ae-44cf-8860-f449ca774298",
    "Chef Anong": "41ca29a6-72a7-4cbb-8665-397e28029f1f",
}

# Dummy meal data near University of the Cumberlands
meals_data = [
    {
        "name": "Spaghetti Carbonara",
        "description": "Classic Italian pasta with eggs, cheese, pancetta, and pepper.",
        "ingredients": "Spaghetti, eggs, pancetta, parmesan, black pepper",
        "price": 12.99,
        "image_url": "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=2942&auto=format&fit=crop",
        "latitude": 36.7432,
        "longitude": -84.1649,
        "seller_id": chef_users["Chef Marco"],
    },
    {
        "name": "Sushi Platter",
        "description": "Assorted fresh sushi rolls: tuna, salmon, avocado.",
        "ingredients": "Rice, seaweed, tuna, salmon, avocado, soy sauce, wasabi",
        "price": 18.50,
        "image_url": "https://images.unsplash.com/photo-1541014741259-de529411b96a?q=80&w=3174&auto=format&fit=crop",
        "latitude": 36.7421,
        "longitude": -84.1654,
        "seller_id": chef_users["Chef Yuki"],
    },
    {
        "name": "Tacos al Pastor",
        "description": "Marinated pork tacos with pineapple, onions, and cilantro.",
        "ingredients": "Pork, pineapple, onions, cilantro, corn tortillas, spices",
        "price": 10.75,
        "image_url": "https://plus.unsplash.com/premium_photo-1681406994504-44743ccdfdd3?q=80&w=3087&auto=format&fit=crop",
        "latitude": 36.7441,
        "longitude": -84.1665,
        "seller_id": chef_users["Chef Sofia"],
    },
    {
        "name": "Butter Chicken",
        "description": "Creamy, mildly spiced butter chicken with naan bread.",
        "ingredients": "Chicken, tomato puree, cream, butter, garlic, ginger, spices",
        "price": 15.75,
        "image_url": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=3084&auto=format&fit=crop",
        "latitude": 36.7409,
        "longitude": -84.1683,
        "seller_id": chef_users["Chef Arjun"],
    },
    {
        "name": "Beef Bourguignon",
        "description": "French stew with tender beef, red wine, mushrooms, and carrots.",
        "ingredients": "Beef, red wine, mushrooms, carrots, onions, garlic, herbs",
        "price": 22.49,
        "image_url": "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/boeuf_bourguignon_25475_16x9.jpg",
        "latitude": 36.7415,
        "longitude": -84.1701,
        "seller_id": chef_users["Chef Pierre"],
    },
    {
        "name": "Pad Thai",
        "description": "Thai stir-fried noodles with shrimp, peanuts, and bean sprouts.",
        "ingredients": "Rice noodles, shrimp, peanuts, bean sprouts, tamarind, eggs, tofu",
        "price": 14.25,
        "image_url": "https://plus.unsplash.com/premium_photo-1664472637341-3ec829d1f4df?q=80&w=3125&auto=format&fit=crop",
        "latitude": 36.7398,
        "longitude": -84.1677,
        "seller_id": chef_users["Chef Anong"],
    },
]

# Insert meals into the database
for meal in meals_data:
    # Create a new Meal instance. The created_at column is automatically set by default.
    new_meal = Meal(**meal)
    session.add(new_meal)

session.commit()
session.close()
print("Meals successfully seeded into PostgreSQL!")
