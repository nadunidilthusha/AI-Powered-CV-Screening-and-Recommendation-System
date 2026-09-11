import { FileText } from 'lucide-react';

const ExportPdfButton = () => {
  return (
    <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm mt-5">
      <FileText size={16} />
      Export PDF
    </button>
  );
};

export default ExportPdfButton;