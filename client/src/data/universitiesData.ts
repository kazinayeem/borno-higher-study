export type DegreeLevel = 'BACHELOR' | 'MASTER' | 'PHD';

export interface ProgramItem {
  id: string;
  name: string;
  slug: string;
  degreeLevel: DegreeLevel;
  subjectCategory: string; // e.g. "Computer Science and IT", "Engineering and Technology", "Business and Economics"
  subject: string; // "Computer Science", "Artificial Intelligence", etc.
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

import { MASTER_UNIVERSITIES_LIST } from './universitiesList';

export const UNIVERSITIES_DATA: UniversityRecord[] = MASTER_UNIVERSITIES_LIST;

