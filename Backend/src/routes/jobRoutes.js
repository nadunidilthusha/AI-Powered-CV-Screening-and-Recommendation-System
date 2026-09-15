const express = require('express');
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { uploadCvs, getUploadStatus } = require('../controllers/cvUploadController');
const { getCandidatesForJob } = require('../controllers/candidateController');
const reportRoutes = require('./reportRoutes');
const { jobValidator } = require('../validators/jobValidator');
const validateRequest = require('../middleware/validateRequest');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const uploadCv = require('../middleware/uploadMiddleware');

const router = express.Router();

// All job routes require a logged-in user (HR Manager or Admin — both can
// manage jobs, matching the combined Admin layout built on the frontend).
router.use(protect);

router
  .route('/')
  .get(getJobs)
  .post(allowRoles('hr_manager', 'admin'), jobValidator, validateRequest, createJob);

router
  .route('/:id')
  .get(getJobById)
  .put(allowRoles('hr_manager', 'admin'), jobValidator, validateRequest, updateJob)
  .delete(allowRoles('hr_manager', 'admin'), deleteJob);

// CV upload — matches the frontend's cvService.js paths exactly.
router.post('/:jobId/cvs', uploadCv.array('cvs', 50), uploadCvs); // PERF-3: up to 50 CVs per bulk upload
router.get('/:jobId/cvs/status', getUploadStatus);

// Candidates nested under a job.
router.get('/:jobId/candidates', getCandidatesForJob);

// Reports nested under a job — delegated to its own router.
router.use('/:jobId', reportRoutes);

module.exports = router;
