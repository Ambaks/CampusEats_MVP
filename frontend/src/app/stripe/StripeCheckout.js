// lib/stripeCheckout.js
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51IZ8EqBz9xzk5af0ceNZLvPdzmtpCGwWbJQdjLOzIEHy7VDyKPZN4NT9p8BkKTs01dJ9WuzT06rOJ6YgLHKGldoZ00Oh9842gH");

/**
 * Redirects the user to Stripe Checkout.
 * @param {string} sessionId - The Checkout Session ID from your backend.
 */
export const redirectToStripeCheckout = async (sessionId) => {
  const stripe = await stripePromise;
  if (!stripe) {
    throw new Error("Stripe failed to load.");
  }
  const { error } = await stripe.redirectToCheckout({ sessionId });
  if (error) {
    throw error;
  }
};
