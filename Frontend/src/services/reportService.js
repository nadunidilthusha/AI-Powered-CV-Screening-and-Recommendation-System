import api from './api';

// TODO: implement API calls
const reportService = {
  getCandidateRanking: (jobId, filters) => api.get(`/jobs/${jobId}/ranking`, { params: filters }),
  exportCsv: (jobId) => api.get(`/jobs/${jobId}/export/csv`, { responseType: 'blob' }),
  exportPdf: (jobId) => api.get(`/jobs/${jobId}/export/pdf`, { responseType: 'blob' }),
};

export default reportService;
