import { Request, Response } from 'express';
import { prisma } from '../services/db.js';

/**
 * Calculates current real-time application status based on official dates,
 * time zone, and rolling admissions flags.
 */
export function calculateDeadlineStatus(deadline: {
  isRolling?: boolean;
  openDate?: Date | null;
  closeDate?: Date | null;
  status?: string;
  isDisputed?: boolean;
}): string {
  if (deadline.isDisputed) {
    return 'UNCONFIRMED';
  }
  if (deadline.status === 'SUSPENDED') {
    return 'SUSPENDED';
  }
  if (deadline.status === 'EXTENDED') {
    // If extended, still verify if it is open or closing soon
    if (!deadline.closeDate) return 'EXTENDED';
  }
  if (deadline.isRolling) {
    return 'ROLLING';
  }
  if (!deadline.openDate && !deadline.closeDate) {
    return 'NOT_ANNOUNCED';
  }

  const now = new Date();

  if (deadline.openDate && now < new Date(deadline.openDate)) {
    return 'UPCOMING';
  }

  if (deadline.closeDate) {
    const close = new Date(deadline.closeDate);
    if (now > close) {
      return 'CLOSED';
    }
    const msRemaining = close.getTime() - now.getTime();
    const daysRemaining = msRemaining / (1000 * 60 * 60 * 24);
    if (daysRemaining <= 7) {
      return 'CLOSING_SOON';
    }
  }

  return 'OPEN';
}

export const getDeadlines = async (req: Request, res: Response) => {
  const {
    universityId,
    programId,
    scholarshipId,
    intakeSemester,
    applicationType,
    targetAudience,
  } = req.query;

  try {
    const where: any = {};
    if (universityId && typeof universityId === 'string') where.universityId = universityId;
    if (programId && typeof programId === 'string') where.programId = programId;
    if (scholarshipId && typeof scholarshipId === 'string') where.scholarshipId = scholarshipId;
    if (intakeSemester && typeof intakeSemester === 'string' && intakeSemester !== 'all') {
      where.intakeSemester = intakeSemester;
    }
    if (applicationType && typeof applicationType === 'string' && applicationType !== 'all') {
      where.applicationType = applicationType;
    }
    if (targetAudience && typeof targetAudience === 'string' && targetAudience !== 'all') {
      where.targetAudience = targetAudience;
    }

    const records = await prisma.applicationDeadline.findMany({
      where,
      orderBy: [{ closeDate: 'asc' }, { openDate: 'asc' }],
      include: {
        university: {
          select: { id: true, name: true, slug: true, country: { select: { name: true } }, cityName: true },
        },
        program: {
          select: { id: true, name: true, slug: true, degreeLevel: true },
        },
        scholarship: {
          select: { id: true, name: true },
        },
        revisions: {
          orderBy: { timestamp: 'desc' },
          take: 3,
        },
      },
    });

    const evaluated = records.map((d: any) => ({
      ...d,
      university: d.university
        ? {
            id: d.university.id,
            name: d.university.name,
            slug: d.university.slug,
            countryName: d.university.country?.name,
            cityName: d.university.cityName,
          }
        : undefined,
      computedStatus: calculateDeadlineStatus(d),
    }));

    return res.json({
      total: evaluated.length,
      deadlines: evaluated,
    });
  } catch (error) {
    console.error('Error fetching application deadlines:', error);
    return res.status(500).json({ error: 'Failed to retrieve application deadlines.' });
  }
};

export const getDeadlineById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deadline = await prisma.applicationDeadline.findUnique({
      where: { id },
      include: {
        university: true,
        program: true,
        scholarship: true,
        revisions: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!deadline) {
      return res.status(404).json({ error: 'Application deadline record not found.' });
    }

    return res.json({
      ...deadline,
      computedStatus: calculateDeadlineStatus(deadline),
    });
  } catch (error) {
    console.error('Error fetching deadline details:', error);
    return res.status(500).json({ error: 'Failed to retrieve deadline details.' });
  }
};

export const createDeadline = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const {
    universityId,
    programId,
    scholarshipId,
    intakeSemester,
    academicYear = '2026-2027',
    applicationType = 'POSTGRADUATE',
    targetAudience = 'INTERNATIONAL',
    roundName,
    openDate,
    closeDate,
    openTime = '09:00',
    closeTime = '23:59',
    timeZone = 'UTC',
    isRolling = false,
    status = 'OPEN',
    applicationFee,
    currencyCode = 'EUR',
    officialAppUrl,
    officialSourceUrl,
  } = req.body;

  if (!intakeSemester || !officialSourceUrl) {
    return res.status(400).json({ error: 'Intake semester and official source URL are required.' });
  }

  try {
    const deadline = await prisma.applicationDeadline.create({
      data: {
        universityId: universityId || null,
        programId: programId || null,
        scholarshipId: scholarshipId || null,
        intakeSemester,
        academicYear,
        applicationType,
        targetAudience,
        roundName,
        openDate: openDate ? new Date(openDate) : null,
        closeDate: closeDate ? new Date(closeDate) : null,
        openTime,
        closeTime,
        timeZone,
        isRolling: Boolean(isRolling),
        status,
        applicationFee: applicationFee ? parseFloat(applicationFee) : null,
        currencyCode,
        officialAppUrl,
        officialSourceUrl,
        lastVerifiedAt: new Date(),
      },
    });

    // Create initial revision log
    await prisma.deadlineRevision.create({
      data: {
        deadlineId: deadline.id,
        changedBy: user?.name || 'Administrator',
        newOpenDate: deadline.openDate,
        newCloseDate: deadline.closeDate,
        newStatus: deadline.status,
        reason: 'Initial verified deadline publication.',
        sourceEvidenceUrl: officialSourceUrl,
      },
    });

    return res.status(201).json({
      message: 'Application deadline intake published successfully.',
      deadline,
    });
  } catch (error) {
    console.error('Error creating application deadline:', error);
    return res.status(500).json({ error: 'Failed to create application deadline.' });
  }
};

export const updateDeadline = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const {
    openDate,
    closeDate,
    openTime,
    closeTime,
    timeZone,
    isRolling,
    status,
    isDisputed,
    disputeNote,
    applicationFee,
    officialAppUrl,
    officialSourceUrl,
    reason = 'Official update from institution portal.',
  } = req.body;

  try {
    const existing = await prisma.applicationDeadline.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Deadline record not found.' });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const rec = await tx.applicationDeadline.update({
        where: { id },
        data: {
          openDate: openDate !== undefined ? (openDate ? new Date(openDate) : null) : existing.openDate,
          closeDate: closeDate !== undefined ? (closeDate ? new Date(closeDate) : null) : existing.closeDate,
          openTime: openTime ?? existing.openTime,
          closeTime: closeTime ?? existing.closeTime,
          timeZone: timeZone ?? existing.timeZone,
          isRolling: isRolling !== undefined ? Boolean(isRolling) : existing.isRolling,
          status: status ?? existing.status,
          isDisputed: isDisputed !== undefined ? Boolean(isDisputed) : existing.isDisputed,
          disputeNote: disputeNote !== undefined ? disputeNote : existing.disputeNote,
          applicationFee: applicationFee !== undefined ? parseFloat(applicationFee) : existing.applicationFee,
          officialAppUrl: officialAppUrl ?? existing.officialAppUrl,
          officialSourceUrl: officialSourceUrl ?? existing.officialSourceUrl,
          lastVerifiedAt: new Date(),
        },
      });

      // Immutable revision history entry
      await tx.deadlineRevision.create({
        data: {
          deadlineId: id,
          changedBy: user?.name || 'Administrator',
          previousOpenDate: existing.openDate,
          newOpenDate: rec.openDate,
          previousCloseDate: existing.closeDate,
          newCloseDate: rec.closeDate,
          previousStatus: existing.status,
          newStatus: rec.status,
          reason,
          sourceEvidenceUrl: officialSourceUrl || existing.officialSourceUrl,
        },
      });

      return rec;
    });

    return res.json({
      message: 'Deadline updated successfully with immutable revision history.',
      deadline: updated,
    });
  } catch (error) {
    console.error('Error updating deadline:', error);
    return res.status(500).json({ error: 'Failed to update application deadline.' });
  }
};

export const toggleDeadlineBookmark = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { deadlineId } = req.body;

  if (!user) return res.status(401).json({ error: 'Authentication required.' });
  if (!deadlineId) return res.status(400).json({ error: 'Deadline ID is required.' });

  try {
    const existing = await prisma.userDeadlineBookmark.findUnique({
      where: {
        userId_deadlineId: {
          userId: user.id,
          deadlineId,
        },
      },
    });

    if (existing) {
      await prisma.userDeadlineBookmark.delete({
        where: { id: existing.id },
      });
      return res.json({ bookmarked: false, message: 'Deadline removed from your planner.' });
    } else {
      const created = await prisma.userDeadlineBookmark.create({
        data: {
          userId: user.id,
          deadlineId,
          reminderDaysBefore: 7,
        },
      });
      return res.status(201).json({
        bookmarked: true,
        message: 'Deadline saved to your application planner with a 7-day reminder.',
        bookmark: created,
      });
    }
  } catch (error) {
    console.error('Error toggling deadline bookmark:', error);
    return res.status(500).json({ error: 'Failed to bookmark deadline.' });
  }
};

export const getMyBookmarkedDeadlines = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: 'Authentication required.' });

  try {
    const bookmarks = await prisma.userDeadlineBookmark.findMany({
      where: { userId: user.id },
      include: {
        deadline: {
          include: {
            university: {
              select: { id: true, name: true, slug: true, country: { select: { name: true } }, cityName: true },
            },
            program: {
              select: { id: true, name: true, degreeLevel: true },
            },
            scholarship: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const evaluated = bookmarks.map((b: any) => ({
      ...b,
      deadline: {
        ...b.deadline,
        university: b.deadline?.university
          ? {
              id: b.deadline.university.id,
              name: b.deadline.university.name,
              slug: b.deadline.university.slug,
              countryName: b.deadline.university.country?.name,
              cityName: b.deadline.university.cityName,
            }
          : undefined,
        computedStatus: calculateDeadlineStatus(b.deadline),
      },
    }));

    return res.json({
      total: evaluated.length,
      bookmarks: evaluated,
    });
  } catch (error) {
    console.error('Error fetching bookmarked deadlines:', error);
    return res.status(500).json({ error: 'Failed to retrieve saved deadlines.' });
  }
};
