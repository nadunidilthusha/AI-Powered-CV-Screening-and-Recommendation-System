const processingJobs = [
  {
    job: 'Software Engineer',
    subtitle: '25 CVs uploaded',
    processed: 18,
    total: 25,
    status: 'Processing',
    progress: 72,
  },
  {
    job: 'Data Analyst',
    subtitle: '15 CVs uploaded',
    processed: 15,
    total: 15,
    status: 'Completed',
    progress: 100,
  },
  {
    job: 'UI/UX Designer',
    subtitle: '20 CVs uploaded',
    processed: 6,
    total: 20,
    status: 'Processing',
    progress: 30,
  },
  {
    job: 'QA Engineer',
    subtitle: '10 CVs queued',
    processed: 0,
    total: 10,
    status: 'Pending',
    progress: 0,
  },
];

const getStatusClasses = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-700';

    case 'Processing':
      return 'bg-blue-100 text-blue-700';

    case 'Pending':
      return 'bg-slate-100 text-slate-600';

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

  return 'bg-slate-300';
};

const ProcessingStatusWidget = () => {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Processing Status
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Bulk CV analysis and AI screening progress
          </p>
        </div>

        <button
          type="button"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          View all activity →
        </button>
      </div>

      {/* Processing rows */}
      <div className="mt-6 divide-y divide-slate-100">
        {processingJobs.map((item) => (
          <div
            key={item.job}
            className="grid grid-cols-1 gap-3 py-5 md:grid-cols-[220px_1fr_auto_auto_auto] md:items-center md:gap-5"
          >
            {/* Job */}
            <div>
              <p className="text-sm font-semibold text-slate-700">
                {item.job}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {item.subtitle}
              </p>
            </div>

            {/* Progress */}
            <div className="w-full">
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${getProgressColor(
                    item.status
                  )}`}
                  style={{
                    width: `${item.progress}%`,
                  }}
                />
              </div>
            </div>

            {/* Count */}
            <div className="text-xs text-slate-500 md:min-w-[50px] md:text-right">
              {item.processed}/{item.total}
            </div>

            {/* Status */}
            <div className="md:min-w-[90px]">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${getStatusClasses(
                  item.status
                )}`}
              >
                {item.status}
              </span>
            </div>

            {/* View details */}
            <button
              type="button"
              className="text-left text-xs font-semibold text-blue-600 hover:text-blue-700 md:min-w-[70px] md:text-right"
            >
              View details
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProcessingStatusWidget;