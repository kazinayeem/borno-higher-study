import { Router } from 'express';
import { getCountries, getCountryBySlug } from '../controllers/countriesController.js';
import {
  getUniversities,
  getUniversityBySlug,
  getPrograms,
  getProgramById,
} from '../controllers/universitiesController.js';
import { getScholarships, getScholarshipById } from '../controllers/scholarshipsController.js';
import { calculateCost } from '../controllers/calculatorController.js';
import { checkEnglishEligibility } from '../controllers/englishCheckerController.js';
import { consultAdvisor } from '../controllers/advisorController.js';
import {
  register,
  login,
  superAdminLogin,
  studentLogin,
  requestPasswordReset,
  resetPassword,
  reauthenticateAdmin,
  getProfile,
  toggleSaveUniversity,
  toggleSaveScholarship,
} from '../controllers/authController.js';
import {
  getAdminStats,
  updateUniversityVerification,
  previewCsvImport,
} from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';
import { SUBJECTS_DATA } from '../data/subjectsData.js';
import { ENGLISH_COACHING_CENTERS, OFFICIAL_PRACTICE_RESOURCES } from '../data/englishPrepData.js';
import {
  getPosts,
  getPostBySlug,
  applyForContributor,
  getMyApplication,
  createPost,
  getMyPosts,
  getAdminContributorApplications,
  updateContributorApplicationStatus,
  getAdminPostsQueue,
  reviewPost,
} from '../controllers/communityController.js';
import {
  submitDocument,
  getMyDocuments,
  getAdminDocumentQueue,
  reviewDocument,
  getSecureDocumentLink,
} from '../controllers/financialDocumentController.js';
import {
  getMyWorkspaces,
  createWorkspace,
  inviteMember,
} from '../controllers/workspaceController.js';
import {
  getDeadlines,
  getDeadlineById,
  createDeadline,
  updateDeadline,
  toggleDeadlineBookmark,
  getMyBookmarkedDeadlines,
} from '../controllers/deadlineController.js';
import {
  submitReport,
  getMyReports,
  getReportById,
  resubmitReport,
  getAdminReportsQueue,
  reviewReport,
} from '../controllers/reportController.js';
import {
  getCoverageDashboard,
  getPaginatedRegistry,
  getCandidatesQueue,
  reviewCandidate,
  triggerIngestion,
  getIngestionBatches,
} from '../controllers/ingestionController.js';
import { EnglishTestController } from '../controllers/englishTestController.js';
import { MoiController } from '../controllers/moiController.js';

const router = Router();

// Public Discovery APIs
router.get('/countries', getCountries);
router.get('/countries/:slug', getCountryBySlug);

router.get('/universities', getUniversities);
router.get('/universities/:slug', getUniversityBySlug);

router.get('/programs', getPrograms);
router.get('/programs/:id', getProgramById);

router.get('/subjects', (req, res) => {
  return res.json({ total: SUBJECTS_DATA.length, subjects: SUBJECTS_DATA });
});

router.get('/scholarships', getScholarships);
router.get('/scholarships/:id', getScholarshipById);

// English Test Preparation Hub (Coaching Centers & Official Resources)
router.get('/prep/coaching-centers', (req, res) => {
  const { testType, district, mode, search } = req.query;
  let results = [...ENGLISH_COACHING_CENTERS];

  if (testType && typeof testType === 'string' && testType !== 'all') {
    results = results.filter((c) => c.testsOffered.includes(testType.toUpperCase()));
  }
  if (district && typeof district === 'string' && district !== 'all') {
    results = results.filter((c) => c.district.toLowerCase() === district.toLowerCase() || c.city.toLowerCase() === district.toLowerCase());
  }
  if (mode && typeof mode === 'string' && mode !== 'all') {
    results = results.filter((c) => c.modes.includes(mode.toUpperCase()));
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.area.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  }

  return res.json({ total: results.length, coachingCenters: results });
});

router.get('/prep/resources', (req, res) => {
  const { examType } = req.query;
  let results = [...OFFICIAL_PRACTICE_RESOURCES];
  if (examType && typeof examType === 'string' && examType !== 'all') {
    results = results.filter((r) => r.examType === examType.toUpperCase() || r.examType === 'ALL');
  }
  return res.json({ total: results.length, resources: results });
});

// Interactive Tools
router.post('/calculator/calculate', calculateCost);
router.post('/english/check', checkEnglishEligibility);
router.post('/advisor/consult', consultAdvisor);

// Authentication, Two Login Endpoints & Student Profile
router.post('/auth/register', register);
router.post('/auth/student/register', register);
router.post('/auth/login', login);
router.post('/auth/super-admin/login', superAdminLogin);
router.post('/auth/student/login', studentLogin);
router.post('/auth/forgot-password', requestPasswordReset);
router.post('/auth/reset-password', resetPassword);
router.post('/auth/reauthenticate', authenticateToken, reauthenticateAdmin);
router.get('/auth/profile', authenticateToken, getProfile);
router.get('/auth/me', authenticateToken, getProfile);
router.post('/auth/saved-universities', authenticateToken, toggleSaveUniversity);
router.post('/auth/saved-scholarships', authenticateToken, toggleSaveScholarship);

// Protected Admin Reports Queue Alias
router.get(
  '/admin/reports',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  getAdminReportsQueue
);

// Student Community & Contributor APIs
router.get('/community/posts', getPosts);
router.get('/community/posts/:slug', getPostBySlug);
router.post('/community/apply-contributor', authenticateToken, applyForContributor);
router.post('/community/contributor-application', authenticateToken, applyForContributor);
router.get('/community/my-application', authenticateToken, getMyApplication);
router.post('/community/posts', authenticateToken, createPost);
router.get('/community/my-posts', authenticateToken, getMyPosts);

// Financial Documents & Verification Module
router.post('/documents/submit', authenticateToken, submitDocument);
router.post('/financial-documents/upload', authenticateToken, submitDocument);
router.get('/documents/my', authenticateToken, getMyDocuments);
router.get('/financial-documents/my-submissions', authenticateToken, getMyDocuments);
router.get('/documents/:id/secure-link', authenticateToken, getSecureDocumentLink);

// Collaborative Workspaces
router.get('/workspaces', authenticateToken, getMyWorkspaces);
router.get('/workspaces/my-workspaces', authenticateToken, getMyWorkspaces);
router.post('/workspaces', authenticateToken, createWorkspace);
router.post('/workspaces/:workspaceId/invite', authenticateToken, inviteMember);

// Protected Admin APIs
router.get(
  '/admin/stats',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN', 'DATA_EDITOR', 'DATA_REVIEWER']),
  getAdminStats
);
router.patch(
  '/admin/universities/:id/verification',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN', 'DATA_EDITOR']),
  updateUniversityVerification
);
router.post(
  '/admin/import/csv-preview',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN', 'DATA_EDITOR']),
  previewCsvImport
);

// Admin Moderation & Approval Queues
router.get(
  '/admin/contributors/applications',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  getAdminContributorApplications
);
router.get(
  '/community/admin/applications',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  getAdminContributorApplications
);
router.patch(
  '/admin/contributors/applications/:id',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  updateContributorApplicationStatus
);
router.post(
  '/community/admin/applications/:id/review',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  updateContributorApplicationStatus
);
router.get(
  '/admin/posts/queue',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN', 'MODERATOR']),
  getAdminPostsQueue
);
router.get(
  '/community/admin/pending-posts',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN', 'MODERATOR']),
  getAdminPostsQueue
);
router.patch(
  '/admin/posts/:id/review',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN', 'MODERATOR']),
  reviewPost
);
router.post(
  '/community/admin/posts/:id/moderate',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN', 'MODERATOR']),
  reviewPost
);
router.get(
  '/admin/documents/queue',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  getAdminDocumentQueue
);
router.get(
  '/financial-documents/admin/queue',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  getAdminDocumentQueue
);
router.patch(
  '/admin/documents/:id/review',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  reviewDocument
);
router.post(
  '/financial-documents/admin/review/:id',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  reviewDocument
);

// ==========================================
// Application Deadlines & Intakes
// ==========================================
router.get('/deadlines', getDeadlines);
router.get('/deadlines/:id', getDeadlineById);
router.post('/deadlines/bookmark', authenticateToken, toggleDeadlineBookmark);
router.get('/deadlines/my-bookmarks', authenticateToken, getMyBookmarkedDeadlines);
router.post(
  '/admin/deadlines',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN', 'DATA_EDITOR']),
  createDeadline
);
router.patch(
  '/admin/deadlines/:id',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN', 'DATA_EDITOR']),
  updateDeadline
);

// ==========================================
// Student Reports & Verified Data Updates
// ==========================================
router.post('/reports/submit', submitReport);
router.get('/reports/my-reports', authenticateToken, getMyReports);
router.get('/reports/:id', authenticateToken, getReportById);
router.post('/reports/:id/resubmit', authenticateToken, resubmitReport);
router.get(
  '/admin/reports/queue',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'DATA_REVIEWER']),
  getAdminReportsQueue
);
router.post(
  '/admin/reports/:id/review',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN', 'MODERATOR']),
  reviewReport
);

// ==========================================
// Global Institution Coverage & Ingestion Pipeline
// ==========================================

router.get(
  '/admin/institutions/coverage',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  getCoverageDashboard
);

router.get(
  '/admin/institutions/registry',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN', 'DATA_EDITOR']),
  getPaginatedRegistry
);

router.get(
  '/admin/institutions/candidates',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  getCandidatesQueue
);

router.post(
  '/admin/institutions/candidates/:id/review',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  reviewCandidate
);

router.post(
  '/admin/institutions/ingest',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  triggerIngestion
);

router.get(
  '/admin/institutions/batches',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  getIngestionBatches
);

// ==========================================
// ENGLISH TESTS & GLOBAL ACCEPTANCE MODULE
// ==========================================

// Public routes
router.get('/english-tests/matrix', EnglishTestController.getComparisonMatrix);
router.get('/english-tests/university-acceptance', EnglishTestController.getUniversityAcceptances);
router.post('/english-tests/advisor-recommendation', EnglishTestController.getAdvisorRecommendation);
router.post('/english-tests/corrections', EnglishTestController.submitCorrection);

// Admin routes
router.get(
  '/admin/english-tests/overview',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  EnglishTestController.getAdminOverview
);

router.put(
  '/admin/english-tests/fees/:id',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  EnglishTestController.updateFee
);

router.post(
  '/admin/english-tests/policies',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  EnglishTestController.upsertPolicy
);

router.get(
  '/admin/english-tests/corrections',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  EnglishTestController.getCorrectionsQueue
);

router.post(
  '/admin/english-tests/corrections/:id/review',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  EnglishTestController.reviewCorrection
);

router.get(
  '/admin/english-tests/outdated-policies',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  EnglishTestController.getOutdatedPolicies
);

router.post(
  '/admin/english-tests/seed',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  EnglishTestController.triggerSeed
);

// ==========================================
// MEDIUM OF INSTRUCTION (MOI) & EXEMPTION ROUTES
// ==========================================

// Public MOI Routes
router.get('/moi/policies', MoiController.getPolicies);
router.get('/moi/policies/:id', MoiController.getPolicyById);
router.post('/moi/check-eligibility', MoiController.checkEligibility);
router.post('/moi/corrections', MoiController.submitCorrection);

// Admin MOI Management Routes
router.post(
  '/admin/moi/policies',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  MoiController.createPolicy
);

router.put(
  '/admin/moi/policies/:id',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  MoiController.updatePolicy
);

router.get(
  '/admin/moi/corrections',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  MoiController.getPendingCorrections
);

router.post(
  '/admin/moi/corrections/:id/review',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  MoiController.reviewCorrection
);

router.get(
  '/admin/moi/outdated',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  MoiController.getOutdatedPolicies
);

export default router;

