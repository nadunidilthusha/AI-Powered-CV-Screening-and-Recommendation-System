import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, AlertTriangle } from 'lucide-react';

import JobList from '../../features/jobs/components/JobList';
import Button from '../../components/common/Button/Button';
import Alert from '../../components/common/Alert/Alert';

import jobService from '../../services/jobService';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routePaths';

const JobListPage = () => {
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await jobService.getJobs();
      setJobs(response.data || []);
    } catch (err) {
      console.error('Failed to load jobs:', err);

      setError(
        err.response?.data?.message ||
          'Unable to load job postings. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleView = (job) => {
    navigate(ROUTES.JOB_DETAILS.replace(':id', job.id));
  };

  const handleEdit = (job) => {
    navigate(ROUTES.JOB_EDIT.replace(':id', job.id));
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      setDeleting(true);

      await jobService.deleteJob(pendingDelete.id);

      setJobs((prev) =>
        prev.filter((job) => job.id !== pendingDelete.id)
      );

      showToast(
        `Job posting "${pendingDelete.title}" deleted successfully.`,
        'success'
      );

      setPendingDelete(null);
    } catch (err) {
      console.error('Failed to delete job:', err);

      showToast(
        err.response?.data?.message ||
          'Failed to delete the job posting.',
        'error'
      );
    } finally {
      setDeleting(false);
    }
  };

  const activeCount = jobs.filter(
    (job) => job.status === 'Active'
  ).length;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Job postings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {jobs.length} postings · {activeCount} active and accepting CVs
          </p>
        </div>

        <Button
          icon={Plus}
          onClick={() => navigate(ROUTES.JOB_CREATE)}
        >
          Create job
        </Button>
      </div>

      {error && (
        <div className="mb-5">
          <Alert
            variant="error"
            title="Unable to load job postings"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span>{error}</span>

              <button
                type="button"
                onClick={loadJobs}
                className="font-semibold underline"
              >
                Retry
              </button>
            </div>
          </Alert>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">
            Loading job postings...
          </p>
        </div>
      ) : (
        <JobList
          jobs={jobs}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={setPendingDelete}
        />
      )}

      {pendingDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-5"
          onClick={() => !deleting && setPendingDelete(null)}
        >
          <div
            className="w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <AlertTriangle size={20} />
            </div>

            <h3 className="mb-2 text-base font-bold text-slate-900">
              Delete this job posting?
            </h3>

            <p className="mb-5 text-sm leading-relaxed text-slate-500">
              This removes{' '}
              <strong className="text-slate-800">
                {pendingDelete.title}
              </strong>{' '}
              and its screened candidates. This can&apos;t be undone.
            </p>

            <div className="flex justify-end gap-2.5">
              <Button
                variant="secondary"
                onClick={() => setPendingDelete(null)}
                disabled={deleting}
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                onClick={confirmDelete}
                loading={deleting}
              >
                Delete job
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListPage;