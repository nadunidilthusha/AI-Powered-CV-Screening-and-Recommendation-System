import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CandidateFilters = ({ currentFilters, onApply, onClear, onClose }) => {
  const [matchValue, setMatchValue] = useState(currentFilters?.matchPercentage?.[0] || 0);
  
  // Track checkboxes individually
  const [status, setStatus] = useState({
    'Highly Recommended': currentFilters?.recommendationStatus?.includes('Highly Recommended') ?? true,
    'Recommended': currentFilters?.recommendationStatus?.includes('Recommended') ?? true,
    'Not Recommended': currentFilters?.recommendationStatus?.includes('Not Recommended') ?? false,
  });

  const handleCheckboxChange = (name) => {
    setStatus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleApply = () => {
    const activeStatuses = Object.keys(status).filter(key => status[key]);
    onApply({
      matchPercentage: [parseInt(matchValue), 100],
      recommendationStatus: activeStatuses
    });
  };

  const handleClear = () => {
    onClear();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Filter Candidates</h2>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-semibold text-slate-900">AI Match Percentage</label>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                Min: {matchValue}%
              </span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={matchValue}
              onChange={(e) => setMatchValue(e.target.value)}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-900 block mb-3">Recommendation Status</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-emerald-100 rounded-lg bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                <input type="checkbox" checked={status['Highly Recommended']} onChange={() => handleCheckboxChange('Highly Recommended')} className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-600 accent-emerald-500" />
                <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">Highly Recommended</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-blue-100 rounded-lg bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                <input type="checkbox" checked={status['Recommended']} onChange={() => handleCheckboxChange('Recommended')} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-600 accent-blue-600" />
                <span className="px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">Recommended</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                <input type="checkbox" checked={status['Not Recommended']} onChange={() => handleCheckboxChange('Not Recommended')} className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-600 accent-red-500" />
                <span className="px-2.5 py-1 text-xs font-semibold bg-red-50 text-red-600 rounded-full">Not Recommended</span>
              </label>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button onClick={handleClear} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            Clear
          </button>
          <button onClick={handleApply} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            Apply Filters
          </button>
        </div>

      </div>
    </div>
  );
};

export default CandidateFilters;