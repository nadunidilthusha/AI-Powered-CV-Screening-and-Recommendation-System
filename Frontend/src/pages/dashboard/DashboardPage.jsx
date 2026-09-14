import { useState } from 'react';

import StatisticsCards from '../../features/dashboard/components/StatisticsCards';
import CandidateCountWidget from '../../features/dashboard/components/CandidateCountWidget';
import ProcessingStatusWidget from '../../features/dashboard/components/ProcessingStatusWidget';

const jobStatisticsData = {
  week: [
    {
      label: 'Active jobs',
      value: 5,
      progress: 55,
      color: 'bg-blue-600',
    },
    {
      label: 'Closed jobs',
      value: 1,
      progress: 15,
      color: 'bg-cyan-500',
    },
    {
      label: 'Draft jobs',
      value: 1,
      progress: 10,
      color: 'bg-amber-500',
    },
    {
      label: 'Jobs with CVs',
      value: 4,
      progress: 45,
      color: 'bg-green-500',
    },
  ],

  month: [
    {
      label: 'Active jobs',
      value: 8,
      progress: 70,
      color: 'bg-blue-600',
    },
    {
      label: 'Closed jobs',
      value: 3,
      progress: 25,
      color: 'bg-cyan-500',
    },
    {
      label: 'Draft jobs',
      value: 1,
      progress: 10,
      color: 'bg-amber-500',
    },
    {
      label: 'Jobs with CVs',
      value: 9,
      progress: 75,
      color: 'bg-green-500',
    },
  ],

  year: [
    {
      label: 'Active jobs',
      value: 24,
      progress: 80,
      color: 'bg-blue-600',
    },
    {
      label: 'Closed jobs',
      value: 14,
      progress: 48,
      color: 'bg-cyan-500',
    },
    {
      label: 'Draft jobs',
      value: 4,
      progress: 18,
      color: 'bg-amber-500',
    },
    {
      label: 'Jobs with CVs',
      value: 20,
      progress: 68,
      color: 'bg-green-500',
    },
  ],
};

const DashboardPage = () => {
  const [jobPeriod, setJobPeriod] = useState('month');

  const currentJobStatistics = jobStatisticsData[jobPeriod];

  return (
    <div className="space-y-5">
      {/* =========================
          PAGE HEADER
      ========================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Overview of jobs, candidates and AI CV screening activity.
          </p>
        </div>

        <div className="w-fit rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
          September 2026
        </div>
      </div>

      {/* =========================
          STATISTICS CARDS
      ========================== */}
      <StatisticsCards />

      {/* =========================
          JOB + CANDIDATE STATISTICS
      ========================== */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Job Statistics */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Job Statistics
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Current status of job postings
              </p>
            </div>

            <select
              value={jobPeriod}
              onChange={(event) => setJobPeriod(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="month">This month</option>
              <option value="week">This week</option>
              <option value="year">This year</option>
            </select>
          </div>

          {/* Job Statistics Bars */}
          <div className="mt-6 space-y-5">
            {currentJobStatistics.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-[110px_1fr_30px] items-center gap-3"
              >
                <span className="text-sm text-slate-600">
                  {item.label}
                </span>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${item.color}`}
                    style={{
                      width: `${item.progress}%`,
                    }}
                  />
                </div>

                <span className="text-right text-sm font-semibold text-slate-700">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Candidate Statistics */}
        <CandidateCountWidget />
      </div>

      {/* =========================
          PROCESSING STATUS
      ========================== */}
      <ProcessingStatusWidget />
    </div>
  );
};

export default DashboardPage;