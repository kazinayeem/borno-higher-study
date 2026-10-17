import { PrismaClient } from '@prisma/client';
import { INITIAL_MOI_POLICIES } from '../data/moiPoliciesData';

const prisma = new PrismaClient();

export class MoiService {
  /**
   * Idempotent seed function for all initial MOI records
   */
  static async seedAllMoiData() {
    console.log('Seeding MOI and English Language Exemption policies...');
    let seededPoliciesCount = 0;

    for (const item of INITIAL_MOI_POLICIES) {
      // Find university by slug or name
      const uni = await prisma.university.findFirst({
        where: {
          OR: [
            { slug: item.universitySlug },
            { name: { contains: item.universityName } },
          ],
        },
      });

      if (!uni) {
        console.warn(`[MOI Seed] University '${item.universityName}' (${item.universitySlug}) not found in database. Skipping.`);
        continue;
      }

      // Check if policy already exists for this university and level
      const existing = await prisma.moiPolicy.findFirst({
        where: {
          universityId: uni.id,
          qualificationLevel: item.qualificationLevel,
        },
      });

      const policyData = {
        universityId: uni.id,
        country: item.country,
        qualificationLevel: item.qualificationLevel,
        departmentName: item.departmentName || null,
        acceptanceStatus: item.acceptanceStatus,
        scope: item.scope,
        eligibleInstitutions: item.eligibleInstitutions || null,
        eligibleCountries: item.eligibleCountries || null,
        minDegreeDurationYears: item.minDegreeDurationYears || 3.0,
        graduationValidityYears: item.graduationValidityYears || 5,
        requiredCertificateWording: item.requiredCertificateWording || null,
        transcriptsRequired: item.transcriptsRequired,
        separateTestRequired: item.separateTestRequired,
        visaSeparateRequirementNote: item.visaSeparateRequirementNote,
        applicableIntakes: item.applicableIntakes,
        officialPolicyUrl: item.officialPolicyUrl,
        sourceExcerpt: item.sourceExcerpt,
        reviewerNotes: item.reviewerNotes,
        lastVerifiedAt: new Date(),
        isOutdated: false,
        adminApprovalStatus: 'APPROVED',
      };

      let policyId: string;
      if (existing) {
        await prisma.moiPolicy.update({
          where: { id: existing.id },
          data: policyData,
        });
        policyId = existing.id;
      } else {
        const created = await prisma.moiPolicy.create({
          data: policyData,
        });
        policyId = created.id;

        // Log initial revision
        await prisma.moiPolicyRevision.create({
          data: {
            moiPolicyId: policyId,
            changedBy: 'SYSTEM_SEED',
            changeType: 'CREATED',
            newData: JSON.stringify(policyData),
            changeReason: 'Initial verified MOI seed data ingestion',
          },
        });
      }

      // Seed conditions
      if (item.conditions && item.conditions.length > 0) {
        await prisma.moiEligibilityCondition.deleteMany({
          where: { moiPolicyId: policyId },
        });

        for (const cond of item.conditions) {
          await prisma.moiEligibilityCondition.create({
            data: {
              moiPolicyId: policyId,
              conditionType: cond.conditionType,
              title: cond.title,
              description: cond.description,
              isMandatory: cond.isMandatory,
            },
          });
        }
      }

      // Seed exemptions
      if (item.exemptions && item.exemptions.length > 0) {
        for (const ex of item.exemptions) {
          const existingEx = await prisma.englishLanguageExemption.findFirst({
            where: {
              universityId: uni.id,
              title: ex.title,
            },
          });

          if (!existingEx) {
            await prisma.englishLanguageExemption.create({
              data: {
                moiPolicyId: policyId,
                universityId: uni.id,
                title: ex.title,
                qualificationLevel: ex.qualificationLevel,
                exemptionCategory: ex.exemptionCategory,
                description: ex.description,
                requirements: ex.requirements,
                officialPolicyUrl: ex.officialPolicyUrl,
              },
            });
          }
        }
      }

      // Seed official source record
      const existingSource = await prisma.moiPolicySource.findFirst({
        where: {
          moiPolicyId: policyId,
          url: item.officialPolicyUrl,
        },
      });

      if (!existingSource) {
        await prisma.moiPolicySource.create({
          data: {
            moiPolicyId: policyId,
            universityId: uni.id,
            title: `${item.universityName} Official MOI Policy`,
            url: item.officialPolicyUrl,
            sourceType: 'OFFICIAL_WEBSITE',
          },
        });
      }

      seededPoliciesCount++;
    }

    console.log(`Successfully seeded ${seededPoliciesCount} MOI policies.`);
    return { count: seededPoliciesCount };
  }

  /**
   * Get paginated MOI policies with dynamic filters
   */
  static async getMoiPolicies(params: {
    country?: string;
    universityId?: string;
    qualificationLevel?: string;
    acceptanceStatus?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(params.limit) || 10));
    const skip = (page - 1) * limit;

    const where: any = {
      adminApprovalStatus: 'APPROVED',
    };

    if (params.country && params.country !== 'ALL') {
      where.country = { contains: params.country };
    }

    if (params.universityId && params.universityId !== 'ALL') {
      where.universityId = params.universityId;
    }

    if (params.qualificationLevel && params.qualificationLevel !== 'ALL') {
      where.qualificationLevel = { in: [params.qualificationLevel, 'ALL'] };
    }

    if (params.acceptanceStatus && params.acceptanceStatus !== 'ALL') {
      where.acceptanceStatus = params.acceptanceStatus;
    }

    if (params.search) {
      where.OR = [
        { university: { name: { contains: params.search } } },
        { departmentName: { contains: params.search } },
        { eligibleInstitutions: { contains: params.search } },
        { eligibleCountries: { contains: params.search } },
      ];
    }

    const [total, rawPolicies] = await Promise.all([
      prisma.moiPolicy.count({ where }),
      prisma.moiPolicy.findMany({
        where,
        include: {
          university: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
              country: { select: { name: true, flagEmoji: true } },
            },
          },
          program: {
            select: {
              id: true,
              name: true,
              degreeLevel: true,
            },
          },
          conditions: true,
          exemptions: true,
          sources: true,
        },
        orderBy: [{ university: { name: 'asc' } }, { qualificationLevel: 'asc' }],
        skip,
        take: limit,
      }),
    ]);

    // Check stale status (> 180 days)
    const now = new Date();
    const policies = rawPolicies.map((p) => {
      const daysSince = Math.floor((now.getTime() - new Date(p.lastVerifiedAt).getTime()) / (1000 * 60 * 60 * 24));
      return {
        ...p,
        isOutdated: daysSince > 180 || p.isOutdated,
        daysSinceVerification: daysSince,
      };
    });

    // Compute overview statistics
    const stats = await prisma.moiPolicy.groupBy({
      by: ['acceptanceStatus'],
      _count: { id: true },
      where: { adminApprovalStatus: 'APPROVED' },
    });

    const statusCounts = stats.reduce((acc, curr) => {
      acc[curr.acceptanceStatus] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);

    return {
      policies,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
      stats: {
        totalApproved: total,
        acceptedWithConditions: statusCounts['ACCEPTED_WITH_CONDITIONS'] || 0,
        acceptedSelectedInstitutions: statusCounts['ACCEPTED_ONLY_FOR_SELECTED_INSTITUTIONS'] || 0,
        acceptedSpecifiedCourses: statusCounts['ACCEPTED_FOR_SPECIFIED_COURSES'] || 0,
        notAccepted: statusCounts['NOT_ACCEPTED'] || 0,
      },
    };
  }

  /**
   * Get single MOI policy by ID with complete details
   */
  static async getMoiPolicyById(id: string) {
    const policy = await prisma.moiPolicy.findUnique({
      where: { id },
      include: {
        university: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            websiteUrl: true,
            country: { select: { name: true, flagEmoji: true } },
          },
        },
        program: true,
        conditions: true,
        exemptions: true,
        sources: true,
        revisions: {
          orderBy: { timestamp: 'desc' },
          take: 5,
        },
      },
    });

    if (!policy) return null;

    const daysSince = Math.floor((new Date().getTime() - new Date(policy.lastVerifiedAt).getTime()) / (1000 * 60 * 60 * 24));
    return {
      ...policy,
      isOutdated: daysSince > 180 || policy.isOutdated,
      daysSinceVerification: daysSince,
    };
  }

  /**
   * Interactive MOI Eligibility Assessment
   */
  static async checkMoiEligibility(submission: {
    country: string;
    universityId: string;
    programId?: string;
    completedQualification: string; // e.g. "4-Year Bachelor's Degree"
    awardingInstitution: string; // e.g. "North South University (NSU)"
    awardingCountry?: string; // e.g. "Bangladesh"
    allTaughtInEnglish: boolean;
    graduationYear: number;
    canProvideMoiLetter: boolean;
    hasAdditionalCourseReqs?: boolean;
  }) {
    // 1. Fetch policy for target university
    const policy = await prisma.moiPolicy.findFirst({
      where: {
        universityId: submission.universityId,
        adminApprovalStatus: 'APPROVED',
      },
      include: {
        university: {
          select: {
            name: true,
            slug: true,
            country: { select: { name: true, flagEmoji: true } },
          },
        },
        conditions: true,
        exemptions: true,
      },
    });

    if (!policy) {
      return {
        outcome: 'POLICY_UNCLEAR_CONTACT_UNI',
        summaryTitle: 'Policy Requires Direct Confirmation',
        explanation: 'We do not currently have a verified MOI exemption policy for this university in our database. Because MOI rules vary significantly across faculties, you should contact the university international admissions office before applying without a test score.',
        applicableConditions: ['Direct inquiry with the university international admissions team required'],
        visaSeparationNotice: 'Remember that even if a university grants an academic exemption, student visa authorities (such as UKVI, Irish ISD, or Canadian IRCC) maintain independent language requirements.',
        officialPolicyUrl: null,
        targetUniversityName: 'Selected Institution',
        disclaimer: 'This assessment is an advisory guideline based on published information and does not guarantee an admissions waiver or visa clearance.',
      };
    }

    const currentYear = new Date().getFullYear();
    const yearsSinceGrad = currentYear - Number(submission.graduationYear);
    const applicableConditions: string[] = [];

    // Condition Check A: Taught & Assessed 100% in English
    if (!submission.allTaughtInEnglish) {
      return {
        outcome: 'SEPARATE_TEST_NECESSARY',
        summaryTitle: 'Formal English Test Appears Necessary',
        explanation: `Under ${policy.university.name}'s admissions policy, exemptions are strictly limited to qualifications where 100% of instruction and examination was conducted in English. Because parts of your program were in another language, you must take an approved exam (IELTS, PTE, or TOEFL).`,
        applicableConditions: ['Must provide approved test certificate (IELTS / PTE / TOEFL)'],
        visaSeparationNotice: policy.visaSeparateRequirementNote,
        officialPolicyUrl: policy.officialPolicyUrl,
        targetUniversityName: policy.university.name,
        policy,
        disclaimer: 'This assessment is an automated guideline and does not constitute a final university admissions decision.',
      };
    }

    // Condition Check B: Official MOI Letter Availability
    if (!submission.canProvideMoiLetter) {
      return {
        outcome: 'SEPARATE_TEST_NECESSARY',
        summaryTitle: 'Official Documentation Unavailable',
        explanation: `${policy.university.name} requires official documentary evidence from your university Registrar verifying English as the Medium of Instruction. Self-certification or student statements cannot be accepted. A formal test will be necessary unless official documentation is obtained.`,
        applicableConditions: ['Official letter on university letterhead signed by Registrar / Controller of Examinations'],
        visaSeparationNotice: policy.visaSeparateRequirementNote,
        officialPolicyUrl: policy.officialPolicyUrl,
        targetUniversityName: policy.university.name,
        policy,
        disclaimer: 'This assessment is an automated guideline and does not constitute a final university admissions decision.',
      };
    }

    // Condition Check C: Explicit Non-Acceptance
    if (policy.acceptanceStatus === 'NOT_ACCEPTED') {
      return {
        outcome: 'SEPARATE_TEST_NECESSARY',
        summaryTitle: 'MOI Letters Not Accepted by Institution',
        explanation: `${policy.university.name} explicitly does not accept Medium of Instruction certificates from institutions outside recognized native English-speaking countries. All applicants must submit valid scores from an approved test provider (e.g. IELTS Academic or TOEFL iBT).`,
        applicableConditions: ['Approved test score meeting minimum overall and component requirements'],
        visaSeparationNotice: policy.visaSeparateRequirementNote,
        officialPolicyUrl: policy.officialPolicyUrl,
        targetUniversityName: policy.university.name,
        policy,
        disclaimer: 'This assessment is an automated guideline and does not constitute a final university admissions decision.',
      };
    }

    // Condition Check D: Graduation Recency
    if (policy.graduationValidityYears && yearsSinceGrad > policy.graduationValidityYears) {
      return {
        outcome: 'CONDITIONAL_OR_ADDITIONAL_EVIDENCE',
        summaryTitle: 'Graduation Date Exceeds Standard Recency Window',
        explanation: `${policy.university.name}'s published policy specifies that your qualifying degree must have been completed within the last ${policy.graduationValidityYears} years (you graduated ~${yearsSinceGrad} years ago). The university may require recent professional English evidence or a formal test.`,
        applicableConditions: [
          `Degree completed within ${policy.graduationValidityYears} years`,
          'Evidence of recent professional employment in an English-speaking workplace may be requested',
        ],
        visaSeparationNotice: policy.visaSeparateRequirementNote,
        officialPolicyUrl: policy.officialPolicyUrl,
        targetUniversityName: policy.university.name,
        policy,
        disclaimer: 'This assessment is an automated guideline and does not constitute a final university admissions decision.',
      };
    }

    // Condition Check E: Selected Institutions Only (e.g. Aston)
    if (policy.acceptanceStatus === 'ACCEPTED_ONLY_FOR_SELECTED_INSTITUTIONS') {
      const eligibleList = (policy.eligibleInstitutions || '').toLowerCase();
      const applicantInst = (submission.awardingInstitution || '').toLowerCase();
      const matches = eligibleList.includes(applicantInst) ||
        (applicantInst.includes('buet') && eligibleList.includes('buet')) ||
        (applicantInst.includes('north south') && eligibleList.includes('north south')) ||
        (applicantInst.includes('nsu') && eligibleList.includes('nsu')) ||
        (applicantInst.includes('brac') && eligibleList.includes('brac')) ||
        (applicantInst.includes('iba') && eligibleList.includes('iba')) ||
        (applicantInst.includes('dhaka') && eligibleList.includes('dhaka')) ||
        (applicantInst.includes('east west') && eligibleList.includes('east west')) ||
        (applicantInst.includes('iut') && eligibleList.includes('iut')) ||
        (applicantInst.includes('aust') && eligibleList.includes('aust'));

      if (!matches) {
        return {
          outcome: 'CONDITIONAL_OR_ADDITIONAL_EVIDENCE',
          summaryTitle: 'Institution Requires Special Vetting or Test',
          explanation: `${policy.university.name} has a specific pre-approved roster of recognized English-medium universities (${policy.eligibleInstitutions}). Because your awarding institution was not immediately matched on this roster, an individual case review or a standard test score is likely required.`,
          applicableConditions: [
            `Must be from an approved institution: ${policy.eligibleInstitutions}`,
            'Case-by-case faculty review if outside pre-approved list',
          ],
          visaSeparationNotice: policy.visaSeparateRequirementNote,
          officialPolicyUrl: policy.officialPolicyUrl,
          targetUniversityName: policy.university.name,
          policy,
          disclaimer: 'This assessment is an automated guideline and does not constitute a final university admissions decision.',
        };
      }
    }

    // Passed primary checks -> Potentially Eligible
    applicableConditions.push(
      policy.requiredCertificateWording || 'Official Registrar-signed letter confirming medium of instruction and assessment was English'
    );
    if (policy.transcriptsRequired) {
      applicableConditions.push('Official degree transcripts showing completed courses and grades');
    }
    if (policy.minDegreeDurationYears) {
      applicableConditions.push(`Minimum degree duration of ${policy.minDegreeDurationYears} academic years`);
    }

    return {
      outcome: 'POTENTIALLY_ELIGIBLE',
      summaryTitle: 'Potentially Eligible Based on Published Policy',
      explanation: `Based on published admissions guidelines for ${policy.university.name}, your qualification profile appears to satisfy the academic criteria for an English test waiver. You must submit official verification as specified by the university.`,
      applicableConditions,
      visaSeparationNotice: policy.visaSeparateRequirementNote,
      officialPolicyUrl: policy.officialPolicyUrl,
      targetUniversityName: policy.university.name,
      policy,
      disclaimer: 'This assessment is an automated guideline based on published policy and does NOT guarantee admission, waiver issuance, or visa clearance.',
    };
  }

  /**
   * Super Admin: Create new MOI Policy
   */
  static async createMoiPolicy(data: any, adminUserId: string) {
    const policy = await prisma.moiPolicy.create({
      data: {
        universityId: data.universityId,
        programId: data.programId || null,
        country: data.country,
        qualificationLevel: data.qualificationLevel || 'POSTGRADUATE_TAUGHT',
        departmentName: data.departmentName || null,
        acceptanceStatus: data.acceptanceStatus,
        scope: data.scope || 'ADMISSION_ONLY',
        eligibleInstitutions: data.eligibleInstitutions || null,
        eligibleCountries: data.eligibleCountries || null,
        minDegreeDurationYears: data.minDegreeDurationYears ? Number(data.minDegreeDurationYears) : 3.0,
        graduationValidityYears: data.graduationValidityYears ? Number(data.graduationValidityYears) : 5,
        requiredCertificateWording: data.requiredCertificateWording || null,
        transcriptsRequired: data.transcriptsRequired !== false,
        separateTestRequired: data.separateTestRequired || 'CONDITIONAL',
        visaSeparateRequirementNote: data.visaSeparateRequirementNote || 'University academic MOI acceptance does NOT automatically satisfy immigration/visa rules.',
        applicableIntakes: data.applicableIntakes || 'Autumn 2026, Spring 2027',
        officialPolicyUrl: data.officialPolicyUrl,
        sourceExcerpt: data.sourceExcerpt || null,
        reviewerNotes: data.reviewerNotes || null,
        adminApprovalStatus: 'APPROVED',
      },
    });

    // Revision log
    await prisma.moiPolicyRevision.create({
      data: {
        moiPolicyId: policy.id,
        changedBy: adminUserId,
        changeType: 'CREATED',
        newData: JSON.stringify(policy),
        changeReason: data.changeReason || 'Super Admin created new MOI policy',
      },
    });

    return policy;
  }

  /**
   * Super Admin: Update existing MOI Policy
   */
  static async updateMoiPolicy(id: string, data: any, adminUserId: string) {
    const existing = await prisma.moiPolicy.findUnique({ where: { id } });
    if (!existing) throw new Error('MOI policy not found');

    const updated = await prisma.moiPolicy.update({
      where: { id },
      data: {
        acceptanceStatus: data.acceptanceStatus !== undefined ? data.acceptanceStatus : existing.acceptanceStatus,
        scope: data.scope !== undefined ? data.scope : existing.scope,
        eligibleInstitutions: data.eligibleInstitutions !== undefined ? data.eligibleInstitutions : existing.eligibleInstitutions,
        eligibleCountries: data.eligibleCountries !== undefined ? data.eligibleCountries : existing.eligibleCountries,
        minDegreeDurationYears: data.minDegreeDurationYears !== undefined ? Number(data.minDegreeDurationYears) : existing.minDegreeDurationYears,
        graduationValidityYears: data.graduationValidityYears !== undefined ? Number(data.graduationValidityYears) : existing.graduationValidityYears,
        requiredCertificateWording: data.requiredCertificateWording !== undefined ? data.requiredCertificateWording : existing.requiredCertificateWording,
        transcriptsRequired: data.transcriptsRequired !== undefined ? data.transcriptsRequired : existing.transcriptsRequired,
        separateTestRequired: data.separateTestRequired !== undefined ? data.separateTestRequired : existing.separateTestRequired,
        visaSeparateRequirementNote: data.visaSeparateRequirementNote !== undefined ? data.visaSeparateRequirementNote : existing.visaSeparateRequirementNote,
        officialPolicyUrl: data.officialPolicyUrl !== undefined ? data.officialPolicyUrl : existing.officialPolicyUrl,
        sourceExcerpt: data.sourceExcerpt !== undefined ? data.sourceExcerpt : existing.sourceExcerpt,
        reviewerNotes: data.reviewerNotes !== undefined ? data.reviewerNotes : existing.reviewerNotes,
        lastVerifiedAt: new Date(),
        isOutdated: false,
      },
    });

    // Record revision
    await prisma.moiPolicyRevision.create({
      data: {
        moiPolicyId: id,
        changedBy: adminUserId,
        changeType: 'UPDATED',
        previousData: JSON.stringify(existing),
        newData: JSON.stringify(updated),
        changeReason: data.changeReason || 'Super Admin updated policy details',
      },
    });

    return updated;
  }

  /**
   * Submit student correction for MOI policy
   */
  static async submitCorrection(data: {
    userId?: string;
    moiPolicyId?: string;
    universityName: string;
    reporterEmail?: string;
    reporterName?: string;
    issueCategory: string;
    description: string;
    evidenceUrl?: string;
    evidenceText?: string;
  }) {
    return prisma.moiCorrectionReport.create({
      data: {
        userId: data.userId || null,
        moiPolicyId: data.moiPolicyId || null,
        universityName: data.universityName,
        reporterEmail: data.reporterEmail || null,
        reporterName: data.reporterName || null,
        issueCategory: data.issueCategory,
        description: data.description,
        evidenceUrl: data.evidenceUrl || null,
        evidenceText: data.evidenceText || null,
        status: 'PENDING',
      },
    });
  }

  /**
   * Super Admin: Get pending correction reports
   */
  static async getPendingCorrections() {
    return prisma.moiCorrectionReport.findMany({
      where: { status: 'PENDING' },
      include: {
        policy: {
          include: {
            university: { select: { name: true, slug: true } },
          },
        },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Super Admin: Review correction report (Approve / Reject)
   */
  static async reviewCorrection(id: string, action: 'APPROVED' | 'REJECTED', adminNotes: string, adminUserId: string) {
    const report = await prisma.moiCorrectionReport.findUnique({ where: { id } });
    if (!report) throw new Error('Correction report not found');

    const updatedReport = await prisma.moiCorrectionReport.update({
      where: { id },
      data: {
        status: action,
        adminNotes,
        reviewedBy: adminUserId,
        reviewedAt: new Date(),
      },
    });

    // If approved and attached to a policy, create revision note
    if (action === 'APPROVED' && report.moiPolicyId) {
      await prisma.moiPolicyRevision.create({
        data: {
          moiPolicyId: report.moiPolicyId,
          changedBy: adminUserId,
          changeType: 'CORRECTION_APPLIED',
          newData: JSON.stringify({ approvedCorrectionId: id, adminNotes }),
          changeReason: `Applied approved community correction: ${report.issueCategory}`,
        },
      });
    }

    return updatedReport;
  }

  /**
   * Super Admin: Get outdated policies (> 180 days)
   */
  static async getOutdatedPolicies() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 180);

    return prisma.moiPolicy.findMany({
      where: {
        OR: [
          { lastVerifiedAt: { lt: cutoffDate } },
          { isOutdated: true },
        ],
      },
      include: {
        university: { select: { name: true, slug: true } },
      },
      orderBy: { lastVerifiedAt: 'asc' },
    });
  }
}
