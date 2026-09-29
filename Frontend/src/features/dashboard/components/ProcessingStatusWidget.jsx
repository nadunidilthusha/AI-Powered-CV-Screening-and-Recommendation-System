const getStatusClasses = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-700';

    case 'Processing':
      return 'bg-blue-100 text-blue-700';

    case 'Pending':
      return 'bg-slate-100 text-slate-600';

    case 'Failed':
      return 'bg-red-100 text-red-700';

    default:
      return 'bg-slate-100 text-slate-600';
  }
};

const getProgressColor = (status) => {
  if (status === 'Completed') {
    return 'bg-green-500';
  }

  if (status === 'Processing') {
    return 'bg-blue-600';
  }

  if (status === 'Failed') {
    return 'bg-red-500';
  }

  return 'bg-slate-300';
};

const ProcessingStatusWidget = ({ jobs = [] }) => {
  const jobsWithCvs = jobs.filter(
    (item) => (item.totalCandidates ?? 0) > 0
  );

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Processing Status
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Bulk CV analysis and AI screening progress
        </p>
      </div>

      {/* Processing rows */}
      <div className="mt-6 divide-y divide-slate-100">
        {jobsWithCvs.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-400">
            No CV processing activity available.
          </div>
        ) : (
          jobsWithCvs.map((item) => {
            const total = item.totalCandidates ?? 0;
            const processed = item.processedCandidates ?? 0;
            const progress = item.progressPercentage ?? 0;
            const status = item.status ?? 'Pending';

            return (
              <div
                key={item.jobId}
                className="grid grid-cols-1 gap-3 py-5 md:grid-cols-[220px_1fr_auto_auto] md:items-center md:gap-5"
              >
                {/* Job */}
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {item.jobTitle || 'Untitled Job'}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {total} {total === 1 ? 'CV' : 'CVs'} uploaded
                  </p>
                </div>

                {/* Progress */}
                <div className="w-full">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${getProgressColor(
                        status
                      )}`}
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, progress)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Count */}
                <div className="text-xs text-slate-500 md:min-w-[50px] md:text-right">
                  {processed}/{total}
                </div>

                {/* Status */}
                <div className="md:min-w-[90px]">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${getStatusClasses(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default ProcessingStatusWidget;