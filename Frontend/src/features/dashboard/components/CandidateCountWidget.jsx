const candidateStats = [
  {
    label: 'Highly Recommended',
    value: 32,
    dotColor: 'bg-green-500',
  },
  {
    label: 'Recommended',
    value: 56,
    dotColor: 'bg-blue-600',
  },
  {
    label: 'Not Recommended',
    value: 25,
    dotColor: 'bg-amber-500',
  },
  {
    label: 'Pending',
    value: 11,
    dotColor: 'bg-slate-300',
  },
];

const CandidateCountWidget = () => {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Candidate Statistics
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            AI recommendation distribution
          </p>
        </div>

        <select
          defaultValue="all"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none"
        >
          <option value="all">All jobs</option>
          <option value="software-engineer">Software Engineer</option>
          <option value="data-analyst">Data Analyst</option>
          <option value="ui-ux-designer">UI/UX Designer</option>
          <option value="qa-engineer">QA Engineer</option>
        </select>
      </div>

      {/* Content */}
      <div className="mt-5 flex flex-col items-center justify-between gap-6 sm:flex-row">
        {/* Donut Chart */}
        <div className="relative h-36 w-36 shrink-0">
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                'conic-gradient(#22c55e 0% 25.8%, #2563eb 25.8% 71%, #f59e0b 71% 91.1%, #cbd5e1 91.1% 100%)',
            }}
          />

          {/* Donut hole */}
          <div className="absolute inset-[22px] flex flex-col items-center justify-center rounded-full bg-white">
            <span className="text-2xl font-bold text-slate-900">
              124
            </span>

            <span className="mt-1 text-[10px] text-slate-400">
              Candidates
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full space-y-4">
          {candidateStats.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-6"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${item.dotColor}`}
                />

                <span className="text-sm text-slate-600">
                  {item.label}
                </span>
              </div>

              <span className="text-sm font-semibold text-slate-700">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CandidateCountWidget;