import {
  useEffect,
  useState,
} from 'react';

import {
  X,
} from 'lucide-react';

const CandidateFilters = ({
  currentFilters,
  onApply,
  onClear,
  onClose,
}) => {
  const [
    matchValue,
    setMatchValue,
  ] = useState(
    currentFilters
      ?.matchPercentage?.[0] || 0
  );

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState(
    currentFilters
      ?.recommendationStatus?.[0] ||
      ''
  );

  useEffect(() => {
    setMatchValue(
      currentFilters
        ?.matchPercentage?.[0] || 0
    );

    setSelectedStatus(
      currentFilters
        ?.recommendationStatus?.[0] ||
        ''
    );
  }, [currentFilters]);

  const handleStatusChange = (
    status
  ) => {
    setSelectedStatus(
      selectedStatus === status
        ? ''
        : status
    );
  };

  const handleApply = () => {
    onApply({
      matchPercentage: [
        Number(matchValue),
        100,
      ],

      recommendationStatus:
        selectedStatus
          ? [selectedStatus]
          : [],
    });
  };

  const handleClear = () => {
    setMatchValue(0);
    setSelectedStatus('');

    onClear();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6">
          <h2 className="text-lg font-bold text-slate-900">
            Filter Candidates
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100"
            aria-label="Close filter modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-4 sm:p-6">
          {/* Match Percentage */}
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <label className="text-sm font-semibold text-slate-900">
                AI Match Percentage
              </label>

              <span className="shrink-0 rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                Min: {matchValue}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={matchValue}
              onChange={(e) =>
                setMatchValue(
                  e.target.value
                )
              }
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
            />

            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Recommendation Status */}
          <div>
            <label className="mb-3 block text-sm font-semibold text-slate-900">
              Recommendation Status
            </label>

            <div className="space-y-3">
              {/* Highly Recommended */}
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-emerald-100 bg-white p-3 transition-colors hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={
                    selectedStatus ===
                    'Highly Recommended'
                  }
                  onChange={() =>
                    handleStatusChange(
                      'Highly Recommended'
                    )
                  }
                  className="h-4 w-4 shrink-0 rounded border-slate-300 accent-emerald-500"
                />

                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  Highly Recommended
                </span>
              </label>

              {/* Recommended */}
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-blue-100 bg-white p-3 transition-colors hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={
                    selectedStatus ===
                    'Recommended'
                  }
                  onChange={() =>
                    handleStatusChange(
                      'Recommended'
                    )
                  }
                  className="h-4 w-4 shrink-0 rounded border-slate-300 accent-blue-600"
                />

                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  Recommended
                </span>
              </label>

              {/* Not Recommended */}
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-100 bg-white p-3 transition-colors hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={
                    selectedStatus ===
                    'Not Recommended'
                  }
                  onChange={() =>
                    handleStatusChange(
                      'Not Recommended'
                    )
                  }
                  className="h-4 w-4 shrink-0 rounded border-slate-300 accent-red-500"
                />

                <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                  Not Recommended
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={handleClear}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 sm:w-auto"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateFilters;