import {
  useState,
} from 'react';

import {
  Settings2,
} from 'lucide-react';

import JobSelector from '../../features/reports/components/JobSelector';
import CandidateRanking from '../../features/reports/components/CandidateRanking';
import CandidateFilters from '../../features/reports/components/CandidateFilters';
import ExportCsvButton from '../../features/reports/components/ExportCsvButton';
import ExportPdfButton from '../../features/reports/components/ExportPdfButton';

const ReportsPage = () => {
  const [
    isFilterOpen,
    setIsFilterOpen,
  ] = useState(false);

  const [
    selectedJob,
    setSelectedJob,
  ] = useState('');

  const [filters, setFilters] =
    useState({
      matchPercentage: [0, 100],
      recommendationStatus: [],
    });

  const handleApplyFilters = (
    newFilters
  ) => {
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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Reports
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Export and analyze
            candidate rankings
          </p>
        </div>

        <div className="flex items-end gap-3">
          <JobSelector
            selectedJob={
              selectedJob
            }
            onChange={(job) =>
              setSelectedJob(job)
            }
          />

          <button
            onClick={() =>
              setIsFilterOpen(true)
            }
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors h-[42px]"
          >
            <Settings2 size={16} />
            Filter Candidates
          </button>

          <ExportCsvButton
            selectedJob={
              selectedJob
            }
            filters={filters}
          />

          <ExportPdfButton
            selectedJob={
              selectedJob
            }
            filters={filters}
          />
        </div>
      </div>

      <CandidateRanking
        selectedJob={selectedJob}
        filters={filters}
      />

      {isFilterOpen && (
        <CandidateFilters
          currentFilters={
            filters
          }
          onApply={
            handleApplyFilters
          }
          onClear={
            handleClearFilters
          }
          onClose={() =>
            setIsFilterOpen(false)
          }
        />
      )}
    </div>
  );
};

export default ReportsPage;