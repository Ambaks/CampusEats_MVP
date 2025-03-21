import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function StripePaymentButton({ price, mealName}) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price, meal_name: mealName }),
    });

    const { sessionId } = await res.json();
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId });
    setLoading(false);
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      style={{
        backgroundColor: loading ? "#aaa" : "#000",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "pointer",
        border: "none",
      }}
    >
      {loading ? "Processing..." : "Buy Now"}
    </button>
  );
}
