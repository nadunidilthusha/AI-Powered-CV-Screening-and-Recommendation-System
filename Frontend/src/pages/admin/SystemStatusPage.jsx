const SystemStatusPage = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">System Status</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider">NODE.JS BACKEND</h3>
            <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded">Online</span>
          </div>
          <p className="text-4xl font-bold text-slate-900 mb-1">99.9%</p>
          <p className="text-sm text-slate-400 font-medium">Uptime (Last 30 days)</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider">PYTHON AI ENGINE</h3>
            <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded">Online</span>
          </div>
          <p className="text-4xl font-bold text-slate-900 mb-1">320ms</p>
          <p className="text-sm text-slate-400 font-medium">Average Response Latency</p>
        </div>

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