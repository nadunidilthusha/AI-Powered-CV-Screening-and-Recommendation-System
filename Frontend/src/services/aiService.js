import api from './api';

const aiService = {
  // Agent 01: Upload PDF and extract text (Requires multipart/form-data for the file)
  extractCVText: (formData) => api.post('/ai/extract', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  // Agent 02: Evaluate candidate text against Job Description
  evaluateCandidate: (data) => api.post('/ai/evaluate', data),
  
  // Agent 03: Generate final recommendation and justification
  makeDecision: (data) => api.post('/ai/decision', data),
};

export default aiService;