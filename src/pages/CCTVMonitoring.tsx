import React from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';

const CCTVMonitoring: React.FC = () => {
  const navigate = useNavigate();
  const cameras = [1, 2, 3, 4, 5];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-gray-300 mb-2">
            Surveillance Control Center
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Real-time monitoring from all security cameras
          </p>
        </div>

        {/* Camera Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-3 gap-6">
          {cameras.map((cameraId) => (
            <div 
              key={cameraId} 
              className="bg-[#424242] rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-red-900/20 group"
            >
              {/* Camera Feed */}
              <div className="relative aspect-video bg-black">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                <Webcam
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-md">
                  LIVE
                </div>
              </div>

              {/* Camera Info */}
              <div className="p-4 md:p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-100">Camera #{cameraId}</h3>
                  <span className="text-xs text-gray-400">Floor {cameraId}</span>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => navigate(`/history/${cameraId}`)}
                    className="flex-1 bg-transparent border border-gray-600 hover:border-red-500 text-gray-300 hover:text-white py-2 px-3 rounded-lg transition-all duration-200 hover:bg-gray-700/50 text-sm font-medium"
                  >
                    View History
                  </button>
                  <button
                    onClick={() => navigate(`/camera/${cameraId}`)}
                    className="flex-1 bg-[#7d0101] hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-all duration-200 hover:shadow-md hover:shadow-red-500/30 text-sm font-medium"
                  >
                    Control Panel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-xs">
            Last system update: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CCTVMonitoring;