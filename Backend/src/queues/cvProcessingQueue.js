const { Queue } = require('bullmq');
const env = require('../config/env');

// Redis connection used by BullMQ
const connection = {
  host: env.redis.host,
  port: env.redis.port,
  password: env.redis.password,
};

// Queue for CV processing jobs
const cvProcessingQueue = new Queue('cv-processing', {
  connection,

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: 'exponential',
      delay: 2000,
    },

    removeOnComplete: 100,
    removeOnFail: 100,
  },
});

// Add one candidate to the processing queue
const enqueueCandidate = async ({
  candidateId,
  jobId,
  filePath,
}) => {
  return cvProcessingQueue.add(
    'screen-candidate',
    {
      candidateId: String(candidateId),
      jobId: String(jobId),
      filePath,
    },
    {
      // Prevent the same candidate being queued twice
      jobId: String(candidateId),
    }
  );
};

module.exports = {
  cvProcessingQueue,
  enqueueCandidate,
};