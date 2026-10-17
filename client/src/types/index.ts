export interface Country {
  id: string;
  name: string;
  slug: string;
  code: string;
  flagEmoji: string;
  currencyCode: string;
  currencySymbol: string;
  exchangeRateToBdt: number;
  overview: string;
  capitalCity: string;
  majorCities: string[];
  avgLivingCostMonthly: number;
  avgTuitionMin: number;
  avgTuitionMax: number;
  postStudyWorkVisa: string;
  visaGuideUrl: string;
  officialPortalUrl: string;
  generalAdmissionReqs: string;
  englishReqSummary: string;
  applicationPeriod: string;
  lastVerifiedAt: string;
  continent?: string;
  region?: string;
  languages?: string[];
  isFeatured?: boolean;
  universityCount?: number;
  scholarshipCount?: number;
}

export interface ProgramItem {
  id: string;
  name: string;
  slug: string;
  degreeLevel: 'BACHELOR' | 'MASTER' | 'PHD';
  subjectCategory: string;
  subject: string;
  durationMonths: number;
  creditsEcts: number;
  language: string;
  annualTuitionLocal: number;
  currencyCode: string;
  applicationFeeLocal: number;
  ieltsOverall: number;
  ieltsSubscoreMin: number;
  toeflOverall: number;
  pteOverall: number;
  prerequisites: string;
  programUrl: string;
  applicationDeadline: string;
  intakeSeason: string;
  lastVerifiedAt: string;

  // Joined properties
  universityName?: string;
  universitySlug?: string;
  countrySlug?: string;
  countryName?: string;
  cityName?: string;
}

export interface University {
  id: string;
  name: string;
  slug: string;
  countrySlug: string;
  countryName: string;
  cityName: string;
  type: 'PUBLIC' | 'PRIVATE';
  qsRanking?: number;
  timesRanking?: number;
  acceptanceRate?: number;
  websiteUrl: string;
  admissionsUrl: string;
  internationalOfficeEmail: string;
  sourceUrl: string;
  verificationStatus: 'VERIFIED' | 'PENDING_REVIEW' | 'NEEDS_UPDATE';
  lastVerifiedAt: string;
  description: string;
  campuses: string[];
  programs: ProgramItem[];
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  fundingGovernment?: string;
  type: 'GOVERNMENT' | 'UNIVERSITY_MERIT' | 'NEED_BASED' | 'TUITION_WAIVER' | 'RESEARCH_ASSISTANTSHIP' | 'FULLY_FUNDED';
  countrySlug: string;
  countryName: string;
  eligibleDestinations?: string[];
  universitySlug?: string;
  universityName?: string;
  degreeLevels: ('BACHELOR' | 'MASTER' | 'PHD')[];
  coveragePercent: number;
  isFullyFunded: boolean;
  stipendMonthlyLocal: number;
  travelAllowanceLocal: number;
  currencyCode: string;
  researchFunding?: string;
  openToBangladesh: boolean;
  eligibleNationalities: string[];
  academicRequirements: string;
  languageRequirements: string;
  deadlineDate: string;
  deadlineText: string;
  cycleStatus?: 'OPEN' | 'UPCOMING' | 'CLOSED' | 'UNCONFIRMED';
  officialApplicationUrl: string;
  sourceUrl: string;
  description: string;
  lastVerifiedAt: string;
}

export interface SubjectItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  iconName: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'DATA_EDITOR' | 'DATA_REVIEWER' | 'STUDENT';
  savedUniversityIds: string[];
  savedScholarshipIds: string[];
  targetCountry?: string;
  targetDegree?: string;
}

export type TestType = 'IELTS' | 'TOEFL' | 'PTE' | 'SPOKEN_ENGLISH';
export type LearningMode = 'OFFLINE' | 'ONLINE' | 'HYBRID';

export interface EnglishCoachingCenter {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  division: string;
  district: string;
  city: string;
  area: string;
  address: string;
  testsOffered: TestType[];
  modes: LearningMode[];
  courseDuration: string;
  feeRange: string;
  feeAmountBdt?: number;
  features: string[];
  contactPhone: string;
  contactEmail?: string;
  websiteUrl?: string;
  facebookUrl?: string;
  rating: number;
  reviewCount: number;
  studentReviewSnippet: string;
  verificationStatus: 'VERIFIED' | 'PENDING_REVIEW';
  lastVerifiedAt: string;
}

export interface PracticeResource {
  id: string;
  title: string;
  provider: string;
  examType: 'IELTS' | 'TOEFL' | 'PTE' | 'ALL';
  skillsCovered: ('Listening' | 'Reading' | 'Writing' | 'Speaking')[];
  freeFeatures: string[];
  paidFeatures?: string[];
  accountRequired: boolean;
  officialUrl: string;
  isOfficialProvider: boolean;
  badgeText: string;
  description: string;
}
