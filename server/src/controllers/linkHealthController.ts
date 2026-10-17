import { Request, Response } from 'express';
import { linkHealthService } from '../services/linkHealthService.js';

export const linkHealthController = {
  /**
   * GET /api/admin/link-health/stats
   */
  async getStats(req: Request, res: Response) {
    try {
      const stats = await linkHealthService.getStats();
      return res.json({ success: true, stats });
    } catch (error: any) {
      console.error('Error fetching link health stats:', error);
      return res.status(500).json({ error: 'Failed to fetch link health statistics', details: error.message });
    }
  },

  /**
   * GET /api/admin/link-health/records
   */
  async getRecords(req: Request, res: Response) {
    try {
      const { category, status, repairStatus, destinationType, search, page, limit } = req.query;
      const data = await linkHealthService.getRecords({
        category: category as string,
        status: status as string,
        repairStatus: repairStatus as string,
        destinationType: destinationType as string,
        search: search as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 25
      });
      return res.json({ success: true, ...data });
    } catch (error: any) {
      console.error('Error fetching link records:', error);
      return res.status(500).json({ error: 'Failed to fetch link records', details: error.message });
    }
  },

  /**
   * POST /api/admin/link-health/scan
   */
  async runScan(req: Request, res: Response) {
    try {
      const trigger = req.body?.trigger || 'MANUAL_SUPER_ADMIN';
      const result = await linkHealthService.runFullScan(trigger);
      return res.json({ success: true, message: 'Link health audit completed successfully', summary: result });
    } catch (error: any) {
      console.error('Error running link health scan:', error);
      return res.status(500).json({ error: 'Failed to run link health scan', details: error.message });
    }
  },

  /**
   * POST /api/admin/link-health/repair
   */
  async applyRepair(req: Request, res: Response) {
    try {
      const { linkId, replacementUrl } = req.body;
      if (!linkId) {
        return res.status(400).json({ error: 'linkId is required' });
      }
      const adminEmail = (req as any).user?.email || 'Super Admin';
      const updated = await linkHealthService.applyRepair(linkId, replacementUrl, adminEmail);
      return res.json({ success: true, message: 'Link repaired successfully in database', record: updated });
    } catch (error: any) {
      console.error('Error applying link repair:', error);
      return res.status(500).json({ error: 'Failed to apply link repair', details: error.message });
    }
  },

  /**
   * POST /api/admin/link-health/auto-repair
   */
  async autoRepairBatch(req: Request, res: Response) {
    try {
      const result = await linkHealthService.runAutoRepairBatch();
      return res.json({ success: true, message: `Auto-repair batch executed: ${result.repairedCount} records updated`, ...result });
    } catch (error: any) {
      console.error('Error running auto-repair batch:', error);
      return res.status(500).json({ error: 'Failed to execute auto-repair batch', details: error.message });
    }
  },

  /**
   * POST /api/admin/link-health/reject
   */
  async rejectRepair(req: Request, res: Response) {
    try {
      const { linkId, notes } = req.body;
      if (!linkId) return res.status(400).json({ error: 'linkId is required' });
      const updated = await linkHealthService.rejectRepair(linkId, notes);
      return res.json({ success: true, message: 'Repair proposal rejected', record: updated });
    } catch (error: any) {
      console.error('Error rejecting repair proposal:', error);
      return res.status(500).json({ error: 'Failed to reject repair proposal', details: error.message });
    }
  },

  /**
   * POST /api/admin/link-health/retry
   */
  async retryLink(req: Request, res: Response) {
    try {
      const { linkId } = req.body;
      if (!linkId) return res.status(400).json({ error: 'linkId is required' });
      const updated = await linkHealthService.retryLink(linkId);
      return res.json({ success: true, message: 'Link re-verified successfully', record: updated });
    } catch (error: any) {
      console.error('Error re-verifying link:', error);
      return res.status(500).json({ error: 'Failed to re-verify link', details: error.message });
    }
  },

  /**
   * POST /api/admin/link-health/candidate
   */
  async updateCandidate(req: Request, res: Response) {
    try {
      const { linkId, candidateUrl } = req.body;
      if (!linkId || !candidateUrl) return res.status(400).json({ error: 'linkId and candidateUrl are required' });
      const updated = await linkHealthService.updateCandidate(linkId, candidateUrl);
      return res.json({ success: true, message: 'Candidate URL saved for review', record: updated });
    } catch (error: any) {
      console.error('Error updating candidate URL:', error);
      return res.status(500).json({ error: 'Failed to update candidate URL', details: error.message });
    }
  },

  /**
   * GET /api/admin/link-health/export-csv
   */
  async exportCsv(req: Request, res: Response) {
    try {
      const csv = await linkHealthService.exportCsv();
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename=borno-link-health-audit-${new Date().toISOString().slice(0, 10)}.csv`);
      return res.send(csv);
    } catch (error: any) {
      console.error('Error exporting link audit CSV:', error);
      return res.status(500).json({ error: 'Failed to export CSV report', details: error.message });
    }
  },

  /**
   * GET /api/admin/link-health/history
   */
  async getHistory(req: Request, res: Response) {
    try {
      const history = await linkHealthService.getScanHistory();
      return res.json({ success: true, history });
    } catch (error: any) {
      console.error('Error fetching scan history:', error);
      return res.status(500).json({ error: 'Failed to fetch scan history', details: error.message });
    }
  }
};
