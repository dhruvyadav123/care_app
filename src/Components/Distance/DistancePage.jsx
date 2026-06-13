import React, { useState } from "react";

const DistancePage = () => {
  const [distance, setDistance] = useState(null);

  // Fixed location — Taj Mahal (Agra)
  const destination = { lat: 27.1751, lon: 78.0421 };

  // Function to calculate distance between two lat/lon points (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2); // distance in KM
  };

  const handleGetDistance = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLat = pos.coords.latitude;
          const userLon = pos.coords.longitude;
          const dist = calculateDistance(
            userLat,
            userLon,
            destination.lat,
            destination.lon
          );
          setDistance(dist);
        },
        (err) => {
          alert("Location access denied. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div
      style={{
        height: "50vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>📍 Distance Calculator</h1>
      <p style={{ fontSize: "18px", marginBottom: "10px" }}>
        {distance
          ? `You are ${distance} km away from the Taj Mahal`
          : "Click the button to calculate distance"}
      </p>
      <button
        onClick={handleGetDistance}
        style={{
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Get Distance
      </button>
    </div>
  );
};

export default DistancePage;
