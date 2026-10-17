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
import { authenticateToken, requireRole, optionalAuth } from '../middleware/authMiddleware.js';
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
import { VisaIntelligenceController } from '../controllers/visaIntelligenceController.js';
import { AcademicEligibilityController } from '../controllers/academicEligibilityController.js';
import * as ContentPlatformController from '../controllers/contentPlatformController.js';
import { linkHealthController } from '../controllers/linkHealthController.js';
import { careerToolkitController } from '../controllers/careerToolkitController.js';
import { countryWorkGuideController } from '../controllers/countryWorkGuideController.js';

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

// ==========================================
// LIVE GLOBAL VISA INTELLIGENCE & APPLICATION CENTRES ROUTES
// ==========================================

// Public Visa Intelligence Routes
router.get('/visa/statistics', VisaIntelligenceController.getStatistics);
router.get('/visa/country/:countryCode', VisaIntelligenceController.getCountryIntelligence);
router.get('/visa/centres', VisaIntelligenceController.getCentres);
router.post('/visa/find-centre', VisaIntelligenceController.findCentre);
router.get('/visa/updates', VisaIntelligenceController.getUpdates);
router.get('/visa/search', VisaIntelligenceController.search);
router.post('/visa/corrections', VisaIntelligenceController.submitCorrection);

// Admin Visa Intelligence Routes
router.get(
  '/admin/visa/corrections',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  VisaIntelligenceController.adminGetCorrections
);

router.post(
  '/admin/visa/corrections/:id/review',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  VisaIntelligenceController.adminReviewCorrection
);

router.put(
  '/admin/visa/statistics/:id',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  VisaIntelligenceController.adminUpdateStatistics
);

router.post(
  '/admin/visa/seed',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  VisaIntelligenceController.triggerSeed
);

// ============================================================================
// GLOBAL ACADEMIC ELIGIBILITY & SUBJECT REQUIREMENTS ROUTES (SECTION 14)
// ============================================================================

// Public Academic Eligibility APIs
router.get('/academic/requirements', AcademicEligibilityController.getRequirements);
router.get('/academic/requirements/:id', AcademicEligibilityController.getRequirementById);
router.post('/academic/evaluate', AcademicEligibilityController.evaluate);
router.get('/academic/grade-scales', AcademicEligibilityController.getGradeScales);
router.get('/academic/equivalencies', AcademicEligibilityController.getEquivalencies);
router.post('/academic/corrections', AcademicEligibilityController.submitCorrection);

// Admin Academic Eligibility APIs
router.get(
  '/admin/academic/corrections',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  AcademicEligibilityController.adminGetCorrections
);

router.post(
  '/admin/academic/corrections/:id/review',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  AcademicEligibilityController.adminReviewCorrection
);

router.put(
  '/admin/academic/requirements/:id',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  AcademicEligibilityController.adminUpdateRequirement
);

router.post(
  '/admin/academic/seed',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  AcademicEligibilityController.triggerSeed
);

// ============================================================================
// PREMIUM RESEARCH, EDUCATION BLOG & SUPER ADMIN CONTENT PLATFORM (SECTION 15)
// ============================================================================

// Public Content & Blog APIs
router.get('/blog/articles', ContentPlatformController.getArticles);
router.get('/blog/articles/:slug', ContentPlatformController.getArticleBySlug);
router.get('/blog/categories', ContentPlatformController.getCategories);
router.get('/blog/authors', ContentPlatformController.getAuthors);
router.get('/blog/authors/:slug', ContentPlatformController.getAuthorBySlug);
router.get('/research/papers', ContentPlatformController.getResearchPapers);
router.get('/research/papers/:slug', ContentPlatformController.getResearchPaperBySlug);
router.get('/compare/universities', ContentPlatformController.getUniversityComparisons);
router.get('/compare/countries', ContentPlatformController.getCountryComparisons);

// User Bookmarks & Reader Corrections
router.post('/blog/bookmarks/:articleId', authenticateToken, ContentPlatformController.toggleArticleBookmark);
router.get('/blog/bookmarks', authenticateToken, ContentPlatformController.getUserBookmarks);
router.get('/blog/bookmarks/check/:articleId', optionalAuth, ContentPlatformController.checkIsBookmarked);
router.post('/blog/corrections', optionalAuth, ContentPlatformController.submitCorrectionReport);

// Super Admin Content Studio APIs
router.get(
  '/admin/content/overview',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  ContentPlatformController.adminGetContentOverview
);

router.get(
  '/admin/content/articles',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  ContentPlatformController.getArticles
);

router.post(
  '/admin/content/articles',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  ContentPlatformController.adminSaveArticle
);

router.post(
  '/admin/content/articles/:id/review',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  ContentPlatformController.adminReviewArticle
);

router.post(
  '/admin/content/ai-draft',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  ContentPlatformController.adminGenerateAiDraft
);

router.post(
  '/admin/content/sources/verify',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  ContentPlatformController.adminVerifySources
);

router.get(
  '/admin/content/corrections',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  ContentPlatformController.adminGetCorrectionReports
);

router.post(
  '/admin/content/corrections/:id/resolve',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  ContentPlatformController.adminResolveCorrection
);

router.post(
  '/admin/content/seed',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  ContentPlatformController.adminSeedContentPlatform
);

// ============================================================================
// 16. SUPER ADMIN LINK HEALTH, AUDIT & AUTOMATED REPAIR APIS
// ============================================================================
router.get(
  '/admin/link-health/stats',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  linkHealthController.getStats
);

router.get(
  '/admin/link-health/records',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  linkHealthController.getRecords
);

router.post(
  '/admin/link-health/scan',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  linkHealthController.runScan
);

router.post(
  '/admin/link-health/repair',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  linkHealthController.applyRepair
);

router.post(
  '/admin/link-health/auto-repair',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  linkHealthController.autoRepairBatch
);

router.post(
  '/admin/link-health/reject',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  linkHealthController.rejectRepair
);

router.post(
  '/admin/link-health/retry',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  linkHealthController.retryLink
);

router.post(
  '/admin/link-health/candidate',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  linkHealthController.updateCandidate
);

router.get(
  '/admin/link-health/export-csv',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  linkHealthController.exportCsv
);

router.get(
  '/admin/link-health/history',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  linkHealthController.getHistory
);

// ============================================================================
// 17. CAREER TOOLKIT, CV WRITING, EUROPASS & RESUME ROUTES
// ============================================================================

router.get('/career-toolkit/research-records', careerToolkitController.getResearchRecords);
router.get('/career-toolkit/cv-examples', careerToolkitController.getCVExamples);
router.get('/career-toolkit/cv-examples/:slug', careerToolkitController.getCVExampleBySlug);
router.get('/career-toolkit/guides', careerToolkitController.getGuides);
router.get('/career-toolkit/guides/:slug', careerToolkitController.getGuideBySlug);
router.get('/career-toolkit/before-after', careerToolkitController.getBeforeAfterExamples);
router.get('/career-toolkit/checklist', careerToolkitController.getChecklist);
router.get('/career-toolkit/checklist/progress', optionalAuth, careerToolkitController.getChecklistProgress);
router.post('/career-toolkit/checklist/progress', optionalAuth, careerToolkitController.saveChecklistProgress);
router.post('/career-toolkit/review', careerToolkitController.runQualityReview);
router.post('/career-toolkit/seed', careerToolkitController.triggerSeed);

router.get('/career-toolkit/drafts', authenticateToken, careerToolkitController.getUserDrafts);
router.get('/career-toolkit/drafts/:id', optionalAuth, careerToolkitController.getDraftById);
router.post('/career-toolkit/drafts', optionalAuth, careerToolkitController.saveDraft);
router.delete('/career-toolkit/drafts/:id', authenticateToken, careerToolkitController.deleteDraft);

router.post(
  '/admin/career-toolkit/research-records',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  careerToolkitController.adminCreateResearchRecord
);
router.put(
  '/admin/career-toolkit/research-records/:id',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  careerToolkitController.adminUpdateResearchRecord
);
router.delete(
  '/admin/career-toolkit/research-records/:id',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  careerToolkitController.adminDeleteResearchRecord
);

// ============================================================================
// 18. COUNTRY WORK & CAREER GUIDE SUBSYSTEM
// ============================================================================

router.get('/country-work-guide', (req, res) => countryWorkGuideController.getGlobalOverview(req, res));
router.get('/country-work-guide/compare', (req, res) => countryWorkGuideController.getSideBySideComparison(req, res));
router.get('/country-work-guide/minimum-wages', (req, res) => countryWorkGuideController.getMinimumWages(req, res));
router.get('/country-work-guide/student-work-rules', (req, res) => countryWorkGuideController.getStudentWorkRules(req, res));
router.get('/country-work-guide/post-study-work', (req, res) => countryWorkGuideController.getPostStudyWorkRoutes(req, res));
router.get('/country-work-guide/career-roadmaps', (req, res) => countryWorkGuideController.getCareerRoadmaps(req, res));
router.get('/country-work-guide/sources', (req, res) => countryWorkGuideController.getOfficialSources(req, res));
router.get('/country-work-guide/profile/:codeOrSlug', (req, res) => countryWorkGuideController.getCountryProfile(req, res));
router.post('/country-work-guide/planner', (req, res) => countryWorkGuideController.generatePersonalizedPlan(req, res));
router.post('/country-work-guide/corrections', optionalAuth, (req, res) => countryWorkGuideController.submitCorrectionReport(req, res));

// Admin routes
router.post(
  '/admin/country-work-guide/verify',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  (req, res) => countryWorkGuideController.verifyPolicy(req, res)
);
router.get(
  '/admin/country-work-guide/corrections',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  (req, res) => countryWorkGuideController.getCorrectionReports(req, res)
);
router.patch(
  '/admin/country-work-guide/corrections/:id',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'ADMIN']),
  (req, res) => countryWorkGuideController.reviewCorrectionReport(req, res)
);

export default router;


