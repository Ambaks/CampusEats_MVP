"use client"; 
import { useEffect } from "react";

export default function SuccessPage() {
    useEffect(() => {
        async function clearCart() {
            const user = JSON.parse(localStorage.getItem("user")); // Assuming user info is stored in localStorage

            if (user && user.token) {
                // User is logged in → Clear cart on backend
                try {
                    await fetch("http://localhost:8000/api/clear-cart", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user.token}`,
                        },
                    });
                } catch (error) {
                    console.error("Failed to clear cart on backend:", error);
                }
            } else {
                // User is not logged in → Clear cart from localStorage
                localStorage.removeItem("cart");
            }
        }

        clearCart();
    }, []);

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Success!</h1>
            <p style={styles.message}>Thank you for your order.</p>
            <p style={styles.instruction}>
                To view your orders, go to the <strong>Profile</strong> section of your app.
            </p>
        </div>
    );
}

// Simple inline styles
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
    },
    heading: {
        fontSize: "2rem",
        fontWeight: "bold",
        marginBottom: "10px",
    },
    message: {
        fontSize: "1.2rem",
        marginBottom: "5px",
    },
    instruction: {
        fontSize: "1rem",
        color: "#555",
    },
};
