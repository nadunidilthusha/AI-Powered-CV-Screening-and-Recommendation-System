const path = require('path');
const mongoose = require('mongoose');
const { Worker } = require('bullmq');

const env = require('../config/env');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const { screenCandidate } = require('../services/aiService');

/*
  Redis connection used by the BullMQ worker.
*/
const connection = {
  host: env.redis.host,
  port: env.redis.port,
  password: env.redis.password,
};

let cvProcessingWorker = null;

/*
  Start the CV processing worker.

  IMPORTANT:
  Importing this file does NOT automatically start the worker.

  The worker starts only when:
  startCvProcessingWorker()
  is explicitly called.
*/
const startCvProcessingWorker = async () => {
  // Prevent multiple worker instances in the same process.
  if (cvProcessingWorker) {
    return cvProcessingWorker;
  }

  /*
    The worker can run as a separate Node.js process,
    therefore it needs its own MongoDB connection.
  */
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(env.mongoUri);

    console.log(
      'CV worker connected to MongoDB'
    );
  }

  /*
    Listen to jobs from the same queue created in:

    src/queues/cvProcessingQueue.js

    Queue name:
    cv-processing
  */
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

      /*
        Find the Candidate record that was created
        when the CV was uploaded.
      */
      const candidate =
        await Candidate.findById(candidateId);

      if (!candidate) {
        throw new Error(
          `Candidate not found: ${candidateId}`
        );
      }

      try {
        /*
          Find the job so that its description
          and required skills can be passed
          to the Python AI microservice.
        */
        const job = await Job.findById(jobId);

        if (!job) {
          throw new Error(
            `Job not found: ${jobId}`
          );
        }

        /*
          The worker has now picked up the CV.

          Status flow:

          Pending
             ↓
          Processing
        */
        candidate.status = 'Processing';
        candidate.processingError = '';

        await candidate.save();

        /*
          Candidate CV paths are currently stored as
          relative paths, for example:

          uploads/123456789-cv.pdf

          Convert that into an absolute filesystem path
          before sending it to the AI service.
        */
        const absoluteFilePath = path.resolve(
          process.cwd(),
          filePath
        );

        /*
          The Python AI microservice expects:

          POST /screen

          {
            filePath,
            jobDescription,
            requiredSkills
          }
        */
        const result = await screenCandidate({
          filePath: absoluteFilePath,

          jobDescription:
            job.description,

          requiredSkills:
            job.skills || [],
        });

        /*
          Python ScreeningResponse:

          {
            candidate: {
              full_name,
              email,
              phone,
              education: [],
              experience: [],
              skills: []
            },

            evaluation: {
              matching_skills: [],
              missing_skills: [],
              experience_assessment,
              match_percentage
            },

            decision: {
              recommendation,
              justification
            }
          }
        */

        const extractedCandidate =
          result.candidate || {};

        const evaluation =
          result.evaluation || {};

        const decision =
          result.decision || {};

        /*
          Map extracted candidate information
          from Python into Candidate.js.
        */
        candidate.name =
          extractedCandidate.full_name ?? '';

        candidate.email =
          extractedCandidate.email ?? '';

        candidate.phone =
          extractedCandidate.phone ?? '';

        /*
          Python returns arrays for education
          and experience.

          Candidate.js currently stores these
          as strings, so join them into readable
          multi-line text.
        */
        candidate.education =
          Array.isArray(
            extractedCandidate.education
          )
            ? extractedCandidate.education.join(
                '\n'
              )
            : '';

        candidate.experience =
          Array.isArray(
            extractedCandidate.experience
          )
            ? extractedCandidate.experience.join(
                '\n'
              )
            : '';

        candidate.technicalSkills =
          Array.isArray(
            extractedCandidate.skills
          )
            ? extractedCandidate.skills
            : [];

        /*
          Map Agent 02 + Agent 03 results
          into aiEvaluation.
        */
        candidate.aiEvaluation = {
          matchPercentage:
            evaluation.match_percentage ?? 0,

          recommendationStatus:
            decision.recommendation ??
            'Pending',

          matchingSkills:
            Array.isArray(
              evaluation.matching_skills
            )
              ? evaluation.matching_skills
              : [],

          missingSkills:
            Array.isArray(
              evaluation.missing_skills
            )
              ? evaluation.missing_skills
              : [],

          justification:
            decision.justification ?? '',
        };

        /*
          AI processing completed successfully.

          Processing
              ↓
          Complete
        */
        candidate.status = 'Complete';
        candidate.processingError = '';

        await candidate.save();

        console.log(
          `Candidate processing completed: ${candidateId}`
        );

        return {
          candidateId: String(
            candidate._id
          ),

          jobId: String(job._id),

          status: candidate.status,
        };
      } catch (error) {
        /*
          BullMQ queue configuration currently
          allows 3 attempts.

          bullJob.attemptsMade represents attempts
          that have already been made.

          Add 1 because this is the current attempt.
        */
        const maxAttempts =
          bullJob.opts.attempts || 1;

        const currentAttempt =
          bullJob.attemptsMade + 1;

        const isFinalAttempt =
          currentAttempt >= maxAttempts;

        candidate.processingError =
          error.message ||
          'CV processing failed';

        /*
          Do not permanently mark the Candidate
          as Failed on an early attempt because
          BullMQ may retry it.

          Only the final failed attempt becomes:

          Failed
        */
        if (isFinalAttempt) {
          candidate.status = 'Failed';
        } else {
          candidate.status = 'Processing';
        }

        await candidate.save();

        /*
          Re-throw the error so BullMQ knows
          that this attempt failed.

          BullMQ can then perform its configured
          retry/backoff behaviour.
        */
        throw error;
      }
    },

    {
      connection,

      /*
        Allow up to two CVs to be processed
        at the same time.
      */
      concurrency: 2,
    }
  );

  /*
    Worker event listeners.
  */

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

  console.log(
    'CV processing worker started'
  );

  return cvProcessingWorker;
};

/*
  Gracefully stop the worker.

  Useful when shutting down the worker process.
*/
const stopCvProcessingWorker = async () => {
  if (cvProcessingWorker) {
    await cvProcessingWorker.close();

    cvProcessingWorker = null;
  }

  if (
    mongoose.connection.readyState !== 0
  ) {
    await mongoose.disconnect();
  }

  console.log(
    'CV processing worker stopped'
  );
};

module.exports = {
  startCvProcessingWorker,
  stopCvProcessingWorker,
};