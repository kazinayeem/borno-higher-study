import { COUNTRIES_DATA } from '../data/countriesData.js';
import { UNIVERSITIES_DATA } from '../data/universitiesData.js';
import { SCHOLARSHIPS_DATA } from '../data/scholarshipsData.js';
import { SUBJECTS_DATA } from '../data/subjectsData.js';
import { Country, University, Scholarship, SubjectItem, ProgramItem, VisaStatisticsItem, VisaApplicationCentreItem, OfficialSocialUpdateItem, VisaCorrectionReportItem, AcademicRequirementItem, GradeScaleItem, QualificationEquivalencyItem, StudentEligibilityAssessmentResult, AcademicCorrectionReportItem, ArticleItem, ArticleCategoryItem, ArticleAuthorItem, ResearchPaperItem, UniversityComparisonItem, CountryComparisonItem, ContentOverviewStats, ContentCorrectionReportItem, CVResearchRecordItem, CVExampleItem, CareerGuideItem, BeforeAfterExampleItem, ChecklistItem, CVQualityReport } from '../types/index.js';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('borno_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 1. Countries
export async function getCountries(search?: string): Promise<{ total: number; countries: Country[] }> {
  try {
    const url = new URL(`${window.location.origin}${API_BASE}/countries`);
    if (search) url.searchParams.set('search', search);
    const res = await fetch(url.toString());
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend API unavailable, using verified local data fallback');
  }

  let list = [...COUNTRIES_DATA] as Country[];
  if (search) {
    const q = search.toLowerCase();
    list = list.filter((c) => c.name.toLowerCase().includes(q) || c.capitalCity.toLowerCase().includes(q));
  }
  return { total: list.length, countries: list };
}

export async function getCountryBySlug(slug: string): Promise<{ country: Country; universities: University[]; scholarships: Scholarship[] }> {
  try {
    const res = await fetch(`${API_BASE}/countries/${slug}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend API unavailable, using verified local data fallback');
  }

  const country = COUNTRIES_DATA.find((c) => c.slug === slug) as Country;
  const universities = UNIVERSITIES_DATA.filter((u) => u.countrySlug === slug) as University[];
  const scholarships = SCHOLARSHIPS_DATA.filter((s) => s.countrySlug === slug) as Scholarship[];

  return { country, universities, scholarships };
}

// 2. Universities
export async function getUniversities(params?: {
  country?: string;
  level?: string;
  subject?: string;
  search?: string;
}): Promise<{ total: number; universities: University[] }> {
  try {
    const url = new URL(`${window.location.origin}${API_BASE}/universities`);
    if (params?.country) url.searchParams.set('country', params.country);
    if (params?.level) url.searchParams.set('level', params.level);
    if (params?.subject) url.searchParams.set('subject', params.subject);
    if (params?.search) url.searchParams.set('search', params.search);

    const res = await fetch(url.toString());
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend API unavailable, using verified local data fallback');
  }

  let list = [...UNIVERSITIES_DATA] as University[];
  if (params?.country && params.country !== 'all') {
    list = list.filter((u) => u.countrySlug === params.country);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    list = list.filter((u) => u.name.toLowerCase().includes(q) || u.countryName.toLowerCase().includes(q));
  }
  return { total: list.length, universities: list };
}

export async function getUniversityBySlug(slug: string): Promise<{ university: University; country?: Country; scholarships: Scholarship[] }> {
  try {
    const res = await fetch(`${API_BASE}/universities/${slug}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend API unavailable, using verified local data fallback');
  }

  const university = UNIVERSITIES_DATA.find((u) => u.slug === slug) as University;
  const country = COUNTRIES_DATA.find((c) => c.slug === university?.countrySlug) as Country;
  const scholarships = SCHOLARSHIPS_DATA.filter((s) => s.countrySlug === university?.countrySlug) as Scholarship[];

  return { university, country, scholarships };
}

// 3. Programs
export async function getPrograms(params?: {
  country?: string;
  level?: string;
  subject?: string;
  search?: string;
}): Promise<{ total: number; programs: ProgramItem[] }> {
  try {
    const url = new URL(`${window.location.origin}${API_BASE}/programs`);
    if (params?.country) url.searchParams.set('country', params.country);
    if (params?.level) url.searchParams.set('level', params.level);
    if (params?.subject) url.searchParams.set('subject', params.subject);
    if (params?.search) url.searchParams.set('search', params.search);

    const res = await fetch(url.toString());
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend API unavailable, using verified local data fallback');
  }

  let progs: ProgramItem[] = UNIVERSITIES_DATA.flatMap((u) =>
    u.programs.map((p) => ({
      ...p,
      universityName: u.name,
      universitySlug: u.slug,
      countrySlug: u.countrySlug,
      countryName: u.countryName,
      cityName: u.cityName,
    }))
  );

  if (params?.country && params.country !== 'all') {
    progs = progs.filter((p) => p.countrySlug === params.country);
  }
  if (params?.subject && params.subject !== 'all') {
    const s = params.subject.toLowerCase();
    progs = progs.filter((p) => p.subject.toLowerCase().includes(s) || p.name.toLowerCase().includes(s));
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    progs = progs.filter((p) => p.name.toLowerCase().includes(q) || p.universityName?.toLowerCase().includes(q));
  }

  return { total: progs.length, programs: progs };
}

export async function getProgramById(id: string): Promise<{ program: ProgramItem; country?: Country; scholarships: Scholarship[] }> {
  try {
    const res = await fetch(`${API_BASE}/programs/${id}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend API fallback');
  }

  for (const uni of UNIVERSITIES_DATA) {
    const p = uni.programs.find((item) => item.id === id);
    if (p) {
      const country = COUNTRIES_DATA.find((c) => c.slug === uni.countrySlug) as Country;
      const scholarships = SCHOLARSHIPS_DATA.filter((s) => s.countrySlug === uni.countrySlug) as Scholarship[];
      return {
        program: {
          ...p,
          universityName: uni.name,
          universitySlug: uni.slug,
          countrySlug: uni.countrySlug,
          countryName: uni.countryName,
          cityName: uni.cityName,
        },
        country,
        scholarships,
      };
    }
  }

  throw new Error('Program not found');
}

// 4. Scholarships
export async function getScholarships(params?: {
  country?: string;
  type?: string;
  degree?: string;
  fullyFunded?: boolean;
  bangladeshOnly?: boolean;
  search?: string;
}): Promise<{ total: number; scholarships: Scholarship[] }> {
  try {
    const url = new URL(`${window.location.origin}${API_BASE}/scholarships`);
    if (params?.country) url.searchParams.set('country', params.country);
    if (params?.type) url.searchParams.set('type', params.type);
    if (params?.fullyFunded) url.searchParams.set('fullyFunded', 'true');
    if (params?.bangladeshOnly) url.searchParams.set('bangladeshOnly', 'true');
    if (params?.search) url.searchParams.set('search', params.search);

    const res = await fetch(url.toString());
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend API fallback');
  }

  let list = [...SCHOLARSHIPS_DATA] as Scholarship[];
  if (params?.country && params.country !== 'all') {
    list = list.filter((s) => s.countrySlug === params.country);
  }
  if (params?.fullyFunded) {
    list = list.filter((s) => s.isFullyFunded);
  }
  if (params?.bangladeshOnly) {
    list = list.filter((s) => s.openToBangladesh);
  }
  return { total: list.length, scholarships: list };
}

// 5. Subjects
export async function getSubjects(): Promise<{ total: number; subjects: SubjectItem[] }> {
  try {
    const res = await fetch(`${API_BASE}/subjects`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend API fallback');
  }
  return { total: SUBJECTS_DATA.length, subjects: SUBJECTS_DATA };
}

// 6. Interactive Calculator
export async function calculateTuitionCost(payload: {
  countrySlug: string;
  universitySlug?: string;
  programId?: string;
  studyDurationMonths?: number;
  scholarshipId?: string;
  monthlyLivingCostOverride?: number;
}) {
  try {
    const res = await fetch(`${API_BASE}/calculator/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Calculator API fallback calculation');
  }

  // Local calculation fallback
  const country = COUNTRIES_DATA.find((c) => c.slug === payload.countrySlug) || COUNTRIES_DATA[0];
  const rate = country.exchangeRateToBdt;
  const tuition = country.avgTuitionMin;
  const living = payload.monthlyLivingCostOverride || country.avgLivingCostMonthly;
  const months = payload.studyDurationMonths || 24;

  return {
    currency: { localCode: country.currencyCode, localSymbol: country.currencySymbol, exchangeRateToBdt: rate },
    duration: { months, years: months / 12 },
    breakdown: {
      annualTuitionLocal: tuition,
      annualTuitionBdt: Math.round(tuition * rate),
      totalTuitionLocal: tuition * (months / 12),
      totalTuitionBdt: Math.round(tuition * (months / 12) * rate),
      monthlyLivingLocal: living,
      monthlyLivingBdt: Math.round(living * rate),
      totalLivingLocal: living * months,
      totalLivingBdt: Math.round(living * months * rate),
      totalCostBeforeAidLocal: (tuition * (months / 12)) + (living * months),
      totalCostBeforeAidBdt: Math.round(((tuition * (months / 12)) + (living * months)) * rate),
      scholarshipDeductionLocal: 0,
      scholarshipDeductionBdt: 0,
      netEstimatedCostLocal: (tuition * (months / 12)) + (living * months),
      netEstimatedCostBdt: Math.round(((tuition * (months / 12)) + (living * months)) * rate),
    },
    metadata: {
      officialTuitionVerified: false,
      disclaimer: "Estimated figures based on destination benchmarks.",
      lastVerifiedAt: country.lastVerifiedAt,
    },
  };
}

// 7. English Test Checker
export async function checkEnglishEligibility(payload: {
  countrySlug?: string;
  degreeLevel?: string;
  testType: string;
  overallScore: number;
  readingScore?: number;
  listeningScore?: number;
  speakingScore?: number;
  writingScore?: number;
}) {
  const res = await fetch(`${API_BASE}/english/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to evaluate English scores');
}

// 8. AI Study Advisor
export async function consultAdvisor(message: string) {
  const res = await fetch(`${API_BASE}/advisor/consult`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (res.ok) return await res.json();
  throw new Error('Study advisor consultation failed');
}

// 9. Admin Stats
export async function getAdminStats() {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: getAuthHeader(),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch admin stats');
}

// 10. Global Institution Coverage & Ingestion Pipeline
export async function getCoverageDashboard() {
  const res = await fetch(`${API_BASE}/admin/institutions/coverage`, {
    headers: getAuthHeader(),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch coverage dashboard');
}

export async function getPaginatedRegistry(params?: {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  institutionType?: string;
  accreditationStatus?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  const url = new URL(`${window.location.origin}${API_BASE}/admin/institutions/registry`);
  if (params?.page) url.searchParams.set('page', params.page.toString());
  if (params?.limit) url.searchParams.set('limit', params.limit.toString());
  if (params?.search) url.searchParams.set('search', params.search);
  if (params?.country && params.country !== 'all') url.searchParams.set('country', params.country);
  if (params?.institutionType && params.institutionType !== 'all') url.searchParams.set('institutionType', params.institutionType);
  if (params?.accreditationStatus && params.accreditationStatus !== 'all') url.searchParams.set('accreditationStatus', params.accreditationStatus);
  if (params?.sortBy) url.searchParams.set('sortBy', params.sortBy);
  if (params?.sortOrder) url.searchParams.set('sortOrder', params.sortOrder);

  const res = await fetch(url.toString(), {
    headers: getAuthHeader(),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch paginated registry');
}

export async function getCandidatesQueue(params?: {
  page?: number;
  limit?: number;
  status?: string;
  country?: string;
}) {
  const url = new URL(`${window.location.origin}${API_BASE}/admin/institutions/candidates`);
  if (params?.page) url.searchParams.set('page', params.page.toString());
  if (params?.limit) url.searchParams.set('limit', params.limit.toString());
  if (params?.status && params.status !== 'all') url.searchParams.set('status', params.status);
  if (params?.country && params.country !== 'all') url.searchParams.set('country', params.country);

  const res = await fetch(url.toString(), {
    headers: getAuthHeader(),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch candidate review queue');
}

export async function reviewCandidate(
  candidateId: string,
  action: 'APPROVE' | 'REJECT' | 'RESOLVE_DUPLICATE',
  reviewNotes?: string
) {
  const res = await fetch(`${API_BASE}/admin/institutions/candidates/${candidateId}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ action, reviewNotes }),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to process candidate review');
}

export async function triggerIngestion(countrySlug?: string) {
  const res = await fetch(`${API_BASE}/admin/institutions/ingest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ countrySlug }),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to trigger ingestion pipeline');
}

export async function getIngestionBatches() {
  const res = await fetch(`${API_BASE}/admin/institutions/batches`, {
    headers: getAuthHeader(),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch ingestion batches');
}

// ==========================================
// ENGLISH TESTS & GLOBAL ACCEPTANCE API
// ==========================================

export async function getEnglishTestMatrix() {
  const res = await fetch(`${API_BASE}/english-tests/matrix`);
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch English test comparison matrix');
}

export async function getUniversityTestAcceptances(params?: {
  countrySlug?: string;
  search?: string;
  academicLevel?: string;
  testFormatCode?: string;
  deliveryFormat?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const url = new URL(`${window.location.origin}${API_BASE}/english-tests/university-acceptance`);
  if (params?.countrySlug) url.searchParams.set('countrySlug', params.countrySlug);
  if (params?.search) url.searchParams.set('search', params.search);
  if (params?.academicLevel) url.searchParams.set('academicLevel', params.academicLevel);
  if (params?.testFormatCode) url.searchParams.set('testFormatCode', params.testFormatCode);
  if (params?.deliveryFormat) url.searchParams.set('deliveryFormat', params.deliveryFormat);
  if (params?.status) url.searchParams.set('status', params.status);
  if (params?.page) url.searchParams.set('page', String(params.page));
  if (params?.limit) url.searchParams.set('limit', String(params.limit));

  const res = await fetch(url.toString());
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch university test acceptance policies');
}

export async function getEnglishAdvisorRecommendation(payload: {
  targetCountry?: string;
  qualificationLevel?: string;
  shortlistedUniIds?: string[];
  deliveryPreference?: 'TEST_CENTRE' | 'ONLINE' | 'NO_PREFERENCE';
  existingTest?: string;
  existingScore?: number;
  budgetBdt?: number;
}) {
  const res = await fetch(`${API_BASE}/english-tests/advisor-recommendation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to get English test recommendation');
}

export async function submitEnglishTestCorrection(payload: {
  reporterName?: string;
  reporterEmail?: string;
  targetType: 'TEST_FEE' | 'UNIVERSITY_POLICY';
  feeId?: string;
  policyId?: string;
  correctionCategory: string;
  proposedChange: string;
  evidenceUrl?: string;
  evidenceNotes?: string;
}) {
  const res = await fetch(`${API_BASE}/english-tests/corrections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to submit test report');
}

export async function getAdminEnglishTestsOverview() {
  const res = await fetch(`${API_BASE}/admin/english-tests/overview`, {
    headers: getAuthHeader(),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch admin English test overview');
}

export async function updateAdminTestFee(
  id: string,
  payload: {
    amount?: number;
    currency?: string;
    bdtEstimate?: number;
    officialFeeSourceUrl?: string;
    verificationStatus?: string;
    availabilityNotes?: string;
  }
) {
  const res = await fetch(`${API_BASE}/admin/english-tests/fees/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to update test fee');
}

export async function upsertAdminUniversityPolicy(payload: any) {
  const res = await fetch(`${API_BASE}/admin/english-tests/policies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to save university policy');
}

export async function getAdminTestCorrectionsQueue() {
  const res = await fetch(`${API_BASE}/admin/english-tests/corrections`, {
    headers: getAuthHeader(),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch test corrections queue');
}

export async function reviewAdminTestCorrection(
  id: string,
  decision: 'APPROVE' | 'REJECT',
  adminNotes: string
) {
  const res = await fetch(`${API_BASE}/admin/english-tests/corrections/${id}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ decision, adminNotes }),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to process correction review');
}

export async function getAdminOutdatedTestPolicies() {
  const res = await fetch(`${API_BASE}/admin/english-tests/outdated-policies`, {
    headers: getAuthHeader(),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch outdated policies');
}

export async function triggerAdminEnglishTestSeed() {
  const res = await fetch(`${API_BASE}/admin/english-tests/seed`, {
    method: 'POST',
    headers: getAuthHeader(),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to trigger English test seed');
}

// ==========================================
// MEDIUM OF INSTRUCTION (MOI) & EXEMPTION API
// ==========================================

export async function getMoiPolicies(params?: {
  country?: string;
  universityId?: string;
  qualificationLevel?: string;
  acceptanceStatus?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const url = new URL(`${window.location.origin}${API_BASE}/moi/policies`);
  if (params?.country) url.searchParams.set('country', params.country);
  if (params?.universityId) url.searchParams.set('universityId', params.universityId);
  if (params?.qualificationLevel) url.searchParams.set('qualificationLevel', params.qualificationLevel);
  if (params?.acceptanceStatus) url.searchParams.set('acceptanceStatus', params.acceptanceStatus);
  if (params?.search) url.searchParams.set('search', params.search);
  if (params?.page) url.searchParams.set('page', String(params.page));
  if (params?.limit) url.searchParams.set('limit', String(params.limit));

  const res = await fetch(url.toString());
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch MOI policies');
}

export async function getMoiPolicyById(id: string) {
  const res = await fetch(`${API_BASE}/moi/policies/${id}`);
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch MOI policy details');
}

export async function checkMoiEligibility(payload: {
  country: string;
  universityId: string;
  programId?: string;
  completedQualification: string;
  awardingInstitution: string;
  awardingCountry?: string;
  allTaughtInEnglish: boolean;
  graduationYear: number;
  canProvideMoiLetter: boolean;
  hasAdditionalCourseReqs?: boolean;
}) {
  const res = await fetch(`${API_BASE}/moi/check-eligibility`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to assess MOI eligibility');
}

export async function submitMoiCorrection(payload: {
  universityName: string;
  issueCategory: string;
  description: string;
  evidenceUrl?: string;
  evidenceText?: string;
  moiPolicyId?: string;
  reporterName?: string;
  reporterEmail?: string;
}) {
  const res = await fetch(`${API_BASE}/moi/corrections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to submit MOI correction');
}

export async function adminCreateMoiPolicy(payload: any) {
  const res = await fetch(`${API_BASE}/admin/moi/policies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to create MOI policy');
}

export async function adminUpdateMoiPolicy(id: string, payload: any) {
  const res = await fetch(`${API_BASE}/admin/moi/policies/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to update MOI policy');
}

export async function adminGetMoiCorrections() {
  const res = await fetch(`${API_BASE}/admin/moi/corrections`, {
    headers: getAuthHeader(),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch MOI corrections');
}

export async function adminReviewMoiCorrection(
  id: string,
  action: 'APPROVED' | 'REJECTED',
  adminNotes: string
) {
  const res = await fetch(`${API_BASE}/admin/moi/corrections/${id}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ action, adminNotes }),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to review MOI correction');
}

export async function adminGetOutdatedMoiPolicies() {
  const res = await fetch(`${API_BASE}/admin/moi/outdated`, {
    headers: getAuthHeader(),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch outdated MOI policies');
}

// =============================================================
// Live Global Visa Intelligence & Bangladesh Centre Finder API
// =============================================================

export async function getVisaStatistics(params?: {
  countryCode?: string;
  applicantNationality?: string;
  applicationLocation?: string;
  visaCategory?: string;
  educationLevel?: string;
  reportingPeriodType?: string;
  dataStatus?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ total: number; page: number; limit: number; totalPages: number; statistics: VisaStatisticsItem[] }> {
  const url = new URL(`${window.location.origin}${API_BASE}/visa/statistics`);
  if (params?.countryCode) url.searchParams.set('countryCode', params.countryCode);
  if (params?.applicantNationality) url.searchParams.set('applicantNationality', params.applicantNationality);
  if (params?.applicationLocation) url.searchParams.set('applicationLocation', params.applicationLocation);
  if (params?.visaCategory) url.searchParams.set('visaCategory', params.visaCategory);
  if (params?.educationLevel) url.searchParams.set('educationLevel', params.educationLevel);
  if (params?.reportingPeriodType) url.searchParams.set('reportingPeriodType', params.reportingPeriodType);
  if (params?.dataStatus) url.searchParams.set('dataStatus', params.dataStatus);
  if (params?.search) url.searchParams.set('search', params.search);
  if (params?.page) url.searchParams.set('page', String(params.page));
  if (params?.limit) url.searchParams.set('limit', String(params.limit));

  const res = await fetch(url.toString());
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch visa statistics');
}

export async function getCountryVisaIntelligence(countryCode: string): Promise<{
  country: Country;
  statistics: VisaStatisticsItem[];
  applicationCentres: VisaApplicationCentreItem[];
  policies: any[];
  applicantRules: any[];
  socialUpdates: OfficialSocialUpdateItem[];
  outdatedSourcesCount: number;
}> {
  const res = await fetch(`${API_BASE}/visa/country/${countryCode}`);
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to fetch country visa intelligence');
}

export async function getVisaCentres(params?: {
  destinationCountryCode?: string;
  mustTravelToIndia?: string;
  status?: string;
  search?: string;
}): Promise<{ total: number; centres: VisaApplicationCentreItem[] }> {
  const url = new URL(`${window.location.origin}${API_BASE}/visa/centres`);
  if (params?.destinationCountryCode) url.searchParams.set('destinationCountryCode', params.destinationCountryCode);
  if (params?.mustTravelToIndia) url.searchParams.set('mustTravelToIndia', params.mustTravelToIndia);
  if (params?.status) url.searchParams.set('status', params.status);
  if (params?.search) url.searchParams.set('search', params.search);

  const res = await fetch(url.toString());
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch visa application centres');
}

export async function findVisaCentre(criteria: {
  passportCountry: string;
  residenceCountry: string;
  destinationCountryCode: string;
  visaCategory: string;
  submissionLocation: string;
  intendedIntakePeriod?: string;
}): Promise<{
  matchedRule: any;
  centres: VisaApplicationCentreItem[];
  mustTravelToIndia: 'NO' | 'YES' | 'POSSIBLY' | 'UNKNOWN';
  reason: string;
  recommendation: string;
}> {
  const res = await fetch(`${API_BASE}/visa/find-centre`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(criteria),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to find visa application centre');
}

export async function getVisaUpdates(params?: {
  destinationCountryCode?: string;
  platform?: string;
  limit?: number;
}): Promise<{ total: number; updates: OfficialSocialUpdateItem[] }> {
  const url = new URL(`${window.location.origin}${API_BASE}/visa/updates`);
  if (params?.destinationCountryCode) url.searchParams.set('destinationCountryCode', params.destinationCountryCode);
  if (params?.platform) url.searchParams.set('platform', params.platform);
  if (params?.limit) url.searchParams.set('limit', String(params.limit));

  const res = await fetch(url.toString());
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch official visa updates');
}

export async function searchVisaIntelligence(
  query: string,
  category?: string
): Promise<{
  query: string;
  total: number;
  results: Array<{
    title: string;
    url: string;
    publisher: string;
    domain: string;
    snippet: string;
    isOfficialDomain: boolean;
    verificationStatus: string;
    category: string;
    destinationCountryCode?: string;
    publishedDate?: string;
  }>;
}> {
  const url = new URL(`${window.location.origin}${API_BASE}/visa/search`);
  url.searchParams.set('q', query);
  if (category) url.searchParams.set('category', category);

  const res = await fetch(url.toString());
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to execute search');
}

export async function submitVisaCorrection(data: {
  targetType: 'STATISTICS' | 'CENTRE' | 'POLICY' | 'INDIA_TRAVEL';
  statisticsId?: string;
  centreId?: string;
  countryName: string;
  issueCategory: string;
  description: string;
  evidenceUrl?: string;
  reporterEmail?: string;
  reporterName?: string;
}): Promise<{ message: string; correction: any }> {
  const res = await fetch(`${API_BASE}/visa/corrections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to submit visa correction');
}

export async function adminGetVisaCorrections(): Promise<VisaCorrectionReportItem[]> {
  const res = await fetch(`${API_BASE}/admin/visa/corrections`, {
    headers: getAuthHeader(),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch pending visa corrections');
}

export async function adminReviewVisaCorrection(
  id: string,
  action: 'APPROVED' | 'REJECTED',
  adminNotes: string
): Promise<{ message: string; result: any }> {
  const res = await fetch(`${API_BASE}/admin/visa/corrections/${id}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ action, adminNotes }),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to review visa correction');
}

export async function adminUpdateVisaStatistics(
  id: string,
  data: Partial<VisaStatisticsItem>
): Promise<{ message: string; statistics: any }> {
  const res = await fetch(`${API_BASE}/admin/visa/statistics/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to update visa statistics');
}

export async function adminSeedVisaData(): Promise<{ message: string; result: any }> {
  const res = await fetch(`${API_BASE}/admin/visa/seed`, {
    method: 'POST',
    headers: getAuthHeader(),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to seed visa intelligence data');
}

// =============================================================
// Global Academic Eligibility & Subject Requirements Engine API
// =============================================================

export async function getAcademicRequirements(params?: {
  countryCode?: string;
  degreeLevel?: string;
  universityId?: string;
  hscStreamRequired?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  requirements: AcademicRequirementItem[];
}> {
  const url = new URL(`${window.location.origin}${API_BASE}/academic/requirements`);
  if (params?.countryCode && params.countryCode !== 'all') url.searchParams.set('countryCode', params.countryCode);
  if (params?.degreeLevel && params.degreeLevel !== 'all') url.searchParams.set('degreeLevel', params.degreeLevel);
  if (params?.universityId && params.universityId !== 'all') url.searchParams.set('universityId', params.universityId);
  if (params?.hscStreamRequired && params.hscStreamRequired !== 'all') url.searchParams.set('hscStreamRequired', params.hscStreamRequired);
  if (params?.search) url.searchParams.set('search', params.search);
  if (params?.page) url.searchParams.set('page', String(params.page));
  if (params?.limit) url.searchParams.set('limit', String(params.limit));

  const res = await fetch(url.toString());
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch academic requirements catalog');
}

export async function getAcademicRequirementById(id: string): Promise<AcademicRequirementItem> {
  const res = await fetch(`${API_BASE}/academic/requirements/${id}`);
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to fetch academic requirement details');
}

export async function evaluateAcademicEligibility(payload: {
  userId?: string;
  targetCountryCode?: string;
  universityId?: string;
  universityName?: string;
  programId?: string;
  programName?: string;
  degreeLevel: string;
  sscGpa?: number;
  sscScale?: number;
  hscGpa?: number;
  hscScale?: number;
  hscStream?: string;
  subjectGrades?: Array<{
    subjectName: string;
    gradeLetter?: string;
    gradeNumeric?: number;
    scale?: string;
  }>;
  bachelorDegreeTitle?: string;
  bachelorCgpa?: number;
  bachelorScale?: number;
  bachelorClass?: string;
  masterDegreeTitle?: string;
  masterCgpa?: number;
  masterScale?: number;
  hasResearchProposal?: boolean;
  hasPublications?: boolean;
  workExperienceMonths?: number;
  englishProficiencyStatus?: string;
}): Promise<StudentEligibilityAssessmentResult> {
  const res = await fetch(`${API_BASE}/academic/evaluate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to calculate academic eligibility assessment');
}

export async function getGradeScales(countryCode?: string): Promise<{ total: number; gradeScales: GradeScaleItem[] }> {
  const url = new URL(`${window.location.origin}${API_BASE}/academic/grade-scales`);
  if (countryCode) url.searchParams.set('countryCode', countryCode);
  const res = await fetch(url.toString());
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch grade scales');
}

export async function getQualificationEquivalencies(countryCode?: string): Promise<{
  total: number;
  equivalencies: QualificationEquivalencyItem[];
}> {
  const url = new URL(`${window.location.origin}${API_BASE}/academic/equivalencies`);
  if (countryCode) url.searchParams.set('countryCode', countryCode);
  const res = await fetch(url.toString());
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch qualification equivalencies');
}

export async function submitAcademicCorrection(payload: {
  academicRequirementId?: string;
  universityName: string;
  programName?: string;
  degreeLevel?: string;
  issueCategory: string;
  description: string;
  officialEvidenceUrl: string;
  reporterEmail?: string;
  reporterName?: string;
}): Promise<{ message: string; report: AcademicCorrectionReportItem }> {
  const res = await fetch(`${API_BASE}/academic/corrections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to submit academic correction report');
}

export async function adminGetAcademicCorrections(): Promise<AcademicCorrectionReportItem[]> {
  const res = await fetch(`${API_BASE}/admin/academic/corrections`, {
    headers: getAuthHeader(),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch academic corrections queue');
}

export async function adminReviewAcademicCorrection(
  id: string,
  action: 'APPROVED' | 'REJECTED',
  adminNotes: string
): Promise<{ message: string; report: AcademicCorrectionReportItem }> {
  const res = await fetch(`${API_BASE}/admin/academic/corrections/${id}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ action, adminNotes }),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to review academic correction');
}

export async function adminUpdateAcademicRequirement(
  id: string,
  data: Partial<AcademicRequirementItem>
): Promise<{ message: string; requirement: AcademicRequirementItem }> {
  const res = await fetch(`${API_BASE}/admin/academic/requirements/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to update academic requirement');
}

export async function adminSeedAcademicData(): Promise<{ message: string; result: any }> {
  const res = await fetch(`${API_BASE}/admin/academic/seed`, {
    method: 'POST',
    headers: getAuthHeader(),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to seed academic eligibility data');
}

// ============================================================================
// CONTENT PLATFORM & SUPER ADMIN STUDIO API (SECTION 15)
// ============================================================================

export async function getBlogArticles(params?: {
  category?: string;
  type?: string;
  country?: string;
  degreeLevel?: string;
  field?: string;
  search?: string;
  status?: string;
  featured?: boolean;
  editorPick?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'latest' | 'most_read' | 'editor_pick' | 'title';
}): Promise<{ total: number; limit: number; offset: number; hasMore: boolean; articles: ArticleItem[] }> {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.type) query.set('type', params.type);
  if (params?.country) query.set('country', params.country);
  if (params?.degreeLevel) query.set('degreeLevel', params.degreeLevel);
  if (params?.field) query.set('field', params.field);
  if (params?.search) query.set('search', params.search);
  if (params?.status) query.set('status', params.status);
  if (params?.featured !== undefined) query.set('featured', String(params.featured));
  if (params?.editorPick !== undefined) query.set('editorPick', String(params.editorPick));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.offset) query.set('offset', String(params.offset));
  if (params?.sortBy) query.set('sortBy', params.sortBy);

  const res = await fetch(`${API_BASE}/blog/articles?${query.toString()}`);
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch articles');
}

export async function getBlogArticleBySlug(slug: string): Promise<ArticleItem> {
  const res = await fetch(`${API_BASE}/blog/articles/${slug}`);
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Article not found');
}

export async function getBlogCategories(): Promise<ArticleCategoryItem[]> {
  const res = await fetch(`${API_BASE}/blog/categories`);
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch categories');
}

export async function getBlogAuthors(): Promise<ArticleAuthorItem[]> {
  const res = await fetch(`${API_BASE}/blog/authors`);
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch authors');
}

export async function getBlogAuthorBySlug(slug: string): Promise<ArticleAuthorItem> {
  const res = await fetch(`${API_BASE}/blog/authors/${slug}`);
  if (res.ok) return await res.json();
  throw new Error('Author not found');
}

export async function getResearchPapers(discipline?: string): Promise<ResearchPaperItem[]> {
  const url = discipline && discipline !== 'ALL'
    ? `${API_BASE}/research/papers?discipline=${encodeURIComponent(discipline)}`
    : `${API_BASE}/research/papers`;
  const res = await fetch(url);
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch research papers');
}

export async function getResearchPaperBySlug(slug: string): Promise<ResearchPaperItem> {
  const res = await fetch(`${API_BASE}/research/papers/${slug}`);
  if (res.ok) return await res.json();
  throw new Error('Research paper not found');
}

export async function getUniversityComparisons(): Promise<UniversityComparisonItem[]> {
  const res = await fetch(`${API_BASE}/compare/universities`);
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch university comparisons');
}

export async function getCountryComparisons(): Promise<CountryComparisonItem[]> {
  const res = await fetch(`${API_BASE}/compare/countries`);
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch country comparisons');
}

export async function toggleArticleBookmark(articleId: string): Promise<{ isBookmarked: boolean }> {
  const res = await fetch(`${API_BASE}/blog/bookmarks/${articleId}`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
    },
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to toggle bookmark');
}

export async function getUserBookmarks(): Promise<ArticleItem[]> {
  const res = await fetch(`${API_BASE}/blog/bookmarks`, {
    headers: {
      ...getAuthHeader(),
    },
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch bookmarks');
}

export async function checkArticleIsBookmarked(articleId: string): Promise<{ isBookmarked: boolean }> {
  const res = await fetch(`${API_BASE}/blog/bookmarks/check/${articleId}`, {
    headers: {
      ...getAuthHeader(),
    },
  });
  if (res.ok) return await res.json();
  return { isBookmarked: false };
}

export async function submitContentCorrection(data: {
  articleId?: string;
  articleTitle: string;
  articleUrl: string;
  correctionCategory: string;
  claimedErrorText: string;
  suggestedCorrection: string;
  officialEvidenceUrl: string;
  reporterName?: string;
  reporterEmail?: string;
}): Promise<{ success: boolean; reportId: string }> {
  const res = await fetch(`${API_BASE}/blog/corrections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to submit correction report');
}

// SUPER ADMIN CONTENT STUDIO APIS
export async function adminGetContentOverview(): Promise<ContentOverviewStats> {
  const res = await fetch(`${API_BASE}/admin/content/overview`, {
    headers: {
      ...getAuthHeader(),
    },
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch content overview');
}

export async function adminSaveArticle(articleData: any): Promise<{ article: ArticleItem; isNew: boolean }> {
  const res = await fetch(`${API_BASE}/admin/content/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(articleData),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to save article');
}

export async function adminReviewArticle(
  articleId: string,
  reviewData: {
    reviewStage: string;
    decision: string;
    notes: string;
    factCheckVerified: boolean;
    newStatus?: string;
  }
): Promise<{ review: any; article: ArticleItem }> {
  const res = await fetch(`${API_BASE}/admin/content/articles/${articleId}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(reviewData),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to review article');
}

export async function adminGenerateAiDraft(data: {
  topic: string;
  intendedAudience: string;
  categorySlug: string;
  targetCountryCode?: string;
  sourceUrls?: string[];
}): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/content/ai-draft`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to generate AI draft');
}

export async function adminVerifySources(articleId?: string): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/content/sources/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ articleId }),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to verify sources');
}

export async function adminGetCorrectionReports(status?: string): Promise<ContentCorrectionReportItem[]> {
  const url = status && status !== 'ALL'
    ? `${API_BASE}/admin/content/corrections?status=${encodeURIComponent(status)}`
    : `${API_BASE}/admin/content/corrections`;
  const res = await fetch(url, {
    headers: {
      ...getAuthHeader(),
    },
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch corrections');
}

export async function adminResolveCorrection(
  reportId: string,
  data: { status: string; adminResolutionNotes: string }
): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/content/corrections/${reportId}/resolve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to resolve correction');
}

export async function adminSeedContentPlatform(): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/content/seed`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
    },
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to trigger content seed');
}

// ==========================================
// 16. LINK HEALTH & AUTOMATED REPAIR API
// ==========================================

export interface LinkAuditRecordItem {
  id: string;
  originalUrl: string;
  normalizedUrl: string;
  finalUrl?: string;
  destinationType: 'INTERNAL' | 'EXTERNAL';
  category: string;
  sourceLocation: string;
  pageContext?: string;
  entityType?: string;
  entityId?: string;
  entityName?: string;
  fieldName?: string;
  httpStatus?: number;
  status: 'WORKING' | 'WORKING_REDIRECT' | 'BROKEN' | 'INCORRECT_DESTINATION' | 'REDIRECT_LOOP' | 'TIMEOUT' | 'ACCESS_RESTRICTED' | 'REQUIRES_BROWSER_VERIFICATION' | 'REQUIRES_MANUAL_REVIEW';
  redirectDestination?: string;
  suggestedReplacement?: string;
  repairStatus: 'NONE' | 'PROPOSED' | 'APPROVED' | 'REPAIRED' | 'REJECTED' | 'MANUAL_REVIEW';
  repairedUrl?: string;
  repairReason?: string;
  repairAppliedAt?: string;
  lastCheckedAt: string;
  errorMessage?: string;
  responseTimeMs?: number;
}

export interface LinkHealthStats {
  totalLinks: number;
  workingCount: number;
  redirectCount: number;
  brokenCount: number;
  reviewCount: number;
  repairedCount: number;
  lastScanAt?: string;
  categories: Record<string, number>;
}

export async function getLinkHealthStats(): Promise<LinkHealthStats> {
  const res = await fetch(`${API_BASE}/admin/link-health/stats`, {
    headers: getAuthHeader(),
  });
  if (res.ok) {
    const data = await res.json();
    return data.stats;
  }
  throw new Error('Failed to fetch link health statistics');
}

export async function getLinkHealthRecords(params?: {
  category?: string;
  status?: string;
  repairStatus?: string;
  destinationType?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ records: LinkAuditRecordItem[]; total: number; page: number; totalPages: number }> {
  const url = new URL(`${window.location.origin}${API_BASE}/admin/link-health/records`);
  if (params?.category) url.searchParams.set('category', params.category);
  if (params?.status) url.searchParams.set('status', params.status);
  if (params?.repairStatus) url.searchParams.set('repairStatus', params.repairStatus);
  if (params?.destinationType) url.searchParams.set('destinationType', params.destinationType);
  if (params?.search) url.searchParams.set('search', params.search);
  if (params?.page) url.searchParams.set('page', String(params.page));
  if (params?.limit) url.searchParams.set('limit', String(params.limit));

  const res = await fetch(url.toString(), {
    headers: getAuthHeader(),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch link audit records');
}

export async function triggerLinkHealthScan(trigger: string = 'MANUAL_SUPER_ADMIN'): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/link-health/scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ trigger }),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to run link health scan');
}

export async function applyLinkRepair(linkId: string, replacementUrl?: string): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/link-health/repair`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ linkId, replacementUrl }),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || 'Failed to apply link repair');
}

export async function autoRepairBatch(): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/link-health/auto-repair`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
    },
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to run auto-repair batch');
}

export async function rejectLinkRepair(linkId: string, notes?: string): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/link-health/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ linkId, notes }),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to reject link repair proposal');
}

export async function retryLinkVerification(linkId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/link-health/retry`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ linkId }),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to re-verify link');
}

export async function updateCandidateUrl(linkId: string, candidateUrl: string): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/link-health/candidate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ linkId, candidateUrl }),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to update candidate URL');
}

export async function getLinkHealthHistory(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/admin/link-health/history`, {
    headers: getAuthHeader(),
  });
  if (res.ok) {
    const data = await res.json();
    return data.history || [];
  }
  throw new Error('Failed to fetch link health history');
}

// ============================================================================
// 17. CAREER TOOLKIT, CV WRITING, EUROPASS & RESUME API METHODS
// ============================================================================

export async function getCareerResearchRecords(params?: {
  cvType?: string;
  field?: string;
  search?: string;
  status?: string;
}): Promise<{ total: number; records: CVResearchRecordItem[] }> {
  const url = new URL(`${window.location.origin}${API_BASE}/career-toolkit/research-records`);
  if (params?.cvType && params.cvType !== 'ALL') url.searchParams.set('cvType', params.cvType);
  if (params?.field && params.field !== 'ALL') url.searchParams.set('field', params.field);
  if (params?.search) url.searchParams.set('search', params.search);
  if (params?.status && params.status !== 'ALL') url.searchParams.set('status', params.status);

  const res = await fetch(url.toString());
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch career research records');
}

export async function getCVExamples(params?: {
  field?: string;
  careerStage?: string;
}): Promise<{ count: number; examples: CVExampleItem[] }> {
  const url = new URL(`${window.location.origin}${API_BASE}/career-toolkit/cv-examples`);
  if (params?.field && params.field !== 'ALL') url.searchParams.set('field', params.field);
  if (params?.careerStage && params.careerStage !== 'ALL') url.searchParams.set('careerStage', params.careerStage);

  const res = await fetch(url.toString());
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch CV examples');
}

export async function getCVExampleBySlug(slug: string): Promise<CVExampleItem> {
  const res = await fetch(`${API_BASE}/career-toolkit/cv-examples/${slug}`);
  if (res.ok) {
    const data = await res.json();
    return data.example;
  }
  throw new Error('Failed to fetch CV example');
}

export async function getCareerGuides(category?: string): Promise<{ count: number; guides: CareerGuideItem[] }> {
  const url = new URL(`${window.location.origin}${API_BASE}/career-toolkit/guides`);
  if (category && category !== 'ALL') url.searchParams.set('category', category);

  const res = await fetch(url.toString());
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch career guides');
}

export async function getCareerGuideBySlug(slug: string): Promise<CareerGuideItem> {
  const res = await fetch(`${API_BASE}/career-toolkit/guides/${slug}`);
  if (res.ok) {
    const data = await res.json();
    return data.guide;
  }
  throw new Error('Failed to fetch career guide');
}

export async function getBeforeAfterExamples(): Promise<{ count: number; examples: BeforeAfterExampleItem[] }> {
  const res = await fetch(`${API_BASE}/career-toolkit/before-after`);
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch before-after examples');
}

export async function getChecklistItems(): Promise<{ count: number; items: ChecklistItem[] }> {
  const res = await fetch(`${API_BASE}/career-toolkit/checklist`);
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch checklist items');
}

export async function getChecklistProgress(sessionKey?: string): Promise<{ completedItems: string[] }> {
  const url = new URL(`${window.location.origin}${API_BASE}/career-toolkit/checklist/progress`);
  if (sessionKey) url.searchParams.set('sessionKey', sessionKey);
  const res = await fetch(url.toString(), { headers: getAuthHeader() });
  if (res.ok) return await res.json();
  return { completedItems: [] };
}

export async function saveChecklistProgress(completedItems: string[], sessionKey?: string): Promise<any> {
  const res = await fetch(`${API_BASE}/career-toolkit/checklist/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ completedItems, sessionKey })
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to save checklist progress');
}

export async function runCVQualityReview(cvData: any, targetOpportunity?: string): Promise<CVQualityReport> {
  const res = await fetch(`${API_BASE}/career-toolkit/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cvData, targetOpportunity })
  });
  if (res.ok) {
    const data = await res.json();
    return data.report;
  }
  throw new Error('Failed to run CV quality review');
}

export async function getUserCVDrafts(): Promise<{ drafts: any[] }> {
  const res = await fetch(`${API_BASE}/career-toolkit/drafts`, {
    headers: getAuthHeader()
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch CV drafts');
}

export async function getCVDraftById(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/career-toolkit/drafts/${id}`, {
    headers: getAuthHeader()
  });
  if (res.ok) {
    const data = await res.json();
    return data.draft;
  }
  throw new Error('Failed to fetch draft');
}

export async function saveCVDraft(draftData: any): Promise<any> {
  const res = await fetch(`${API_BASE}/career-toolkit/drafts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(draftData)
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to save CV draft');
}

export async function deleteCVDraft(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/career-toolkit/drafts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to delete draft');
}

export async function adminCreateResearchRecord(recordData: any): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/career-toolkit/research-records`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(recordData)
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to create research record');
}

export async function adminUpdateResearchRecord(id: string, recordData: any): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/career-toolkit/research-records/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(recordData)
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to update research record');
}

export async function adminDeleteResearchRecord(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/career-toolkit/research-records/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to delete research record');
}

// ==========================================
// COUNTRY WORK & CAREER GUIDE API CLIENT
// ==========================================

export async function getCountryWorkGuideOverview(params?: {
  search?: string;
  continent?: string;
  policyType?: string;
  studentWorkStatus?: string;
  hasPostStudyRoute?: boolean;
}): Promise<{ success: boolean; count: number; data: import('../types').GlobalWorkGuideOverviewItem[] }> {
  const url = new URL(`${window.location.origin}${API_BASE}/country-work-guide`);
  if (params?.search) url.searchParams.set('search', params.search);
  if (params?.continent) url.searchParams.set('continent', params.continent);
  if (params?.policyType) url.searchParams.set('policyType', params.policyType);
  if (params?.studentWorkStatus) url.searchParams.set('studentWorkStatus', params.studentWorkStatus);
  if (params?.hasPostStudyRoute) url.searchParams.set('hasPostStudyRoute', 'true');

  const res = await fetch(url.toString());
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch country work guide overview');
}

export async function getCountryWorkProfile(codeOrSlug: string): Promise<{
  success: boolean;
  profile: import('../types').CountryWorkProfileDetail;
}> {
  const res = await fetch(`${API_BASE}/country-work-guide/profile/${encodeURIComponent(codeOrSlug)}`);
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.message || 'Failed to fetch country work profile');
}

export async function getCountryWorkComparison(countryCodes: string[]): Promise<{
  success: boolean;
  count: number;
  comparison: import('../types').CountryWorkProfileDetail[];
}> {
  const res = await fetch(`${API_BASE}/country-work-guide/compare?countries=${countryCodes.join(',')}`);
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch country comparison');
}

export async function getMinimumWagesDirectory(params?: {
  policyType?: string;
  hasStatutory?: boolean;
}): Promise<{ success: boolean; count: number; data: import('../types').MinimumWagePolicyItem[] }> {
  const url = new URL(`${window.location.origin}${API_BASE}/country-work-guide/minimum-wages`);
  if (params?.policyType) url.searchParams.set('policyType', params.policyType);
  if (params?.hasStatutory !== undefined) url.searchParams.set('hasStatutory', String(params.hasStatutory));

  const res = await fetch(url.toString());
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch minimum wages directory');
}

export async function getStudentWorkRulesDirectory(params?: {
  eligibilityStatus?: string;
  selfEmployment?: boolean;
}): Promise<{ success: boolean; count: number; data: import('../types').StudentWorkPolicyItem[] }> {
  const url = new URL(`${window.location.origin}${API_BASE}/country-work-guide/student-work-rules`);
  if (params?.eligibilityStatus) url.searchParams.set('eligibilityStatus', params.eligibilityStatus);
  if (params?.selfEmployment !== undefined) url.searchParams.set('selfEmployment', String(params.selfEmployment));

  const res = await fetch(url.toString());
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch student work rules directory');
}

export async function getPostStudyWorkDirectory(params?: {
  jobOfferRequired?: boolean;
  leadsToPR?: boolean;
}): Promise<{ success: boolean; count: number; data: import('../types').PostStudyWorkRouteItem[] }> {
  const url = new URL(`${window.location.origin}${API_BASE}/country-work-guide/post-study-work`);
  if (params?.jobOfferRequired !== undefined) url.searchParams.set('jobOfferRequired', String(params.jobOfferRequired));
  if (params?.leadsToPR !== undefined) url.searchParams.set('leadsToPR', String(params.leadsToPR));

  const res = await fetch(url.toString());
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch post-study work routes');
}

export async function getCareerRoadmapsDirectory(): Promise<{
  success: boolean;
  count: number;
  data: import('../types').CareerRoadmapItem[];
}> {
  const res = await fetch(`${API_BASE}/country-work-guide/career-roadmaps`);
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch career roadmaps');
}

export async function getCountryWorkSources(params?: {
  category?: string;
  status?: string;
}): Promise<{ success: boolean; count: number; data: import('../types').CountryOfficialSourceItem[] }> {
  const url = new URL(`${window.location.origin}${API_BASE}/country-work-guide/sources`);
  if (params?.category) url.searchParams.set('category', params.category);
  if (params?.status) url.searchParams.set('status', params.status);

  const res = await fetch(url.toString());
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch official sources');
}

export async function generateStudentPlan(input: any): Promise<{
  success: boolean;
  count: number;
  recommendations: import('../types').StudentPlannerRecommendation[];
}> {
  const res = await fetch(`${API_BASE}/country-work-guide/planner`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.message || 'Failed to generate study-to-work plan');
}

export async function submitCountryPolicyCorrection(data: {
  countryId: string;
  entityType: string;
  reportedIssue: string;
  proposedCorrection: string;
  evidenceUrl?: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/country-work-guide/corrections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (res.ok) return await res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err.message || 'Failed to submit policy correction');
}

export async function adminVerifyPolicy(data: {
  countryId: string;
  entityType: string;
  entityId?: string;
  status: string;
  findings: string;
  sourceUrl: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/country-work-guide/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to record policy verification');
}

export async function adminGetCountryWorkCorrectionReports(status?: string): Promise<any> {
  const url = new URL(`${window.location.origin}${API_BASE}/admin/country-work-guide/corrections`);
  if (status) url.searchParams.set('status', status);

  const res = await fetch(url.toString(), {
    headers: getAuthHeader(),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch correction reports');
}

export async function adminReviewCorrectionReport(
  id: string,
  status: string,
  adminNotes: string
): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/country-work-guide/corrections/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status, adminNotes }),
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to update correction report');
}









