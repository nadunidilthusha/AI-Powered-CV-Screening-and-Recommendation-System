import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '../../components/common/Card/Card';
import JobForm from '../../features/jobs/components/JobForm';

import jobService from '../../services/jobService';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routePaths';

const CreateJobPage = () => {
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      const response = await jobService.createJob(formData);

      showToast(
        response.data?.title
          ? `Job posting "${response.data.title}" created successfully!`
          : 'Job posting created successfully!',
        'success'
      );

      navigate(ROUTES.JOBS);
    } catch (err) {
      console.error('Failed to create job:', err);

      showToast(
        err.response?.data?.message ||
          'Failed to create job posting.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">
          Create job posting
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Fill in the role details so candidates can be matched accurately
        </p>
      </div>

      <Card>
        <JobForm
          onSubmit={handleSubmit}
          onCancel={() => navigate(ROUTES.JOBS)}
          submitLabel="Save job"
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default CreateJobPage;