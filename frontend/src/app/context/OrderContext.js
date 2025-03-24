"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { cart } = useCart(); // Get cart data
  const { user } = useAuth();

  const [order, setOrder] = useState({
    email: "",
    meals: [],
    total_price: 0,
  });

  const [orders, setOrders] = useState([]); // Store fetched orders

  const fetchOrders = async () => {
    if (!user?.id) return; // Ensure user is logged in

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/orders/${user.id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
      setOrders(data); // Assuming response contains order list
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update order whenever cart changes
  useEffect(() => {
    const mealsFromCart = cart.map((item) => ({
        id: item.mealId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
    }));

    const totalPrice = mealsFromCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    setOrder((prevOrder) => ({
      ...prevOrder,
      meals: mealsFromCart,
      total_price: totalPrice,
    }));
  }, [cart]);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user?.id]); // Fetch orders when user changes

  const updateOrder = (newDetails) => {
    setOrder((prevOrder) => ({ ...prevOrder, ...newDetails }));
  };

  return (
    <OrderContext.Provider value={{ order, orders, setOrders, updateOrder, fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  return useContext(OrderContext);
};
