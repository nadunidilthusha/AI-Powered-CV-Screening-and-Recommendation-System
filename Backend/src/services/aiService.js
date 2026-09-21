const axios = require('axios');
const env = require('../config/env');

const aiClient = axios.create({
  baseURL: env.aiService.baseUrl,
  timeout: 30000,
  headers: env.aiService.apiKey
    ? {
        'X-API-Key': env.aiService.apiKey,
        'Content-Type': 'application/json',
      }
    : {
        'Content-Type': 'application/json',
      },
});

/*
  Sends one candidate CV to the Python AI microservice.

  Python endpoint:
    POST /screen

  Expected request:
    {
      filePath,
      jobDescription,
      requiredSkills
    }

  Expected response:
    {
      candidate: {...},
      evaluation: {...},
      decision: {...}
    }
*/
const screenCandidate = async ({
  filePath,
  jobDescription,
  requiredSkills,
}) => {
  const { data } = await aiClient.post('/screen', {
    filePath,
    jobDescription,
    requiredSkills,
  });

  return data;
};

module.exports = {
  screenCandidate,
};