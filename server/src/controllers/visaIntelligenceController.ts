import { Request, Response } from 'express';
import { VisaIntelligenceService } from '../services/visaIntelligenceService';

export class VisaIntelligenceController {
  /**
   * GET /api/visa/statistics
   */
  static async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const data = await VisaIntelligenceService.getVisaStatistics(req.query as any);
      res.json(data);
    } catch (error: any) {
      console.error('Error fetching visa statistics:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch visa statistics' });
    }
  }

  /**
   * GET /api/visa/country/:countryCode
   */
  static async getCountryIntelligence(req: Request, res: Response): Promise<void> {
    try {
      const data = await VisaIntelligenceService.getCountryVisaIntelligence(req.params.countryCode);
      if (!data) {
        res.status(404).json({ error: 'Country visa intelligence record not found' });
        return;
      }
      res.json(data);
    } catch (error: any) {
      console.error('Error fetching country visa intelligence:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch country visa intelligence' });
    }
  }

  /**
   * GET /api/visa/centres
   */
  static async getCentres(req: Request, res: Response): Promise<void> {
    try {
      const data = await VisaIntelligenceService.getVisaCentres(req.query as any);
      res.json(data);
    } catch (error: any) {
      console.error('Error fetching visa application centres:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch visa application centres' });
    }
  }

  /**
   * POST /api/visa/find-centre
   */
  static async findCentre(req: Request, res: Response): Promise<void> {
    try {
      const { destinationCountryCode } = req.body;
      if (!destinationCountryCode) {
        res.status(400).json({ error: 'destinationCountryCode is required' });
        return;
      }
      const data = await VisaIntelligenceService.findCentreForApplicant(req.body);
      res.json(data);
    } catch (error: any) {
      console.error('Error matching visa application centre:', error);
      res.status(500).json({ error: error.message || 'Failed to match application centre' });
    }
  }

  /**
   * GET /api/visa/updates
   */
  static async getUpdates(req: Request, res: Response): Promise<void> {
    try {
      const data = await VisaIntelligenceService.getSocialUpdates(req.query as any);
      res.json({ total: data.length, updates: data });
    } catch (error: any) {
      console.error('Error fetching visa updates:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch visa updates' });
    }
  }

  /**
   * GET /api/visa/search
   */
  static async search(req: Request, res: Response): Promise<void> {
    try {
      const query = (req.query.q as string) || '';
      if (!query.trim()) {
        res.status(400).json({ error: 'Search query parameter q is required' });
        return;
      }
      const data = await VisaIntelligenceService.searchVisaIntelligence(query, req.query.category as string);
      res.json(data);
    } catch (error: any) {
      console.error('Error executing visa search:', error);
      res.status(500).json({ error: error.message || 'Failed to execute search' });
    }
  }

  /**
   * POST /api/visa/corrections
   */
  static async submitCorrection(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { countryName, issueCategory, description, targetType, statisticsId, centreId, evidenceUrl } = req.body;

      if (!countryName || !issueCategory || !description || !targetType) {
        res.status(400).json({ error: 'countryName, targetType, issueCategory, and description are required' });
        return;
      }

      const correction = await VisaIntelligenceService.submitCorrection({
        userId: user?.id,
        reporterEmail: user?.email || req.body.reporterEmail,
        reporterName: user?.name || req.body.reporterName,
        targetType,
        statisticsId,
        centreId,
        countryName,
        issueCategory,
        description,
        evidenceUrl,
      });

      res.status(201).json({
        message: 'Visa intelligence correction report submitted successfully and queued for review.',
        correction,
      });
    } catch (error: any) {
      console.error('Error submitting visa correction:', error);
      res.status(500).json({ error: error.message || 'Failed to submit correction' });
    }
  }

  /**
   * GET /api/admin/visa/corrections (Admin only)
   */
  static async adminGetCorrections(req: Request, res: Response): Promise<void> {
    try {
      const data = await VisaIntelligenceService.getPendingCorrections();
      res.json(data);
    } catch (error: any) {
      console.error('Error fetching visa corrections queue:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch corrections queue' });
    }
  }

  /**
   * POST /api/admin/visa/corrections/:id/review (Admin only)
   */
  static async adminReviewCorrection(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { action, adminNotes } = req.body;
      if (!['APPROVED', 'REJECTED'].includes(action)) {
        res.status(400).json({ error: 'Action must be APPROVED or REJECTED' });
        return;
      }
      const result = await VisaIntelligenceService.reviewCorrection(req.params.id, action, adminNotes, user?.id || 'SUPER_ADMIN');
      res.json({ message: `Correction ${action.toLowerCase()} successfully`, result });
    } catch (error: any) {
      console.error('Error reviewing visa correction:', error);
      res.status(500).json({ error: error.message || 'Failed to review correction' });
    }
  }

  /**
   * PUT /api/admin/visa/statistics/:id (Admin only)
   */
  static async adminUpdateStatistics(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const updated = await VisaIntelligenceService.updateStatistics(req.params.id, req.body, user?.id || 'SUPER_ADMIN');
      res.json({ message: 'Visa statistics updated successfully', statistics: updated });
    } catch (error: any) {
      console.error('Error updating visa statistics:', error);
      res.status(500).json({ error: error.message || 'Failed to update visa statistics' });
    }
  }

  /**
   * POST /api/admin/visa/seed (Admin only)
   */
  static async triggerSeed(req: Request, res: Response): Promise<void> {
    try {
      const result = await VisaIntelligenceService.seedAllVisaData();
      res.json({ message: 'Visa Intelligence data seeded successfully', result });
    } catch (error: any) {
      console.error('Error seeding visa data:', error);
      res.status(500).json({ error: error.message || 'Failed to seed visa data' });
    }
  }
}
