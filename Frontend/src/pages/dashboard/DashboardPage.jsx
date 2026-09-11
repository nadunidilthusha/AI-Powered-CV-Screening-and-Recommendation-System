import StatisticsCards from '../../features/dashboard/components/StatisticsCards';
import CandidateCountWidget from '../../features/dashboard/components/CandidateCountWidget';
import ProcessingStatusWidget from '../../features/dashboard/components/ProcessingStatusWidget';

const DashboardPage = () => {
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
              defaultValue="month"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="month">This month</option>
              <option value="week">This week</option>
              <option value="year">This year</option>
            </select>
          </div>

          {/* Job Statistics Bars */}
          <div className="mt-6 space-y-5">
            {/* Active Jobs */}
            <div className="grid grid-cols-[110px_1fr_30px] items-center gap-3">
              <span className="text-sm text-slate-600">
                Active jobs
              </span>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[70%] rounded-full bg-blue-600" />
              </div>

              <span className="text-right text-sm font-semibold text-slate-700">
                8
              </span>
            </div>

            {/* Closed Jobs */}
            <div className="grid grid-cols-[110px_1fr_30px] items-center gap-3">
              <span className="text-sm text-slate-600">
                Closed jobs
              </span>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[25%] rounded-full bg-cyan-500" />
              </div>

              <span className="text-right text-sm font-semibold text-slate-700">
                3
              </span>
            </div>

            {/* Draft Jobs */}
            <div className="grid grid-cols-[110px_1fr_30px] items-center gap-3">
              <span className="text-sm text-slate-600">
                Draft jobs
              </span>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[10%] rounded-full bg-amber-500" />
              </div>

              <span className="text-right text-sm font-semibold text-slate-700">
                1
              </span>
            </div>

            {/* Jobs with CVs */}
            <div className="grid grid-cols-[110px_1fr_30px] items-center gap-3">
              <span className="text-sm text-slate-600">
                Jobs with CVs
              </span>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[75%] rounded-full bg-green-500" />
              </div>

              <span className="text-right text-sm font-semibold text-slate-700">
                9
              </span>
            </div>
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