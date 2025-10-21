import React, { useRef, useEffect, useState } from "react";

const ARExperience = ({ location, onClose }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState("");
  const [userPosition, setUserPosition] = useState(null);
  const [rewardUnlocked, setRewardUnlocked] = useState(false);

  useEffect(() => {
    // Camera access
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => setError("Camera access denied. Please allow camera to use AR mode."));
    // Geolocation access
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setError("Location access denied. Please allow location to use AR mode.")
      );
    } else {
      setError("Geolocation not supported on this device.");
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Example: Unlock reward if user is within 100m of location
  useEffect(() => {
    if (userPosition && location && location.coordinates) {
      const [lat2, lng2] = location.coordinates.split(",").map(Number);
      const R = 6371e3;
      const toRad = deg => deg * Math.PI / 180;
      const dLat = toRad(lat2 - userPosition.lat);
      const dLng = toRad(lng2 - userPosition.lng);
      const a = Math.sin(dLat/2) ** 2 + Math.cos(toRad(userPosition.lat)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      if (distance < 100 && !rewardUnlocked) setRewardUnlocked(true);
    }
  }, [userPosition, location, rewardUnlocked]);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 1000, background: "rgba(0,0,0,0.8)" }}>
      <video ref={videoRef} autoPlay playsInline style={{ position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh", objectFit: "cover" }} />
      <button
        onClick={onClose}
        aria-label="Close AR view"
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 2200,
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          borderRadius: 8,
          padding: "8px 12px",
          border: "1px solid rgba(255,255,255,0.12)",
          fontWeight: 600,
          backdropFilter: "blur(4px)"
        }}
      >
        Close AR
      </button>
      {error && <div style={{ position: "absolute", top: 80, left: 0, right: 0, color: "#fff", background: "#d32f2f", padding: 16, zIndex: 1100, textAlign: "center" }}>{error}</div>}
      {userPosition && location && (
        <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, zIndex: 1100, color: "#fff", textAlign: "center" }}>
          <h2>{location.name}</h2>
          <p>{location.overview?.description || "Explore this location in AR!"}</p>
          {rewardUnlocked && <div style={{ background: "#43a047", padding: 12, borderRadius: 8, marginTop: 8 }}>🎉 Badge Unlocked for visiting {location.name}!</div>}
        </div>
      )}
    </div>
  );
};

export default ARExperience;