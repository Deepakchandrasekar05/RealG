import React, { useEffect, useState } from "react";
import { FaExclamationTriangle, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { FiX, FiAlertTriangle } from "react-icons/fi";
import fenceAlertSound from "../assets/Alert.mp3";

const Fence: React.FC = () => {
  const [breachDetected, setBreachDetected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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
        setIsVisible(true);
      } else {
        setBreachDetected(false);
        setIsVisible(false);
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
      intervalId = setInterval(fetchFenceStatus, 5000);
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
      setIsVisible(false);
    } catch (error) {
      console.error("Error clearing fence breach:", error);
    }
  };

  if (connectionError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-lg max-w-md mx-4">
          <div className="flex items-center">
            <FiAlertTriangle className="mr-2 text-xl" />
            <span>⚠️ Unable to connect to geofence monitoring server. Retrying...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isVisible || !breachDetected) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-fade-in border-l-4 border-red-600">
        <div className="p-6 relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FaExclamationTriangle className="text-red-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">🚧 Geofence Breach</h2>
                <p className="text-sm text-gray-500">Safety perimeter violation</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                title={isMuted ? "Unmute alerts" : "Mute alerts"}
              >
                {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
              </button>
              <button 
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>

          {/* Alert Content */}
          <div className="mb-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-800 font-medium">
                A worker has breached the safety perimeter. Immediate action required!
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end">
            <button
              onClick={handleDismiss}
              className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
            >
              <span>Acknowledge</span>
              <FiX size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fence;