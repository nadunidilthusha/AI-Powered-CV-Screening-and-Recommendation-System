const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const asyncHandler = require('../utils/asyncHandler');

/*
  Build the data required by the approved Dashboard UI.

  Dashboard sections:
  - Statistics Cards
  - Job Statistics
  - Candidate Statistics
  - Processing Status
  - Top Candidates

  Recent Jobs is intentionally NOT included because
  it is not part of the approved Dashboard UI.
*/
const buildDashboardData = async () => {
  const [jobs, candidates] = await Promise.all([
    Job.find({})
      .sort({ createdAt: -1 })
      .lean(),

    Candidate.find({})
      .lean(),
  ]);

  const now = new Date();

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  /*
    ==========================================
    STATISTICS CARDS
    ==========================================
  */

  const totalJobs = jobs.length;

  const activeJobs = jobs.filter(
    (job) => job.status === 'Active'
  ).length;

  const jobsCreatedThisMonth = jobs.filter(
    (job) =>
      new Date(job.createdAt) >= startOfMonth
  ).length;

  const activeJobsPercentage =
    totalJobs === 0
      ? 0
      : Math.round(
          (activeJobs / totalJobs) * 100
        );

  const totalCandidates = candidates.length;

  const candidatesCreatedThisMonth =
    candidates.filter(
      (candidate) =>
        new Date(candidate.createdAt) >=
        startOfMonth
    ).length;

  const pendingCandidates =
    candidates.filter(
      (candidate) =>
        candidate.status === 'Pending'
    ).length;

  const processingCandidates =
    candidates.filter(
      (candidate) =>
        candidate.status === 'Processing'
    ).length;

  const completeCandidates =
    candidates.filter(
      (candidate) =>
        candidate.status === 'Complete'
    ).length;

  const failedCandidates =
    candidates.filter(
      (candidate) =>
        candidate.status === 'Failed'
    ).length;

  /*
    Processed CVs are CVs that have finished
    processing, whether successful or failed.
  */
  const cvsProcessed =
    completeCandidates + failedCandidates;

  const cvsPendingOrProcessing =
    pendingCandidates +
    processingCandidates;

  /*
    ==========================================
    JOB STATISTICS
    ==========================================
  */

  const closedJobs = jobs.filter(
    (job) => job.status === 'Closed'
  ).length;

  const draftJobs = jobs.filter(
    (job) => job.status === 'Draft'
  ).length;

  /*
    Group Candidate records by Job.
  */
  const candidatesByJob = new Map();

  for (const candidate of candidates) {
    const jobId = String(candidate.jobId);

    if (!candidatesByJob.has(jobId)) {
      candidatesByJob.set(jobId, {
        total: 0,
        pending: 0,
        processing: 0,
        complete: 0,
        failed: 0,
      });
    }

    const counts =
      candidatesByJob.get(jobId);

    counts.total += 1;

    if (candidate.status === 'Pending') {
      counts.pending += 1;
    }

    if (candidate.status === 'Processing') {
      counts.processing += 1;
    }

    if (candidate.status === 'Complete') {
      counts.complete += 1;
    }

    if (candidate.status === 'Failed') {
      counts.failed += 1;
    }
  }

  const jobsWithCvs = jobs.filter(
    (job) =>
      candidatesByJob.has(String(job._id))
  ).length;

  /*
    ==========================================
    CANDIDATE STATISTICS
    ==========================================

    Matches the approved Dashboard donut:
    Highly Recommended
    Recommended
    Not Recommended
    Pending
  */

  const highlyRecommended =
    candidates.filter(
      (candidate) =>
        candidate.aiEvaluation
          ?.recommendationStatus ===
        'Highly Recommended'
    ).length;

  const recommended =
    candidates.filter(
      (candidate) =>
        candidate.aiEvaluation
          ?.recommendationStatus ===
        'Recommended'
    ).length;

  const notRecommended =
    candidates.filter(
      (candidate) =>
        candidate.aiEvaluation
          ?.recommendationStatus ===
        'Not Recommended'
    ).length;

  const recommendationPending =
    candidates.filter(
      (candidate) =>
        !candidate.aiEvaluation
          ?.recommendationStatus ||
        candidate.aiEvaluation
          ?.recommendationStatus ===
          'Pending'
    ).length;

  /*
    ==========================================
    PROCESSING STATUS BY JOB
    ==========================================
  */

  const processingStatus = jobs.map(
    (job) => {
      const counts =
        candidatesByJob.get(
          String(job._id)
        ) || {
          total: 0,
          pending: 0,
          processing: 0,
          complete: 0,
          failed: 0,
        };

      const processed =
        counts.complete + counts.failed;

      const progressPercentage =
        counts.total === 0
          ? 0
          : Math.round(
              (processed /
                counts.total) *
                100
            );

      let status = 'Pending';

      if (counts.total === 0) {
        status = 'No CVs';
      } else if (
        counts.failed === counts.total
      ) {
        status = 'Failed';
      } else if (
        counts.complete === counts.total
      ) {
        status = 'Completed';
      } else if (
        counts.processing > 0 ||
        counts.complete > 0 ||
        counts.failed > 0
      ) {
        status = 'Processing';
      }

      return {
        jobId: job._id,
        jobTitle: job.title,

        totalCandidates:
          counts.total,

        processedCandidates:
          processed,

        pending:
          counts.pending,

        processing:
          counts.processing,

        complete:
          counts.complete,

        failed:
          counts.failed,

        progressPercentage,

        status,
      };
    }
  );

  /*
    ==========================================
    TOP CANDIDATES
    ==========================================

    Only completed AI evaluations should
    appear as Top Candidates.
  */

  const topCandidates = candidates
    .filter(
      (candidate) =>
        candidate.status === 'Complete'
    )
    .sort(
      (a, b) =>
        (b.aiEvaluation
          ?.matchPercentage || 0) -
        (a.aiEvaluation
          ?.matchPercentage || 0)
    )
    .slice(0, 5)
    .map((candidate) => ({
      candidateId:
        candidate._id,

      jobId:
        candidate.jobId,

      name:
        candidate.name ||
        candidate.originalFileName
          ?.replace(/\.pdf$/i, '') ||
        'Candidate',

      matchPercentage:
        candidate.aiEvaluation
          ?.matchPercentage || 0,

      recommendationStatus:
        candidate.aiEvaluation
          ?.recommendationStatus ||
        'Pending',

      matchingSkills:
        candidate.aiEvaluation
          ?.matchingSkills || [],

      missingSkills:
        candidate.aiEvaluation
          ?.missingSkills || [],
    }));

  /*
    ==========================================
    FINAL DASHBOARD DATA
    ==========================================
  */

  return {
    statisticsCards: {
      totalJobPostings:
        totalJobs,

      jobsCreatedThisMonth,

      activeJobs,

      activeJobsPercentage,

      totalCandidates,

      candidatesCreatedThisMonth,

      cvsProcessed,

      cvsPendingOrProcessing,
    },

    jobStatistics: {
      active:
        activeJobs,

      closed:
        closedJobs,

      draft:
        draftJobs,

      jobsWithCvs,
    },

    candidateStatistics: {
      total:
        totalCandidates,

      highlyRecommended,

      recommended,

      notRecommended,

      pending:
        recommendationPending,
    },

    processingSummary: {
      pending:
        pendingCandidates,

      processing:
        processingCandidates,

      complete:
        completeCandidates,

      failed:
        failedCandidates,
    },

    processingStatus,

    topCandidates,
  };
};

/*
  GET /api/dashboard

  Returns everything required by
  the approved Dashboard page.
*/
const getDashboardOverview =
  asyncHandler(async (req, res) => {
    const data =
      await buildDashboardData();

    res.success(
      data,
      'Dashboard data retrieved successfully'
    );
  });

/*
  GET /api/dashboard/statistics
*/
const getDashboardStatistics =
  asyncHandler(async (req, res) => {
    const data =
      await buildDashboardData();

    res.success(
      {
        statisticsCards:
          data.statisticsCards,

        jobStatistics:
          data.jobStatistics,
      },
      'Dashboard statistics retrieved successfully'
    );
  });

/*
  GET /api/dashboard/candidate-statistics
*/
const getCandidateStatistics =
  asyncHandler(async (req, res) => {
    const data =
      await buildDashboardData();

    res.success(
      {
        candidateStatistics:
          data.candidateStatistics,

        processingSummary:
          data.processingSummary,
      },
      'Candidate statistics retrieved successfully'
    );
  });

/*
  GET /api/dashboard/processing-status
*/
const getProcessingStatus =
  asyncHandler(async (req, res) => {
    const data =
      await buildDashboardData();

    res.success(
      data.processingStatus,
      'Processing status retrieved successfully'
    );
  });

/*
  GET /api/dashboard/top-candidates
*/
const getTopCandidates =
  asyncHandler(async (req, res) => {
    const data =
      await buildDashboardData();

    res.success(
      data.topCandidates,
      'Top candidates retrieved successfully'
    );
  });

module.exports = {
  getDashboardOverview,
  getDashboardStatistics,
  getCandidateStatistics,
  getProcessingStatus,
  getTopCandidates,
};