import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import JobDetails from '../../features/jobs/components/JobDetails';
import Alert from '../../components/common/Alert/Alert';
import Button from '../../components/common/Button/Button';
import jobService from '../../services/jobService';
import { ROUTES } from '../../routes/routePaths';
import { MOCK_JOBS } from './JobListPage';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // TODO: replace with jobService.getJobById(id) once the backend is connected
  const job = MOCK_JOBS.find((j) => j.id === id);

  if (!job) {
    return (
      <div>
        <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(ROUTES.JOBS)} className="mb-4">
          Back to job postings
        </Button>
        <Alert variant="error" title="Job posting not found">
          This job posting may have been deleted, or the link is out of date.
        </Alert>
      </div>
    );
  }

  const confirmDelete = async () => {
    try {
      await jobService.deleteJob(job.id);
    } catch (err) {
      console.error('Failed to delete job', err);
    } finally {
      setShowDeleteModal(false);
      navigate(ROUTES.JOBS);
    }
  };

  return (
    <div>
      <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(ROUTES.JOBS)} className="mb-4">
        Back to job postings
      </Button>

      <JobDetails
        job={job}
        onEdit={() => navigate(ROUTES.JOB_EDIT.replace(':id', job.id))}
        onDelete={() => setShowDeleteModal(true)}
      />

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-5"
          onClick={() => setShowDeleteModal(false)}
        >
          <div className="w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <AlertTriangle size={20} />
            </div>
            <h3 className="mb-2 text-base font-bold text-slate-900">Delete this job posting?</h3>
            <p className="mb-5 text-sm leading-relaxed text-slate-500">
              This removes <strong className="text-slate-800">{job.title}</strong> and its{' '}
              <strong className="text-slate-800">{job.candidates}</strong> screened candidates from your dashboard.
              This can&apos;t be undone.
            </p>
            <div className="flex justify-end gap-2.5">
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="danger" onClick={confirmDelete}>Delete job</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;
