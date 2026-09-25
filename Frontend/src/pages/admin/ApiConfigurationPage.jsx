import { useState, useEffect } from 'react';
import adminService from "../../services/adminService";

const ApiConfigurationPage = () => {
  const [geminiKey, setGeminiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [maskedKey, setMaskedKey] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadConfig = async () => {
    try {
      const response = await adminService.getApiConfig();
      const data = response.data?.data || response.data;
      if (data?.configured) {
        setConfigured(true);
        setMaskedKey(data.masked);
        setLastUpdated(data.updatedAt);
      } else {
        setConfigured(false);
        setMaskedKey('');
      }
    } catch (error) {
      console.error('Failed to load API config:', error);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleSaveConfig = async () => {
    if (!geminiKey || geminiKey.length < 20) {
      return alert('Please enter a valid Gemini API key (at least 20 characters).');
    }

    setIsSaving(true);
    try {
      await adminService.updateApiConfig({ apiKey: geminiKey });
      alert('API key saved securely.');
      setGeminiKey('');
      await loadConfig();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update API configuration.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">API Configuration</h1>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900">LLM Endpoints</h2>
        <p className="text-sm text-slate-500 mb-6 mt-1">
          Manage external AI provider keys securely. Keys are stored in MongoDB and never returned in full.
        </p>

        <div className="p-4 border border-slate-100 rounded-lg bg-slate-50/50">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-slate-900">Google Gemini API Key</label>
            <span
              className={`flex items-center gap-1.5 text-xs font-semibold ${
                configured ? 'text-emerald-600' : 'text-orange-500'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  configured ? 'bg-emerald-500' : 'bg-orange-500'
                }`}
              ></span>
              {configured ? 'Verified' : 'Pending'}
            </span>
          </div>

          {configured && (
            <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg">
              <p className="text-xs text-emerald-800">
                <strong>Currently stored:</strong> <code className="font-mono">{maskedKey}</code>
              </p>
              {lastUpdated && (
                <p className="text-xs text-emerald-700 mt-1">
                  Last updated: {new Date(lastUpdated).toLocaleString()}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Enter new Gemini key (AIzaSy...)"
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSaveConfig}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            The key is stored in MongoDB. It does not yet automatically update the Python microservice's .env — update that separately when rotating.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiConfigurationPage;