import { useState } from 'react';
import { Settings2 } from 'lucide-react';

import JobSelector from '../../features/reports/components/JobSelector';
import CandidateRanking from '../../features/reports/components/CandidateRanking';
import CandidateFilters from '../../features/reports/components/CandidateFilters';
import ExportCsvButton from '../../features/reports/components/ExportCsvButton';
import ExportPdfButton from '../../features/reports/components/ExportPdfButton';

const ReportsPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [selectedJob, setSelectedJob] = useState('');

  const [filters, setFilters] = useState({
    matchPercentage: [0, 100],
    recommendationStatus: [],
  });

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      matchPercentage: [0, 100],
      recommendationStatus: [],
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900">
            Reports
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Export and analyze candidate rankings
          </p>
        </div>

        {/* Responsive controls */}
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:w-auto lg:items-end">
          <div className="min-w-0 sm:col-span-2 lg:w-auto">
            <JobSelector
              selectedJob={selectedJob}
              onChange={(job) => setSelectedJob(job)}
            />
          </div>

          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="flex h-[42px] w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 lg:w-auto"
          >
            <Settings2 size={16} />
            Filter Candidates
          </button>

          <div className="w-full lg:w-auto">
            <ExportCsvButton
              selectedJob={selectedJob}
              filters={filters}
            />
          </div>

          <div className="w-full lg:w-auto">
            <ExportPdfButton
              selectedJob={selectedJob}
              filters={filters}
            />
          </div>
        </div>
      </div>

      <CandidateRanking
        selectedJob={selectedJob}
        filters={filters}
      />

      {isFilterOpen && (
        <CandidateFilters
          currentFilters={filters}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          onClose={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  );
};

export default ReportsPage;