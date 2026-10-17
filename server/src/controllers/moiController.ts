import { Request, Response } from 'express';
import { MoiService } from '../services/moiService';

export class MoiController {
  /**
   * GET /api/moi/policies
   */
  static async getPolicies(req: Request, res: Response): Promise<void> {
    try {
      const result = await MoiService.getMoiPolicies(req.query as any);
      res.json(result);
    } catch (error: any) {
      console.error('Error fetching MOI policies:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch MOI policies' });
    }
  }

  /**
   * GET /api/moi/policies/:id
   */
  static async getPolicyById(req: Request, res: Response): Promise<void> {
    try {
      const policy = await MoiService.getMoiPolicyById(req.params.id);
      if (!policy) {
        res.status(404).json({ error: 'MOI policy not found' });
        return;
      }
      res.json(policy);
    } catch (error: any) {
      console.error('Error fetching MOI policy details:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch MOI policy details' });
    }
  }

  /**
   * POST /api/moi/check-eligibility
   */
  static async checkEligibility(req: Request, res: Response): Promise<void> {
    try {
      const { country, universityId, completedQualification, awardingInstitution, allTaughtInEnglish, graduationYear, canProvideMoiLetter } = req.body;
      if (!universityId) {
        res.status(400).json({ error: 'universityId is required' });
        return;
      }
      const evaluation = await MoiService.checkMoiEligibility(req.body);
      res.json(evaluation);
    } catch (error: any) {
      console.error('Error assessing MOI eligibility:', error);
      res.status(500).json({ error: error.message || 'Failed to assess MOI eligibility' });
    }
  }

  /**
   * POST /api/moi/corrections
   */
  static async submitCorrection(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { universityName, issueCategory, description, evidenceUrl, evidenceText, moiPolicyId } = req.body;

      if (!universityName || !issueCategory || !description) {
        res.status(400).json({ error: 'universityName, issueCategory, and description are required' });
        return;
      }

      const correction = await MoiService.submitCorrection({
        userId: user?.id,
        reporterEmail: user?.email || req.body.reporterEmail,
        reporterName: user?.name || req.body.reporterName,
        moiPolicyId,
        universityName,
        issueCategory,
        description,
        evidenceUrl,
        evidenceText,
      });

      res.status(201).json({
        message: 'MOI policy correction submitted successfully and queued for review.',
        correction,
      });
    } catch (error: any) {
      console.error('Error submitting MOI correction:', error);
      res.status(500).json({ error: error.message || 'Failed to submit correction' });
    }
  }

  /**
   * POST /api/moi/admin/policies (Admin only)
   */
  static async createPolicy(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const policy = await MoiService.createMoiPolicy(req.body, user?.id || 'SUPER_ADMIN');
      res.status(201).json({ message: 'MOI policy created successfully', policy });
    } catch (error: any) {
      console.error('Error creating MOI policy:', error);
      res.status(500).json({ error: error.message || 'Failed to create MOI policy' });
    }
  }

  /**
   * PUT /api/moi/admin/policies/:id (Admin only)
   */
  static async updatePolicy(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const policy = await MoiService.updateMoiPolicy(req.params.id, req.body, user?.id || 'SUPER_ADMIN');
      res.json({ message: 'MOI policy updated successfully', policy });
    } catch (error: any) {
      console.error('Error updating MOI policy:', error);
      res.status(500).json({ error: error.message || 'Failed to update MOI policy' });
    }
  }

  /**
   * GET /api/moi/admin/corrections (Admin only)
   */
  static async getPendingCorrections(req: Request, res: Response): Promise<void> {
    try {
      const corrections = await MoiService.getPendingCorrections();
      res.json(corrections);
    } catch (error: any) {
      console.error('Error fetching MOI corrections:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch MOI corrections' });
    }
  }

  /**
   * POST /api/moi/admin/corrections/:id/review (Admin only)
   */
  static async reviewCorrection(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { action, adminNotes } = req.body;
      if (!['APPROVED', 'REJECTED'].includes(action)) {
        res.status(400).json({ error: 'Action must be APPROVED or REJECTED' });
        return;
      }
      const result = await MoiService.reviewCorrection(req.params.id, action, adminNotes, user?.id || 'SUPER_ADMIN');
      res.json({ message: `Correction ${action.toLowerCase()} successfully`, result });
    } catch (error: any) {
      console.error('Error reviewing MOI correction:', error);
      res.status(500).json({ error: error.message || 'Failed to review MOI correction' });
    }
  }

  /**
   * GET /api/moi/admin/outdated (Admin only)
   */
  static async getOutdatedPolicies(req: Request, res: Response): Promise<void> {
    try {
      const outdated = await MoiService.getOutdatedPolicies();
      res.json(outdated);
    } catch (error: any) {
      console.error('Error fetching outdated MOI policies:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch outdated MOI policies' });
    }
  }
}
