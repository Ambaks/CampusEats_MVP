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

const timeSlots = ["12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM"];

const ActionButtons = () => {
  const [infoOpen, setInfoOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleInfoOpen = () => setInfoOpen(true);
  const handleInfoClose = () => setInfoOpen(false);

  const handleOrderOpen = () => setOrderOpen(true);
  const handleOrderClose = () => setOrderOpen(false);

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
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

      {/* Order Modal */}
      <Modal open={orderOpen} onClose={handleOrderClose} aria-labelledby="order-modal">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
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
          />

          {/* Delivery or Pickup Selection */}
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Delivery or Pickup?</Typography>
            <RadioGroup row>
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
            <Button variant="outlined" sx={{ flex: 1, mr: 1 }}>
              Add to Cart
            </Button>
            <Button variant="contained" color="secondary" sx={{ flex: 1 }}>
              Buy Now
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ActionButtons;
