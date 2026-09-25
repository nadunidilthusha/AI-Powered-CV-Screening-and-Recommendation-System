import { useState, useEffect } from 'react';
import adminService from "../../services/adminService";

const DatabaseStatusPage = () => {
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDbStatus = async () => {
      try {
        const response = await adminService.getDatabaseStatus();
        const actualData = response?.data?.data || response?.data || response;
        setDbData(actualData);
      } catch (error) {
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
              {loading
                ? 'Loading connection info...'
                : `Host: ${dbData?.host || 'N/A'} | DB: ${dbData?.databaseName || 'N/A'}`}
            </p>
          </div>
          <span
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold border rounded-full ${
              isConnected
                ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
                : 'text-red-700 bg-red-50 border-red-100'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isConnected ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            ></span>
            {dbData?.connectionState || (loading ? 'Checking...' : 'Disconnected')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl">
            <p className="text-sm font-semibold text-slate-500 mb-1">Total Candidates</p>
            <p className="text-3xl font-bold text-slate-900">
              {loading ? '—' : dbData?.candidateCount ?? 0}
            </p>
          </div>
          <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl">
            <p className="text-sm font-semibold text-slate-500 mb-1">Active Job Postings</p>
            <p className="text-3xl font-bold text-slate-900">
              {loading ? '—' : dbData?.jobCount ?? 0}
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
          <strong>Note:</strong> Storage metrics are managed by MongoDB Atlas and are not exposed
          via the Mongoose connection. Use the Atlas dashboard for capacity monitoring.
        </div>
      </div>
    </div>
  );
};

export default DatabaseStatusPage;