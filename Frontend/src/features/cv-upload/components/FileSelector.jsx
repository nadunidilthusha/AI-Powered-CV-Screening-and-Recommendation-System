import {
  FileText,
  CircleCheckBig,
  CircleX,
  Plus,
  Trash2,
} from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 MB';

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const validateFile = (file) => {
  const isPdf =
    file.type === 'application/pdf' ||
    file.name.toLowerCase().endsWith('.pdf');

  const validSize = file.size <= MAX_FILE_SIZE;

  return {
    isValid: isPdf && validSize,
    isPdf,
    validSize,
  };
};

const FileSelector = ({ files = [], onRemoveFile, onAddFiles }) => {
  const handleAddFiles = (event) => {
    const newFiles = Array.from(event.target.files || []);

    if (newFiles.length > 0) {
      onAddFiles?.(newFiles);
    }

    event.target.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-800">
            Selected CVs
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            {files.length} {files.length === 1 ? 'file' : 'files'} selected
          </p>
        </div>

        <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100">
          <Plus size={16} />

          Add More CVs

          <input
            type="file"
            accept=".pdf,application/pdf"
            multiple
            onChange={handleAddFiles}
            className="hidden"
          />
        </label>
      </div>

      {/* File List */}
      <div className="space-y-3">
        {files.map((file, index) => {
          const validation = validateFile(file);

          return (
            <div
              key={`${file.name}-${file.size}-${index}`}
              className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              {/* File Information */}
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                  <FileText size={21} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-700">
                    {file.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    PDF • {formatFileSize(file.size)}
                  </p>
                </div>
              </div>

              {/* Validation + Remove */}
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                {validation.isValid ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CircleCheckBig size={17} />

                    <span className="text-xs font-semibold">
                      Valid
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-500">
                    <CircleX size={17} />

                    <span className="text-xs font-semibold">
                      Invalid
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onRemoveFile?.(index)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                  aria-label={`Remove ${file.name}`}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FileSelector;