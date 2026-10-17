import { Request, Response } from 'express';
import {
  universityRequirementsReportService,
  CompileReportRequest,
} from '../services/universityRequirementsReportService.js';

export const getRequirementsFilterOptions = async (req: Request, res: Response) => {
  try {
    const filters = await universityRequirementsReportService.getFilterOptions();
    return res.json(filters);
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return res.status(500).json({ error: 'Failed to fetch filter options' });
  }
};

export const searchRequirementsPrograms = async (req: Request, res: Response) => {
  try {
    const { country, degreeLevel, subjectField, search, limit, offset } = req.query;

    const results = await universityRequirementsReportService.searchPrograms({
      country: typeof country === 'string' ? country : undefined,
      degreeLevel: typeof degreeLevel === 'string' ? degreeLevel : undefined,
      subjectField: typeof subjectField === 'string' ? subjectField : undefined,
      search: typeof search === 'string' ? search : undefined,
      limit: limit ? parseInt(limit as string, 10) : 50,
      offset: offset ? parseInt(offset as string, 10) : 0,
    });

    return res.json(results);
  } catch (error) {
    console.error('Error searching programs:', error);
    return res.status(500).json({ error: 'Failed to search programs' });
  }
};

export const compileRequirementsReport = async (req: Request, res: Response) => {
  try {
    const payload: CompileReportRequest = req.body;

    if (!payload.programIds || !Array.isArray(payload.programIds) || payload.programIds.length === 0) {
      return res.status(400).json({ error: 'Please select at least one program to evaluate.' });
    }

    const report = await universityRequirementsReportService.compileReport(payload);

    return res.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error('Error compiling requirements report:', error);
    return res.status(500).json({ error: 'Failed to compile requirements report' });
  }
};

export const saveRequirementsReport = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required to save reports' });
    }

    const { payload, report } = req.body;
    if (!payload || !report) {
      return res.status(400).json({ error: 'Payload and compiled report are required' });
    }

    const result = await universityRequirementsReportService.saveReport(userId, payload, report);
    return res.json(result);
  } catch (error) {
    console.error('Error saving requirements report:', error);
    return res.status(500).json({ error: 'Failed to save requirements report' });
  }
};

export const getUserSavedRequirementsReports = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const reports = await universityRequirementsReportService.getUserSavedReports(userId);
    return res.json({ reports });
  } catch (error) {
    console.error('Error fetching user saved reports:', error);
    return res.status(500).json({ error: 'Failed to fetch saved reports' });
  }
};

export const getSavedRequirementsReportById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;
    const report = await universityRequirementsReportService.getSavedReportById(userId, id);

    if (!report) {
      return res.status(404).json({ error: 'Saved report not found' });
    }

    return res.json({ report });
  } catch (error) {
    console.error('Error fetching saved report:', error);
    return res.status(500).json({ error: 'Failed to fetch saved report' });
  }
};

export const deleteUserSavedRequirementsReport = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;
    const result = await universityRequirementsReportService.deleteUserSavedReport(userId, id);

    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }

    return res.json(result);
  } catch (error) {
    console.error('Error deleting saved report:', error);
    return res.status(500).json({ error: 'Failed to delete saved report' });
  }
};

export const regenerateRequirementsReport = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;
    const result = await universityRequirementsReportService.regenerateReport(userId, id);

    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }

    return res.json(result);
  } catch (error) {
    console.error('Error regenerating saved report:', error);
    return res.status(500).json({ error: 'Failed to regenerate saved report' });
  }
};
