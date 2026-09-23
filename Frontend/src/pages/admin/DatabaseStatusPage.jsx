import { useState, useEffect } from 'react';
import adminService from "../../services/adminService";

const DatabaseStatusPage = () => {
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchDbStatus = async () => {
      try {
        const response = await adminService.getDatabaseStatus();
        
        // 1. Log the exact response to see its structure
        console.log("RAW API RESPONSE:", response);
        
        // 2. Cover all bases depending on how your api.js interceptor is built
        const actualData = response?.data?.data || response?.data || response;
        
        console.log("EXTRACTED DATA:", actualData);
        setDbData(actualData);
        
      } catch (error) {
        // 3. Log the exact error if the request is being blocked
        console.error('DB Status API Failed:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDbStatus();
  }, []);

  const isConnected = dbData?.connectionState === 'Connected';

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Database Status</h1>
      
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">MongoDB Atlas Cluster</h2>
            <p className="text-sm text-slate-500 mt-1">
              {loading ? 'Loading connection info...' : `Host: ${dbData?.host} | DB: ${dbData?.databaseName}`}
            </p>
          </div>
          <span className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold border rounded-full ${
            isConnected ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-red-700 bg-red-50 border-red-100'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></span> 
            {dbData?.connectionState || (loading ? 'Checking...' : 'Disconnected')}
          </span>
        </div>

        <div className="mb-10">
          <div className="flex justify-between text-sm font-bold mb-2">
            <span className="text-slate-700">Storage Capacity</span>
            <span className="text-blue-600">124 MB / 512 MB</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full w-[24%]"></div>
          </div>
          <p className="text-xs text-right text-slate-400 mt-2 font-medium">24% utilized</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl">
            <p className="text-sm font-semibold text-slate-500 mb-1">Total Parsed Resumes</p>
            <p className="text-3xl font-bold text-slate-900">124</p>
          </div>
          <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl">
            <p className="text-sm font-semibold text-slate-500 mb-1">Active Job Descriptions</p>
            <p className="text-3xl font-bold text-slate-900">12</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseStatusPage;