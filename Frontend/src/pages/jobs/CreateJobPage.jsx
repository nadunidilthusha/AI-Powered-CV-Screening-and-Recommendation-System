import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card/Card';
import JobForm from '../../features/jobs/components/JobForm';
import jobService from '../../services/jobService';
import { ROUTES } from '../../routes/routePaths';

const CreateJobPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await jobService.createJob(formData);
    } catch (err) {
      // TODO: surface a real error (e.g. via Alert) once the API is connected
      console.error('Failed to create job', err);
    } finally {
      setLoading(false);
      navigate(ROUTES.JOBS);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">Create job posting</h1>
        <p className="mt-1 text-sm text-slate-500">Fill in the role details so candidates can be matched accurately</p>
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
