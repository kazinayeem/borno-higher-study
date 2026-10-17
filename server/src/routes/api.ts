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

// Authentication & Student Profile
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/profile', authenticateToken, getProfile);
router.post('/auth/saved-universities', authenticateToken, toggleSaveUniversity);
router.post('/auth/saved-scholarships', authenticateToken, toggleSaveScholarship);

// Protected Admin APIs
router.get(
  '/admin/stats',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'DATA_EDITOR', 'DATA_REVIEWER']),
  getAdminStats
);
router.patch(
  '/admin/universities/:id/verification',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'DATA_EDITOR']),
  updateUniversityVerification
);
router.post(
  '/admin/import/csv-preview',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'DATA_EDITOR']),
  previewCsvImport
);

export default router;
