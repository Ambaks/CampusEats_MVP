from fastapi import Depends, HTTPException
from firebase_admin import auth
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from models import User

security = HTTPBearer()

def verify_token(token: HTTPAuthorizationCredentials = Depends(security)):
    """Verify Firebase token and return decoded token data."""
    try:
        decoded_token = auth.verify_id_token(token.credentials)
        return decoded_token
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

def get_current_user(
    token_data: dict = Depends(verify_token), 
    db: Session = Depends(get_db)
) -> User:
    """Retrieve the current authenticated user from the database."""
    user = db.query(User).filter(User.uid == token_data["uid"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
