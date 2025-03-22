import json
import stripe
from sqlalchemy.orm import Session
from fastapi import APIRouter, HTTPException, Depends, Request
import os
from dotenv import load_dotenv
import stripe
from schemas import OrderCreate
from models import Order, Meal
from uuid import uuid4
from database import get_db
from crud import get_user_by_email, create_user

# Load environment variables from .env file
load_dotenv()

# Access the Stripe key securely
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")

# Change in production to real key, and in Stripe.JS as well !!!
stripe.api_key = "sk_test_51IZ8EqBz9xzk5af06uvsItpC2dc71EOzdM9qjMum0pyIRhTScF2YrFUF5080eQc7Mkic1c0GDsTGObiiJXT4pZrZ00T6sEZXBS" 

#endpoint = stripe.WebhookEndpoint.create(
#    url="http://localhost:8000/webhook/stripe",
#    enabled_events=["checkout.session.completed"],
#)

router = APIRouter()


WEBHOOK_SECRET = "whsec_ed2eb5f461f9d8066c63f2965a0347a0a6d16cfe2cd76208af0f3e62640d1769"

router = APIRouter()

@router.post("/api/create-checkout-session")
async def create_checkout_session(order: OrderCreate, db: Session = Depends(get_db)):
    # Generate a unique order ID (but do not create the order yet)
    order_id = str(uuid4())

    # Get or create the user (buyer)
    user = get_user_by_email(db, order.email)
    if not user:
        user = create_user(db, order.email)

    # Prepare metadata. For meals, we assume order.meals is a list of dicts.
    metadata = {
        "order_id": order_id,
        "buyer_id": user.id,
        "total_price": str(order.total_price),
        "meals": json.dumps(order.meals),
    }

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            success_url="http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url="http://localhost:3000",
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {"name": order.email},  # Use appropriate product name
                        "unit_amount": int(order.total_price * 100),  # Amount in cents
                    },
                    "quantity": 1,
                }
            ],
            metadata=metadata,
        )
        return {"sessionId": session.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.post("/webhook/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)
    except ValueError:
        # Invalid payload
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        # Invalid signature
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session_data = event["data"]["object"]

        # Retrieve metadata
        metadata = session_data.get("metadata", {})
        order_id = metadata.get("order_id")
        buyer_id = metadata.get("buyer_id")
        total_price = float(metadata.get("total_price"))
        meals_json = metadata.get("meals", "[]")
        meals_data = json.loads(meals_json)

        # Convert meal IDs from the metadata to a list.
        meal_ids = [meal["id"] for meal in meals_data if "id" in meal]

        # Query the Meal model to get the Meal instances
        meal_instances = db.query(Meal).filter(Meal.id.in_(meal_ids)).all()

        # Create the order now that payment is complete
        new_order = Order(
            id=order_id,
            buyer_id=buyer_id,
            meals=meal_instances,
            total_price=total_price,
        )
        db.add(new_order)
        db.commit()

    return {"status": "success"}
