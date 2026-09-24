import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, AlertTriangle } from 'lucide-react';
import JobList from '../../features/jobs/components/JobList';
import Button from '../../components/common/Button/Button';
import { ROUTES } from '../../routes/routePaths';

// TODO: replace with jobService.getJobs() once the backend is connected.
// Exported so JobDetailsPage / EditJobPage can look up a job by id without
// a real API yet — this is placeholder data only.
export const MOCK_JOBS = [
  { id: '1', title: 'Senior Backend Engineer', department: 'Engineering', type: 'Full-time', location: 'Colombo · Hybrid', level: 'Senior level', candidates: 124, highlyRecommended: 21, avgMatch: 68, daysOpen: 12, status: 'Active', posted: '12 days ago', description: "We're looking for a Senior Backend Engineer to design and scale the services powering our CV screening platform, including the task queue that coordinates our multi-agent AI pipeline.", skills: ['Node.js', 'Express', 'MongoDB', 'System design', 'AWS'], topMatches: [{ name: 'Kasun Silva', match: 92 }, { name: 'Amaya Perera', match: 78 }, { name: 'Tharindu Jayasuriya', match: 61 }] },
  { id: '2', title: 'Product Designer', department: 'Design', type: 'Full-time', location: 'Remote', level: 'Mid level', candidates: 58, highlyRecommended: 9, avgMatch: 71, daysOpen: 5, status: 'Active', posted: '5 days ago', description: 'Own the end-to-end design of our recruiter-facing dashboard, from candidate ranking screens to the AI-generated recommendation summaries.', skills: ['Figma', 'Design systems', 'User research'], topMatches: [{ name: 'Priya Fernando', match: 85 }] },
  { id: '3', title: 'DevOps Engineer', department: 'Engineering', type: 'Contract', location: 'Colombo', level: 'Senior level', candidates: 31, highlyRecommended: 4, avgMatch: 63, daysOpen: 2, status: 'Active', posted: '2 days ago', description: 'Help us harden the deployment pipeline for the FastAPI microservice that runs our CrewAI screening agents.', skills: ['Docker', 'AWS', 'CI/CD'], topMatches: [] },
  { id: '4', title: 'Junior Frontend Developer', department: 'Engineering', type: 'Full-time', location: 'Colombo · On-site', level: 'Entry level', candidates: 0, highlyRecommended: 0, avgMatch: 0, daysOpen: 0, status: 'Draft', posted: 'Not posted', description: 'Draft posting — description not finalized yet.', skills: [], topMatches: [] },
  { id: '5', title: 'Product Manager', department: 'Product', type: 'Full-time', location: 'Remote', level: 'Lead / Principal', candidates: 0, highlyRecommended: 0, avgMatch: 0, daysOpen: 0, status: 'Draft', posted: 'Not posted', description: 'Draft posting — description not finalized yet.', skills: [], topMatches: [] },
  { id: '6', title: 'Marketing Intern', department: 'Marketing', type: 'Internship', location: 'Colombo', level: 'Entry level', candidates: 46, highlyRecommended: 3, avgMatch: 54, daysOpen: 48, status: 'Closed', posted: '48 days ago', description: 'This internship posting has closed and is no longer accepting new CVs.', skills: ['Content writing', 'Social media'], topMatches: [] },
];

const JobListPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [pendingDelete, setPendingDelete] = useState(null);

  const handleView = (job) => navigate(ROUTES.JOB_DETAILS.replace(':id', job.id));
  const handleEdit = (job) => navigate(ROUTES.JOB_EDIT.replace(':id', job.id));

  const confirmDelete = () => {
    // TODO: await jobService.deleteJob(pendingDelete.id)
    setJobs((prev) => prev.filter((j) => j.id !== pendingDelete.id));
    setPendingDelete(null);
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Job postings</h1>
          <p className="mt-1 text-sm text-slate-500">
            {jobs.length} postings · {jobs.filter((j) => j.status === 'Active').length} active and accepting CVs
          </p>
        </div>
        <Button icon={Plus} onClick={() => navigate(ROUTES.JOB_CREATE)}>
          Create job
        </Button>
      </div>

      <JobList jobs={jobs} onView={handleView} onEdit={handleEdit} onDelete={setPendingDelete} />

      {/* Delete confirmation modal */}
      {pendingDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-5"
          onClick={() => setPendingDelete(null)}
        >
          <div className="w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <AlertTriangle size={20} />
            </div>
            <h3 className="mb-2 text-base font-bold text-slate-900">Delete this job posting?</h3>
            <p className="mb-5 text-sm leading-relaxed text-slate-500">
              This removes <strong className="text-slate-800">{pendingDelete.title}</strong> and its{' '}
              <strong className="text-slate-800">{pendingDelete.candidates}</strong> screened candidates from your
              dashboard. This can&apos;t be undone.
            </p>
            <div className="flex justify-end gap-2.5">
              <Button variant="secondary" onClick={() => setPendingDelete(null)}>Cancel</Button>
              <Button variant="danger" onClick={confirmDelete}>Delete job</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListPage;
