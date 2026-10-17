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
