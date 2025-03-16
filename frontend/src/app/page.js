"use client";
import { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { loginUser, registerUser } from "../../utils/auth";

export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isRegister, setIsRegister] = useState(false); // Toggle between login/register

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await loginUser(email, password);
        } catch (err) {
            setError("Invalid email or password");
        }

        setLoading(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            await registerUser(email, password, username);
        } catch (err) {
            setError("Registration failed. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <Card className="w-full max-w-sm shadow-lg rounded-2xl">
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom>
                        {isRegister ? "Register for CampusEats" : "Login to CampusEats"}
                    </Typography>

                    <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
                        {isRegister && (
                            <TextField
                                label="Username"
                                type="text"
                                variant="outlined"
                                fullWidth
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        )}
                        <TextField
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {isRegister && (
                            <TextField
                                label="Confirm Password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        )}

                        {error && (
                            <Typography color="error" className="text-sm text-red-500">
                                {error}
                            </Typography>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            color="primary"
                            disabled={loading}
                            className="rounded-xl text-lg"
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : isRegister ? "Register" : "Login"}
                        </Button>
                    </form>

                    <Typography align="center" variant="body2" className="mt-4">
                        {isRegister ? "Already have an account?" : "Don't have an account?"}
                        <Button color="secondary" onClick={() => setIsRegister(!isRegister)}>
                            {isRegister ? "Login" : "Register"}
                        </Button>
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}