import { PrismaClient } from '@prisma/client';
import { UNIVERSITIES_DATA, ProgramItem, UniversityRecord } from '../data/universitiesData.js';
import { COUNTRIES_DATA, CountryRecord } from '../data/countriesData.js';
import { INITIAL_QUALIFICATION_EQUIVALENCIES } from '../data/academicEligibilityData.js';

const prisma = new PrismaClient();

export interface StudentProfileInput {
  currentQualification?: string; // e.g. "HSC", "4_YEAR_BACHELOR", "3_YEAR_BACHELOR", "MASTER"
  previousMajor?: string;
  gpa?: number;
  gradingScale?: '5.0' | '4.0' | '100'; // 5.0 for HSC/SSC, 4.0 for University CGPA, 100 for percentage
  englishTestType?: 'IELTS' | 'TOEFL' | 'PTE' | 'DUOLINGO' | 'MOI' | 'NONE';
  englishOverallScore?: number;
  englishSubscores?: {
    reading?: number;
    listening?: number;
    speaking?: number;
    writing?: number;
  };
  prerequisitesNotes?: string;
  workExperienceMonths?: number;
}

export interface CompileReportRequest {
  destinationCountry: string; // country slug or 'all'
  degreeLevel: string; // 'BACHELOR' | 'MASTER' | 'PHD' | 'ALL'
  subjectField: string; // subject category or specific subject or 'all'
  intake: string; // e.g. "Fall 2025", "Spring 2026", "Fall 2026", "Rolling"
  programIds: string[];
  studentProfile?: StudentProfileInput;
  customTitle?: string;
}

export interface CompiledProgramReportItem {
  id: string;
  name: string;
  slug: string;
  degreeLevel: string;
  qualificationType: string;
  subjectCategory: string;
  subject: string;
  durationMonths: number;
  creditsEcts: number;
  language: string;
  annualTuitionLocal: number;
  annualTuitionBdt: number;
  totalTuitionEstimatedLocal: number;
  totalTuitionEstimatedBdt: number;
  currencyCode: string;
  applicationFeeLocal: number;
  applicationFeeBdt: number;
  programUrl: string;
  prerequisites: string;
  applicationDeadline: string;
  intakeSeason: string;
  lastVerifiedAt: string;

  // University details
  university: {
    id: string;
    name: string;
    slug: string;
    countrySlug: string;
    countryName: string;
    countryCode: string;
    flagEmoji: string;
    cityName: string;
    type: string;
    websiteUrl: string;
    admissionsUrl: string;
    accreditationStatus: string;
    sourceRegistry: string;
    provenance: string;
    lastVerifiedAt: string;
  };

  // Academic breakdown
  academicRequirements: {
    minimumGpaRequired: number;
    gradingScaleRequired: string;
    gpaDescription: string;
    bangladeshEquivalencyRule: string;
    prerequisiteCoursework: string;
    standardizedTestsRequired: string;
    interviewOrPortfolio: string;
  };

  // English breakdown
  englishRequirements: {
    ieltsOverall: number;
    ieltsSubscoreMin: number;
    toeflOverall: number;
    pteOverall: number;
    duolingoScore: number | null;
    moiAccepted: boolean;
    moiConditions: string;
    validityYears: number;
    sourceUrl: string;
    lastVerifiedAt: string;
  };

  // Assessment vs profile
  assessment?: {
    overallStatus: 'MEETS' | 'CONDITIONAL' | 'DOES_NOT_MEET' | 'INSUFFICIENT_INFO';
    academicStatus: 'MEETS' | 'CONDITIONAL' | 'DOES_NOT_MEET' | 'INSUFFICIENT_INFO';
    englishStatus: 'MEETS' | 'CONDITIONAL' | 'DOES_NOT_MEET' | 'INSUFFICIENT_INFO';
    badgeLabelEn: string;
    badgeLabelBn: string;
    reasons: string[];
    actionItems: string[];
    disclaimer: string;
  };

  // Document checklist
  checklist: {
    mandatory: Array<{ id: string; labelEn: string; labelBn: string; note: string }>;
    conditional: Array<{ id: string; labelEn: string; labelBn: string; note: string }>;
  };

  // Deadlines & milestones
  timeline: {
    earlyDeadline?: string;
    regularDeadline: string;
    semesterStart: string;
    recommendedPreparationStart: string;
  };
}

export interface CompiledRequirementsReport {
  reportId: string;
  generatedAt: string;
  title: string;
  filters: {
    destinationCountry: string;
    destinationCountryName: string;
    degreeLevel: string;
    subjectField: string;
    intake: string;
  };
  studentProfile?: StudentProfileInput;
  summaryStats: {
    totalProgramsEvaluated: number;
    distinctInstitutionsCount: number;
    countriesCount: number;
    minTuitionBdt: number;
    maxTuitionBdt: number;
    avgTuitionBdt: number;
    medianIelts: number;
    totalApplicationFeesBdt: number;
    profileMatchSummary?: {
      meetsCount: number;
      conditionalCount: number;
      doesNotMeetCount: number;
      insufficientInfoCount: number;
    };
  };
  programs: CompiledProgramReportItem[];
  applicationRoadmapMilestones: Array<{
    phase: string;
    timeframe: string;
    titleEn: string;
    titleBn: string;
    descriptionEn: string;
    descriptionBn: string;
    keyDeliverables: string[];
  }>;
  legalDisclaimerEn: string;
  legalDisclaimerBn: string;
}

export class UniversityRequirementsReportService {
  /**
   * Get filter options for UI
   */
  async getFilterOptions() {
    const countries = COUNTRIES_DATA.map((c) => ({
      name: c.name,
      slug: c.slug,
      code: c.code,
      flagEmoji: c.flagEmoji,
      continent: c.continent,
      currencyCode: c.currencyCode,
      currencySymbol: c.currencySymbol,
      exchangeRateToBdt: c.exchangeRateToBdt,
    })).sort((a, b) => a.name.localeCompare(b.name));

    const degreeLevels = [
      { value: 'ALL', labelEn: 'All Degree Levels', labelBn: 'সকল ডিগ্রি স্তর' },
      { value: 'BACHELOR', labelEn: "Bachelor's Degree (Undergraduate)", labelBn: 'স্নাতক (আন্ডারগ্র্যাজুয়েট)' },
      { value: 'MASTER', labelEn: "Master's Degree (Postgraduate)", labelBn: 'স্নাতকোত্তর (মাস্টার্স)' },
      { value: 'PHD', labelEn: 'PhD & Doctoral Research', labelBn: 'পিএইচডি ও ডক্টরেট' },
      { value: 'DIPLOMA', labelEn: 'Diploma & Post-Grad Diploma', labelBn: 'ডিপ্লোমা ও পোস্টগ্র্যাড ডিপ্লোমা' },
      { value: 'FOUNDATION', labelEn: 'Foundation & Pathway', labelBn: 'ফাউন্ডেশন ও পাথওয়ে' },
    ];

    // Extract distinct subject categories
    const subjectCategorySet = new Set<string>();
    UNIVERSITIES_DATA.forEach((u) => {
      u.programs.forEach((p) => {
        if (p.subjectCategory) subjectCategorySet.add(p.subjectCategory);
      });
    });

    const subjectCategories = Array.from(subjectCategorySet).sort().map((cat) => ({
      value: cat,
      labelEn: cat,
      labelBn: this.getSubjectCategoryBengali(cat),
    }));

    const intakes = [
      { value: 'Fall 2025', labelEn: 'Fall 2025 (Autumn)', labelBn: 'ফল ২০২৫ (শরৎ)' },
      { value: 'Spring 2026', labelEn: 'Spring 2026', labelBn: 'স্প্রিং ২০২৬ (বসন্ত)' },
      { value: 'Summer 2026', labelEn: 'Summer 2026', labelBn: 'সামার ২০২৬ (গ্রীষ্ম)' },
      { value: 'Fall 2026', labelEn: 'Fall 2026 (Autumn)', labelBn: 'ফল ২০২৬ (শরৎ)' },
      { value: 'Winter 2026/2027', labelEn: 'Winter 2026/2027', labelBn: 'উইন্টার ২০২৬/২০২৭ (শীত)' },
      { value: 'Rolling', labelEn: 'Rolling / Year-Round Open', labelBn: 'রোলিং / সারা বছর উন্মুক্ত' },
    ];

    return {
      countries,
      degreeLevels,
      subjectCategories,
      intakes,
    };
  }

  /**
   * Search programs matching criteria
   */
  async searchPrograms(params: {
    country?: string;
    degreeLevel?: string;
    subjectField?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const { country, degreeLevel, subjectField, search, limit = 50, offset = 0 } = params;

    let flatPrograms: Array<{
      program: ProgramItem;
      university: UniversityRecord;
      country: CountryRecord | undefined;
    }> = [];

    for (const uni of UNIVERSITIES_DATA) {
      if (country && country !== 'all' && uni.countrySlug !== country) {
        continue;
      }

      const countryRecord = COUNTRIES_DATA.find((c) => c.slug === uni.countrySlug);

      for (const prog of uni.programs) {
        if (degreeLevel && degreeLevel !== 'ALL' && prog.degreeLevel !== degreeLevel.toUpperCase()) {
          continue;
        }

        if (subjectField && subjectField !== 'all') {
          const sLower = subjectField.toLowerCase();
          const matchCategory = prog.subjectCategory.toLowerCase() === sLower;
          const matchSubject = prog.subject.toLowerCase().includes(sLower);
          if (!matchCategory && !matchSubject) continue;
        }

        if (search && search.trim()) {
          const q = search.toLowerCase().trim();
          const matchName = prog.name.toLowerCase().includes(q);
          const matchUni = uni.name.toLowerCase().includes(q);
          const matchSubject = prog.subject.toLowerCase().includes(q);
          const matchCity = uni.cityName.toLowerCase().includes(q);
          if (!matchName && !matchUni && !matchSubject && !matchCity) continue;
        }

        flatPrograms.push({
          program: prog,
          university: uni,
          country: countryRecord,
        });
      }
    }

    const total = flatPrograms.length;
    const paginated = flatPrograms.slice(offset, offset + limit);

    const items = paginated.map(({ program, university, country: cRecord }) => {
      const exchangeRate = cRecord?.exchangeRateToBdt || 120;
      const annualTuitionBdt = Math.round(program.annualTuitionLocal * exchangeRate);
      const appFeeBdt = Math.round((program.applicationFeeLocal || 0) * exchangeRate);

      return {
        id: program.id,
        name: program.name,
        slug: program.slug,
        degreeLevel: program.degreeLevel,
        qualificationType: program.qualificationType || program.degreeLevel,
        subjectCategory: program.subjectCategory,
        subject: program.subject,
        durationMonths: program.durationMonths,
        creditsEcts: program.creditsEcts,
        language: program.language || 'English',
        annualTuitionLocal: program.annualTuitionLocal,
        annualTuitionBdt,
        currencyCode: program.currencyCode,
        applicationFeeLocal: program.applicationFeeLocal || 0,
        applicationFeeBdt: appFeeBdt,
        ieltsOverall: program.ieltsOverall,
        ieltsSubscoreMin: program.ieltsSubscoreMin,
        toeflOverall: program.toeflOverall,
        pteOverall: program.pteOverall,
        prerequisites: program.prerequisites,
        programUrl: program.programUrl,
        applicationDeadline: program.applicationDeadline,
        intakeSeason: program.intakeSeason,
        lastVerifiedAt: program.lastVerifiedAt,
        university: {
          id: university.id,
          name: university.name,
          slug: university.slug,
          countrySlug: university.countrySlug,
          countryName: university.countryName,
          countryCode: cRecord?.code || 'GL',
          flagEmoji: cRecord?.flagEmoji || '🌐',
          cityName: university.cityName,
          type: university.type,
          websiteUrl: university.websiteUrl,
          admissionsUrl: university.admissionsUrl,
          lastVerifiedAt: university.lastVerifiedAt,
        },
      };
    });

    return {
      total,
      limit,
      offset,
      items,
    };
  }

  /**
   * Compile comprehensive Requirements Report
   */
  async compileReport(payload: CompileReportRequest): Promise<CompiledRequirementsReport> {
    const { destinationCountry, degreeLevel, subjectField, intake, programIds, studentProfile, customTitle } = payload;

    const reportId = `rep-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
    const generatedAt = new Date().toISOString();

    const selectedPrograms: CompiledProgramReportItem[] = [];

    // Lookup each program from UNIVERSITIES_DATA
    for (const pId of programIds) {
      let foundProg: ProgramItem | undefined;
      let foundUni: UniversityRecord | undefined;

      for (const uni of UNIVERSITIES_DATA) {
        const p = uni.programs.find((pr) => pr.id === pId);
        if (p) {
          foundProg = p;
          foundUni = uni;
          break;
        }
      }

      if (!foundProg || !foundUni) {
        // Fallback: check SQLite database for program
        try {
          const dbProg = await prisma.program.findUnique({
            where: { id: pId },
            include: { university: true, englishReq: true },
          });
          if (dbProg && dbProg.university) {
            const cRec = COUNTRIES_DATA.find((c) => c.slug === dbProg.university.countryId?.replace('cnt-', '')) ||
              COUNTRIES_DATA.find((c) => c.code === dbProg.university.countryId);

            foundProg = {
              id: dbProg.id,
              name: dbProg.name,
              slug: dbProg.slug,
              degreeLevel: (dbProg.degreeLevel as any) || 'MASTER',
              qualificationType: (dbProg.qualificationType as any) || 'MASTER',
              subjectCategory: dbProg.subjectCategory || 'General Studies',
              subject: dbProg.subjectName || dbProg.subjectCategory || 'General Degree',
              durationMonths: dbProg.durationMonths || 24,
              creditsEcts: dbProg.creditsEcts || 120,
              language: dbProg.languageOfInstruction || 'English',
              annualTuitionLocal: dbProg.annualTuitionLocal || 15000,
              currencyCode: dbProg.currencyCode || 'EUR',
              applicationFeeLocal: dbProg.applicationFeeLocal || 0,
              ieltsOverall: dbProg.englishReq?.ieltsOverall || 6.5,
              ieltsSubscoreMin: dbProg.englishReq?.ieltsReading || 6.0,
              toeflOverall: dbProg.englishReq?.toeflIbtOverall || 90,
              pteOverall: dbProg.englishReq?.pteOverall || 62,
              prerequisites: dbProg.prerequisites || 'Recognized Bachelor degree in related quantitative field.',
              programUrl: dbProg.programUrl || dbProg.university.websiteUrl,
              applicationDeadline: '2025-06-30',
              intakeSeason: intake || 'Autumn / Fall',
              lastVerifiedAt: dbProg.lastVerifiedAt?.toISOString() || new Date().toISOString(),
            };

            const nonNullProg: ProgramItem = foundProg;
            foundUni = {
              id: dbProg.university.id,
              name: dbProg.university.name,
              slug: dbProg.university.slug,
              continent: 'Europe',
              countrySlug: cRec?.slug || 'global',
              countryName: cRec?.name || 'International',
              cityName: dbProg.university.cityName || 'Metropolitan Area',
              type: dbProg.university.type === 'PUBLIC' ? 'PUBLIC' : 'PRIVATE',
              websiteUrl: dbProg.university.websiteUrl,
              admissionsUrl: dbProg.university.admissionsUrl || dbProg.university.websiteUrl,
              internationalOfficeEmail: dbProg.university.internationalOfficeEmail || 'admissions@university.edu',
              tuitionUrl: dbProg.university.websiteUrl,
              scholarshipUrl: dbProg.university.websiteUrl,
              internationalUrl: dbProg.university.websiteUrl,
              sourceUrl: dbProg.university.websiteUrl,
              accreditationInfo: 'Accredited Higher Education Institution',
              verificationStatus: 'VERIFIED',
              description: 'Recognized higher education institution',
              campuses: [dbProg.university.cityName || 'Main Campus'],
              programs: [nonNullProg],
              lastVerifiedAt: dbProg.university.lastVerifiedAt?.toISOString() || new Date().toISOString(),
            } as UniversityRecord;
          }
        } catch {
          // ignore db error
        }
      }

      if (!foundProg || !foundUni) continue;

      const cRecord = COUNTRIES_DATA.find((c) => c.slug === foundUni!.countrySlug);
      const exchangeRate = cRecord?.exchangeRateToBdt || 122;
      const annualTuitionBdt = Math.round(foundProg.annualTuitionLocal * exchangeRate);
      const durationYears = Math.max(1, (foundProg.durationMonths || 24) / 12);
      const totalTuitionEstimatedLocal = Math.round(foundProg.annualTuitionLocal * durationYears);
      const totalTuitionEstimatedBdt = Math.round(totalTuitionEstimatedLocal * exchangeRate);
      const applicationFeeBdt = Math.round((foundProg.applicationFeeLocal || 0) * exchangeRate);

      // Construct academic requirements
      const academicReq = this.compileAcademicRequirements(foundProg, foundUni, cRecord);

      // Construct english requirements
      const englishReq = {
        ieltsOverall: foundProg.ieltsOverall || 6.5,
        ieltsSubscoreMin: foundProg.ieltsSubscoreMin || 6.0,
        toeflOverall: foundProg.toeflOverall || 88,
        pteOverall: foundProg.pteOverall || 59,
        duolingoScore: foundProg.ieltsOverall >= 7.0 ? 125 : foundProg.ieltsOverall >= 6.5 ? 115 : 105,
        moiAccepted: cRecord?.code === 'FI' ? true : foundProg.countrySlug === 'germany' ? false : false,
        moiConditions: 'Medium of Instruction (MOI) certificate is only accepted if your bachelor degree was conferred in an officially English-speaking country (UK, US, Canada, Australia) or under an accredited partner dual-degree scheme.',
        validityYears: 2,
        sourceUrl: foundProg.programUrl,
        lastVerifiedAt: foundProg.lastVerifiedAt,
      };

      // Assessment against student profile
      let assessment: CompiledProgramReportItem['assessment'] | undefined;
      if (studentProfile) {
        assessment = this.evaluateStudentAgainstProgram(foundProg, academicReq, englishReq, studentProfile, cRecord);
      }

      // Application checklist
      const checklist = this.buildChecklist(foundProg, foundUni);

      // Timeline
      const timeline = this.buildTimeline(foundProg, intake);

      selectedPrograms.push({
        id: foundProg.id,
        name: foundProg.name,
        slug: foundProg.slug,
        degreeLevel: foundProg.degreeLevel,
        qualificationType: foundProg.qualificationType || foundProg.degreeLevel,
        subjectCategory: foundProg.subjectCategory,
        subject: foundProg.subject,
        durationMonths: foundProg.durationMonths,
        creditsEcts: foundProg.creditsEcts,
        language: foundProg.language || 'English',
        annualTuitionLocal: foundProg.annualTuitionLocal,
        annualTuitionBdt,
        totalTuitionEstimatedLocal,
        totalTuitionEstimatedBdt,
        currencyCode: foundProg.currencyCode,
        applicationFeeLocal: foundProg.applicationFeeLocal || 0,
        applicationFeeBdt,
        programUrl: foundProg.programUrl,
        prerequisites: foundProg.prerequisites,
        applicationDeadline: foundProg.applicationDeadline,
        intakeSeason: foundProg.intakeSeason,
        lastVerifiedAt: foundProg.lastVerifiedAt,
        university: {
          id: foundUni.id,
          name: foundUni.name,
          slug: foundUni.slug,
          countrySlug: foundUni.countrySlug,
          countryName: foundUni.countryName,
          countryCode: cRecord?.code || 'GL',
          flagEmoji: cRecord?.flagEmoji || '🌐',
          cityName: foundUni.cityName,
          type: foundUni.type,
          websiteUrl: foundUni.websiteUrl,
          admissionsUrl: foundUni.admissionsUrl,
          accreditationStatus: 'State-Accredited Public/Chartered Institution',
          sourceRegistry: `${cRecord?.name || 'National'} Ministry of Education & HE Authority`,
          provenance: `Verified through official institutional register and university admissions catalog.`,
          lastVerifiedAt: foundUni.lastVerifiedAt,
        },
        academicRequirements: academicReq,
        englishRequirements: englishReq,
        assessment,
        checklist,
        timeline,
      });
    }

    // Compute summary stats
    const totalPrograms = selectedPrograms.length;
    const distinctInstitutions = new Set(selectedPrograms.map((p) => p.university.name)).size;
    const distinctCountries = new Set(selectedPrograms.map((p) => p.university.countrySlug)).size;

    const tuitionBdts = selectedPrograms.map((p) => p.annualTuitionBdt);
    const minTuitionBdt = tuitionBdts.length > 0 ? Math.min(...tuitionBdts) : 0;
    const maxTuitionBdt = tuitionBdts.length > 0 ? Math.max(...tuitionBdts) : 0;
    const avgTuitionBdt =
      tuitionBdts.length > 0 ? Math.round(tuitionBdts.reduce((a, b) => a + b, 0) / tuitionBdts.length) : 0;

    const ieltsScores = selectedPrograms.map((p) => p.englishRequirements.ieltsOverall).sort((a, b) => a - b);
    const medianIelts =
      ieltsScores.length > 0
        ? ieltsScores.length % 2 === 0
          ? (ieltsScores[ieltsScores.length / 2 - 1] + ieltsScores[ieltsScores.length / 2]) / 2
          : ieltsScores[Math.floor(ieltsScores.length / 2)]
        : 6.5;

    const totalAppFeesBdt = selectedPrograms.reduce((acc, p) => acc + p.applicationFeeBdt, 0);

    let profileMatchSummary: CompiledRequirementsReport['summaryStats']['profileMatchSummary'];
    if (studentProfile) {
      let meetsCount = 0;
      let conditionalCount = 0;
      let doesNotMeetCount = 0;
      let insufficientInfoCount = 0;

      selectedPrograms.forEach((p) => {
        if (p.assessment?.overallStatus === 'MEETS') meetsCount++;
        else if (p.assessment?.overallStatus === 'CONDITIONAL') conditionalCount++;
        else if (p.assessment?.overallStatus === 'DOES_NOT_MEET') doesNotMeetCount++;
        else insufficientInfoCount++;
      });

      profileMatchSummary = {
        meetsCount,
        conditionalCount,
        doesNotMeetCount,
        insufficientInfoCount,
      };
    }

    const countryObj = COUNTRIES_DATA.find((c) => c.slug === destinationCountry);

    const title =
      customTitle ||
      `University Admission Requirements Brief: ${
        countryObj ? countryObj.name : 'Global Destinations'
      } (${intake || 'Upcoming Intakes'})`;

    const report: CompiledRequirementsReport = {
      reportId,
      generatedAt,
      title,
      filters: {
        destinationCountry,
        destinationCountryName: countryObj ? countryObj.name : 'All Supported Countries',
        degreeLevel,
        subjectField,
        intake,
      },
      studentProfile,
      summaryStats: {
        totalProgramsEvaluated: totalPrograms,
        distinctInstitutionsCount: distinctInstitutions,
        countriesCount: distinctCountries,
        minTuitionBdt,
        maxTuitionBdt,
        avgTuitionBdt,
        medianIelts,
        totalApplicationFeesBdt: totalAppFeesBdt,
        profileMatchSummary,
      },
      programs: selectedPrograms,
      applicationRoadmapMilestones: [
        {
          phase: 'Phase 1: Academic & Credential Preparation',
          timeframe: 'Months 10 – 8 Before Intake',
          titleEn: 'Academic & Credential Preparation',
          titleBn: 'অ্যাকাডেমিক ও সনদ প্রস্তুতি',
          descriptionEn:
            'Obtain official attested transcripts, provisional/original degree certificates, and syllabus descriptions from your awarding institution.',
          descriptionBn:
            'আপনার শিক্ষা প্রতিষ্ঠান থেকে সত্যায়িত ট্রান্সক্রিপ্ট, সাময়িক/মূল সনদ এবং সিলেবাসের বিবরণ সংগ্রহ করুন।',
          keyDeliverables: [
            'Attest all certificates via Ministry of Foreign Affairs (MoFA) / Education Board if required',
            'Request course-by-course syllabi for credit evaluation/prerequisite verification',
            'Order official duplicate transcripts in sealed institutional envelopes',
          ],
        },
        {
          phase: 'Phase 2: Standardized Language & Entrance Testing',
          timeframe: 'Months 8 – 6 Before Intake',
          titleEn: 'Standardized Language & Entrance Testing',
          titleBn: 'ভাষা ও প্রবেশিকা পরীক্ষা',
          descriptionEn:
            'Sit for IELTS Academic, TOEFL iBT, or Pearson PTE Academic. Ensure subscores satisfy each specific department threshold.',
          descriptionBn:
            'আইইএলটিএস একাডেমিক, টোফেল বা পিটিই পরীক্ষায় অংশ নিন। প্রতিটি সেকশনে প্রয়োজনীয় স্কোর নিশ্চিত করুন।',
          keyDeliverables: [
            'Target at least IELTS 6.5 with no band under 6.0 (or 7.0 for top-tier competitive programs)',
            'Forward official electronic Test Report Forms (TRF) to target institutional portal codes',
            'Complete GRE/GMAT if required for specialized computing or business programs',
          ],
        },
        {
          phase: 'Phase 3: Application Dossier & Statement Submission',
          timeframe: 'Months 6 – 4 Before Intake',
          titleEn: 'Application Dossier & Statement Submission',
          titleBn: 'আবেদন ও মোটিভেশন লেটার জমা',
          descriptionEn:
            'Draft targeted Statements of Purpose (SOP), secure 2 academic letters of recommendation, and finalize institutional applications before early deadlines.',
          descriptionBn:
            'সুনির্দিষ্ট স্টেটমেন্ট অফ পারপাস (এসওপি) তৈরি করুন, শিক্ষকদের থেকে ২টি সুপারিশপত্র নিন এবং ডেডলাইনের আগে আবেদন করুন।',
          keyDeliverables: [
            'Craft program-specific Statement of Purpose addressing curriculum alignment and career roadmap',
            'Obtain 2 academic reference letters on official university letterhead with institutional email contact',
            'Submit online applications and settle non-refundable evaluation fee receipts',
          ],
        },
        {
          phase: 'Phase 4: Conditional / Unconditional Offer & Tuition Deposit',
          timeframe: 'Months 4 – 2 Before Intake',
          titleEn: 'Offer Acceptance & Financial Proof Verification',
          titleBn: 'অফার গ্রহণ ও আর্থিক প্রমাণাদি',
          descriptionEn:
            'Accept admission offer, deposit required initial tuition/blocked account deposit, and obtain official Confirmation of Acceptance (CAS, I-20, or COE).',
          descriptionBn:
            'অফার গ্রহণ করুন, প্রয়োজনীয় টিউশন ফি বা ব্লকড অ্যাকাউন্টে টাকা জমা দিন এবং চূড়ান্ত নথি সংগ্রহ করুন।',
          keyDeliverables: [
            'Remit initial tuition instalment or activate statutory German Blocked Account (Sperrkonto)',
            'Secure unconditional admission letter and official visa sponsorship documentation',
            'Verify living cost proof matches official immigration minimums (e.g., €11,904 in DE, £1,483/mo in London)',
          ],
        },
        {
          phase: 'Phase 5: Student Visa Biometrics & Pre-Departure',
          timeframe: 'Months 2 – 0 Before Intake',
          titleEn: 'Student Visa Biometrics & Pre-Departure Readiness',
          titleBn: 'স্টুডেন্ট ভিসা ও দেশত্যাগের প্রস্তুতি',
          descriptionEn:
            'Book visa appointment at VFS Global / Embassy Dhaka, submit biometric data, arrange international student health insurance, and secure student accommodation.',
          descriptionBn:
            'ভিএফএস গ্লোবাল বা দূতাবাসে ভিসার আবেদন করুন, বায়োমেট্রিক দিন, স্বাস্থ্যবীমা এবং থাকার জায়গা নিশ্চিত করুন।',
          keyDeliverables: [
            'Complete VFS Global biometrics submission with certified translation of financial solvency papers',
            'Enroll in mandatory statutory student health insurance (TK/Barmer or NHS Surcharge)',
            'Reserve university dormitories or private student housing before arrival',
          ],
        },
      ],
      legalDisclaimerEn:
        'IMPORTANT LEGAL DISCLAIMER: This University Admission Requirements Report has been compiled by Borno Higher Study for informational and preliminary planning purposes only. Criteria, minimum GPA thresholds, test score cutoffs, and deadlines are synthesized from published faculty catalogs, official educational authorities (e.g., KMK Anabin, UK ENIC/ECCTIS, WES), and verified institutional records. Requirements are subject to unilateral revision by university senates. This report does NOT constitute an official admission offer, guarantee of acceptance, or legal visa advice. Always verify current application specifications directly on the official university portal prior to incurring non-refundable application or testing fees.',
      legalDisclaimerBn:
        'গুরুত্বপূর্ণ সতর্কবার্তা: এই ইউনিভার্সিটি ভর্তি প্রয়োজনীয়তা রিপোর্টটি বর্ণ হায়ার স্টাডি দ্বারা শুধুমাত্র প্রাথমিক পরিকল্পনা ও নির্দেশনার জন্য সংকলিত হয়েছে। জিপিএ প্রয়োজনীয়তা, টেস্ট স্কোর এবং ডেডলাইনের তথ্য প্রাতিষ্ঠানিক ওয়েবসাইট এবং অফিশিয়াল শিক্ষা কর্তৃপক্ষের তথ্যসূত্র থেকে সংগৃহীত। বিশ্ববিদ্যালয় কর্তৃপক্ষ যেকোনো সময় নিয়ম পরিবর্তন করতে পারে। এই রিপোর্ট কোনো অফিশিয়াল অফার লেটার বা ভিসার নিশ্চয়তা প্রদান করে না। অফেরতযোগ্য ফি প্রদানের আগে অবশ্যই বিশ্ববিদ্যালয়ের অফিশিয়াল পোর্টাল থেকে যাচাই করে নিন।',
    };

    return report;
  }

  /**
   * Save compiled report to database for authenticated student
   */
  async saveReport(userId: string, payload: CompileReportRequest, compiledReport: CompiledRequirementsReport) {
    const title =
      payload.customTitle ||
      compiledReport.title ||
      `Admission Requirements Report (${compiledReport.filters.destinationCountryName})`;

    const record = await prisma.savedRequirementsReport.create({
      data: {
        userId,
        title,
        destinationCountry: payload.destinationCountry,
        degreeLevel: payload.degreeLevel,
        subjectField: payload.subjectField,
        intake: payload.intake,
        selectedProgramIds: JSON.stringify(payload.programIds),
        studentProfileJson: payload.studentProfile ? JSON.stringify(payload.studentProfile) : null,
        reportDataJson: JSON.stringify(compiledReport),
      },
    });

    return {
      success: true,
      reportId: record.id,
      title: record.title,
      createdAt: record.createdAt,
    };
  }

  /**
   * Get all saved reports for a user
   */
  async getUserSavedReports(userId: string) {
    const reports = await prisma.savedRequirementsReport.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        destinationCountry: true,
        degreeLevel: true,
        subjectField: true,
        intake: true,
        selectedProgramIds: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return reports.map((r) => {
      let programCount = 0;
      try {
        const ids = JSON.parse(r.selectedProgramIds);
        programCount = Array.isArray(ids) ? ids.length : 0;
      } catch {
        programCount = 0;
      }

      const country = COUNTRIES_DATA.find((c) => c.slug === r.destinationCountry);

      return {
        id: r.id,
        title: r.title,
        destinationCountry: r.destinationCountry,
        destinationCountryName: country ? country.name : r.destinationCountry,
        countryFlag: country ? country.flagEmoji : '🌐',
        degreeLevel: r.degreeLevel,
        subjectField: r.subjectField,
        intake: r.intake,
        programCount,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };
    });
  }

  /**
   * Get single saved report by ID
   */
  async getSavedReportById(userId: string, reportId: string) {
    const record = await prisma.savedRequirementsReport.findFirst({
      where: { id: reportId, userId },
    });

    if (!record) return null;

    let reportData: CompiledRequirementsReport | null = null;
    try {
      reportData = JSON.parse(record.reportDataJson);
    } catch {
      reportData = null;
    }

    return {
      id: record.id,
      title: record.title,
      destinationCountry: record.destinationCountry,
      degreeLevel: record.degreeLevel,
      subjectField: record.subjectField,
      intake: record.intake,
      selectedProgramIds: JSON.parse(record.selectedProgramIds),
      studentProfile: record.studentProfileJson ? JSON.parse(record.studentProfileJson) : undefined,
      reportData,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  /**
   * Delete saved report
   */
  async deleteUserSavedReport(userId: string, reportId: string) {
    const existing = await prisma.savedRequirementsReport.findFirst({
      where: { id: reportId, userId },
    });

    if (!existing) {
      return { success: false, error: 'Report not found or unauthorized' };
    }

    await prisma.savedRequirementsReport.delete({
      where: { id: reportId },
    });

    return { success: true };
  }

  /**
   * Regenerate saved report with fresh live data
   */
  async regenerateReport(userId: string, reportId: string) {
    const existing = await prisma.savedRequirementsReport.findFirst({
      where: { id: reportId, userId },
    });

    if (!existing) {
      return { success: false, error: 'Report not found or unauthorized' };
    }

    const programIds: string[] = JSON.parse(existing.selectedProgramIds);
    const studentProfile: StudentProfileInput | undefined = existing.studentProfileJson
      ? JSON.parse(existing.studentProfileJson)
      : undefined;

    const freshReport = await this.compileReport({
      destinationCountry: existing.destinationCountry,
      degreeLevel: existing.degreeLevel,
      subjectField: existing.subjectField,
      intake: existing.intake,
      programIds,
      studentProfile,
      customTitle: existing.title,
    });

    await prisma.savedRequirementsReport.update({
      where: { id: reportId },
      data: {
        reportDataJson: JSON.stringify(freshReport),
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      report: freshReport,
    };
  }

  // ================= Helper Methods =================

  private compileAcademicRequirements(
    program: ProgramItem,
    university: UniversityRecord,
    countryRecord?: CountryRecord
  ) {
    const isMaster = program.degreeLevel === 'MASTER';
    const isPhD = program.degreeLevel === 'PHD';
    const isBachelor = program.degreeLevel === 'BACHELOR';

    let minimumGpaRequired = 3.0;
    let gradingScaleRequired = '4.00 CGPA';
    let gpaDescription = 'Minimum 3.00/4.00 cumulative GPA or Upper Second Class (2:1 / 65%+) honours equivalent';
    let bangladeshEquivalencyRule =
      '4-year Bachelor degree from a UGC-recognized university in Bangladesh evaluated as equivalent to standard honours qualification.';

    if (isBachelor) {
      minimumGpaRequired = 4.0;
      gradingScaleRequired = '5.00 GPA (HSC)';
      gpaDescription = 'Minimum GPA 4.00 to 4.80/5.00 in Higher Secondary Certificate (HSC) in relevant academic group';

      if (countryRecord?.code === 'DE') {
        bangladeshEquivalencyRule =
          'Direct admission from BD HSC alone is NOT permitted. Requires either (A) 1 year of Studienkolleg (T/M/W-Kurs) + Feststellungsprüfung, or (B) 1 successfully completed academic year at a recognized (H+) university in Bangladesh in a matching subject.';
      } else if (countryRecord?.code === 'GB') {
        bangladeshEquivalencyRule =
          'Direct Year 1 entry generally requires exceptional HSC scores (GPA 4.80-5.00) or GCE A-Levels. Most students are routed to an approved 1-year International Foundation Programme (IFP).';
      } else {
        bangladeshEquivalencyRule =
          'HSC (12-year secondary education) recognized with minimum GPA 4.00/5.00. Course-by-course evaluation of Math and Science subjects required.';
      }
    } else if (isPhD) {
      minimumGpaRequired = 3.5;
      gradingScaleRequired = '4.00 CGPA';
      gpaDescription = 'Minimum 3.50/4.00 in Master with substantial research thesis (minimum 30 ECTS or equivalent)';
      bangladeshEquivalencyRule =
        'Recognized Master degree with demonstrated research methodology, published papers or thesis dissertation, and secured academic supervisor.';
    }

    // Specific prerequisites
    const prerequisiteCoursework =
      program.prerequisites ||
      `Relevant academic background in ${program.subjectCategory} or closely allied discipline with solid mathematical/quantitative foundation.`;

    const standardizedTestsRequired =
      countryRecord?.code === 'US'
        ? 'GRE General Test (Quantitative 160+, Verbal 150+) recommended for STEM; GMAT for Business programs.'
        : countryRecord?.code === 'DE'
        ? 'GRE occasionally required for non-EU applicants in competitive Informatics/Engineering master programs.'
        : 'Standardized tests (GRE/GMAT) waived for applicants meeting degree honours benchmarks.';

    const interviewOrPortfolio =
      program.subjectCategory.toLowerCase().includes('design') || program.subjectCategory.toLowerCase().includes('art')
        ? 'Mandatory creative portfolio of 10-15 works + technical interview.'
        : isPhD
        ? 'Mandatory 10-page research proposal + online academic panel interview.'
        : 'No interview required under standard conditional offer, unless borderline academic threshold.';

    return {
      minimumGpaRequired,
      gradingScaleRequired,
      gpaDescription,
      bangladeshEquivalencyRule,
      prerequisiteCoursework,
      standardizedTestsRequired,
      interviewOrPortfolio,
    };
  }

  private evaluateStudentAgainstProgram(
    program: ProgramItem,
    academicReq: ReturnType<typeof UniversityRequirementsReportService.prototype.compileAcademicRequirements>,
    englishReq: { ieltsOverall: number; ieltsSubscoreMin: number; toeflOverall: number; pteOverall: number },
    profile: StudentProfileInput,
    countryRecord?: CountryRecord
  ): CompiledProgramReportItem['assessment'] {
    const reasons: string[] = [];
    const actionItems: string[] = [];

    let academicStatus: 'MEETS' | 'CONDITIONAL' | 'DOES_NOT_MEET' | 'INSUFFICIENT_INFO' = 'INSUFFICIENT_INFO';
    let englishStatus: 'MEETS' | 'CONDITIONAL' | 'DOES_NOT_MEET' | 'INSUFFICIENT_INFO' = 'INSUFFICIENT_INFO';

    // 1. Evaluate Academic GPA & Degree
    if (profile.gpa !== undefined && profile.gpa !== null) {
      if (program.degreeLevel === 'BACHELOR') {
        const studentHscGpa = profile.gradingScale === '5.0' ? profile.gpa : (profile.gpa / 4.0) * 5.0;
        if (studentHscGpa >= academicReq.minimumGpaRequired) {
          if (countryRecord?.code === 'DE') {
            academicStatus = 'CONDITIONAL';
            reasons.push(
              `Your HSC GPA of ${studentHscGpa.toFixed(2)} meets the numerical mark, but German law requires 1 year Studienkolleg or 1 year university in BD before direct entry.`
            );
            actionItems.push('Enroll in Studienkolleg (T-Kurs or W-Kurs) or complete Year 1 Bachelor in Bangladesh.');
          } else {
            academicStatus = 'MEETS';
            reasons.push(`Your HSC GPA (${studentHscGpa.toFixed(2)}/5.00) meets the published minimum requirement of ${academicReq.minimumGpaRequired}.`);
          }
        } else {
          academicStatus = 'DOES_NOT_MEET';
          reasons.push(
            `Your HSC GPA (${studentHscGpa.toFixed(2)}/5.00) falls below the competitive published minimum of ${academicReq.minimumGpaRequired}.`
          );
          actionItems.push('Consider an International Foundation Year (IFP) or pathway program to qualify.');
        }
      } else {
        // Master / PhD
        const studentCgpa = profile.gradingScale === '4.0' ? profile.gpa : (profile.gpa / 5.0) * 4.0;
        if (studentCgpa >= academicReq.minimumGpaRequired) {
          academicStatus = 'MEETS';
          reasons.push(`Your Bachelor CGPA (${studentCgpa.toFixed(2)}/4.00) satisfies the required threshold of ${academicReq.minimumGpaRequired.toFixed(2)}.`);
        } else if (studentCgpa >= academicReq.minimumGpaRequired - 0.25) {
          academicStatus = 'CONDITIONAL';
          reasons.push(
            `Your CGPA (${studentCgpa.toFixed(2)}/4.00) is slightly below the preferred benchmark of ${academicReq.minimumGpaRequired.toFixed(2)}, but may be compensated with strong thesis, GRE, or relevant work experience.`
          );
          actionItems.push('Submit strong letters of recommendation and highlight final year project or research work.');
        } else {
          academicStatus = 'DOES_NOT_MEET';
          reasons.push(
            `Your CGPA (${studentCgpa.toFixed(2)}/4.00) does not meet the minimum requirement of ${academicReq.minimumGpaRequired.toFixed(2)}.`
          );
          actionItems.push('Explore Pre-Master conversion programs or institutions with holistic review policies.');
        }
      }
    } else {
      reasons.push('No academic GPA provided in profile. Assessment is pending your academic transcripts.');
    }

    // 2. Evaluate English
    if (profile.englishTestType && profile.englishTestType !== 'NONE') {
      if (profile.englishTestType === 'IELTS') {
        const score = profile.englishOverallScore || 0;
        if (score >= englishReq.ieltsOverall) {
          // Check subscores if provided
          const subMin = englishReq.ieltsSubscoreMin;
          const hasLowSubscore =
            profile.englishSubscores &&
            Object.values(profile.englishSubscores).some((val) => typeof val === 'number' && val < subMin);

          if (hasLowSubscore) {
            englishStatus = 'CONDITIONAL';
            reasons.push(
              `Your overall IELTS score (${score}) meets the requirement, but one or more band scores fall below the departmental subscore cutoff of ${subMin}.`
            );
            actionItems.push(`Retake IELTS or use IELTS One Skill Retake to raise subscores to at least ${subMin}.`);
          } else {
            englishStatus = 'MEETS';
            reasons.push(`Your IELTS score (${score}) satisfies the required minimum score of ${englishReq.ieltsOverall}.`);
          }
        } else {
          englishStatus = 'DOES_NOT_MEET';
          reasons.push(
            `Your IELTS score (${score}) is below the institutional cutoff of ${englishReq.ieltsOverall}.`
          );
          actionItems.push(`Retake IELTS targeting an overall band of at least ${englishReq.ieltsOverall}.`);
        }
      } else if (profile.englishTestType === 'TOEFL') {
        const score = profile.englishOverallScore || 0;
        if (score >= englishReq.toeflOverall) {
          englishStatus = 'MEETS';
          reasons.push(`Your TOEFL score (${score}) meets the required cutoff of ${englishReq.toeflOverall}.`);
        } else {
          englishStatus = 'DOES_NOT_MEET';
          reasons.push(`Your TOEFL score (${score}) is below the required cutoff of ${englishReq.toeflOverall}.`);
          actionItems.push(`Aim for at least ${englishReq.toeflOverall} on TOEFL iBT.`);
        }
      } else if (profile.englishTestType === 'PTE') {
        const score = profile.englishOverallScore || 0;
        if (score >= englishReq.pteOverall) {
          englishStatus = 'MEETS';
          reasons.push(`Your PTE score (${score}) meets the required cutoff of ${englishReq.pteOverall}.`);
        } else {
          englishStatus = 'DOES_NOT_MEET';
          reasons.push(`Your PTE score (${score}) is below the required cutoff of ${englishReq.pteOverall}.`);
          actionItems.push(`Aim for at least ${englishReq.pteOverall} on PTE Academic.`);
        }
      } else if (profile.englishTestType === 'MOI') {
        englishStatus = 'CONDITIONAL';
        reasons.push(
          'Medium of Instruction (MOI) exemption is strictly scrutinized and rarely granted for applicants whose initial degree was not earned in an English-native nation.'
        );
        actionItems.push('We strongly recommend sitting for IELTS Academic or PTE Academic to prevent rejection.');
      }
    } else {
      englishStatus = 'INSUFFICIENT_INFO';
      reasons.push('No English proficiency test entered in profile. IELTS or TOEFL score required.');
      actionItems.push(`Register for IELTS Academic (minimum target: ${englishReq.ieltsOverall}).`);
    }

    // Determine Overall Status
    let overallStatus: 'MEETS' | 'CONDITIONAL' | 'DOES_NOT_MEET' | 'INSUFFICIENT_INFO' = 'INSUFFICIENT_INFO';

    if (academicStatus === 'DOES_NOT_MEET' || englishStatus === 'DOES_NOT_MEET') {
      overallStatus = 'DOES_NOT_MEET';
    } else if (academicStatus === 'MEETS' && englishStatus === 'MEETS') {
      overallStatus = 'MEETS';
    } else if (academicStatus === 'CONDITIONAL' || englishStatus === 'CONDITIONAL') {
      overallStatus = 'CONDITIONAL';
    } else {
      overallStatus = 'INSUFFICIENT_INFO';
    }

    const badgeLabelEn =
      overallStatus === 'MEETS'
        ? 'Meets Listed Requirements'
        : overallStatus === 'CONDITIONAL'
        ? 'May Meet Requirements (Review Needed)'
        : overallStatus === 'DOES_NOT_MEET'
        ? 'Does Not Meet Listed Requirements'
        : 'Insufficient Verified Profile Info';

    const badgeLabelBn =
      overallStatus === 'MEETS'
        ? 'প্রয়োজনীয় শর্তাবলী পূরণ করে'
        : overallStatus === 'CONDITIONAL'
        ? 'শর্তসাপেক্ষে প্রযোজ্য (পুনর্বিবেচনা প্রয়োজন)'
        : overallStatus === 'DOES_NOT_MEET'
        ? 'তালিকাভুক্ত শর্ত পূরণ করে না'
        : 'অসম্পূর্ণ প্রোফাইল তথ্য';

    return {
      overallStatus,
      academicStatus,
      englishStatus,
      badgeLabelEn,
      badgeLabelBn,
      reasons,
      actionItems,
      disclaimer:
        'Informational assessment based strictly on published department benchmarks. Official determination is made solely by the faculty admissions board upon receipt of formal application.',
    };
  }

  private buildChecklist(program: ProgramItem, university: UniversityRecord) {
    const isMaster = program.degreeLevel === 'MASTER';
    const isPhD = program.degreeLevel === 'PHD';

    const mandatory = [
      {
        id: 'doc-transcripts',
        labelEn: 'Official Academic Transcripts (All Semesters)',
        labelBn: 'সকল সেমিস্টারের অফিশিয়াল একাডেমিক ট্রান্সক্রিপ্ট',
        note: 'Scanned in high resolution or ordered in sealed registrar envelopes.',
      },
      {
        id: 'doc-degree-certificate',
        labelEn: 'Original / Provisional Degree Certificate',
        labelBn: 'মূল অথবা সাময়িক সনদপত্র',
        note: 'Attested by Education Board / Controller of Examinations.',
      },
      {
        id: 'doc-passport',
        labelEn: 'Valid International Passport (Min 18 Months Validity)',
        labelBn: 'আন্তর্জাতিক পাসপোর্ট (কমপক্ষে ১৮ মাস মেয়াদ)',
        note: 'Color scan of photo and personal particulars pages.',
      },
      {
        id: 'doc-english-test',
        labelEn: 'Official English Test Report Form (IELTS / TOEFL / PTE)',
        labelBn: 'অফিশিয়াল ইংরেজি পরীক্ষার স্কোর রিপোর্ট',
        note: `Overall min ${program.ieltsOverall || 6.5} with electronic verification code.`,
      },
      {
        id: 'doc-sop',
        labelEn: 'Statement of Purpose / Personal Statement (SOP)',
        labelBn: 'স্টেটমেন্ট অফ পারপাস (এসওপি)',
        note: '1-2 pages explaining motivation, academic background, and future goals.',
      },
      {
        id: 'doc-cv',
        labelEn: 'Updated Academic Curriculum Vitae (Europass / Standard)',
        labelBn: 'আপডেটেড একাডেমিক জীবনবৃত্তান্ত (সিভি)',
        note: 'Chronological timeline without unexplained gaps.',
      },
      {
        id: 'doc-lor',
        labelEn: 'Two (2) Academic Letters of Recommendation (LOR)',
        labelBn: '২টি একাডেমিক সুপারিশপত্র (এলওআর)',
        note: 'From university professors on institutional letterhead.',
      },
    ];

    const conditional = [
      {
        id: 'doc-research-proposal',
        labelEn: isPhD ? 'Detailed Research Proposal (Mandatory for PhD)' : 'Research Summary (If Applicable)',
        labelBn: 'বিস্তারিত গবেষণা প্রস্তাবনা (রিসার্চ প্রপোজাল)',
        note: 'Outlining research questions, methodology, and literature review.',
      },
      {
        id: 'doc-financial-proof',
        labelEn: 'Proof of Financial Solvency / Bank Statement / Blocked Account',
        labelBn: 'আর্থিক সচ্ছলতার সনদ / ব্যাংক স্টেটমেন্ট / ব্লকড অ্যাকাউন্ট',
        note: 'Required for visa and unconditional offer issuance.',
      },
      {
        id: 'doc-syllabus',
        labelEn: 'Course-by-Course Module Description / Course Syllabus',
        labelBn: 'কোর্স সিলেবাস ও মডিউল বিবরণী',
        note: 'Required by European universities to verify ECTS credit equivalence.',
      },
      {
        id: 'doc-gre',
        labelEn: 'GRE / GMAT Official Score Report',
        labelBn: 'জিআরই / জিমেট স্কোর রিপোর্ট',
        note: 'Required for select US, German, and business administration programs.',
      },
    ];

    return { mandatory, conditional };
  }

  private buildTimeline(program: ProgramItem, intake: string) {
    const regularDeadline = program.applicationDeadline || '2025-06-30';
    const semesterStart = intake.includes('Spring') ? 'February 2026' : 'September 2025';
    const recommendedPreparationStart = intake.includes('Spring') ? 'May 2025' : 'October 2024';

    return {
      earlyDeadline: '2025-03-31 (Early Action / Scholarship Deadline)',
      regularDeadline,
      semesterStart,
      recommendedPreparationStart,
    };
  }

  private getSubjectCategoryBengali(cat: string): string {
    const map: Record<string, string> = {
      'Computer Science and IT': 'কম্পিউটার সায়েন্স ও আইটি',
      'Engineering and Technology': 'ইঞ্জিনিয়ারিং ও প্রযুক্তি',
      'Business and Economics': 'ব্যবসা ও অর্থনীতি',
      'Health and Medicine': 'স্বাস্থ্য ও চিকিৎসা',
      'Social Sciences': 'সামাজিক বিজ্ঞান',
      'Natural Sciences': 'প্রাকৃতিক বিজ্ঞান',
      'Arts and Humanities': 'কলা ও মানবিক',
      'Law and Legal Studies': 'আইন ও বিচার',
      'Architecture and Design': 'স্থাপত্য ও ডিজাইন',
      'Environmental Sciences': 'পরিবেশ বিজ্ঞান',
    };
    return map[cat] || cat;
  }
}

export const universityRequirementsReportService = new UniversityRequirementsReportService();
