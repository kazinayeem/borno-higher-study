// Authoritative Initial Verified MOI & English Language Exemption Policies
// Sources:
// Aston: https://www.aston.ac.uk/international/aston-in-your-country/south-asia/bangladesh
// Alberta: https://www.ualberta.ca/en/graduate-studies/admissions-programs/apply/graduate-studies-application-faqs.html
// Ottawa: https://www.uottawa.ca/faculty-medicine/graduate-postdoctoral/admissions-overview/language-requirements
// McGill: https://www.mcgill.ca/gradapplicants/how-apply/you-apply-mcgill/proficiency
// Maynooth: https://www.maynoothuniversity.ie/study-maynooth/how-apply/english-language-requirements

export interface SeedMoiEligibilityCondition {
  conditionType: string;
  title: string;
  description: string;
  isMandatory: boolean;
}

export interface SeedMoiPolicy {
  universitySlug: string;
  universityName: string;
  country: string;
  qualificationLevel: 'UNDERGRADUATE' | 'POSTGRADUATE_TAUGHT' | 'POSTGRADUATE_RESEARCH' | 'ALL';
  departmentName?: string;
  programSlug?: string;
  acceptanceStatus: 
    | 'ACCEPTED_FOR_SPECIFIED_COURSES'
    | 'ACCEPTED_WITH_CONDITIONS'
    | 'NOT_ACCEPTED'
    | 'ACCEPTED_ONLY_FOR_SELECTED_INSTITUTIONS'
    | 'OFFICIAL_POLICY_NOT_VERIFIED'
    | 'POLICY_REQUIRES_DIRECT_CONFIRMATION';
  scope: 'ADMISSION_ONLY' | 'VISA_ONLY' | 'BOTH' | 'NEITHER';
  eligibleInstitutions?: string;
  eligibleCountries?: string;
  minDegreeDurationYears?: number;
  graduationValidityYears?: number;
  requiredCertificateWording?: string;
  transcriptsRequired: boolean;
  separateTestRequired: 'NO_TEST_REQUIRED' | 'SEPARATE_TEST_REQUIRED' | 'DEPENDS_ON_COURSE' | 'CONDITIONAL';
  visaSeparateRequirementNote: string;
  applicableIntakes: string;
  officialPolicyUrl: string;
  sourceExcerpt: string;
  reviewerNotes: string;
  conditions: SeedMoiEligibilityCondition[];
  exemptions?: {
    title: string;
    qualificationLevel: string;
    exemptionCategory: string;
    description: string;
    requirements: string;
    officialPolicyUrl: string;
  }[];
}

export const INITIAL_MOI_POLICIES: SeedMoiPolicy[] = [
  // 1. ASTON UNIVERSITY (United Kingdom)
  {
    universitySlug: 'aston-university',
    universityName: 'Aston University',
    country: 'United Kingdom',
    qualificationLevel: 'POSTGRADUATE_TAUGHT',
    departmentName: 'Aston Business School & College of Engineering and Physical Sciences',
    acceptanceStatus: 'ACCEPTED_ONLY_FOR_SELECTED_INSTITUTIONS',
    scope: 'ADMISSION_ONLY',
    eligibleInstitutions: 'BUET, IBA - University of Dhaka, North South University (NSU), BRAC University, East West University, Islamic University of Technology (IUT), Ahsanullah University of Science and Technology (AUST)',
    eligibleCountries: 'Bangladesh',
    minDegreeDurationYears: 4.0,
    graduationValidityYears: 5,
    requiredCertificateWording: 'Official letter on university letterhead signed by the Controller of Examinations or Registrar stating that the medium of instruction and assessment throughout the four-year undergraduate programme was exclusively English.',
    transcriptsRequired: true,
    separateTestRequired: 'CONDITIONAL',
    visaSeparateRequirementNote: 'IMPORTANT: Aston University operates as a UKVI Student Sponsor with self-assessment authority for degree-level courses. If Aston waives the English test for degree entry, it can endorse this on the CAS. However, if course entry requires pre-sessional English or non-degree study, a UKVI-approved SELT remains mandatory.',
    applicableIntakes: 'Autumn 2026, Spring 2027',
    officialPolicyUrl: 'https://www.aston.ac.uk/international/aston-in-your-country/south-asia/bangladesh',
    sourceExcerpt: 'Holders of a 4-year Bachelor degree from selected recognized English-medium institutions in Bangladesh (e.g., BUET, IBA DU, NSU, BRAC) completed within the last 5 years with strong academic standing can be considered for direct entry with an official Medium of Instruction letter.',
    reviewerNotes: 'Verified against Aston South Asia admissions guidance. Only specific approved institutions in Bangladesh qualify. Transcripts and official certificate must explicitly state English medium.',
    conditions: [
      {
        conditionType: 'INSTITUTION_RECOGNITION',
        title: 'Selected Approved Institutions Only',
        description: 'Degree must be awarded by an institution on Aston’s vetted Bangladesh institutional list (BUET, IBA DU, NSU, BRAC, EWU, IUT, AUST).',
        isMandatory: true,
      },
      {
        conditionType: 'DEGREE_DURATION',
        title: 'Minimum 4-Year Bachelor Degree',
        description: 'Qualifying undergraduate degree must have comprised at least 4 full years of academic study.',
        isMandatory: true,
      },
      {
        conditionType: 'GRADUATION_RECENCY',
        title: 'Completion within 5 Years',
        description: 'Degree must have been completed no more than 5 years prior to the course commencement date.',
        isMandatory: true,
      },
      {
        conditionType: 'TRANSCRIPT_NOTATION',
        title: 'Official Letterhead & Transcript Proof',
        description: 'Both the official degree transcript and registrar-signed MOI certificate must corroborate English instruction.',
        isMandatory: true,
      },
    ],
    exemptions: [
      {
        title: 'Bangladesh Selected Universities MOI Waiver',
        qualificationLevel: 'POSTGRADUATE_TAUGHT',
        exemptionCategory: 'MOI_DEGREE',
        description: 'Waiver of standard IELTS 6.5 requirement for graduates of recognized Bangladeshi English-medium universities.',
        requirements: '4-year Bachelor, graduated within 5 years, minimum GPA requirements as specified by course, official MOI certificate.',
        officialPolicyUrl: 'https://www.aston.ac.uk/international/aston-in-your-country/south-asia/bangladesh',
      },
    ],
  },

  // 2. UNIVERSITY OF ALBERTA (Canada)
  {
    universitySlug: 'university-of-alberta',
    universityName: 'University of Alberta',
    country: 'Canada',
    qualificationLevel: 'POSTGRADUATE_TAUGHT',
    departmentName: 'Faculty of Graduate Studies & Research (FGSR)',
    acceptanceStatus: 'ACCEPTED_WITH_CONDITIONS',
    scope: 'ADMISSION_ONLY',
    eligibleInstitutions: 'Accredited universities globally where the language of instruction and examination was English',
    eligibleCountries: 'Recognized international institutions with English medium of instruction',
    minDegreeDurationYears: 2.0,
    graduationValidityYears: 5,
    requiredCertificateWording: 'Official letter from the awarding institution registrar or an explicit statement on official transcripts verifying that the language of instruction and examination was English for the full duration of the degree.',
    transcriptsRequired: true,
    separateTestRequired: 'DEPENDS_ON_COURSE',
    visaSeparateRequirementNote: 'IMPORTANT: Canadian Immigration (IRCC) evaluates study permit applications separately from university admission. While UAlberta FGSR may grant an academic exemption, visa applications under specialized streams (such as SDS when active) or general study permits may require verifiable language scores.',
    applicableIntakes: 'Fall 2026, Winter 2027',
    officialPolicyUrl: 'https://www.ualberta.ca/en/graduate-studies/admissions-programs/apply/graduate-studies-application-faqs.html',
    sourceExcerpt: 'Applicants who have completed an academic degree of at least two full years of full-time instruction or a master\'s degree from a recognized university where the language of instruction was English are exempt from submitting English language test scores.',
    reviewerNotes: 'Verified via FGSR policy FAQs. Individual graduate departments (e.g. Computing Science, Business) retain the right to impose higher language thresholds or require a test.',
    conditions: [
      {
        conditionType: 'DEGREE_DURATION',
        title: 'Minimum 2 Years Full-Time Instruction',
        description: 'The completed degree must have involved at least two full years of full-time academic instruction taught in English.',
        isMandatory: true,
      },
      {
        conditionType: 'MEDIUM_EVALUATION',
        title: '100% English Instruction & Examination',
        description: 'Both course delivery and all formal assessments must have been conducted in English.',
        isMandatory: true,
      },
      {
        conditionType: 'TRANSCRIPT_NOTATION',
        title: 'Registrar Letter or Transcript Annotation',
        description: 'Official confirmation must be provided directly on the final transcript or via an official signed Registrar letter.',
        isMandatory: true,
      },
    ],
    exemptions: [
      {
        title: 'FGSR 2-Year English Degree Exemption',
        qualificationLevel: 'POSTGRADUATE_TAUGHT',
        exemptionCategory: 'MOI_DEGREE',
        description: 'Full exemption from TOEFL/IELTS for graduates of recognized 2+ year English-taught postsecondary programmes.',
        requirements: 'Minimum 2 years full-time, accredited institution, explicit official confirmation of English medium.',
        officialPolicyUrl: 'https://www.ualberta.ca/en/graduate-studies/admissions-programs/apply/graduate-studies-application-faqs.html',
      },
    ],
  },

  // 3. UNIVERSITY OF OTTAWA (Canada)
  {
    universitySlug: 'university-of-ottawa',
    universityName: 'University of Ottawa',
    country: 'Canada',
    qualificationLevel: 'POSTGRADUATE_TAUGHT',
    departmentName: 'Faculty of Graduate and Postdoctoral Studies & Faculty of Medicine',
    acceptanceStatus: 'ACCEPTED_FOR_SPECIFIED_COURSES',
    scope: 'ADMISSION_ONLY',
    eligibleInstitutions: 'Recognized degree-granting institutions with certified English instruction',
    eligibleCountries: 'Recognized international universities in designated English-medium regions',
    minDegreeDurationYears: 2.0,
    graduationValidityYears: 3,
    requiredCertificateWording: 'Official academic transcript with an explicit note from the awarding university stating that the language of instruction and examination was English, or an official institutional letter from the Registrar confirming English medium.',
    transcriptsRequired: true,
    separateTestRequired: 'CONDITIONAL',
    visaSeparateRequirementNote: 'IMPORTANT: University of Ottawa academic language waiver applies to university admission only. IRCC visa officers retain independent discretion to request language proof during Canadian study permit processing.',
    applicableIntakes: 'Fall 2026, Winter 2027',
    officialPolicyUrl: 'https://www.uottawa.ca/faculty-medicine/graduate-postdoctoral/admissions-overview/language-requirements',
    sourceExcerpt: 'Applicants who have completed within the last three years a postsecondary degree of at least two consecutive years full-time at an institution where English is the language of instruction and examination are exempt.',
    reviewerNotes: 'Verified uOttawa Graduate language exemptions. Note the 3-year recency restriction: degrees older than 3 years generally do not qualify for the exemption.',
    conditions: [
      {
        conditionType: 'DEGREE_DURATION',
        title: 'Minimum 2 Consecutive Years Full-Time',
        description: 'Degree must represent at least two consecutive years of full-time study in an English-instruction institution.',
        isMandatory: true,
      },
      {
        conditionType: 'GRADUATION_RECENCY',
        title: 'Completed Within the Last 3 Years',
        description: 'The degree must have been completed within the three years immediately preceding admission.',
        isMandatory: true,
      },
      {
        conditionType: 'TRANSCRIPT_NOTATION',
        title: 'Transcript Proof or Official Letter',
        description: 'Transcript must confirm English instruction or be accompanied by a formal Registrar letter.',
        isMandatory: true,
      },
    ],
    exemptions: [
      {
        title: '3-Year Recency Consecutive Degree Exemption',
        qualificationLevel: 'POSTGRADUATE_TAUGHT',
        exemptionCategory: 'MOI_DEGREE',
        description: 'Language proficiency exemption for applicants with a degree completed within 3 years taught in English.',
        requirements: '2 consecutive years full-time study, graduated <= 3 years ago, official transcript confirmation.',
        officialPolicyUrl: 'https://www.uottawa.ca/faculty-medicine/graduate-postdoctoral/admissions-overview/language-requirements',
      },
    ],
  },

  // 4. MCGILL UNIVERSITY (Canada)
  {
    universitySlug: 'mcgill-university',
    universityName: 'McGill University',
    country: 'Canada',
    qualificationLevel: 'POSTGRADUATE_TAUGHT',
    departmentName: 'Graduate and Postdoctoral Studies (GPS)',
    acceptanceStatus: 'ACCEPTED_WITH_CONDITIONS',
    scope: 'ADMISSION_ONLY',
    eligibleInstitutions: 'Accredited postsecondary institutions with officially documented English medium of instruction',
    eligibleCountries: 'Recognized international institutions and recognized native English-speaking jurisdictions',
    minDegreeDurationYears: 2.0,
    graduationValidityYears: 5,
    requiredCertificateWording: 'Official statement from the institution\'s Registrar\'s Office or notation on official transcript verifying that the medium of instruction was English throughout the degree.',
    transcriptsRequired: true,
    separateTestRequired: 'DEPENDS_ON_COURSE',
    visaSeparateRequirementNote: 'IMPORTANT: McGill exemption does NOT guarantee immigration approval. Québec CAQ (Certificat d\'acceptation du Québec) and federal study permit officers assess applications independently.',
    applicableIntakes: 'Fall 2026, Winter 2027',
    officialPolicyUrl: 'https://www.mcgill.ca/gradapplicants/how-apply/you-apply-mcgill/proficiency',
    sourceExcerpt: 'Applicants who have completed a recognized university degree (minimum 2 consecutive years of full-time study) at an accredited institution where English is the language of instruction are exempt. McGill reserves the right to require a test score even if an applicant appears eligible.',
    reviewerNotes: 'Verified via McGill GPS Admissions. Note that individual departments reserve the right to request a formal test regardless of an applicant meeting general exemption criteria.',
    conditions: [
      {
        conditionType: 'DEGREE_DURATION',
        title: 'Minimum 2 Consecutive Years Full-Time',
        description: 'The degree must comprise at least two consecutive years of full-time academic study taught entirely in English.',
        isMandatory: true,
      },
      {
        conditionType: 'MEDIUM_EVALUATION',
        title: 'Departmental Discretionary Review',
        description: 'Academic departments reserve the authority to request a formal TOEFL/IELTS test score upon reviewing dossier.',
        isMandatory: false,
      },
      {
        conditionType: 'TRANSCRIPT_NOTATION',
        title: 'Registrar Verification Letter',
        description: 'Official confirmation must be provided by the university Registrar or stated directly on the official transcript.',
        isMandatory: true,
      },
    ],
    exemptions: [
      {
        title: 'McGill GPS 2-Year English-Medium Degree Exemption',
        qualificationLevel: 'POSTGRADUATE_TAUGHT',
        exemptionCategory: 'MOI_DEGREE',
        description: 'Exemption for graduates holding a 2+ year degree from an accredited English-medium institution.',
        requirements: 'Minimum 2 consecutive full-time years, registrar letter, subject to departmental final approval.',
        officialPolicyUrl: 'https://www.mcgill.ca/gradapplicants/how-apply/you-apply-mcgill/proficiency',
      },
    ],
  },

  // 5. MAYNOOTH UNIVERSITY (Ireland)
  {
    universitySlug: 'maynooth-university',
    universityName: 'Maynooth University',
    country: 'Ireland',
    qualificationLevel: 'POSTGRADUATE_TAUGHT',
    departmentName: 'International Admissions & Graduate Studies',
    acceptanceStatus: 'ACCEPTED_WITH_CONDITIONS',
    scope: 'ADMISSION_ONLY',
    eligibleInstitutions: 'Accredited international universities where degree was delivered and examined in English',
    eligibleCountries: 'Recognized English-medium institutions worldwide',
    minDegreeDurationYears: 3.0,
    graduationValidityYears: 2,
    requiredCertificateWording: 'Official letter from the awarding institution stating that the qualification was taught and examined completely in English, provided graduation was within the preceding 2 years.',
    transcriptsRequired: true,
    separateTestRequired: 'CONDITIONAL',
    visaSeparateRequirementNote: 'CRITICAL VISA WARNING: Irish Immigration Service Delivery (ISD) enforces strict, independent English-language rules. While Maynooth University may grant an academic waiver for offer letter purposes, visa-required nationals (including Bangladeshi citizens) must typically submit a valid IELTS or PTE score to the Irish Embassy/ISD for study visa approval, unless explicitly exempt under ISD policy.',
    applicableIntakes: 'Autumn 2026',
    officialPolicyUrl: 'https://www.maynoothuniversity.ie/study-maynooth/how-apply/english-language-requirements',
    sourceExcerpt: 'Applicants who have completed a full degree through English within the past 2 years from a recognized university may be considered for an academic waiver upon submission of an official Medium of Instruction certificate.',
    reviewerNotes: 'Verified via Maynooth English Language Requirements page. Essential to warn students about the Irish ISD visa requirement separation!',
    conditions: [
      {
        conditionType: 'DEGREE_DURATION',
        title: 'Full Undergraduate or Master Degree',
        description: 'Degree must represent a full degree course (minimum 3 years for Bachelor, or 1-2 years for Master).',
        isMandatory: true,
      },
      {
        conditionType: 'GRADUATION_RECENCY',
        title: 'Graduated Within 2 Years',
        description: 'The degree must have been completed within the past 2 calendar years.',
        isMandatory: true,
      },
      {
        conditionType: 'TRANSCRIPT_NOTATION',
        title: 'Official Medium of Instruction Certificate',
        description: 'Official letterhead statement from the awarding institution verifying complete English instruction and examination.',
        isMandatory: true,
      },
    ],
    exemptions: [
      {
        title: 'Maynooth Academic English Waiver',
        qualificationLevel: 'POSTGRADUATE_TAUGHT',
        exemptionCategory: 'MOI_DEGREE',
        description: 'Academic entry waiver for degree completed through English within 2 years.',
        requirements: 'Official MOI certificate, degree completed <= 2 years ago. Note: Does not waive Irish ISD visa rules.',
        officialPolicyUrl: 'https://www.maynoothuniversity.ie/study-maynooth/how-apply/english-language-requirements',
      },
    ],
  },

  // 6. UNIVERSITY OF OXFORD (United Kingdom - Explicit Rejection)
  {
    universitySlug: 'university-of-oxford',
    universityName: 'University of Oxford',
    country: 'United Kingdom',
    qualificationLevel: 'ALL',
    departmentName: 'Graduate Admissions',
    acceptanceStatus: 'NOT_ACCEPTED',
    scope: 'NEITHER',
    eligibleInstitutions: 'None from non-majority English-speaking countries',
    eligibleCountries: 'UKVI-designated majority English-speaking countries only (e.g. UK, USA, Canada, Australia, New Zealand, Ireland)',
    minDegreeDurationYears: 3.0,
    graduationValidityYears: 2,
    requiredCertificateWording: 'MOI letters are NOT accepted in lieu of a formal IELTS, TOEFL, or approved test score.',
    transcriptsRequired: true,
    separateTestRequired: 'SEPARATE_TEST_REQUIRED',
    visaSeparateRequirementNote: 'Oxford mandates a certified IELTS Academic, TOEFL iBT, or C1 Advanced test for all applicants whose previous degree was not taken in an exempt majority English-speaking nation. MOI letters from Bangladesh, India, Nigeria, or similar nations are strictly not accepted.',
    applicableIntakes: 'Michaelmas 2026',
    officialPolicyUrl: 'https://www.ox.ac.uk/admissions/graduate/applying-to-oxford/application-guide#content-tab--3',
    sourceExcerpt: 'An MOI certificate from an institution in a non-majority English-speaking country will NOT satisfy Oxford\'s English language requirements. Applicants must provide an approved test certificate.',
    reviewerNotes: 'Authoritative Oxford Graduate Admissions policy. Explicitly non-accepted.',
    conditions: [
      {
        conditionType: 'INSTITUTION_RECOGNITION',
        title: 'Majority English Country Degrees Only',
        description: 'Exemptions are strictly limited to degrees completed in UKVI-recognized majority English-speaking countries.',
        isMandatory: true,
      },
    ],
  },

  // 7. UNIVERSITY OF CAMBRIDGE (United Kingdom - Explicit Rejection)
  {
    universitySlug: 'university-of-cambridge',
    universityName: 'University of Cambridge',
    country: 'United Kingdom',
    qualificationLevel: 'ALL',
    departmentName: 'Postgraduate Admissions Office',
    acceptanceStatus: 'NOT_ACCEPTED',
    scope: 'NEITHER',
    eligibleInstitutions: 'None from non-majority English-speaking countries',
    eligibleCountries: 'Exempt majority English-speaking countries only',
    minDegreeDurationYears: 3.0,
    graduationValidityYears: 2,
    requiredCertificateWording: 'MOI letters are NOT accepted.',
    transcriptsRequired: true,
    separateTestRequired: 'SEPARATE_TEST_REQUIRED',
    visaSeparateRequirementNote: 'Cambridge requires IELTS Academic or TOEFL iBT test scores. Medium of Instruction letters from South Asian universities are not accepted as proof of English language competence.',
    applicableIntakes: 'Michaelmas 2026, Lent 2027',
    officialPolicyUrl: 'https://www.postgraduate.study.cam.ac.uk/international/competence-english',
    sourceExcerpt: 'If you are not a national of a majority English-speaking country, you must take an approved test (IELTS Academic or TOEFL iBT). We do not accept letters from universities certifying that courses were taught in English.',
    reviewerNotes: 'Verified via Cambridge Postgraduate Competence in English page.',
    conditions: [
      {
        conditionType: 'INSTITUTION_RECOGNITION',
        title: 'Approved Language Test Mandatory',
        description: 'A formal test certificate must be submitted. MOI letters are ineligible.',
        isMandatory: true,
      },
    ],
  },

  // 8. TECHNICAL UNIVERSITY OF MUNICH (TUM, Germany)
  {
    universitySlug: 'technical-university-of-munich',
    universityName: 'Technical University of Munich (TUM)',
    country: 'Germany',
    qualificationLevel: 'POSTGRADUATE_TAUGHT',
    departmentName: 'School of Computation, Information and Technology (CIT) & Specific Master Programs',
    acceptanceStatus: 'ACCEPTED_FOR_SPECIFIED_COURSES',
    scope: 'ADMISSION_ONLY',
    eligibleInstitutions: 'Recognized universities where degree was 100% taught in English',
    eligibleCountries: 'Worldwide accredited institutions',
    minDegreeDurationYears: 3.0,
    graduationValidityYears: 5,
    requiredCertificateWording: 'Official confirmation in the diploma supplement, transcript of records, or an official letter confirming that the degree program was taught entirely in English.',
    transcriptsRequired: true,
    separateTestRequired: 'DEPENDS_ON_COURSE',
    visaSeparateRequirementNote: 'German Student Visa: The German Embassy in Dhaka generally requires university admission proof. If TUM accepts the MOI letter and issues an unconditional or qualifying offer, the German embassy generally recognizes this for visa purposes, but may conduct a short consular interview in English.',
    applicableIntakes: 'Winter 2026/2027, Summer 2027',
    officialPolicyUrl: 'https://www.tum.de/en/studies/application/application-info-portal/language-certificates',
    sourceExcerpt: 'For specific English-language master\'s degree programs at TUM, proof that the language of instruction and examination of your bachelor\'s program was English is sufficient. Please check program-specific requirements.',
    reviewerNotes: 'Verified via TUM portal. Programs in CIT and Management have varying policies; some accept MOI while others mandate TOEFL/IELTS.',
    conditions: [
      {
        conditionType: 'MEDIUM_EVALUATION',
        title: 'Program-Specific Faculty Rules',
        description: 'Applicants must confirm their specific master program’s Academic and Examination Regulations (FPSO).',
        isMandatory: true,
      },
      {
        conditionType: 'TRANSCRIPT_NOTATION',
        title: 'Official Confirmation of English Medium',
        description: 'Proof required via diploma supplement or official university letter.',
        isMandatory: true,
      },
    ],
  },

  // 9. UNIVERSITY COLLEGE DUBLIN (UCD, Ireland)
  {
    universitySlug: 'university-college-dublin',
    universityName: 'University College Dublin (UCD)',
    country: 'Ireland',
    qualificationLevel: 'POSTGRADUATE_TAUGHT',
    departmentName: 'UCD Global Admissions',
    acceptanceStatus: 'ACCEPTED_WITH_CONDITIONS',
    scope: 'ADMISSION_ONLY',
    eligibleInstitutions: 'Accredited universities with verifiable full English instruction',
    eligibleCountries: 'Recognized international universities',
    minDegreeDurationYears: 3.0,
    graduationValidityYears: 2,
    requiredCertificateWording: 'Official certificate on university letterhead from the registrar certifying that the degree was completed in English within the previous two years.',
    transcriptsRequired: true,
    separateTestRequired: 'CONDITIONAL',
    visaSeparateRequirementNote: 'IMPORTANT: Irish Immigration Service Delivery (ISD) enforces separate visa requirements for visa-required nationals from Bangladesh. An academic waiver from UCD does not exempt applicants from submitting an approved English language test (e.g., IELTS or PTE) for Irish visa processing.',
    applicableIntakes: 'Autumn 2026',
    officialPolicyUrl: 'https://www.ucd.ie/registry/prospectivestudents/admissions/policiesandgeneralregulations/generalrequirements/minimumenglishlanguagerequirements/',
    sourceExcerpt: 'Degrees completed through English within two years of starting study may be considered for an academic waiver upon receipt of official institutional verification.',
    reviewerNotes: 'Verified via UCD Minimum English Language Requirements.',
    conditions: [
      {
        conditionType: 'GRADUATION_RECENCY',
        title: 'Completion within 2 Years',
        description: 'Degree must have been completed no more than 2 years prior to registration at UCD.',
        isMandatory: true,
      },
    ],
  },

  // 10. SOUTHERN ALBERTA INSTITUTE OF TECHNOLOGY (SAIT, Canada)
  {
    universitySlug: 'southern-alberta-institute-of-technology-sait',
    universityName: 'Southern Alberta Institute of Technology (SAIT)',
    country: 'Canada',
    qualificationLevel: 'UNDERGRADUATE',
    departmentName: 'International Admissions',
    acceptanceStatus: 'ACCEPTED_WITH_CONDITIONS',
    scope: 'ADMISSION_ONLY',
    eligibleInstitutions: 'Accredited post-secondary institutions or high schools with verified English instruction',
    eligibleCountries: 'International designated institutions',
    minDegreeDurationYears: 3.0,
    graduationValidityYears: 3,
    requiredCertificateWording: 'Official transcript indicating English medium or official institutional letter.',
    transcriptsRequired: true,
    separateTestRequired: 'CONDITIONAL',
    visaSeparateRequirementNote: 'Admission waiver does not guarantee Canadian visa issuance.',
    applicableIntakes: 'Fall 2026, Winter 2027',
    officialPolicyUrl: 'https://www.sait.ca/admissions/english-proficiency-requirements',
    sourceExcerpt: 'Applicants who have completed at least three consecutive years of full-time post-secondary education taught in English are exempt.',
    reviewerNotes: 'Verified SAIT International English proficiency policy.',
    conditions: [
      {
        conditionType: 'DEGREE_DURATION',
        title: '3 Consecutive Years Full-Time',
        description: 'Must demonstrate at least three consecutive years of full-time education in English.',
        isMandatory: true,
      },
    ],
  },
];
