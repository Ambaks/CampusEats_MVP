import { useState } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Grid,
  Card,
} from "@mui/material";
import { useCart } from "../context/CartContext";

const timeSlots = ["12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM"];

const ActionButtons = ({ meal }) => {
  const [infoOpen, setInfoOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const { addToCart } = useCart();

  const handleInfoOpen = () => setInfoOpen(true);
  const handleInfoClose = () => setInfoOpen(false);

  const handleOrderOpen = () => setOrderOpen(true);
  const handleOrderClose = () => setOrderOpen(false);

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Handle form submission.
  // e.nativeEvent.submitter.value tells us which button triggered the submit: "cart" or "buy"
  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = e.nativeEvent.submitter.value;

    // Gather form data into an object.
    const orderData = {
      mealId: meal.id,
      name: meal.name,
      image_url: meal.image_url,
      price: meal.price,
      quantity: quantity,
      deliveryOption: deliveryOption,
      pickupTime: selectedTime,
    };

    if (action === "cart") {
      // Submit to your backend or use your addToCart function.
      await addToCart(orderData);
      handleOrderClose();
    } else if (action === "buy") {
      // For a Buy Now action, you might submit the order data to a different endpoint.
      // Here we simulate the submission and then redirect to the /orders page.
      await addToCart(orderData);
      handleOrderClose();
      window.location.href = "/orders";
    }
  };

  return (
    <>
      {/* More Info Button */}
      <Button
        variant="outlined"
        size="small"
        sx={{
          borderRadius: "20px",
          borderColor: "primary.main",
          color: "primary.main",
        }}
        onClick={handleInfoOpen}
      >
        More Info
      </Button>

      {/* Order Now Button */}
      <Button
        variant="contained"
        color="secondary"
        size="small"
        sx={{ borderRadius: "20px", ml: 1 }}
        onClick={handleOrderOpen}
      >
        Order Now
      </Button>

      {/* More Info Modal */}
      <Modal open={infoOpen} onClose={handleInfoClose} aria-labelledby="info-modal">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            bgcolor: "white",
            boxShadow: 24,
            p: 3,
            borderRadius: "10px",
          }}
        >
          <Typography id="info-modal" variant="h6">
            Meal Details
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Here are details about the meal. Ingredients, preparation method, and other relevant info.
          </Typography>
          <Button onClick={handleInfoClose} sx={{ mt: 2 }} variant="contained">
            Close
          </Button>
        </Box>
      </Modal>

      {/* Order Modal as a Form */}
      <Modal
        open={orderOpen}
        onClose={handleOrderClose}
        aria-labelledby="order-modal"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* The form will stop propagation so clicks don't close the modal */}
        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
          <Box
            sx={{
              width: 400,
              bgcolor: "white",
              boxShadow: 24,
              p: 3,
              borderRadius: "10px",
            }}
          >
            <Typography id="order-modal" variant="h6">
              Place Your Order
            </Typography>

            {/* Quantity Selection */}
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              sx={{ mt: 2 }}
              inputProps={{ min: 1 }}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />

            {/* Delivery or Pickup Selection */}
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Delivery or Pickup?</Typography>
              <RadioGroup
                row
                value={deliveryOption}
                onChange={(e) => setDeliveryOption(e.target.value)}
              >
                <FormControlLabel value="delivery" control={<Radio />} label="Delivery" />
                <FormControlLabel value="pickup" control={<Radio />} label="Pickup" />
              </RadioGroup>
            </FormControl>

            {/* Pickup Time Slots */}
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Select a Pickup Time
            </Typography>
            <Grid container spacing={1} sx={{ mt: 1 }}>
              {timeSlots.map((time) => (
                <Grid item xs={4} key={time}>
                  <Card
                    sx={{
                      p: 1,
                      textAlign: "center",
                      cursor: "pointer",
                      bgcolor: selectedTime === time ? "primary.main" : "grey.300",
                      color: selectedTime === time ? "white" : "black",
                      borderRadius: "8px",
                    }}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
              {/* Button to add to cart; value "cart" is used in submit handler */}
              <Button
                variant="outlined"
                sx={{ flex: 1, mr: 1 }}
                type="submit"
                value="cart"
              >
                Add to Cart
              </Button>
              {/* Button to buy now; value "buy" is used in submit handler */}
              <Button
                variant="contained"
                color="secondary"
                sx={{ flex: 1 }}
                type="submit"
                value="buy"
              >
                Buy Now
              </Button>
            </Box>
          </Box>
        </form>
      </Modal>
    </>
  );
};

export default ActionButtons;
