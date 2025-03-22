"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Fab, Drawer, Card, CardContent, Typography } from "@mui/material";
import { Restaurant } from "@mui/icons-material";
import { fetchMeals } from "../services/api";
import useGeolocation from "../services/useGeolocation";


const MapComponent = dynamic(() => import("../components/MapComponent"), { ssr: false });

export default function MapView() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [meals, setMeals] = useState([]);
    const {location} = useGeolocation();

    // Fetch user location once when component mounts
    
    // Fetch meals only after location is set
    useEffect(() => {
        const loadMeals = async () => {
            if (!location || location.lat === null || location.lon === null) return;
            try {
                console.log("Fetching meals with LATLNG:", location.lat, location.lon);
                const data = await fetchMeals(location.lat, location.lon);
                console.log("Meals fetched:", data);
                setMeals(data);
            } catch (err) {
                console.error("Error fetching meals:", err);
            }
        };

        loadMeals();
    }, [location]); // Runs only when `location` updates

    return (
        <div className="relative h-screen w-screen">
            <MapComponent meals={meals} />

            <Fab
                color="primary"
                className="fixed top-[33%] right-4"
                onClick={() => setIsDrawerOpen(true)}
            >
                <Restaurant />
            </Fab>

            <Drawer
                anchor="bottom"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                PaperProps={{ sx: { borderRadius: "16px 16px 0 0", padding: 2, maxHeight: "70vh", overflow: "auto" } }}
            >
                <Typography variant="h6" align="center" gutterBottom>
                    Available Meals
                </Typography>
                {meals.map((meal) => (
                    <Card key={meal.id} className="mb-2 shadow-md">
                        <CardContent>
                            <Typography variant="h6">{meal.name}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </Drawer>
        </div>
    );
}
