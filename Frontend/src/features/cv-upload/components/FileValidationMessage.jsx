import {
  CircleCheckBig,
  CircleX,
  FileText,
  HardDrive,
} from 'lucide-react';

const FileValidationMessage = ({
  totalFiles = 0,
  validFiles = 0,
  invalidFiles = 0,
}) => {
  const allValid = totalFiles > 0 && invalidFiles === 0;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex flex-col items-center text-center">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full ${
            allValid
              ? 'bg-green-50 text-green-600'
              : 'bg-red-50 text-red-500'
          }`}
        >
          {allValid ? (
            <CircleCheckBig size={32} strokeWidth={1.8} />
          ) : (
            <CircleX size={32} strokeWidth={1.8} />
          )}
        </div>

        <h2 className="mt-4 text-lg font-semibold text-slate-800">
          {allValid
            ? 'Validation Complete'
            : 'Validation Issues Found'}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {allValid
            ? `All ${validFiles} CVs passed the file validation checks.`
            : `${invalidFiles} file${
                invalidFiles === 1 ? '' : 's'
              } failed validation.`}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* PDF Check */}
        <div className="flex items-start gap-3 rounded-xl border border-green-100 bg-green-50/50 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-green-600">
            <FileText size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700">
              PDF Format Check
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {allValid
                ? 'All selected files are valid PDF documents.'
                : 'Some selected files are not valid PDF documents.'}
            </p>
          </div>

          <CircleCheckBig
            size={18}
            className="ml-auto shrink-0 text-green-600"
          />
        </div>

        {/* Size Check */}
        <div className="flex items-start gap-3 rounded-xl border border-green-100 bg-green-50/50 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-green-600">
            <HardDrive size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700">
              File Size Check
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {allValid
                ? 'All files are within the 5 MB upload limit.'
                : 'Some files exceed the 5 MB upload limit.'}
            </p>
          </div>

          <CircleCheckBig
            size={18}
            className="ml-auto shrink-0 text-green-600"
          />
        </div>
      </div>

      <div className="mt-5 rounded-lg bg-slate-50 px-4 py-3 text-center">
        <p className="text-xs text-slate-500">
          <span className="font-semibold text-slate-700">
            {validFiles}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-slate-700">
            {totalFiles}
          </span>{' '}
          CVs are ready for AI screening.
        </p>
      </div>
    </section>
  );
};

export default FileValidationMessage;