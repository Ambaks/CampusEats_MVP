"use client";

import { useState } from "react";
import { TextField, Button, Avatar, MenuItem, Typography, Paper } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

export default function ProfilePage() {
  // User state
  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    phone: "+123456789",
    gender: "Male",
    age: 25,
    username: "johndoe",
    profilePicture: "/default-avatar.png",
  });

  // Handle input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle profile picture upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, profilePicture: imageUrl });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Paper className="p-6 mb-14 w-full max-w-md shadow-lg rounded-xl bg-white">
        <Typography variant="h5" align="center" gutterBottom>
          Edit Profile
        </Typography>

        {/* Profile Picture */}
        <div className="flex flex-col items-center my-4">
          <Avatar src={user.profilePicture} sx={{ width: 100, height: 100, marginBottom: 2, }} />
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUpload />}
            className="mt-2"
          >
            Upload Photo
            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
          </Button>
        </div>

        {/* Profile Form */}
        <form className="space-y-4">
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={user.email}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            select
            label="Gender"
            name="gender"
            value={user.gender}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Age"
            name="age"
            type="number"
            value={user.age}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={user.username}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          
          {/* Save Button */}
          <Button fullWidth variant="contained" color="primary">
            Save Changes
          </Button>
        </form>
      </Paper>
    </div>
  );
}
