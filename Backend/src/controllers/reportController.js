const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');

const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const asyncHandler = require('../utils/asyncHandler');

const VALID_PROCESSING_STATUSES = [
  'Pending',
  'Processing',
  'Complete',
  'Failed',
];

const VALID_RECOMMENDATIONS = [
  'Highly Recommended',
  'Recommended',
  'Not Recommended',
  'Pending',
];

/*
  Escape special RegExp characters in user search input.
*/
const escapeRegExp = (value = '') =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/*
  ==========================================
  BUILD CANDIDATE FILTER
  ==========================================

  Supported query parameters:

  ?status=Pending
  ?recommendation=Recommended
  ?recommendationStatus=Recommended
  ?minScore=50
  ?maxScore=90
  ?search=John
*/
const buildCandidateFilter = (
  jobId,
  query
) => {
  const filter = {
    jobId,
  };

  /*
    Processing status.
  */
  if (query.status) {
    if (
      !VALID_PROCESSING_STATUSES.includes(
        query.status
      )
    ) {
      return {
        error:
          'Invalid candidate processing status',
      };
    }

    filter.status = query.status;
  }

  /*
    Recommendation status.

    Supports:
    ?recommendation=
    or
    ?recommendationStatus=
  */
  const recommendation =
    query.recommendation ||
    query.recommendationStatus;

  if (recommendation) {
    if (
      !VALID_RECOMMENDATIONS.includes(
        recommendation
      )
    ) {
      return {
        error:
          'Invalid recommendation status',
      };
    }

    filter[
      'aiEvaluation.recommendationStatus'
    ] = recommendation;
  }

  /*
    Match score filters.
  */
  const scoreFilter = {};

  if (
    query.minScore !== undefined &&
    query.minScore !== ''
  ) {
    const minScore = Number(
      query.minScore
    );

    if (
      Number.isNaN(minScore) ||
      minScore < 0 ||
      minScore > 100
    ) {
      return {
        error:
          'minScore must be between 0 and 100',
      };
    }

    scoreFilter.$gte = minScore;
  }

  if (
    query.maxScore !== undefined &&
    query.maxScore !== ''
  ) {
    const maxScore = Number(
      query.maxScore
    );

    if (
      Number.isNaN(maxScore) ||
      maxScore < 0 ||
      maxScore > 100
    ) {
      return {
        error:
          'maxScore must be between 0 and 100',
      };
    }

    scoreFilter.$lte = maxScore;
  }

  if (
    scoreFilter.$gte !== undefined &&
    scoreFilter.$lte !== undefined &&
    scoreFilter.$gte > scoreFilter.$lte
  ) {
    return {
      error:
        'minScore cannot be greater than maxScore',
    };
  }

  if (
    Object.keys(scoreFilter).length > 0
  ) {
    filter[
      'aiEvaluation.matchPercentage'
    ] = scoreFilter;
  }

  /*
    Candidate search.

    Searches:
    - name
    - email
    - CV filename
    - technical skills
  */
  if (
    query.search &&
    query.search.trim()
  ) {
    const searchText =
      escapeRegExp(
        query.search.trim()
      );

    const searchRegex =
      new RegExp(
        searchText,
        'i'
      );

    filter.$or = [
      {
        name: searchRegex,
      },

      {
        email: searchRegex,
      },

      {
        originalFileName:
          searchRegex,
      },

      {
        technicalSkills:
          searchRegex,
      },
    ];
  }

  return {
    filter,
  };
};

/*
  ==========================================
  FORMAT CANDIDATE
  ==========================================
*/
const formatCandidate = (
  candidate,
  rank
) => ({
  rank,

  candidateId:
    candidate._id,

  jobId:
    candidate.jobId,

  name:
    candidate.name ||
    candidate.originalFileName
      ?.replace(/\.pdf$/i, '') ||
    'Candidate',

  email:
    candidate.email || '',

  phone:
    candidate.phone || '',

  originalFileName:
    candidate.originalFileName || '',

  processingStatus:
    candidate.status,

  matchPercentage:
    candidate.aiEvaluation
      ?.matchPercentage ?? 0,

  recommendationStatus:
    candidate.aiEvaluation
      ?.recommendationStatus ??
    'Pending',

  technicalSkills:
    candidate.technicalSkills || [],

  matchingSkills:
    candidate.aiEvaluation
      ?.matchingSkills || [],

  missingSkills:
    candidate.aiEvaluation
      ?.missingSkills || [],

  justification:
    candidate.aiEvaluation
      ?.justification || '',

  createdAt:
    candidate.createdAt,
});

/*
  ==========================================
  CSV ESCAPING
  ==========================================
*/
const escapeCsvValue = (
  value
) => {
  if (
    value === null ||
    value === undefined
  ) {
    return '';
  }

  let stringValue;

  if (Array.isArray(value)) {
    stringValue =
      value.join('; ');
  } else {
    stringValue =
      String(value);
  }

  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r')
  ) {
    stringValue =
      `"${stringValue.replace(
        /"/g,
        '""'
      )}"`;
  }

  return stringValue;
};

/*
  ==========================================
  SAFE FILE NAME
  ==========================================
*/
const buildSafeJobTitle = (
  title
) =>
  title
    .replace(
      /[^a-z0-9-_]+/gi,
      '-'
    )
    .replace(
      /^-+|-+$/g,
      ''
    ) ||
  'job';

/*
  ==========================================
  FIND JOB + RANKED CANDIDATES
  ==========================================

  Shared by:
  - Ranking API
  - CSV export
  - PDF export
*/
const getReportData = async (
  jobId,
  query
) => {
  if (
    !mongoose.Types.ObjectId.isValid(
      jobId
    )
  ) {
    return {
      statusCode: 400,
      error:
        'Invalid job ID',
    };
  }

  const job =
    await Job.findById(
      jobId
    ).lean();

  if (!job) {
    return {
      statusCode: 404,
      error:
        'Job not found',
    };
  }

  const filterResult =
    buildCandidateFilter(
      jobId,
      query
    );

  if (filterResult.error) {
    return {
      statusCode: 400,
      error:
        filterResult.error,
    };
  }

  const candidates =
    await Candidate.find(
      filterResult.filter
    )
      .sort({
        'aiEvaluation.matchPercentage':
          -1,

        createdAt: 1,
      })
      .lean();

  const rankedCandidates =
    candidates.map(
      (candidate, index) =>
        formatCandidate(
          candidate,
          index + 1
        )
    );

  return {
    job,
    candidates,
    rankedCandidates,
  };
};

/*
  ==========================================
  GET /api/jobs/:jobId/ranking
  ==========================================

  Candidate Ranking API
  +
  Filter Candidates API
*/
const getCandidateRanking =
  asyncHandler(async (req, res) => {
    const {
      jobId,
    } = req.params;

    const result =
      await getReportData(
        jobId,
        req.query
      );

    if (result.error) {
      return res
        .status(
          result.statusCode
        )
        .json({
          success: false,
          message:
            result.error,
        });
    }

    const {
      job,
      rankedCandidates,
    } = result;

    const summary = {
      totalCandidates:
        rankedCandidates.length,

      highlyRecommended:
        rankedCandidates.filter(
          (candidate) =>
            candidate
              .recommendationStatus ===
            'Highly Recommended'
        ).length,

      recommended:
        rankedCandidates.filter(
          (candidate) =>
            candidate
              .recommendationStatus ===
            'Recommended'
        ).length,

      notRecommended:
        rankedCandidates.filter(
          (candidate) =>
            candidate
              .recommendationStatus ===
            'Not Recommended'
        ).length,

      pending:
        rankedCandidates.filter(
          (candidate) =>
            candidate
              .recommendationStatus ===
            'Pending'
        ).length,
    };

    res.success(
      {
        job: {
          jobId:
            job._id,

          title:
            job.title,

          department:
            job.department,

          status:
            job.status,
        },

        filters: {
          status:
            req.query.status ||
            null,

          recommendation:
            req.query
              .recommendation ||
            req.query
              .recommendationStatus ||
            null,

          minScore:
            req.query.minScore ||
            null,

          maxScore:
            req.query.maxScore ||
            null,

          search:
            req.query.search ||
            null,
        },

        summary,

        candidates:
          rankedCandidates,
      },

      'Candidate ranking retrieved successfully'
    );
  });

/*
  ==========================================
  GET /api/jobs/:jobId/export/csv
  ==========================================

  CSV Export API
*/
const exportCsv =
  asyncHandler(async (req, res) => {
    const {
      jobId,
    } = req.params;

    const result =
      await getReportData(
        jobId,
        req.query
      );

    if (result.error) {
      return res
        .status(
          result.statusCode
        )
        .json({
          success: false,
          message:
            result.error,
        });
    }

    const {
      job,
      rankedCandidates,
    } = result;

    const headers = [
      'Rank',
      'Candidate Name',
      'Email',
      'Phone',
      'Original CV File',
      'Processing Status',
      'Match Percentage',
      'Recommendation',
      'Technical Skills',
      'Matching Skills',
      'Missing Skills',
      'Justification',
      'Created At',
    ];

    const rows =
      rankedCandidates.map(
        (candidate) => [
          candidate.rank,

          candidate.name,

          candidate.email,

          candidate.phone,

          candidate
            .originalFileName,

          candidate
            .processingStatus,

          candidate
            .matchPercentage,

          candidate
            .recommendationStatus,

          candidate
            .technicalSkills,

          candidate
            .matchingSkills,

          candidate
            .missingSkills,

          candidate
            .justification,

          candidate.createdAt
            ? new Date(
                candidate.createdAt
              ).toISOString()
            : '',
        ]
      );

    const csvLines = [
      headers
        .map(
          escapeCsvValue
        )
        .join(','),

      ...rows.map(
        (row) =>
          row
            .map(
              escapeCsvValue
            )
            .join(',')
      ),
    ];

    /*
      UTF-8 BOM for Excel compatibility.
    */
    const csv =
      '\uFEFF' +
      csvLines.join(
        '\r\n'
      );

    const safeJobTitle =
      buildSafeJobTitle(
        job.title
      );

    const filename =
      `${safeJobTitle}-candidate-ranking.csv`;

    res.setHeader(
      'Content-Type',
      'text/csv; charset=utf-8'
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}"`
    );

    res
      .status(200)
      .send(csv);
  });

/*
  ==========================================
  GET /api/jobs/:jobId/export/pdf
  ==========================================

  PDF Export API

  Generates a downloadable PDF containing:
  - Job information
  - Candidate ranking
  - Match score
  - Recommendation
  - Skills
  - AI justification
*/
const exportPdf =
  asyncHandler(async (req, res) => {
    const {
      jobId,
    } = req.params;

    const result =
      await getReportData(
        jobId,
        req.query
      );

    if (result.error) {
      return res
        .status(
          result.statusCode
        )
        .json({
          success: false,
          message:
            result.error,
        });
    }

    const {
      job,
      rankedCandidates,
    } = result;

    const safeJobTitle =
      buildSafeJobTitle(
        job.title
      );

    const filename =
      `${safeJobTitle}-candidate-ranking.pdf`;

    /*
      Set PDF download headers.
    */
    res.setHeader(
      'Content-Type',
      'application/pdf'
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}"`
    );

    /*
      Create PDF document.
    */
    const doc =
      new PDFDocument({
        size: 'A4',

        margin: 50,

        info: {
          Title:
            `${job.title} - Candidate Ranking`,

          Author:
            'TalentLens CV Screening System',

          Subject:
            'Candidate Ranking Report',
        },
      });

    /*
      Stream PDF directly
      to HTTP response.
    */
    doc.pipe(res);

    /*
      ======================================
      REPORT HEADER
      ======================================
    */
    doc
      .fontSize(20)
      .text(
        'TalentLens Candidate Ranking Report',
        {
          align: 'center',
        }
      );

    doc.moveDown();

    doc
      .fontSize(14)
      .text(
        `Job: ${job.title}`
      );

    doc
      .fontSize(10)
      .text(
        `Department: ${
          job.department ||
          'Not specified'
        }`
      );

    doc.text(
      `Job Status: ${
        job.status ||
        'Not specified'
      }`
    );

    doc.text(
      `Generated: ${
        new Date().toLocaleString()
      }`
    );

    doc.text(
      `Total Candidates: ${
        rankedCandidates.length
      }`
    );

    doc.moveDown();

    doc
      .moveTo(
        doc.page.margins.left,
        doc.y
      )
      .lineTo(
        doc.page.width -
          doc.page.margins.right,
        doc.y
      )
      .stroke();

    doc.moveDown();

    /*
      ======================================
      NO CANDIDATES
      ======================================
    */
    if (
      rankedCandidates.length === 0
    ) {
      doc
        .fontSize(12)
        .text(
          'No candidates found for the selected job and filters.'
        );

      doc.end();

      return;
    }

    /*
      ======================================
      CANDIDATE DETAILS
      ======================================
    */
    rankedCandidates.forEach(
      (
        candidate,
        index
      ) => {
        /*
          Add a new page if the current
          page is getting too full.
        */
        if (
          doc.y >
          doc.page.height - 220
        ) {
          doc.addPage();
        }

        doc
          .fontSize(15)
          .text(
            `#${candidate.rank} - ${candidate.name}`
          );

        doc.moveDown(
          0.4
        );

        doc
          .fontSize(10)
          .text(
            `Match Percentage: ${candidate.matchPercentage}%`
          );

        doc.text(
          `Recommendation: ${candidate.recommendationStatus}`
        );

        doc.text(
          `Processing Status: ${candidate.processingStatus}`
        );

        doc.text(
          `Email: ${
            candidate.email ||
            'Not available'
          }`
        );

        doc.text(
          `Phone: ${
            candidate.phone ||
            'Not available'
          }`
        );

        doc.text(
          `CV File: ${
            candidate.originalFileName ||
            'Not available'
          }`
        );

        doc.moveDown(
          0.4
        );

        doc
          .fontSize(10)
          .text(
            'Technical Skills:',
            {
              continued:
                false,
            }
          );

        doc.text(
          candidate
            .technicalSkills
            .length > 0
            ? candidate
                .technicalSkills
                .join(', ')
            : 'None available'
        );

        doc.moveDown(
          0.3
        );

        doc.text(
          'Matching Skills:'
        );

        doc.text(
          candidate
            .matchingSkills
            .length > 0
            ? candidate
                .matchingSkills
                .join(', ')
            : 'None available'
        );

        doc.moveDown(
          0.3
        );

        doc.text(
          'Missing Skills:'
        );

        doc.text(
          candidate
            .missingSkills
            .length > 0
            ? candidate
                .missingSkills
                .join(', ')
            : 'None available'
        );

        doc.moveDown(
          0.3
        );

        doc.text(
          'AI Justification:'
        );

        doc.text(
          candidate
            .justification ||
            'No AI justification available.'
        );

        /*
          Separator between candidates.
        */
        if (
          index <
          rankedCandidates.length -
            1
        ) {
          doc.moveDown();

          doc
            .moveTo(
              doc.page.margins.left,
              doc.y
            )
            .lineTo(
              doc.page.width -
                doc.page.margins.right,
              doc.y
            )
            .stroke();

          doc.moveDown();
        }
      }
    );

    /*
      Finalize the PDF.
    */
    doc.end();
  });

module.exports = {
  getCandidateRanking,
  exportCsv,
  exportPdf,
};