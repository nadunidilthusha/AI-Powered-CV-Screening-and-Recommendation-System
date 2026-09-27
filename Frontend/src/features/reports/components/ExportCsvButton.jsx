import {
  useState,
} from 'react';

import {
  ArrowDownToLine,
} from 'lucide-react';

import reportService from '../../../services/reportService';

const ExportCsvButton = ({
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
          await reportService.exportCsv(
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
              'text/csv;charset=utf-8;',
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
          'candidate-ranking.csv';

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
          'CSV export failed:',
          error
        );

        alert(
          'Failed to export CSV.'
        );
      } finally {
        setExporting(false);
      }
    };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="flex items-center gap-2 px-4 h-[42px] bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-60"
    >
      <ArrowDownToLine
        size={16}
      />

      {exporting
        ? 'Exporting...'
        : 'Export CSV'}
    </button>
  );
};

export default ExportCsvButton;