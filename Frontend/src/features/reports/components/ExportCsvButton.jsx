import { ArrowDownToLine } from 'lucide-react';

const ExportCsvButton = () => {
  return (
    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors mt-5">
      <ArrowDownToLine size={16} />
      Export CSV
    </button>
  );
};

export default ExportCsvButton;