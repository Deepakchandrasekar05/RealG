import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { ArrowLeft, RefreshCw } from "lucide-react";

interface AttendanceRecord {
  id: number;
  uid: string;
  name: string;
  timestamp: string;
}

const Attendance: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://realgbackend-production.up.railway.app/api/attendance");
      if (!response.ok) throw new Error("Failed to fetch attendance data");
      const data = await response.json();
      setAttendanceData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setError("Failed to load attendance data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-[#1E1E1E] transition-colors duration-300">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Attendance Log</h1>
              <p className="text-sm text-[#888]">
                {format(new Date(), "MMMM d, yyyy")}
              </p>
            </div>
          </div>
          <button
            onClick={fetchAttendance}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-[#1E1E1E] rounded-lg hover:bg-[#FF0000] hover:bg-opacity-20 transition-colors duration-300"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            <span className="hidden md:inline">Refresh</span>
          </button>
        </div>

        {/* Content */}
        <div className="bg-[#1E1E1E] rounded-xl shadow-lg overflow-hidden border border-[#2E2E2E]">
          {error ? (
            <div className="p-6 text-center text-[#FF0000]">
              {error}
              <button
                onClick={fetchAttendance}
                className="mt-2 px-4 py-2 bg-[#FF0000] bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors duration-300"
              >
                Retry
              </button>
            </div>
          ) : loading ? (
            <div className="p-6 text-center text-[#888]">Loading attendance data...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0A0A0A] border-b border-[#2E2E2E]">
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#888] uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#888] uppercase tracking-wider">
                      UID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#888] uppercase tracking-wider">
                      Worker Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#888] uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2E2E2E]">
                  {attendanceData.length > 0 ? (
                    attendanceData.map((record) => (
                      <tr key={record.id} className="hover:bg-[#2E2E2E] transition-colors duration-300">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {record.id}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#888]">
                          {record.uid}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-white">
                          {record.name}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#888]">
                          {format(new Date(record.timestamp), "MMM d, yyyy hh:mm a")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-sm text-[#888]">
                        No attendance records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mobile Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4 md:hidden">
          <div className="bg-[#1E1E1E] p-4 rounded-lg border border-[#2E2E2E]">
            <p className="text-sm text-[#888]">Total Workers</p>
            <p className="text-xl font-bold text-white">{attendanceData.length}</p>
          </div>
          <div className="bg-[#1E1E1E] p-4 rounded-lg border border-[#2E2E2E]">
            <p className="text-sm text-[#888]">Last Updated</p>
            <p className="text-sm text-white">
              {format(new Date(), "hh:mm a")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;