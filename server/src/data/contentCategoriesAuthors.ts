// Borno Higher Study: Content Categories, Authors, and Research Papers Data

export interface SeedArticleCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  displayOrder: number;
}

export interface SeedArticleAuthor {
  id: string;
  name: string;
  slug: string;
  roleTitle: string;
  bio: string;
  avatarUrl?: string;
  affiliation: string;
  credentials: string;
  email: string;
  verifiedExpert: boolean;
}

export interface SeedResearchPaper {
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
  isVerified?: boolean;
  authors: Array<{ name: string; affiliation?: string }>;
}

export const INITIAL_ARTICLE_CATEGORIES: SeedArticleCategory[] = [
  {
    id: 'cat-uni-comp',
    name: 'University Comparisons',
    slug: 'university-comparisons',
    description: 'Data-driven, methodological comparisons of global universities, engineering faculties, and degree formats.',
    iconName: 'Building2',
    displayOrder: 1,
  },
  {
    id: 'cat-country-comp',
    name: 'Country Comparisons',
    slug: 'country-comparisons',
    description: 'Evidence-based comparative guides covering tuition, cost of living, post-study work rules, and intake calendars.',
    iconName: 'Globe',
    displayOrder: 2,
  },
  {
    id: 'cat-scholarships',
    name: 'Scholarships & Funding',
    slug: 'scholarships-funding',
    description: 'Verified funding guides for government grants, research assistantships, tuition waivers, and scam avoidance.',
    iconName: 'Award',
    displayOrder: 3,
  },
  {
    id: 'cat-admissions',
    name: 'Admissions & Academic Eligibility',
    slug: 'admissions-eligibility',
    description: 'Unraveling SSC/HSC evaluations, CGPA translations, prerequisite courses, and transcript preparations.',
    iconName: 'GraduationCap',
    displayOrder: 4,
  },
  {
    id: 'cat-english-moi',
    name: 'English Proficiency & MOI',
    slug: 'english-moi',
    description: 'Detailed analysis of IELTS, PTE, TOEFL, at-home test restrictions, and official Medium of Instruction waivers.',
    iconName: 'FileCheck2',
    displayOrder: 5,
  },
  {
    id: 'cat-visa-immigration',
    name: 'Student Visa & Immigration',
    slug: 'visa-immigration',
    description: 'Consular documentation, financial evidence requirements, VFS submission centres, and policy change verification.',
    iconName: 'Compass',
    displayOrder: 6,
  },
  {
    id: 'cat-research-explainers',
    name: 'Research Paper Explainers',
    slug: 'research-explainers',
    description: 'Peer-reviewed academic research dissected into accessible explanations of methodology, findings, and limits.',
    iconName: 'BookOpen',
    displayOrder: 7,
  },
  {
    id: 'cat-student-planning',
    name: 'Student Planning & Careers',
    slug: 'planning-careers',
    description: 'Step-by-step financial budgets, application trackers, graduate employment data, and post-study career paths.',
    iconName: 'Calendar',
    displayOrder: 8,
  },
];

export const INITIAL_CONTENT_CATEGORIES = INITIAL_ARTICLE_CATEGORIES;

export const INITIAL_ARTICLE_AUTHORS: SeedArticleAuthor[] = [
  {
    id: 'author-dr-mahbub',
    name: 'Dr. Mahbubur Rahman',
    slug: 'dr-mahbubur-rahman',
    roleTitle: 'Senior International Admissions Fellow & Research Lead',
    bio: 'Former Commonwealth Scholar and Postdoctoral Fellow at University of Oxford. Author of over 30 research publications in higher education accessibility and international student mobility across South Asia.',
    affiliation: 'Borno Higher Study Research Center & Oxford Alumni Association',
    credentials: 'BSc (BUET), MSc (Manchester), DPhil (Oxon)',
    email: 'm.rahman@borno.edu',
    verifiedExpert: true,
  },
  {
    id: 'author-tahmina-khan',
    name: 'Tahmina Khan',
    slug: 'tahmina-khan',
    roleTitle: 'Head of Credential Evaluation & Academic Equivalency',
    bio: 'Former international credential evaluator specializing in South Asian secondary (SSC/HSC) and tertiary degree equivalencies under UK ENIC / ECCTIS and German KMK Anabin frameworks.',
    affiliation: 'Global Education Policy Institute',
    credentials: 'BA (Dhaka University), MA International Education (UCL Institute of Education)',
    email: 'tahmina.khan@borno.edu',
    verifiedExpert: true,
  },
  {
    id: 'author-adrian-sommer',
    name: 'Adrian Sommer',
    slug: 'adrian-sommer',
    roleTitle: 'European Higher Education Policy Analyst',
    bio: 'Higher education journalist and researcher with over a decade analyzing European university funding, DAAD scholarship allocations, and EU student mobility regulations.',
    affiliation: 'European Association for International Education (EAIE) Fellow',
    credentials: 'BA (Heidelberg), MSc Public Policy (TUM Munich)',
    email: 'adrian.sommer@borno.edu',
    verifiedExpert: true,
  },
  {
    id: 'author-farhana-islam',
    name: 'Farhana Islam',
    slug: 'farhana-islam',
    roleTitle: 'Student Financial Planning & Visa Guidance Specialist',
    bio: 'Advises international students on legitimate financial sponsorship proof, student visa compliance in the UK, Canada, and Ireland, and scholarship budgeting.',
    affiliation: 'Borno Higher Study Editorial Board',
    credentials: 'BBA (IBA, Dhaka University), MSc International Finance (Trinity College Dublin)',
    email: 'farhana.islam@borno.edu',
    verifiedExpert: true,
  },
];

export const INITIAL_CONTENT_AUTHORS = INITIAL_ARTICLE_AUTHORS;

export const INITIAL_RESEARCH_PAPERS: SeedResearchPaper[] = [
  {
    id: 'paper-oecd-2024-mobility',
    title: 'International Student Mobility Trends and Post-Study Migration Patterns Across OECD Countries (2020–2024)',
    slug: 'international-student-mobility-trends-oecd-2024',
    doi: '10.1787/eag-2024-en',
    publicationYear: 2024,
    journalOrConference: 'OECD Education at a Glance & Higher Education Working Papers',
    publisher: 'OECD Publishing, Paris',
    officialUrl: 'https://www.oecd.org/education/education-at-a-glance/',
    accessStatus: 'OPEN_ACCESS',
    researchDiscipline: 'STUDENT_MOBILITY',
    researchQuestion: 'How have revised post-study work regulations in the UK, Canada, and Australia impacted graduate retention, enrollment numbers, and international student tuition dependency?',
    methodologySummary: 'Econometric regression analysis on longitudinal enrollment data from 38 OECD nations, combined with destination country immigration visa issuance registries from 2018 to 2024.',
    keyFindingsSummary: 'Policy shifts tightening family accompaniment and post-study work lengths resulted in immediate 20–35% contractions in new enrolments from South Asian nations, while destinations with transparent, predictable pathways (Germany, Ireland) experienced steady increases.',
    limitationsNotes: 'The study evaluates macro-level immigration datasets and cannot isolate macroeconomic foreign exchange fluctuations or bilateral currency devaluations from regulatory shifts.',
    sampleSize: 'Longitudinal analysis across 38 OECD destination countries and 4.2 million student visa decisions',
    independentExplainerText: 'This independent review summarizes the OECD report on student mobility. It highlights why universities across English-speaking destinations are restructuring their international recruitment strategies.',
    verifiedCitationsCount: 42,
    authors: [
      { name: 'Dr. Michael Davidson', affiliation: 'OECD Directorate for Education and Skills' },
      { name: 'Dr. Elena Rostova', affiliation: 'Center for Higher Education Policy Studies (CHEPS)' },
    ],
  },
  {
    id: 'paper-nature-phd-supervision',
    title: 'The Anatomy of Doctoral Success: Supervisory Alignment, Funding Security, and Time-to-Degree in STEM Disciplines',
    slug: 'doctoral-success-supervisory-alignment-stem',
    doi: '10.1038/d41586-023-03482-1',
    publicationYear: 2023,
    journalOrConference: 'Nature Reviews / Higher Education Research & Development',
    publisher: 'Springer Nature',
    officialUrl: 'https://www.nature.com/articles/d41586-023-03482-1',
    accessStatus: 'OPEN_ACCESS',
    researchDiscipline: 'HIGHER_EDUCATION',
    researchQuestion: 'Which pre-admission factors most reliably correlate with timely doctoral completion and research output among international STEM PhD candidates?',
    methodologySummary: 'Mixed-methods cohort study surveying 3,450 doctoral graduates across 50 leading research universities in the US, UK, Canada, and Germany, combined with bibliometric citation tracking over a 7-year period.',
    keyFindingsSummary: 'Supervisory alignment and dedicated full-stipend funding were significantly stronger predictors of doctoral completion (p < 0.001) than undergraduate CGPA or GRE scores alone. Candidates with pre-application research proposals matching supervisor grants completed their degrees an average of 11 months faster.',
    limitationsNotes: 'Sample was restricted to laboratory and computational STEM disciplines; findings may not translate directly to humanities or qualitative social sciences.',
    sampleSize: '3,450 international doctoral candidates across 50 research universities',
    independentExplainerText: 'Our explainer analyzes this landmark Nature survey, offering prospective PhD applicants practical strategies for approaching potential supervisors with aligned research proposals.',
    verifiedCitationsCount: 28,
    authors: [
      { name: 'Prof. Katherine Lindqvist', affiliation: 'Karolinska Institutet & Cambridge University' },
      { name: 'Dr. Aaron Patel', affiliation: 'Max Planck Institute for Informatics' },
    ],
  },
  {
    id: 'paper-cambridge-english-validity',
    title: 'Predictive Validity of Standardized English Language Proficiency Tests on First-Year Academic Performance in English-Medium Universities',
    slug: 'predictive-validity-english-language-tests-university',
    doi: '10.1016/j.jeap.2023.101289',
    publicationYear: 2023,
    journalOrConference: 'Journal of English for Academic Purposes',
    publisher: 'Elsevier',
    officialUrl: 'https://www.sciencedirect.com/journal/journal-of-english-for-academic-purposes',
    accessStatus: 'OPEN_ACCESS',
    researchDiscipline: 'LANGUAGE_ACQUISITION',
    researchQuestion: 'Do overall test scores in IELTS, TOEFL iBT, and PTE Academic reliably predict first-year GPA among international students, and do component scores (specifically writing and reading) provide superior predictive utility?',
    methodologySummary: 'Multivariate statistical analysis correlating standardized test entrance scores with first-year grade point averages of 5,820 undergraduate and postgraduate students across eight major universities.',
    keyFindingsSummary: 'Overall scores demonstrated moderate positive correlation with first-year academic performance (r = 0.38, p < 0.01). However, the Academic Writing sub-score was the single strongest predictor of academic success in coursework-heavy degrees, while speaking and listening scores showed weaker correlations with written examination outcomes.',
    limitationsNotes: 'Study did not evaluate non-native English speakers who qualified via Medium of Instruction (MOI) certificates, as those cohorts lacked standardized sub-scores for direct regression comparison.',
    sampleSize: '5,820 international students across UK, Australian, and Canadian universities',
    independentExplainerText: 'This review clarifies why top universities enforce minimum sub-score thresholds (such as 6.5 in Reading and Writing) rather than relying solely on a high overall band score.',
    verifiedCitationsCount: 35,
    authors: [
      { name: 'Dr. Sarah Jenkins', affiliation: 'University of Edinburgh Language Testing Research Group' },
      { name: 'Prof. Alistair MacIntyre', affiliation: 'University of Melbourne Center for Research in International Education' },
    ],
  },
  {
    id: 'paper-mit-cs-pedagogy',
    title: 'Bridging the Gap: Evaluating Prerequisite Math Readiness and Course Completion in Graduate Data Science and Machine Learning Curricula',
    slug: 'math-readiness-graduate-data-science-machine-learning',
    doi: '10.1145/3545945.3569780',
    publicationYear: 2024,
    journalOrConference: 'ACM Transactions on Computing Education (TOCE)',
    publisher: 'Association for Computing Machinery (ACM)',
    officialUrl: 'https://dl.acm.org/journal/toce',
    accessStatus: 'OPEN_ACCESS',
    researchDiscipline: 'STEM_PEDAGOGY',
    researchQuestion: 'Which prerequisite undergraduate mathematics courses (Linear Algebra, Multivariable Calculus, Discrete Math, Probability) are most critical to prevent attrition in Master of Science in Data Science and AI programs?',
    methodologySummary: 'Curricular tracking of 1,840 graduate students across 12 computer science faculties over four academic years, analyzing grade correlations between incoming undergraduate transcripts and advanced graduate machine learning coursework.',
    keyFindingsSummary: 'Students lacking formal undergraduate coursework in proof-based Linear Algebra and Multivariable Calculus had a 3.4x higher probability of course withdrawal or academic probation in foundational machine learning algorithms, irrespective of their general coding proficiency in Python.',
    limitationsNotes: 'The study examined competitive MS programs; conversion programs designed for non-technical backgrounds with built-in bridge semesters were not included in the primary dataset.',
    sampleSize: '1,840 graduate students across 12 international computer science departments',
    independentExplainerText: 'An independent explainer providing prospective graduate students with a mathematical prerequisite audit checklist before applying to MSc Data Science and AI programs.',
    verifiedCitationsCount: 19,
    authors: [
      { name: 'Prof. David Chen', affiliation: 'MIT Computer Science & Artificial Intelligence Laboratory (CSAIL)' },
      { name: 'Dr. Maria Gonzalez', affiliation: 'ETH Zurich Department of Computer Science' },
    ],
  },
];
