import { EnglishCoachingCenter, PracticeResource } from '../types/index.js';

export const ENGLISH_COACHING_CENTERS: EnglishCoachingCenter[] = [
  // ==================== DHAKA ====================
  {
    id: "prep-mentors-kalabagan",
    name: "Mentors' Education (Kalabagan Central)",
    slug: "mentors-education-dhaka",
    logoUrl: "/logos/prep/mentors.svg",
    division: "Dhaka",
    district: "Dhaka",
    city: "Dhaka",
    area: "Kalabagan / Dhanmondi",
    address: "166/1 Mirpur Road, Kalabagan (Beside Dolphin Goli), Dhaka-1205",
    testsOffered: ["IELTS", "TOEFL", "PTE", "SPOKEN_ENGLISH"],
    modes: ["OFFLINE", "ONLINE", "HYBRID"],
    courseDuration: "2.5 to 3 Months (32 Classes + Unlimited Lab)",
    feeRange: "BDT 14,500 - 18,500 (Varies by regular/executive batch)",
    feeAmountBdt: 16500,
    features: [
      "Official IDP & British Council authorized registration partner",
      "Full-length computer-delivered & paper-based mock tests",
      "1-on-1 interview practice sessions with certified trainers",
      "Extensive Cambridge IELTS writing task assessment",
      "Dedicated listening multimedia audio lab",
      "Free repeat class opportunity if target band not reached"
    ],
    contactPhone: "+880 1713-243400",
    contactEmail: "info@mentors.com.bd",
    websiteUrl: "https://www.mentors.com.bd",
    facebookUrl: "https://facebook.com/mentorseducation",
    rating: 4.6,
    reviewCount: 3120,
    studentReviewSnippet: "Structured Cambridge-based modules and constructive feedback on Writing Task 2 helped me reach band 7.5.",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2025-02-15"
  },
  {
    id: "prep-futureed-banani",
    name: "FutureEd English Language Centre",
    slug: "futureed-banani-dhaka",
    logoUrl: "/logos/prep/futureed.svg",
    division: "Dhaka",
    district: "Dhaka",
    city: "Dhaka",
    area: "Banani",
    address: "Ahmed Tower (6th Floor), 28 Kemal Ataturk Avenue, Banani, Dhaka-1213",
    testsOffered: ["IELTS", "PTE", "TOEFL"],
    modes: ["OFFLINE", "ONLINE", "HYBRID"],
    courseDuration: "2 Months (24 Intense Classes + 10 Mock Tests)",
    feeRange: "BDT 15,000 - 20,000",
    feeAmountBdt: 17500,
    features: [
      "Official British Council IELTS & Aptis authorized test venue",
      "Pearson PTE Academic official preparation & mock lab",
      "Certified CELTA / British Council trained native-standard faculty",
      "Acoustic exam simulation rooms replicating test day conditions",
      "Unlimited diagnostic mock exams before official test date"
    ],
    contactPhone: "+880 1783-605630",
    contactEmail: "info@futureed.com.bd",
    websiteUrl: "https://www.futureed.com.bd",
    facebookUrl: "https://facebook.com/futureed",
    rating: 4.8,
    reviewCount: 1840,
    studentReviewSnippet: "The fact that classes and official tests happen in the exact same facility gives immense exam-day confidence.",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2025-02-14"
  },
  {
    id: "prep-saifurs-panthapath",
    name: "Saifur's (Panthapath Head Office)",
    slug: "saifurs-panthapath-dhaka",
    logoUrl: "/logos/prep/saifurs.svg",
    division: "Dhaka",
    district: "Dhaka",
    city: "Dhaka",
    area: "Panthapath / Green Road",
    address: "69/B Green Road, Panthapath Signal, Dhaka-1205",
    testsOffered: ["IELTS", "SPOKEN_ENGLISH"],
    modes: ["OFFLINE", "ONLINE"],
    courseDuration: "3 Months (36 Classes + Grammar Booster)",
    feeRange: "BDT 11,000 - 15,000",
    feeAmountBdt: 12500,
    features: [
      "Signature bilingual vocabulary building and sentence-formation system",
      "Special beginner-friendly module for students with weak English foundations",
      "Regular weekend mock tests with answer paper breakdown",
      "Spoken English fluency and accent neutralisation drills",
      "Over 40 branches across Bangladesh for convenient branch transfer"
    ],
    contactPhone: "+880 1613-432001",
    contactEmail: "support@saifurs.com",
    websiteUrl: "https://www.saifurs.com",
    facebookUrl: "https://facebook.com/saifursgroup",
    rating: 4.4,
    reviewCount: 4200,
    studentReviewSnippet: "Ideal for anyone who needs to strengthen basic grammar and vocabulary before jumping straight into IELTS band techniques.",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2025-02-12"
  },
  {
    id: "prep-pie-dhanmondi",
    name: "PIE Education (Professional Institute of English)",
    slug: "pie-education-dhanmondi-dhaka",
    logoUrl: "/logos/prep/pie.svg",
    division: "Dhaka",
    district: "Dhaka",
    city: "Dhaka",
    area: "Dhanmondi",
    address: "House 25, Road 11 (Old 32), Dhanmondi R/A, Dhaka-1209",
    testsOffered: ["IELTS", "TOEFL", "PTE"],
    modes: ["OFFLINE", "ONLINE", "HYBRID"],
    courseDuration: "2.5 Months (30 Classes + Diagnostic Tests)",
    feeRange: "BDT 13,000 - 17,000",
    feeAmountBdt: 15000,
    features: [
      "Small batch sizes (maximum 15 students per cohort)",
      "Intensive 1-on-1 IELTS Speaking interviews recorded with feedback",
      "Grammar and academic vocabulary clinic",
      "Writing task 1 & 2 evaluation within 24 hours",
      "Official IDP IELTS registration center"
    ],
    contactPhone: "+880 1711-884433",
    contactEmail: "info@pie-edu.com",
    websiteUrl: "https://pie-edu.com",
    facebookUrl: "https://facebook.com/pieeducation",
    rating: 4.7,
    reviewCount: 1450,
    studentReviewSnippet: "Their small batch size made sure my speaking hesitation was actively addressed in every single class.",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2025-02-10"
  },
  {
    id: "prep-caps-uttara",
    name: "Cap's Education (Uttara Branch)",
    slug: "caps-education-uttara-dhaka",
    logoUrl: "/logos/prep/caps.svg",
    division: "Dhaka",
    district: "Dhaka",
    city: "Dhaka",
    area: "Uttara",
    address: "House 18, Road 1/A, Sector 9, Uttara, Dhaka-1230",
    testsOffered: ["IELTS", "PTE", "SPOKEN_ENGLISH"],
    modes: ["OFFLINE", "ONLINE"],
    courseDuration: "2 Months (24 Classes + 8 Mock Tests)",
    feeRange: "BDT 12,000 - 16,000",
    feeAmountBdt: 13500,
    features: [
      "Dedicated Pearson PTE Academic computerized scoring lab",
      "Free Cambridge IELTS practice books and audio material",
      "Personalized band score improvement roadmap",
      "Evening and Friday-Saturday executive batches for working professionals"
    ],
    contactPhone: "+880 1977-889900",
    contactEmail: "uttara@capsedu.com",
    websiteUrl: "https://capsedu.com",
    facebookUrl: "https://facebook.com/capseducation",
    rating: 4.5,
    reviewCount: 980,
    studentReviewSnippet: "The PTE software and microphone practice mirrors the actual Pearson test center experience perfectly.",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2025-02-08"
  },
  {
    id: "prep-wings-dhanmondi",
    name: "Wings Learning Centre",
    slug: "wings-learning-centre-dhaka",
    logoUrl: "/logos/prep/wings.svg",
    division: "Dhaka",
    district: "Dhaka",
    city: "Dhaka",
    area: "Dhanmondi",
    address: "House 55, Road 4/A, Dhanmondi, Dhaka-1209",
    testsOffered: ["IELTS", "TOEFL", "SPOKEN_ENGLISH"],
    modes: ["OFFLINE", "HYBRID"],
    courseDuration: "3 Months (36 Classes + 12 Mock Tests)",
    feeRange: "BDT 16,000 - 22,000",
    feeAmountBdt: 18000,
    features: [
      "Long-standing official British Council IELTS testing partner",
      "State-of-the-art digital listening headsets for examination practice",
      "CELTA-qualified teachers with 10+ years of training track record",
      "Comprehensive library with Cambridge past examination papers (Volumes 1-19)"
    ],
    contactPhone: "+880 1877-700900",
    contactEmail: "info@wings.com.bd",
    websiteUrl: "https://wings.com.bd",
    facebookUrl: "https://facebook.com/wingslearningcentre",
    rating: 4.8,
    reviewCount: 2200,
    studentReviewSnippet: "Taking mock tests in an actual test venue made real test day completely stress-free.",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2025-02-11"
  },

  // ==================== CHATTOGRAM ====================
  {
    id: "prep-mentors-chattogram",
    name: "Mentors' Education (Chattogram GEC)",
    slug: "mentors-education-chattogram",
    logoUrl: "/logos/prep/mentors.svg",
    division: "Chattogram",
    district: "Chattogram",
    city: "Chattogram",
    area: "GEC Circle",
    address: "Equity Central (4th Floor), 1621 CDA Avenue, GEC Circle, Chattogram-4000",
    testsOffered: ["IELTS", "PTE", "TOEFL", "SPOKEN_ENGLISH"],
    modes: ["OFFLINE", "ONLINE", "HYBRID"],
    courseDuration: "2.5 to 3 Months (32 Classes)",
    feeRange: "BDT 14,000 - 18,000",
    feeAmountBdt: 15500,
    features: [
      "Official IDP & British Council IELTS registration point in Chattogram",
      "Regular Friday full mock tests with analytical band score report",
      "One-on-one speaking slots with experienced mentors",
      "Multimedia audio room for computer-delivered IELTS & PTE"
    ],
    contactPhone: "+880 1713-243416",
    contactEmail: "ctg@mentors.com.bd",
    websiteUrl: "https://www.mentors.com.bd",
    facebookUrl: "https://facebook.com/mentorsctg",
    rating: 4.7,
    reviewCount: 1650,
    studentReviewSnippet: "Top choice in Chattogram for serious study abroad aspirants aiming for 7+ bands.",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2025-02-14"
  },
  {
    id: "prep-stjohns-chattogram",
    name: "St. John's Tutorial & Language Center",
    slug: "st-johns-tutorial-chattogram",
    logoUrl: "/logos/prep/stjohns.svg",
    division: "Chattogram",
    district: "Chattogram",
    city: "Chattogram",
    area: "Nasirabad",
    address: "24 Nasirabad Housing Society, Road 2, Chattogram-4255",
    testsOffered: ["IELTS", "SPOKEN_ENGLISH"],
    modes: ["OFFLINE"],
    courseDuration: "2 Months (24 Classes + 6 Mock Tests)",
    feeRange: "BDT 10,000 - 14,000",
    feeAmountBdt: 12000,
    features: [
      "Renowned faculty with specialized English literature & linguistics pedigree",
      "Extensive individual writing feedback with detailed error codes",
      "Spoken fluency building in a friendly classroom setting"
    ],
    contactPhone: "+880 1819-312244",
    contactEmail: "stjohns.ctg@gmail.com",
    websiteUrl: "https://stjohns-ctg.com",
    facebookUrl: "https://facebook.com/stjohnsctg",
    rating: 4.5,
    reviewCount: 890,
    studentReviewSnippet: "Great for writing feedback; the teachers meticulously review every paragraph you produce.",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2025-02-09"
  },

  // ==================== SYLHET ====================
  {
    id: "prep-mentors-sylhet",
    name: "Mentors' Education (Sylhet Zindabazar)",
    slug: "mentors-education-sylhet",
    logoUrl: "/logos/prep/mentors.svg",
    division: "Sylhet",
    district: "Sylhet",
    city: "Sylhet",
    area: "Zindabazar",
    address: "Al-Hamra Shopping City (7th Floor), Zindabazar, Sylhet-3100",
    testsOffered: ["IELTS", "PTE", "SPOKEN_ENGLISH"],
    modes: ["OFFLINE", "ONLINE", "HYBRID"],
    courseDuration: "2.5 to 3 Months (32 Classes)",
    feeRange: "BDT 13,500 - 17,500",
    feeAmountBdt: 15000,
    features: [
      "High success rate for UK, Canada & Sweden student visa applicants",
      "Official IDP IELTS test booking counter on premises",
      "Weekly diagnostic mock tests matching real exam difficulty",
      "Spoken English fluency labs and accent correction"
    ],
    contactPhone: "+880 1713-243419",
    contactEmail: "sylhet@mentors.com.bd",
    websiteUrl: "https://www.mentors.com.bd",
    facebookUrl: "https://facebook.com/mentorssylhet",
    rating: 4.7,
    reviewCount: 2100,
    studentReviewSnippet: "The mock test analysis helped me identify that my listening subscore was dropping on map labelling tasks.",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2025-02-13"
  },
  {
    id: "prep-sic-sylhet",
    name: "Sylhet IELTS Centre (SIC)",
    slug: "sylhet-ielts-centre",
    logoUrl: "/logos/prep/sic.svg",
    division: "Sylhet",
    district: "Sylhet",
    city: "Sylhet",
    area: "Chowhatta / Zindabazar",
    address: "Millennium Complex (3rd Floor), Chowhatta, Sylhet-3100",
    testsOffered: ["IELTS", "PTE", "SPOKEN_ENGLISH"],
    modes: ["OFFLINE", "ONLINE"],
    courseDuration: "2 Months (24 Classes + 10 Mock Tests)",
    feeRange: "BDT 10,000 - 14,000",
    feeAmountBdt: 11500,
    features: [
      "Special focus on UKVI IELTS requirements for UK university admissions",
      "Daily speaking partner sessions in dedicated conversation lounge",
      "Free Cambridge original listening audios and practice test papers",
      "Affordable course fees with installment options"
    ],
    contactPhone: "+880 1712-998877",
    contactEmail: "info@sylhetielts.com",
    websiteUrl: "https://sylhetielts.com",
    facebookUrl: "https://facebook.com/sylhetieltscentre",
    rating: 4.6,
    reviewCount: 1120,
    studentReviewSnippet: "Very student-friendly environment with dedicated speaking partners every afternoon.",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2025-02-07"
  },

  // ==================== RAJSHAHI ====================
  {
    id: "prep-rajshahi-academy",
    name: "Rajshahi English Language Academy (RELA)",
    slug: "rajshahi-english-language-academy",
    logoUrl: "/logos/prep/rela.svg",
    division: "Rajshahi",
    district: "Rajshahi",
    city: "Rajshahi",
    area: "Alupatti / Saheb Bazar",
    address: "House 14, Alupatti More, Saheb Bazar, Rajshahi-6000",
    testsOffered: ["IELTS", "SPOKEN_ENGLISH"],
    modes: ["OFFLINE", "ONLINE"],
    courseDuration: "2.5 Months (30 Classes + 6 Full Mock Tests)",
    feeRange: "BDT 9,500 - 13,000",
    feeAmountBdt: 11000,
    features: [
      "Special discounts for RU and RUET undergraduate students",
      "Cambridge IELTS past papers and high-band model essays",
      "Audio listening lab with noise-canceling headphones",
      "Regular weekend mock exams with individual evaluation"
    ],
    contactPhone: "+880 1715-667788",
    contactEmail: "rela.rajshahi@gmail.com",
    websiteUrl: "https://rela-rajshahi.com",
    facebookUrl: "https://facebook.com/relarajshahi",
    rating: 4.6,
    reviewCount: 740,
    studentReviewSnippet: "The best place in northern Bangladesh for serious IELTS preparation. Trainers give genuine constructive feedback.",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2025-02-05"
  },

  // ==================== KHULNA ====================
  {
    id: "prep-khulna-language",
    name: "Khulna IELTS & Language Academy",
    slug: "khulna-ielts-language-academy",
    logoUrl: "/logos/prep/khulna.svg",
    division: "Khulna",
    district: "Khulna",
    city: "Khulna",
    area: "Shibbari More",
    address: "KDA Avenue (Opposite Shibbari Public Hall), Khulna-9100",
    testsOffered: ["IELTS", "PTE", "SPOKEN_ENGLISH"],
    modes: ["OFFLINE", "ONLINE"],
    courseDuration: "2.5 Months (28 Classes + 8 Mock Tests)",
    feeRange: "BDT 10,000 - 14,000",
    feeAmountBdt: 12000,
    features: [
      "Authorized British Council & IDP exam candidate assistance point",
      "KU & KUET student cohorts with structured study circles",
      "Personalized task 1 and task 2 writing workshops",
      "Free library access to Cambridge IELTS test books 10 to 19"
    ],
    contactPhone: "+880 1716-554433",
    contactEmail: "khulna.ielts@gmail.com",
    websiteUrl: "https://khulnaielts.com",
    facebookUrl: "https://facebook.com/khulnaieltsacademy",
    rating: 4.5,
    reviewCount: 680,
    studentReviewSnippet: "Helpful trainers who took extra time on Saturdays to review my writing task 1 bar charts and maps.",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2025-02-04"
  },

  // ==================== CUMILLA ====================
  {
    id: "prep-cumilla-care",
    name: "Cumilla IELTS & Education Care",
    slug: "cumilla-ielts-education-care",
    logoUrl: "/logos/prep/cumilla.svg",
    division: "Chattogram",
    district: "Cumilla",
    city: "Cumilla",
    area: "Kandirpar",
    address: "Nazrul Avenue, Kandirpar, Cumilla-3500",
    testsOffered: ["IELTS", "SPOKEN_ENGLISH"],
    modes: ["OFFLINE", "ONLINE"],
    courseDuration: "2 Months (24 Classes + 6 Mock Tests)",
    feeRange: "BDT 9,000 - 12,500",
    feeAmountBdt: 10500,
    features: [
      "British Council registered partner in Cumilla region",
      "Dedicated vocabulary flashcards and collocations handbook",
      "Speaking mock interviews conducted under strict exam timing",
      "Weekend sessions for college and university students"
    ],
    contactPhone: "+880 1718-443322",
    contactEmail: "cumilla.ielts@gmail.com",
    websiteUrl: "https://cumillaielts.com",
    facebookUrl: "https://facebook.com/cumillaieltscare",
    rating: 4.4,
    reviewCount: 520,
    studentReviewSnippet: "Saves having to travel to Dhaka for IELTS coaching; teachers are very supportive.",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2025-02-03"
  }
];

export const OFFICIAL_PRACTICE_RESOURCES: PracticeResource[] = [
  {
    id: "res-bc-ielts-ready",
    title: "British Council — IELTS Ready & Practice Materials",
    provider: "British Council",
    examType: "IELTS",
    skillsCovered: ["Listening", "Reading", "Writing", "Speaking"],
    freeFeatures: [
      "Free mock test with model answers and transcripts",
      "IELTS Ready Member access with timed sample questions",
      "Free access to live webinars and preparation advice videos",
      "Downloadable answer sheets and scoring criteria checklists",
      "Mobile-friendly listening audio player"
    ],
    paidFeatures: [
      "IELTS Ready Premium (Free for candidates who book test with British Council)",
      "40+ complete practice tests and individualized AI feedback"
    ],
    accountRequired: false,
    officialUrl: "https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-practice-tests",
    isOfficialProvider: true,
    badgeText: "Official IELTS Partner",
    description: "Official British Council portal offering full-length timed tests, sample answers for writing tasks 1 & 2, and scoring guidance directly from exam authors."
  },
  {
    id: "res-idp-ielts-prep",
    title: "IDP IELTS — Official Practice Tests & Masterclass",
    provider: "IDP Education",
    examType: "IELTS",
    skillsCovered: ["Listening", "Reading", "Writing", "Speaking"],
    freeFeatures: [
      "Official IDP IELTS practice tests for Academic and General Training",
      "Free IELTS Masterclass webinars presented by IELTS experts",
      "IDP IELTS by Cambridge app with daily 5-minute quizzes",
      "Band score calculator and test day advice guide",
      "Sample speaking test video recordings with examiner commentary"
    ],
    paidFeatures: [
      "IELTS Progress Check official marked practice test with feedback"
    ],
    accountRequired: true,
    officialUrl: "https://ielts.idp.com/prepare",
    isOfficialProvider: true,
    badgeText: "Official IELTS Co-owner",
    description: "Official test co-owner IDP provides authentic test questions, expert webinars, and sample speaking interviews with official examiner evaluations."
  },
  {
    id: "res-ielts-org-samples",
    title: "IELTS.org — Official Sample Test Questions",
    provider: "IELTS Partners (BC, IDP, Cambridge)",
    examType: "IELTS",
    skillsCovered: ["Listening", "Reading", "Writing", "Speaking"],
    freeFeatures: [
      "Direct PDF download of official Academic & General Training sample papers",
      "Full MP3 audio files for all listening test sections",
      "Official candidate answer sheets for practice printing",
      "Official Band Descriptors for Writing Task 1, Task 2 & Speaking"
    ],
    accountRequired: false,
    officialUrl: "https://ielts.org/take-a-test/preparation-resources/sample-test-questions",
    isOfficialProvider: true,
    badgeText: "Official Test Repository",
    description: "The global IELTS authority website providing authentic sample papers, downloadable answer keys, and official band descriptors used by certified examiners."
  },
  {
    id: "res-ets-toefl-testready",
    title: "ETS TOEFL TestReady & Official Practice Tests",
    provider: "Educational Testing Service (ETS)",
    examType: "TOEFL",
    skillsCovered: ["Listening", "Reading", "Writing", "Speaking"],
    freeFeatures: [
      "TOEFL TestReady personalized preparation portal with diagnostic tests",
      "Free full-length TOEFL iBT practice test with AI scoring",
      "Daily practice activity with automated feedback",
      "Official TOEFL iBT test day simulation software",
      "Official audio tracks and speech sample recordings"
    ],
    paidFeatures: [
      "TOEFL Practice Online (TPO) complete scored test volumes"
    ],
    accountRequired: true,
    officialUrl: "https://www.ets.org/toefl/test-takers/ibt/prepare/testready.html",
    isOfficialProvider: true,
    badgeText: "Official TOEFL Creator",
    description: "ETS's official AI-driven TestReady portal gives candidates real test questions, automated speech analysis, and full-length simulated TOEFL iBT tests."
  },
  {
    id: "res-pearson-pte-prep",
    title: "Pearson PTE Academic — Official Practice & Taster Test",
    provider: "Pearson PLC",
    examType: "PTE",
    skillsCovered: ["Listening", "Reading", "Writing", "Speaking"],
    freeFeatures: [
      "Free PTE Academic Taster Test (20 authentic practice questions)",
      "Official PTE Academic Practice App with study plan generator",
      "Downloadable offline practice test PDF and audio files",
      "Official score guide explaining machine-scored automated algorithms"
    ],
    paidFeatures: [
      "Official Scored Practice Tests (Mock tests with instant machine score report within 2 hours)"
    ],
    accountRequired: true,
    officialUrl: "https://www.pearsonpte.com/preparation",
    isOfficialProvider: true,
    badgeText: "Official PTE Creator",
    description: "Pearson's official preparation hub explains machine-scoring algorithms and offers free taster questions plus official app-based practice."
  },
  {
    id: "res-cambridge-english-activities",
    title: "Cambridge English — Free B2 & C1 Learning Activities",
    provider: "Cambridge University Press & Assessment",
    examType: "ALL",
    skillsCovered: ["Reading", "Writing", "Listening"],
    freeFeatures: [
      "175+ free interactive English learning activities categorized by CEFR level",
      "Grammar, vocabulary, and reading comprehension exercises",
      "Instant answer verification and explanatory notes",
      "No registration or sign-in required"
    ],
    accountRequired: false,
    officialUrl: "https://www.cambridgeenglish.org/learning-english/activities-for-learners/",
    isOfficialProvider: true,
    badgeText: "Cambridge Assessment",
    description: "Authentic Cambridge learning activities targeting CEFR B2 and C1 competencies required for university admissions worldwide."
  }
];

export const EXAM_SCORE_MAPPINGS = [
  {
    cefrLevel: "C2 (Mastery)",
    ieltsBand: "8.5 - 9.0",
    toeflScore: "115 - 120",
    pteScore: "85 - 90",
    typicalRequirement: "Top-tier humanities, law, clinical medicine, Oxford, Cambridge, Harvard PhDs",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200"
  },
  {
    cefrLevel: "C1 (Effective Operational Proficiency)",
    ieltsBand: "7.0 - 8.0",
    toeflScore: "95 - 114",
    pteScore: "66 - 84",
    typicalRequirement: "Standard Master's and PhD admission for UK, USA, Germany, Netherlands & Australia",
    badgeColor: "bg-teal-50 text-teal-800 border-teal-200"
  },
  {
    cefrLevel: "B2 (Vantage / Independent)",
    ieltsBand: "5.5 - 6.5",
    toeflScore: "72 - 94",
    pteScore: "51 - 65",
    typicalRequirement: "Standard Bachelor's degrees, European universities with low/no tuition, foundation tracks",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200"
  },
  {
    cefrLevel: "B1 (Threshold)",
    ieltsBand: "4.0 - 5.0",
    toeflScore: "42 - 71",
    pteScore: "36 - 50",
    typicalRequirement: "Pre-sessional English courses and language pathway bridge programs",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200"
  }
];

export const TEST_BOOKING_GUIDE = [
  {
    stepNumber: "01",
    title: "Verify Valid National Passport",
    description: "Ensure your passport has at least 6 months validity from your test date. In Bangladesh, official IELTS, TOEFL, and PTE test centers strictly require an original physical passport on exam day."
  },
  {
    stepNumber: "02",
    title: "Choose Paper vs Computer-delivered",
    description: "Computer-delivered IELTS results are released in 3-5 days (vs 13 days for paper). TOEFL iBT and PTE Academic are 100% computerized with faster turnaround."
  },
  {
    stepNumber: "03",
    title: "Book Through Authorized Portals",
    description: "Register online via British Council Bangladesh, IDP Bangladesh, ETS, or Pearson. Typical 2025 registration fees range from BDT 21,500 to BDT 24,500 depending on exchange rates."
  },
  {
    stepNumber: "04",
    title: "Send Official Score Reports",
    description: "During or after registration, select up to 5 universities to receive your official electronic test report forms (eTRF) free of charge."
  }
];
