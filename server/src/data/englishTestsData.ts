// Authoritative English Test Providers, Formats, and Bangladesh Fees Data
export interface SeedEnglishTestProvider {
  name: string;
  code: string;
  websiteUrl: string;
  countryOfOrigin: string;
  description: string;
}

export interface SeedEnglishTestFormat {
  providerCode: string;
  name: string;
  code: string;
  deliveryMode: 'TEST_CENTRE' | 'ONLINE' | 'BOTH';
  speakingFormat: 'FACE_TO_FACE' | 'AI_COMPUTER_RECORDED' | 'COMPUTER_RECORDED_HUMAN_SCORED';
  durationMinutes: number;
  scoreScale: string;
  scoreComponents: string[];
  scoringUpdateNotes: string;
  resultTurnaround: string;
  resultTurnaroundSource: string;
  validityYears: number;
  bookingUrl: string;
  preparationResourcesUrl: string;
  preparationSummary: string;
  acceptanceOverview: string;
  visaImmigrationRestrictions: string;
  fee: {
    country: string;
    currency: string;
    amount: number;
    currencyOriginal: string;
    amountOriginal: number;
    bdtEstimate?: number;
    exchangeRateUsed?: number;
    officialFeeSourceUrl: string;
    sourcePublicationDate?: string;
    verificationStatus: 'VERIFIED' | 'PENDING_REVIEW' | 'OUTDATED';
    availabilityNotes: string;
  };
}

export const ENGLISH_TEST_PROVIDERS: SeedEnglishTestProvider[] = [
  {
    name: 'IELTS (British Council & IDP)',
    code: 'IELTS',
    websiteUrl: 'https://www.ielts.org',
    countryOfOrigin: 'United Kingdom / Australia',
    description: 'International English Language Testing System, jointly managed by the British Council, IDP: IELTS Australia, and Cambridge Assessment English.',
  },
  {
    name: 'Pearson PTE',
    code: 'PTE',
    websiteUrl: 'https://www.pearsonpte.com',
    countryOfOrigin: 'United Kingdom',
    description: 'Pearson Test of English Academic, computer-based English language test trusted by universities, colleges, and governments around the world.',
  },
  {
    name: 'ETS TOEFL',
    code: 'TOEFL',
    websiteUrl: 'https://www.ets.org/toefl.html',
    countryOfOrigin: 'United States',
    description: 'Test of English as a Foreign Language, developed by Educational Testing Service (ETS) and widely accepted across the United States, UK, Canada, and Australia.',
  },
];

export const ENGLISH_TEST_FORMATS: SeedEnglishTestFormat[] = [
  {
    providerCode: 'IELTS',
    name: 'IELTS Academic',
    code: 'IELTS_ACADEMIC',
    deliveryMode: 'TEST_CENTRE',
    speakingFormat: 'FACE_TO_FACE',
    durationMinutes: 165,
    scoreScale: '0 - 9.0 Band Scale (in 0.5 increments)',
    scoreComponents: ['Listening', 'Reading', 'Writing', 'Speaking'],
    scoringUpdateNotes: 'IELTS One Skill Retake (OSR) is available in Bangladesh at selected test centres, permitting candidates to retake any single sub-skill within 60 days of the primary exam. Check individual university acceptance for OSR scores.',
    resultTurnaround: 'Computer: 1–5 days; Paper: 13 days',
    resultTurnaroundSource: 'British Council & IDP Official Delivery Guidelines',
    validityYears: 2,
    bookingUrl: 'https://ielts.idp.com/bangladesh/about/ielts-test-dates-fees-locations',
    preparationResourcesUrl: 'https://takeielts.britishcouncil.org/take-ielts/prepare',
    preparationSummary: 'Official Road to IELTS interactive course, British Council online practice test suite, official Cambridge IELTS Practice Examination books 1–19, and IDP IELTS Prepare app.',
    acceptanceOverview: 'Recognized by 12,000+ higher education institutions and organizations worldwide, including 100% of UK, Australian, and New Zealand universities, and over 3,400 universities in the USA.',
    visaImmigrationRestrictions: 'Approved for UK Student Visa sponsorship when applying for degree-level courses or higher at a Higher Education Provider (HEP). For courses below degree level (e.g. Foundation, Pre-sessional), IELTS for UKVI is required by the UK Home Office.',
    fee: {
      country: 'Bangladesh',
      currency: 'BDT',
      amount: 26500,
      currencyOriginal: 'BDT',
      amountOriginal: 26500,
      bdtEstimate: 26500,
      exchangeRateUsed: 1.0,
      officialFeeSourceUrl: 'https://www.britishcouncil.org.bd/en/exam/ielts/dates-fees-locations',
      sourcePublicationDate: '2026-01-15',
      verificationStatus: 'VERIFIED',
      availabilityNotes: 'Uniform fee applicable across all British Council and IDP test centres in Dhaka, Chittagong, Sylhet, and Khulna for both Computer-delivered and Paper-based Academic exams.',
    },
  },
  {
    providerCode: 'IELTS',
    name: 'IELTS for UKVI Academic',
    code: 'IELTS_UKVI_ACADEMIC',
    deliveryMode: 'TEST_CENTRE',
    speakingFormat: 'FACE_TO_FACE',
    durationMinutes: 165,
    scoreScale: '0 - 9.0 Band Scale (in 0.5 increments)',
    scoreComponents: ['Listening', 'Reading', 'Writing', 'Speaking'],
    scoringUpdateNotes: 'Same content, format, scoring, and difficulty level as standard IELTS Academic. Exam sessions take place in UK Home Office approved test centres equipped with advanced identity verification and video recording.',
    resultTurnaround: 'Computer: 1–5 days; Paper: 13 days',
    resultTurnaroundSource: 'UK Visas and Immigration (UKVI) & British Council Guidelines',
    validityYears: 2,
    bookingUrl: 'https://www.britishcouncil.org.bd/en/exam/ielts/dates-fees-locations',
    preparationResourcesUrl: 'https://takeielts.britishcouncil.org/take-ielts/prepare',
    preparationSummary: 'All standard IELTS preparation materials apply directly. Candidates receive a Test Report Form (TRF) with a UKVI SELT Unique Reference Number (URN).',
    acceptanceOverview: '100% accepted across all UK universities, colleges, and visa routes. Universally recognized globally by non-UK institutions exactly like standard IELTS Academic.',
    visaImmigrationRestrictions: 'Mandatory Secure English Language Test (SELT) for UK visa applications for courses below degree level (International Foundation Programme, Pre-sessional English, International Year One, Diploma). Also universally accepted for degree-level study.',
    fee: {
      country: 'Bangladesh',
      currency: 'BDT',
      amount: 27800,
      currencyOriginal: 'BDT',
      amountOriginal: 27800,
      bdtEstimate: 27800,
      exchangeRateUsed: 1.0,
      officialFeeSourceUrl: 'https://www.britishcouncil.org.bd/en/exam/ielts/dates-fees-locations',
      sourcePublicationDate: '2026-01-15',
      verificationStatus: 'VERIFIED',
      availabilityNotes: 'Includes UK Home Office surveillance and SELT data processing surcharge. Available at authorized British Council and IDP SELT centres in Dhaka and Sylhet.',
    },
  },
  {
    providerCode: 'PTE',
    name: 'PTE Academic',
    code: 'PTE_ACADEMIC',
    deliveryMode: 'TEST_CENTRE',
    speakingFormat: 'AI_COMPUTER_RECORDED',
    durationMinutes: 120,
    scoreScale: '10 - 90 Global Scale of English (1-point increments)',
    scoreComponents: ['Listening', 'Reading', 'Writing', 'Speaking'],
    scoringUpdateNotes: 'Automated 100% AI dual-scoring system assessing communicative skills and enabling objective, unbiased results without human examiner variability. Completed in a single 2-hour sitting.',
    resultTurnaround: 'Typically within 48 hours (frequently under 24–36 hours)',
    resultTurnaroundSource: 'Pearson PTE Official Turnaround Benchmark',
    validityYears: 2,
    bookingUrl: 'https://www.pearsonpte.com/',
    preparationResourcesUrl: 'https://www.pearsonpte.com/preparation',
    preparationSummary: 'Official PTE Academic Scored Practice Tests (Mock Tests A, B, C, D, E), Pearson Official Practice App, Pearson Question Bank with 300+ authentic questions.',
    acceptanceOverview: 'Accepted by 99% of UK universities (including Oxford, Cambridge, and all Russell Group members), 100% of Australian and New Zealand universities, and over 1,500 institutions in the USA and Canada.',
    visaImmigrationRestrictions: 'Accepted for UK Student Visa for degree level and above. Approved by the Australian Department of Home Affairs for all visa subclasses, and accepted for Canada Student Direct Stream (SDS).',
    fee: {
      country: 'Bangladesh',
      currency: 'USD',
      amount: 215,
      currencyOriginal: 'USD',
      amountOriginal: 215,
      bdtEstimate: 26230,
      exchangeRateUsed: 122.0,
      officialFeeSourceUrl: 'https://www.pearsonpte.com/',
      sourcePublicationDate: '2026-01-10',
      verificationStatus: 'VERIFIED',
      availabilityNotes: 'Fee quoted in USD by Pearson VUE for Bangladesh test centres. Payable via dual-currency credit/debit card. BDT 26,230 estimate based on official Bangladesh Bank baseline rate of 1 USD = 122 BDT.',
    },
  },
  {
    providerCode: 'PTE',
    name: 'PTE Academic Online',
    code: 'PTE_ACADEMIC_ONLINE',
    deliveryMode: 'ONLINE',
    speakingFormat: 'AI_COMPUTER_RECORDED',
    durationMinutes: 120,
    scoreScale: '10 - 90 Global Scale of English',
    scoreComponents: ['Listening', 'Reading', 'Writing', 'Speaking'],
    scoringUpdateNotes: 'Identical test questions, format, and scoring system as in-person PTE Academic, taken from home via Pearson OnVUE remote proctoring.',
    resultTurnaround: 'Typically within 48 hours',
    resultTurnaroundSource: 'Pearson OnVUE Remote Candidate Portal',
    validityYears: 2,
    bookingUrl: 'https://www.pearsonpte.com/pte-academic-online',
    preparationResourcesUrl: 'https://www.pearsonpte.com/preparation',
    preparationSummary: 'Same preparation materials as PTE Academic. Candidates must complete a system test on their personal computer prior to exam day.',
    acceptanceOverview: 'Accepted by a selective subset of universities worldwide for academic admissions assessment. Rejected by top UK research universities (Oxford, Cambridge, Imperial) and many US institutions.',
    visaImmigrationRestrictions: 'CRITICAL WARNING: PTE Academic Online is NOT approved for visa or immigration purposes by UKVI, Australian Department of Home Affairs, or Immigration, Refugees and Citizenship Canada (IRCC). Do not take for visa-sponsored study.',
    fee: {
      country: 'Bangladesh',
      currency: 'USD',
      amount: 215,
      currencyOriginal: 'USD',
      amountOriginal: 215,
      bdtEstimate: 26230,
      exchangeRateUsed: 122.0,
      officialFeeSourceUrl: 'https://www.pearsonpte.com/pte-academic-online',
      sourcePublicationDate: '2026-01-10',
      verificationStatus: 'VERIFIED',
      availabilityNotes: 'Same base USD price as in-person PTE Academic. Requires stable high-speed broadband, private room, and external webcam.',
    },
  },
  {
    providerCode: 'PTE',
    name: 'PTE Academic UKVI',
    code: 'PTE_UKVI',
    deliveryMode: 'TEST_CENTRE',
    speakingFormat: 'AI_COMPUTER_RECORDED',
    durationMinutes: 120,
    scoreScale: '10 - 90 Global Scale of English',
    scoreComponents: ['Listening', 'Reading', 'Writing', 'Speaking'],
    scoringUpdateNotes: 'Approved Secure English Language Test (SELT) with biometric capture and unique SELT URN number generation for UK Visas and Immigration.',
    resultTurnaround: 'Typically within 48 hours',
    resultTurnaroundSource: 'Pearson PTE UKVI Guidance',
    validityYears: 2,
    bookingUrl: 'https://www.pearsonpte.com/who-accepts-pte/uk-visas-immigration',
    preparationResourcesUrl: 'https://www.pearsonpte.com/preparation',
    preparationSummary: 'Identical preparation materials as PTE Academic. Practice tests mirror exact timing and question types.',
    acceptanceOverview: 'Universally accepted by all UK institutions and valid across all UK visa tiers, from below-degree foundation programmes to doctorate studies.',
    visaImmigrationRestrictions: 'Officially recognized UKVI SELT test. Candidates receive a SELT URN which must be entered directly on the UK government visa application form.',
    fee: {
      country: 'Bangladesh',
      currency: 'USD',
      amount: 215,
      currencyOriginal: 'USD',
      amountOriginal: 215,
      bdtEstimate: 26230,
      exchangeRateUsed: 122.0,
      officialFeeSourceUrl: 'https://www.pearsonpte.com/who-accepts-pte/uk-visas-immigration',
      sourcePublicationDate: '2026-01-10',
      verificationStatus: 'VERIFIED',
      availabilityNotes: 'Available at Pearson Professional Centers and authorized partner centres in Dhaka.',
    },
  },
  {
    providerCode: 'TOEFL',
    name: 'TOEFL iBT (Test Centre)',
    code: 'TOEFL_IBT',
    deliveryMode: 'TEST_CENTRE',
    speakingFormat: 'COMPUTER_RECORDED_HUMAN_SCORED',
    durationMinutes: 116,
    scoreScale: '0 - 120 Total Score (0–30 per section)',
    scoreComponents: ['Listening', 'Reading', 'Writing', 'Speaking'],
    scoringUpdateNotes: 'Enhanced 2-hour shorter test format introduced globally in July 2023. Includes new Writing for an Academic Discussion task. Free test-taker features include MyBest® scores and instant unofficial Reading and Listening scores upon completion.',
    resultTurnaround: '4 to 8 days',
    resultTurnaroundSource: 'ETS Official Score Reporting Schedule',
    validityYears: 2,
    bookingUrl: 'https://www.ets.org/toefl.html',
    preparationResourcesUrl: 'https://www.ets.org/toefl/test-takers/ibt/prepare.html',
    preparationSummary: 'TOEFL TestReady AI-powered personalized study portal, Official TOEFL iBT Practice Tests, TOEFL Go! mobile app, and free full-length practice tests.',
    acceptanceOverview: 'Accepted by 12,500+ universities across 160+ countries, including 100% of Russell Group universities in the UK, 100% of US colleges, and leading Canadian and European institutions.',
    visaImmigrationRestrictions: 'Accepted for UK Student Visa for degree-level courses under Higher Education Provider CAS assessment. Accepted by Australian Department of Home Affairs for visa applications (tests taken from May 5, 2024 onward accepted).',
    fee: {
      country: 'Bangladesh',
      currency: 'USD',
      amount: 205,
      currencyOriginal: 'USD',
      amountOriginal: 205,
      bdtEstimate: 25010,
      exchangeRateUsed: 122.0,
      officialFeeSourceUrl: 'https://www.ets.org/toefl.html',
      sourcePublicationDate: '2026-01-12',
      verificationStatus: 'VERIFIED',
      availabilityNotes: 'Published official fee by ETS for Bangladesh test centre registrations. Converted at 1 USD = 122 BDT (~BDT 25,010). Local bank foreign transaction charges may apply.',
    },
  },
  {
    providerCode: 'TOEFL',
    name: 'TOEFL iBT Home Edition',
    code: 'TOEFL_HOME_EDITION',
    deliveryMode: 'ONLINE',
    speakingFormat: 'COMPUTER_RECORDED_HUMAN_SCORED',
    durationMinutes: 116,
    scoreScale: '0 - 120 Total Score (0–30 per section)',
    scoreComponents: ['Listening', 'Reading', 'Writing', 'Speaking'],
    scoringUpdateNotes: 'Identical exam content, timing, and scoring system as test-centre TOEFL iBT, monitored by live human proctor via ProctorU and artificial intelligence.',
    resultTurnaround: '4 to 8 days',
    resultTurnaroundSource: 'ETS Home Edition Bulletin',
    validityYears: 2,
    bookingUrl: 'https://www.ets.org/toefl/test-takers/ibt/about/home-edition.html',
    preparationResourcesUrl: 'https://www.ets.org/toefl/test-takers/ibt/prepare.html',
    preparationSummary: 'Same preparation materials as test-centre TOEFL iBT. Candidates must review technical equipment requirements (microphone, speaker, movable webcam).',
    acceptanceOverview: 'Accepted by thousands of universities in North America and select European universities. Explicitly rejected or restricted by top UK institutions (including Oxford, Cambridge, Imperial).',
    visaImmigrationRestrictions: 'CRITICAL RESTRICTION: Not approved as a Secure English Language Test (SELT) by the UK Home Office. Many universities will not issue a CAS or visa sponsorship based on the Home Edition. Verify with individual university admissions.',
    fee: {
      country: 'Bangladesh',
      currency: 'USD',
      amount: 205,
      currencyOriginal: 'USD',
      amountOriginal: 205,
      bdtEstimate: 25010,
      exchangeRateUsed: 122.0,
      officialFeeSourceUrl: 'https://www.ets.org/toefl/test-takers/ibt/about/home-edition.html',
      sourcePublicationDate: '2026-01-12',
      verificationStatus: 'VERIFIED',
      availabilityNotes: 'Uniform global price of USD 205. BDT 25,010 estimate at 1 USD = 122 BDT.',
    },
  },
];
