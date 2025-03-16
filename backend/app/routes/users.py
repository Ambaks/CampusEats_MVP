from fastapi import APIRouter, Depends
from auth import verify_token
import firebase_admin
from firebase_admin import auth
from fastapi import HTTPException, Depends, APIRouter
from schemas import UserCreate

router = APIRouter()

@router.get("/profile", dependencies=[Depends(verify_token)])
async def get_profile(user=Depends(verify_token)):
    return {"message": "Welcome!", "user": user}

@router.post("/register")
def create_user(user: UserCreate):
    """Registers a new user in Firebase Authentication."""
    try:
        new_user = auth.create_user(
            email=user.email,
            password=user.password,
            username=user.username
        )
        return {"message": "User created successfully", "uid": new_user.uid}
    except firebase_admin.auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already registered")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")

