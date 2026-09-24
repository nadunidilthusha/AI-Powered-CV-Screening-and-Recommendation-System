const axios = require('axios');
const env = require('../config/env');

const aiClient = axios.create({
  baseURL: env.aiService.baseUrl,
  timeout: 180000, // 3 minutes — the pipeline makes 3 sequential LLM calls
  headers: env.aiService.apiKey ? { 'x-api-key': env.aiService.apiKey } : {},
});

const screenCandidate = async ({ filePath, jobDescription, requiredSkills }) => {
  if (!filePath) throw new Error('screenCandidate: filePath required');
  if (!jobDescription || jobDescription.trim().length < 20) {
    throw new Error('screenCandidate: jobDescription must be ≥20 chars');
  }
  if (!Array.isArray(requiredSkills)) {
    throw new Error('screenCandidate: requiredSkills must be an array');
  }

  try {
    const { data } = await aiClient.post('/screen', {
      filePath,
      jobDescription,
      requiredSkills,
    });
    return data;
    } catch (err) {
      if (err.response?.data) {
        const data = err.response.data;
        // FastAPI:  "detail" (default)  |  Your Python handler:  "details"
        const detail = data.details || data.detail || data.message || 'unknown';
        const wrapped = new Error(
          `AI service error (${err.response.status}): ${
            typeof detail === 'string' ? detail : JSON.stringify(detail)
          }`
        );
        wrapped.statusCode = err.response.status;
        wrapped.cause = err;
        throw wrapped;
      }
      throw err;
      }
};

module.exports = { screenCandidate };