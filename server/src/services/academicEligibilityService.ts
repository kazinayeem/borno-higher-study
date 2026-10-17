import { PrismaClient } from '@prisma/client';
import {
  INITIAL_GRADE_SCALES,
  INITIAL_QUALIFICATION_EQUIVALENCIES,
  INITIAL_ACADEMIC_REQUIREMENTS,
  SeedAcademicRequirement,
} from '../data/academicEligibilityData.js';

const prisma = new PrismaClient();

export interface StudentEligibilityInput {
  userId?: string;
  targetCountryCode?: string;
  universityId?: string;
  universityName?: string;
  programId?: string;
  programName?: string;
  degreeLevel: 'BACHELOR' | 'MASTER' | 'PHD' | 'FOUNDATION' | 'DIPLOMA';
  sscGpa?: number;
  sscScale?: number;
  hscGpa?: number;
  hscScale?: number;
  hscStream?: 'SCIENCE' | 'COMMERCE' | 'HUMANITIES' | 'OTHER';
  subjectGrades?: Array<{
    subjectName: string;
    gradeLetter?: string;
    gradeNumeric?: number;
    scale?: string;
  }>;
  bachelorDegreeTitle?: string;
  bachelorCgpa?: number;
  bachelorScale?: number;
  bachelorClass?: string;
  masterDegreeTitle?: string;
  masterCgpa?: number;
  masterScale?: number;
  hasResearchProposal?: boolean;
  hasPublications?: boolean;
  workExperienceMonths?: number;
  englishProficiencyStatus?: string;
}

export class AcademicEligibilityService {
  /**
   * Seed all initial Grade Scales, Equivalencies, and Academic Requirements
   */
  static async seedAllAcademicData() {
    console.log('📚 Synchronizing Global Academic Eligibility & Subject Requirements...');

    // 1. Seed Grade Scales
    let scaleCount = 0;
    for (const scale of INITIAL_GRADE_SCALES) {
      await prisma.gradeScale.upsert({
        where: { code: scale.code },
        update: {
          name: scale.name,
          countryCode: scale.countryCode,
          maxScale: scale.maxScale,
          passThreshold: scale.passThreshold,
          description: scale.description,
          officialScaleAuthority: scale.officialScaleAuthority,
          bands: scale.bands,
        },
        create: {
          name: scale.name,
          code: scale.code,
          countryCode: scale.countryCode,
          maxScale: scale.maxScale,
          passThreshold: scale.passThreshold,
          description: scale.description,
          officialScaleAuthority: scale.officialScaleAuthority,
          bands: scale.bands,
        },
      });
      scaleCount++;
    }

    // 2. Seed Qualification Equivalencies
    let equivCount = 0;
    for (const equiv of INITIAL_QUALIFICATION_EQUIVALENCIES) {
      const existing = await prisma.qualificationEquivalency.findFirst({
        where: {
          countryCode: equiv.countryCode,
          homeQualification: equiv.homeQualification,
          targetQualification: equiv.targetQualification,
        },
      });

      if (!existing) {
        await prisma.qualificationEquivalency.create({
          data: {
            countryCode: equiv.countryCode,
            homeQualification: equiv.homeQualification,
            targetQualification: equiv.targetQualification,
            minimumHomeResult: equiv.minimumHomeResult,
            standardEquivalency: equiv.standardEquivalency,
            isOfficialPolicy: equiv.isOfficialPolicy,
            credentialEvaluator: equiv.credentialEvaluator,
            sourceUrl: equiv.sourceUrl,
            notes: equiv.notes,
          },
        });
      }
      equivCount++;
    }

    // 3. Seed Program Academic Requirements
    let reqCount = 0;
    for (const req of INITIAL_ACADEMIC_REQUIREMENTS) {
      // Find matching university in SQLite
      const university = await prisma.university.findFirst({
        where: {
          name: { contains: req.universityName },
        },
      });

      // Find matching program if exists
      const program = await prisma.program.findFirst({
        where: {
          name: { contains: req.programName },
        },
      });

      const existingReq = await prisma.academicRequirement.findFirst({
        where: {
          targetQualification: req.targetQualification,
          countryCode: req.countryCode,
          ...(university ? { universityId: university.id } : {}),
        },
      });

      const reqData = {
        universityId: university?.id || null,
        programId: program?.id || null,
        degreeLevel: req.degreeLevel,
        targetQualification: req.targetQualification,
        countryCode: req.countryCode,
        countryName: req.countryName,
        overallMinimumGpa: req.overallMinimumGpa || null,
        overallGradingScale: req.overallGradingScale || null,
        minSscGpa: req.minSscGpa || null,
        sscGpaScale: req.sscGpaScale || 5.0,
        minHscGpa: req.minHscGpa || null,
        hscGpaScale: req.hscGpaScale || 5.0,
        combinedSscHscGpa: req.combinedSscHscGpa || null,
        hscStreamRequired: req.hscStreamRequired || 'ANY',
        acceptedSecondaryBoards: req.acceptedSecondaryBoards || null,
        passingYearGapMax: req.passingYearGapMax || null,
        minBachelorCgpa: req.minBachelorCgpa || null,
        bachelorCgpaScale: req.bachelorCgpaScale || 4.0,
        minBachelorPercentage: req.minBachelorPercentage || null,
        bachelorDegreeTitleRequired: req.bachelorDegreeTitleRequired || null,
        bachelorClassRequired: req.bachelorClassRequired || null,
        directEntryAccepted: req.directEntryAccepted ?? true,
        foundationEntryOption: req.foundationEntryOption || null,
        minMasterCgpa: req.minMasterCgpa || null,
        masterCgpaScale: req.masterCgpaScale || 4.0,
        researchProposalRequired: req.researchProposalRequired || false,
        supervisorPreApprovalRequired: req.supervisorPreApprovalRequired || false,
        publicationsRequired: req.publicationsRequired || false,
        workExperienceMonthsRequired: req.workExperienceMonthsRequired || 0,
        prerequisiteCoursework: req.prerequisiteCoursework || null,
        entranceExamRequired: req.entranceExamRequired || null,
        interviewRequired: req.interviewRequired || false,
        notes: req.notes,
        officialSourceUrl: req.officialSourceUrl,
        sourcePublisher: req.sourcePublisher,
        lastVerifiedAt: new Date(),
        isVerified: true,
        adminApprovalStatus: 'APPROVED',
      };

      let requirementId: string;
      if (existingReq) {
        await prisma.academicRequirement.update({
          where: { id: existingReq.id },
          data: reqData,
        });
        requirementId = existingReq.id;
      } else {
        const created = await prisma.academicRequirement.create({ data: reqData });
        requirementId = created.id;
      }

      // Upsert Subject Requirements
      for (const subj of req.subjectRequirements) {
        const existingSubj = await prisma.programSubjectRequirement.findFirst({
          where: {
            academicRequirementId: requirementId,
            subjectName: subj.subjectName,
          },
        });

        if (!existingSubj) {
          await prisma.programSubjectRequirement.create({
            data: {
              academicRequirementId: requirementId,
              subjectName: subj.subjectName,
              requirementType: subj.requirementType,
              minimumGradeLetter: subj.minimumGradeLetter || null,
              minimumGradeNumeric: subj.minimumGradeNumeric || null,
              gradingScale: subj.gradingScale || null,
              academicStream: subj.academicStream || null,
              requiresLaboratory: subj.requiresLaboratory || false,
              acceptedEquivalentSubjects: subj.acceptedEquivalentSubjects || null,
              alternativeCombinations: subj.alternativeCombinations || null,
              notes: subj.notes || null,
            },
          });
        }
      }

      // Add Official Source Record
      const existingSource = await prisma.academicRequirementSource.findFirst({
        where: {
          academicRequirementId: requirementId,
          url: req.officialSourceUrl,
        },
      });

      if (!existingSource) {
        await prisma.academicRequirementSource.create({
          data: {
            academicRequirementId: requirementId,
            title: `${req.universityName} Admissions Bulletin: ${req.targetQualification}`,
            publisher: req.sourcePublisher,
            url: req.officialSourceUrl,
            lastVerifiedAt: new Date(),
          },
        });
      }

      reqCount++;
    }

    console.log(`✔ Synchronized ${scaleCount} Grade Scales, ${equivCount} Equivalencies, and ${reqCount} Academic Requirements.`);
    return { scaleCount, equivCount, reqCount };
  }

  /**
   * Get academic requirements catalog with filters & pagination
   */
  static async getAcademicRequirements(params: {
    countryCode?: string;
    degreeLevel?: string;
    universityId?: string;
    programId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(params.limit) || 12));
    const skip = (page - 1) * limit;

    const where: any = { adminApprovalStatus: 'APPROVED' };

    if (params.countryCode && params.countryCode !== 'ALL') {
      where.countryCode = params.countryCode.toUpperCase();
    }

    if (params.degreeLevel && params.degreeLevel !== 'ALL') {
      where.degreeLevel = params.degreeLevel.toUpperCase();
    }

    if (params.universityId) {
      where.universityId = params.universityId;
    }

    if (params.programId) {
      where.programId = params.programId;
    }

    if (params.search) {
      where.OR = [
        { targetQualification: { contains: params.search } },
        { countryName: { contains: params.search } },
        { bachelorDegreeTitleRequired: { contains: params.search } },
        { notes: { contains: params.search } },
      ];
    }

    const [total, requirements] = await Promise.all([
      prisma.academicRequirement.count({ where }),
      prisma.academicRequirement.findMany({
        where,
        include: {
          university: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
              country: { select: { name: true, code: true, flagEmoji: true } },
            },
          },
          program: {
            select: {
              id: true,
              name: true,
              slug: true,
              degreeLevel: true,
              durationMonths: true,
            },
          },
          scale: true,
          subjectRequirements: true,
          equivalencies: true,
          sources: true,
        },
        orderBy: [{ countryName: 'asc' }, { targetQualification: 'asc' }],
        skip,
        take: limit,
      }),
    ]);

    return {
      requirements,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Get single academic requirement detail by ID
   */
  static async getRequirementById(id: string) {
    return prisma.academicRequirement.findUnique({
      where: { id },
      include: {
        university: {
          include: {
            country: true,
          },
        },
        program: true,
        scale: true,
        subjectRequirements: true,
        equivalencies: true,
        sources: true,
        revisions: {
          orderBy: { appliedAt: 'desc' },
          take: 5,
        },
      },
    });
  }

  /**
   * Student Academic Eligibility Evaluation Engine (Section 4)
   * Evaluates student's entered academic qualifications against verified requirements
   */
  static async evaluateStudentEligibility(input: StudentEligibilityInput) {
    // 1. Locate matching Academic Requirement record
    let requirement = null;

    if (input.programId) {
      requirement = await prisma.academicRequirement.findFirst({
        where: { programId: input.programId, adminApprovalStatus: 'APPROVED' },
        include: { subjectRequirements: true, equivalencies: true, university: true, program: true },
      });
    }

    if (!requirement && input.universityId) {
      requirement = await prisma.academicRequirement.findFirst({
        where: {
          universityId: input.universityId,
          degreeLevel: input.degreeLevel,
          adminApprovalStatus: 'APPROVED',
        },
        include: { subjectRequirements: true, equivalencies: true, university: true, program: true },
      });
    }

    if (!requirement && input.universityName) {
      requirement = await prisma.academicRequirement.findFirst({
        where: {
          university: { name: { contains: input.universityName } },
          degreeLevel: input.degreeLevel,
          adminApprovalStatus: 'APPROVED',
        },
        include: { subjectRequirements: true, equivalencies: true, university: true, program: true },
      });
    }

    if (!requirement && input.programName) {
      requirement = await prisma.academicRequirement.findFirst({
        where: {
          targetQualification: { contains: input.programName },
          degreeLevel: input.degreeLevel,
          adminApprovalStatus: 'APPROVED',
        },
        include: { subjectRequirements: true, equivalencies: true, university: true, program: true },
      });
    }

    if (!requirement && input.targetCountryCode) {
      requirement = await prisma.academicRequirement.findFirst({
        where: {
          countryCode: input.targetCountryCode.toUpperCase(),
          degreeLevel: input.degreeLevel,
          adminApprovalStatus: 'APPROVED',
        },
        include: { subjectRequirements: true, equivalencies: true, university: true, program: true },
      });
    }

    // If still no specific requirement, find a benchmark requirement for degree level
    if (!requirement) {
      requirement = await prisma.academicRequirement.findFirst({
        where: { degreeLevel: input.degreeLevel, adminApprovalStatus: 'APPROVED' },
        include: { subjectRequirements: true, equivalencies: true, university: true, program: true },
      });
    }

    if (!requirement) {
      return {
        status: 'ADDITIONAL_INFO_REQUIRED',
        overallMatched: false,
        summary: 'No verified academic requirement benchmark found for the selected program.',
        criteria: [],
        requirementDetails: null,
      };
    }

    // 2. Perform Criteria-by-Criteria Evaluation
    const criteria: Array<{
      category: string;
      title: string;
      required: string;
      studentActual: string;
      matched: boolean | 'CONDITIONAL' | 'MISSING_INFO';
      explanation: string;
    }> = [];

    let hasUnmet = false;
    let hasMissingInfo = false;
    let hasConditional = false;

    // Check SSC GPA (if required for undergraduate/secondary)
    if (requirement.minSscGpa && requirement.degreeLevel === 'BACHELOR') {
      const actualSsc = input.sscGpa || 0;
      const matched = actualSsc >= requirement.minSscGpa;
      if (!input.sscGpa) {
        hasMissingInfo = true;
        criteria.push({
          category: 'SECONDARY_EDUCATION',
          title: 'Minimum Secondary School Certificate (SSC) GPA',
          required: `Minimum GPA ${requirement.minSscGpa.toFixed(2)} / ${requirement.sscGpaScale?.toFixed(2) || '5.00'}`,
          studentActual: 'Not provided',
          matched: 'MISSING_INFO',
          explanation: 'Secondary certificate GPA was not provided in the evaluation form.',
        });
      } else {
        if (!matched) hasUnmet = true;
        criteria.push({
          category: 'SECONDARY_EDUCATION',
          title: 'Minimum Secondary School Certificate (SSC) GPA',
          required: `Minimum GPA ${requirement.minSscGpa.toFixed(2)} / ${requirement.sscGpaScale?.toFixed(2) || '5.00'}`,
          studentActual: `GPA ${actualSsc.toFixed(2)} / ${input.sscScale || 5.0}`,
          matched,
          explanation: matched
            ? `Your SSC result (${actualSsc.toFixed(2)}) meets or exceeds the published minimum (${requirement.minSscGpa.toFixed(2)}).`
            : `Your SSC result (${actualSsc.toFixed(2)}) is below the published minimum requirement of ${requirement.minSscGpa.toFixed(2)}.`,
        });
      }
    }

    // Check HSC GPA & Stream (for Undergraduate)
    if (requirement.minHscGpa && requirement.degreeLevel === 'BACHELOR') {
      const actualHsc = input.hscGpa || 0;
      const gpaMatched = actualHsc >= requirement.minHscGpa;

      // Stream match
      let streamMatched = true;
      if (requirement.hscStreamRequired && requirement.hscStreamRequired !== 'ANY') {
        if (input.hscStream && input.hscStream !== requirement.hscStreamRequired) {
          streamMatched = false;
        }
      }

      if (!input.hscGpa) {
        hasMissingInfo = true;
        criteria.push({
          category: 'HIGHER_SECONDARY',
          title: 'Higher Secondary Certificate (HSC) Minimum GPA',
          required: `GPA ${requirement.minHscGpa.toFixed(2)} / 5.00 in ${requirement.hscStreamRequired || 'Any'} stream`,
          studentActual: 'Not provided',
          matched: 'MISSING_INFO',
          explanation: 'Higher secondary result is required for undergraduate eligibility assessment.',
        });
      } else {
        const fullHscMatch = gpaMatched && streamMatched;
        if (!fullHscMatch) hasUnmet = true;

        criteria.push({
          category: 'HIGHER_SECONDARY',
          title: 'Higher Secondary Certificate (HSC) Minimum GPA & Stream',
          required: `GPA ${requirement.minHscGpa.toFixed(2)} / 5.00 in ${requirement.hscStreamRequired || 'Any'} stream`,
          studentActual: `GPA ${actualHsc.toFixed(2)} (${input.hscStream || 'General'} stream)`,
          matched: fullHscMatch,
          explanation: fullHscMatch
            ? `Your HSC result (${actualHsc.toFixed(2)}) meets the required threshold in the ${input.hscStream} stream.`
            : !gpaMatched
            ? `Your HSC GPA (${actualHsc.toFixed(2)}) is below the published minimum of ${requirement.minHscGpa.toFixed(2)}.`
            : `Your academic stream (${input.hscStream}) does not match the mandatory ${requirement.hscStreamRequired} stream requirement.`,
        });
      }

      // Check Direct Entry vs Foundation Requirement
      if (!requirement.directEntryAccepted) {
        hasConditional = true;
        criteria.push({
          category: 'QUALIFICATION_EQUIVALENCY',
          title: 'Direct Year 1 Entry vs. International Foundation',
          required: 'Recognized 1-year Foundation Programme or A-Level equivalent',
          studentActual: 'Standard 12-Year Bangladesh HSC',
          matched: 'CONDITIONAL',
          explanation: requirement.foundationEntryOption || 'National qualification framework requires an approved International Foundation Year before direct degree entry.',
        });
      }
    }

    // Check Subject-Specific Requirements (e.g. Mathematics, Physics, Chemistry, Biology)
    if (requirement.subjectRequirements && requirement.subjectRequirements.length > 0) {
      for (const subj of requirement.subjectRequirements) {
        // Look up student's grade for this subject
        const studentSubj = input.subjectGrades?.find(
          (s) =>
            s.subjectName.toLowerCase().includes(subj.subjectName.toLowerCase()) ||
            subj.subjectName.toLowerCase().includes(s.subjectName.toLowerCase())
        );

        if (!studentSubj) {
          if (subj.requirementType === 'MANDATORY') {
            hasMissingInfo = true;
            criteria.push({
              category: 'SUBJECT_PREREQUISITE',
              title: `Prerequisite Subject: ${subj.subjectName}`,
              required: `Mandatory grade ${subj.minimumGradeLetter || subj.minimumGradeNumeric || 'Pass'}`,
              studentActual: 'Grade not entered',
              matched: 'MISSING_INFO',
              explanation: `Course requires verified achievement in ${subj.subjectName}. Please input your subject grade to confirm eligibility.`,
            });
          }
        } else {
          // Compare grade
          const numGrade = studentSubj.gradeNumeric || 0;
          const reqNum = subj.minimumGradeNumeric || 0;
          const matched = reqNum > 0 ? numGrade >= reqNum : true;

          if (!matched && subj.requirementType === 'MANDATORY') {
            hasUnmet = true;
          }

          criteria.push({
            category: 'SUBJECT_PREREQUISITE',
            title: `Prerequisite Subject: ${subj.subjectName} (${subj.requirementType})`,
            required: `Min ${subj.minimumGradeLetter || subj.minimumGradeNumeric} in ${subj.subjectName}`,
            studentActual: studentSubj.gradeLetter ? `Grade ${studentSubj.gradeLetter} (${studentSubj.gradeNumeric || 'N/A'})` : `${studentSubj.gradeNumeric}`,
            matched,
            explanation: matched
              ? `Subject prerequisite in ${subj.subjectName} is satisfied.`
              : `Your grade in ${subj.subjectName} is below the minimum required standard (${subj.minimumGradeLetter || subj.minimumGradeNumeric}).`,
          });
        }
      }
    }

    // Check Bachelor Degree CGPA & Title (for Postgraduate: Master / PhD)
    if (['MASTER', 'PHD'].includes(requirement.degreeLevel)) {
      const minCgpa = requirement.minBachelorCgpa || 3.0;
      const actualCgpa = input.bachelorCgpa || 0;

      if (!input.bachelorCgpa) {
        hasMissingInfo = true;
        criteria.push({
          category: 'UNDERGRADUATE_DEGREE',
          title: "Bachelor's Degree Cumulative GPA (CGPA)",
          required: `Minimum CGPA ${minCgpa.toFixed(2)} / ${requirement.bachelorCgpaScale?.toFixed(2) || '4.00'} (${requirement.bachelorClassRequired || 'Upper Second Class 2:1'})`,
          studentActual: 'Not provided',
          matched: 'MISSING_INFO',
          explanation: "Undergraduate degree CGPA is mandatory for Master's and PhD program eligibility assessment.",
        });
      } else {
        const cgpaMatched = actualCgpa >= minCgpa;
        if (!cgpaMatched) hasUnmet = true;

        criteria.push({
          category: 'UNDERGRADUATE_DEGREE',
          title: "Bachelor's Degree Cumulative GPA (CGPA)",
          required: `Minimum CGPA ${minCgpa.toFixed(2)} / ${requirement.bachelorCgpaScale?.toFixed(2) || '4.00'} (${requirement.bachelorClassRequired || 'Upper Second Class 2:1'})`,
          studentActual: `CGPA ${actualCgpa.toFixed(2)} / ${input.bachelorScale || 4.0}`,
          matched: cgpaMatched,
          explanation: cgpaMatched
            ? `Your undergraduate CGPA (${actualCgpa.toFixed(2)}) meets the minimum entry threshold of ${minCgpa.toFixed(2)}.`
            : `Your undergraduate CGPA (${actualCgpa.toFixed(2)}) is below the published minimum entry threshold of ${minCgpa.toFixed(2)}.`,
        });
      }

      // Check Bachelor title requirement if specified
      if (requirement.bachelorDegreeTitleRequired && input.bachelorDegreeTitle) {
        criteria.push({
          category: 'UNDERGRADUATE_DEGREE',
          title: 'Relevant Undergraduate Major Requirement',
          required: requirement.bachelorDegreeTitleRequired,
          studentActual: input.bachelorDegreeTitle,
          matched: 'CONDITIONAL',
          explanation: `Admissions committee reviews transcript course-by-course. Your major (${input.bachelorDegreeTitle}) must cover required prerequisite coursework.`,
        });
      }
    }

    // Check PhD Master & Research Proposal Prerequisites
    if (requirement.degreeLevel === 'PHD') {
      if (requirement.researchProposalRequired) {
        criteria.push({
          category: 'DOCTORAL_RESEARCH',
          title: 'Independent Research Proposal & Supervisor Alignment',
          required: 'Approved research proposal & confirmed academic supervisor',
          studentActual: input.hasResearchProposal ? 'Proposal Prepared' : 'Not yet prepared',
          matched: input.hasResearchProposal ? true : 'CONDITIONAL',
          explanation: input.hasResearchProposal
            ? 'Research proposal prepared. Must align with departmental faculty specializations.'
            : 'A 2,000–3,000 word research proposal is an essential requirement for formal doctoral application consideration.',
        });
      }
    }

    // 3. Determine Overall Assessment Status
    let status: 'MEETS_THRESHOLDS' | 'DOES_NOT_MEET' | 'ADDITIONAL_INFO_REQUIRED' | 'PREREQUISITES_NOT_CONFIRMED' | 'EQUIVALENCY_CONFIRMATION_REQUIRED';
    let summary: string;

    if (hasUnmet) {
      status = 'DOES_NOT_MEET';
      summary = 'Your current academic results are below one or more mandatory published thresholds (GPA or subject prerequisites).';
    } else if (hasMissingInfo) {
      status = 'PREREQUISITES_NOT_CONFIRMED';
      summary = 'Some mandatory prerequisite subject grades or degree details are missing. Please enter them to complete your assessment.';
    } else if (hasConditional) {
      status = 'EQUIVALENCY_CONFIRMATION_REQUIRED';
      summary = 'You meet the academic performance thresholds, but standard national equivalency policy requires university confirmation or a recognized pathway program.';
    } else {
      status = 'MEETS_THRESHOLDS';
      summary = 'Congratulations! Your academic qualifications and subject grades meet all published admission thresholds for this program.';
    }

    // 4. Save assessment record
    const uniName = requirement.university?.name || input.universityName || requirement.countryName;
    const progName = requirement.targetQualification || input.programName || 'Degree Program';

    const assessment = await prisma.eligibilityAssessment.create({
      data: {
        userId: input.userId || null,
        programId: requirement.programId || null,
        universityName: uniName,
        programName: progName,
        degreeLevel: requirement.degreeLevel,
        studentInputJson: JSON.stringify(input),
        status,
        overallMatched: status === 'MEETS_THRESHOLDS',
        summary,
        matchDetailsJson: JSON.stringify(criteria),
      },
    });

    return {
      assessmentId: assessment.id,
      status,
      overallMatched: status === 'MEETS_THRESHOLDS',
      summary,
      criteria,
      requirementDetails: {
        id: requirement.id,
        universityId: requirement.universityId,
        programId: requirement.programId,
        universityName: uniName,
        programName: progName,
        degreeLevel: requirement.degreeLevel as any,
        countryCode: requirement.countryCode,
        countryName: requirement.countryName,
        minSscGpa: requirement.minSscGpa,
        sscGpaScale: requirement.sscGpaScale,
        minHscGpa: requirement.minHscGpa,
        hscGpaScale: requirement.hscGpaScale,
        minBachelorCgpa: requirement.minBachelorCgpa,
        bachelorCgpaScale: requirement.bachelorCgpaScale,
        directEntryAccepted: requirement.directEntryAccepted,
        foundationEntryOption: requirement.foundationEntryOption,
        sourceUrl: requirement.officialSourceUrl,
        officialSourceUrl: requirement.officialSourceUrl,
        sourcePublisher: requirement.sourcePublisher,
        notes: requirement.notes,
        isEstimate: false,
        adminApprovalStatus: requirement.adminApprovalStatus as any,
        verificationTimestamp: requirement.lastVerifiedAt.toISOString(),
        university: requirement.university,
        program: requirement.program,
        subjectRequirements: requirement.subjectRequirements,
        equivalencies: requirement.equivalencies,
      },
    };
  }

  /**
   * Submit student correction for academic eligibility requirements
   */
  static async submitAcademicCorrection(data: {
    academicRequirementId?: string;
    universityName: string;
    programName: string;
    issueCategory: string;
    description: string;
    evidenceUrl?: string;
    reporterName?: string;
    reporterEmail?: string;
  }) {
    return prisma.academicCorrectionReport.create({
      data: {
        academicRequirementId: data.academicRequirementId || null,
        universityName: data.universityName,
        programName: data.programName,
        issueCategory: data.issueCategory,
        description: data.description,
        evidenceUrl: data.evidenceUrl || null,
        reporterName: data.reporterName || null,
        reporterEmail: data.reporterEmail || null,
        status: 'PENDING',
      },
    });
  }

  /**
   * Super Admin: Get pending academic corrections queue
   */
  static async getPendingCorrections() {
    return prisma.academicCorrectionReport.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Super Admin: Review academic correction report
   */
  static async reviewCorrection(id: string, action: 'APPROVED' | 'REJECTED', adminNotes: string, reviewerId: string) {
    const report = await prisma.academicCorrectionReport.findUnique({ where: { id } });
    if (!report) throw new Error('Correction report not found');

    const updated = await prisma.academicCorrectionReport.update({
      where: { id },
      data: {
        status: action,
        adminNotes,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      },
    });

    if (action === 'APPROVED' && report.academicRequirementId) {
      await prisma.academicRequirementRevision.create({
        data: {
          academicRequirementId: report.academicRequirementId,
          changedBy: reviewerId,
          fieldName: report.issueCategory,
          newValue: report.description,
          reason: `Student Correction Verified: ${adminNotes}`,
        },
      });
    }

    return updated;
  }

  /**
   * Super Admin: Direct update of requirement thresholds
   */
  static async updateRequirement(id: string, data: any, adminId: string) {
    const existing = await prisma.academicRequirement.findUnique({ where: { id } });
    if (!existing) throw new Error('Academic requirement not found');

    const updated = await prisma.academicRequirement.update({
      where: { id },
      data: {
        overallMinimumGpa: data.overallMinimumGpa !== undefined ? data.overallMinimumGpa : existing.overallMinimumGpa,
        minSscGpa: data.minSscGpa !== undefined ? data.minSscGpa : existing.minSscGpa,
        minHscGpa: data.minHscGpa !== undefined ? data.minHscGpa : existing.minHscGpa,
        minBachelorCgpa: data.minBachelorCgpa !== undefined ? data.minBachelorCgpa : existing.minBachelorCgpa,
        minMasterCgpa: data.minMasterCgpa !== undefined ? data.minMasterCgpa : existing.minMasterCgpa,
        hscStreamRequired: data.hscStreamRequired || existing.hscStreamRequired,
        bachelorDegreeTitleRequired: data.bachelorDegreeTitleRequired || existing.bachelorDegreeTitleRequired,
        notes: data.notes || existing.notes,
        lastVerifiedAt: new Date(),
      },
    });

    // Record audit revision
    await prisma.academicRequirementRevision.create({
      data: {
        academicRequirementId: id,
        changedBy: adminId,
        fieldName: 'ACADEMIC_THRESHOLDS',
        previousValue: `SSC: ${existing.minSscGpa}, HSC: ${existing.minHscGpa}, BSC: ${existing.minBachelorCgpa}`,
        newValue: `SSC: ${updated.minSscGpa}, HSC: ${updated.minHscGpa}, BSC: ${updated.minBachelorCgpa}`,
        reason: 'Super Admin direct update of academic admission thresholds',
      },
    });

    return updated;
  }

  /**
   * Get Grade Scales reference
   */
  static async getGradeScales() {
    return prisma.gradeScale.findMany({
      orderBy: { code: 'asc' },
    });
  }

  /**
   * Get Qualification Equivalencies reference
   */
  static async getQualificationEquivalencies(countryCode?: string) {
    const where: any = {};
    if (countryCode && countryCode !== 'ALL') {
      where.countryCode = countryCode.toUpperCase();
    }
    return prisma.qualificationEquivalency.findMany({
      where,
      orderBy: { countryCode: 'asc' },
    });
  }
}
