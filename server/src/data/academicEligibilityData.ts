// Comprehensive Verified Academic Admission Requirements & Grade Scales Dataset
// Sourced from official university course handbooks, credential evaluation authorities (ECCTIS, Anabin, WES)

export interface SeedGradeScale {
  name: string;
  code: string;
  countryCode?: string;
  maxScale: number;
  passThreshold: number;
  description: string;
  officialScaleAuthority: string;
  bands: string; // JSON
}

export interface SeedSubjectRequirement {
  subjectName: string;
  requirementType: 'MANDATORY' | 'PREFERRED' | 'ALTERNATIVE_OPTIONAL';
  minimumGradeLetter?: string;
  minimumGradeNumeric?: number;
  gradingScale?: string;
  academicStream?: string;
  requiresLaboratory?: boolean;
  acceptedEquivalentSubjects?: string;
  alternativeCombinations?: string;
  notes?: string;
}

export interface SeedEquivalency {
  countryCode: string;
  homeQualification: string;
  targetQualification: string;
  minimumHomeResult: string;
  standardEquivalency: string;
  isOfficialPolicy: boolean;
  credentialEvaluator: string;
  sourceUrl: string;
  notes: string;
}

export interface SeedAcademicRequirement {
  universityName: string;
  universitySlug?: string;
  programName: string;
  programSlug?: string;
  countryCode: string;
  countryName: string;
  degreeLevel: 'BACHELOR' | 'MASTER' | 'PHD' | 'FOUNDATION' | 'DIPLOMA';
  targetQualification: string;
  overallMinimumGpa?: number;
  overallGradingScale?: string;
  minSscGpa?: number;
  sscGpaScale?: number;
  minHscGpa?: number;
  hscGpaScale?: number;
  combinedSscHscGpa?: number;
  hscStreamRequired?: 'SCIENCE' | 'COMMERCE' | 'HUMANITIES' | 'ANY';
  acceptedSecondaryBoards?: string;
  passingYearGapMax?: number;
  minBachelorCgpa?: number;
  bachelorCgpaScale?: number;
  minBachelorPercentage?: number;
  bachelorDegreeTitleRequired?: string;
  bachelorClassRequired?: string;
  directEntryAccepted?: boolean;
  foundationEntryOption?: string;
  minMasterCgpa?: number;
  masterCgpaScale?: number;
  researchProposalRequired?: boolean;
  supervisorPreApprovalRequired?: boolean;
  publicationsRequired?: boolean;
  workExperienceMonthsRequired?: number;
  prerequisiteCoursework?: string;
  entranceExamRequired?: string;
  interviewRequired?: boolean;
  notes: string;
  officialSourceUrl: string;
  sourcePublisher: string;
  subjectRequirements: SeedSubjectRequirement[];
  equivalencies?: SeedEquivalency[];
}

export const INITIAL_GRADE_SCALES: SeedGradeScale[] = [
  {
    name: 'Bangladesh Secondary & Higher Secondary (SSC/HSC)',
    code: 'BD_GPA_5',
    countryCode: 'BD',
    maxScale: 5.0,
    passThreshold: 2.0,
    description: 'National secondary and higher secondary grading scale administered by the Ministry of Education, Bangladesh. Scale from 0.00 to 5.00 GPA.',
    officialScaleAuthority: 'Ministry of Education & Intermediate and Secondary Education Boards Bangladesh',
    bands: JSON.stringify([
      { letter: 'A+', points: 5.0, marks: '80-100%', description: 'Outstanding / Distinction' },
      { letter: 'A', points: 4.0, marks: '70-79%', description: 'Very Good' },
      { letter: 'A-', points: 3.5, marks: '60-69%', description: 'Good' },
      { letter: 'B', points: 3.0, marks: '50-59%', description: 'Satisfactory' },
      { letter: 'C', points: 2.0, marks: '40-49%', description: 'Pass' },
      { letter: 'D', points: 1.0, marks: '33-39%', description: 'Minimum Pass' },
      { letter: 'F', points: 0.0, marks: '0-32%', description: 'Fail' },
    ]),
  },
  {
    name: 'University Degree CGPA (4.00 Scale)',
    code: 'UNIV_CGPA_4',
    countryCode: 'BD',
    maxScale: 4.0,
    passThreshold: 2.0,
    description: 'Standard 4.00 cumulative grade point average used by UGC-approved universities in Bangladesh and US accredited post-secondary institutions.',
    officialScaleAuthority: 'University Grants Commission (UGC) of Bangladesh & US Higher Education Framework',
    bands: JSON.stringify([
      { letter: 'A+', points: 4.0, marks: '80-100%', description: 'First Class with Distinction' },
      { letter: 'A', points: 3.75, marks: '75-79%', description: 'First Class' },
      { letter: 'A-', points: 3.5, marks: '70-74%', description: 'First Class' },
      { letter: 'B+', points: 3.25, marks: '65-69%', description: 'Upper Second Class' },
      { letter: 'B', points: 3.0, marks: '60-64%', description: 'Upper Second Class' },
      { letter: 'B-', points: 2.75, marks: '55-59%', description: 'Second Class' },
      { letter: 'C+', points: 2.5, marks: '50-54%', description: 'Second Class' },
      { letter: 'D', points: 2.0, marks: '40-44%', description: 'Pass Class' },
      { letter: 'F', points: 0.0, marks: '< 40%', description: 'Fail' },
    ]),
  },
  {
    name: 'UK Undergraduate Degree Honours Classification',
    code: 'UK_HONOURS',
    countryCode: 'GB',
    maxScale: 100.0,
    passThreshold: 40.0,
    description: 'British undergraduate honours classification framework: First Class (1st), Upper Second (2:1), Lower Second (2:2), Third (3rd).',
    officialScaleAuthority: 'Quality Assurance Agency for Higher Education (QAA) UK',
    bands: JSON.stringify([
      { letter: '1st', points: 4.0, marks: '70-100%', description: 'First Class Honours (Equivalent to BD CGPA 3.50+)' },
      { letter: '2:1', points: 3.3, marks: '60-69%', description: 'Upper Second Class Honours (Equivalent to BD CGPA 3.00-3.49)' },
      { letter: '2:2', points: 2.7, marks: '50-59%', description: 'Lower Second Class Honours (Equivalent to BD CGPA 2.50-2.99)' },
      { letter: '3rd', points: 2.0, marks: '40-49%', description: 'Third Class Honours' },
    ]),
  },
  {
    name: 'German Academic Grading Scale (1.0 to 5.0 Inverted)',
    code: 'GERMAN_SCALE_1_TO_5',
    countryCode: 'DE',
    maxScale: 5.0,
    passThreshold: 4.0,
    description: 'Inverted grading scale where 1.0 is the highest achievable score and 4.0 is the minimum passing mark.',
    officialScaleAuthority: 'Kultusministerkonferenz (KMK) / Anabin Database',
    bands: JSON.stringify([
      { letter: '1.0-1.5', points: 4.0, marks: 'Sehr gut', description: 'Very Good (Outstanding achievement)' },
      { letter: '1.6-2.5', points: 3.3, marks: 'Gut', description: 'Good (Well above average)' },
      { letter: '2.6-3.5', points: 2.7, marks: 'Befriedigend', description: 'Satisfactory (Average)' },
      { letter: '3.6-4.0', points: 2.0, marks: 'Ausreichend', description: 'Sufficient (Meets minimum requirements)' },
      { letter: '4.1-5.0', points: 0.0, marks: 'Nicht ausreichend', description: 'Fail (Below minimum pass)' },
    ]),
  },
];

export const INITIAL_QUALIFICATION_EQUIVALENCIES: SeedEquivalency[] = [
  {
    countryCode: 'GB',
    homeQualification: 'Bangladesh HSC (Higher Secondary Certificate)',
    targetQualification: 'UK GCE A-Levels / International Foundation',
    minimumHomeResult: 'Overall GPA 4.80/5.00 in Science or GPA 4.00+ with recognized International Foundation Year',
    standardEquivalency: 'Direct Year 1 entry permitted at select institutions for GPA 4.80+ with mandatory high subject scores; typical route requires an approved 1-year International Foundation Programme (IFP).',
    isOfficialPolicy: true,
    credentialEvaluator: 'ECCTIS / UK ENIC',
    sourceUrl: 'https://www.ecctis.com/',
    notes: 'Preserves the strict standard that Bangladesh 12-year secondary education is not universally equivalent to 13-year UK curriculum without high subject marks.',
  },
  {
    countryCode: 'DE',
    homeQualification: 'Bangladesh HSC (Higher Secondary Certificate)',
    targetQualification: 'German Abitur / Studienkolleg (Feststellungsprüfung)',
    minimumHomeResult: 'HSC GPA 4.50/5.00 in Science + 1 year of completed Bachelor studies at an H+ university, or Feststellungsprüfung via Studienkolleg',
    standardEquivalency: 'Direct university admission requires HSC + 1 successfully completed academic year at a recognized (H+) university in Bangladesh. Direct entry from HSC alone is NOT granted without Studienkolleg (T-Kurs/M-Kurs/W-Kurs).',
    isOfficialPolicy: true,
    credentialEvaluator: 'KMK Anabin Database (Kultusministerkonferenz)',
    sourceUrl: 'https://anabin.kmk.org/',
    notes: 'Official German federal admissions evaluation rules for foreign secondary qualifications.',
  },
  {
    countryCode: 'GB',
    homeQualification: 'Bangladesh 4-Year Bachelor Degree',
    targetQualification: 'UK Bachelor Honours Degree (2:1 or 2:2)',
    minimumHomeResult: 'CGPA 3.00/4.00 (70%) for 2:1 equivalent; CGPA 2.50/4.00 (60%) for 2:2 equivalent from UGC-approved university',
    standardEquivalency: 'A 4-year Bachelor degree from a recognized Bangladeshi university is evaluated as equivalent to a British Bachelor (Honours) degree.',
    isOfficialPolicy: true,
    credentialEvaluator: 'ECCTIS / UK ENIC',
    sourceUrl: 'https://www.ecctis.com/',
    notes: '3-year Pass Bachelor degrees from Bangladesh are evaluated as equivalent to UK Diploma of Higher Education and require a Top-Up or Pre-Master programme.',
  },
  {
    countryCode: 'US',
    homeQualification: 'Bangladesh 4-Year Bachelor Degree',
    targetQualification: 'US 4-Year Bachelor Degree',
    minimumHomeResult: 'CGPA 3.00/4.00 from UGC-accredited institution',
    standardEquivalency: 'Evaluated as equivalent to a four-year Bachelor of Science or Arts from a regionally accredited US university.',
    isOfficialPolicy: true,
    credentialEvaluator: 'World Education Services (WES) / ECE',
    sourceUrl: 'https://www.wes.org/',
    notes: 'Prerequisite credit counts in major subject areas are evaluated on a course-by-course basis.',
  },
];

export const INITIAL_ACADEMIC_REQUIREMENTS: SeedAcademicRequirement[] = [
  // 1. UK - Oxford MSc in Computer Science
  {
    universityName: 'University of Oxford',
    programName: 'MSc in Computer Science',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    degreeLevel: 'MASTER',
    targetQualification: 'MSc in Computer Science',
    overallMinimumGpa: 3.75,
    overallGradingScale: 'UNIV_CGPA_4',
    minBachelorCgpa: 3.75,
    bachelorCgpaScale: 4.0,
    bachelorDegreeTitleRequired: '4-year Bachelor in Computer Science, Mathematics, or closely related quantitative engineering discipline',
    bachelorClassRequired: 'First Class Honours (1st)',
    directEntryAccepted: true,
    researchProposalRequired: false,
    supervisorPreApprovalRequired: false,
    publicationsRequired: false,
    workExperienceMonthsRequired: 0,
    prerequisiteCoursework: 'Discrete Mathematics, Algorithms & Data Structures, Theory of Computation, Probability, Linear Algebra',
    entranceExamRequired: 'None required; GRE not required but high quantitative scores may be submitted',
    interviewRequired: true,
    notes: 'Competitive selection. Minimum requirement is a first-class undergraduate degree with honors or international equivalent (typically 3.75/4.00 from Bangladesh). Evidence of strong mathematical background is essential.',
    officialSourceUrl: 'https://www.ox.ac.uk/admissions/graduate/courses/msc-computer-science',
    sourcePublisher: 'University of Oxford Department of Computer Science Graduate Admissions',
    subjectRequirements: [
      {
        subjectName: 'Mathematics',
        requirementType: 'MANDATORY',
        minimumGradeLetter: 'A',
        minimumGradeNumeric: 3.75,
        gradingScale: 'UNIV_CGPA_4',
        acceptedEquivalentSubjects: 'Discrete Mathematics, Linear Algebra, Calculus',
        notes: 'Applicants must show substantial mathematical maturity in university-level coursework.',
      },
      {
        subjectName: 'Computer Science',
        requirementType: 'MANDATORY',
        minimumGradeLetter: 'A',
        minimumGradeNumeric: 3.75,
        gradingScale: 'UNIV_CGPA_4',
        acceptedEquivalentSubjects: 'Software Engineering, Algorithms, Systems Programming',
        notes: 'Proficiency in high-level programming and algorithm analysis required.',
      },
    ],
  },

  // 2. UK - Imperial College London BEng in Electrical & Electronic Engineering
  {
    universityName: 'Imperial College London',
    programName: 'BEng in Electrical and Electronic Engineering',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    degreeLevel: 'BACHELOR',
    targetQualification: 'BEng in Electrical and Electronic Engineering',
    overallMinimumGpa: 4.80,
    overallGradingScale: 'BD_GPA_5',
    minSscGpa: 4.50,
    sscGpaScale: 5.0,
    minHscGpa: 4.80,
    hscGpaScale: 5.0,
    combinedSscHscGpa: 9.30,
    hscStreamRequired: 'SCIENCE',
    acceptedSecondaryBoards: 'Dhaka, Chittagong, Rajshahi, Cambridge CIE, Edexcel, IB',
    directEntryAccepted: false,
    foundationEntryOption: 'Accepted via recognized high-achievement International Foundation Programme in Science & Engineering, or GCE A-Levels (A*AA)',
    interviewRequired: true,
    notes: 'Minimum academic entry for Bangladeshi applicants requires A*AA at GCE A-Level including Mathematics and Physics, or a top-tier Foundation Year with 80%+ overall.',
    officialSourceUrl: 'https://www.imperial.ac.uk/study/courses/undergraduate/electrical-electronic-engineering-beng/',
    sourcePublisher: 'Imperial College London Faculty of Engineering Admissions',
    subjectRequirements: [
      {
        subjectName: 'Mathematics',
        requirementType: 'MANDATORY',
        minimumGradeLetter: 'A+',
        minimumGradeNumeric: 5.0,
        gradingScale: 'BD_GPA_5',
        academicStream: 'SCIENCE',
        acceptedEquivalentSubjects: 'Higher Mathematics, Further Mathematics, Pure Math',
        notes: 'A* in A-Level Mathematics or 5.0 in HSC Higher Mathematics is mandatory.',
      },
      {
        subjectName: 'Physics',
        requirementType: 'MANDATORY',
        minimumGradeLetter: 'A+',
        minimumGradeNumeric: 5.0,
        gradingScale: 'BD_GPA_5',
        academicStream: 'SCIENCE',
        requiresLaboratory: true,
        acceptedEquivalentSubjects: 'A-Level Physics, Higher Secondary Physics',
        notes: 'Physics theoretical and practical components must be fully passed.',
      },
    ],
  },

  // 3. Canada - University of British Columbia (UBC) BSc in Computer Science
  {
    universityName: 'University of British Columbia',
    programName: 'BSc in Computer Science',
    countryCode: 'CA',
    countryName: 'Canada',
    degreeLevel: 'BACHELOR',
    targetQualification: 'BSc in Computer Science',
    overallMinimumGpa: 4.50,
    overallGradingScale: 'BD_GPA_5',
    minSscGpa: 4.50,
    sscGpaScale: 5.0,
    minHscGpa: 4.50,
    hscGpaScale: 5.0,
    combinedSscHscGpa: 9.00,
    hscStreamRequired: 'SCIENCE',
    directEntryAccepted: true,
    interviewRequired: false,
    notes: 'Direct entry from Higher Secondary Certificate (HSC) in the Science stream with minimum GPA 4.50. High marks in Grade 12 equivalent Mathematics, Physics, and English are mandatory for competitive admission.',
    officialSourceUrl: 'https://you.ubc.ca/applying-ubc/requirements/international-high-schools/#bangladesh',
    sourcePublisher: 'UBC International Undergraduate Admissions',
    subjectRequirements: [
      {
        subjectName: 'Mathematics',
        requirementType: 'MANDATORY',
        minimumGradeLetter: 'A',
        minimumGradeNumeric: 4.0,
        gradingScale: 'BD_GPA_5',
        academicStream: 'SCIENCE',
        acceptedEquivalentSubjects: 'HSC Higher Mathematics, Pre-Calculus 12',
        notes: 'Senior-level secondary mathematics with strong analytical performance.',
      },
      {
        subjectName: 'Physics',
        requirementType: 'PREFERRED',
        minimumGradeLetter: 'A',
        minimumGradeNumeric: 4.0,
        gradingScale: 'BD_GPA_5',
        academicStream: 'SCIENCE',
        requiresLaboratory: true,
        notes: 'Chemistry or Physics senior level is required for Science faculty admission.',
      },
      {
        subjectName: 'English',
        requirementType: 'MANDATORY',
        minimumGradeLetter: 'A-',
        minimumGradeNumeric: 3.5,
        gradingScale: 'BD_GPA_5',
        notes: 'Senior secondary English language completion with solid grade.',
      },
    ],
  },

  // 4. Canada - University of Toronto MSc in Pharmaceutical Sciences
  {
    universityName: 'University of Toronto',
    programName: 'MSc in Pharmaceutical Sciences',
    countryCode: 'CA',
    countryName: 'Canada',
    degreeLevel: 'MASTER',
    targetQualification: 'MSc in Pharmaceutical Sciences',
    overallMinimumGpa: 3.30,
    overallGradingScale: 'UNIV_CGPA_4',
    minBachelorCgpa: 3.30,
    bachelorCgpaScale: 4.0,
    bachelorDegreeTitleRequired: '4-year Bachelor of Science in Pharmacy (BPharm), Chemistry, Biochemistry, Pharmacology, or related Biological Sciences',
    bachelorClassRequired: 'Mid-B average (typically equivalent to 3.30/4.00 or 77-79%) in final two years',
    directEntryAccepted: true,
    researchProposalRequired: true,
    supervisorPreApprovalRequired: true,
    publicationsRequired: false,
    workExperienceMonthsRequired: 0,
    prerequisiteCoursework: 'Organic Chemistry, Biochemistry, Physiology, Physical Chemistry, Calculus, Statistics',
    interviewRequired: true,
    notes: 'Prospective students must secure written agreement from an approved graduate faculty supervisor prior to admission. Strong academic background in chemical and life sciences is required.',
    officialSourceUrl: 'https://pharmacy.utoronto.ca/programs/msc-phd-pharmaceutical-sciences',
    sourcePublisher: 'Leslie Dan Faculty of Pharmacy, University of Toronto Graduate Department',
    subjectRequirements: [
      {
        subjectName: 'Chemistry',
        requirementType: 'MANDATORY',
        minimumGradeLetter: 'B+',
        minimumGradeNumeric: 3.3,
        gradingScale: 'UNIV_CGPA_4',
        requiresLaboratory: true,
        acceptedEquivalentSubjects: 'Organic Chemistry, Medicinal Chemistry, Analytical Chemistry',
        notes: 'Laboratory-intensive organic chemistry and biochemistry required.',
      },
      {
        subjectName: 'Biology',
        requirementType: 'MANDATORY',
        minimumGradeLetter: 'B+',
        minimumGradeNumeric: 3.3,
        gradingScale: 'UNIV_CGPA_4',
        acceptedEquivalentSubjects: 'Physiology, Molecular Biology, Pharmacology',
        notes: 'University level cellular/molecular biology or pharmacology.',
      },
    ],
  },

  // 5. Germany - Technical University of Munich (TUM) MSc in Informatics
  {
    universityName: 'Technical University of Munich',
    programName: 'MSc in Informatics',
    countryCode: 'DE',
    countryName: 'Germany',
    degreeLevel: 'MASTER',
    targetQualification: 'MSc in Informatics (Computer Science)',
    overallMinimumGpa: 3.20,
    overallGradingScale: 'UNIV_CGPA_4',
    minBachelorCgpa: 3.20,
    bachelorCgpaScale: 4.0,
    bachelorDegreeTitleRequired: '4-year Bachelor degree in Computer Science, Informatics, or closely related engineering field from an H+ recognized university',
    directEntryAccepted: true,
    researchProposalRequired: false,
    supervisorPreApprovalRequired: false,
    publicationsRequired: false,
    workExperienceMonthsRequired: 0,
    prerequisiteCoursework: 'Curricular analysis requires minimum 28 ECTS in Mathematics (Calculus, Linear Algebra, Discrete Math) and 48 ECTS in Theoretical & Practical Computer Science',
    entranceExamRequired: 'Aptitude Assessment Interview (Stufe 2) for applicants with border scores',
    interviewRequired: false,
    notes: 'Admission via TUM Aptitude Assessment (Eignungsverfahren). Points are awarded based on degree grade and course-by-course curricular alignment with the TUM Bachelor in Informatics curriculum.',
    officialSourceUrl: 'https://www.tum.de/en/studies/degree-programs/detail/informatics-master-of-science-msc',
    sourcePublisher: 'Technical University of Munich TUM School of Computation, Information and Technology',
    subjectRequirements: [
      {
        subjectName: 'Mathematics',
        requirementType: 'MANDATORY',
        minimumGradeLetter: 'B+',
        minimumGradeNumeric: 3.2,
        gradingScale: 'UNIV_CGPA_4',
        acceptedEquivalentSubjects: 'Higher Mathematics, Discrete Structures, Linear Algebra, Probability',
        notes: 'Strict curricular prerequisite: minimum 28 ECTS equivalent in advanced mathematics.',
      },
      {
        subjectName: 'Computer Science',
        requirementType: 'MANDATORY',
        minimumGradeLetter: 'B+',
        minimumGradeNumeric: 3.2,
        gradingScale: 'UNIV_CGPA_4',
        acceptedEquivalentSubjects: 'Data Structures & Algorithms, Computer Architecture, Databases, Operating Systems',
        notes: 'Strict curricular prerequisite: minimum 48 ECTS equivalent in theoretical and practical informatics.',
      },
    ],
  },

  // 6. Australia - University of Melbourne Master of Data Science
  {
    universityName: 'University of Melbourne',
    programName: 'Master of Data Science',
    countryCode: 'AU',
    countryName: 'Australia',
    degreeLevel: 'MASTER',
    targetQualification: 'Master of Data Science',
    overallMinimumGpa: 3.00,
    overallGradingScale: 'UNIV_CGPA_4',
    minBachelorCgpa: 3.00,
    bachelorCgpaScale: 4.0,
    bachelorDegreeTitleRequired: '4-year undergraduate degree with a major in Computer Science, Data Science, Statistics, or equivalent quantitative discipline',
    bachelorClassRequired: 'Weighted Average Mark (WAM) of at least 65% (equivalent to 3.00/4.00 from Bangladesh)',
    directEntryAccepted: true,
    researchProposalRequired: false,
    supervisorPreApprovalRequired: false,
    publicationsRequired: false,
    workExperienceMonthsRequired: 0,
    prerequisiteCoursework: 'At least 12.5 points (1 semester) of university-level Computer Science programming and at least 12.5 points of Calculus & Linear Algebra',
    interviewRequired: false,
    notes: 'Entry is competitive. Meeting minimum thresholds does not guarantee admission. Work experience in statistical data analysis or programming may enhance application profile.',
    officialSourceUrl: 'https://study.unimelb.edu.au/find/courses/graduate/master-of-data-science/',
    sourcePublisher: 'University of Melbourne Faculty of Science Admissions',
    subjectRequirements: [
      {
        subjectName: 'Mathematics',
        requirementType: 'MANDATORY',
        minimumGradeLetter: 'B',
        minimumGradeNumeric: 3.0,
        gradingScale: 'UNIV_CGPA_4',
        acceptedEquivalentSubjects: 'Calculus 2, Linear Algebra, Statistics',
        notes: 'At least 1 university course covering multivariable calculus and matrix operations.',
      },
      {
        subjectName: 'Computer Science',
        requirementType: 'MANDATORY',
        minimumGradeLetter: 'B',
        minimumGradeNumeric: 3.0,
        gradingScale: 'UNIV_CGPA_4',
        acceptedEquivalentSubjects: 'Programming in Python, Java, or C++, Object-Oriented Design',
        notes: 'At least 1 university-level course focused on structured programming.',
      },
    ],
  },

  // 7. Ireland - Trinity College Dublin MSc in Finance
  {
    universityName: 'Trinity College Dublin',
    programName: 'MSc in Finance',
    countryCode: 'IE',
    countryName: 'Ireland',
    degreeLevel: 'MASTER',
    targetQualification: 'MSc in Finance',
    overallMinimumGpa: 3.20,
    overallGradingScale: 'UNIV_CGPA_4',
    minBachelorCgpa: 3.20,
    bachelorCgpaScale: 4.0,
    bachelorDegreeTitleRequired: '4-year Bachelor degree in Business Administration (BBA), Economics, Finance, Mathematics, Engineering, or a quantitative discipline',
    bachelorClassRequired: 'Upper Second Class Honours (2:1 equivalent)',
    directEntryAccepted: true,
    researchProposalRequired: false,
    supervisorPreApprovalRequired: false,
    publicationsRequired: false,
    workExperienceMonthsRequired: 0,
    prerequisiteCoursework: 'Quantitative Methods, Financial Accounting, Microeconomics, Statistics',
    entranceExamRequired: 'GMAT not mandatory but recommended for non-business or quantitative degree holders (600+)',
    interviewRequired: false,
    notes: 'Candidates must demonstrate strong mathematical and quantitative ability in undergraduate coursework. Ranked among top global finance master programs.',
    officialSourceUrl: 'https://www.tcd.ie/courses/postgraduate/courses/finance-msc/',
    sourcePublisher: 'Trinity Business School Postgraduate Admissions',
    subjectRequirements: [
      {
        subjectName: 'Economics',
        requirementType: 'PREFERRED',
        minimumGradeLetter: 'B+',
        minimumGradeNumeric: 3.2,
        gradingScale: 'UNIV_CGPA_4',
        acceptedEquivalentSubjects: 'Microeconomics, Macroeconomics, Financial Economics',
        notes: 'Basic understanding of economic principles is advantageous.',
      },
      {
        subjectName: 'Mathematics',
        requirementType: 'MANDATORY',
        minimumGradeLetter: 'B+',
        minimumGradeNumeric: 3.2,
        gradingScale: 'UNIV_CGPA_4',
        acceptedEquivalentSubjects: 'Business Statistics, Quantitative Methods, Econometrics',
        notes: 'Undergraduate quantitative/statistical coursework with strong grade.',
      },
    ],
  },

  // 8. Ireland - University College Dublin (UCD) BSc in Biomedical, Health & Life Sciences
  {
    universityName: 'University College Dublin',
    programName: 'BSc in Biomedical, Health & Life Sciences',
    countryCode: 'IE',
    countryName: 'Ireland',
    degreeLevel: 'BACHELOR',
    targetQualification: 'BSc in Biomedical, Health and Life Sciences',
    overallMinimumGpa: 4.50,
    overallGradingScale: 'BD_GPA_5',
    minSscGpa: 4.50,
    sscGpaScale: 5.0,
    minHscGpa: 4.50,
    hscGpaScale: 5.0,
    combinedSscHscGpa: 9.00,
    hscStreamRequired: 'SCIENCE',
    acceptedSecondaryBoards: 'Dhaka, Chittagong, Cambridge CIE, Edexcel, IB',
    directEntryAccepted: true,
    interviewRequired: false,
    notes: 'Direct entry from Bangladesh Higher Secondary Certificate (Science) with minimum overall GPA 4.50. Specific laboratory science grades are strictly evaluated.',
    officialSourceUrl: 'https://www.ucd.ie/courses/undergraduate/biomedicalhealthandlifesciences/',
    sourcePublisher: 'UCD School of Medicine & International Undergraduate Admissions',
    subjectRequirements: [
      {
        subjectName: 'Biology',
        requirementType: 'MANDATORY',
        minimumGradeLetter: 'A',
        minimumGradeNumeric: 4.0,
        gradingScale: 'BD_GPA_5',
        academicStream: 'SCIENCE',
        requiresLaboratory: true,
        notes: 'Senior secondary biology with laboratory component completed.',
      },
      {
        subjectName: 'Chemistry',
        requirementType: 'MANDATORY',
        minimumGradeLetter: 'A',
        minimumGradeNumeric: 4.0,
        gradingScale: 'BD_GPA_5',
        academicStream: 'SCIENCE',
        requiresLaboratory: true,
        notes: 'Senior secondary chemistry with laboratory component completed.',
      },
      {
        subjectName: 'Mathematics',
        requirementType: 'MANDATORY',
        minimumGradeLetter: 'A-',
        minimumGradeNumeric: 3.5,
        gradingScale: 'BD_GPA_5',
        academicStream: 'SCIENCE',
        notes: 'Mathematics passed at higher secondary level.',
      },
    ],
  },

  // 9. Lithuania - Vilnius University BSc in Software Engineering
  {
    universityName: 'Vilnius University',
    programName: 'BSc in Software Engineering',
    countryCode: 'LT',
    countryName: 'Lithuania',
    degreeLevel: 'BACHELOR',
    targetQualification: 'Bachelor of Informatics (Software Engineering)',
    overallMinimumGpa: 3.50,
    overallGradingScale: 'BD_GPA_5',
    minSscGpa: 3.00,
    sscGpaScale: 5.0,
    minHscGpa: 3.50,
    hscGpaScale: 5.0,
    hscStreamRequired: 'ANY',
    directEntryAccepted: true,
    interviewRequired: false,
    notes: 'Direct undergraduate entry from Bangladesh Higher Secondary Certificate (HSC) or equivalent. State-recognized Lithuanian university program accredited across the European Higher Education Area (EHEA).',
    officialSourceUrl: 'https://www.vu.lt/en/studies/bachelor-studies/software-engineering',
    sourcePublisher: 'Vilnius University Faculty of Mathematics and Informatics',
    subjectRequirements: [
      {
        subjectName: 'Mathematics',
        requirementType: 'MANDATORY',
        minimumGradeLetter: 'B',
        minimumGradeNumeric: 3.0,
        gradingScale: 'BD_GPA_5',
        notes: 'Senior secondary mathematics passed with at least Grade B (GPA 3.00/5.00).',
      },
      {
        subjectName: 'English',
        requirementType: 'MANDATORY',
        minimumGradeLetter: 'B',
        minimumGradeNumeric: 3.0,
        gradingScale: 'BD_GPA_5',
        notes: 'Proof of English language competence or secondary English score.',
      },
    ],
  },
];
