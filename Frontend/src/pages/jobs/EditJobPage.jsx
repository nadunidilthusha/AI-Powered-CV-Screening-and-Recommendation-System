import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import Card from '../../components/common/Card/Card';
import Alert from '../../components/common/Alert/Alert';
import Button from '../../components/common/Button/Button';
import JobForm from '../../features/jobs/components/JobForm';

import jobService from '../../services/jobService';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routePaths';

const EditJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);

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

    loadJob();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);

      const response = await jobService.updateJob(id, formData);

      setJob(response.data);

      showToast(
        `Job posting "${response.data.title}" updated successfully!`,
        'success'
      );

      navigate(
        ROUTES.JOB_DETAILS.replace(':id', id)
      );
    } catch (err) {
      console.error('Failed to update job:', err);

      showToast(
        err.response?.data?.message ||
          'Failed to update job posting.',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm text-slate-500">
          Loading job posting...
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
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">
          Edit job posting
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update the role details — re-screening will use the new description
        </p>
      </div>

      <Card>
        <JobForm
          initialData={job}
          onSubmit={handleSubmit}
          onCancel={() =>
            navigate(
              ROUTES.JOB_DETAILS.replace(':id', id)
            )
          }
          submitLabel="Save changes"
          loading={saving}
        />
      </Card>
    </div>
  );
};

export default EditJobPage;