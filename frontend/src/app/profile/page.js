"use client";

import { useState } from "react";
import { Paper } from "@mui/material";
import ProfileForm from "../components/ProfileForm";
import AuthSection from "../components/AuthSection";

export default function ProfilePage() {
  // User state (null if no user is detected)
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Paper className="p-6 mb-14 w-full max-w-md shadow-lg rounded-xl bg-white">
        {user.id ? (
          <ProfileForm user={user} setUser={setUser} />
        ) : (
          <AuthSection />
        )}
      </Paper>
    </div>
  );
}
