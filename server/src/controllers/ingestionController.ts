import { Request, Response } from 'express';
import { prisma } from '../services/db.js';
import { IngestionService } from '../services/ingestionService.js';

/**
 * GET /api/admin/institutions/coverage
 * Super Admin Country Coverage Dashboard metrics
 */
export const getCoverageDashboard = async (req: Request, res: Response) => {
  try {
    const data = await IngestionService.getCoverageDashboard();
    return res.json(data);
  } catch (error: any) {
    console.error('Error fetching coverage dashboard:', error);
    return res.status(500).json({ error: 'Failed to fetch country coverage metrics.' });
  }
};

/**
 * GET /api/admin/institutions/registry
 * Server-side paginated, indexed search & filter of verified institutions
 */
export const getPaginatedRegistry = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const { search, country, institutionType, accreditationStatus, sortBy = 'name', sortOrder = 'asc' } = req.query;

    const where: any = {
      verificationStatus: 'VERIFIED',
    };

    if (search && typeof search === 'string') {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { cityName: { contains: q } },
        { slug: { contains: q.toLowerCase() } },
        { accreditationBody: { contains: q } },
      ];
    }

    if (country && typeof country === 'string' && country !== 'all') {
      where.country = { slug: country };
    }

    if (institutionType && typeof institutionType === 'string' && institutionType !== 'all') {
      where.institutionType = institutionType;
    }

    if (accreditationStatus && typeof accreditationStatus === 'string' && accreditationStatus !== 'all') {
      where.accreditationStatus = accreditationStatus;
    }

    const orderBy: any = {};
    if (sortBy === 'qsRanking') {
      orderBy.qsRanking = sortOrder === 'desc' ? 'desc' : 'asc';
    } else if (sortBy === 'lastVerifiedAt') {
      orderBy.lastVerifiedAt = sortOrder === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy.name = sortOrder === 'desc' ? 'desc' : 'asc';
    }

    const [total, institutions] = await Promise.all([
      prisma.university.count({ where }),
      prisma.university.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          country: {
            select: { name: true, slug: true, code: true, flagEmoji: true },
          },
          officialSources: {
            take: 2,
            select: { title: true, url: true, domain: true, sourceType: true },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.json({
      institutions,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error: any) {
    console.error('Error fetching registry list:', error);
    return res.status(500).json({ error: 'Failed to retrieve institution registry.' });
  }
};

/**
 * GET /api/admin/institutions/candidates
 * Paginated list of candidate institutions in review queue
 */
export const getCandidatesQueue = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const { status, country } = req.query;

    const where: any = {};
    if (status && typeof status === 'string' && status !== 'ALL') {
      where.candidateStatus = status;
    }
    if (country && typeof country === 'string' && country !== 'all') {
      where.countrySlug = country;
    }

    const [total, candidates] = await Promise.all([
      prisma.institutionCandidate.count({ where }),
      prisma.institutionCandidate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return res.json({
      candidates,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Error fetching candidates queue:', error);
    return res.status(500).json({ error: 'Failed to retrieve candidate review queue.' });
  }
};

/**
 * POST /api/admin/institutions/candidates/:id/review
 * Approve, reject, or mark duplicate candidate
 */
export const reviewCandidate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { action, reviewNotes } = req.body;
  const adminUser = (req as any).user;

  if (!action || !['APPROVE', 'REJECT', 'RESOLVE_DUPLICATE'].includes(action)) {
    return res.status(400).json({ error: 'Valid action required: APPROVE, REJECT, or RESOLVE_DUPLICATE.' });
  }

  try {
    const result = await IngestionService.reviewCandidate(
      id,
      action,
      adminUser.id,
      reviewNotes
    );
    return res.json(result);
  } catch (error: any) {
    console.error('Candidate review error:', error);
    return res.status(500).json({ error: error.message || 'Failed to process candidate review.' });
  }
};

/**
 * POST /api/admin/institutions/ingest
 * Trigger automated ingestion pipeline
 */
export const triggerIngestion = async (req: Request, res: Response) => {
  const { countrySlug } = req.body;

  try {
    const summary = await IngestionService.runIngestion({
      countrySlug,
    });
    return res.json({
      message: 'Ingestion pipeline completed successfully.',
      summary,
    });
  } catch (error: any) {
    console.error('Ingestion trigger error:', error);
    return res.status(500).json({ error: 'Failed to execute ingestion batch.' });
  }
};

/**
 * GET /api/admin/institutions/batches
 * Batch execution history and summaries
 */
export const getIngestionBatches = async (req: Request, res: Response) => {
  try {
    const batches = await prisma.ingestionBatch.findMany({
      take: 20,
      orderBy: { startedAt: 'desc' },
    });
    return res.json(batches);
  } catch (error: any) {
    console.error('Error fetching ingestion batches:', error);
    return res.status(500).json({ error: 'Failed to retrieve ingestion batches.' });
  }
};
