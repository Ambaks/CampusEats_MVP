"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
} from "@mui/material";
import Image from "next/image";
import { useCart } from "../context/CartContext"; // Adjust path if needed

export default function OrdersPage() {
  const { cart } = useCart(); // Retrieve cart items from context

  // Example shipping cost / calculation
  const shippingCost = 0; // Could be dynamic

  // Example subtotal calculation
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  // Example total
  const total = subtotal + shippingCost;

  // Email & phone states
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // Checkbox for newsletter
  const [newsletter, setNewsletter] = useState(true);
  // Discount code
  const [discountCode, setDiscountCode] = useState("");

  // Payment form states
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit");
  const [rememberMe, setRememberMe] = useState(true);
  const [rememberPhone, setRememberPhone] = useState("");

  const handleApplyDiscount = () => {
    alert(`Applying discount code: ${discountCode}`);
  };

  const handlePayNow = () => {
    // Basic validation for required fields
    if (!email || !phone) {
      alert("Please fill in the required fields (email & phone).");
      return;
    }
    // Example: proceed to payment or integrate with your payment provider
    alert("Redirecting to payment...");
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        p: { xs: 2, md: 4 },
        maxWidth: 1200,
        mx: "auto",
        mb: 8,
        borderRadius: 2,        // Corner radius
        border: "1px solid #ccc", // Light gray border
        boxShadow: 4,           // Material UI shadow level
      }}
    >
      <Grid container spacing={4}>
        {/* LEFT COLUMN (Contact, Payment, etc.) */}
        <Grid item xs={12} md={6}>
          {/* Express Checkout Options */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, color: "black" }}>
              Express checkout
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#5a31f4", color: "white", minWidth: 100 }}
              >
                Shop Pay
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#ffc439", color: "black", minWidth: 100 }}
              >
                PayPal
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "black", color: "white", minWidth: 100 }}
              >
                Apple Pay
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#3d95ce", color: "white", minWidth: 100 }}
              >
                Venmo
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#4285f4", color: "white", minWidth: 100 }}
              >
                Google Pay
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Contact */}
          <Box sx={{ mt: 2 }}>
            <Typography sx={{color: "black"}} variant="h6" gutterBottom>
              Contact
            </Typography>
            <TextField
              label="Email"
              fullWidth
              required
              sx={{ mb: 2 }}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormControlLabel
              sx={{color: "black"}}
              control={
                <Checkbox
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                />
              }
              label="Email me with news and offers"
            />
          </Box>

          {/* Phone Field */}
          <TextField
            label="Phone"
            fullWidth
            required
            sx={{ mb: 2, mt: 2 }}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Divider sx={{my: 2}}/>

          {/* Payment Section */}
          <Box sx={{ mt: 2, color: "black" }}>
            <Typography variant="h6" gutterBottom>
              Payment
            </Typography>

            {/* Credit Card Fields */}
            <Typography>
              Credit / Debit Card
            </Typography>
            {selectedPaymentMethod === "credit" && (
              <>
                <TextField
                  label="Card number"
                  fullWidth
                  sx={{ mb: 2, mt: 1 }}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField
                    label="Expiration date (MM / YY)"
                    sx={{ flex: 1 }}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                  <TextField
                    label="Security code"
                    sx={{ flex: 1 }}
                    value={cardCVC}
                    onChange={(e) => setCardCVC(e.target.value)}
                  />
                </Box>
              </>
            )}
          </Box>
        </Grid>

        {/* RIGHT COLUMN (Order Summary) */}
        <Grid item xs={12} md={6}>
          <Box sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2 }}>
            <Typography sx={{color: "black"}} variant="h6" gutterBottom>
              Order summary
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Cart Items */}
            {cart.length === 0 ? (
              <Typography sx={{color: "black"}} variant="body2">
                Your cart is empty.
              </Typography>
            ) : (
              cart.map((item, index) => (
                <Box key={index} sx={{ display: "flex", mb: 2 }}>
                  {item.image && (
                    <Box sx={{ mr: 2 }}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                      />
                    </Box>
                  )}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{color: "black"}}>{item.name}</Typography>
                    {item.size && (
                      <Typography sx={{color: "black"}} variant="body2" >
                        {item.size}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography sx={{color: "black"}}>
                      ${(item.price || 0) * (item.quantity || 1)}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}

            {/* Discount code / Gift card */}
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <TextField
                placeholder="Discount code or gift card"
                fullWidth
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <Button variant="outlined" onClick={handleApplyDiscount}>
                Apply
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Subtotal & Shipping */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography sx={{color: "black"}}>Subtotal</Typography>
              <Typography sx={{color: "black"}}>${subtotal.toFixed(2)}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
            </Box>
            <Divider sx={{ mb: 2 }} />

            {/* Total */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography sx={{color: "black"}} variant="subtitle1">Total</Typography>
              <Typography sx={{color: "black"}} variant="subtitle1">
                ${(subtotal).toFixed(2)}
              </Typography>
            </Box>

            {/* Payment Button */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ borderRadius: 2 }}
              onClick={handlePayNow}
            >
              Pay now
            </Button>

            {/* Payment security info, etc. */}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Secure and encrypted
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
