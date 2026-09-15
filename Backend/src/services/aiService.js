const axios = require('axios');
const env = require('../config/env');

const aiClient = axios.create({
  baseURL: env.aiService.baseUrl,
  timeout: 30000,
  headers: env.aiService.apiKey ? { 'X-API-Key': env.aiService.apiKey } : {},
});

// TODO: implement the call to the Python AI microservice for CV screening
// (text extraction, information extraction, HR evaluation, decision maker).
// Should send the candidate's file + job description/requirements, and
// return the structured result (extracted info, match %, recommendation).
const screenCandidate = async ({ filePath, jobDescription, requiredSkills }) => {
  // TODO: implement, e.g. const { data } = await aiClient.post('/screen', {...});
  throw new Error('screenCandidate not implemented yet');
};

module.exports = { screenCandidate };
