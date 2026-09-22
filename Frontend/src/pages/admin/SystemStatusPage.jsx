import { useState, useEffect } from 'react';
import adminService from "../../services/adminService";

const SystemStatusPage = () => {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await adminService.getSystemStatus();
        setStatusData(response.data);
      } catch (error) {
        console.error('Failed to fetch system status:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">System Status</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Node.js Backend Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider">NODE.JS BACKEND</h3>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
              statusData?.serverStatus === 'Healthy' ? 'text-emerald-700 bg-emerald-100' : 'text-red-700 bg-red-100'
            }`}>
              {statusData?.serverStatus || (loading ? 'Loading...' : 'Offline')}
            </span>
          </div>
          <p className="text-4xl font-bold text-slate-900 mb-1">
            {statusData?.uptime || 'N/A'}
          </p>
          <p className="text-sm text-slate-400 font-medium">Server Uptime</p>
        </div>

        {/* Node.js Memory Usage (Replacing Python mockup for now) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider">SERVER MEMORY</h3>
            <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded">Active</span>
          </div>
          <p className="text-4xl font-bold text-slate-900 mb-1">
            {statusData?.memoryUsed || 'N/A'}
          </p>
          <p className="text-sm text-slate-400 font-medium">Heap Memory Utilized</p>
        </div>

        {/* BullMQ Task Queue (Static Mockup) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider">BULLMQ TASK QUEUE</h3>
            <span className="px-2 py-0.5 text-[10px] font-bold text-blue-700 bg-blue-100 rounded">Processing</span>
          </div>
          <p className="text-4xl font-bold text-blue-600 mb-1">8</p>
          <p className="text-sm text-slate-400 font-medium">Active CVs in pipeline</p>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusPage;