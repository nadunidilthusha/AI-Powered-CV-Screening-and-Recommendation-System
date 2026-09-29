import api from './api';

export const buildReportParams = (filters = {}) => {
  const params = {};

  const minScore =
    filters?.matchPercentage?.[0];

  const maxScore =
    filters?.matchPercentage?.[1];

  if (minScore !== undefined) {
    params.minScore = minScore;
  }

  if (maxScore !== undefined) {
    params.maxScore = maxScore;
  }

  const recommendationStatuses =
    filters?.recommendationStatus || [];

  if (recommendationStatuses.length === 1) {
    params.recommendationStatus =
      recommendationStatuses[0];
  }

  return params;
};

const reportService = {
  getCandidateRanking: (
    jobId,
    filters = {}
  ) =>
    api.get(
      `/jobs/${jobId}/ranking`,
      {
        params:
          buildReportParams(filters),
      }
    ),

  exportCsv: (
    jobId,
    filters = {}
  ) =>
    api.get(
      `/jobs/${jobId}/export/csv`,
      {
        params:
          buildReportParams(filters),

        responseType: 'blob',
      }
    ),

  exportPdf: (
    jobId,
    filters = {}
  ) =>
    api.get(
      `/jobs/${jobId}/export/pdf`,
      {
        params:
          buildReportParams(filters),

        responseType: 'blob',
      }
    ),
};

export default reportService;