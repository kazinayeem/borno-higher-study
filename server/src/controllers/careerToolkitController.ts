// Borno Higher Study — Career Toolkit Controller
// Exposes API endpoints for research records, CV examples, guides, builder drafts, and rule-based CV reviews.

import { Request, Response } from 'express';
import { careerToolkitService } from '../services/careerToolkitService';

export class CareerToolkitController {
  /**
   * GET /api/career-toolkit/research-records
   */
  async getResearchRecords(req: Request, res: Response) {
    try {
      const { cvType, field, search, status } = req.query;
      const data = await careerToolkitService.getResearchRecords({
        cvType: cvType as string,
        field: field as string,
        search: search as string,
        status: status as string
      });
      return res.json({ success: true, ...data });
    } catch (error: any) {
      console.error('[CareerToolkitController] Error fetching research records:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch research records' });
    }
  }

  /**
   * GET /api/career-toolkit/cv-examples
   */
  async getCVExamples(req: Request, res: Response) {
    try {
      const { field, careerStage } = req.query;
      const examples = await careerToolkitService.getCVExamples({
        field: field as string,
        careerStage: careerStage as string
      });
      return res.json({ success: true, count: examples.length, examples });
    } catch (error: any) {
      console.error('[CareerToolkitController] Error fetching CV examples:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch CV examples' });
    }
  }

  /**
   * GET /api/career-toolkit/cv-examples/:slug
   */
  async getCVExampleBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const example = await careerToolkitService.getCVExampleBySlug(slug);
      if (!example) {
        return res.status(404).json({ success: false, message: 'CV example not found' });
      }
      return res.json({ success: true, example });
    } catch (error: any) {
      console.error('[CareerToolkitController] Error fetching CV example:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch CV example' });
    }
  }

  /**
   * GET /api/career-toolkit/guides
   */
  async getGuides(req: Request, res: Response) {
    try {
      const { category } = req.query;
      const guides = await careerToolkitService.getCareerGuides(category as string);
      return res.json({ success: true, count: guides.length, guides });
    } catch (error: any) {
      console.error('[CareerToolkitController] Error fetching guides:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch career guides' });
    }
  }

  /**
   * GET /api/career-toolkit/guides/:slug
   */
  async getGuideBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const guide = await careerToolkitService.getCareerGuideBySlug(slug);
      if (!guide) {
        return res.status(404).json({ success: false, message: 'Guide not found' });
      }
      return res.json({ success: true, guide });
    } catch (error: any) {
      console.error('[CareerToolkitController] Error fetching guide:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch guide' });
    }
  }

  /**
   * GET /api/career-toolkit/before-after
   */
  getBeforeAfterExamples(req: Request, res: Response) {
    const examples = careerToolkitService.getBeforeAfterExamples();
    return res.json({ success: true, count: examples.length, examples });
  }

  /**
   * GET /api/career-toolkit/checklist
   */
  getChecklist(req: Request, res: Response) {
    const items = careerToolkitService.getChecklistItems();
    return res.json({ success: true, count: items.length, items });
  }

  /**
   * GET /api/career-toolkit/checklist/progress
   */
  async getChecklistProgress(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const sessionKey = (req.query.sessionKey as string) || req.headers['x-session-key'] as string;
      const progress = await careerToolkitService.getUserChecklistProgress(userId, sessionKey);
      return res.json({ success: true, ...progress });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: 'Failed to fetch progress' });
    }
  }

  /**
   * POST /api/career-toolkit/checklist/progress
   */
  async saveChecklistProgress(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { completedItems, sessionKey } = req.body;
      const result = await careerToolkitService.saveUserChecklistProgress(
        completedItems || [],
        userId,
        sessionKey
      );
      return res.json({ success: true, progress: result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message || 'Failed to save progress' });
    }
  }

  /**
   * POST /api/career-toolkit/review
   * Rule-based CV quality analyzer
   */
  runQualityReview(req: Request, res: Response) {
    try {
      const { cvData, targetOpportunity } = req.body;
      if (!cvData) {
        return res.status(400).json({ success: false, message: 'cvData object is required' });
      }
      const report = careerToolkitService.runQualityReview(cvData, targetOpportunity);
      return res.json({ success: true, report });
    } catch (error: any) {
      console.error('[CareerToolkitController] Error running quality review:', error);
      return res.status(500).json({ success: false, message: 'Failed to run quality review' });
    }
  }

  /**
   * GET /api/career-toolkit/drafts
   */
  async getUserDrafts(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      const drafts = await careerToolkitService.getUserDrafts(userId);
      return res.json({ success: true, drafts });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: 'Failed to fetch drafts' });
    }
  }

  /**
   * GET /api/career-toolkit/drafts/:id
   */
  async getDraftById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      const draft = await careerToolkitService.getDraftById(id, userId);
      if (!draft) {
        return res.status(404).json({ success: false, message: 'Draft not found' });
      }
      return res.json({ success: true, draft });
    } catch (error: any) {
      return res.status(403).json({ success: false, message: error.message });
    }
  }

  /**
   * POST /api/career-toolkit/drafts
   */
  async saveDraft(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const draft = await careerToolkitService.saveDraft(req.body, userId);
      return res.json({ success: true, draft });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message || 'Failed to save draft' });
    }
  }

  /**
   * DELETE /api/career-toolkit/drafts/:id
   */
  async deleteDraft(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });
      await careerToolkitService.deleteDraft(id, userId);
      return res.json({ success: true, message: 'Draft deleted' });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message || 'Failed to delete draft' });
    }
  }

  /**
   * POST /api/career-toolkit/admin/research-records (Super Admin)
   */
  async adminCreateResearchRecord(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const record = await careerToolkitService.adminCreateResearchRecord(req.body, user?.name || 'Super Admin');
      return res.json({ success: true, record });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message || 'Failed to create record' });
    }
  }

  /**
   * PUT /api/career-toolkit/admin/research-records/:id (Super Admin)
   */
  async adminUpdateResearchRecord(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const record = await careerToolkitService.adminUpdateResearchRecord(id, req.body);
      return res.json({ success: true, record });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message || 'Failed to update record' });
    }
  }

  /**
   * DELETE /api/career-toolkit/admin/research-records/:id (Super Admin)
   */
  async adminDeleteResearchRecord(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await careerToolkitService.adminDeleteResearchRecord(id);
      return res.json({ success: true, message: 'Record deleted successfully' });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message || 'Failed to delete record' });
    }
  }

  /**
   * POST /api/career-toolkit/seed
   */
  async triggerSeed(req: Request, res: Response) {
    try {
      await careerToolkitService.seedCareerToolkitData();
      return res.json({ success: true, message: 'Career Toolkit dataset seeded successfully' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const careerToolkitController = new CareerToolkitController();
