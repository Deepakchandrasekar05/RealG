import React, { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import fenceAlertSound from "../assets/Alert.mp3";
import "../Fence.css";

const Fence: React.FC = () => {
  const [breachDetected, setBreachDetected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  const fetchFenceStatus = async () => {
    try {
      const response = await fetch("https://realgbackend-production.up.railway.app/api/fence", {
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setConnectionError(false);

      if (data.breach) {
        if (!breachDetected && !isMuted) {
          const audio = new Audio(fenceAlertSound);
          audio.play().catch((e) => console.error("Audio play failed:", e));
        }
        setBreachDetected(true);
      } else {
        setBreachDetected(false);
      }
    } catch (error) {
      console.error("Error fetching fence status:", error);
      setConnectionError(true);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const setupPolling = async () => {
      await fetchFenceStatus();
      intervalId = setInterval(fetchFenceStatus, 5000); // Poll faster
    };

    setupPolling();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isMuted]);

  const handleDismiss = async () => {
    try {
      await fetch("https://realgbackend-production.up.railway.app/api/fence/clear", {
        method: "POST",
      });
      setBreachDetected(false);
    } catch (error) {
      console.error("Error clearing fence breach:", error);
    }
  };

  if (connectionError) {
    return (
      <div className="connection-error">
        ⚠️ Unable to connect to geofence monitoring server. Retrying...
      </div>
    );
  }

  return (
    breachDetected && (
      <div className="fence-popup">
        <div className="fence-header">
          <FaExclamationTriangle className="fence-icon" />
          <div className="fence-title">🚧 GEOFENCE BREACH DETECTED</div>
          <button 
            className="mute-button"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Unmute alerts" : "Mute alerts"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        </div>

        <div className="fence-content">
          <p className="fence-message">A worker has breached the safety cone area. Immediate action required!</p>
        </div>

        <div className="fence-buttons">
          <button className="dismiss-button" onClick={handleDismiss}>
            ❌ Dismiss
          </button>
        </div>
      </div>
    )
  );
};

export default Fence; // Added default export