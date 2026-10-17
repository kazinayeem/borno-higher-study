import { Request, Response } from 'express';
import { AcademicEligibilityService } from '../services/academicEligibilityService.js';

export class AcademicEligibilityController {
  /**
   * GET /api/academic/requirements
   */
  static async getRequirements(req: Request, res: Response): Promise<void> {
    try {
      const data = await AcademicEligibilityService.getAcademicRequirements(req.query as any);
      res.json({
        total: data.pagination.total,
        page: data.pagination.page,
        limit: data.pagination.limit,
        totalPages: data.pagination.totalPages,
        requirements: data.requirements,
      });
    } catch (error: any) {
      console.error('Error fetching academic requirements:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch academic requirements' });
    }
  }

  /**
   * GET /api/academic/requirements/:id
   */
  static async getRequirementById(req: Request, res: Response): Promise<void> {
    try {
      const data = await AcademicEligibilityService.getRequirementById(req.params.id);
      if (!data) {
        res.status(404).json({ error: 'Academic requirement not found' });
        return;
      }
      res.json(data);
    } catch (error: any) {
      console.error('Error fetching academic requirement detail:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch requirement detail' });
    }
  }

  /**
   * POST /api/academic/evaluate
   */
  static async evaluate(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const evaluation = await AcademicEligibilityService.evaluateStudentEligibility({
        ...req.body,
        userId: user?.id,
      });
      res.json(evaluation);
    } catch (error: any) {
      console.error('Error evaluating academic eligibility:', error);
      res.status(500).json({ error: error.message || 'Failed to evaluate eligibility' });
    }
  }

  /**
   * GET /api/academic/grade-scales
   */
  static async getGradeScales(req: Request, res: Response): Promise<void> {
    try {
      const data = await AcademicEligibilityService.getGradeScales();
      res.json({ gradeScales: data });
    } catch (error: any) {
      console.error('Error fetching grade scales:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch grade scales' });
    }
  }

  /**
   * GET /api/academic/equivalencies
   */
  static async getEquivalencies(req: Request, res: Response): Promise<void> {
    try {
      const data = await AcademicEligibilityService.getQualificationEquivalencies(req.query.countryCode as string);
      res.json({ equivalencies: data });
    } catch (error: any) {
      console.error('Error fetching qualification equivalencies:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch equivalencies' });
    }
  }

  /**
   * POST /api/academic/corrections
   */
  static async submitCorrection(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { universityName, programName, issueCategory, description, evidenceUrl, academicRequirementId } = req.body;

      if (!universityName || !programName || !issueCategory || !description) {
        res.status(400).json({ error: 'universityName, programName, issueCategory, and description are required' });
        return;
      }

      const correction = await AcademicEligibilityService.submitAcademicCorrection({
        academicRequirementId,
        universityName,
        programName,
        issueCategory,
        description,
        evidenceUrl: evidenceUrl || req.body.officialEvidenceUrl,
        reporterName: user?.name || req.body.reporterName,
        reporterEmail: user?.email || req.body.reporterEmail,
      });

      res.status(201).json({
        message: 'Academic requirement correction report submitted successfully and queued for review.',
        correction,
        report: correction,
      });
    } catch (error: any) {
      console.error('Error submitting academic correction:', error);
      res.status(500).json({ error: error.message || 'Failed to submit correction report' });
    }
  }

  /**
   * GET /api/admin/academic/corrections (Admin only)
   */
  static async adminGetCorrections(req: Request, res: Response): Promise<void> {
    try {
      const data = await AcademicEligibilityService.getPendingCorrections();
      res.json(data);
    } catch (error: any) {
      console.error('Error fetching pending academic corrections:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch corrections queue' });
    }
  }

  /**
   * POST /api/admin/academic/corrections/:id/review (Admin only)
   */
  static async adminReviewCorrection(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { action, adminNotes } = req.body;
      if (!['APPROVED', 'REJECTED'].includes(action)) {
        res.status(400).json({ error: 'Action must be APPROVED or REJECTED' });
        return;
      }

      const result = await AcademicEligibilityService.reviewCorrection(
        req.params.id,
        action,
        adminNotes || 'Reviewed by Super Admin',
        user?.id || 'SUPER_ADMIN'
      );
      res.json({ message: `Correction report ${action.toLowerCase()} successfully`, result, report: result });
    } catch (error: any) {
      console.error('Error reviewing academic correction:', error);
      res.status(500).json({ error: error.message || 'Failed to review correction' });
    }
  }

  /**
   * PUT /api/admin/academic/requirements/:id (Admin only)
   */
  static async adminUpdateRequirement(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const updated = await AcademicEligibilityService.updateRequirement(
        req.params.id,
        req.body,
        user?.id || 'SUPER_ADMIN'
      );
      res.json({ message: 'Academic requirement updated successfully', requirement: updated });
    } catch (error: any) {
      console.error('Error updating academic requirement:', error);
      res.status(500).json({ error: error.message || 'Failed to update academic requirement' });
    }
  }

  /**
   * POST /api/admin/academic/seed (Admin only)
   */
  static async triggerSeed(req: Request, res: Response): Promise<void> {
    try {
      const result = await AcademicEligibilityService.seedAllAcademicData();
      res.json({ message: 'Academic requirements seeded successfully', result });
    } catch (error: any) {
      console.error('Error seeding academic requirements data:', error);
      res.status(500).json({ error: error.message || 'Failed to seed academic data' });
    }
  }
}
