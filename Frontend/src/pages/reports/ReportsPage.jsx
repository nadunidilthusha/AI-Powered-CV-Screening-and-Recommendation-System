import { useState } from 'react';
import JobSelector from '../../features/reports/components/JobSelector';
import CandidateRanking from '../../features/reports/components/CandidateRanking';
import CandidateFilters from '../../features/reports/components/CandidateFilters';
import ExportCsvButton from '../../features/reports/components/ExportCsvButton';
import ExportPdfButton from '../../features/reports/components/ExportPdfButton';
import { Settings2 } from 'lucide-react';

const ReportsPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Export and analyze candidate rankings</p>
        </div>

        <div className="flex items-center gap-3">
          <JobSelector />
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Settings2 size={16} />
            Filter Candidates
          </button>
          <ExportCsvButton />
          <ExportPdfButton />
        </div>
      </div>

      {/* Main Table */}
      <CandidateRanking />

      {/* Filter Modal */}
      {isFilterOpen && (
        <CandidateFilters onClose={() => setIsFilterOpen(false)} />
      )}
    </div>
  );
};

export default ReportsPage;