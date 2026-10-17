export type DegreeLevel = 'BACHELOR' | 'MASTER' | 'PHD';

export type InstitutionType =
  | 'UNIVERSITY'
  | 'COLLEGE'
  | 'BUSINESS_SCHOOL'
  | 'INSTITUTE_OF_TECHNOLOGY'
  | 'COMMUNITY_COLLEGE'
  | 'UNIVERSITY_COLLEGE'
  | 'PATHWAY_PROVIDER'
  | 'LANGUAGE_SCHOOL'
  | 'VOCATIONAL_TECHNICAL'
  | 'RESEARCH_INSTITUTE';

export type QualificationType =
  | 'BACHELOR'
  | 'MASTER'
  | 'PHD'
  | 'FOUNDATION'
  | 'PATHWAY'
  | 'DIPLOMA'
  | 'POSTGRAD_DIPLOMA'
  | 'CERTIFICATE'
  | 'VOCATIONAL'
  | 'ENGLISH_PREP';

export interface ProgramItem {
  id: string;
  name: string;
  slug: string;
  degreeLevel: DegreeLevel;
  qualificationType?: QualificationType;
  studentCategory?: string;
  subjectCategory: string; // e.g. "Computer Science and IT", "Engineering and Technology", "Business and Economics"
  subject: string; // "Computer Science", "Artificial Intelligence", etc.
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

  // Joined fields
  universityName?: string;
  universitySlug?: string;
  countrySlug?: string;
  countryName?: string;
  cityName?: string;
  continent?: string;
}

export interface UniversityRecord {
  id: string;
  name: string;
  slug: string;
  continent: string;
  countrySlug: string;
  countryName: string;
  cityName: string;
  type: 'PUBLIC' | 'PRIVATE';
  institutionType?: InstitutionType;
  accreditationStatus?: string;
  accreditationBody?: string;
  qualificationsOffered?: QualificationType[];
  whedId?: string; // International Association of Universities World Higher Education Database reference
  accreditationInfo: string;
  qsRanking?: number;
  timesRanking?: number;
  acceptanceRate?: number;
  websiteUrl: string;
  admissionsUrl: string;
  tuitionUrl: string;
  scholarshipUrl: string;
  internationalUrl: string;
  internationalOfficeEmail: string;
  sourceUrl: string;
  verificationStatus: 'VERIFIED' | 'PENDING_REVIEW' | 'NEEDS_UPDATE';
  lastVerifiedAt: string;
  description: string;
  campuses: string[];
  programs: ProgramItem[];
}

import { MASTER_UNIVERSITIES_LIST } from './universitiesList.js';
import { EXPANDED_INSTITUTIONS_DATA } from './expandedInstitutionsData.js';

const expandedSlugs = new Set(EXPANDED_INSTITUTIONS_DATA.map((u) => u.slug));

export const UNIVERSITIES_DATA: UniversityRecord[] = [
  ...EXPANDED_INSTITUTIONS_DATA,
  ...MASTER_UNIVERSITIES_LIST.filter((u) => !expandedSlugs.has(u.slug)),
];
