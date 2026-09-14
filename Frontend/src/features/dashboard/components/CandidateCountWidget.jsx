import { useState } from 'react';

const candidateData = {
  all: [
    {
      label: 'Highly Recommended',
      value: 32,
      color: '#22c55e',
      dotColor: 'bg-green-500',
    },
    {
      label: 'Recommended',
      value: 56,
      color: '#2563eb',
      dotColor: 'bg-blue-600',
    },
    {
      label: 'Not Recommended',
      value: 25,
      color: '#f59e0b',
      dotColor: 'bg-amber-500',
    },
    {
      label: 'Pending',
      value: 11,
      color: '#cbd5e1',
      dotColor: 'bg-slate-300',
    },
  ],

  'software-engineer': [
    {
      label: 'Highly Recommended',
      value: 8,
      color: '#22c55e',
      dotColor: 'bg-green-500',
    },
    {
      label: 'Recommended',
      value: 10,
      color: '#2563eb',
      dotColor: 'bg-blue-600',
    },
    {
      label: 'Not Recommended',
      value: 5,
      color: '#f59e0b',
      dotColor: 'bg-amber-500',
    },
    {
      label: 'Pending',
      value: 2,
      color: '#cbd5e1',
      dotColor: 'bg-slate-300',
    },
  ],

  'data-analyst': [
    {
      label: 'Highly Recommended',
      value: 4,
      color: '#22c55e',
      dotColor: 'bg-green-500',
    },
    {
      label: 'Recommended',
      value: 7,
      color: '#2563eb',
      dotColor: 'bg-blue-600',
    },
    {
      label: 'Not Recommended',
      value: 3,
      color: '#f59e0b',
      dotColor: 'bg-amber-500',
    },
    {
      label: 'Pending',
      value: 1,
      color: '#cbd5e1',
      dotColor: 'bg-slate-300',
    },
  ],

  'ui-ux-designer': [
    {
      label: 'Highly Recommended',
      value: 5,
      color: '#22c55e',
      dotColor: 'bg-green-500',
    },
    {
      label: 'Recommended',
      value: 9,
      color: '#2563eb',
      dotColor: 'bg-blue-600',
    },
    {
      label: 'Not Recommended',
      value: 4,
      color: '#f59e0b',
      dotColor: 'bg-amber-500',
    },
    {
      label: 'Pending',
      value: 2,
      color: '#cbd5e1',
      dotColor: 'bg-slate-300',
    },
  ],

  'qa-engineer': [
    {
      label: 'Highly Recommended',
      value: 2,
      color: '#22c55e',
      dotColor: 'bg-green-500',
    },
    {
      label: 'Recommended',
      value: 5,
      color: '#2563eb',
      dotColor: 'bg-blue-600',
    },
    {
      label: 'Not Recommended',
      value: 2,
      color: '#f59e0b',
      dotColor: 'bg-amber-500',
    },
    {
      label: 'Pending',
      value: 1,
      color: '#cbd5e1',
      dotColor: 'bg-slate-300',
    },
  ],
};

const CandidateCountWidget = () => {
  const [selectedJob, setSelectedJob] = useState('all');
  const [hoveredStat, setHoveredStat] = useState(null);

  const candidateStats = candidateData[selectedJob];

  const totalCandidates = candidateStats.reduce(
    (total, item) => total + item.value,
    0
  );

  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercentage = 0;

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
          value={selectedJob}
          onChange={(event) => {
            setSelectedJob(event.target.value);
            setHoveredStat(null);
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="all">All jobs</option>
          <option value="software-engineer">
            Software Engineer
          </option>
          <option value="data-analyst">
            Data Analyst
          </option>
          <option value="ui-ux-designer">
            UI/UX Designer
          </option>
          <option value="qa-engineer">
            QA Engineer
          </option>
        </select>
      </div>

      {/* Content */}
      <div className="mt-5 flex flex-col items-center justify-between gap-6 sm:flex-row">
        {/* Doughnut Chart */}
        <div className="relative h-40 w-40 shrink-0">
          <svg
            viewBox="0 0 140 140"
            className="h-full w-full"
          >
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="18"
            />

            {candidateStats.map((item) => {
              const percentage =
                totalCandidates > 0
                  ? item.value / totalCandidates
                  : 0;

              const segmentLength =
                percentage * circumference;

              const strokeOffset =
                -(accumulatedPercentage * circumference);

              accumulatedPercentage += percentage;

              return (
                <circle
                  key={item.label}
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="18"
                  strokeDasharray={`${segmentLength} ${
                    circumference - segmentLength
                  }`}
                  strokeDashoffset={strokeOffset}
                  transform="rotate(-90 70 70)"
                  className="cursor-pointer transition-opacity duration-150 hover:opacity-80"
                  onMouseEnter={() =>
                    setHoveredStat(item)
                  }
                  onMouseLeave={() =>
                    setHoveredStat(null)
                  }
                  aria-label={`${item.label}: ${item.value} candidates`}
                />
              );
            })}
          </svg>

          {/* Tooltip */}
          {hoveredStat && (
            <div className="pointer-events-none absolute -top-12 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-center text-xs text-white shadow-lg">
              <p className="font-semibold">
                {hoveredStat.label}
              </p>

              <p className="mt-0.5">
                {hoveredStat.value} candidates
              </p>
            </div>
          )}

          {/* Center */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-900">
              {totalCandidates}
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