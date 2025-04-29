// Updated Sidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Camera,
  MapPin,
  Users,
  AlertTriangle,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import logo from "../assets/RealG logo.png"; // Update this path

interface SidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose, isMobile = false }) => {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Camera, label: "CCTV Monitoring", path: "/cctv" },
    { icon: MapPin, label: "Worker Tracking", path: "/tracking" },
    { icon: Users, label: "Attendance", path: "/attendance" },
    { icon: AlertTriangle, label: "Alerts", path: "/alerts" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className={`h-full bg-[#0A0A0A] text-white flex flex-col border-r border-[#1E1E1E] ${isMobile ? "w-64 fixed inset-y-0 z-50" : "w-64"}`}>
      {/* Logo Section with your logo */}
      <div className="p-6 border-b border-[#1E1E1E] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src={logo} 
            alt="RealG Logo" 
            className="h-12 w-auto" // Adjust size as needed
          />
          <div>
            <h1 className="text-xl font-bold text-white tracking-wider">RealG</h1>
            <p className="text-xs text-[#888]">Emergency Alert System</p>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="text-[#888] hover:text-white transition-colors duration-300 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Rest of the sidebar remains the same */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive
                      ? "bg-[#FF0000] bg-opacity-20 text-white border-l-4 border-[#FF0000]"
                      : "text-[#888] hover:bg-[#1E1E1E] hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon 
                      size={20} 
                      className={`transition-colors duration-300 ${
                        isActive ? "text-[#FF0000]" : "text-[#888] group-hover:text-[#FF0000]"
                      }`} 
                    />
                    <span className="text-sm font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-[#1E1E1E]">
        <button className="flex items-center space-x-3 text-[#888] hover:text-white w-full px-4 py-3 rounded-lg transition-all duration-300 hover:bg-[#1E1E1E] group">
          <LogOut 
            size={20} 
            className="transition-colors duration-300 group-hover:text-[#FF0000]" 
          />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;