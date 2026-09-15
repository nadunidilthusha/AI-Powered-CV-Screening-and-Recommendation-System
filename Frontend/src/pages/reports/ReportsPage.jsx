import { useState } from 'react';
import JobSelector from '../../features/reports/components/JobSelector';
import CandidateRanking from '../../features/reports/components/CandidateRanking';
import CandidateFilters from '../../features/reports/components/CandidateFilters';
import ExportCsvButton from '../../features/reports/components/ExportCsvButton';
import ExportPdfButton from '../../features/reports/components/ExportPdfButton';
import { Settings2 } from 'lucide-react';

const ReportsPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // State lifted from child components to coordinate filtering and exporting
  const [selectedJob, setSelectedJob] = useState('');
  const [filters, setFilters] = useState({
    matchPercentage: [0, 100],
    recommendationStatus: [],
  });
  
  // Holds the currently filtered table data so the Export buttons can access it
  const [currentTableData, setCurrentTableData] = useState([]);

  // Handles TC_RE_006: Applying filters and closing the modal
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
  };

  // Handles TC_RE_007: Clearing filters back to defaults
  const handleClearFilters = () => {
    setFilters({
      matchPercentage: [0, 100],
      recommendationStatus: [],
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Export and analyze candidate rankings</p>
        </div>

        {/* FIX: Changed items-center to items-end to fix vertical alignment with the dropdown label */}
        <div className="flex items-end gap-3">
          
          {/* TC_RE_001: Job Selection now updates the central state */}
          <JobSelector 
            selectedJob={selectedJob} 
            onChange={(job) => setSelectedJob(job)} 
          />
          
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors h-[42px]"
          >
            <Settings2 size={16} />
            Filter Candidates
          </button>
          
          {/* TC_RE_008 & TC_RE_009: Export buttons now receive the active table data */}
          <ExportCsvButton data={currentTableData} selectedJob={selectedJob} />
          <ExportPdfButton data={currentTableData} selectedJob={selectedJob} />
        </div>
      </div>

      {/* Main Table: Receives the selected job and filters, and sends back the filtered data */}
      <CandidateRanking 
        selectedJob={selectedJob} 
        filters={filters} 
        onDataUpdate={setCurrentTableData} 
      />

      {/* Filter Modal */}
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