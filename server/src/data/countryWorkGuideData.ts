// Borno Higher Study — Country Work Guide Verified Database
// Authoritative, multi-source records for language policies, minimum wage laws,
// student work allowances, post-study work routes, career sectors, and 6-stage roadmaps.

export interface CountryLanguageSeed {
  languageName: string;
  languageCode: string;
  isOfficial: boolean;
  isNational: boolean;
  isRegional: boolean;
  isWidelySpoken: boolean;
  higherEdUsage: string;
  jobMarketUsage: string;
  notes?: string;
  usages?: {
    contextType: 'HIGHER_EDUCATION' | 'JOB_MARKET' | 'GOVERNMENT_ADMIN' | 'DAILY_LIFE';
    proficiencyRequired?: string;
    description: string;
    exceptions?: string;
  }[];
}

export interface WageJurisdictionSeed {
  name: string;
  jurisdictionType: 'FEDERAL' | 'STATE_PROVINCE' | 'CITY_MUNICIPAL' | 'SECTOR';
  description?: string;
}

export interface MinimumWageRateSeed {
  jurisdictionName?: string;
  rateUnit: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL';
  amount: number;
  currencyCode: string;
  currencySymbol: string;
  effectiveDate: string; // ISO date string
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
  officialSourceUrl: string;
  verificationStatus: 'VERIFIED' | 'PENDING_REVIEW' | 'OUTDATED' | 'CONFLICTING' | 'UNAVAILABLE';
}

export interface MinimumWagePolicySeed {
  policyType: 'STATUTORY_NATIONAL' | 'REGIONAL_PROVINCIAL' | 'SECTORAL_COLLECTIVE_BARGAINING' | 'NO_STATUTORY_MINIMUM' | 'NOT_VERIFIED';
  hasStatutoryMinimum: boolean;
  governingBody?: string;
  legislationName?: string;
  overview: string;
  collectiveBargainingNote?: string;
  sourceUrl?: string;
  verificationStatus: 'VERIFIED' | 'PENDING_REVIEW' | 'OUTDATED' | 'CONFLICTING' | 'UNAVAILABLE';
  jurisdictions?: WageJurisdictionSeed[];
  rates: MinimumWageRateSeed[];
}

export interface StudentWorkPolicySeed {
  eligibilityStatus: 'PERMITTED_UNDER_CONDITIONS' | 'PERMIT_REQUIRED' | 'RESTRICTED_EMPLOYMENT' | 'NOT_PERMITTED' | 'UNKNOWN';
  termTimeLimitHours?: number;
  termTimeUnit: 'HOURS_PER_WEEK' | 'HOURS_PER_FORTNIGHT' | 'DAYS_PER_YEAR' | 'HALF_DAYS_PER_YEAR' | 'HOURS_PER_MONTH' | 'NO_STATUTORY_LIMIT';
  termTimeRuleText: string;
  holidayLimitHours?: number;
  holidayTimeUnit: 'UNRESTRICTED' | 'FULL_TIME' | 'HOURS_PER_WEEK' | 'SAME_AS_TERM';
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
  sourceUrl: string;
  verificationStatus: 'VERIFIED' | 'PENDING_REVIEW' | 'OUTDATED' | 'CONFLICTING' | 'UNAVAILABLE';
  exceptions?: {
    category: string;
    description: string;
    allowedHours?: number;
    timeUnit?: string;
  }[];
  authorizations?: {
    authorizationType: string;
    authorityName: string;
    procedureDescription: string;
    processingTimeDays?: number;
    officialFormUrl?: string;
  }[];
}

export interface PostStudyWorkRouteSeed {
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
  verificationStatus: 'VERIFIED' | 'PENDING_REVIEW' | 'OUTDATED' | 'CONFLICTING' | 'UNAVAILABLE';
  policyChangeNotice?: string;
  eligibilityRules: {
    qualificationLevel: 'BACHELORS' | 'MASTERS' | 'DOCTORATE' | 'POSTGRAD_DIPLOMA' | 'VOCATIONAL';
    institutionCriteria: string;
    studyDurationRequirement: string;
    languageRequirement?: string;
    financialProofRequired: boolean;
    description: string;
  }[];
}

export interface CareerSectorSeed {
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
  occupations: {
    title: string;
    code?: string;
    isRegulated: boolean;
    regulatorBody?: string;
    licensingRequirements?: string;
    entryQualification: string;
    languageProficiency: string;
    typicalStartingSalary?: number;
    salarySource?: string;
    jobOutlook: 'VERY_STRONG' | 'STRONG' | 'MODERATE' | 'STABLE';
    exampleEmployers?: string[];
  }[];
}

export interface CareerRoadmapSeed {
  title: string;
  targetAudience: string;
  summary: string;
  disclaimer?: string;
  steps: {
    stageCode: 'STAGE_A' | 'STAGE_B' | 'STAGE_C' | 'STAGE_D' | 'STAGE_E' | 'STAGE_F';
    stageTitle: string;
    timelineDescription: string;
    stepOrder: number;
    actionItems: string[];
    criticalRules?: string;
    keyResources?: { label: string; url: string }[];
  }[];
}

export interface CountryOfficialSourceSeed {
  authorityName: string;
  category: 'IMMIGRATION' | 'LABOUR_MINISTRY' | 'MINIMUM_WAGE' | 'PUBLIC_EMPLOYMENT' | 'STATISTICS' | 'EDUCATION_AUTHORITY';
  sourceTitle: string;
  sourceUrl: string;
  retrievalDate: string;
  policyEffectiveDate?: string;
  status: 'ACTIVE_VERIFIED' | 'FLAGGED_CHANGE' | 'DEPRECATED';
  notes?: string;
}

export interface CountryWorkGuideItem {
  countryCode: string;
  languages: CountryLanguageSeed[];
  minimumWagePolicy: MinimumWagePolicySeed;
  studentWorkPolicy: StudentWorkPolicySeed;
  postStudyWorkRoutes: PostStudyWorkRouteSeed[];
  careerSectors: CareerSectorSeed[];
  careerRoadmaps: CareerRoadmapSeed[];
  officialSources: CountryOfficialSourceSeed[];
}

export const COUNTRY_WORK_GUIDE_DATA: CountryWorkGuideItem[] = [
  // ==========================================
  // 1. GERMANY (DE)
  // ==========================================
  {
    countryCode: 'DE',
    languages: [
      {
        languageName: 'German',
        languageCode: 'de',
        isOfficial: true,
        isNational: true,
        isRegional: false,
        isWidelySpoken: true,
        higherEdUsage: 'Primary medium of instruction for domestic Bachelor programs; growing catalogue of English-taught Master degrees.',
        jobMarketUsage: 'Essential for client-facing, healthcare, engineering certification, and public administration. B2/C1 usually required.',
        notes: 'German is the sole official language at the federal level across the Federal Republic of Germany.',
        usages: [
          {
            contextType: 'HIGHER_EDUCATION',
            proficiencyRequired: 'C1 / TestDaF 4 / DSH 2',
            description: 'Required for German-medium degree courses. English-medium programs accept IELTS/TOEFL.',
          },
          {
            contextType: 'JOB_MARKET',
            proficiencyRequired: 'B2 - C1',
            description: 'Strongly recommended for traditional engineering, mid-sized Mittelstand enterprises, and legal compliance.',
          },
        ],
      },
      {
        languageName: 'English',
        languageCode: 'en',
        isOfficial: false,
        isNational: false,
        isRegional: false,
        isWidelySpoken: true,
        higherEdUsage: 'Widely used in international Master degrees, PhD research institutes (Max Planck, Fraunhofer), and business schools.',
        jobMarketUsage: 'Sufficient in tech start-ups (Berlin, Munich), multinational software companies, and scientific research.',
        notes: 'Widely spoken as a second language, but German is legally mandatory for regulated professions and administrative proceedings.',
        usages: [
          {
            contextType: 'HIGHER_EDUCATION',
            proficiencyRequired: 'B2 - C1 (IELTS 6.5+)',
            description: 'Medium of instruction for over 1,800 international degree programs in Germany.',
          },
          {
            contextType: 'JOB_MARKET',
            proficiencyRequired: 'Professional Working Proficiency',
            description: 'Common in Berlin tech ecosystem, consulting, and AI labs.',
          },
        ],
      },
    ],
    minimumWagePolicy: {
      policyType: 'STATUTORY_NATIONAL',
      hasStatutoryMinimum: true,
      governingBody: 'Mindestlohnkommission (Federal Minimum Wage Commission)',
      legislationName: 'Mindestlohngesetz (MiLoG)',
      overview: 'Germany maintains a legally binding national statutory minimum gross hourly wage. Sector-specific collective wage agreements may establish higher minimums.',
      collectiveBargainingNote: 'Tarifverträge (collective agreements) negotiate higher sector floors in construction, waste management, and electrical trades.',
      sourceUrl: 'https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Mindestlohn/mindestlohn.html',
      verificationStatus: 'VERIFIED',
      rates: [
        {
          rateUnit: 'HOURLY',
          amount: 12.82,
          currencyCode: 'EUR',
          currencySymbol: '€',
          effectiveDate: '2024-01-01',
          isCurrent: true,
          rateType: 'STATUTORY',
          ageCategory: '18+',
          apprenticeException: 'Trainees under the Vocational Training Act (BBiG) receive a statutory training allowance (Mindestausbildungsvergütung) rather than MiLoG.',
          industryExceptions: 'Compulsory internships required by university degree regulations are exempt from MiLoG.',
          estimatedBdtHourly: 1673.0,
          bdtExchangeRateUsed: 130.5,
          exchangeRateProvider: 'Borno Currency Matrix',
          rateNotes: 'Gross statutory rate per hour before tax and social insurance deductions.',
          officialSourceUrl: 'https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Mindestlohn/mindestlohn.html',
          verificationStatus: 'VERIFIED',
        },
      ],
    },
    studentWorkPolicy: {
      eligibilityStatus: 'PERMITTED_UNDER_CONDITIONS',
      termTimeLimitHours: 140,
      termTimeUnit: 'DAYS_PER_YEAR',
      termTimeRuleText: '140 full days or 280 half days per calendar year (under the updated Skilled Immigration Act, Fachkräfteeinwanderungsgesetz). Alternatively up to 20 hours per week as a Werkstudent during term time.',
      holidayLimitHours: undefined,
      holidayTimeUnit: 'UNRESTRICTED',
      holidayRuleText: 'Students may work full-time during official semester breaks, counting towards their 140 full days or 280 half days annual allowance.',
      onCampusRules: 'Academic student assistant jobs (Studentische Hilfskraft / HiWi) at universities or recognized research institutes may exceed the 140 full days allowance upon notifying the Ausländerbehörde.',
      offCampusRules: 'Permitted up to 140 full days or 280 half days per calendar year without special approval. Employment must not interfere with full-time studies.',
      selfEmploymentAllowed: false,
      selfEmploymentRules: 'Self-employment (Selbstständigkeit) and freelance work (Freiberufler) are strictly prohibited unless explicit written permission is granted by the local Foreigners Registration Office (Ausländerbehörde).',
      internshipRules: 'Mandatory curricular internships (Pflichtpraktikum) specified in official study regulations do not count towards the 140-day allowance and are exempt from minimum wage. Voluntary internships (Freiwilliges Praktikum) count toward the 140 days and are subject to MiLoG after 3 months.',
      assistantshipRules: 'Studentische Hilfskraft (HiWi) positions in university laboratories and faculties can be performed with fewer restrictions.',
      canWorkBeforeCourseStarts: false,
      postCompletionRules: 'Student work allowance ends upon completion of final degree requirements (issuance of certificate or completion letter). Student must transition to the §20 Jobseeker Permit to work.',
      visaConditionPrecedenceNote: 'The ancillary provision (Zusatzblatt) attached to your residence permit card (Aufenthaltstitel) dictates your exact legal terms.',
      sourceUrl: 'https://www.make-it-in-germany.com/en/study-vocational-training/studies-in-germany/work',
      verificationStatus: 'VERIFIED',
      exceptions: [
        {
          category: 'LANGUAGE_STUDENTS',
          description: 'Students attending preparatory language courses (Studienkolleg / Sprachkurs) can work up to 140 full days or 280 half days per year under the modernised Skilled Immigration Act.',
          allowedHours: 140,
          timeUnit: 'DAYS_PER_YEAR',
        },
      ],
      authorizations: [
        {
          authorizationType: 'TAX_ID_REGISTRATION',
          authorityName: 'Bundeszentralamt für Steuern (BZSt)',
          procedureDescription: 'Obtain an Elektronische Lohnsteuerabzugsmerkmale (ELStAM) tax ID and register with statutory health insurance (Krankenkasse).',
          processingTimeDays: 14,
          officialFormUrl: 'https://www.bzst.de',
        },
      ],
    },
    postStudyWorkRoutes: [
      {
        routeName: 'Residence Permit for Job Search (§20 AufenthG)',
        routeCode: 'DE-20',
        durationMonthsMin: 18,
        durationMonthsMax: 18,
        durationNotes: '18 months from the date of receiving official confirmation of degree completion. Cannot be extended beyond 18 months.',
        jobOfferRequired: false,
        employerSponsorshipRequired: false,
        occupationRestrictions: false,
        selfEmploymentAllowed: true,
        isExtensionPossible: false,
        leadsToPermanentResidence: true,
        prPathwayDetails: 'Fast-track settlement permit (Niederlassungserlaubnis) after 21 months with EU Blue Card (B1 German) or 27 months (A1 German), or 2 years under §18c AufenthG for German degree holders.',
        applicationDeadlineDays: 90,
        applicationDeadlineDescription: 'Must apply at the local Ausländerbehörde before the student residence permit expires after completing all exam requirements.',
        applicationFeeAmount: 100,
        applicationFeeCurrency: 'EUR',
        governmentApplicationUrl: 'https://www.make-it-in-germany.com/en/visa-residence/types/residence-permit-jobseekers',
        verificationStatus: 'VERIFIED',
        policyChangeNotice: 'Skilled Immigration Act (Fachkräfteeinwanderungsgesetz) phase updates have significantly lowered salary thresholds for the EU Blue Card.',
        eligibilityRules: [
          {
            qualificationLevel: 'BACHELORS',
            institutionCriteria: 'Recognized state or state-accredited higher education institution in Germany.',
            studyDurationRequirement: 'Completion of degree program.',
            languageRequirement: 'No statutory language test, but German proficiency facilitates finding qualified work.',
            financialProofRequired: true,
            description: 'Must show proof of secure livelihood (approx. €992/month or Sperrkonto/employment contract) and comprehensive health insurance.',
          },
          {
            qualificationLevel: 'MASTERS',
            institutionCriteria: 'State-recognized German university or Fachhochschule.',
            studyDurationRequirement: 'Completion of master degree program.',
            financialProofRequired: true,
            description: 'Eligible for 18-month job search with unrestricted work rights in any profession during search.',
          },
        ],
      },
    ],
    careerSectors: [
      {
        name: 'Software Engineering & Cloud Architecture',
        slug: 'software-engineering-cloud',
        overview: 'Acute shortage of senior and mid-level software engineers across automotive, industrial automation, and fintech ecosystems.',
        demandStatus: 'HIGH_SHORTAGE',
        shortageListOfficial: true,
        averageSalaryMin: 52000,
        averageSalaryMax: 78000,
        salaryCurrency: 'EUR',
        officialPortalName: 'Bundesagentur für Arbeit (BA)',
        officialPortalUrl: 'https://www.arbeitsagentur.de/jobsuche/',
        occupations: [
          {
            title: 'Backend Software Developer (Go / Java / Python)',
            code: '2512',
            isRegulated: false,
            entryQualification: 'B.Sc. or M.Sc. in Computer Science or related STEM field.',
            languageProficiency: 'English (Fluent); German (B1+ helpful for German enterprise clients).',
            typicalStartingSalary: 54000,
            salarySource: 'Destatis / StepStone Salary Report 2024',
            jobOutlook: 'VERY_STRONG',
            exampleEmployers: ['SAP', 'Siemens', 'Zalando', 'Delivery Hero', 'Bosch Digital'],
          },
          {
            title: 'DevOps & Cloud Systems Engineer',
            code: '2519',
            isRegulated: false,
            entryQualification: 'Degree in Informatics, Software Systems, or relevant experience.',
            languageProficiency: 'English (Professional C1).',
            typicalStartingSalary: 58000,
            salarySource: 'Bundesagentur für Arbeit Positivliste',
            jobOutlook: 'VERY_STRONG',
            exampleEmployers: ['BMW Tech', 'Deutsche Telekom', 'Celonis'],
          },
        ],
      },
      {
        name: 'Automotive, Mechanical & Renewable Engineering',
        slug: 'mechanical-renewable-engineering',
        overview: 'Core backbone of the German export economy undergoing electric vehicle (EV) transformation and green hydrogen expansion.',
        demandStatus: 'HIGH_SHORTAGE',
        shortageListOfficial: true,
        averageSalaryMin: 50000,
        averageSalaryMax: 72000,
        salaryCurrency: 'EUR',
        officialPortalName: 'Make it in Germany Job Portal',
        officialPortalUrl: 'https://www.make-it-in-germany.com/en/working-in-germany/jobs',
        occupations: [
          {
            title: 'Embedded Systems & Mechatronics Engineer',
            code: '2144',
            isRegulated: true,
            regulatorBody: 'Regional Chamber of Engineers (Ingenieurkammer)',
            licensingRequirements: 'Title of "Ingenieur" is legally protected. Recognition required to use the formal professional title.',
            entryQualification: 'Bachelor or Master in Electrical / Mechanical / Mechatronics Engineering.',
            languageProficiency: 'German B2 mandatory for technical specifications and safety protocol documentation.',
            typicalStartingSalary: 52000,
            salarySource: 'VDI (Association of German Engineers)',
            jobOutlook: 'STRONG',
            exampleEmployers: ['Mercedes-Benz Group', 'Volkswagen AG', 'Continental', 'Infineon', 'SMA Solar'],
          },
        ],
      },
    ],
    careerRoadmaps: [
      {
        title: 'Study-to-Career Roadmap: Federal Republic of Germany',
        targetAudience: 'INTERNATIONAL_STUDENTS',
        summary: 'Step-by-step verified trajectory from pre-arrival language preparation to the 18-month §20 Jobseeker Permit and EU Blue Card.',
        steps: [
          {
            stageCode: 'STAGE_A',
            stageTitle: 'Stage A — Before Choosing Germany',
            timelineDescription: '12–18 months before semester commencement',
            stepOrder: 1,
            actionItems: [
              'Evaluate program language mediums via the official DAAD international program database.',
              'Determine whether your targeted profession is legally regulated (e.g. physician, pharmacist, civil engineer) via the official Anerkennung in Deutschland portal.',
              'Calculate total cost of study including the mandatory blocked account (Sperrkonto: €11,904/year or approx. €992/month).',
              'Begin German language training immediately, targeting at least A2 before arrival even for English-taught master courses.',
            ],
            criticalRules: 'Never assume that student work will cover your first-year living expenses or tuition fees.',
            keyResources: [
              { label: 'DAAD International Programmes', url: 'https://www.daad.de/en/study-and-research-in-germany/courses-of-study-in-germany/all-study-programmes-in-germany/' },
              { label: 'Anerkennung in Deutschland', url: 'https://www.anerkennung-in-deutschland.de' },
            ],
          },
          {
            stageCode: 'STAGE_B',
            stageTitle: 'Stage B — Before Applying to University',
            timelineDescription: '6–10 months before application deadline',
            stepOrder: 2,
            actionItems: [
              'Verify university and degree equivalence via the official Anabin database (KMK).',
              'Check whether applications proceed via uni-assist e.V. or direct university portals.',
              'Assess local university career services (Career Center) and local industrial hubs (e.g. automotive in Baden-Württemberg/Bavaria, logistics in Hamburg, digital tech in Berlin).',
              'Secure certified translations and apostilles for academic transcripts.',
            ],
            criticalRules: 'Deadlines for winter semester (typically July 15) and summer semester (January 15) are strict cut-offs.',
            keyResources: [
              { label: 'Anabin Database', url: 'https://anabin.kmk.org' },
              { label: 'uni-assist e.V.', url: 'https://www.uni-assist.de' },
            ],
          },
          {
            stageCode: 'STAGE_C',
            stageTitle: 'Stage C — During the First Semester',
            timelineDescription: 'Months 1 to 4 in Germany',
            stepOrder: 3,
            actionItems: [
              'Complete address registration (Anmeldung) at the local Citizens Office (Bürgeramt) within 14 days of moving into housing.',
              'Apply for the electronic Residence Permit (eAT - elektronischer Aufenthaltstitel) at the Ausländerbehörde.',
              'Receive your Tax Identification Number (Steueridentifikationsnummer) from the BZSt and provide it to your German bank and employer.',
              'Format your CV into the German Tabellarischer Lebenslauf format (chronological, reverse order, professional tone).',
            ],
            criticalRules: 'You cannot legally begin working off-campus before obtaining official address registration and opening a SEPA bank account.',
            keyResources: [
              { label: 'Make it in Germany: Arrival Steps', url: 'https://www.make-it-in-germany.com/en/living-in-germany/arrival' },
            ],
          },
          {
            stageCode: 'STAGE_D',
            stageTitle: 'Stage D — During Study (Semesters 2 to 3)',
            timelineDescription: 'Months 6 to 18 of study',
            stepOrder: 4,
            actionItems: [
              'Apply for Werkstudent (working student) positions: permits up to 20h/week during term while remaining exempt from health and unemployment insurance contributions.',
              'Track your legal work allowance: strictly respect the 140 full days (shifts > 4 hours) or 280 half days (shifts <= 4 hours) limit.',
              'Complete mandatory curricular internships (Pflichtpraktikum) which do not deduct from your 140-day allowance.',
              'Advance German language proficiency to at least B1/B2 to unlock mid-sized German enterprise jobs (Mittelstand).',
            ],
            criticalRules: 'Exceeding 140 full days without prior Ausländerbehörde approval can lead to revocation of your student residence permit.',
          },
          {
            stageCode: 'STAGE_E',
            stageTitle: 'Stage E — Six to Twelve Months Before Graduation',
            timelineDescription: 'Penultimate semester',
            stepOrder: 5,
            actionItems: [
              'Proactively write your Master thesis (Masterarbeit) in collaboration with an industrial partner or company (Industriearbeit).',
              'Research corporate graduate trainee programs (Traineeprogramm) and direct entry positions (Direkteinstieg).',
              'Familiarize yourself with the current EU Blue Card minimum gross salary thresholds under §18g AufenthG.',
              'Prepare German and English application dossiers (Anschreiben, Lebenslauf, Zeugnisse, Arbeitszeugnisse).',
            ],
            criticalRules: 'Employment contracts must match your university qualification level to qualify for the EU Blue Card.',
          },
          {
            stageCode: 'STAGE_F',
            stageTitle: 'Stage F — Graduation & Transition to Career',
            timelineDescription: 'Graduation month to Month 18 post-graduation',
            stepOrder: 6,
            actionItems: [
              'Obtain your certificate of degree completion (Vorläufige Bescheinigung) immediately upon thesis defence.',
              'Book an appointment at the Ausländerbehörde to switch from §16b (Study) to §20 (18-Month Jobseeker Permit).',
              'Work unrestricted full-time in any position while interviewing for qualified specialist roles.',
              'Once a qualified employment contract is signed, transition to the EU Blue Card (§18g) or Skilled Worker Residence Permit (§18b).',
            ],
            criticalRules: 'Never let your residence permit expire while waiting for graduation paperwork; always request a Fiktionsbescheinigung (§81 AufenthG) before permit expiry.',
          },
        ],
      },
    ],
    officialSources: [
      {
        authorityName: 'Federal Ministry of the Interior and Community (BMI)',
        category: 'IMMIGRATION',
        sourceTitle: 'Skilled Immigration Act (Fachkräfteeinwanderungsgesetz)',
        sourceUrl: 'https://www.bmi.bund.de/EN/topics/migration/skilled-workers-immigration/skilled-workers-immigration-node.html',
        retrievalDate: '2024-03-01',
        policyEffectiveDate: '2024-03-01',
        status: 'ACTIVE_VERIFIED',
      },
      {
        authorityName: 'Federal Ministry of Labour and Social Affairs (BMAS)',
        category: 'MINIMUM_WAGE',
        sourceTitle: 'Statutory Minimum Wage in Germany (Mindestlohn)',
        sourceUrl: 'https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Mindestlohn/mindestlohn.html',
        retrievalDate: '2024-01-01',
        policyEffectiveDate: '2024-01-01',
        status: 'ACTIVE_VERIFIED',
      },
      {
        authorityName: 'DAAD (German Academic Exchange Service)',
        category: 'EDUCATION_AUTHORITY',
        sourceTitle: 'Side Jobs for International Students in Germany',
        sourceUrl: 'https://www.daad.de/en/study-and-research-in-germany/first-steps-germany/side-jobs/',
        retrievalDate: '2024-04-01',
        status: 'ACTIVE_VERIFIED',
      },
    ],
  },

  // ==========================================
  // 2. UNITED KINGDOM (GB)
  // ==========================================
  {
    countryCode: 'GB',
    languages: [
      {
        languageName: 'English',
        languageCode: 'en',
        isOfficial: true,
        isNational: true,
        isRegional: false,
        isWidelySpoken: true,
        higherEdUsage: 'Exclusive medium of instruction across all higher education providers.',
        jobMarketUsage: 'Fluent English (C1/C2) required for all professional, technical, and corporate roles.',
        usages: [
          {
            contextType: 'HIGHER_EDUCATION',
            proficiencyRequired: 'B2 - C1 (IELTS 6.5+ or SELT equivalent)',
            description: 'SELT required for UKVI Student Visa sponsorship.',
          },
          {
            contextType: 'JOB_MARKET',
            proficiencyRequired: 'Professional Fluency (C1/C2)',
            description: 'Required across all commercial and public sectors.',
          },
        ],
      },
    ],
    minimumWagePolicy: {
      policyType: 'STATUTORY_NATIONAL',
      hasStatutoryMinimum: true,
      governingBody: 'Low Pay Commission & Department for Business and Trade (DBT)',
      legislationName: 'National Minimum Wage Act 1998',
      overview: 'The UK operates a statutory National Living Wage (NLW) for workers aged 21 and over, with lower age-tiered National Minimum Wage rates for younger workers and apprentices.',
      collectiveBargainingNote: 'No national collective bargaining extension; statutory rates apply universally across England, Scotland, Wales, and Northern Ireland.',
      sourceUrl: 'https://www.gov.uk/national-minimum-wage-rates',
      verificationStatus: 'VERIFIED',
      rates: [
        {
          rateUnit: 'HOURLY',
          amount: 11.44,
          currencyCode: 'GBP',
          currencySymbol: '£',
          effectiveDate: '2024-04-01',
          isCurrent: true,
          rateType: 'STATUTORY',
          ageCategory: '21+',
          apprenticeException: 'Apprentice rate is £6.40/hr for apprentices aged under 19, or 19+ in their first year.',
          industryExceptions: 'None; applies across all employment sectors.',
          estimatedBdtHourly: 1773.2,
          bdtExchangeRateUsed: 155.0,
          exchangeRateProvider: 'Borno Currency Matrix',
          rateNotes: 'National Living Wage (NLW) for aged 21 and above. Age 18-20 rate is £8.60/hr.',
          officialSourceUrl: 'https://www.gov.uk/national-minimum-wage-rates',
          verificationStatus: 'VERIFIED',
        },
      ],
    },
    studentWorkPolicy: {
      eligibilityStatus: 'PERMITTED_UNDER_CONDITIONS',
      termTimeLimitHours: 20,
      termTimeUnit: 'HOURS_PER_WEEK',
      termTimeRuleText: '20 hours per week maximum during term time for degree-level courses or above at a higher education provider with a track record of compliance.',
      holidayLimitHours: undefined,
      holidayTimeUnit: 'FULL_TIME',
      holidayRuleText: 'Full-time work permitted during official scheduled vacation periods and vacations between academic terms as defined by the sponsoring university.',
      onCampusRules: 'Permitted up to 20 hours per week during term time; counts toward the total 20-hour weekly statutory limit.',
      offCampusRules: 'Permitted up to 20 hours per week during term time. Any 7-day period (Monday to Sunday) is counted by UKVI as a week.',
      selfEmploymentAllowed: false,
      selfEmploymentRules: 'STRICTLY PROHIBITED: Self-employment, freelance work, gig-economy contractor roles (e.g. Deliveroo, Uber Eats, freelance coding), professional sportsperson, or entertainer.',
      internshipRules: 'Assessed work placements that form an integral and assessed part of the course are permitted up to 50% of the total course duration.',
      assistantshipRules: 'Teaching assistant and research duties count toward the 20-hour term time limit.',
      canWorkBeforeCourseStarts: false,
      postCompletionRules: 'Full-time work permitted after official course end date while student visa remains valid, before transitioning to Graduate Route.',
      visaConditionPrecedenceNote: 'Your Biometric Residence Permit (BRP) or UKVI digital eVisa condition text takes legal precedence.',
      sourceUrl: 'https://www.gov.uk/student-visa',
      verificationStatus: 'VERIFIED',
      exceptions: [
        {
          category: 'BELOW_DEGREE_STUDENTS',
          description: 'Students on courses below degree level (e.g. foundation) at eligible institutions are restricted to 10 hours per week during term time.',
          allowedHours: 10,
          timeUnit: 'HOURS_PER_WEEK',
        },
      ],
      authorizations: [
        {
          authorizationType: 'NATIONAL_INSURANCE_NUMBER',
          authorityName: 'HM Revenue and Customs (HMRC)',
          procedureDescription: 'Apply online for a National Insurance (NI) number once you have arrived in the UK and hold the right to work.',
          processingTimeDays: 28,
          officialFormUrl: 'https://www.gov.uk/apply-national-insurance-number',
        },
      ],
    },
    postStudyWorkRoutes: [
      {
        routeName: 'Graduate Route',
        routeCode: 'UK-GRADUATE',
        durationMonthsMin: 24,
        durationMonthsMax: 36,
        durationNotes: '2 years (24 months) for Bachelor and Master graduates; 3 years (36 months) for Doctoral (PhD) graduates.',
        jobOfferRequired: false,
        employerSponsorshipRequired: false,
        occupationRestrictions: false,
        selfEmploymentAllowed: true,
        isExtensionPossible: false,
        leadsToPermanentResidence: true,
        prPathwayDetails: 'Time spent on Graduate Route does not count directly toward 5-year settlement, but graduates can switch to Skilled Worker Visa (which leads to Indefinite Leave to Remain after 5 years).',
        applicationDeadlineDays: 0,
        applicationDeadlineDescription: 'Must apply in the UK before your current Student visa expires, after your university notifies UKVI of course completion.',
        applicationFeeAmount: 822,
        applicationFeeCurrency: 'GBP',
        governmentApplicationUrl: 'https://www.gov.uk/graduate-visa',
        verificationStatus: 'VERIFIED',
        policyChangeNotice: 'Migration Advisory Committee (MAC) review confirmed continuation of the Graduate route in its current framework.',
        eligibilityRules: [
          {
            qualificationLevel: 'BACHELORS',
            institutionCriteria: 'Higher education provider with a track record of compliance.',
            studyDurationRequirement: 'Minimum 12 months in the UK for eligible degree.',
            financialProofRequired: false,
            description: 'No maintenance funds requirement if resident in the UK with valid permission for at least 12 months.',
          },
          {
            qualificationLevel: 'MASTERS',
            institutionCriteria: 'UK licensed Student sponsor.',
            studyDurationRequirement: 'Full master degree completed in the UK.',
            financialProofRequired: false,
            description: 'Allows 2 full years of open work rights. Immigration Health Surcharge (IHS: £1,035/year) payable upon application.',
          },
          {
            qualificationLevel: 'DOCTORATE',
            institutionCriteria: 'UK degree-awarding body.',
            studyDurationRequirement: 'Award of PhD or other doctoral qualification.',
            financialProofRequired: false,
            description: 'Grants 3 years of unrestricted post-study employment.',
          },
        ],
      },
    ],
    careerSectors: [
      {
        name: 'Financial Services, FinTech & Professional Consulting',
        slug: 'financial-services-fintech',
        overview: 'London is a global financial powerhouse with major regional hubs in Edinburgh, Manchester, and Leeds.',
        demandStatus: 'GROWING_DEMAND',
        shortageListOfficial: false,
        averageSalaryMin: 38000,
        averageSalaryMax: 65000,
        salaryCurrency: 'GBP',
        officialPortalName: 'Find a Job (GOV.UK)',
        officialPortalUrl: 'https://www.gov.uk/find-a-job',
        occupations: [
          {
            title: 'Financial Analyst / Risk Consultant',
            code: '2421',
            isRegulated: false,
            entryQualification: 'BSc / MSc in Finance, Economics, Mathematics, or Business.',
            languageProficiency: 'English C2 (Fluent commercial writing).',
            typicalStartingSalary: 42000,
            salarySource: 'High Fliers Graduate Market Report 2024',
            jobOutlook: 'STRONG',
            exampleEmployers: ['Barclays', 'HSBC', 'PwC', 'Deloitte', 'KPMG', 'EY'],
          },
        ],
      },
      {
        name: 'Technology, Software & AI Engineering',
        slug: 'technology-software-ai',
        overview: 'High demand across UK tech clusters (London, Cambridge Silicon Fen, Bristol, Manchester).',
        demandStatus: 'HIGH_SHORTAGE',
        shortageListOfficial: true,
        averageSalaryMin: 40000,
        averageSalaryMax: 70000,
        salaryCurrency: 'GBP',
        officialPortalName: 'National Careers Service',
        officialPortalUrl: 'https://nationalcareers.service.gov.uk',
        occupations: [
          {
            title: 'Full Stack Software Engineer',
            code: '2136',
            isRegulated: false,
            entryQualification: 'BSc or MSc in Computer Science or related degree.',
            languageProficiency: 'English C1.',
            typicalStartingSalary: 45000,
            salarySource: 'Tech Nation / Hired UK Tech Salaries',
            jobOutlook: 'VERY_STRONG',
            exampleEmployers: ['Google UK', 'Arm', 'DeepMind', 'Revolut', 'Monzo'],
          },
        ],
      },
    ],
    careerRoadmaps: [
      {
        title: 'Study-to-Career Roadmap: United Kingdom',
        targetAudience: 'INTERNATIONAL_STUDENTS',
        summary: 'Strategic guide navigating UK term-time limits, graduate scheme recruitment windows, the 2-year Graduate Route, and transition to Skilled Worker visa.',
        steps: [
          {
            stageCode: 'STAGE_A',
            stageTitle: 'Stage A — Before Choosing the UK',
            timelineDescription: '12–15 months before course start',
            stepOrder: 1,
            actionItems: [
              'Evaluate course eligibility for Graduate Route: ensure your institution is a higher education provider with a track record of compliance.',
              'Assess total funding: international tuition fees are non-repayable and must be supported by 28-day maintenance funds for the Student Visa.',
              'Review current Skilled Worker salary thresholds (£38,700 general threshold with discounted rate for new entrants/graduates).',
            ],
            criticalRules: 'Student work in the UK is legally capped at 20 hours/week during term time and cannot fund your tuition.',
          },
          {
            stageCode: 'STAGE_B',
            stageTitle: 'Stage B — Before Applying to University',
            timelineDescription: '8–12 months before course start',
            stepOrder: 2,
            actionItems: [
              'Research Russell Group and modern university career placement rates via Discover Uni.',
              'Verify whether programs include a recognized sandwich year or accredited industrial placement.',
              'Understand the UK graduate recruitment cycle: major milkround schemes open in September/October for jobs starting the following year.',
            ],
            criticalRules: 'UK 1-year Master programs move extremely rapidly; graduate applications begin within weeks of arrival.',
          },
          {
            stageCode: 'STAGE_C',
            stageTitle: 'Stage C — During the First Semester',
            timelineDescription: 'Weeks 1 to 12 in the UK',
            stepOrder: 3,
            actionItems: [
              'Apply online for your National Insurance (NI) number via GOV.UK.',
              'Register with a local GP surgery using your NHS number generated through the Immigration Health Surcharge.',
              'Tailor your CV to UK standard: 1–2 pages max, no photograph, no date of birth, no marital status, bullet-point achievements.',
              'Submit applications for Summer Internships and Graduate Schemes immediately (deadlines November–December).',
            ],
            criticalRules: 'Zero tolerance for unauthorized self-employment or freelancing (e.g. food delivery apps on a freelance account).',
          },
          {
            stageCode: 'STAGE_D',
            stageTitle: 'Stage D — During Study',
            timelineDescription: 'Spring to Summer terms',
            stepOrder: 4,
            actionItems: [
              'Keep strict timesheet logs showing you never exceed 20 hours in any single Monday-to-Sunday period.',
              'Engage with university career fairs, alumni mentoring circles, and industry hackathons.',
              'Secure an on-campus or professional role with an established payroll system providing real-time PAYE tax deductions.',
            ],
            criticalRules: 'Working 20.5 hours in a term week constitutes an immigration breach and can invalidate your visa.',
          },
          {
            stageCode: 'STAGE_E',
            stageTitle: 'Stage E — Six to Twelve Months Before Graduation',
            timelineDescription: 'Final term & dissertation phase',
            stepOrder: 5,
            actionItems: [
              'Review graduation timelines with your university International Student Office.',
              'Ensure your course completion will be reported to UKVI before your current Student visa validity ends.',
              'Prepare funds for the Graduate Route fee (£822) + Immigration Health Surcharge (£1,035/year = £2,070 for 2 years).',
              'Interview for graduate opportunities and establish whether prospective employers hold a Home Office A-rated Worker Sponsor licence.',
            ],
            criticalRules: 'You cannot apply for the Graduate Route from outside the UK.',
          },
          {
            stageCode: 'STAGE_F',
            stageTitle: 'Stage F — Graduation & Transition to Career',
            timelineDescription: 'Post-completion to Month 24',
            stepOrder: 6,
            actionItems: [
              'Submit your Graduate Route application online once the university sends formal confirmation to UKVI.',
              'Work full-time under Section 3C leave while your Graduate Route application is being processed.',
              'Utilize the 2-year unrestricted work permission to demonstrate value to an employer.',
              'Switch to a Skilled Worker Visa as a "new entrant" before your 2-year Graduate Route concludes.',
            ],
            criticalRules: 'The Graduate Route cannot be extended. Plan your transition to Skilled Worker sponsorship well before month 20.',
          },
        ],
      },
    ],
    officialSources: [
      {
        authorityName: 'UK Visas and Immigration (GOV.UK)',
        category: 'IMMIGRATION',
        sourceTitle: 'Student Visa Policy and Work Restrictions',
        sourceUrl: 'https://www.gov.uk/student-visa',
        retrievalDate: '2024-04-01',
        status: 'ACTIVE_VERIFIED',
      },
      {
        authorityName: 'Home Office (GOV.UK)',
        category: 'IMMIGRATION',
        sourceTitle: 'Graduate Route Guidance for International Students',
        sourceUrl: 'https://www.gov.uk/graduate-visa',
        retrievalDate: '2024-04-01',
        status: 'ACTIVE_VERIFIED',
      },
      {
        authorityName: 'Low Pay Commission (DBT)',
        category: 'MINIMUM_WAGE',
        sourceTitle: 'National Minimum Wage and National Living Wage Rates',
        sourceUrl: 'https://www.gov.uk/national-minimum-wage-rates',
        retrievalDate: '2024-04-01',
        policyEffectiveDate: '2024-04-01',
        status: 'ACTIVE_VERIFIED',
      },
    ],
  },

  // ==========================================
  // 3. UNITED STATES (US)
  // ==========================================
  {
    countryCode: 'US',
    languages: [
      {
        languageName: 'English',
        languageCode: 'en',
        isOfficial: false,
        isNational: true,
        isRegional: false,
        isWidelySpoken: true,
        higherEdUsage: 'Exclusive medium of instruction across all US colleges and universities.',
        jobMarketUsage: 'Required across all commercial, healthcare, and engineering sectors.',
        notes: 'The US has no statutory federal official language, but English is the de facto national language.',
      },
    ],
    minimumWagePolicy: {
      policyType: 'REGIONAL_PROVINCIAL',
      hasStatutoryMinimum: true,
      governingBody: 'US Department of Labor (Wage and Hour Division) & State Labor Departments',
      legislationName: 'Fair Labor Standards Act (FLSA)',
      overview: 'The US maintains a federal statutory minimum wage ($7.25/hr), but most states and major metropolitan areas enforce significantly higher statutory minimum wages.',
      collectiveBargainingNote: 'Where federal and state laws have different rates, the higher minimum wage applies to the worker.',
      sourceUrl: 'https://www.dol.gov/agencies/whd/minimum-wage',
      verificationStatus: 'VERIFIED',
      jurisdictions: [
        { name: 'Federal', jurisdictionType: 'FEDERAL', description: 'FLSA statutory baseline applicable where state law does not mandate higher' },
        { name: 'California', jurisdictionType: 'STATE_PROVINCE', description: 'California state statutory minimum wage' },
        { name: 'New York City', jurisdictionType: 'CITY_MUNICIPAL', description: 'New York City statutory minimum rate' },
        { name: 'Washington State', jurisdictionType: 'STATE_PROVINCE', description: 'Washington State statutory rate' },
      ],
      rates: [
        {
          jurisdictionName: 'Federal',
          rateUnit: 'HOURLY',
          amount: 7.25,
          currencyCode: 'USD',
          currencySymbol: '$',
          effectiveDate: '2009-07-24',
          isCurrent: true,
          rateType: 'STATUTORY',
          ageCategory: 'All ages',
          estimatedBdtHourly: 870.0,
          bdtExchangeRateUsed: 120.0,
          exchangeRateProvider: 'Borno Currency Matrix',
          rateNotes: 'Federal baseline under FLSA. Most university states have far higher rates.',
          officialSourceUrl: 'https://www.dol.gov/agencies/whd/minimum-wage',
          verificationStatus: 'VERIFIED',
        },
        {
          jurisdictionName: 'California',
          rateUnit: 'HOURLY',
          amount: 16.00,
          currencyCode: 'USD',
          currencySymbol: '$',
          effectiveDate: '2024-01-01',
          isCurrent: true,
          rateType: 'STATUTORY',
          ageCategory: 'All employers',
          estimatedBdtHourly: 1920.0,
          bdtExchangeRateUsed: 120.0,
          exchangeRateProvider: 'Borno Currency Matrix',
          rateNotes: 'Statewide statutory rate. Cities like San Francisco and Berkeley exceed $18/hr.',
          officialSourceUrl: 'https://www.dir.ca.gov/dlse/faq_minimumwage.htm',
          verificationStatus: 'VERIFIED',
        },
      ],
    },
    studentWorkPolicy: {
      eligibilityStatus: 'RESTRICTED_EMPLOYMENT',
      termTimeLimitHours: 20,
      termTimeUnit: 'HOURS_PER_WEEK',
      termTimeRuleText: '20 hours per week maximum during school terms, STRICTLY LIMITED TO ON-CAMPUS EMPLOYMENT for F-1 visa holders. Off-campus work during the first academic year is prohibited by federal regulation.',
      holidayLimitHours: undefined,
      holidayTimeUnit: 'FULL_TIME',
      holidayRuleText: 'Full-time on-campus work permitted during official university vacation periods and summer recesses.',
      onCampusRules: 'Permitted up to 20 hours per week during academic sessions. On-campus includes jobs at university facilities or affiliated commercial contractors providing direct student services.',
      offCampusRules: 'Strictly prohibited during the first academic year (two semesters). After one full academic year, off-campus work requires CPT authorization or USCIS approval for severe economic hardship.',
      selfEmploymentAllowed: false,
      selfEmploymentRules: 'STRICTLY PROHIBITED: Self-employment, freelancing, monetization of digital channels, or independent contractor (1099) work is illegal under F-1 student status.',
      internshipRules: 'Curricular Practical Training (CPT) allows off-campus internships if directly related to major and authorized on Form I-20 by the Designated School Official (DSO).',
      assistantshipRules: 'Graduate Assistantships (RA/TA/GA) are classified as on-campus employment and count against the 20-hour weekly limit.',
      canWorkBeforeCourseStarts: false,
      postCompletionRules: 'Cannot work post-completion unless Optional Practical Training (OPT) is approved and Employment Authorization Document (EAD) is issued.',
      visaConditionPrecedenceNote: 'Form I-20 and Code of Federal Regulations (8 CFR 214.2(f)) govern student employment permissions.',
      sourceUrl: 'https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/students-and-employment',
      verificationStatus: 'VERIFIED',
    },
    postStudyWorkRoutes: [
      {
        routeName: 'Optional Practical Training (OPT) & STEM Extension',
        routeCode: 'US-OPT',
        durationMonthsMin: 12,
        durationMonthsMax: 36,
        durationNotes: '12 months initial post-completion OPT. Graduates of qualifying STEM degree programs can apply for a 24-month STEM OPT extension (total 36 months).',
        jobOfferRequired: false,
        employerSponsorshipRequired: false,
        occupationRestrictions: true,
        selfEmploymentAllowed: false,
        isExtensionPossible: true,
        leadsToPermanentResidence: false,
        prPathwayDetails: 'OPT is non-immigrant practical training. Transition to permanent residence typically requires H-1B lottery selection followed by EB-2/EB-3 PERM green card sponsorship.',
        applicationDeadlineDays: 60,
        applicationDeadlineDescription: 'Can apply up to 90 days before graduation and up to 60 days after graduation, provided Form I-20 DSO recommendation is less than 30 days old.',
        applicationFeeAmount: 470,
        applicationFeeCurrency: 'USD',
        governmentApplicationUrl: 'https://www.uscis.gov/opt',
        verificationStatus: 'VERIFIED',
        eligibilityRules: [
          {
            qualificationLevel: 'BACHELORS',
            institutionCriteria: 'SEVP-certified US college or university.',
            studyDurationRequirement: 'At least one full academic year in active F-1 status.',
            financialProofRequired: false,
            description: 'Employment must be directly related to student major of study.',
          },
          {
            qualificationLevel: 'MASTERS',
            institutionCriteria: 'Accredited US higher education institution.',
            studyDurationRequirement: 'One full academic year minimum.',
            financialProofRequired: false,
            description: 'STEM degree holders eligible for 24-month extension with E-Verify registered employer.',
          },
        ],
      },
    ],
    careerSectors: [
      {
        name: 'Artificial Intelligence, Software & Cloud Systems',
        slug: 'ai-software-cloud',
        overview: 'Silicon Valley, Seattle, New York, Boston, and Austin lead global high-technology engineering.',
        demandStatus: 'GROWING_DEMAND',
        shortageListOfficial: false,
        averageSalaryMin: 85000,
        averageSalaryMax: 145000,
        salaryCurrency: 'USD',
        officialPortalName: 'Bureau of Labor Statistics (BLS)',
        officialPortalUrl: 'https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm',
        occupations: [
          {
            title: 'Machine Learning / Software Engineer',
            code: '15-1252',
            isRegulated: false,
            entryQualification: 'BS or MS in Computer Science, Data Science, or Electrical Engineering.',
            languageProficiency: 'English Fluent.',
            typicalStartingSalary: 95000,
            salarySource: 'BLS Occupational Outlook Handbook',
            jobOutlook: 'VERY_STRONG',
            exampleEmployers: ['Microsoft', 'Amazon', 'Meta', 'Apple', 'NVIDIA'],
          },
        ],
      },
    ],
    careerRoadmaps: [
      {
        title: 'Study-to-Career Roadmap: United States',
        targetAudience: 'INTERNATIONAL_STUDENTS',
        summary: 'Rigorous compliance roadmap navigating F-1 on-campus limits, CPT internships, OPT filing windows, 24-month STEM extensions, and H-1B sponsorship.',
        steps: [
          {
            stageCode: 'STAGE_A',
            stageTitle: 'Stage A — Before Choosing the US',
            timelineDescription: '15–18 months prior to enrollment',
            stepOrder: 1,
            actionItems: [
              'Confirm that your targeted major has an official DHS STEM CIP code to guarantee 36-month OPT eligibility.',
              'Calculate total 2-year cost of study: US tuition and healthcare insurance are substantial; tuition fees cannot be serviced by student jobs.',
              'Understand the severe restrictions on F-1 employment: off-campus work during the first year is strictly illegal.',
            ],
            criticalRules: 'Never enter the US on an F-1 visa expecting to finance living expenses through unverified off-campus jobs.',
          },
          {
            stageCode: 'STAGE_B',
            stageTitle: 'Stage B — Before Applying to US Universities',
            timelineDescription: '10–14 months prior to enrollment',
            stepOrder: 2,
            actionItems: [
              'Target universities with strong co-op traditions and established industry connections.',
              'Check whether university departments support Day-1 CPT (often scrutinized) vs traditional after-one-year CPT.',
              'Prepare GRE/GMAT and TOEFL/IELTS test scores for departmental funding consideration.',
            ],
            criticalRules: 'DSO authorization on Form I-20 is legally mandatory before performing any off-campus internship.',
          },
          {
            stageCode: 'STAGE_C',
            stageTitle: 'Stage C — During the First Semester',
            timelineDescription: 'Months 1 to 4 in the US',
            stepOrder: 3,
            actionItems: [
              'Attend mandatory International Student Orientation and complete SEVIS registration with your DSO.',
              'Secure an on-campus job (library, dining services, lab assistant) to obtain an official job offer letter.',
              'Apply for a Social Security Number (SSN) at the local Social Security Administration (SSA) office using your job offer letter.',
              'Strictly adhere to the 20-hour weekly on-campus limit.',
            ],
            criticalRules: 'You cannot receive an SSN without an active on-campus job offer or authorized CPT.',
          },
          {
            stageCode: 'STAGE_D',
            stageTitle: 'Stage D — During Study (Year 2)',
            timelineDescription: 'Semesters 2 to 4',
            stepOrder: 4,
            actionItems: [
              'Apply for Curricular Practical Training (CPT) for summer corporate internships.',
              'Ensure CPT authorization dates on your Form I-20 precede the first day of work.',
              'Keep cumulative full-time CPT under 12 months to avoid losing OPT eligibility.',
              'Network at national student career conventions (e.g. Grace Hopper, NSBE, SHPE).',
            ],
            criticalRules: 'Working even one day before your CPT start date is an incurable violation of F-1 status.',
          },
          {
            stageCode: 'STAGE_E',
            stageTitle: 'Stage E — Six to Twelve Months Before Graduation',
            timelineDescription: 'Final academic year',
            stepOrder: 5,
            actionItems: [
              'Request OPT recommendation I-20 from your DSO up to 90 days before your program end date.',
              'File Form I-765 (Application for Employment Authorization) with USCIS immediately upon receiving the OPT I-20.',
              'Ensure your Form I-765 reaches USCIS within 30 days of the DSO recommendation date.',
              'Interview with E-Verify employers willing to support the 24-month STEM extension.',
            ],
            criticalRules: 'Missing the 30-day I-20 window results in automatic USCIS denial of OPT with no refund.',
          },
          {
            stageCode: 'STAGE_F',
            stageTitle: 'Stage F — Graduation & Transition to Career',
            timelineDescription: 'EAD issuance to STEM extension',
            stepOrder: 6,
            actionItems: [
              'Receive your physical Employment Authorization Document (EAD) card before starting post-completion work.',
              'Do not accumulate more than 90 days of unemployment during the initial 12-month OPT period.',
              'Submit Form I-983 (Training Plan for STEM OPT Students) to apply for the 24-month STEM extension.',
              'Coordinate with corporate immigration counsel to enter the annual March H-1B specialty occupation cap lottery.',
            ],
            criticalRules: 'F-1 status terminates automatically if unemployment exceeds 90 days during initial OPT.',
          },
        ],
      },
    ],
    officialSources: [
      {
        authorityName: 'US Citizenship and Immigration Services (USCIS)',
        category: 'IMMIGRATION',
        sourceTitle: 'Optional Practical Training (OPT) for F-1 Students',
        sourceUrl: 'https://www.uscis.gov/opt',
        retrievalDate: '2024-04-01',
        status: 'ACTIVE_VERIFIED',
      },
      {
        authorityName: 'US Department of Labor (WHD)',
        category: 'MINIMUM_WAGE',
        sourceTitle: 'Consolidated State Minimum Wage Table',
        sourceUrl: 'https://www.dol.gov/agencies/whd/mw-consolidated',
        retrievalDate: '2024-01-01',
        policyEffectiveDate: '2024-01-01',
        status: 'ACTIVE_VERIFIED',
      },
      {
        authorityName: 'U.S. Immigration and Customs Enforcement (ICE - SEVP)',
        category: 'IMMIGRATION',
        sourceTitle: 'Practical Training Information for Students',
        sourceUrl: 'https://www.ice.gov/sevis/practical-training',
        retrievalDate: '2024-04-01',
        status: 'ACTIVE_VERIFIED',
      },
    ],
  },

  // ==========================================
  // 4. CANADA (CA)
  // ==========================================
  {
    countryCode: 'CA',
    languages: [
      {
        languageName: 'English',
        languageCode: 'en',
        isOfficial: true,
        isNational: true,
        isRegional: false,
        isWidelySpoken: true,
        higherEdUsage: 'Primary instruction medium across 9 provinces and territories.',
        jobMarketUsage: 'Required for commercial, financial, and industrial employment across Anglophone Canada.',
      },
      {
        languageName: 'French',
        languageCode: 'fr',
        isOfficial: true,
        isNational: true,
        isRegional: true,
        isWidelySpoken: true,
        higherEdUsage: 'Sole official medium in Quebec universities (UdeM, Laval, UQAM); bilingual programs at Ottawa and McGill.',
        jobMarketUsage: 'Mandatory under Bill 96 for professional practice in Quebec; highly advantageous for federal public service.',
      },
    ],
    minimumWagePolicy: {
      policyType: 'REGIONAL_PROVINCIAL',
      hasStatutoryMinimum: true,
      governingBody: 'Employment and Social Development Canada (ESDC) & Provincial Labour Ministries',
      legislationName: 'Canada Labour Code & Provincial Employment Standards Acts',
      overview: 'Canada operates a federal statutory minimum wage ($17.30/hr) for federally regulated sectors (banking, telecommunications, transport), while provincial statutory minimum wages govern student jobs in retail, hospitality, and tech.',
      collectiveBargainingNote: 'Most student employment falls under provincial employment standards jurisdiction rather than federal.',
      sourceUrl: 'https://www.canada.ca/en/services/jobs/workplace/federal-labour-standards/minimum-wage.html',
      verificationStatus: 'VERIFIED',
      jurisdictions: [
        { name: 'Federal', jurisdictionType: 'FEDERAL', description: 'Federally regulated sectors' },
        { name: 'Ontario', jurisdictionType: 'STATE_PROVINCE', description: 'Ontario general statutory minimum wage' },
        { name: 'British Columbia', jurisdictionType: 'STATE_PROVINCE', description: 'BC statutory minimum wage' },
        { name: 'Alberta', jurisdictionType: 'STATE_PROVINCE', description: 'Alberta general minimum wage' },
      ],
      rates: [
        {
          jurisdictionName: 'Federal',
          rateUnit: 'HOURLY',
          amount: 17.30,
          currencyCode: 'CAD',
          currencySymbol: '$',
          effectiveDate: '2024-04-01',
          isCurrent: true,
          rateType: 'STATUTORY',
          ageCategory: 'All ages',
          estimatedBdtHourly: 1557.0,
          bdtExchangeRateUsed: 90.0,
          exchangeRateProvider: 'Borno Currency Matrix',
          rateNotes: 'Federal statutory rate updated annually based on CPI.',
          officialSourceUrl: 'https://www.canada.ca/en/services/jobs/workplace/federal-labour-standards/minimum-wage.html',
          verificationStatus: 'VERIFIED',
        },
        {
          jurisdictionName: 'Ontario',
          rateUnit: 'HOURLY',
          amount: 17.20,
          currencyCode: 'CAD',
          currencySymbol: '$',
          effectiveDate: '2024-10-01',
          isCurrent: true,
          rateType: 'STATUTORY',
          ageCategory: 'General adult rate',
          estimatedBdtHourly: 1548.0,
          bdtExchangeRateUsed: 90.0,
          exchangeRateProvider: 'Borno Currency Matrix',
          rateNotes: 'Governs student retail, hospitality, and tutoring jobs in Ontario.',
          officialSourceUrl: 'https://www.ontario.ca/document/your-guide-employment-standards-act-0/minimum-wage',
          verificationStatus: 'VERIFIED',
        },
      ],
    },
    studentWorkPolicy: {
      eligibilityStatus: 'PERMITTED_UNDER_CONDITIONS',
      termTimeLimitHours: 24,
      termTimeUnit: 'HOURS_PER_WEEK',
      termTimeRuleText: '24 hours per week off-campus during academic sessions (updated by IRCC in 2024, superseding the temporary pandemic policy and raising the historical 20h limit).',
      holidayLimitHours: undefined,
      holidayTimeUnit: 'FULL_TIME',
      holidayRuleText: 'Full-time work permitted during scheduled academic breaks (e.g. winter break, reading weeks, summer semester if full-time student maintains enrollment).',
      onCampusRules: 'No statutory hourly limit on-campus, provided the student remains enrolled full-time at a Designated Learning Institution (DLI).',
      offCampusRules: 'Up to 24 hours per week during regular academic sessions. Must hold valid study permit with off-campus work condition and Social Insurance Number (SIN).',
      selfEmploymentAllowed: true,
      selfEmploymentRules: 'Self-employment is permitted but hours spent working for yourself count toward the maximum 24 hours per week off-campus limit.',
      internshipRules: 'Co-op work permits required if an internship or work placement is an essential component of the academic program.',
      assistantshipRules: 'Teaching and research assistantships located on-campus are considered on-campus employment.',
      canWorkBeforeCourseStarts: false,
      postCompletionRules: 'Full-time work permitted while waiting for a decision on PGWP if application was submitted before study permit expired.',
      visaConditionPrecedenceNote: 'Your Study Permit conditions printed on the official immigration document govern your lawful work status.',
      sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/work-off-campus.html',
      verificationStatus: 'VERIFIED',
    },
    postStudyWorkRoutes: [
      {
        routeName: 'Post-Graduation Work Permit (PGWP)',
        routeCode: 'PGWP',
        durationMonthsMin: 8,
        durationMonthsMax: 36,
        durationNotes: 'Programs 8 months to 2 years receive permit equal to course duration. Programs 2+ years receive 3 years. Master graduates now eligible for 3-year PGWP even if course was under 2 years.',
        jobOfferRequired: false,
        employerSponsorshipRequired: false,
        occupationRestrictions: false,
        selfEmploymentAllowed: true,
        isExtensionPossible: false,
        leadsToPermanentResidence: true,
        prPathwayDetails: 'Enables Canadian work experience to qualify for permanent residence through Express Entry (Canadian Experience Class - CEC) or Provincial Nominee Programs (PNP).',
        applicationDeadlineDays: 180,
        applicationDeadlineDescription: 'Must apply within 180 days of receiving final marks or official graduation letter.',
        applicationFeeAmount: 255,
        applicationFeeCurrency: 'CAD',
        governmentApplicationUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation.html',
        verificationStatus: 'VERIFIED',
        policyChangeNotice: 'New 2024/2025 rules introduce Canadian Language Benchmark (CLB 7 for university grads) and priority field-of-study requirements.',
        eligibilityRules: [
          {
            qualificationLevel: 'BACHELORS',
            institutionCriteria: 'Designated Learning Institution (DLI) offering eligible PGWP degrees.',
            studyDurationRequirement: 'Minimum 8 months of full-time study in Canada.',
            languageRequirement: 'CLB 7 in English or NCLC 7 in French.',
            financialProofRequired: false,
            description: 'Open work permit allowing employment for any Canadian employer in any location.',
          },
          {
            qualificationLevel: 'MASTERS',
            institutionCriteria: 'Public or qualifying private Canadian university.',
            studyDurationRequirement: 'Completion of recognized master degree.',
            languageRequirement: 'CLB 7.',
            financialProofRequired: false,
            description: 'Qualifies for 3-year open work permit regardless of 1-year or 2-year duration.',
          },
        ],
      },
    ],
    careerSectors: [
      {
        name: 'Technology, Software & AI Ecosystem',
        slug: 'technology-software-ai',
        overview: 'Major innovation corridors in Toronto-Waterloo, Vancouver, Montreal, and Ottawa.',
        demandStatus: 'HIGH_SHORTAGE',
        shortageListOfficial: true,
        averageSalaryMin: 68000,
        averageSalaryMax: 110000,
        salaryCurrency: 'CAD',
        officialPortalName: 'Job Bank Canada',
        officialPortalUrl: 'https://www.jobbank.gc.ca',
        occupations: [
          {
            title: 'Software Developer & Programmer',
            code: '21232',
            isRegulated: false,
            entryQualification: 'Bachelor or Master degree in Computer Science, Software Engineering, or related field.',
            languageProficiency: 'English CLB 8+ or French.',
            typicalStartingSalary: 72000,
            salarySource: 'Statistics Canada / Job Bank Wage Report',
            jobOutlook: 'VERY_STRONG',
            exampleEmployers: ['Shopify', 'OpenText', 'RBC Royal Bank Tech', 'Amazon Canada'],
          },
        ],
      },
    ],
    careerRoadmaps: [
      {
        title: 'Study-to-Career Roadmap: Canada',
        targetAudience: 'INTERNATIONAL_STUDENTS',
        summary: 'Comprehensive path covering 24-hour term-time limits, SIN registration, co-op work permits, 3-year PGWP issuance, and Express Entry CEC permanent residency.',
        steps: [
          {
            stageCode: 'STAGE_A',
            stageTitle: 'Stage A — Before Choosing Canada',
            timelineDescription: '12–16 months before intake',
            stepOrder: 1,
            actionItems: [
              'Verify that your chosen institution is on the official IRCC Designated Learning Institution (DLI) list and offers PGWP-eligible programs.',
              'Review the new 2024/2025 field-of-study alignment requirements for PGWP eligibility.',
              'Ensure you meet the updated proof-of-funds requirement (CAD $20,635+ for single student living expenses plus first-year tuition).',
            ],
            criticalRules: 'Graduating from a private career college that does not offer PGWP eligibility leaves you without post-study work options.',
          },
          {
            stageCode: 'STAGE_B',
            stageTitle: 'Stage B — Before Applying to Canadian Institutions',
            timelineDescription: '8–12 months before intake',
            stepOrder: 2,
            actionItems: [
              'Apply for programs featuring accredited Co-op work streams to gain Canadian workplace experience.',
              'Review provincial immigration pathways: provinces like British Columbia, Ontario, and Alberta offer dedicated international graduate PNP streams.',
              'Secure an official letter of acceptance (LOA) with verified provincial attestation letter (PAL).',
            ],
            criticalRules: 'You cannot work off-campus on a student visa if your study permit does not explicitly authorize off-campus employment.',
          },
          {
            stageCode: 'STAGE_C',
            stageTitle: 'Stage C — During the First Semester',
            timelineDescription: 'Weeks 1 to 8 in Canada',
            stepOrder: 3,
            actionItems: [
              'Apply in person or online for your 9-digit Social Insurance Number (SIN) at Service Canada.',
              'Open a Canadian bank account and set up direct deposit for payroll.',
              'Adapt your resume to Canadian standards: reverse chronological, emphasizing measurable impacts and voluntary contributions.',
              'Strictly obey the 24 hours per week off-campus limit during study sessions.',
            ],
            criticalRules: 'Working before receiving your physical study permit at the Canadian port of entry is illegal.',
          },
          {
            stageCode: 'STAGE_D',
            stageTitle: 'Stage D — During Study (Years 2 & 3)',
            timelineDescription: 'Middle academic semesters',
            stepOrder: 4,
            actionItems: [
              'Complete your Co-op placements using your valid Co-op Work Permit.',
              'Maintain full-time academic status in all mandatory semesters (dropping to part-time disqualifies you from PGWP).',
              'Participate in professional associations (e.g. IEEE Canada, CPA Ontario, CPHR).',
              'Take advantage of full-time work permissions during scheduled academic summer holidays.',
            ],
            criticalRules: 'An unauthorized part-time semester can result in complete refusal of your PGWP application.',
          },
          {
            stageCode: 'STAGE_E',
            stageTitle: 'Stage E — Six to Twelve Months Before Graduation',
            timelineDescription: 'Final academic year',
            stepOrder: 5,
            actionItems: [
              'Confirm that all graduation coursework requirements are met without gaps.',
              'Take your official language test (IELTS General Training or CELPIP-General) to meet the CLB 7 PGWP language threshold.',
              'Prepare required documents: official transcripts, completion letter, and application fees ($255 CAD).',
              'Network with employers offering TEER 0, 1, 2, or 3 roles to ensure experience counts toward Canadian Experience Class (CEC).',
            ],
            criticalRules: 'You have 180 days to apply for your PGWP after receiving your official completion letter.',
          },
          {
            stageCode: 'STAGE_F',
            stageTitle: 'Stage F — Graduation & Transition to Career',
            timelineDescription: 'Post-graduation to Permanent Residency',
            stepOrder: 6,
            actionItems: [
              'Submit your PGWP application immediately upon receipt of your final completion letter.',
              'Continue working full-time legally under "maintained status" while IRCC processes your PGWP.',
              'Accumulate 12 months of skilled Canadian work experience under TEER category 0, 1, 2, or 3.',
              'Submit an Express Entry profile under the Canadian Experience Class (CEC) or targeted category-based selection.',
            ],
            criticalRules: 'Never let your underlying legal status expire in Canada while awaiting post-graduation decisions.',
          },
        ],
      },
    ],
    officialSources: [
      {
        authorityName: 'Immigration, Refugees and Citizenship Canada (IRCC)',
        category: 'IMMIGRATION',
        sourceTitle: 'Work off campus as an international student',
        sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/work-off-campus.html',
        retrievalDate: '2024-04-01',
        status: 'ACTIVE_VERIFIED',
      },
      {
        authorityName: 'Immigration, Refugees and Citizenship Canada (IRCC)',
        category: 'IMMIGRATION',
        sourceTitle: 'Post-Graduation Work Permit (PGWP) Eligibility and Rules',
        sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation.html',
        retrievalDate: '2024-04-01',
        status: 'ACTIVE_VERIFIED',
      },
      {
        authorityName: 'Employment and Social Development Canada (ESDC)',
        category: 'MINIMUM_WAGE',
        sourceTitle: 'Federal Minimum Wage Rate Guidance',
        sourceUrl: 'https://www.canada.ca/en/services/jobs/workplace/federal-labour-standards/minimum-wage.html',
        retrievalDate: '2024-04-01',
        policyEffectiveDate: '2024-04-01',
        status: 'ACTIVE_VERIFIED',
      },
    ],
  },

  // ==========================================
  // 5. AUSTRALIA (AU)
  // ==========================================
  {
    countryCode: 'AU',
    languages: [
      {
        languageName: 'English',
        languageCode: 'en',
        isOfficial: false,
        isNational: true,
        isRegional: false,
        isWidelySpoken: true,
        higherEdUsage: 'Exclusive medium of instruction across all Australian universities.',
        jobMarketUsage: 'Required across all professional and corporate environments.',
        notes: 'Australia has no statutory official language, but English is the de facto national language.',
      },
    ],
    minimumWagePolicy: {
      policyType: 'STATUTORY_NATIONAL',
      hasStatutoryMinimum: true,
      governingBody: 'Fair Work Commission (FWC)',
      legislationName: 'Fair Work Act 2009',
      overview: 'Australia sets a national minimum wage safety net, complemented by Modern Awards establishing higher legally enforceable wage floors across specific industries.',
      collectiveBargainingNote: 'Modern Awards and enterprise agreements establish industry-specific minimum rates that often exceed the National Minimum Wage.',
      sourceUrl: 'https://www.fairwork.gov.au/pay-and-wages/minimum-wages',
      verificationStatus: 'VERIFIED',
      rates: [
        {
          rateUnit: 'HOURLY',
          amount: 24.10,
          currencyCode: 'AUD',
          currencySymbol: '$',
          effectiveDate: '2024-07-01',
          isCurrent: true,
          rateType: 'STATUTORY',
          ageCategory: 'Adult (21+)',
          apprenticeException: 'Junior rates apply to employees aged under 21 who are not covered by an award.',
          estimatedBdtHourly: 1879.8,
          bdtExchangeRateUsed: 78.0,
          exchangeRateProvider: 'Borno Currency Matrix',
          rateNotes: 'National Minimum Wage set by Fair Work Commission Annual Wage Review 2024 ($915.90 per 38-hour week).',
          officialSourceUrl: 'https://www.fairwork.gov.au/pay-and-wages/minimum-wages',
          verificationStatus: 'VERIFIED',
        },
      ],
    },
    studentWorkPolicy: {
      eligibilityStatus: 'PERMITTED_UNDER_CONDITIONS',
      termTimeLimitHours: 48,
      termTimeUnit: 'HOURS_PER_FORTNIGHT',
      termTimeRuleText: '48 hours per fortnight while your course of study is in session (under Student Visa condition 8105). A fortnight is defined by the Department of Home Affairs as any 14-day period starting on a Monday.',
      holidayLimitHours: undefined,
      holidayTimeUnit: 'UNRESTRICTED',
      holidayRuleText: 'Unrestricted work hours permitted when your course is not in session during scheduled university holidays and official breaks.',
      onCampusRules: 'On-campus work is subject to the same 48 hours per fortnight limit during study sessions unless student is enrolled in Masters by research or PhD.',
      offCampusRules: 'Subject to 48 hours per fortnight limit during term time. All student workers are protected by Australian workplace laws and the National Minimum Wage.',
      selfEmploymentAllowed: true,
      selfEmploymentRules: 'Contractor and freelance work with an Australian Business Number (ABN) is permitted, but all hours worked must be tracked and count against the 48-hour fortnightly cap.',
      internshipRules: 'Registered work placements that are a mandatory requirement of the CRICOS-registered course do not count toward the 48 hours per fortnight limit.',
      assistantshipRules: 'Masters by research and PhD candidates have unrestricted work rights once their course has commenced.',
      canWorkBeforeCourseStarts: false,
      postCompletionRules: 'Unrestricted work rights apply once your course has officially concluded, while your subclass 500 visa remains valid.',
      visaConditionPrecedenceNote: 'Visa condition 8105 attached to your Student Visa (subclass 500) governs all employment parameters.',
      sourceUrl: 'https://www.studyaustralia.gov.au/en/plan-your-move/your-guide-to-visas/student-visa-subclass-500',
      verificationStatus: 'VERIFIED',
    },
    postStudyWorkRoutes: [
      {
        routeName: 'Temporary Graduate Visa (Subclass 485) — Post-Higher Education Work Stream',
        routeCode: 'AU-485',
        durationMonthsMin: 24,
        durationMonthsMax: 36,
        durationNotes: 'Bachelor degree: 2 years. Master degree (coursework or research): 2 to 3 years. Doctoral (PhD): 3 years. Regional study grants an additional 1 to 2 years.',
        jobOfferRequired: false,
        employerSponsorshipRequired: false,
        occupationRestrictions: false,
        selfEmploymentAllowed: true,
        isExtensionPossible: false,
        leadsToPermanentResidence: true,
        prPathwayDetails: 'Provides valuable Australian skilled work experience for General Skilled Migration points (subclasses 189, 190, 491) or employer-sponsored visas (subclass 482/186).',
        applicationDeadlineDays: 180,
        applicationDeadlineDescription: 'Must apply within 6 months (180 days) of course completion date.',
        applicationFeeAmount: 1915,
        applicationFeeCurrency: 'AUD',
        governmentApplicationUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485',
        verificationStatus: 'VERIFIED',
        policyChangeNotice: 'New age limits (maximum 35 years of age at time of application for bachelor/master graduates) effective mid-2024.',
        eligibilityRules: [
          {
            qualificationLevel: 'BACHELORS',
            institutionCriteria: 'CRICOS-registered Australian higher education course.',
            studyDurationRequirement: 'Australian Study Requirement: at least 2 academic years (92 weeks) of CRICOS-registered study in English.',
            languageRequirement: 'IELTS overall 6.5 (minimum 5.5 in each component) or equivalent.',
            financialProofRequired: false,
            description: 'Unrestricted open work rights anywhere in Australia.',
          },
          {
            qualificationLevel: 'MASTERS',
            institutionCriteria: 'CRICOS-registered institution.',
            studyDurationRequirement: 'Minimum 2 academic years in Australia.',
            languageRequirement: 'IELTS overall 6.5.',
            financialProofRequired: false,
            description: 'Grants 2 to 3 years of work rights depending on degree stream.',
          },
        ],
      },
    ],
    careerSectors: [
      {
        name: 'Mining, Civil & Clean Energy Engineering',
        slug: 'engineering-mining-clean-energy',
        overview: 'Western Australia, Queensland, and New South Wales host world-class engineering infrastructure projects.',
        demandStatus: 'HIGH_SHORTAGE',
        shortageListOfficial: true,
        averageSalaryMin: 75000,
        averageSalaryMax: 120000,
        salaryCurrency: 'AUD',
        officialPortalName: 'Jobs and Skills Australia',
        officialPortalUrl: 'https://www.jobsandskills.gov.au',
        occupations: [
          {
            title: 'Civil Engineer',
            code: '233211',
            isRegulated: true,
            regulatorBody: 'Engineers Australia',
            licensingRequirements: 'Skills assessment through Engineers Australia required for permanent migration pathways.',
            entryQualification: '4-year Washington Accord accredited Bachelor of Engineering or recognized Master.',
            languageProficiency: 'IELTS 6.0+ competent English.',
            typicalStartingSalary: 78000,
            salarySource: 'Engineers Australia Salary Survey',
            jobOutlook: 'VERY_STRONG',
            exampleEmployers: ['BHP', 'Rio Tinto', 'Arup', 'AECOM', 'WSP'],
          },
        ],
      },
    ],
    careerRoadmaps: [
      {
        title: 'Study-to-Career Roadmap: Australia',
        targetAudience: 'INTERNATIONAL_STUDENTS',
        summary: 'Strategic navigation through Fair Work rights, 48 hours per fortnight compliance, Subclass 485 Temporary Graduate Visa, and General Skilled Migration points.',
        steps: [
          {
            stageCode: 'STAGE_A',
            stageTitle: 'Stage A — Before Choosing Australia',
            timelineDescription: '12–18 months prior to commencement',
            stepOrder: 1,
            actionItems: [
              'Ensure your chosen degree meets the Australian Study Requirement (CRICOS registration of at least 92 weeks).',
              'Check the age eligibility cap for the Subclass 485 Temporary Graduate Visa (maximum 35 years old at application time for bachelor/master graduates).',
              'Review regional university locations (Adelaide, Perth, Gold Coast, Wollongong, Hobart) to qualify for 1–2 extra years of post-study work rights.',
            ],
            criticalRules: 'Student visa condition 8105 strictly forbids working before your course officially commences in Australia.',
          },
          {
            stageCode: 'STAGE_B',
            stageTitle: 'Stage B — Before Applying to Australian Universities',
            timelineDescription: '8–12 months prior to commencement',
            stepOrder: 2,
            actionItems: [
              'Verify that the institution is a member of the Group of Eight (Go8) or Australian Technology Network (ATN) with strong industry links.',
              'Assess the Genuine Student (GS) assessment requirements for visa approval.',
              'Calculate total funds: Genuine Student requirement requires evidence of living costs ($29,710 AUD/year) plus tuition.',
            ],
            criticalRules: 'Never accept cash-in-hand work below the National Minimum Wage; all workers in Australia have statutory Fair Work rights.',
          },
          {
            stageCode: 'STAGE_C',
            stageTitle: 'Stage C — During the First Semester',
            timelineDescription: 'Weeks 1 to 8 in Australia',
            stepOrder: 3,
            actionItems: [
              'Apply online for a Tax File Number (TFN) from the Australian Taxation Office (ATO).',
              'Open a Superannuation retirement account linked to your employment payroll.',
              'Format your CV to Australian standards: focus on practical work history, key competencies, and Australian referee contacts.',
              'Set up a tracking calendar for your 48 hours per fortnight allowance (calculated Monday to second Sunday).',
            ],
            criticalRules: 'Exceeding 48 hours in any 14-day cycle can result in visa cancellation under Section 116 of the Migration Act.',
          },
          {
            stageCode: 'STAGE_D',
            stageTitle: 'Stage D — During Study (Year 2)',
            timelineDescription: 'Penultimate semesters',
            stepOrder: 4,
            actionItems: [
              'Apply for summer internships and vacationer programs (applications open in February/March for end-of-year summer).',
              'Take advantage of unrestricted working hours during official semester vacations.',
              'Participate in student societies affiliated with professional bodies (e.g. Australian Computer Society, CPA Australia).',
            ],
            criticalRules: 'Do not work more than 48 hours per fortnight if taking voluntary winter units that make your term active.',
          },
          {
            stageCode: 'STAGE_E',
            stageTitle: 'Stage E — Six to Twelve Months Before Graduation',
            timelineDescription: 'Final academic semester',
            stepOrder: 5,
            actionItems: [
              'Schedule your English language proficiency test (IELTS 6.5 minimum) well in advance of visa application.',
              'Obtain an Australian Federal Police (AFP) National Police Check.',
              'Organize your Overseas Visitor Health Cover (OVHC) to replace your expiring Overseas Student Health Cover (OSHC).',
              'Request official completion letter and academic transcript from university student administration.',
            ],
            criticalRules: 'You have exactly 6 months from the official course completion date to lodge your Subclass 485 visa application.',
          },
          {
            stageCode: 'STAGE_F',
            stageTitle: 'Stage F — Graduation & Transition to Career',
            timelineDescription: 'Lodging Subclass 485 to PR points',
            stepOrder: 6,
            actionItems: [
              'Lodge your Subclass 485 visa via ImmiAccount before your student visa expires.',
              'Receive Bridging Visa A (BVA) granting full unrestricted work rights while the 485 is processed.',
              'Begin skilled employment in your nominated occupation and lodge an Expression of Interest (EOI) via SkillSelect.',
              'Pursue state sponsorship (Subclass 190 / 491) or employer-sponsored pathways (Subclass 482 / 186).',
            ],
            criticalRules: 'A Bridging Visa does not automatically permit overseas travel; you must apply for Bridging Visa B (BVB) before leaving Australia.',
          },
        ],
      },
    ],
    officialSources: [
      {
        authorityName: 'Department of Home Affairs',
        category: 'IMMIGRATION',
        sourceTitle: 'Student Visa (Subclass 500) Work Restrictions Condition 8105',
        sourceUrl: 'https://immi.homeaffairs.gov.au/visas/already-have-a-visa/check-visa-details-and-conditions/see-your-conditions?product=500',
        retrievalDate: '2024-04-01',
        status: 'ACTIVE_VERIFIED',
      },
      {
        authorityName: 'Fair Work Commission (FWC)',
        category: 'MINIMUM_WAGE',
        sourceTitle: 'National Minimum Wage Orders and Awards',
        sourceUrl: 'https://www.fairwork.gov.au/pay-and-wages/minimum-wages',
        retrievalDate: '2024-07-01',
        policyEffectiveDate: '2024-07-01',
        status: 'ACTIVE_VERIFIED',
      },
      {
        authorityName: 'Department of Home Affairs',
        category: 'IMMIGRATION',
        sourceTitle: 'Temporary Graduate Visa (Subclass 485) Overview',
        sourceUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485',
        retrievalDate: '2024-04-01',
        status: 'ACTIVE_VERIFIED',
      },
    ],
  },

  // ==========================================
  // 6. SWEDEN (SE)
  // ==========================================
  {
    countryCode: 'SE',
    languages: [
      {
        languageName: 'Swedish',
        languageCode: 'sv',
        isOfficial: true,
        isNational: true,
        isRegional: false,
        isWidelySpoken: true,
        higherEdUsage: 'Primary medium for domestic undergraduate programs; extensive English-taught Master degrees.',
        jobMarketUsage: 'Required for regulated healthcare, education, and legal occupations; Swedish B2 strongly preferred in domestic enterprises.',
      },
      {
        languageName: 'English',
        languageCode: 'en',
        isOfficial: false,
        isNational: false,
        isRegional: false,
        isWidelySpoken: true,
        higherEdUsage: 'Over 1,000 Master programs taught entirely in English across Swedish universities.',
        jobMarketUsage: 'Widely accepted in Sweden high-tech, telecommunications, gaming, and multinational corporations.',
      },
    ],
    minimumWagePolicy: {
      policyType: 'NO_STATUTORY_MINIMUM',
      hasStatutoryMinimum: false,
      governingBody: 'National Mediation Office (Medlingsinstitutet) & Social Partners',
      legislationName: 'Co-Determination in the Workplace Act (MBL)',
      overview: 'Sweden has NO statutory national minimum wage. Wages and employment conditions are regulated entirely through collective bargaining agreements (Kollektivavtal) negotiated between trade unions and employers associations.',
      collectiveBargainingNote: 'Over 90% of workers in Sweden are covered by collective agreements establishing sectoral wage floors.',
      sourceUrl: 'https://www.mi.se/loner-lonestatistik/kollektivavtal/',
      verificationStatus: 'VERIFIED',
      rates: [],
    },
    studentWorkPolicy: {
      eligibilityStatus: 'PERMITTED_UNDER_CONDITIONS',
      termTimeLimitHours: undefined,
      termTimeUnit: 'NO_STATUTORY_LIMIT',
      termTimeRuleText: 'No statutory hourly limit on work for non-EU students holding a valid residence permit for higher education, provided you maintain required academic progression (completing at least 30 ECTS credits per academic year).',
      holidayLimitHours: undefined,
      holidayTimeUnit: 'UNRESTRICTED',
      holidayRuleText: 'Unrestricted work rights throughout the entire year, including summer recesses.',
      onCampusRules: 'Permitted without limitation as long as full-time studies are maintained.',
      offCampusRules: 'Permitted without statutory hour caps. Migrationsverket checks your academic credits when reviewing permit extension applications.',
      selfEmploymentAllowed: true,
      selfEmploymentRules: 'Allowed to operate an F-skatt registered business or sole proprietorship alongside university studies.',
      internshipRules: 'Curricular internships can be completed freely without additional work authorization.',
      assistantshipRules: 'Doctoral students in Sweden are commonly employed on paid university employment contracts (Doktorandtjänst).',
      canWorkBeforeCourseStarts: false,
      postCompletionRules: 'Can apply for a 12-month jobseeker residence permit before current student permit expires.',
      visaConditionPrecedenceNote: 'Migrationsverket residence permit decision letter sets forth your legal status.',
      sourceUrl: 'https://www.migrationsverket.se/English/Private-individuals/Studying-and-researching-in-Sweden/Higher-education/Working-while-studying.html',
      verificationStatus: 'VERIFIED',
    },
    postStudyWorkRoutes: [
      {
        routeName: 'Residence Permit to Seek Employment or Explore Business Opportunities',
        routeCode: 'SE-JOBSEEKER',
        durationMonthsMin: 12,
        durationMonthsMax: 12,
        durationNotes: 'Granted for 12 months post-graduation. Cannot be extended beyond 12 months.',
        jobOfferRequired: false,
        employerSponsorshipRequired: false,
        occupationRestrictions: false,
        selfEmploymentAllowed: true,
        isExtensionPossible: false,
        leadsToPermanentResidence: true,
        prPathwayDetails: 'Upon finding qualified employment, switch to a Work Permit (Arbetstillstånd). After 4 years on a work permit, graduates can apply for permanent residence (Permanent Uppehållstillstånd - PUT).',
        applicationDeadlineDays: 0,
        applicationDeadlineDescription: 'Must apply before your current student residence permit expires, having completed at least 2 semesters of higher education.',
        applicationFeeAmount: 1600,
        applicationFeeCurrency: 'SEK',
        governmentApplicationUrl: 'https://www.migrationsverket.se/English/Private-individuals/Studying-and-researching-in-Sweden/Higher-education/After-your-studies.html',
        verificationStatus: 'VERIFIED',
        eligibilityRules: [
          {
            qualificationLevel: 'BACHELORS',
            institutionCriteria: 'Swedish university or university college.',
            studyDurationRequirement: 'Completed degree or minimum 2 full-time semesters.',
            financialProofRequired: true,
            description: 'Must prove financial maintenance of at least 9,450 SEK/month for the 12-month period and valid comprehensive health insurance.',
          },
          {
            qualificationLevel: 'MASTERS',
            institutionCriteria: 'Accredited Swedish higher education institution.',
            studyDurationRequirement: 'Completed Master degree.',
            financialProofRequired: true,
            description: 'Allows 12 months of unrestricted search for employment matching degree level.',
          },
        ],
      },
    ],
    careerSectors: [
      {
        name: 'Green Tech, Clean Energy & Battery Manufacturing',
        slug: 'green-tech-battery',
        overview: 'Sweden leads European decarbonization with major clusters in Northvolt ecosystem, Stockholm green finance, and Gothenburg.',
        demandStatus: 'HIGH_SHORTAGE',
        shortageListOfficial: true,
        averageSalaryMin: 38000,
        averageSalaryMax: 60000,
        salaryCurrency: 'SEK',
        officialPortalName: 'Arbetsförmedlingen (Public Employment Service)',
        officialPortalUrl: 'https://arbetsformedlingen.se',
        occupations: [
          {
            title: 'Renewable Energy Systems Engineer',
            code: '2151',
            isRegulated: false,
            entryQualification: 'MSc in Chemical, Electrical, or Energy Engineering.',
            languageProficiency: 'English C1; Swedish B1.',
            typicalStartingSalary: 42000,
            salarySource: 'Sveriges Ingenjörer (Association of Graduate Engineers)',
            jobOutlook: 'VERY_STRONG',
            exampleEmployers: ['Vattenfall', 'Scania', 'Volvo Group', 'Northvolt', 'ABB Sweden'],
          },
        ],
      },
    ],
    careerRoadmaps: [
      {
        title: 'Study-to-Career Roadmap: Kingdom of Sweden',
        targetAudience: 'INTERNATIONAL_STUDENTS',
        summary: 'Guide to academic credit progression, collective agreement wages, the 12-month jobseeker permit, and the Swedish work permit path.',
        steps: [
          {
            stageCode: 'STAGE_A',
            stageTitle: 'Stage A — Before Choosing Sweden',
            timelineDescription: '12–15 months before study',
            stepOrder: 1,
            actionItems: [
              'Verify course offering through University Admissions Sweden (universityadmissions.se).',
              'Understand the Nordic labour model: Sweden has no statutory minimum wage; wages are set via union Kollektivavtal.',
              'Calculate cost of living: Migrationsverket requires proof of at least 9,450 SEK per month for living expenses.',
            ],
            criticalRules: 'Student work in Sweden has no hourly cap, but you must complete at least 30 ECTS credits/year to maintain legal status.',
          },
          {
            stageCode: 'STAGE_B',
            stageTitle: 'Stage B — Before Applying to Swedish Universities',
            timelineDescription: '8–10 months before application deadline',
            stepOrder: 2,
            actionItems: [
              'Apply in the First Round for international students (deadline mid-January for autumn intake).',
              'Check Swedish Institute (SI) Scholarship for Global Professionals criteria.',
              'Begin learning Swedish via official online courses (e.g. Learning Swedish by the Swedish Institute).',
            ],
            criticalRules: 'Missing the January application deadline locks you out of most English-taught Master programs.',
          },
          {
            stageCode: 'STAGE_C',
            stageTitle: 'Stage C — During the First Semester',
            timelineDescription: 'Months 1 to 4 in Sweden',
            stepOrder: 3,
            actionItems: [
              'Register with the Swedish Tax Agency (Skatteverket) to obtain your 10-digit Swedish Personal Identity Number (Personnummer).',
              'Obtain a Swedish ID card (ID-kort) and open a Swedish bank account with BankID access.',
              'Enroll in municipal Swedish for Immigrants (SFI) language courses (free of charge for residents with a Personnummer).',
              'Connect with university career centers and student nations.',
            ],
            criticalRules: 'Without a Personnummer, accessing healthcare, mobile subscriptions, and Swedish bank accounts is severely delayed.',
          },
          {
            stageCode: 'STAGE_D',
            stageTitle: 'Stage D — During Study (Year 2)',
            timelineDescription: 'Semesters 2 to 3',
            stepOrder: 4,
            actionItems: [
              'Maintain your academic pace: ensure all 30 credits per semester are completed to secure permit extensions.',
              'Look for master thesis opportunities (Examensarbete) embedded within Swedish industrial firms.',
              'Join the relevant Swedish trade union as a student member (e.g. Sveriges Ingenjörer, Unionen).',
            ],
            criticalRules: 'Do not compromise your academic progress for part-time jobs; failed credits will result in permit refusal.',
          },
          {
            stageCode: 'STAGE_E',
            stageTitle: 'Stage E — Six to Twelve Months Before Graduation',
            timelineDescription: 'Final thesis semester',
            stepOrder: 5,
            actionItems: [
              'Write your thesis at a company to establish direct employment rapport.',
              'Apply for the 12-month post-study jobseeker permit before your student permit expires.',
              'Show proof of funds for 12 months (~113,400 SEK) in a personal bank account.',
              'Ensure job offers meet Kollektivavtal terms and statutory insurance coverage.',
            ],
            criticalRules: 'Applying for the jobseeker permit after your student permit has expired is strictly prohibited.',
          },
          {
            stageCode: 'STAGE_F',
            stageTitle: 'Stage F — Graduation & Transition to Career',
            timelineDescription: 'Post-study permit to Work Permit',
            stepOrder: 6,
            actionItems: [
              'Receive your 12-month jobseeker permit and pursue professional roles full-time.',
              'Once an employer extends a qualified offer, have the employer initiate your Work Permit (Arbetstillstånd) application.',
              'Ensure the employer advertises the role on EURES / Arbetsförmedlingen for at least 10 days.',
              'Transition seamlessly to a work permit without leaving Sweden.',
            ],
            criticalRules: 'Work permit terms must match Swedish collective agreements, including mandatory pension, life, and health insurance.',
          },
        ],
      },
    ],
    officialSources: [
      {
        authorityName: 'Swedish Migration Agency (Migrationsverket)',
        category: 'IMMIGRATION',
        sourceTitle: 'Working while studying in higher education in Sweden',
        sourceUrl: 'https://www.migrationsverket.se/English/Private-individuals/Studying-and-researching-in-Sweden/Higher-education/Working-while-studying.html',
        retrievalDate: '2024-04-01',
        status: 'ACTIVE_VERIFIED',
      },
      {
        authorityName: 'Swedish Migration Agency (Migrationsverket)',
        category: 'IMMIGRATION',
        sourceTitle: 'Residence permit for looking for work after studies',
        sourceUrl: 'https://www.migrationsverket.se/English/Private-individuals/Studying-and-researching-in-Sweden/Higher-education/After-your-studies.html',
        retrievalDate: '2024-04-01',
        status: 'ACTIVE_VERIFIED',
      },
      {
        authorityName: 'National Mediation Office (Medlingsinstitutet)',
        category: 'MINIMUM_WAGE',
        sourceTitle: 'The Swedish Model and Collective Wage Agreements',
        sourceUrl: 'https://www.mi.se/om-medlingsinstitutet/the-swedish-model/',
        retrievalDate: '2024-01-01',
        status: 'ACTIVE_VERIFIED',
      },
    ],
  },

  // ==========================================
  // 7. FINLAND (FI)
  // ==========================================
  {
    countryCode: 'FI',
    languages: [
      {
        languageName: 'Finnish',
        languageCode: 'fi',
        isOfficial: true,
        isNational: true,
        isRegional: false,
        isWidelySpoken: true,
        higherEdUsage: 'Primary instruction medium for domestic programs; selective English bachelor degrees.',
        jobMarketUsage: 'Essential for client-facing, public sector, and healthcare positions. B1/B2 generally required.',
      },
      {
        languageName: 'Swedish',
        languageCode: 'sv',
        isOfficial: true,
        isNational: true,
        isRegional: true,
        isWidelySpoken: false,
        higherEdUsage: 'Official minority language; programs at Åbo Akademi and Hanken School of Economics.',
        jobMarketUsage: 'Required in bilingual municipalities and public administration.',
      },
      {
        languageName: 'English',
        languageCode: 'en',
        isOfficial: false,
        isNational: false,
        isRegional: false,
        isWidelySpoken: true,
        higherEdUsage: 'Extensive catalogue of English-taught Bachelor and Master programs at universities and UAS.',
        jobMarketUsage: 'Standard working language in Finnish gaming, software development, and tech start-ups.',
      },
    ],
    minimumWagePolicy: {
      policyType: 'NO_STATUTORY_MINIMUM',
      hasStatutoryMinimum: false,
      governingBody: 'Ministry of Economic Affairs and Employment (TEM) & Social Partners',
      legislationName: 'Employment Contracts Act (Työsopimuslaki)',
      overview: 'Finland does not have a national statutory minimum wage. Minimum wages are established by legally binding universal collective agreements (Yleissitova työehtosopimus - TES) in each sector.',
      collectiveBargainingNote: 'Employers are legally required to comply with the universally binding collective agreement of their industry.',
      sourceUrl: 'https://www.tyosuojelu.fi/web/en/employment-relationship/pay/minimum-wage',
      verificationStatus: 'VERIFIED',
      rates: [],
    },
    studentWorkPolicy: {
      eligibilityStatus: 'PERMITTED_UNDER_CONDITIONS',
      termTimeLimitHours: 30,
      termTimeUnit: 'HOURS_PER_WEEK',
      termTimeRuleText: 'Average of 30 hours per week (increased from 25 hours under recent Finnish immigration reform). Hours can be balanced over the calendar year.',
      holidayLimitHours: undefined,
      holidayTimeUnit: 'UNRESTRICTED',
      holidayRuleText: 'Unrestricted full-time work permitted during summer and Christmas holidays when the educational institution has no teaching.',
      onCampusRules: 'Subject to the 30-hour average weekly limit.',
      offCampusRules: 'Permitted up to an average of 30 hours per week across the calendar year.',
      selfEmploymentAllowed: true,
      selfEmploymentRules: 'Allowed to operate as a light entrepreneur (kevytyrittäjä) or registered trade name (toiminimi).',
      internshipRules: 'Practical training (harjoittelu) or thesis work included in the degree is not subject to the 30-hour limit.',
      assistantshipRules: 'Research and teaching assistant jobs at universities are permitted.',
      canWorkBeforeCourseStarts: false,
      postCompletionRules: 'Can apply for a 2-year post-study residence permit for job search or entrepreneurship.',
      visaConditionPrecedenceNote: 'Finnish Immigration Service (Migri) residence permit decision terms apply.',
      sourceUrl: 'https://migri.fi/en/working-and-internships-during-studies',
      verificationStatus: 'VERIFIED',
    },
    postStudyWorkRoutes: [
      {
        routeName: 'Extended Residence Permit for Looking for Work or Starting a Business',
        routeCode: 'FI-JOBSEEKER',
        durationMonthsMin: 24,
        durationMonthsMax: 24,
        durationNotes: 'Can be granted for up to 2 years (24 months). Can be taken in up to three parts within 5 years of graduation.',
        jobOfferRequired: false,
        employerSponsorshipRequired: false,
        occupationRestrictions: false,
        selfEmploymentAllowed: true,
        isExtensionPossible: false,
        leadsToPermanentResidence: true,
        prPathwayDetails: 'Time on a continuous (A) student permit now counts fully toward the 4-year residency requirement for Finnish permanent residence (Pysyvä oleskelulupa)!',
        applicationDeadlineDays: 0,
        applicationDeadlineDescription: 'Can be applied for immediately upon degree completion or within 5 years of graduation from a Finnish institution.',
        applicationFeeAmount: 540,
        applicationFeeCurrency: 'EUR',
        governmentApplicationUrl: 'https://migri.fi/en/residence-permit-to-look-for-work',
        verificationStatus: 'VERIFIED',
        eligibilityRules: [
          {
            qualificationLevel: 'BACHELORS',
            institutionCriteria: 'Finnish university or university of applied sciences (AMK).',
            studyDurationRequirement: 'Completed degree.',
            financialProofRequired: true,
            description: 'Must show sufficient financial resources for living in Finland.',
          },
          {
            qualificationLevel: 'MASTERS',
            institutionCriteria: 'Recognized Finnish higher education institution.',
            studyDurationRequirement: 'Completed Master degree.',
            financialProofRequired: true,
            description: 'Grants up to 2 full years of open work rights.',
          },
        ],
      },
    ],
    careerSectors: [
      {
        name: 'Information Technology, Cybersecurity & Mobile Gaming',
        slug: 'it-cybersecurity-gaming',
        overview: 'Espoo and Helsinki form the heart of Europe vibrant mobile gaming and quantum computing ecosystems.',
        demandStatus: 'HIGH_SHORTAGE',
        shortageListOfficial: true,
        averageSalaryMin: 42000,
        averageSalaryMax: 68000,
        salaryCurrency: 'EUR',
        officialPortalName: 'Työmarkkinatori (Labour Market Finland)',
        officialPortalUrl: 'https://tyomarkkinatori.fi',
        occupations: [
          {
            title: 'Game Programmer & Unity/Unreal Developer',
            code: '2512',
            isRegulated: false,
            entryQualification: 'BSc or MSc in Computer Science or Game Technology.',
            languageProficiency: 'English C1 (Working language of Finnish studios).',
            typicalStartingSalary: 44000,
            salarySource: 'Neogames Finland Industry Report',
            jobOutlook: 'STRONG',
            exampleEmployers: ['Supercell', 'Rovio', 'Remedy Entertainment', 'Nokia Bell Labs'],
          },
        ],
      },
    ],
    careerRoadmaps: [
      {
        title: 'Study-to-Career Roadmap: Republic of Finland',
        targetAudience: 'INTERNATIONAL_STUDENTS',
        summary: 'Guide detailing the 30-hour weekly allowance, continuous type A permit conversion, 2-year jobseeker permit, and the 4-year track to Finnish PR.',
        steps: [
          {
            stageCode: 'STAGE_A',
            stageTitle: 'Stage A — Before Choosing Finland',
            timelineDescription: '12–15 months before intake',
            stepOrder: 1,
            actionItems: [
              'Explore Finnish research universities and Universities of Applied Sciences (AMK) via Studyinfo.fi (Opintopolku).',
              'Review generous university merit scholarships covering 50% to 100% of non-EU tuition fees.',
              'Note that Finnish student residence permits are granted as continuous (Type A) permits for the entire duration of studies.',
            ],
            criticalRules: 'Finland does not have a statutory minimum wage; rates are defined by universally binding collective agreements (TES).',
          },
          {
            stageCode: 'STAGE_B',
            stageTitle: 'Stage B — Before Applying to University',
            timelineDescription: '8–10 months before intake',
            stepOrder: 2,
            actionItems: [
              'Apply through the joint application period (Yhteishaku) in January for autumn intake.',
              'Prepare required English certificates (IELTS 6.5 or TOEFL 92).',
              'Check health insurance requirements (Schengen-compliant private health insurance is mandatory for non-EU students).',
            ],
            criticalRules: 'Accepting a study place in Finland requires formal confirmation via the Studyinfo portal within the deadline.',
          },
          {
            stageCode: 'STAGE_C',
            stageTitle: 'Stage C — During the First Semester',
            timelineDescription: 'Months 1 to 4 in Finland',
            stepOrder: 3,
            actionItems: [
              'Register your right of domicile (kotikunta) and receive your Finnish personal identity code (henkilötunnus) at the Digital and Population Data Services Agency (DVV).',
              'Request a tax card (verokortti) from the Finnish Tax Administration (Vero).',
              'Open a Finnish bank account with strong electronic identification (e-identification/Pankkitunnukset).',
              'Respect the average 30 hours per week working limit.',
            ],
            criticalRules: 'Without a tax card, your employer is legally mandated to withhold 60% tax from your earnings.',
          },
          {
            stageCode: 'STAGE_D',
            stageTitle: 'Stage D — During Study (Year 2)',
            timelineDescription: 'Middle academic year',
            stepOrder: 4,
            actionItems: [
              'Apply for summer jobs (kesätyö): applications open from January to March.',
              'Work full-time during the summer period without hourly limitations.',
              'Participate in company projects and research assignments at your university.',
            ],
            criticalRules: 'Maintain full-time academic progression; completion of credits is reviewed if permit extensions are requested.',
          },
          {
            stageCode: 'STAGE_E',
            stageTitle: 'Stage E — Six to Twelve Months Before Graduation',
            timelineDescription: 'Final thesis period',
            stepOrder: 5,
            actionItems: [
              'Write your thesis (Diplomityö / Pro gradu) for a commissioning Finnish enterprise.',
              'Prepare your application for the 2-year post-study residence permit for looking for work or starting a business.',
              'Take Finnish or Swedish language courses; achieving intermediate proficiency accelerates citizenship.',
            ],
            criticalRules: 'The post-study permit can be divided into up to three parts within 5 years of graduation.',
          },
          {
            stageCode: 'STAGE_F',
            stageTitle: 'Stage F — Graduation & Transition to Career',
            timelineDescription: 'Post-graduation to Permanent Residency',
            stepOrder: 6,
            actionItems: [
              'Apply for the 2-year post-study jobseeker permit via Enter Finland before your student permit expires.',
              'Work unrestricted full-time while seeking career employment.',
              'Upon securing an expert role, apply for a residence permit for an employed person or specialist.',
              'Apply for permanent residence (Pysyvä oleskelulupa) once you accumulate 4 continuous years on Type A permits.',
            ],
            criticalRules: 'Years spent studying on a Type A continuous permit count 100% towards the 4-year permanent residency qualification period.',
          },
        ],
      },
    ],
    officialSources: [
      {
        authorityName: 'Finnish Immigration Service (Migri)',
        category: 'IMMIGRATION',
        sourceTitle: 'Working and internships during studies in Finland',
        sourceUrl: 'https://migri.fi/en/working-and-internships-during-studies',
        retrievalDate: '2024-04-01',
        status: 'ACTIVE_VERIFIED',
      },
      {
        authorityName: 'Finnish Immigration Service (Migri)',
        category: 'IMMIGRATION',
        sourceTitle: 'Residence permit to look for work after graduation',
        sourceUrl: 'https://migri.fi/en/residence-permit-to-look-for-work',
        retrievalDate: '2024-04-01',
        status: 'ACTIVE_VERIFIED',
      },
      {
        authorityName: 'Occupational Safety and Health Administration (Työsuojelu)',
        category: 'LABOUR_MINISTRY',
        sourceTitle: 'Pay and Minimum Wages in Finland',
        sourceUrl: 'https://www.tyosuojelu.fi/web/en/employment-relationship/pay/minimum-wage',
        retrievalDate: '2024-01-01',
        status: 'ACTIVE_VERIFIED',
      },
    ],
  },
];
