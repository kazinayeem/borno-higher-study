// Borno Higher Study — Country Work Guide Controller
// Exposes REST API endpoints for Country Work Guide, Wages, Student Work, Post-Study Visas, Roadmaps, and Admin Verification.

import { Request, Response } from 'express';
import { countryWorkGuideService } from '../services/countryWorkGuideService.js';

export class CountryWorkGuideController {
  /**
   * GET /api/country-work-guide
   */
  async getGlobalOverview(req: Request, res: Response) {
    try {
      const { search, continent, policyType, studentWorkStatus, hasPostStudyRoute } = req.query;
      const data = await countryWorkGuideService.getGlobalOverview({
        search: search as string,
        continent: continent as string,
        policyType: policyType as string,
        studentWorkStatus: studentWorkStatus as string,
        hasPostStudyRoute: hasPostStudyRoute === 'true',
      });
      return res.json({ success: true, count: data.length, data });
    } catch (error: any) {
      console.error('[CountryWorkGuideController] Error fetching global overview:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch global overview' });
    }
  }

  /**
   * GET /api/country-work-guide/profile/:codeOrSlug
   */
  async getCountryProfile(req: Request, res: Response) {
    try {
      const { codeOrSlug } = req.params;
      const profile = await countryWorkGuideService.getCountryWorkProfile(codeOrSlug);
      if (!profile) {
        return res.status(404).json({ success: false, message: 'Country work profile not found' });
      }
      return res.json({ success: true, profile });
    } catch (error: any) {
      console.error('[CountryWorkGuideController] Error fetching country profile:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch country profile' });
    }
  }

  /**
   * GET /api/country-work-guide/compare?countries=DE,GB,CA
   */
  async getSideBySideComparison(req: Request, res: Response) {
    try {
      const countriesParam = req.query.countries as string;
      const countryCodes = countriesParam ? countriesParam.split(',').map((c) => c.trim()) : ['DE', 'GB', 'CA', 'AU'];
      const comparison = await countryWorkGuideService.getSideBySideComparison(countryCodes);
      return res.json({ success: true, count: comparison.length, comparison });
    } catch (error: any) {
      console.error('[CountryWorkGuideController] Error fetching comparison:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch comparison' });
    }
  }

  /**
   * GET /api/country-work-guide/minimum-wages
   */
  async getMinimumWages(req: Request, res: Response) {
    try {
      const { policyType, hasStatutory } = req.query;
      const data = await countryWorkGuideService.getMinimumWageDirectory({
        policyType: policyType as string,
        hasStatutory: hasStatutory !== undefined ? hasStatutory === 'true' : undefined,
      });
      return res.json({ success: true, count: data.length, data });
    } catch (error: any) {
      console.error('[CountryWorkGuideController] Error fetching minimum wages:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch minimum wages' });
    }
  }

  /**
   * GET /api/country-work-guide/student-work-rules
   */
  async getStudentWorkRules(req: Request, res: Response) {
    try {
      const { eligibilityStatus, selfEmployment } = req.query;
      const data = await countryWorkGuideService.getStudentWorkRulesDirectory({
        eligibilityStatus: eligibilityStatus as string,
        selfEmployment: selfEmployment !== undefined ? selfEmployment === 'true' : undefined,
      });
      return res.json({ success: true, count: data.length, data });
    } catch (error: any) {
      console.error('[CountryWorkGuideController] Error fetching student work rules:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch student work rules' });
    }
  }

  /**
   * GET /api/country-work-guide/post-study-work
   */
  async getPostStudyWorkRoutes(req: Request, res: Response) {
    try {
      const { jobOfferRequired, leadsToPR } = req.query;
      const data = await countryWorkGuideService.getPostStudyWorkRoutesDirectory({
        jobOfferRequired: jobOfferRequired !== undefined ? jobOfferRequired === 'true' : undefined,
        leadsToPR: leadsToPR !== undefined ? leadsToPR === 'true' : undefined,
      });
      return res.json({ success: true, count: data.length, data });
    } catch (error: any) {
      console.error('[CountryWorkGuideController] Error fetching post-study routes:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch post-study work routes' });
    }
  }

  /**
   * GET /api/country-work-guide/career-roadmaps
   */
  async getCareerRoadmaps(req: Request, res: Response) {
    try {
      const data = await countryWorkGuideService.getCareerRoadmapsDirectory();
      return res.json({ success: true, count: data.length, data });
    } catch (error: any) {
      console.error('[CountryWorkGuideController] Error fetching roadmaps:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch career roadmaps' });
    }
  }

  /**
   * GET /api/country-work-guide/sources
   */
  async getOfficialSources(req: Request, res: Response) {
    try {
      const { category, status } = req.query;
      const data = await countryWorkGuideService.getOfficialSourcesDirectory({
        category: category as string,
        status: status as string,
      });
      return res.json({ success: true, count: data.length, data });
    } catch (error: any) {
      console.error('[CountryWorkGuideController] Error fetching sources:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch official sources' });
    }
  }

  /**
   * POST /api/country-work-guide/planner
   */
  async generatePersonalizedPlan(req: Request, res: Response) {
    try {
      const input = req.body;
      if (!input || !input.degreeLevel) {
        return res.status(400).json({ success: false, message: 'degreeLevel is required for planner' });
      }
      const recommendations = await countryWorkGuideService.generatePersonalizedPlan(input);
      return res.json({ success: true, count: recommendations.length, recommendations });
    } catch (error: any) {
      console.error('[CountryWorkGuideController] Error generating plan:', error);
      return res.status(500).json({ success: false, message: 'Failed to generate personalized plan' });
    }
  }

  /**
   * POST /api/country-work-guide/verify (Admin)
   */
  async verifyPolicy(req: Request, res: Response) {
    try {
      const { countryId, entityType, entityId, status, findings, sourceUrl } = req.body;
      const userId = (req as any).user?.id;
      const record = await countryWorkGuideService.verifyPolicy({
        countryId,
        entityType,
        entityId,
        status,
        findings,
        sourceUrl,
        userId,
      });
      return res.json({ success: true, record });
    } catch (error: any) {
      console.error('[CountryWorkGuideController] Error verifying policy:', error);
      return res.status(500).json({ success: false, message: 'Failed to verify policy' });
    }
  }

  /**
   * POST /api/country-work-guide/corrections
   */
  async submitCorrectionReport(req: Request, res: Response) {
    try {
      const { countryId, entityType, reportedIssue, proposedCorrection, evidenceUrl } = req.body;
      const userId = (req as any).user?.id;
      const report = await countryWorkGuideService.submitCorrectionReport({
        countryId,
        entityType,
        reportedIssue,
        proposedCorrection,
        evidenceUrl,
        userId,
      });
      return res.json({ success: true, report });
    } catch (error: any) {
      console.error('[CountryWorkGuideController] Error submitting correction:', error);
      return res.status(500).json({ success: false, message: 'Failed to submit correction report' });
    }
  }

  /**
   * GET /api/country-work-guide/admin/corrections
   */
  async getCorrectionReports(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const reports = await countryWorkGuideService.getCorrectionReports(status as string);
      return res.json({ success: true, count: reports.length, reports });
    } catch (error: any) {
      console.error('[CountryWorkGuideController] Error fetching corrections:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch correction reports' });
    }
  }

  /**
   * PATCH /api/country-work-guide/admin/corrections/:id
   */
  async reviewCorrectionReport(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;
      const updated = await countryWorkGuideService.reviewCorrectionReport(id, status, adminNotes);
      return res.json({ success: true, updated });
    } catch (error: any) {
      console.error('[CountryWorkGuideController] Error reviewing correction:', error);
      return res.status(500).json({ success: false, message: 'Failed to review correction report' });
    }
  }
  /**
   * Dedicated Dataset 1: GET /api/country-work-guide/datasets/minimum-wages
   */
  async getDatasetsMinimumWages(req: Request, res: Response) {
    try {
      const { countryCode } = req.query;
      const data = await countryWorkGuideService.getMinimumWagesDataset(countryCode as string);
      return res.json({ success: true, dataset: 'minimum-wages', count: data.length, data });
    } catch (error: any) {
      console.error('[CountryWorkGuideController] Error fetching minimum wages dataset:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch minimum wages dataset' });
    }
  }

  /**
   * Dedicated Dataset 2: GET /api/country-work-guide/datasets/student-work-hours
   */
  async getDatasetsStudentWorkHours(req: Request, res: Response) {
    try {
      const { countryCode } = req.query;
      const data = await countryWorkGuideService.getStudentWorkHoursDataset(countryCode as string);
      return res.json({ success: true, dataset: 'student-work-hours', count: data.length, data });
    } catch (error: any) {
      console.error('[CountryWorkGuideController] Error fetching student work hours dataset:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch student work hours dataset' });
    }
  }

  /**
   * Dedicated Dataset 3: GET /api/country-work-guide/datasets/post-study-work
   */
  async getDatasetsPostStudyWork(req: Request, res: Response) {
    try {
      const { countryCode } = req.query;
      const data = await countryWorkGuideService.getPostStudyWorkDataset(countryCode as string);
      return res.json({ success: true, dataset: 'post-study-work', count: data.length, data });
    } catch (error: any) {
      console.error('[CountryWorkGuideController] Error fetching post-study work dataset:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch post-study work dataset' });
    }
  }

  /**
   * Admin: PUT /api/admin/country-work-guide/minimum-wages/:countryCode
   */
  async adminUpdateMinimumWage(req: Request, res: Response) {
    try {
      const { countryCode } = req.params;
      const updated = await countryWorkGuideService.adminUpdateMinimumWage(countryCode, req.body);
      return res.json({ success: true, updated });
    } catch (error: any) {
      console.error('[CountryWorkGuideController] Error updating minimum wage:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to update minimum wage' });
    }
  }

  /**
   * Admin: PUT /api/admin/country-work-guide/student-work-hours/:countryCode
   */
  async adminUpdateStudentWorkPolicy(req: Request, res: Response) {
    try {
      const { countryCode } = req.params;
      const updated = await countryWorkGuideService.adminUpdateStudentWorkPolicy(countryCode, req.body);
      return res.json({ success: true, updated });
    } catch (error: any) {
      console.error('[CountryWorkGuideController] Error updating student work policy:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to update student work policy' });
    }
  }

  /**
   * Admin: PUT /api/admin/country-work-guide/post-study-work/:routeId
   */
  async adminUpdatePostStudyWorkRoute(req: Request, res: Response) {
    try {
      const { routeId } = req.params;
      const updated = await countryWorkGuideService.adminUpdatePostStudyWorkRoute(routeId, req.body);
      return res.json({ success: true, updated });
    } catch (error: any) {
      console.error('[CountryWorkGuideController] Error updating post-study work route:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to update post-study work route' });
    }
  }
}

export const countryWorkGuideController = new CountryWorkGuideController();
