import { ArrowDownToLine } from 'lucide-react';

const ExportCsvButton = ({ data }) => {
  const handleExport = () => {
    if (!data || data.length === 0) return alert("No data to export.");
    
    const headers = ['Rank', 'Candidate Name', 'Email', 'Match %', 'Recommendation'];
    const rows = data.map(c => `${c.rank},"${c.name}",${c.email},${c.match},"${c.recommendation}"`);
    const csvContent = [headers.join(","), ...rows].join("\n");
    
    // The "\uFEFF" BOM forces Excel to render the UTF-8 headers correctly
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = "candidates_ranking.csv";
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button 
      onClick={handleExport}
      className="flex items-center gap-2 px-4 h-[42px] bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
    >
      <ArrowDownToLine size={16} />
      Export CSV
    </button>
  );
};

export default ExportCsvButton;