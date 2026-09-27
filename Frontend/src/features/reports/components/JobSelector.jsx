import {
  useEffect,
  useState,
} from 'react';

import {
  ChevronDown,
} from 'lucide-react';

import jobService from '../../../services/jobService';

const JobSelector = ({
  selectedJob,
  onChange,
}) => {
  const [jobs, setJobs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError('');

        const response =
          await jobService.getJobs();

        const payload =
          response?.data?.data ??
          response?.data;

        const jobList =
          Array.isArray(payload)
            ? payload
            : Array.isArray(
                  payload?.jobs
                )
              ? payload.jobs
              : [];

        setJobs(jobList);
      } catch (err) {
        console.error(
          'Failed to load jobs:',
          err
        );

        setError(
          'Unable to load jobs'
        );
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  return (
    <div className="flex flex-col">
      <label className="text-xs font-bold text-slate-500 uppercase mb-1">
        Select Job
      </label>

      <div className="relative w-64">
        <select
          value={selectedJob}
          onChange={(e) =>
            onChange(e.target.value)
          }
          disabled={loading}
          className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm font-medium py-2.5 pl-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-60"
        >
          <option value="">
            {loading
              ? 'Loading jobs...'
              : 'Select a job'}
          </option>

          {jobs.map((job) => (
            <option
              key={job._id}
              value={job._id}
            >
              {job.title}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default JobSelector;