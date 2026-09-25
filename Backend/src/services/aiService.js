const axios = require('axios');
const env = require('../config/env');

const aiClient = axios.create({
  baseURL: env.aiService.baseUrl,
  // 3 minutes — the pipeline makes 2-3 sequential LLM calls and Gemini
  // can be slow under congestion. 30s is too short.
  timeout: 180000,
  headers: {
    // FastAPI's Header() lookup is case-insensitive, so x-api-key
    // and X-API-Key are equivalent. Using lowercase here matches the
    // dependency definition in the Python service.
    ...(env.aiService.apiKey && { 'x-api-key': env.aiService.apiKey }),
    'Content-Type': 'application/json',
  },
});

/**
 * Send one candidate CV to the Python AI microservice.
 *
 * Python endpoint: POST /screen
 * Request:  { filePath, jobDescription, requiredSkills }
 * Response: { candidate: {...}, evaluation: {...}, decision: {...} }
 */
const screenCandidate = async ({ filePath, jobDescription, requiredSkills }) => {
  if (!filePath) {
    throw new Error('screenCandidate: filePath is required');
  }
  if (!jobDescription || jobDescription.trim().length < 20) {
    throw new Error(
      'screenCandidate: jobDescription is required and must be at least 20 characters'
    );
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
      // FastAPI default: "detail"  |  Your custom handler: "details"
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