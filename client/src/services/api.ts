import { COUNTRIES_DATA } from '../data/countriesData.js';
import { UNIVERSITIES_DATA } from '../data/universitiesData.js';
import { SCHOLARSHIPS_DATA } from '../data/scholarshipsData.js';
import { SUBJECTS_DATA } from '../data/subjectsData.js';
import { Country, University, Scholarship, SubjectItem, ProgramItem } from '../types/index.js';

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
