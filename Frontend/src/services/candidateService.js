import api from './api';

// TODO: implement API calls
const candidateService = {
  getCandidates: (jobId) => api.get(`/jobs/${jobId}/candidates`),
  getCandidateById: (id) => api.get(`/candidates/${id}`),
  getAIRecommendation: (id) => api.get(`/candidates/${id}/recommendation`),
  deleteCandidate: (id) => api.delete(`/candidates/${id}`),
};

export default candidateService;
