from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User
import uuid

# Create database tables if they don't exist
Base.metadata.create_all(bind=engine)

# Dummy chef data
chefs_data = [
    {
        "username": "Chef Marco",
        "profile_picture": "https://source.unsplash.com/featured/?chef,man",
        "rating": "4.3 (387)",
    },
    {
        "username": "Chef Yuki",
        "profile_picture": "https://source.unsplash.com/featured/?chef,woman",
        "rating": "5.0 (3)",
    },
    {
        "username": "Chef Sofia",
        "profile_picture": "https://source.unsplash.com/featured/?chef",
        "rating": "4.7 (14)",
    },
    {
        "username": "Chef Arjun",
        "profile_picture": "https://source.unsplash.com/featured/?chef,man",
        "rating": "4.8 (135)",
    },
    {
        "username": "Chef Pierre",
        "profile_picture": "https://source.unsplash.com/featured/?chef,man",
        "rating": "4.9 (53)",
    },
    {
        "username": "Chef Anong",
        "profile_picture": "https://www.shutterstock.com/image-photo/young-beautiful-asian-woman-chef-600nw-2317761803.jpg",
        "rating": "4.8 (22)",
    },
]

# Open a database session
session = SessionLocal()

# Create users and add them to the database
for chef in chefs_data:
    user = User(
        id=str(uuid.uuid4()),
        email=f"{chef['username'].replace(' ', '').lower()}@example.com",
        username=chef["username"],
        profile_picture=chef["profile_picture"],
        rating=chef["rating"],
        role="seller",  # Mark these users as sellers (chefs)
        # phone_number and address are left as None (or you can set them if needed)
        is_verified=False,
    )
    session.add(user)

session.commit()
session.close()
print("Users successfully seeded into PostgreSQL!")
