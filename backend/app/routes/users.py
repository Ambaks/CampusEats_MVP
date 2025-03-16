from fastapi import APIRouter, Depends
from auth import verify_token

router = APIRouter()

@router.get("/profile", dependencies=[Depends(verify_token)])
async def get_profile(user=Depends(verify_token)):
    return {"message": "Welcome!", "user": user}