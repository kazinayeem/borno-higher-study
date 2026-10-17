export interface RegistryInstitution {
  name: string;
  normalizedName: string;
  slug: string;
  countryCode: string;
  countrySlug: string;
  countryName: string;
  cityName: string;
  type: 'PUBLIC' | 'PRIVATE' | 'SEMI_GOVERNMENT';
  institutionType:
    | 'UNIVERSITY'
    | 'COLLEGE'
    | 'BUSINESS_SCHOOL'
    | 'UAS'
    | 'INSTITUTE_OF_TECHNOLOGY'
    | 'COMMUNITY_COLLEGE'
    | 'PATHWAY_PROVIDER'
    | 'VOCATIONAL'
    | 'RESEARCH_INSTITUTE';
  websiteUrl: string;
  admissionsUrl: string;
  accreditationStatus: 'STATE_ACCREDITED' | 'RECOGNIZED' | 'MINISTRY_APPROVED' | 'CANDIDATE';
  accreditationBody: string;
  whedId?: string;
  qualificationsOffered: string[];
  sourceRegistry: string;
  sourceUrl: string;
  provenance: string;
  qsRanking?: number;
  timesRanking?: number;
  acceptanceRate?: number;
  description: string;
  campuses: string[];
}

export interface CountryTargetMetadata {
  countrySlug: string;
  countryName: string;
  countryCode: string;
  targetCount: number;
  isTargetCapped: boolean; // true if fewer than 100 officially exist in the national directory
  accreditationAuthority: string;
  officialRegistryUrl: string;
  notes: string;
}

export const COUNTRY_TARGETS: Record<string, CountryTargetMetadata> = {
  // Countries with 100+ target
  'united-states': {
    countrySlug: 'united-states',
    countryName: 'United States',
    countryCode: 'US',
    targetCount: 100,
    isTargetCapped: false,
    accreditationAuthority: 'US Department of Education / CHEA Institutional Accreditors',
    officialRegistryUrl: 'https://nces.ed.gov/ipeds/',
    notes: 'Over 3,500 post-secondary institutions nationwide. Target 100+ verified institutions.',
  },
  'united-kingdom': {
    countrySlug: 'united-kingdom',
    countryName: 'United Kingdom',
    countryCode: 'GB',
    targetCount: 100,
    isTargetCapped: false,
    accreditationAuthority: 'Office for Students (OfS) / QAA / Department for Education',
    officialRegistryUrl: 'https://www.officeforstudents.org.uk/advice-and-guidance/the-register/',
    notes: 'Over 160 degree-awarding bodies and recognized colleges. Target 100+ verified institutions.',
  },
  germany: {
    countrySlug: 'germany',
    countryName: 'Germany',
    countryCode: 'DE',
    targetCount: 100,
    isTargetCapped: false,
    accreditationAuthority: 'Akkreditierungsrat / German Rectors Conference (HRK)',
    officialRegistryUrl: 'https://www.hochschulkompass.de/en/higher-education-institutions.html',
    notes: 'Dual system of ~400 Universitäten and Fachhochschulen/HAW. Target 100+ verified institutions.',
  },
  canada: {
    countrySlug: 'canada',
    countryName: 'Canada',
    countryCode: 'CA',
    targetCount: 100,
    isTargetCapped: false,
    accreditationAuthority: 'Provincial Ministries of Advanced Education / Universities Canada / CICIC',
    officialRegistryUrl: 'https://www.cicic.ca/868/Search-the-Directory-of-Educational-Institutions-in-Canada/index.canada',
    notes: 'Over 150 universities and polytechnics/colleges across 10 provinces. Target 100+ verified institutions.',
  },
  australia: {
    countrySlug: 'australia',
    countryName: 'Australia',
    countryCode: 'AU',
    targetCount: 100,
    isTargetCapped: false,
    accreditationAuthority: 'Tertiary Education Quality and Standards Agency (TEQSA)',
    officialRegistryUrl: 'https://www.teqsa.gov.au/national-register',
    notes: '42 universities plus registered institutes of higher education and TAFEs. Target 100+ verified institutions.',
  },
  india: {
    countrySlug: 'india',
    countryName: 'India',
    countryCode: 'IN',
    targetCount: 100,
    isTargetCapped: false,
    accreditationAuthority: 'University Grants Commission (UGC) / AICTE / NAAC',
    officialRegistryUrl: 'https://www.ugc.gov.in/',
    notes: 'Extensive ecosystem of Central, State, Institutes of National Importance, and Deemed universities. Target 100+ verified institutions.',
  },
  france: {
    countrySlug: 'france',
    countryName: 'France',
    countryCode: 'FR',
    targetCount: 100,
    isTargetCapped: false,
    accreditationAuthority: 'Ministère de l’Enseignement supérieur et de la Recherche (MESR) / HCÉRES / CTI',
    officialRegistryUrl: 'https://www.enseignementsup-recherche.gouv.fr',
    notes: 'Public research universities, Grandes Écoles, engineering institutes, and IUTs. Target 100+ verified institutions.',
  },
  japan: {
    countrySlug: 'japan',
    countryName: 'Japan',
    countryCode: 'JP',
    targetCount: 100,
    isTargetCapped: false,
    accreditationAuthority: 'Ministry of Education, Culture, Sports, Science and Technology (MEXT) / JUAA',
    officialRegistryUrl: 'https://www.mext.go.jp/en/',
    notes: 'National, public, and private universities and junior colleges. Target 100+ verified institutions.',
  },

  // Countries with fewer than 100 total officially recognized institutions (Exhaustive National Directory)
  finland: {
    countrySlug: 'finland',
    countryName: 'Finland',
    countryCode: 'FI',
    targetCount: 35,
    isTargetCapped: true,
    accreditationAuthority: 'Ministry of Education and Culture (OKM) / FINEEC',
    officialRegistryUrl: 'https://opintopolku.fi',
    notes: 'Exhaustive national directory: exactly 13 research universities (yliopisto) and 22 universities of applied sciences (AMK) recognized by the Finnish Ministry of Education and Culture.',
  },
  ireland: {
    countrySlug: 'ireland',
    countryName: 'Ireland',
    countryCode: 'IE',
    targetCount: 25,
    isTargetCapped: true,
    accreditationAuthority: 'Quality and Qualifications Ireland (QQI) / Higher Education Authority (HEA)',
    officialRegistryUrl: 'https://hea.ie/higher-education-institutions/',
    notes: 'Exhaustive national directory: 8 traditional universities, 5 technological universities, RCSI, and QQI-accredited independent third-level institutions (DBS, Griffith, NCI, etc.).',
  },
  netherlands: {
    countrySlug: 'netherlands',
    countryName: 'Netherlands',
    countryCode: 'NL',
    targetCount: 36,
    isTargetCapped: true,
    accreditationAuthority: 'Accreditation Organisation of the Netherlands and Flanders (NVAO)',
    officialRegistryUrl: 'https://www.nvao.net',
    notes: 'Exhaustive national directory: 14 research universities (WO) and 22 major recognized universities of applied sciences (HBO).',
  },
  sweden: {
    countrySlug: 'sweden',
    countryName: 'Sweden',
    countryCode: 'SE',
    targetCount: 31,
    isTargetCapped: true,
    accreditationAuthority: 'Swedish Higher Education Authority (UKÄ)',
    officialRegistryUrl: 'https://www.uka.se',
    notes: 'Exhaustive national directory: 16 public universities, 5 private universities, and 10 state university colleges recognized by UKÄ.',
  },
  lithuania: {
    countrySlug: 'lithuania',
    countryName: 'Lithuania',
    countryCode: 'LT',
    targetCount: 20,
    isTargetCapped: true,
    accreditationAuthority: 'Centre for Quality Assessment in Higher Education (SKVC)',
    officialRegistryUrl: 'https://www.skvc.lt',
    notes: 'Exhaustive national directory: 11 recognized universities and 9 state and private colleges (kolegija) accredited by SKVC.',
  },
  estonia: {
    countrySlug: 'estonia',
    countryName: 'Estonia',
    countryCode: 'EE',
    targetCount: 15,
    isTargetCapped: true,
    accreditationAuthority: 'Estonian Quality Agency for Education (HAKA)',
    officialRegistryUrl: 'https://haka.ee/en/',
    notes: 'Exhaustive national directory: 6 public universities, 1 private university, and 8 state professional higher education institutions.',
  },
  denmark: {
    countrySlug: 'denmark',
    countryName: 'Denmark',
    countryCode: 'DK',
    targetCount: 18,
    isTargetCapped: true,
    accreditationAuthority: 'Danish Accreditation Institution (Danmarks Akkrediteringsinstitution)',
    officialRegistryUrl: 'https://akkr.dk',
    notes: 'Exhaustive national directory: 8 research universities, 6 university colleges (Professionshøjskoler), and business academies.',
  },
  norway: {
    countrySlug: 'norway',
    countryName: 'Norway',
    countryCode: 'NO',
    targetCount: 22,
    isTargetCapped: true,
    accreditationAuthority: 'Norwegian Agency for Quality Assurance in Education (NOKUT)',
    officialRegistryUrl: 'https://www.nokut.no',
    notes: 'Exhaustive national directory: 10 accredited research universities, 6 specialized university colleges, and 6 accredited university colleges.',
  },
  'new-zealand': {
    countrySlug: 'new-zealand',
    countryName: 'New Zealand',
    countryCode: 'NZ',
    targetCount: 18,
    isTargetCapped: true,
    accreditationAuthority: 'New Zealand Qualifications Authority (NZQA) / Universities New Zealand',
    officialRegistryUrl: 'https://www.nzqa.govt.nz',
    notes: 'Exhaustive national directory: exactly 8 universities and recognized vocational polytechnic divisions under Te Pūkenga.',
  },
  singapore: {
    countrySlug: 'singapore',
    countryName: 'Singapore',
    countryCode: 'SG',
    targetCount: 14,
    isTargetCapped: true,
    accreditationAuthority: 'Ministry of Education (MOE) / Committee for Private Education (SSG/CPE)',
    officialRegistryUrl: 'https://www.moe.gov.sg/post-secondary/overview/autonomous-universities',
    notes: 'Exhaustive national directory: 6 autonomous universities and premier EduTrust-certified private degree-awarding institutions.',
  },
};
