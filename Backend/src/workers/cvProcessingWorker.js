const path = require('path');
const mongoose = require('mongoose');
const { Worker } = require('bullmq');

const env = require('../config/env');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const { screenCandidate } = require('../services/aiService');

const connection = {
  host: env.redis.host,
  port: env.redis.port,
  password: env.redis.password,
};

let cvProcessingWorker = null;

/*
  Starts the BullMQ CV processing worker.

  IMPORTANT:
  Merely importing this file does NOT start the worker.
  startCvProcessingWorker() must be called explicitly.
*/
const startCvProcessingWorker = async () => {
  if (cvProcessingWorker) {
    return cvProcessingWorker;
  }

  // The worker normally runs as its own Node process,
  // so it needs its own MongoDB connection.
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(env.mongoUri);
    console.log('CV worker connected to MongoDB');
  }

  cvProcessingWorker = new Worker(
    'cv-processing',

    async (bullJob) => {
      const {
        candidateId,
        jobId,
        filePath,
      } = bullJob.data;

      console.log(
        `Processing candidate ${candidateId} for job ${jobId}`
      );

      const candidate = await Candidate.findById(candidateId);

      if (!candidate) {
        throw new Error(
          `Candidate not found: ${candidateId}`
        );
      }

      const job = await Job.findById(jobId);

      if (!job) {
        candidate.status = 'Failed';
        candidate.processingError = 'Job not found';
        await candidate.save();

        throw new Error(
          `Job not found: ${jobId}`
        );
      }

      // Candidate has now been picked up by the worker.
      candidate.status = 'Processing';
      candidate.processingError = '';

      await candidate.save();

      try {
        /*
          cvUrl / filePath is stored as a relative path such as:

          uploads/123456789-file.pdf

          Convert it into an absolute path before sending it
          to the AI service.
        */
        const absoluteFilePath = path.resolve(
          process.cwd(),
          filePath
        );

        const result = await screenCandidate({
          filePath: absoluteFilePath,
          jobDescription: job.description,
          requiredSkills: job.skills || [],
        });

        /*
          This mapping follows the fields currently available
          in Candidate.js.

          When the AI microservice response contract is finalized,
          this is the section we may need to adjust.
        */

        if (result.name !== undefined) {
          candidate.name = result.name;
        }

        if (result.email !== undefined) {
          candidate.email = result.email;
        }

        if (result.phone !== undefined) {
          candidate.phone = result.phone;
        }

        if (result.education !== undefined) {
          candidate.education = result.education;
        }

        if (result.experience !== undefined) {
          candidate.experience = result.experience;
        }

        if (Array.isArray(result.technicalSkills)) {
          candidate.technicalSkills =
            result.technicalSkills;
        }

        candidate.aiEvaluation = {
          matchPercentage:
            result.matchPercentage ?? 0,

          recommendationStatus:
            result.recommendationStatus ??
            'Pending',

          matchingSkills:
            Array.isArray(result.matchingSkills)
              ? result.matchingSkills
              : [],

          missingSkills:
            Array.isArray(result.missingSkills)
              ? result.missingSkills
              : [],

          justification:
            result.justification ?? '',
        };

        candidate.status = 'Complete';
        candidate.processingError = '';

        await candidate.save();

        return {
          candidateId: String(candidate._id),
          jobId: String(job._id),
          status: candidate.status,
        };
      } catch (error) {
        /*
          Queue is configured for 3 attempts.

          Do not permanently mark the candidate Failed
          on the first temporary failure because BullMQ
          may retry it.
        */
        const maxAttempts =
          bullJob.opts.attempts || 1;

        const currentAttempt =
          bullJob.attemptsMade + 1;

        const isFinalAttempt =
          currentAttempt >= maxAttempts;

        candidate.processingError =
          error.message || 'CV processing failed';

        if (isFinalAttempt) {
          candidate.status = 'Failed';
        }

        await candidate.save();

        // Throw again so BullMQ knows this attempt failed
        // and can perform its retry/backoff behaviour.
        throw error;
      }
    },

    {
      connection,
      concurrency: 2,
    }
  );

  cvProcessingWorker.on(
    'completed',
    (job) => {
      console.log(
        `CV processing completed: ${job.id}`
      );
    }
  );

  cvProcessingWorker.on(
    'failed',
    (job, error) => {
      console.error(
        `CV processing attempt failed: ${
          job?.id ?? 'unknown'
        } - ${error.message}`
      );
    }
  );

  cvProcessingWorker.on(
    'error',
    (error) => {
      console.error(
        'CV worker error:',
        error.message
      );
    }
  );

  console.log('CV processing worker started');

  return cvProcessingWorker;
};

const stopCvProcessingWorker = async () => {
  if (cvProcessingWorker) {
    await cvProcessingWorker.close();
    cvProcessingWorker = null;
  }

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

module.exports = {
  startCvProcessingWorker,
  stopCvProcessingWorker,
};