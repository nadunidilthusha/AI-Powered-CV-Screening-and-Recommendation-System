import {
  useState,
} from 'react';

import {
  FileText,
} from 'lucide-react';

import reportService from '../../../services/reportService';

const ExportPdfButton = ({
  selectedJob,
  filters,
}) => {
  const [exporting, setExporting] =
    useState(false);

  const handleExport =
    async () => {
      if (!selectedJob) {
        alert(
          'Please select a job first.'
        );

        return;
      }

      try {
        setExporting(true);

        const response =
          await reportService.exportPdf(
            selectedJob,
            filters
          );

        const blob = new Blob(
          [response.data],
          {
            type:
              response.headers[
                'content-type'
              ] ||
              'application/pdf',
          }
        );

        const disposition =
          response.headers[
            'content-disposition'
          ];

        const filenameMatch =
          disposition?.match(
            /filename="?([^"]+)"?/i
          );

        const filename =
          filenameMatch?.[1] ||
          'candidate-ranking.pdf';

        const url =
          URL.createObjectURL(blob);

        const link =
          document.createElement('a');

        link.href = url;
        link.download = filename;

        document.body.appendChild(
          link
        );

        link.click();
        link.remove();

        URL.revokeObjectURL(url);
      } catch (error) {
        console.error(
          'PDF export failed:',
          error
        );

        alert(
          'Failed to export PDF.'
        );
      } finally {
        setExporting(false);
      }
    };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="flex items-center gap-2 px-4 h-[42px] bg-blue-600 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60"
    >
      <FileText size={16} />

      {exporting
        ? 'Exporting...'
        : 'Export PDF'}
    </button>
  );
};

export default ExportPdfButton;