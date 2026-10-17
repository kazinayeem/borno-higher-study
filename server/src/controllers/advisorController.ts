import { Request, Response } from 'express';
import { RagAdvisorService } from '../services/ragAdvisorService.js';

const advisorService = new RagAdvisorService();

export const consultAdvisor = async (req: Request, res: Response) => {
  const query = req.body.message || req.body.question;

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({ error: 'Please enter a question or query for the Borno Study Advisor.' });
  }

  try {
    const consultation = await advisorService.consult(query);
    return res.json(consultation);
  } catch (error: any) {
    console.error('Advisor error:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred during consultation. Falling back to deterministic directory search.',
    });
  }
};
