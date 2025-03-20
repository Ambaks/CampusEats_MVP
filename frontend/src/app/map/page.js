"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Fab, Drawer, Card, CardContent, Typography } from "@mui/material";
import { Restaurant } from "@mui/icons-material";

const MapComponent = dynamic(() => import("../components/MapComponent"), { ssr: false });

export default function MapView() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    const meals = [
        { id: 1, name: "Spaghetti Bolognese", location: [37.7749, -122.4194] },
        { id: 2, name: "Chicken Tikka", location: [37.7849, -122.4094] },
        { id: 3, name: "Sushi Rolls", location: [37.7649, -122.4294] },
    ];

    return (
        <div className="relative h-screen w-screen">
            {/* Dynamically Loaded Map */}
            <MapComponent meals={meals} />

            {/* Floating Action Button */}
            <Fab
                color="primary"
                className="fixed top-[33%] right-4"
                onClick={() => setIsDrawerOpen(true)}
            >
                <Restaurant />
            </Fab>

            {/* Drawer for Meal List */}
            <Drawer
                anchor="bottom"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                PaperProps={{ className: "rounded-t-2xl p-4 max-h-[70vh] overflow-auto" }}
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
