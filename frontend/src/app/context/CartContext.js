"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext"; // Assuming you use Firebase Auth

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  // Load cart from localStorage if guest
  useEffect(() => {
    if (!user || !user.id) {
      const localCart = localStorage.getItem("cart");
      setCart(localCart ? JSON.parse(localCart) : []);
    }
  }, [user]);

  // Load cart from backend if logged in
  useEffect(() => {
    if (user && user.id) {
      fetch(`/api/cart/${user.id}`)
        .then((res) => res.json())
        .then((data) => setCart(data.items || []))
        .catch((error) => console.error("Error fetching cart:", error));
    }
  }, [user]);

  // Add or update an item in the cart
  const addToCart = async (meal) => {
    let updatedCart = [...cart];

    // Check if meal already exists, update quantity instead of duplicating
    const existingItemIndex = updatedCart.findIndex((item) => item.mealId === meal.mealId);
    if (existingItemIndex !== -1) {
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + meal.quantity,
      };
    } else {
      updatedCart.push(meal);
    }

    if (user && user.id) {
      try {
        const response = await fetch(`/api/cart/${user.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: updatedCart }),
        });

        if (!response.ok) throw new Error("Failed to update cart on backend");
      } catch (error) {
        console.error("Error updating cart:", error);
        return;
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    setCart(updatedCart);
  };

  // Remove item from cart
  const removeFromCart = async (mealId) => {
    const updatedCart = cart.filter((item) => item.mealId !== mealId);

    if (user && user.id) {
      try {
        const response = await fetch(`/api/cart/${user.id}/${mealId}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to remove item from backend cart");
      } catch (error) {
        console.error("Error removing item from cart:", error);
        return;
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
    console.log("NEW CART: ", updatedCart)
    setCart(updatedCart);
  };

  // Update quantity of an item
  const updateQuantity = async (mealId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(mealId);
      return;
    }

    const updatedCart = cart.map((item) =>
      item.mealId === mealId ? { ...item, quantity: newQuantity } : item
    );

    if (user && user.id) {
      try {
        const response = await fetch(`/api/cart/${user.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: updatedCart }),
        });

        if (!response.ok) throw new Error("Failed to update cart quantity on backend");
      } catch (error) {
        console.error("Error updating cart quantity:", error);
        return;
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
    setCart(updatedCart);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
