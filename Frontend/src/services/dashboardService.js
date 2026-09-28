import api from './api';

const dashboardService = {
  getDashboard: () =>
    api.get('/dashboard'),

  getCandidateStatistics: (jobId = '') =>
    api.get('/dashboard/candidate-statistics', {
      params: jobId
        ? { jobId }
        : {},
    }),
};

export default dashboardService;