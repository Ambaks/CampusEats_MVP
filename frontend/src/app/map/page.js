"use client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { fetchMeals } from "../services/api";
import { CiLocationArrow1 } from "react-icons/ci";

mapboxgl.accessToken = "pk.eyJ1IjoiYW1iaXRzIiwiYSI6ImNtOGtncnBkajA2dTYybXEwd3Rtam50NjAifQ.rkvAM2GeDlEVRc7UuHyjIQ";

const MapboxMap = () => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-98.5795, 39.8283],
      zoom: 5,
      pitch: 60,
      bearing: 0,
      antialias: true,
    });

    mapInstance.on("load", () => {
        mapInstance.setLayoutProperty("road-label", "visibility", "none"); // Hide road labels initially
        mapInstance.on("zoom", () => {
            const zoomLevel = mapInstance.getZoom();
            if (zoomLevel > 17) {
              mapInstance.setLayoutProperty("road-label", "visibility", "visible");
            } else {
              mapInstance.setLayoutProperty("road-label", "visibility", "none");
            }
          });
        
          // Remove points of interest and landmarks
          const layersToRemove = [
            "poi-label",
            "transit-label",
            "airport-label",
            "waterway-label",
            "natural-point-label",
            "natural-line-label",
            "water-line-label",
            "water-label",
            "road-number-shield", // Removes freeway and highway numbers
            "road-label",         // Removes road names and numbers
            "motorway-shield",    // Removes highway shields
            "motorway-number",    // Removes highway numbers
            "state-label", 
          ];
        layersToRemove.forEach((layer) => {
        if (mapInstance.getLayer(layer)) {
        mapInstance.setLayoutProperty(layer, "visibility", "none");
        }
    });
      mapInstance.addSource("osm-buildings", {
        type: "vector",
        url: "mapbox://mapbox.mapbox-streets-v8",
      });
      mapInstance.addLayer({
        id: "3d-buildings",
        source: "osm-buildings",
        "source-layer": "building",
        type: "fill-extrusion",
        paint: {
          "fill-extrusion-color": "#aaa",
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": 0,
          "fill-extrusion-opacity": 0.6,
        },
      });
      setMap(mapInstance);
    });

    return () => mapInstance.remove();
  }, []);

  useEffect(() => {
    if (!map) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setUserLocation({ latitude, longitude });
      map.flyTo({ center: [longitude, latitude], zoom: 16 });
      const mealData = await fetchMeals(latitude, longitude);
      setMeals(mealData);
      updateMealPins(mealData);
    });
  }, [map]);

  const updateMealPins = (mealData) => {
    if (!map) return;

    mealData.forEach((meal) => {
      const { latitude, longitude, image_url, name, price, rating } = meal;

      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = `url(${image_url})`;
      el.style.width = "40px";
      el.style.height = "40px";
      el.style.backgroundSize = "cover";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";

      el.addEventListener("click", () => setSelectedMeal(meal));

      new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .addTo(map);
    });
  };

  const goToUserLocation = () => {
    if (userLocation && map) {
      map.flyTo({ center: [userLocation.longitude, userLocation.latitude], zoom: 16 });
    }
  };

  return (
    <div style={{ position: "relative"}}>
      <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />

      <button
        onClick={goToUserLocation}
        style={{
            position: "absolute",
            bottom: "calc(100vh / 3)", // Ensures exactly 1/3 from the bottom
            right: "15px",
            backgroundColor: "#007AFF",
            color: "white",
            border: "none",  // Removed border for a cleaner look
            width: "50px",
            height: "50px",
            borderRadius: "50%", // Perfect circle
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            cursor: "pointer",
            zIndex: 1000,
            boxShadow: "0 4px 6px rgba(0,0,0,0.2)", // Adds depth
        }}
        >
        <CiLocationArrow1 />
        </button>


        {selectedMeal && (
        <div
            style={{
            position: "fixed", // Ensure it's fixed to viewport
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            color: "white",
            padding: "15px",
            borderRadius: "10px",
            textAlign: "center",
            maxWidth: "300px",
            zIndex: 1000,
            }}
        >
            <img
            src={selectedMeal.image_url}
            alt={selectedMeal.name}
            style={{ width: "100%", height: "auto", borderRadius: "5px" }}
            />
            <h3>{selectedMeal.name}</h3>
            <p>Price: ${selectedMeal.price}</p>
            <p>Rating: ⭐{selectedMeal.rating}/5</p>
            <button
            onClick={() => setSelectedMeal(null)}
            style={{
                backgroundColor: "#ff5555",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px",
            }}
            >
            Close
            </button>
        </div>
        )}

    </div>
  );
};

export default MapboxMap;
