const ApiConfigurationPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">API Configuration</h1>
      
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900">LLM Endpoints</h2>
        <p className="text-sm text-slate-500 mb-6 mt-1">Manage external AI provider keys securely. Keys are encrypted at rest.</p>

        <div className="space-y-6">
          {/* OpenAI Key */}
          <div className="p-4 border border-slate-100 rounded-lg bg-slate-50/50">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-slate-900">OpenAI API Key (GPT-4o)</label>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified
              </span>
            </div>
            <div className="flex gap-3">
              <input 
                type="password" 
                defaultValue="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
                readOnly
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-500 focus:outline-none" 
              />
              <button className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                Reveal
              </button>
            </div>
          </div>

          {/* Gemini Key */}
          <div className="p-4 border border-slate-100 rounded-lg bg-slate-50/50">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-slate-900">Google Gemini API Key</label>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-orange-500">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Pending
              </span>
            </div>
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="Enter Gemini key (AIzaSy...)" 
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Save & Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiConfigurationPage;