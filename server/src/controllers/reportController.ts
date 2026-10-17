import { Request, Response } from 'express';
import { prisma } from '../services/db.js';

export const submitReport = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const {
    entityType,
    entityId,
    entitySlug,
    entityName,
    fieldBelievedIncorrect,
    reasonCategory,
    description,
    currentValue,
    proposedCorrection,
    officialEvidenceUrl,
    supportingDocPath,
  } = req.body;

  if (!entityType || !entityId || !fieldBelievedIncorrect || !description || !officialEvidenceUrl) {
    return res.status(400).json({
      error: 'Entity type, entity ID, incorrect field, description, and official evidence URL are required.',
    });
  }

  // Basic URL validation
  try {
    new URL(officialEvidenceUrl);
  } catch {
    return res.status(400).json({ error: 'Please provide a valid official evidence URL.' });
  }

  const reportNumber = `RPT-${Date.now().toString().slice(-6)}`;

  try {
    const report = await prisma.informationReport.create({
      data: {
        reportNumber,
        reporterId: user ? user.id : null,
        reporterEmail: user ? user.email : null,
        entityType,
        entityId,
        entitySlug,
        entityName: entityName || `${entityType} Record`,
        fieldBelievedIncorrect,
        reasonCategory: reasonCategory || 'OTHER_FACTUAL_ERROR',
        description,
        currentValue: currentValue || null,
        proposedCorrection: proposedCorrection || null,
        officialEvidenceUrl,
        supportingDocPath: supportingDocPath || null,
        status: 'PENDING_REVIEW',
      },
    });

    // If authenticated, create a notification
    if (user?.id) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Report Received',
          message: `Your report #${reportNumber} on "${report.entityName}" has been received and queued for editorial verification.`,
          type: 'INFO',
          link: `/dashboard/reports`,
        },
      });
    }

    return res.status(201).json({
      message: 'Thank you for your report. Our verification editors will review the official evidence provided.',
      reportNumber,
      report,
    });
  } catch (error) {
    console.error('Error submitting factual report:', error);
    return res.status(500).json({ error: 'Failed to submit information report.' });
  }
};

export const getMyReports = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: 'Authentication required.' });

  try {
    const reports = await prisma.informationReport.findMany({
      where: { reporterId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        comments: {
          orderBy: { createdAt: 'asc' },
        },
        revisions: true,
      },
    });

    return res.json({
      total: reports.length,
      reports,
    });
  } catch (error) {
    console.error('Error fetching reporter submissions:', error);
    return res.status(500).json({ error: 'Failed to retrieve your submitted reports.' });
  }
};

export const getReportById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  try {
    const report = await prisma.informationReport.findUnique({
      where: { id },
      include: {
        comments: {
          orderBy: { createdAt: 'asc' },
        },
        revisions: true,
      },
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    // Privacy rule: Only reporter or staff can inspect full report
    const isStaff =
      user?.role === 'SUPER_ADMIN' ||
      user?.role === 'ADMIN' ||
      user?.role === 'MODERATOR' ||
      user?.role === 'DATA_EDITOR';

    if (report.reporterId && report.reporterId !== user?.id && !isStaff) {
      return res.status(403).json({ error: 'Access denied to this report.' });
    }

    return res.json({ report });
  } catch (error) {
    console.error('Error fetching report details:', error);
    return res.status(500).json({ error: 'Failed to retrieve report.' });
  }
};

export const resubmitReport = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const { additionalEvidenceUrl, message } = req.body;

  if (!user) return res.status(401).json({ error: 'Authentication required.' });

  try {
    const report = await prisma.informationReport.findUnique({ where: { id } });
    if (!report) return res.status(404).json({ error: 'Report not found.' });

    if (report.reporterId !== user.id) {
      return res.status(403).json({ error: 'Only the original reporter can resubmit this report.' });
    }

    // Add comment
    if (message || additionalEvidenceUrl) {
      await prisma.reportComment.create({
        data: {
          reportId: id,
          authorId: user.id,
          authorName: user.name,
          authorRole: 'STUDENT',
          message: message || 'Provided additional evidence for re-review.',
          evidenceUrl: additionalEvidenceUrl || null,
        },
      });
    }

    const updated = await prisma.informationReport.update({
      where: { id },
      data: {
        status: 'RESUBMITTED',
        officialEvidenceUrl: additionalEvidenceUrl || report.officialEvidenceUrl,
        updatedAt: new Date(),
      },
    });

    return res.json({
      message: 'Additional evidence submitted. Report status updated to RESUBMITTED.',
      report: updated,
    });
  } catch (error) {
    console.error('Error resubmitting report evidence:', error);
    return res.status(500).json({ error: 'Failed to update report.' });
  }
};

// ==================== ADMIN REVIEW QUEUE ====================

export const getAdminReportsQueue = async (req: Request, res: Response) => {
  const { status, category, entityType } = req.query;

  try {
    const where: any = {};
    if (status && typeof status === 'string' && status !== 'all') {
      where.status = status;
    }
    if (category && typeof category === 'string' && category !== 'all') {
      where.reasonCategory = category;
    }
    if (entityType && typeof entityType === 'string' && entityType !== 'all') {
      where.entityType = entityType;
    }

    const reports = await prisma.informationReport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: {
          select: { id: true, name: true, email: true, role: true },
        },
        comments: {
          orderBy: { createdAt: 'asc' },
        },
        revisions: true,
      },
    });

    // Mark priority
    const mapped = reports.map((r) => {
      const isHighPriority =
        r.reasonCategory === 'MISLEADING_OR_FRAUDULENT_INFO' ||
        r.fieldBelievedIncorrect === 'CLOSE_DATE' ||
        r.fieldBelievedIncorrect === 'OPEN_DATE';
      return {
        ...r,
        priority: isHighPriority ? 'HIGH' : 'NORMAL',
      };
    });

    return res.json({
      total: mapped.length,
      reports: mapped,
    });
  } catch (error) {
    console.error('Error fetching admin reports queue:', error);
    return res.status(500).json({ error: 'Failed to retrieve admin reports queue.' });
  }
};

export const reviewReport = async (req: Request, res: Response) => {
  const { id } = req.params;
  const adminUser = (req as any).user;
  const {
    decision, // APPROVE, REJECT, REQUEST_MORE_INFO, MARK_DISPUTED, DUPLICATE
    adminFeedback,
    correctedValue,
    sourceEvidenceUrl,
  } = req.body;

  if (!decision) {
    return res.status(400).json({ error: 'Review decision is required.' });
  }

  try {
    const report = await prisma.informationReport.findUnique({
      where: { id },
      include: { reporter: true },
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    if (decision === 'REQUEST_MORE_INFO') {
      const updated = await prisma.informationReport.update({
        where: { id },
        data: {
          status: 'MORE_INFO_REQUESTED',
          adminFeedback: adminFeedback || 'Please provide an official university catalog URL or registrar notice.',
          reviewedBy: adminUser.id,
          reviewedAt: new Date(),
        },
      });

      await prisma.reportComment.create({
        data: {
          reportId: id,
          authorId: adminUser.id,
          authorName: adminUser.name,
          authorRole: 'ADMIN',
          message: adminFeedback || 'More verification evidence is requested to confirm this correction.',
        },
      });

      if (report.reporterId) {
        await prisma.notification.create({
          data: {
            userId: report.reporterId,
            title: 'Additional Evidence Requested',
            message: `Staff reviewed report #${report.reportNumber} and requested additional official documentation.`,
            type: 'ACTION_REQUIRED',
            link: '/dashboard/reports',
          },
        });
      }

      return res.json({
        message: 'Report status set to MORE_INFO_REQUESTED. Student has been notified.',
        report: updated,
      });
    }

    if (decision === 'REJECT') {
      const updated = await prisma.informationReport.update({
        where: { id },
        data: {
          status: 'REJECTED',
          adminFeedback: adminFeedback || 'Evidence does not corroborate the reported discrepancy.',
          reviewedBy: adminUser.id,
          reviewedAt: new Date(),
        },
      });

      if (report.reporterId) {
        await prisma.notification.create({
          data: {
            userId: report.reporterId,
            title: 'Report Update',
            message: `Report #${report.reportNumber} was closed after staff verification. Reason: ${adminFeedback || 'Official sources confirm existing record.'}`,
            type: 'INFO',
            link: '/dashboard/reports',
          },
        });
      }

      return res.json({
        message: 'Report rejected. Public database records were not altered.',
        report: updated,
      });
    }

    if (decision === 'MARK_DISPUTED') {
      if (report.entityType === 'DEADLINE') {
        await prisma.applicationDeadline.update({
          where: { id: report.entityId },
          data: {
            isDisputed: true,
            disputeNote: adminFeedback || 'Application dates currently under staff re-verification.',
          },
        });
      }

      const updated = await prisma.informationReport.update({
        where: { id },
        data: {
          status: 'UNDER_INVESTIGATION',
          adminFeedback: adminFeedback || 'Record marked as disputed while awaiting institution registrar response.',
          reviewedBy: adminUser.id,
          reviewedAt: new Date(),
        },
      });

      return res.json({
        message: 'Record marked as disputed with public warning banner.',
        report: updated,
      });
    }

    if (decision === 'APPROVE') {
      const finalValue = correctedValue !== undefined ? correctedValue : report.proposedCorrection;
      const finalSource = sourceEvidenceUrl || report.officialEvidenceUrl;

      // Transactional safe application
      const result = await prisma.$transaction(async (tx) => {
        // 1. Update target public database record
        if (report.entityType === 'PROGRAM') {
          const updateData: any = { lastVerifiedAt: new Date() };
          if (report.fieldBelievedIncorrect === 'TUITION_FEE' && finalValue) {
            updateData.annualTuitionLocal = parseFloat(finalValue);
          } else if (report.fieldBelievedIncorrect === 'ENGLISH_REQS' && finalValue) {
            updateData.ieltsOverall = parseFloat(finalValue);
          }
          await tx.program.update({
            where: { id: report.entityId },
            data: updateData,
          });
        } else if (report.entityType === 'DEADLINE') {
          const updateData: any = {
            lastVerifiedAt: new Date(),
            officialSourceUrl: finalSource,
            isDisputed: false,
          };
          if (report.fieldBelievedIncorrect === 'CLOSE_DATE' && finalValue) {
            updateData.closeDate = new Date(finalValue);
          } else if (report.fieldBelievedIncorrect === 'OPEN_DATE' && finalValue) {
            updateData.openDate = new Date(finalValue);
          }
          await tx.applicationDeadline.update({
            where: { id: report.entityId },
            data: updateData,
          });
        } else if (report.entityType === 'UNIVERSITY') {
          const updateData: any = { lastVerifiedAt: new Date() };
          if (report.fieldBelievedIncorrect === 'OFFICIAL_LINK' && finalValue) {
            updateData.admissionsUrl = finalValue;
          }
          await tx.university.update({
            where: { id: report.entityId },
            data: updateData,
          });
        }

        // 2. Record immutable revision history entry
        const revision = await tx.dataRevisionHistory.create({
          data: {
            reportId: id,
            entityType: report.entityType,
            entityId: report.entityId,
            fieldName: report.fieldBelievedIncorrect,
            previousValue: report.currentValue || 'N/A',
            newValue: String(finalValue || 'Corrected'),
            sourceUrl: finalSource,
            reviewerId: adminUser.id,
            reviewerName: adminUser.name,
            reason: adminFeedback || `Approved correction reported by student (#${report.reportNumber}).`,
          },
        });

        // 3. Update report status to APPROVED / RESOLVED
        const updatedReport = await tx.informationReport.update({
          where: { id },
          data: {
            status: 'APPROVED',
            adminFeedback: adminFeedback || 'Correction verified against official sources and published.',
            reviewedBy: adminUser.id,
            reviewedAt: new Date(),
          },
        });

        // 4. Create notification for the reporter
        if (report.reporterId) {
          await tx.notification.create({
            data: {
              userId: report.reporterId,
              title: 'Correction Approved & Published!',
              message: `Thank you! Your report #${report.reportNumber} for "${report.entityName}" was approved. The public platform records have been updated.`,
              type: 'SUCCESS',
              link: report.entitySlug ? `/universities/${report.entitySlug}` : '/community',
            },
          });
        }

        return { updatedReport, revision };
      });

      return res.json({
        message: 'Correction approved and public database updated transactionally.',
        report: result.updatedReport,
        revision: result.revision,
      });
    }

    return res.status(400).json({ error: 'Unsupported decision action.' });
  } catch (error) {
    console.error('Error reviewing report:', error);
    return res.status(500).json({ error: 'Failed to process report review.' });
  }
};
