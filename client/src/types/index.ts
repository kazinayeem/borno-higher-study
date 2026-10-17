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

// -------------------------------------------------------------
// Live Global Visa Intelligence & Application Centres Types
// -------------------------------------------------------------

export interface VisaStatisticsItem {
  id: string;
  countryCode: string;
  countryName: string;
  applicantNationality: string;
  applicationLocation: string;
  visaCategory: string;
  educationLevel: string;
  reportingPeriod: string;
  reportingPeriodType: string;
  applicationsReceived?: number | null;
  applicationsDecided?: number | null;
  applicationsApproved?: number | null;
  applicationsRefused?: number | null;
  applicationsWithdrawn?: number | null;
  approvalRate?: number | null;
  refusalRate?: number | null;
  calculationBasis?: string | null;
  dataStatus: 'OFFICIAL' | 'INDEPENDENTLY_REPORTED' | 'ESTIMATED' | 'UNAVAILABLE';
  publicationDate?: string | null;
  lastVerifiedAt: string;
  officialSourceUrl: string;
  publisher: string;
  coverageNotes?: string | null;
  isLatestPeriod: boolean;
  isPartialPeriod: boolean;
  historicalYears?: any;
  sources?: any[];
  revisions?: any[];
}

export interface VisaApplicationCentreItem {
  id: string;
  destinationCountryCode: string;
  destinationCountryName: string;
  centreName: string;
  serviceProvider: string;
  address: string;
  city: string;
  country: string;
  submissionType: string;
  requiresAppointment: boolean;
  appointmentUrl?: string | null;
  requiresBiometrics: boolean;
  requiresInterview: boolean;
  inPersonPassportSubmission: boolean;
  courierReturnAvailable: boolean;
  mustTravelToIndia: 'NO' | 'YES' | 'POSSIBLY' | 'UNKNOWN';
  indiaTravelReason?: string | null;
  localAlternativeConfirmed: boolean;
  jurisdictionNotes?: string | null;
  officialEmbassyHandling?: string | null;
  embassyCity?: string | null;
  embassyCountry?: string | null;
  standardProcessingTimeDays?: number | null;
  vfsServiceFeeBdt?: number | null;
  status: 'OPERATIONAL' | 'TEMPORARILY_CLOSED' | 'APPOINTMENTS_SUSPENDED' | 'SEASONAL';
  statusNotes?: string | null;
  lastVerifiedAt: string;
  sourceUrl: string;
}

export interface OfficialSocialUpdateItem {
  id: string;
  destinationCountryCode?: string | null;
  destinationCountryName?: string | null;
  publisher: string;
  platform: string;
  postUrl: string;
  topic: string;
  title: string;
  summary: string;
  isOfficialVerified: boolean;
  publishedAt: string;
  retrievedAt: string;
  originalPostId?: string | null;
}

export interface VisaCorrectionReportItem {
  id: string;
  targetType: 'STATISTICS' | 'CENTRE' | 'POLICY' | 'INDIA_TRAVEL';
  statisticsId?: string | null;
  centreId?: string | null;
  countryName: string;
  issueCategory: string;
  description: string;
  evidenceUrl?: string | null;
  reporterEmail?: string | null;
  reporterName?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
}

// -------------------------------------------------------------
// Global Academic Eligibility & Subject Requirements Engine Types
// -------------------------------------------------------------

export interface GradeScaleItem {
  id: string;
  name: string;
  code: string;
  countryCode?: string | null;
  maxScale: number;
  passThreshold?: number | null;
  description?: string | null;
  officialScaleAuthority?: string | null;
  bands?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface QualificationEquivalencyItem {
  id: string;
  countryCode: string;
  homeQualification: string;
  targetQualification: string;
  minimumHomeResult?: string | null;
  standardEquivalency: string;
  isOfficialPolicy: boolean;
  credentialEvaluator?: string | null;
  sourceUrl?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProgramSubjectRequirementItem {
  id: string;
  academicRequirementId: string;
  subjectName: string;
  subjectCategory: string;
  requirementType: 'MANDATORY' | 'PREFERRED' | 'ALTERNATIVE';
  minimumGradeLetter?: string | null;
  minimumGradeNumeric?: number | null;
  gradeScaleName?: string | null;
  isRequiredLabWork: boolean;
  acceptedEquivalents?: any;
  combinationGroup?: string | null;
  notes?: string | null;
}

export interface AcademicRequirementSourceItem {
  id: string;
  academicRequirementId: string;
  title: string;
  sourceUrl: string;
  sourceType: string;
  verificationDate: string;
  verifiedBy?: string | null;
  notes?: string | null;
}

export interface AcademicRequirementRevisionItem {
  id: string;
  academicRequirementId: string;
  adminUserId?: string | null;
  changeSummary: string;
  previousData?: any;
  newData?: any;
  reason?: string | null;
  createdAt: string;
}

export interface AcademicRequirementItem {
  id: string;
  universityId: string;
  programId?: string | null;
  countryCode: string;
  degreeLevel: 'SECONDARY' | 'HIGHER_SECONDARY' | 'FOUNDATION' | 'BACHELOR' | 'MASTER' | 'PHD' | 'DIPLOMA';
  minSscGpa?: number | null;
  sscGpaScale?: number | null;
  minHscGpa?: number | null;
  hscGpaScale?: number | null;
  combinedSscHscGpa?: number | null;
  hscStreamRequired?: string | null;
  acceptedBoards?: any;
  directEntryAccepted: boolean;
  foundationEntryOption?: string | null;
  minBachelorCgpa?: number | null;
  bachelorCgpaScale?: number | null;
  bachelorDegreeTitleRequired?: string | null;
  bachelorClassRequired?: string | null;
  bachelorDivisionRequired?: string | null;
  prerequisiteCreditsRequired?: string | null;
  minMasterCgpa?: number | null;
  masterCgpaScale?: number | null;
  masterDegreeRequired?: string | null;
  researchProposalRequired: boolean;
  supervisorRequired: boolean;
  publicationsRequired: boolean;
  workExperienceMonths?: number | null;
  entranceExamRequired?: string | null;
  interviewRequired: boolean;
  overallMinScoreDescription?: string | null;
  sourceUrl: string;
  verificationTimestamp: string;
  verifiedBy?: string | null;
  isEstimate: boolean;
  adminApprovalStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED';
  adminNotes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  university?: {
    id: string;
    name: string;
    slug: string;
    countryName: string;
    cityName?: string;
    logoUrl?: string;
  };
  program?: {
    id: string;
    name: string;
    slug: string;
    degreeLevel: string;
  };
  subjectRequirements?: ProgramSubjectRequirementItem[];
  sources?: AcademicRequirementSourceItem[];
  revisions?: AcademicRequirementRevisionItem[];
  equivalencies?: QualificationEquivalencyItem[];
}

export interface AssessmentCriterion {
  category: string;
  title: string;
  required: string;
  studentActual: string;
  matched: boolean | 'CONDITIONAL' | 'MISSING_INFO';
  explanation: string;
}

export interface StudentEligibilityAssessmentResult {
  status: 'MEETS_THRESHOLDS' | 'DOES_NOT_MEET' | 'ADDITIONAL_INFO_REQUIRED' | 'PREREQUISITES_NOT_CONFIRMED' | 'EQUIVALENCY_CONFIRMATION_REQUIRED';
  overallMatched: boolean;
  summary: string;
  criteria: AssessmentCriterion[];
  requirementDetails: AcademicRequirementItem | null;
  assessmentId?: string;
  timestamp?: string;
}

export interface AcademicCorrectionReportItem {
  id: string;
  academicRequirementId?: string | null;
  universityName: string;
  programName?: string | null;
  degreeLevel?: string | null;
  issueCategory: string;
  description: string;
  officialEvidenceUrl: string;
  reporterEmail?: string | null;
  reporterName?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
}

// ============================================================================
// CONTENT PLATFORM & EDITORIAL STUDIO TYPES (SECTION 15)
// ============================================================================

export interface ArticleCategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconName?: string;
  displayOrder: number;
  articleCount?: number;
}

export interface ArticleAuthorItem {
  id: string;
  name: string;
  slug: string;
  roleTitle: string;
  bio: string;
  avatarUrl?: string;
  affiliation?: string;
  credentials?: string;
  verifiedExpert: boolean;
  articleCount?: number;
  articles?: ArticleItem[];
}

export interface ArticleSourceItem {
  id?: string;
  articleId?: string;
  title: string;
  publisher: string;
  url: string;
  sourceType: string;
  accessDate?: string;
  verificationStatus?: string;
  notes?: string;
}

export interface ResearchPaperAuthorItem {
  id: string;
  name: string;
  affiliation?: string;
  orderIndex: number;
}

export interface ResearchPaperItem {
  id: string;
  title: string;
  slug: string;
  doi?: string;
  publicationYear: number;
  journalOrConference: string;
  publisher: string;
  officialUrl: string;
  accessStatus: string;
  researchDiscipline: string;
  researchQuestion: string;
  methodologySummary: string;
  keyFindingsSummary: string;
  limitationsNotes: string;
  sampleSize?: string;
  independentExplainerText: string;
  verifiedCitationsCount: number;
  isVerified: boolean;
  authors: ResearchPaperAuthorItem[];
  articles?: Array<{ id: string; title: string; slug: string; summary: string }>;
}

export interface ComparisonDataPointItem {
  id: string;
  entityIdentifier: string;
  attributeKey: string;
  attributeValue: string;
  numericValue?: number | null;
  dataSourceUrl?: string | null;
  dataCollectionDate?: string;
  isEstimated?: boolean;
  notes?: string | null;
}

export interface UniversityComparisonItem {
  id: string;
  title: string;
  slug: string;
  articleId?: string | null;
  comparisonScope: string;
  summaryNotes: string;
  methodologyDisclosure: string;
  lastVerifiedAt: string;
  dataPoints: ComparisonDataPointItem[];
  article?: { id: string; title: string; slug: string };
}

export interface CountryComparisonItem {
  id: string;
  title: string;
  slug: string;
  articleId?: string | null;
  comparisonScope: string;
  summaryNotes: string;
  methodologyDisclosure: string;
  lastVerifiedAt: string;
  dataPoints: ComparisonDataPointItem[];
  article?: { id: string; title: string; slug: string };
}

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  tableOfContents?: string;
  categoryId: string;
  category?: ArticleCategoryItem;
  authorId?: string | null;
  author?: ArticleAuthorItem | null;
  contentType: string;
  primaryCountryCode?: string | null;
  degreeLevel?: string;
  fieldOfStudy?: string;
  readingTimeMinutes: number;
  wordCount: number;
  featuredImage?: string | null;
  status: string;
  isFeatured: boolean;
  isEditorPick: boolean;
  viewCount: number;
  bookmarkCount: number;
  publishedAt?: string | null;
  lastReviewedAt: string;
  verifiedDate: string;
  verifiedBy?: string | null;
  sourceVerificationStatus: string;
  limitations?: string | null;
  faqJson?: string | null;
  keyTakeawaysJson?: string | null;
  citationsJson?: string | null;
  researchPaperId?: string | null;
  researchPaper?: ResearchPaperItem | null;
  sources?: ArticleSourceItem[];
  revisions?: Array<{ id: string; authorName: string; changeSummary: string; createdAt: string }>;
  relatedArticles?: ArticleItem[];
}

export interface ContentCorrectionReportItem {
  id: string;
  articleId?: string | null;
  articleTitle: string;
  articleUrl: string;
  correctionCategory: string;
  claimedErrorText: string;
  suggestedCorrection: string;
  officialEvidenceUrl: string;
  reporterName?: string | null;
  reporterEmail?: string | null;
  status: 'PENDING' | 'INVESTIGATING' | 'APPLIED' | 'REJECTED';
  adminResolutionNotes?: string | null;
  resolvedBy?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  article?: { id: string; title: string; slug: string };
}

export interface ContentOverviewStats {
  metrics: {
    totalArticles: number;
    draftCount: number;
    reviewCount: number;
    publishedCount: number;
    archivedCount: number;
    outdatedArticlesCount: number;
    requiresVerificationCount: number;
    researchPapersCount: number;
    pendingCorrectionsCount: number;
    totalSourcesCount: number;
    categoriesCount: number;
    authorsCount: number;
  };
  recentRevisions: Array<{
    id: string;
    authorName: string;
    changeSummary: string;
    createdAt: string;
    article: { title: string; slug: string };
  }>;
  recentReviews: Array<{
    id: string;
    reviewStage: string;
    decision: string;
    feedbackNotes: string;
    createdAt: string;
    article: { title: string; slug: string };
    reviewer: { name: string; email: string };
  }>;
  recentCorrections: ContentCorrectionReportItem[];
}

// ============================================================================
// 17. CAREER TOOLKIT, CV WRITING, EUROPASS & RESUME INTERFACES
// ============================================================================

export interface CVResearchRecordItem {
  id: string;
  sourceInstitution: string;
  sourceUrl: string;
  title: string;
  cvType: string;
  intendedAudience: string;
  field: string;
  careerStage: string;
  sectionStructure: string[];
  formattingObservations: string;
  usefulPractices: string;
  potentialLimitations: string;
  dateAccessed: string;
  verificationStatus: string;
  verifiedBy?: string;
  notes?: string;
  createdAt?: string;
}

export interface CVExampleItem {
  id: string;
  slug: string;
  title: string;
  titleBn?: string;
  targetAudience: string;
  field: string;
  careerStage: string;
  isIllustrative: boolean;
  rationaleEn: string;
  rationaleBn?: string;
  sectionBreakdown: Array<{
    sectionName: string;
    order: number;
    purpose: string;
  }>;
  fullContent: {
    personalInfo: {
      fullName: string;
      email: string;
      phone: string;
      location: string;
      linkedin?: string;
      github?: string;
      portfolio?: string;
    };
    summary: string;
    education: Array<{
      institution: string;
      degree: string;
      location: string;
      graduationDate: string;
      grade?: string;
      honors?: string;
      coursework?: string[];
    }>;
    experience?: Array<{
      role: string;
      organization: string;
      location: string;
      period: string;
      bullets: string[];
    }>;
    research?: Array<{
      projectTitle: string;
      role: string;
      institution: string;
      period: string;
      methodology: string;
      outcomes: string[];
    }>;
    projects?: Array<{
      title: string;
      technologies?: string[];
      description: string;
      link?: string;
      bullets: string[];
    }>;
    skills?: Array<{
      category: string;
      items: string[];
    }>;
    publications?: Array<{
      citation: string;
      status: string;
      doi?: string;
    }>;
    awards?: Array<{
      title: string;
      issuer: string;
      year: string;
      amount?: string;
    }>;
    volunteering?: Array<{
      role: string;
      organization: string;
      period: string;
      impact: string;
    }>;
    languages?: Array<{
      language: string;
      proficiency: string;
    }>;
    certifications?: Array<{
      name: string;
      issuer: string;
      year: string;
    }>;
  };
}

export interface CareerGuideItem {
  id: string;
  slug: string;
  category: string;
  titleEn: string;
  titleBn: string;
  summaryEn: string;
  summaryBn: string;
  contentEn: string;
  contentBn: string;
  author: string;
  lastReviewed: string;
  published: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface BeforeAfterExampleItem {
  id: string;
  category: string;
  categoryBn: string;
  context: string;
  contextBn: string;
  weakText: string;
  weakCritique: string;
  improvedText: string;
  improvedExplanation: string;
  ruleOfThumb: string;
}

export interface ChecklistItem {
  id: string;
  category: string;
  categoryBn: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  importance: 'CRITICAL' | 'HIGH' | 'RECOMMENDED';
}

export interface CVQualityFinding {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'SUGGESTION' | 'STRENGTH';
  category: string;
  title: string;
  description: string;
  suggestedAction?: string;
}

export interface CVQualityReport {
  score: number;
  rating: 'EXCELLENT' | 'STRONG' | 'ADEQUATE' | 'NEEDS_WORK';
  targetOpportunity: string;
  findings: CVQualityFinding[];
  metrics: {
    totalSectionsDetected: number;
    wordCount: number;
    actionVerbCount: number;
    metricsCount: number;
    bulletPointCount: number;
  };
  opportunityReadinessNotes: string[];
}

export interface CVBuilderDraftItem {
  id?: string;
  title: string;
  template: 'academic-editorial' | 'europass-standard' | 'modern-minimal' | 'tech-compact';
  personalInfo: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary?: string;
  education: Array<{
    institution: string;
    degree: string;
    location?: string;
    graduationDate: string;
    grade?: string;
    honors?: string;
    coursework?: string;
  }>;
  experience?: Array<{
    role: string;
    organization: string;
    location?: string;
    period: string;
    bullets: string[];
  }>;
  research?: Array<{
    projectTitle: string;
    role: string;
    institution?: string;
    period?: string;
    methodology?: string;
    outcomes: string[];
  }>;
  projects?: Array<{
    title: string;
    technologies?: string;
    description: string;
    link?: string;
    bullets: string[];
  }>;
  skills?: Array<{
    category: string;
    items: string;
  }>;
  publications?: Array<{
    citation: string;
    status: string;
  }>;
  awards?: Array<{
    title: string;
    issuer: string;
    year: string;
  }>;
  volunteering?: Array<{
    role: string;
    organization: string;
    period: string;
    impact: string;
  }>;
  languages?: Array<{
    language: string;
    proficiency: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
  sectionOrder?: string[];
  updatedAt?: string;
}

// ==========================================
// COUNTRY WORK & CAREER GUIDE TYPES
// ==========================================

export interface CountryLanguageItem {
  id: string;
  countryId: string;
  languageName: string;
  languageCode: string;
  isOfficial: boolean;
  isNational: boolean;
  isRegional: boolean;
  isWidelySpoken: boolean;
  higherEdUsage: string;
  jobMarketUsage: string;
  notes?: string;
  usages?: Array<{
    id: string;
    contextType: string;
    proficiencyRequired?: string;
    description: string;
    exceptions?: string;
  }>;
}

export interface MinimumWageRateItem {
  id: string;
  policyId: string;
  jurisdictionId?: string;
  jurisdiction?: { id: string; name: string; jurisdictionType: string };
  rateUnit: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL';
  amount: number;
  currencyCode: string;
  currencySymbol: string;
  effectiveDate: string;
  endDate?: string;
  isCurrent: boolean;
  rateType: 'STATUTORY' | 'ESTIMATE' | 'SUB_MINIMUM' | 'APPRENTICE';
  ageCategory?: string;
  apprenticeException?: string;
  industryExceptions?: string;
  estimatedBdtHourly?: number;
  bdtExchangeRateUsed?: number;
  exchangeRateProvider?: string;
  rateNotes?: string;
  officialSourceUrl?: string;
  verificationStatus: string;
}

export interface MinimumWagePolicyItem {
  id: string;
  countryId: string;
  policyType: 'STATUTORY_NATIONAL' | 'REGIONAL_PROVINCIAL' | 'SECTORAL_COLLECTIVE_BARGAINING' | 'NO_STATUTORY_MINIMUM' | 'NOT_VERIFIED';
  hasStatutoryMinimum: boolean;
  governingBody?: string;
  legislationName?: string;
  overview: string;
  collectiveBargainingNote?: string;
  lastVerifiedAt: string;
  verificationStatus: string;
  sourceUrl?: string;
  rates?: MinimumWageRateItem[];
  country?: Country;
}

export interface StudentWorkPolicyItem {
  id: string;
  countryId: string;
  eligibilityStatus: 'PERMITTED_UNDER_CONDITIONS' | 'PERMIT_REQUIRED' | 'RESTRICTED_EMPLOYMENT' | 'NOT_PERMITTED' | 'UNKNOWN';
  termTimeLimitHours?: number;
  termTimeUnit: string;
  termTimeRuleText: string;
  holidayLimitHours?: number;
  holidayTimeUnit: string;
  holidayRuleText: string;
  onCampusRules: string;
  offCampusRules: string;
  selfEmploymentAllowed: boolean;
  selfEmploymentRules?: string;
  internshipRules?: string;
  assistantshipRules?: string;
  canWorkBeforeCourseStarts: boolean;
  postCompletionRules?: string;
  visaConditionPrecedenceNote?: string;
  sourceUrl?: string;
  verificationStatus: string;
  lastVerifiedAt: string;
  country?: Country;
  exceptions?: Array<{
    id: string;
    category: string;
    description: string;
    allowedHours?: number;
    timeUnit?: string;
  }>;
  authorizations?: Array<{
    id: string;
    authorizationType: string;
    authorityName: string;
    procedureDescription: string;
    processingTimeDays?: number;
    officialFormUrl?: string;
  }>;
}

export interface PostStudyWorkRouteItem {
  id: string;
  countryId: string;
  routeName: string;
  routeCode?: string;
  durationMonthsMin: number;
  durationMonthsMax: number;
  durationNotes: string;
  jobOfferRequired: boolean;
  employerSponsorshipRequired: boolean;
  occupationRestrictions: boolean;
  selfEmploymentAllowed: boolean;
  isExtensionPossible: boolean;
  leadsToPermanentResidence: boolean;
  prPathwayDetails?: string;
  applicationDeadlineDays?: number;
  applicationDeadlineDescription: string;
  applicationFeeAmount?: number;
  applicationFeeCurrency?: string;
  governmentApplicationUrl: string;
  verificationStatus: string;
  lastVerifiedAt: string;
  policyChangeNotice?: string;
  country?: Country;
  eligibilityRules?: Array<{
    id: string;
    qualificationLevel: string;
    institutionCriteria: string;
    studyDurationRequirement: string;
    languageRequirement?: string;
    financialProofRequired: boolean;
    description: string;
  }>;
}

export interface CareerSectorItem {
  id: string;
  countryId: string;
  name: string;
  slug: string;
  overview: string;
  demandStatus: 'HIGH_SHORTAGE' | 'GROWING_DEMAND' | 'MODERATE' | 'SATURATED' | 'REGULATED_RESTRICTED';
  shortageListOfficial: boolean;
  shortageSourceDate?: string;
  averageSalaryMin?: number;
  averageSalaryMax?: number;
  salaryCurrency?: string;
  officialPortalName?: string;
  officialPortalUrl?: string;
  occupations?: Array<{
    id: string;
    title: string;
    code?: string;
    isRegulated: boolean;
    regulatorBody?: string;
    licensingRequirements?: string;
    entryQualification: string;
    languageProficiency: string;
    typicalStartingSalary?: number;
    salarySource?: string;
    jobOutlook: string;
    exampleEmployers?: string[];
  }>;
}

export interface CareerRoadmapStepItem {
  id: string;
  roadmapId: string;
  stageCode: 'STAGE_A' | 'STAGE_B' | 'STAGE_C' | 'STAGE_D' | 'STAGE_E' | 'STAGE_F';
  stageTitle: string;
  timelineDescription: string;
  stepOrder: number;
  actionItems: string[];
  criticalRules?: string;
  keyResources?: Array<{ label: string; url: string }>;
}

export interface CareerRoadmapItem {
  id: string;
  countryId: string;
  title: string;
  targetAudience: string;
  summary: string;
  disclaimer: string;
  steps: CareerRoadmapStepItem[];
  country?: Country;
}

export interface CountryOfficialSourceItem {
  id: string;
  countryId: string;
  authorityName: string;
  category: string;
  sourceTitle: string;
  sourceUrl: string;
  retrievalDate: string;
  policyEffectiveDate?: string;
  status: string;
  notes?: string;
  country?: Country;
}

export interface CountryWorkProfileDetail extends Country {
  countryLanguages: CountryLanguageItem[];
  wageJurisdictions: Array<{ id: string; name: string; jurisdictionType: string; description?: string }>;
  minimumWagePolicies: MinimumWagePolicyItem[];
  studentWorkPolicies: StudentWorkPolicyItem[];
  postStudyWorkRoutes: PostStudyWorkRouteItem[];
  careerSectors: CareerSectorItem[];
  careerRoadmaps: CareerRoadmapItem[];
  officialSources: CountryOfficialSourceItem[];
  policyVerifications?: Array<{
    id: string;
    verificationStatus: string;
    findings: string;
    sourceUrl: string;
    createdAt: string;
  }>;
  policyRevisions?: Array<{
    id: string;
    entityType: string;
    previousValue: string;
    newValue: string;
    changeReason: string;
    effectiveDate: string;
    createdAt: string;
  }>;
}

export interface GlobalWorkGuideOverviewItem {
  id: string;
  name: string;
  code: string;
  slug: string;
  flagEmoji: string;
  continent: string;
  region: string;
  capitalCity: string;
  currencyCode: string;
  currencySymbol: string;
  exchangeRateToBdt: number;
  avgLivingCostMonthly: number;
  officialLanguages: string[];
  widelySpokenLanguages: string[];
  wagePolicy: {
    policyType: string;
    hasStatutoryMinimum: boolean;
    governingBody?: string;
    overview: string;
    primaryRate?: {
      amount: number;
      currencySymbol: string;
      currencyCode: string;
      rateUnit: string;
      estimatedBdtHourly?: number;
    } | null;
    verificationStatus: string;
  } | null;
  studentWork: {
    eligibilityStatus: string;
    termTimeRuleText: string;
    holidayRuleText: string;
    selfEmploymentAllowed: boolean;
    sourceUrl?: string;
    verificationStatus: string;
  } | null;
  postStudyWork: {
    routeName: string;
    durationMonthsMax: number;
    jobOfferRequired: boolean;
    leadsToPermanentResidence: boolean;
  } | null;
  officialSourceCount: number;
  lastVerifiedAt: string;
}

export interface StudentPlannerRecommendation {
  country: {
    id: string;
    name: string;
    code: string;
    flagEmoji: string;
    continent: string;
    currencyCode: string;
    currencySymbol: string;
  };
  matchScore: number;
  verifiedFacts: string[];
  criticalCautions: string[];
  planningSuggestions: string[];
}

export type CountryWorkOverviewItem = GlobalWorkGuideOverviewItem;

export interface PolicyCorrectionReportItem {
  id: string;
  countryId: string;
  country?: {
    id: string;
    name: string;
    code: string;
    flagEmoji: string;
  };
  entityType: string;
  reportedIssue: string;
  proposedCorrection: string;
  evidenceUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  adminNotes?: string;
  userId?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}







