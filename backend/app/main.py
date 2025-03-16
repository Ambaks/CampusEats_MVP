from fastapi import FastAPI, Request
from database import engine, Base
from routes import users, meals, orders
from starlette.middleware.base import BaseHTTPMiddleware
import logging
import time

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Set up logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Middleware to log requests & responses
class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time

        logging.info(f"{request.method} {request.url} - {response.status_code} - {process_time:.2f}s")
        return response

app.add_middleware(LoggingMiddleware)

# Include API routes
app.include_router(users.router)
app.include_router(meals.router)
app.include_router(orders.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to CampusEats API!"}

