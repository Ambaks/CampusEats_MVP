import stripe
from fastapi import APIRouter, HTTPException
import os
from dotenv import load_dotenv
import stripe

# Load environment variables from .env file
load_dotenv()

# Access the Stripe key securely
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
stripe.api_key = STRIPE_SECRET_KEY

router = APIRouter()

@router.post("/create-checkout-session")
async def create_checkout_session(price: float, meal_name: str, order_id: str):
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            success_url="https://yourwebsite.com/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url="https://yourwebsite.com/cancel",
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {"name": meal_name},
                        "unit_amount": int(price * 100),  # Convert to cents
                    },
                    "quantity": 1,
                }
            ],
            metadata={"order_id": order_id},
        )
        return {"sessionId": session.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
