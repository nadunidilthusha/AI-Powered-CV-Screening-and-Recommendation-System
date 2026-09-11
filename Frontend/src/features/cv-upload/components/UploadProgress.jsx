import { FileText } from 'lucide-react';
import UploadStatusBadge from './UploadStatusBadge';

const formatFileSize = (bytes) => {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const UploadProgress = ({ files = [] }) => {
  const getFileStatus = (index) => {
    if (index < 3) {
      return {
        status: 'complete',
        progress: 100,
      };
    }

    if (index === 3) {
      return {
        status: 'processing',
        progress: 40,
      };
    }

    return {
      status: 'pending',
      progress: 0,
    };
  };

  const totalProgress =
    files.length === 0
      ? 0
      : Math.round(
          files.reduce((total, _, index) => {
            return total + getFileStatus(index).progress;
          }, 0) / files.length
        );

  const completedCount = files.filter(
    (_, index) => getFileStatus(index).status === 'complete'
  ).length;

  return (
    <div>
      {/* Overall Progress */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Upload Progress
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {completedCount}/{files.length} CVs uploaded
            </p>
          </div>

          <span className="text-lg font-bold text-blue-600">
            {totalProgress}%
          </span>
        </div>

        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{
              width: `${totalProgress}%`,
            }}
          />
        </div>

        <p className="mt-3 text-xs text-slate-400">
          Please keep this page open while your CVs are being uploaded.
        </p>
      </div>

      {/* Individual Files */}
      <div className="mt-5 space-y-3">
        {files.map((file, index) => {
          const fileStatus = getFileStatus(index);

          return (
            <div
              key={`${file.name}-${file.size}-${index}`}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* File Info */}
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                    <FileText size={19} />
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

                {/* Upload Status */}
                <UploadStatusBadge status={fileStatus.status} />
              </div>

              {/* Individual Progress */}
              <div className="mt-4 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all ${
                      fileStatus.status === 'complete'
                        ? 'bg-green-500'
                        : fileStatus.status === 'processing'
                          ? 'bg-blue-600'
                          : fileStatus.status === 'failed'
                            ? 'bg-red-500'
                            : 'bg-slate-300'
                    }`}
                    style={{
                      width: `${fileStatus.progress}%`,
                    }}
                  />
                </div>

                <span className="w-10 text-right text-xs font-medium text-slate-500">
                  {fileStatus.progress}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UploadProgress;