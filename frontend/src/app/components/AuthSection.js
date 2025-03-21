"use client";

import { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";

export default function AuthSection() {
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log("Logging in...");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Add your register logic here
    console.log("Registering...");
  };

  return (
    <Box>
      {isLogin ? (
        <>
          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              required
              sx={{ mb: 2 }}
            />
            <Button type="submit" fullWidth variant="contained" color="primary">
              Login
            </Button>
          </form>
          <Button
            fullWidth
            variant="text"
            color="secondary"
            onClick={() => setIsLogin(false)}
            sx={{ mt: 2 }}
          >
            Don't have an account? Register Now!
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h5" align="center" gutterBottom>
            Register
          </Typography>
          <form onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              required
              sx={{ mb: 2 }}
            />
            <Button type="submit" fullWidth variant="contained" color="primary">
              Register
            </Button>
          </form>
          <Button
            fullWidth
            variant="text"
            color="secondary"
            onClick={() => setIsLogin(true)}
            sx={{ mt: 2 }}
          >
            Already have an account? Login
          </Button>
        </>
      )}
    </Box>
  );
}
