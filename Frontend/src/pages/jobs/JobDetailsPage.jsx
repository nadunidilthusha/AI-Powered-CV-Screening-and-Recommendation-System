import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

import JobDetails from '../../features/jobs/components/JobDetails';
import Alert from '../../components/common/Alert/Alert';
import Button from '../../components/common/Button/Button';

import jobService from '../../services/jobService';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routePaths';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadJob = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await jobService.getJobById(id);
      setJob(response.data);
    } catch (err) {
      console.error('Failed to load job:', err);

      setError(
        err.response?.data?.message ||
          'Job posting could not be found.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJob();
  }, [id]);

  const confirmDelete = async () => {
    try {
      setDeleting(true);

      await jobService.deleteJob(id);

      showToast(
        `Job posting "${job.title}" deleted successfully.`,
        'success'
      );

      navigate(ROUTES.JOBS);
    } catch (err) {
      console.error('Failed to delete job:', err);

      showToast(
        err.response?.data?.message ||
          'Failed to delete the job posting.',
        'error'
      );
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm text-slate-500">
          Loading job details...
        </p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div>
        <Button
          variant="secondary"
          icon={ArrowLeft}
          onClick={() => navigate(ROUTES.JOBS)}
          className="mb-4"
        >
          Back to job postings
        </Button>

        <Alert
          variant="error"
          title="Job posting not found"
        >
          {error || 'This job posting may have been deleted.'}
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="secondary"
        icon={ArrowLeft}
        onClick={() => navigate(ROUTES.JOBS)}
        className="mb-4"
      >
        Back to job postings
      </Button>

      <JobDetails
        job={job}
        onEdit={() =>
          navigate(
            ROUTES.JOB_EDIT.replace(':id', job.id)
          )
        }
        onDelete={() => setShowDeleteModal(true)}
      />

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-5"
          onClick={() => !deleting && setShowDeleteModal(false)}
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
                {job.title}
              </strong>{' '}
              and its screened candidates. This can&apos;t be undone.
            </p>

            <div className="flex justify-end gap-2.5">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
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

export default JobDetailsPage;