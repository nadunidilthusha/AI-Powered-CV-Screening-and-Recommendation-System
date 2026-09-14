import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Card from '../../components/common/Card/Card';
import Alert from '../../components/common/Alert/Alert';
import Button from '../../components/common/Button/Button';
import JobForm from '../../features/jobs/components/JobForm';
import jobService from '../../services/jobService';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routePaths';
import { MOCK_JOBS } from './JobListPage';

const EditJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAuth();
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await jobService.updateJob(id, formData);
    } catch (err) {
      // Expected until the backend exists — fall through and still update
      // the local mock data below so the change is visible in the UI.
      console.error('Failed to update job (no backend yet)', err);
    } finally {
      // TODO: remove this block once jobService.updateJob actually persists
      // to a real backend and JobDetailsPage/JobListPage fetch fresh data
      // instead of reading from MOCK_JOBS.
      const index = MOCK_JOBS.findIndex((j) => j.id === id);
      if (index !== -1) {
        MOCK_JOBS[index] = { ...MOCK_JOBS[index], ...formData };
      }

      setLoading(false);
      showToast(`Job posting "${formData.title}" updated successfully!`, 'success');
      navigate(ROUTES.JOB_DETAILS.replace(':id', id));
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">Edit job posting</h1>
        <p className="mt-1 text-sm text-slate-500">Update the role details — re-screening will use the new description</p>
      </div>

      <Card>
        <JobForm
          initialData={job}
          onSubmit={handleSubmit}
          onCancel={() => navigate(ROUTES.JOB_DETAILS.replace(':id', id))}
          submitLabel="Save changes"
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default EditJobPage;