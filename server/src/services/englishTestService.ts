import { PrismaClient } from '@prisma/client';
import {
  ENGLISH_TEST_PROVIDERS,
  ENGLISH_TEST_FORMATS,
} from '../data/englishTestsData.js';
import { UK_UNIVERSITY_TEST_POLICIES } from '../data/ukUniversityTestPoliciesData.js';

const prisma = new PrismaClient();

export class EnglishTestService {
  /**
   * Idempotent seed for providers, test formats, fees, and initial UK university policies
   */
  static async seedAllEnglishTestData() {
    console.log('🔄 Seeding English Test Providers, Formats, Fees & UK Policies...');

    // 1. Providers
    const providerMap = new Map<string, string>();
    for (const p of ENGLISH_TEST_PROVIDERS) {
      const provider = await prisma.englishTestProvider.upsert({
        where: { code: p.code },
        update: {
          name: p.name,
          websiteUrl: p.websiteUrl,
          countryOfOrigin: p.countryOfOrigin,
          description: p.description,
        },
        create: {
          name: p.name,
          code: p.code,
          websiteUrl: p.websiteUrl,
          countryOfOrigin: p.countryOfOrigin,
          description: p.description,
        },
      });
      providerMap.set(p.code, provider.id);
    }

    // 2. Test Formats & Fees
    const formatMap = new Map<string, string>();
    for (const f of ENGLISH_TEST_FORMATS) {
      const providerId = providerMap.get(f.providerCode);
      if (!providerId) continue;

      const format = await prisma.englishTestFormat.upsert({
        where: { code: f.code },
        update: {
          providerId,
          name: f.name,
          deliveryMode: f.deliveryMode,
          speakingFormat: f.speakingFormat,
          durationMinutes: f.durationMinutes,
          scoreScale: f.scoreScale,
          scoreComponents: JSON.stringify(f.scoreComponents),
          scoringUpdateNotes: f.scoringUpdateNotes,
          resultTurnaround: f.resultTurnaround,
          resultTurnaroundSource: f.resultTurnaroundSource,
          validityYears: f.validityYears,
          bookingUrl: f.bookingUrl,
          preparationResourcesUrl: f.preparationResourcesUrl,
          preparationSummary: f.preparationSummary,
          acceptanceOverview: f.acceptanceOverview,
          visaImmigrationRestrictions: f.visaImmigrationRestrictions,
          isActive: true,
        },
        create: {
          providerId,
          name: f.name,
          code: f.code,
          deliveryMode: f.deliveryMode,
          speakingFormat: f.speakingFormat,
          durationMinutes: f.durationMinutes,
          scoreScale: f.scoreScale,
          scoreComponents: JSON.stringify(f.scoreComponents),
          scoringUpdateNotes: f.scoringUpdateNotes,
          resultTurnaround: f.resultTurnaround,
          resultTurnaroundSource: f.resultTurnaroundSource,
          validityYears: f.validityYears,
          bookingUrl: f.bookingUrl,
          preparationResourcesUrl: f.preparationResourcesUrl,
          preparationSummary: f.preparationSummary,
          acceptanceOverview: f.acceptanceOverview,
          visaImmigrationRestrictions: f.visaImmigrationRestrictions,
          isActive: true,
        },
      });
      formatMap.set(f.code, format.id);

      // Fee for Bangladesh
      const existingFee = await prisma.englishTestFee.findFirst({
        where: {
          testFormatId: format.id,
          country: f.fee.country,
        },
      });

      if (existingFee) {
        await prisma.englishTestFee.update({
          where: { id: existingFee.id },
          data: {
            currency: f.fee.currency,
            amount: f.fee.amount,
            currencyOriginal: f.fee.currencyOriginal,
            amountOriginal: f.fee.amountOriginal,
            bdtEstimate: f.fee.bdtEstimate,
            exchangeRateUsed: f.fee.exchangeRateUsed,
            officialFeeSourceUrl: f.fee.officialFeeSourceUrl,
            sourcePublicationDate: f.fee.sourcePublicationDate ? new Date(f.fee.sourcePublicationDate) : null,
            lastVerifiedAt: new Date(),
            verificationStatus: f.fee.verificationStatus,
            availabilityNotes: f.fee.availabilityNotes,
          },
        });
      } else {
        await prisma.englishTestFee.create({
          data: {
            testFormatId: format.id,
            country: f.fee.country,
            currency: f.fee.currency,
            amount: f.fee.amount,
            currencyOriginal: f.fee.currencyOriginal,
            amountOriginal: f.fee.amountOriginal,
            bdtEstimate: f.fee.bdtEstimate,
            exchangeRateUsed: f.fee.exchangeRateUsed,
            officialFeeSourceUrl: f.fee.officialFeeSourceUrl,
            sourcePublicationDate: f.fee.sourcePublicationDate ? new Date(f.fee.sourcePublicationDate) : null,
            lastVerifiedAt: new Date(),
            verificationStatus: f.fee.verificationStatus,
            availabilityNotes: f.fee.availabilityNotes,
          },
        });
      }
    }

    // 3. Test Sources
    const sources = [
      { title: 'IDP IELTS Bangladesh Official Dates & Fees', url: 'https://ielts.idp.com/bangladesh/about/ielts-test-dates-fees-locations', providerCode: 'IELTS' },
      { title: 'British Council Bangladesh Exam Locations & Fees', url: 'https://www.britishcouncil.org.bd/en/exam/ielts/dates-fees-locations', providerCode: 'IELTS' },
      { title: 'Pearson PTE Official Website & Test Booking', url: 'https://www.pearsonpte.com/', providerCode: 'PTE' },
      { title: 'ETS TOEFL Official Global Portal', url: 'https://www.ets.org/toefl.html', providerCode: 'TOEFL' },
    ];
    for (const src of sources) {
      const providerId = providerMap.get(src.providerCode);
      const existing = await prisma.testSource.findFirst({ where: { url: src.url } });
      if (!existing) {
        await prisma.testSource.create({
          data: {
            providerId,
            title: src.title,
            url: src.url,
            sourceType: 'OFFICIAL_PROVIDER',
            isVerified: true,
          },
        });
      }
    }

    // 4. UK University Acceptance Policies
    let seededPoliciesCount = 0;
    for (const p of UK_UNIVERSITY_TEST_POLICIES) {
      const university = await prisma.university.findUnique({
        where: { slug: p.universitySlug },
        include: { programs: { take: 1 } },
      });

      if (!university) continue;

      const formatId = formatMap.get(p.testFormatCode);
      if (!formatId) continue;

      // Unique check by university, test format, academic level, and policyTier
      const existingPolicy = await prisma.universityTestPolicy.findFirst({
        where: {
          universityId: university.id,
          testFormatId: formatId,
          academicLevel: p.academicLevel,
          policyTier: p.policyTier || null,
        },
      });

      if (existingPolicy) {
        await prisma.universityTestPolicy.update({
          where: { id: existingPolicy.id },
          data: {
            testName: p.testName,
            deliveryFormat: p.deliveryFormat,
            status: p.status,
            minOverallScore: p.minOverallScore,
            minListening: p.minListening,
            minReading: p.minReading,
            minWriting: p.minWriting,
            minSpeaking: p.minSpeaking,
            componentScoresJson: p.componentScoresJson,
            acceptedIntakes: p.acceptedIntakes,
            policyPeriod: p.policyPeriod,
            officialPolicyUrl: p.officialPolicyUrl,
            sourceExcerpt: p.sourceExcerpt,
            conditions: p.conditions,
            lastVerifiedAt: new Date(),
            approvalStatus: 'APPROVED',
          },
        });
      } else {
        await prisma.universityTestPolicy.create({
          data: {
            universityId: university.id,
            testFormatId: formatId,
            testName: p.testName,
            deliveryFormat: p.deliveryFormat,
            academicLevel: p.academicLevel,
            policyTier: p.policyTier || null,
            status: p.status,
            minOverallScore: p.minOverallScore,
            minListening: p.minListening,
            minReading: p.minReading,
            minWriting: p.minWriting,
            minSpeaking: p.minSpeaking,
            componentScoresJson: p.componentScoresJson,
            acceptedIntakes: p.acceptedIntakes,
            policyPeriod: p.policyPeriod,
            officialPolicyUrl: p.officialPolicyUrl,
            sourceExcerpt: p.sourceExcerpt,
            conditions: p.conditions,
            lastVerifiedAt: new Date(),
            approvalStatus: 'APPROVED',
          },
        });
      }
      seededPoliciesCount++;
    }

    console.log(`✅ Seeded ${formatMap.size} English test formats, fees, and ${seededPoliciesCount} UK university policies.`);
  }

  /**
   * Comparison matrix endpoint data
   */
  static async getComparisonMatrix() {
    const formats = await prisma.englishTestFormat.findMany({
      where: { isActive: true },
      include: {
        provider: true,
        fees: {
          where: { country: 'Bangladesh' },
          orderBy: { lastVerifiedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { durationMinutes: 'desc' },
    });

    const sources = await prisma.testSource.findMany({
      where: { isVerified: true },
    });

    return {
      formats: formats.map((f) => ({
        id: f.id,
        code: f.code,
        name: f.name,
        provider: {
          name: f.provider.name,
          code: f.provider.code,
          websiteUrl: f.provider.websiteUrl,
        },
        deliveryMode: f.deliveryMode,
        speakingFormat: f.speakingFormat,
        durationMinutes: f.durationMinutes,
        scoreScale: f.scoreScale,
        scoreComponents: JSON.parse(f.scoreComponents || '[]'),
        scoringUpdateNotes: f.scoringUpdateNotes,
        resultTurnaround: f.resultTurnaround,
        resultTurnaroundSource: f.resultTurnaroundSource,
        validityYears: f.validityYears,
        bookingUrl: f.bookingUrl,
        preparationResourcesUrl: f.preparationResourcesUrl,
        preparationSummary: f.preparationSummary,
        acceptanceOverview: f.acceptanceOverview,
        visaImmigrationRestrictions: f.visaImmigrationRestrictions,
        currentFee: f.fees[0]
          ? {
              id: f.fees[0].id,
              country: f.fees[0].country,
              currency: f.fees[0].currency,
              amount: f.fees[0].amount,
              currencyOriginal: f.fees[0].currencyOriginal,
              amountOriginal: f.fees[0].amountOriginal,
              bdtEstimate: f.fees[0].bdtEstimate,
              exchangeRateUsed: f.fees[0].exchangeRateUsed,
              officialFeeSourceUrl: f.fees[0].officialFeeSourceUrl,
              sourcePublicationDate: f.fees[0].sourcePublicationDate,
              lastVerifiedAt: f.fees[0].lastVerifiedAt,
              verificationStatus: f.fees[0].verificationStatus,
              availabilityNotes: f.fees[0].availabilityNotes,
            }
          : null,
      })),
      officialSources: sources,
      disclaimer:
        'Borno Higher Study never claims one test is universally best. Suitability depends entirely on your target course, university, and intended visa or admission route.',
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Search and filter university test acceptance with server-side pagination
   */
  static async getUniversityAcceptanceList(params: {
    countrySlug?: string;
    search?: string;
    academicLevel?: string;
    testFormatCode?: string;
    deliveryFormat?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 12));
    const skip = (page - 1) * limit;

    const where: any = {
      approvalStatus: 'APPROVED',
    };

    if (params.academicLevel && params.academicLevel !== 'ALL') {
      where.academicLevel = { in: [params.academicLevel, 'ALL'] };
    }

    if (params.deliveryFormat && params.deliveryFormat !== 'ALL') {
      where.deliveryFormat = params.deliveryFormat;
    }

    if (params.status && params.status !== 'ALL') {
      where.status = params.status;
    }

    if (params.testFormatCode && params.testFormatCode !== 'ALL') {
      where.testFormat = { code: params.testFormatCode };
    }

    // University search / country filter
    const universityWhere: any = {};
    if (params.countrySlug && params.countrySlug !== 'ALL') {
      universityWhere.country = { slug: params.countrySlug };
    }
    if (params.search) {
      universityWhere.OR = [
        { name: { contains: params.search } },
        { cityName: { contains: params.search } },
      ];
    }

    if (Object.keys(universityWhere).length > 0) {
      where.university = universityWhere;
    }

    const [total, policies] = await Promise.all([
      prisma.universityTestPolicy.count({ where }),
      prisma.universityTestPolicy.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ university: { qsRanking: 'asc' } }, { minOverallScore: 'desc' }],
        include: {
          university: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
              cityName: true,
              websiteUrl: true,
              qsRanking: true,
              country: {
                select: { name: true, slug: true, flagEmoji: true, code: true },
              },
            },
          },
          program: {
            select: { id: true, name: true, slug: true, degreeLevel: true },
          },
          testFormat: {
            select: { id: true, code: true, name: true, deliveryMode: true, provider: { select: { name: true } } },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      policies: policies.map((p) => {
        let componentScores = null;
        try {
          if (p.componentScoresJson) {
            componentScores = JSON.parse(p.componentScoresJson);
          }
        } catch {
          componentScores = null;
        }

        // Determine warning level if unknown, conditional, or outdated (> 180 days)
        const daysSinceVerification = Math.floor(
          (Date.now() - new Date(p.lastVerifiedAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        const isStale = daysSinceVerification > 180 || p.isOutdated;

        let warningNotice: string | null = null;
        if (p.status === 'NOT_CONFIRMED' || p.status === 'UNDER_REVIEW') {
          warningNotice = 'Policy currently under review or unconfirmed by university admissions. Do not infer acceptance or rejection.';
        } else if (p.status === 'ACCEPTED_WITH_CONDITIONS') {
          warningNotice = p.conditions || 'Accepted with special conditions (e.g. pre-sessional English or departmental approval required).';
        } else if (isStale) {
          warningNotice = `Policy verified ${daysSinceVerification} days ago. Please cross-check latest admission circular before booking.`;
        }

        return {
          id: p.id,
          university: p.university,
          program: p.program,
          testFormat: p.testFormat,
          testName: p.testName,
          deliveryFormat: p.deliveryFormat,
          academicLevel: p.academicLevel,
          policyTier: p.policyTier,
          status: p.status,
          minOverallScore: p.minOverallScore,
          minListening: p.minListening,
          minReading: p.minReading,
          minWriting: p.minWriting,
          minSpeaking: p.minSpeaking,
          componentScores,
          acceptedIntakes: p.acceptedIntakes,
          policyPeriod: p.policyPeriod,
          officialPolicyUrl: p.officialPolicyUrl,
          sourceExcerpt: p.sourceExcerpt,
          conditions: p.conditions,
          lastVerifiedAt: p.lastVerifiedAt,
          daysSinceVerification,
          isStale,
          warningNotice,
        };
      }),
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Recommendation Wizard Algorithm
   */
  static async getAdvisorRecommendation(payload: {
    targetCountry?: string;
    qualificationLevel?: string;
    shortlistedUniIds?: string[];
    deliveryPreference?: 'TEST_CENTRE' | 'ONLINE' | 'NO_PREFERENCE';
    existingTest?: string;
    existingScore?: number;
    budgetBdt?: number;
  }) {
    const {
      targetCountry = 'united-kingdom',
      qualificationLevel = 'UNDERGRADUATE',
      shortlistedUniIds = [],
      deliveryPreference = 'NO_PREFERENCE',
      existingTest,
      existingScore,
      budgetBdt,
    } = payload;

    // Fetch active test formats and Bangladesh fees
    const formats = await prisma.englishTestFormat.findMany({
      where: { isActive: true },
      include: {
        fees: { where: { country: 'Bangladesh' }, take: 1 },
      },
    });

    // Fetch shortlisted universities policies
    let shortlistedPolicies: any[] = [];
    let universities: any[] = [];
    if (shortlistedUniIds.length > 0) {
      universities = await prisma.university.findMany({
        where: { id: { in: shortlistedUniIds } },
        select: { id: true, name: true, slug: true },
      });

      shortlistedPolicies = await prisma.universityTestPolicy.findMany({
        where: {
          universityId: { in: shortlistedUniIds },
          approvalStatus: 'APPROVED',
        },
        include: {
          university: { select: { id: true, name: true } },
          testFormat: true,
        },
      });
    }

    // Analyze conflict: Do any shortlisted universities strictly reject online tests?
    const onlineRejectingUnis: string[] = [];
    for (const pol of shortlistedPolicies) {
      if (pol.deliveryFormat === 'ONLINE' && pol.status === 'NOT_ACCEPTED') {
        if (!onlineRejectingUnis.includes(pol.university.name)) {
          onlineRejectingUnis.push(pol.university.name);
        }
      }
    }

    // Evaluate tests by acceptance score
    const evaluatedTests = formats.map((fmt) => {
      let acceptedCount = 0;
      let totalShortlistedWithPolicy = 0;
      const relevantPolicies = shortlistedPolicies.filter((p) => p.testFormatId === fmt.id);

      for (const p of relevantPolicies) {
        totalShortlistedWithPolicy++;
        if (p.status === 'ACCEPTED' || p.status === 'ACCEPTED_WITH_CONDITIONS') {
          acceptedCount++;
        }
      }

      // Base acceptance percentage
      let acceptanceRate = 0;
      if (totalShortlistedWithPolicy > 0) {
        acceptanceRate = Math.round((acceptedCount / totalShortlistedWithPolicy) * 100);
      } else {
        // Fallback standard rate if no specific policies logged
        acceptanceRate = fmt.deliveryMode === 'ONLINE' ? 35 : 98;
      }

      // Check delivery preference match
      let deliveryMatch = true;
      if (deliveryPreference === 'TEST_CENTRE' && fmt.deliveryMode === 'ONLINE') deliveryMatch = false;
      if (deliveryPreference === 'ONLINE' && fmt.deliveryMode === 'TEST_CENTRE') deliveryMatch = false;

      // Fee check
      const fee = fmt.fees[0];
      const feeAmountBdt = fee ? (fee.bdtEstimate || fee.amount || 26000) : 26000;
      const budgetFit = budgetBdt ? feeAmountBdt <= budgetBdt : true;

      return {
        format: fmt,
        acceptedCount,
        totalChecked: totalShortlistedWithPolicy,
        acceptanceRate,
        deliveryMatch,
        feeAmountBdt,
        budgetFit,
      };
    });

    // Sort: prioritizes highest acceptance rate, delivery match, and test centre if online is rejected
    evaluatedTests.sort((a, b) => {
      if (onlineRejectingUnis.length > 0) {
        if (a.format.deliveryMode === 'ONLINE' && b.format.deliveryMode !== 'ONLINE') return 1;
        if (b.format.deliveryMode === 'ONLINE' && a.format.deliveryMode !== 'ONLINE') return -1;
      }
      if (b.acceptanceRate !== a.acceptanceRate) return b.acceptanceRate - a.acceptanceRate;
      return (a.feeAmountBdt || 0) - (b.feeAmountBdt || 0);
    });

    const recommended = evaluatedTests[0];
    const secondaryAlternative = evaluatedTests[1];

    // Conflict notifications
    const conflictAlerts: string[] = [];
    if (deliveryPreference === 'ONLINE' && onlineRejectingUnis.length > 0) {
      conflictAlerts.push(
        `CONFLICT DETECTED: You preferred an online/at-home test, but ${onlineRejectingUnis.join(', ')} explicitly refuses online test results (e.g. TOEFL Home Edition or PTE Online). We strongly recommend an in-person test-centre exam to avoid rejection of your admission or CAS visa sponsorship.`
      );
    }

    if (qualificationLevel === 'FOUNDATION') {
      conflictAlerts.push(
        'UKVI IMMIGRATION NOTICE: For UK study below degree level (Foundation, Pathway, Pre-sessional), a Secure English Language Test (SELT) such as IELTS for UKVI or PTE Academic UKVI is mandatory by UK Home Office visa rules.'
      );
    }

    return {
      recommendation: {
        primary: {
          testFormatId: recommended.format.id,
          code: recommended.format.code,
          name: recommended.format.name,
          deliveryMode: recommended.format.deliveryMode,
          speakingFormat: recommended.format.speakingFormat,
          durationMinutes: recommended.format.durationMinutes,
          scoreScale: recommended.format.scoreScale,
          resultTurnaround: recommended.format.resultTurnaround,
          bookingUrl: recommended.format.bookingUrl,
          estimatedFeeBdt: recommended.feeAmountBdt,
          acceptanceRateAcrossShortlist: recommended.acceptanceRate,
          shortlistMatchDescription: `${recommended.acceptedCount} of ${shortlistedUniIds.length || 1} shortlisted universities verified to accept this exam.`,
          rationale: `Accepted by the widest proportion of your selected institutions with reliable official recognition and verified test centre infrastructure in Bangladesh.`,
        },
        alternative: secondaryAlternative
          ? {
              testFormatId: secondaryAlternative.format.id,
              code: secondaryAlternative.format.code,
              name: secondaryAlternative.format.name,
              deliveryMode: secondaryAlternative.format.deliveryMode,
              estimatedFeeBdt: secondaryAlternative.feeAmountBdt,
              acceptanceRateAcrossShortlist: secondaryAlternative.acceptanceRate,
              rationale: `Viable alternative test option depending on appointment date availability and personal preparation preference.`,
            }
          : null,
      },
      shortlistedUniversitiesCount: shortlistedUniIds.length,
      onlineConflictDetected: onlineRejectingUnis.length > 0,
      conflictAlerts,
      disclaimer:
        'Official admissions requirements and visa regulations are subject to change. Always verify minimum overall and component band requirements with the admissions office of your target department before booking your exam.',
    };
  }

  /**
   * Super Admin: Update test fee
   */
  static async updateTestFee(
    feeId: string,
    data: {
      amount?: number;
      currency?: string;
      bdtEstimate?: number;
      officialFeeSourceUrl?: string;
      verificationStatus?: string;
      availabilityNotes?: string;
    },
    adminUserId: string
  ) {
    const existing = await prisma.englishTestFee.findUnique({
      where: { id: feeId },
      include: { testFormat: true },
    });
    if (!existing) throw new Error('Fee record not found');

    const updated = await prisma.englishTestFee.update({
      where: { id: feeId },
      data: {
        amount: data.amount ?? existing.amount,
        currency: data.currency ?? existing.currency,
        bdtEstimate: data.bdtEstimate ?? existing.bdtEstimate,
        officialFeeSourceUrl: data.officialFeeSourceUrl ?? existing.officialFeeSourceUrl,
        verificationStatus: data.verificationStatus ?? 'VERIFIED',
        availabilityNotes: data.availabilityNotes ?? existing.availabilityNotes,
        lastVerifiedAt: new Date(),
        reviewedBy: adminUserId,
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: adminUserId,
        action: 'UPDATE_ENGLISH_TEST_FEE',
        entityType: 'EnglishTestFee',
        entityId: feeId,
        details: JSON.stringify({
          testFormat: existing.testFormat.name,
          previous: { amount: existing.amount, currency: existing.currency, status: existing.verificationStatus },
          updated: { amount: updated.amount, currency: updated.currency, status: updated.verificationStatus },
        }),
      },
    });

    return updated;
  }

  /**
   * Super Admin: Add or update university test policy
   */
  static async upsertUniversityPolicy(
    data: {
      id?: string;
      universityId: string;
      programId?: string;
      testFormatId: string;
      academicLevel: string;
      policyTier?: string;
      status: string;
      minOverallScore?: number;
      minListening?: number;
      minReading?: number;
      minWriting?: number;
      minSpeaking?: number;
      conditions?: string;
      officialPolicyUrl: string;
      sourceExcerpt?: string;
      isOutdated?: boolean;
    },
    adminUserId: string
  ) {
    const format = await prisma.englishTestFormat.findUnique({ where: { id: data.testFormatId } });
    if (!format) throw new Error('Test format not found');

    const componentScoresJson = JSON.stringify({
      listening: data.minListening || null,
      reading: data.minReading || null,
      writing: data.minWriting || null,
      speaking: data.minSpeaking || null,
    });

    let policy: any;
    if (data.id) {
      const existing = await prisma.universityTestPolicy.findUnique({ where: { id: data.id } });
      if (!existing) throw new Error('Policy not found');

      policy = await prisma.universityTestPolicy.update({
        where: { id: data.id },
        data: {
          testName: format.name,
          deliveryFormat: format.deliveryMode === 'ONLINE' ? 'ONLINE' : 'TEST_CENTRE',
          academicLevel: data.academicLevel,
          policyTier: data.policyTier,
          status: data.status,
          minOverallScore: data.minOverallScore,
          minListening: data.minListening,
          minReading: data.minReading,
          minWriting: data.minWriting,
          minSpeaking: data.minSpeaking,
          componentScoresJson,
          conditions: data.conditions,
          officialPolicyUrl: data.officialPolicyUrl,
          sourceExcerpt: data.sourceExcerpt,
          isOutdated: data.isOutdated ?? false,
          lastVerifiedAt: new Date(),
          reviewerId: adminUserId,
          approvalStatus: 'APPROVED',
        },
      });

      // Record revision
      await prisma.testPolicyRevision.create({
        data: {
          policyId: policy.id,
          changedBy: adminUserId,
          changeType: 'UPDATED',
          previousData: JSON.stringify(existing),
          newData: JSON.stringify(policy),
          changeReason: 'Admin policy review and update',
        },
      });
    } else {
      policy = await prisma.universityTestPolicy.create({
        data: {
          universityId: data.universityId,
          programId: data.programId || null,
          testFormatId: data.testFormatId,
          testName: format.name,
          deliveryFormat: format.deliveryMode === 'ONLINE' ? 'ONLINE' : 'TEST_CENTRE',
          academicLevel: data.academicLevel,
          policyTier: data.policyTier,
          status: data.status,
          minOverallScore: data.minOverallScore,
          minListening: data.minListening,
          minReading: data.minReading,
          minWriting: data.minWriting,
          minSpeaking: data.minSpeaking,
          componentScoresJson,
          conditions: data.conditions,
          officialPolicyUrl: data.officialPolicyUrl,
          sourceExcerpt: data.sourceExcerpt,
          isOutdated: false,
          lastVerifiedAt: new Date(),
          reviewerId: adminUserId,
          approvalStatus: 'APPROVED',
        },
      });

      await prisma.testPolicyRevision.create({
        data: {
          policyId: policy.id,
          changedBy: adminUserId,
          changeType: 'CREATED',
          newData: JSON.stringify(policy),
          changeReason: 'New policy record created',
        },
      });
    }

    return policy;
  }

  /**
   * Student: Submit incorrect information report / correction proposal
   */
  static async submitCorrection(payload: {
    userId?: string;
    reporterName?: string;
    reporterEmail?: string;
    targetType: 'TEST_FEE' | 'UNIVERSITY_POLICY';
    feeId?: string;
    policyId?: string;
    correctionCategory: string;
    proposedChange: string;
    evidenceUrl?: string;
    evidenceNotes?: string;
  }) {
    return prisma.testAcceptanceCorrection.create({
      data: {
        userId: payload.userId || null,
        reporterName: payload.reporterName || 'Anonymous Student',
        reporterEmail: payload.reporterEmail || null,
        targetType: payload.targetType,
        feeId: payload.feeId || null,
        policyId: payload.policyId || null,
        correctionCategory: payload.correctionCategory,
        proposedChange: payload.proposedChange,
        evidenceUrl: payload.evidenceUrl || null,
        evidenceNotes: payload.evidenceNotes || null,
        status: 'PENDING',
      },
    });
  }

  /**
   * Super Admin: Review student correction
   */
  static async reviewCorrection(
    correctionId: string,
    decision: 'APPROVE' | 'REJECT',
    adminNotes: string,
    adminUserId: string
  ) {
    const correction = await prisma.testAcceptanceCorrection.findUnique({
      where: { id: correctionId },
      include: { policy: true, fee: true },
    });
    if (!correction) throw new Error('Correction not found');

    if (decision === 'APPROVE') {
      if (correction.targetType === 'UNIVERSITY_POLICY' && correction.policyId) {
        // Apply proposed change and record audit revision
        await prisma.universityTestPolicy.update({
          where: { id: correction.policyId },
          data: {
            sourceExcerpt: `Updated via approved community report: ${correction.proposedChange}`,
            lastVerifiedAt: new Date(),
            reviewerId: adminUserId,
          },
        });

        await prisma.testPolicyRevision.create({
          data: {
            policyId: correction.policyId,
            changedBy: adminUserId,
            changeType: 'CORRECTION_APPLIED',
            newData: JSON.stringify({ correctionId, proposedChange: correction.proposedChange }),
            changeReason: `Applied approved student report: ${adminNotes}`,
          },
        });
      }

      await prisma.testAcceptanceCorrection.update({
        where: { id: correctionId },
        data: {
          status: 'APPROVED',
          adminNotes,
          reviewedBy: adminUserId,
          reviewedAt: new Date(),
        },
      });

      // Notify reporter if userId exists
      if (correction.userId) {
        await prisma.notification.create({
          data: {
            userId: correction.userId,
            title: 'Your English Test Correction Proposal Was Approved!',
            message: `Thank you for contributing. An administrator has verified and applied your correction: "${correction.correctionCategory}".`,
            type: 'INFO_REPORT',
          },
        });
      }
    } else {
      await prisma.testAcceptanceCorrection.update({
        where: { id: correctionId },
        data: {
          status: 'REJECTED',
          adminNotes,
          reviewedBy: adminUserId,
          reviewedAt: new Date(),
        },
      });

      if (correction.userId) {
        await prisma.notification.create({
          data: {
            userId: correction.userId,
            title: 'Update regarding your English Test Report',
            message: `Your report regarding "${correction.correctionCategory}" was reviewed: ${adminNotes}`,
            type: 'INFO_REPORT',
          },
        });
      }
    }

    return prisma.testAcceptanceCorrection.findUnique({ where: { id: correctionId } });
  }

  /**
   * Super Admin: Get all corrections pending review
   */
  static async getCorrectionsQueue() {
    return prisma.testAcceptanceCorrection.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        policy: {
          include: {
            university: { select: { name: true, slug: true } },
            testFormat: { select: { name: true, code: true } },
          },
        },
        fee: {
          include: {
            testFormat: { select: { name: true, code: true } },
          },
        },
      },
    });
  }

  /**
   * Super Admin: Outdated & stale policies (> 180 days or marked outdated)
   */
  static async getOutdatedPolicies() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 180);

    return prisma.universityTestPolicy.findMany({
      where: {
        OR: [{ isOutdated: true }, { lastVerifiedAt: { lt: cutoffDate } }],
      },
      include: {
        university: { select: { name: true, slug: true, country: { select: { name: true } } } },
        testFormat: { select: { name: true, code: true } },
      },
      orderBy: { lastVerifiedAt: 'asc' },
    });
  }
}
