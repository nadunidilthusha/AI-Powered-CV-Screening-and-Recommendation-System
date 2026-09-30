import { useEffect, useState } from 'react';

import StatisticsCards from '../../features/dashboard/components/StatisticsCards';
import CandidateCountWidget from '../../features/dashboard/components/CandidateCountWidget';
import ProcessingStatusWidget from '../../features/dashboard/components/ProcessingStatusWidget';

import dashboardService from '../../services/dashboardService';
import jobService from '../../services/jobService';

const DashboardPage = () => {
  const [jobPeriod, setJobPeriod] = useState('month');

  const [dashboardData, setDashboardData] =
    useState(null);

  const [error, setError] = useState('');

  /*
    Candidate Statistics job filter
  */
  const [candidateJobs, setCandidateJobs] =
    useState([]);

  const [
    selectedCandidateJob,
    setSelectedCandidateJob,
  ] = useState('');

  const [
    candidateStatistics,
    setCandidateStatistics,
  ] = useState(null);

  const [
    candidateStatsLoading,
    setCandidateStatsLoading,
  ] = useState(false);

  /*
    Load the main Dashboard.
  */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setError('');

        const response =
          await dashboardService.getDashboard();

        const data = response.data.data;

        setDashboardData(data);

        /*
          Initially show statistics for all jobs.
        */
        setCandidateStatistics(
          data?.candidateStatistics ?? null
        );
      } catch (err) {
        console.error(
          'Failed to load dashboard:',
          err
        );

        setError(
          'Unable to load dashboard data.'
        );
      }
    };

    loadDashboard();
  }, []);

  /*
    Load real jobs for the Candidate Statistics
    dropdown.
  */
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response =
          await jobService.getJobs();

        const fetchedJobs =
          Array.isArray(response?.data)
            ? response.data
            : [];

        setCandidateJobs(fetchedJobs);
      } catch (err) {
        console.error(
          'Failed to load jobs for candidate statistics:',
          err
        );

        setCandidateJobs([]);
      }
    };

    loadJobs();
  }, []);

  /*
    Called whenever the user changes the
    Candidate Statistics job dropdown.
  */
  const handleCandidateJobChange =
    async (jobId) => {
      setSelectedCandidateJob(jobId);

      /*
        Empty jobId means "All jobs".
        We already have the overall statistics
        from the main Dashboard response.
      */
      if (!jobId) {
        setCandidateStatistics(
          dashboardData?.candidateStatistics ??
            null
        );

        return;
      }

      try {
        setCandidateStatsLoading(true);

        const response =
          await dashboardService.getCandidateStatistics(
            jobId
          );

        setCandidateStatistics(
          response.data.data
            ?.candidateStatistics ?? null
        );
      } catch (err) {
        console.error(
          'Failed to load candidate statistics:',
          err
        );
      } finally {
        setCandidateStatsLoading(false);
      }
    };

  const jobStatistics =
    dashboardData?.jobStatistics ?? {
      active: 0,
      closed: 0,
      draft: 0,
      jobsWithCvs: 0,
    };

  const totalJobs =
    jobStatistics.active +
    jobStatistics.closed +
    jobStatistics.draft;

  const getProgress = (value) => {
    if (totalJobs === 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.round(
        (value / totalJobs) * 100
      )
    );
  };

  const currentJobStatistics = [
    {
      label: 'Active jobs',
      value: jobStatistics.active,
      progress: getProgress(
        jobStatistics.active
      ),
      color: 'bg-blue-600',
    },
    {
      label: 'Closed jobs',
      value: jobStatistics.closed,
      progress: getProgress(
        jobStatistics.closed
      ),
      color: 'bg-cyan-500',
    },
    {
      label: 'Draft jobs',
      value: jobStatistics.draft,
      progress: getProgress(
        jobStatistics.draft
      ),
      color: 'bg-amber-500',
    },
    {
      label: 'Jobs with CVs',
      value: jobStatistics.jobsWithCvs,
      progress: getProgress(
        jobStatistics.jobsWithCvs
      ),
      color: 'bg-green-500',
    },
  ];

  const currentMonth =
    new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(new Date());

  return (
    <div className="space-y-5">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Overview of jobs, candidates and AI
            CV screening activity.
          </p>
        </div>

        <div className="w-fit rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
          {currentMonth}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* STATISTICS CARDS */}
      <StatisticsCards
        data={
          dashboardData?.statisticsCards
        }
      />

      {/* JOB + CANDIDATE STATISTICS */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
              onChange={(event) =>
                setJobPeriod(
                  event.target.value
                )
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="month">
                This month
              </option>

              <option value="week">
                This week
              </option>

              <option value="year">
                This year
              </option>
            </select>
          </div>

          <div className="mt-6 space-y-5">
            {currentJobStatistics.map(
              (item) => (
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
              )
            )}
          </div>
        </section>

        <CandidateCountWidget
          data={candidateStatistics}
          jobs={candidateJobs}
          selectedJob={
            selectedCandidateJob
          }
          onJobChange={
            handleCandidateJobChange
          }
          loading={
            candidateStatsLoading
          }
        />
      </div>

      {/* PROCESSING STATUS */}
      <ProcessingStatusWidget
        jobs={
          dashboardData?.processingStatus
        }
      />
    </div>
  );
};

export default DashboardPage;