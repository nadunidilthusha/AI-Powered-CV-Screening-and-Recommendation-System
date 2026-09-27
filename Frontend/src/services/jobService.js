import api from './api';

const normalizeJob = (job) => ({
  ...job,

  id: job._id,

  type: job.type || job.employmentType || 'Full-time',
  level: job.level || job.experienceLevel || 'Entry level',

  skills: job.skills || job.requiredSkills || [],

  salaryMin: job.salaryMin ?? '',
  salaryMax: job.salaryMax ?? '',

  candidates: job.candidates ?? 0,
  highlyRecommended: job.highlyRecommended ?? 0,
  avgMatch: job.avgMatch ?? 0,
  daysOpen: job.daysOpen ?? 0,
  topMatches: job.topMatches || [],

  posted: job.posted || 'Not posted',
});

const getJobs = async (params = {}) => {
  const response = await api.get('/jobs', { params });

  return {
    ...response.data,
    data: response.data.data.map(normalizeJob),
  };
};

const getJobById = async (id) => {
  const response = await api.get(`/jobs/${id}`);

  return {
    ...response.data,
    data: normalizeJob(response.data.data),
  };
};

const createJob = async (data) => {
  const response = await api.post('/jobs', {
    title: data.title,
    department: data.department,
    type: data.type,
    level: data.level,
    location: data.location,
    salaryMin: data.salaryMin === '' ? null : Number(data.salaryMin),
    salaryMax: data.salaryMax === '' ? null : Number(data.salaryMax),
    description: data.description,
    status: data.status,
    skills: data.skills,
  });

  return {
    ...response.data,
    data: normalizeJob(response.data.data),
  };
};

const updateJob = async (id, data) => {
  const response = await api.put(`/jobs/${id}`, {
    title: data.title,
    department: data.department,
    type: data.type,
    level: data.level,
    location: data.location,
    salaryMin: data.salaryMin === '' ? null : Number(data.salaryMin),
    salaryMax: data.salaryMax === '' ? null : Number(data.salaryMax),
    description: data.description,
    status: data.status,
    skills: data.skills,
  });

  return {
    ...response.data,
    data: normalizeJob(response.data.data),
  };
};

const deleteJob = async (id) => {
  const response = await api.delete(`/jobs/${id}`);
  return response.data;
};

export default {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};