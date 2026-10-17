import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { EnglishTestService } from '../services/englishTestService.js';

const prisma = new PrismaClient();

export class EnglishTestController {
  /**
   * GET /api/english-tests/matrix
   * Public: Comparison matrix of IELTS, IELTS UKVI, PTE, PTE Online, PTE UKVI, TOEFL, TOEFL Home Edition
   */
  static async getComparisonMatrix(req: Request, res: Response) {
    try {
      const data = await EnglishTestService.getComparisonMatrix();
      return res.json(data);
    } catch (error: any) {
      console.error('Error in getComparisonMatrix:', error);
      return res.status(500).json({ error: 'Failed to fetch English test comparison matrix' });
    }
  }

  /**
   * GET /api/english-tests/university-acceptance
   * Public: Server-side paginated list of university acceptance rules
   */
  static async getUniversityAcceptances(req: Request, res: Response) {
    try {
      const {
        countrySlug,
        search,
        academicLevel,
        testFormatCode,
        deliveryFormat,
        status,
        page,
        limit,
      } = req.query;

      const data = await EnglishTestService.getUniversityAcceptanceList({
        countrySlug: countrySlug as string,
        search: search as string,
        academicLevel: academicLevel as string,
        testFormatCode: testFormatCode as string,
        deliveryFormat: deliveryFormat as string,
        status: status as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 12,
      });

      return res.json(data);
    } catch (error: any) {
      console.error('Error in getUniversityAcceptances:', error);
      return res.status(500).json({ error: 'Failed to fetch university English test acceptance' });
    }
  }

  /**
   * POST /api/english-tests/advisor-recommendation
   * Public: Multi-step interactive advisor recommendation algorithm
   */
  static async getAdvisorRecommendation(req: Request, res: Response) {
    try {
      const {
        targetCountry,
        qualificationLevel,
        shortlistedUniIds,
        deliveryPreference,
        existingTest,
        existingScore,
        budgetBdt,
      } = req.body;

      const result = await EnglishTestService.getAdvisorRecommendation({
        targetCountry,
        qualificationLevel,
        shortlistedUniIds,
        deliveryPreference,
        existingTest,
        existingScore,
        budgetBdt: budgetBdt ? Number(budgetBdt) : undefined,
      });

      // Save preference if authenticated user
      const user = (req as any).user;
      if (user?.id) {
        await prisma.studentTestPreference.create({
          data: {
            userId: user.id,
            targetCountry: targetCountry || 'united-kingdom',
            qualificationLevel: qualificationLevel || 'UNDERGRADUATE',
            shortlistedUniIds: JSON.stringify(shortlistedUniIds || []),
            deliveryPreference: deliveryPreference || 'NO_PREFERENCE',
            existingTest: existingTest || null,
            existingScore: existingScore ? Number(existingScore) : null,
            budgetBdt: budgetBdt ? Number(budgetBdt) : null,
            recommendedTestFormatId: result.recommendation.primary.testFormatId,
            recommendationSummary: JSON.stringify(result.recommendation),
          },
        });
      }

      return res.json(result);
    } catch (error: any) {
      console.error('Error in getAdvisorRecommendation:', error);
      return res.status(500).json({ error: 'Failed to generate test recommendations' });
    }
  }

  /**
   * POST /api/english-tests/corrections
   * Public / Student: Submit incorrect info report on fees or acceptance policies
   */
  static async submitCorrection(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const {
        reporterName,
        reporterEmail,
        targetType,
        feeId,
        policyId,
        correctionCategory,
        proposedChange,
        evidenceUrl,
        evidenceNotes,
      } = req.body;

      if (!targetType || !correctionCategory || !proposedChange) {
        return res.status(400).json({ error: 'Missing required correction fields' });
      }

      const correction = await EnglishTestService.submitCorrection({
        userId: user?.id,
        reporterName: user?.name || reporterName,
        reporterEmail: user?.email || reporterEmail,
        targetType,
        feeId,
        policyId,
        correctionCategory,
        proposedChange,
        evidenceUrl,
        evidenceNotes,
      });

      return res.status(201).json({
        message: 'Your report has been received and queued for Super Admin verification.',
        correction,
      });
    } catch (error: any) {
      console.error('Error in submitCorrection:', error);
      return res.status(500).json({ error: 'Failed to submit correction report' });
    }
  }

  /**
   * GET /api/admin/english-tests/overview
   * Admin: Overview metrics and KPIs for dashboard
   */
  static async getAdminOverview(req: Request, res: Response) {
    try {
      const [
        totalPolicies,
        totalFees,
        pendingCorrections,
        outdatedPolicies,
        testFormats,
        recentRevisions,
      ] = await Promise.all([
        prisma.universityTestPolicy.count(),
        prisma.englishTestFee.count(),
        prisma.testAcceptanceCorrection.count({ where: { status: 'PENDING' } }),
        EnglishTestService.getOutdatedPolicies(),
        prisma.englishTestFormat.findMany({
          include: {
            provider: true,
            fees: { take: 1, orderBy: { lastVerifiedAt: 'desc' } },
            _count: { select: { policies: true } },
          },
        }),
        prisma.testPolicyRevision.findMany({
          take: 10,
          orderBy: { timestamp: 'desc' },
          include: { policy: { select: { testName: true, university: { select: { name: true } } } } },
        }),
      ]);

      return res.json({
        totalPolicies,
        totalFees,
        pendingCorrections,
        outdatedPoliciesCount: outdatedPolicies.length,
        testFormats,
        recentRevisions,
      });
    } catch (error: any) {
      console.error('Error in getAdminOverview:', error);
      return res.status(500).json({ error: 'Failed to load English test admin overview' });
    }
  }

  /**
   * PUT /api/admin/english-tests/fees/:id
   * Admin: Update fee and approval status
   */
  static async updateFee(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { id } = req.params;
      const {
        amount,
        currency,
        bdtEstimate,
        officialFeeSourceUrl,
        verificationStatus,
        availabilityNotes,
      } = req.body;

      const updated = await EnglishTestService.updateTestFee(
        id,
        {
          amount: amount ? Number(amount) : undefined,
          currency,
          bdtEstimate: bdtEstimate ? Number(bdtEstimate) : undefined,
          officialFeeSourceUrl,
          verificationStatus,
          availabilityNotes,
        },
        user.id
      );

      return res.json({ message: 'Exam fee updated and verified successfully', fee: updated });
    } catch (error: any) {
      console.error('Error in updateFee:', error);
      return res.status(500).json({ error: error.message || 'Failed to update fee' });
    }
  }

  /**
   * POST /api/admin/english-tests/policies
   * Admin: Add or update university test policy
   */
  static async upsertPolicy(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const policy = await EnglishTestService.upsertUniversityPolicy(req.body, user.id);
      return res.json({ message: 'University policy saved successfully', policy });
    } catch (error: any) {
      console.error('Error in upsertPolicy:', error);
      return res.status(500).json({ error: error.message || 'Failed to save university policy' });
    }
  }

  /**
   * GET /api/admin/english-tests/corrections
   * Admin: List corrections queue
   */
  static async getCorrectionsQueue(req: Request, res: Response) {
    try {
      const queue = await EnglishTestService.getCorrectionsQueue();
      return res.json(queue);
    } catch (error: any) {
      console.error('Error in getCorrectionsQueue:', error);
      return res.status(500).json({ error: 'Failed to fetch corrections queue' });
    }
  }

  /**
   * POST /api/admin/english-tests/corrections/:id/review
   * Admin: Approve or reject student-submitted correction
   */
  static async reviewCorrection(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { id } = req.params;
      const { decision, adminNotes } = req.body;

      if (!['APPROVE', 'REJECT'].includes(decision)) {
        return res.status(400).json({ error: 'Decision must be APPROVE or REJECT' });
      }

      const result = await EnglishTestService.reviewCorrection(id, decision, adminNotes, user.id);
      return res.json({ message: `Correction marked as ${decision}`, correction: result });
    } catch (error: any) {
      console.error('Error in reviewCorrection:', error);
      return res.status(500).json({ error: error.message || 'Failed to review correction' });
    }
  }

  /**
   * GET /api/admin/english-tests/outdated-policies
   * Admin: List outdated policies
   */
  static async getOutdatedPolicies(req: Request, res: Response) {
    try {
      const outdated = await EnglishTestService.getOutdatedPolicies();
      return res.json(outdated);
    } catch (error: any) {
      console.error('Error in getOutdatedPolicies:', error);
      return res.status(500).json({ error: 'Failed to fetch outdated policies' });
    }
  }

  /**
   * POST /api/admin/english-tests/seed
   * Admin: Trigger seed of default formats, fees, and UK policies
   */
  static async triggerSeed(req: Request, res: Response) {
    try {
      await EnglishTestService.seedAllEnglishTestData();
      return res.json({ message: 'English test catalog and initial UK university policies seeded successfully' });
    } catch (error: any) {
      console.error('Error in triggerSeed:', error);
      return res.status(500).json({ error: 'Failed to trigger seed' });
    }
  }
}
