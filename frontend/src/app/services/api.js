const API_BASE_URL = "https://localhost:8000"; // Replace with actual backend URL

export const fetchMeals = async (userLat, userLon) => {
    const response = await fetch(`${API_BASE_URL}/meals/?user_lat=${userLat}&user_lon=${userLon}`);
    if (!response.ok) throw new Error("Failed to fetch meals");
    return await response.json();
};

export const createMeal = async (mealData, token) => {
    const response = await fetch(`${API_BASE_URL}/meals/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(mealData),
    });
    if (!response.ok) throw new Error("Failed to create meal");
    return await response.json();
};

export const deleteMeal = async (mealId, token) => {
    const response = await fetch(`${API_BASE_URL}/meals/${mealId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Failed to delete meal");
    return await response.json();
};
