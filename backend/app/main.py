from fastapi import FastAPI
from database import engine, Base
from routes import users, meals, orders

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Include API routes
app.include_router(users.router)
app.include_router(meals.router)
app.include_router(orders.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to CampusEats API!"}