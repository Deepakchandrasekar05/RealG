import React, { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import alertSound from "../assets/alert.mp3"; // Add a sound file in your src folder
import "../Alert.css"; // For animation styles

interface AlertData {
  device_id: string;
  lat: string;
  lon: string;
}

const Alert: React.FC = () => {
  const [alert, setAlert] = useState<AlertData | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchAlert = async () => {
      try {
        const response = await fetch("https://realgbackend-production.up.railway.app/api/alert");
        const data = await response.json();

        if (data.alert) {
          setAlert(data.alert);
          setVisible(true);

          const audio = new Audio(alertSound);
          audio.play().catch((e) => console.error("Audio play failed:", e));
        }
      } catch (error) {
        console.error("Error fetching alert:", error);
      }
    };

    fetchAlert();
    const interval = setInterval(fetchAlert, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = async () => {
    try {
      await fetch("https://realgbackend-production.up.railway.app/api/alert/clear", {
        method: "POST",
      });
      setVisible(false);
      setAlert(null);
    } catch (error) {
      console.error("Error clearing alert:", error);
    }
  };

  const handleTrack = () => {
    if (alert) {
      const url = `https://www.google.com/maps?q=${alert.lat},${alert.lon}`;
      window.open(url, "_blank");
    }
  };

  return (
    visible && alert && (
      <div className="alert-popup">
        <FaExclamationTriangle className="alert-icon" />
        <div className="alert-title">🚨 SOS Alert!</div>
        <div className="alert-content">
          <p><strong>Device ID:</strong> {alert.device_id}</p>
          <p><strong>Latitude:</strong> {alert.lat}</p>
          <p><strong>Longitude:</strong> {alert.lon}</p>
        </div>
        <div className="alert-buttons">
          <button className="track-button" onClick={handleTrack}>📍 Track Now</button>
          <button className="dismiss-button" onClick={handleDismiss}>❌ Dismiss</button>
        </div>
      </div>
    )
  );
};

export default Alert;
