import api from './api';

// TODO: implement API calls
const cvService = {
  uploadCvs: (jobId, formData, onUploadProgress) =>
    api.post(`/jobs/${jobId}/cvs`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }),
  getUploadStatus: (jobId) => api.get(`/jobs/${jobId}/cvs/status`),
};

export default cvService;
