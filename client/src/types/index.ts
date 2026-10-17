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
  qualificationType?: string;
  studentCategory?: string;
  subjectCategory: string;
  subject: string;
  durationMonths: number;
  creditsEcts: number;
  language: string;
  annualTuitionLocal: number;
  totalTuitionLocal?: number;
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
  institutionType?: string;
  accreditationStatus?: string;
  accreditationBody?: string;
  qualificationsOffered?: string[];
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
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'CONTRIBUTOR' | 'STUDENT' | 'DATA_EDITOR' | 'DATA_REVIEWER';
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

export interface PostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags?: string[];
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    role: string;
  };
  moderatorNote?: string;
}

export interface ContributorApplicationItem {
  id: string;
  fullName: string;
  email: string;
  institution: string;
  countryOfStudy: string;
  degreeLevel: string;
  fieldOfStudy: string;
  motivation: string;
  sampleTopic: string;
  linkedinOrProfile?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminFeedback?: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface FinancialDocumentItem {
  id: string;
  documentCategory: string;
  originalFileName: string;
  fileSizeBytes: number;
  fileType: string;
  submissionPurpose: string;
  countryIntended?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'INFO_REQUESTED' | 'APPROVED_INTERNAL' | 'REJECTED' | 'WITHDRAWN';
  adminNotes?: string;
  rejectionReason?: string;
  disclaimerAcknowledged: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  reviewHistory?: Array<{
    id: string;
    previousStatus: string;
    newStatus: string;
    reason?: string;
    createdAt: string;
    reviewer: {
      id: string;
      name: string;
    };
  }>;
}

export interface WorkspaceItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  members: Array<{
    id: string;
    role: 'OWNER' | 'EDITOR' | 'VIEWER';
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
}

export type DeadlineStatus =
  | 'NOT_ANNOUNCED'
  | 'UPCOMING'
  | 'OPEN'
  | 'CLOSING_SOON'
  | 'CLOSED'
  | 'SUSPENDED'
  | 'EXTENDED'
  | 'ROLLING'
  | 'UNCONFIRMED';

export interface ApplicationDeadlineItem {
  id: string;
  universityId?: string;
  programId?: string;
  scholarshipId?: string;
  intakeSemester: string;
  academicYear: string;
  applicationType: string;
  targetAudience: string;
  roundName?: string;
  openDate?: string;
  closeDate?: string;
  openTime?: string;
  closeTime?: string;
  timeZone: string;
  isRolling: boolean;
  status: string;
  computedStatus: DeadlineStatus;
  isDisputed: boolean;
  disputeNote?: string;
  applicationFee?: number;
  currencyCode?: string;
  officialAppUrl?: string;
  officialSourceUrl: string;
  lastVerifiedAt: string;
  createdAt: string;
  university?: {
    id: string;
    name: string;
    slug: string;
    countryName: string;
    cityName?: string;
  };
  program?: {
    id: string;
    name: string;
    slug: string;
    degreeLevel: string;
  };
  revisions?: Array<{
    id: string;
    changedBy: string;
    reason: string;
    newStatus: string;
    sourceEvidenceUrl: string;
    timestamp: string;
  }>;
}

export interface InformationReportItem {
  id: string;
  reportNumber: string;
  reporterId?: string;
  reporterEmail?: string;
  entityType: 'UNIVERSITY' | 'PROGRAM' | 'SCHOLARSHIP' | 'DEADLINE' | 'OTHER';
  entityId: string;
  entitySlug?: string;
  entityName: string;
  fieldBelievedIncorrect: string;
  reasonCategory: string;
  description: string;
  currentValue?: string;
  proposedCorrection?: string;
  officialEvidenceUrl: string;
  supportingDocPath?: string;
  status: 'SUBMITTED' | 'PENDING_REVIEW' | 'UNDER_INVESTIGATION' | 'MORE_INFO_REQUESTED' | 'RESUBMITTED' | 'APPROVED' | 'REJECTED' | 'DUPLICATE' | 'RESOLVED' | 'CLOSED';
  adminFeedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  priority?: 'HIGH' | 'NORMAL';
  reporter?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  comments?: Array<{
    id: string;
    authorName: string;
    authorRole: string;
    message: string;
    evidenceUrl?: string;
    createdAt: string;
  }>;
  revisions?: Array<{
    id: string;
    fieldName: string;
    previousValue: string;
    newValue: string;
    sourceUrl: string;
    reason: string;
    appliedAt: string;
  }>;
}


