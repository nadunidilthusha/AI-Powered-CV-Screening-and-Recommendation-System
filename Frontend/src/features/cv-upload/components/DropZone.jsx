import { Upload, FileText, Clock3, CircleCheckBig } from 'lucide-react';

const DropZone = ({ onFilesSelected }) => {
  const handleFiles = (files) => {
    if (!files?.length) return;

    onFilesSelected?.(Array.from(files));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleBrowse = (event) => {
    handleFiles(event.target.files);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="flex min-h-[330px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-slate-50/50 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50/30"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Upload size={30} strokeWidth={1.8} />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-800">
        Drag &amp; drop CVs here
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Drop candidate resume files into this area to prepare them for upload.
      </p>

      <p className="my-4 text-xs font-medium uppercase tracking-wider text-slate-400">
        or
      </p>

      <label className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
        Browse Files

        <input
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleBrowse}
          className="hidden"
        />
      </label>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <FileText size={14} />
          PDF files only
        </span>

        <span className="h-1 w-1 rounded-full bg-slate-300" />

        <span className="flex items-center gap-1.5">
          <Clock3 size={14} />
          Max 5 MB per file
        </span>

        <span className="h-1 w-1 rounded-full bg-slate-300" />

        <span className="flex items-center gap-1.5">
          <CircleCheckBig size={14} />
          Multiple CVs supported
        </span>
      </div>
    </div>
  );
};

export default DropZone;