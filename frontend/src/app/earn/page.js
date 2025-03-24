"use client";
import { useState } from "react";
import { TextField, Button, Typography, Container, MenuItem, Grid, Card, CardContent, Drawer, Box } from "@mui/material";
import { Link } from "react-router-dom";
import Menu from "../components/Menu";
import dummyMeals from "./dummyMeals";
import OrdersTab from "../components/OrdersTab";
import OrderHistory from "../components/OrderHistory";
import SellerSettings from "../components/SellerSettings";

const mealCategories = ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack"];
const dashboardOptions = [
  { title: "Orders", description: "View and manage incoming orders." },
  { title: "Order History", description: "Review past transactions and completed orders." },
  { title: "Menu", description: "Manage your meal listings and update availability." },
  { title: "Settings", description: "Adjust your preferences and account settings." },
];

export default function SellerDashboard() {
  const [openDrawer, setOpenDrawer] = useState(null);
  const [meals, setMeals] = useState(dummyMeals);

  // Dummy statistics (replace with real data from API)
  const totalSales = 1250.75;
  const totalOrders = 48;
  const pendingEarnings = 300.50;

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{mt: 2}} gutterBottom>
        Seller Dashboard
      </Typography>

      {/* Performance Overview Card */}
      <Card sx={{ backgroundColor: "#008080", color: "white", p: 2, mb: 2, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            Performance Overview
          </Typography>
          <Typography variant="body1">💰 Total Sales: ${totalSales.toFixed(2)}</Typography>
          <Typography variant="body1">📦 Total Orders: {totalOrders}</Typography>
          <Typography variant="body1">🔄 Pending Earnings: ${pendingEarnings.toFixed(2)}</Typography>
        </CardContent>
      </Card>

      <Typography variant="body1" gutterBottom>
        Manage your meal listings, track orders, and customize your settings.
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {dashboardOptions.map((option) => (
          <Grid item xs={6} sm={4} md={3} key={option.title}>
            <Card
              sx={{ backgroundColor: "#008080", color: "white", height: "100%", cursor: "pointer" }}
              onClick={() => setOpenDrawer(option.title)}
            >
              <CardContent>
                <Typography variant="h6">{option.title}</Typography>
                <Typography variant="body2">{option.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Drawer anchor="bottom" open={openDrawer !== null} onClose={() => setOpenDrawer(null)}>
        <Box sx={{ height: "100vh", backgroundColor: "white", position: "relative" }}>
          <Box sx={{ width: "100%", textAlign: "center", p: 1, cursor: "pointer" }} onClick={() => setOpenDrawer(null)}>
            <Box sx={{ width: 40, height: 5, backgroundColor: "gray", borderRadius: 2, mx: "auto" }}></Box>
          </Box>
          {openDrawer === "Menu" && <Menu meals={meals} setMeals={setMeals} />}
          {openDrawer === "Orders" && <OrdersTab />}
          {openDrawer === "Order History" && <OrderHistory />}
          {openDrawer === "Settings" && <SellerSettings />}
        </Box>
      </Drawer>
    </Container>
  );
}
