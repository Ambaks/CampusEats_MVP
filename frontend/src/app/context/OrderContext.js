"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useCart } from "./CartContext";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { cart } = useCart(); // Get cart data

  const [order, setOrder] = useState({
    email: "",
    meals: [],
    total_price: 0,
  });

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

  const updateOrder = (newDetails) => {
    setOrder((prevOrder) => ({ ...prevOrder, ...newDetails }));
  };

  return (
    <OrderContext.Provider value={{ order, updateOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  return useContext(OrderContext);
};
