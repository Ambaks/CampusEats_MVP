import firebase_admin
from firebase_admin import auth, credentials
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Load Firebase credentials (download JSON from Firebase console)
cred = credentials.Certificate("/Users/naiahoard/Desktop/CampusEats_MVP/backend/campuseats-bf7cc-firebase-adminsdk-fbsvc-07e06423b7.json")
firebase_admin.initialize_app(cred)

security = HTTPBearer()

def verify_token(token: HTTPAuthorizationCredentials = Depends(security)):
    try:
        decoded_token = auth.verify_id_token(token.credentials)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")