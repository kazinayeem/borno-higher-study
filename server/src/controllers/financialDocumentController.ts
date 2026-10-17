import { Request, Response } from 'express';
import { prisma } from '../services/db.js';
import path from 'path';
import fs from 'fs';

const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads/private_documents');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export const submitDocument = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: 'Authentication required.' });

  const {
    documentCategory,
    title,
    originalFilename,
    originalFileName,
    fileSizeBytes = 250000,
    fileType,
    mimeType = 'application/pdf',
    currency = 'BDT',
    balanceAmount,
    bankName,
    accountHolderType = 'STUDENT',
  } = req.body;

  const docTitle = title || originalFileName || originalFilename || `${documentCategory || 'Financial'}_Submission`;
  const resolvedFilename = originalFileName || originalFilename || `${docTitle}.pdf`;
  const resolvedMime = fileType || mimeType || 'application/pdf';

  if (!documentCategory) {
    return res.status(400).json({ error: 'Document category is required.' });
  }

  // Create sanitized safe private storage path
  const safeFilename = `${user.id}-${Date.now()}.pdf`;
  const relativeStoragePath = `private_documents/${safeFilename}`;

  try {
    const submission = await prisma.financialDocumentSubmission.create({
      data: {
        userId: user.id,
        documentCategory,
        title: docTitle,
        originalFilename: resolvedFilename,
        storagePath: relativeStoragePath,
        fileSizeBytes: parseInt(fileSizeBytes, 10) || 250000,
        mimeType: resolvedMime,
        status: 'SUBMITTED',
        currency,
        balanceAmount: balanceAmount ? parseFloat(balanceAmount) : null,
        bankName,
        accountHolderType,
        verificationDisclaimer:
          'Internal document review completed. This does not constitute legal banking verification or guarantee visa issuance.',
      },
    });

    // Record review history
    await prisma.documentReviewHistory.create({
      data: {
        submissionId: submission.id,
        changedBy: user.email,
        previousStatus: 'DRAFT',
        newStatus: 'SUBMITTED',
        notes: 'Initial document submission received for internal study-abroad verification.',
      },
    });

    return res.status(201).json({
      message: 'Financial document submitted securely for administrative review.',
      submission,
    });
  } catch (error) {
    console.error('Error submitting financial document:', error);
    return res.status(500).json({ error: 'Failed to submit document for review.' });
  }
};

export const getMyDocuments = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: 'Authentication required.' });

  try {
    const documents = await prisma.financialDocumentSubmission.findMany({
      where: { userId: user.id },
      orderBy: { submittedAt: 'desc' },
      include: {
        history: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    return res.json({ documents });
  } catch (error) {
    console.error('Error fetching student documents:', error);
    return res.status(500).json({ error: 'Failed to retrieve your private documents.' });
  }
};

export const getAdminDocumentQueue = async (req: Request, res: Response) => {
  try {
    const documents = await prisma.financialDocumentSubmission.findMany({
      orderBy: { submittedAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        history: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    return res.json({ documents });
  } catch (error) {
    console.error('Error fetching admin document queue:', error);
    return res.status(500).json({ error: 'Failed to fetch document review queue.' });
  }
};

export const reviewDocument = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, reviewerNotes } = req.body;
  const adminUser = (req as any).user;

  const validStatuses = [
    'UNDER_REVIEW',
    'CORRECTIONS_REQUESTED',
    'APPROVED_INTERNAL',
    'REJECTED',
    'WITHDRAWN',
  ];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid document review status.' });
  }

  try {
    const existing = await prisma.financialDocumentSubmission.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Document submission not found.' });
    }

    const previousStatus = existing.status;

    const updated = await prisma.financialDocumentSubmission.update({
      where: { id },
      data: {
        status,
        reviewerNotes,
        reviewedBy: adminUser.id,
        reviewedAt: new Date(),
      },
    });

    // Record auditable history
    await prisma.documentReviewHistory.create({
      data: {
        submissionId: id,
        changedBy: adminUser.email,
        previousStatus,
        newStatus: status,
        notes: reviewerNotes || `Status updated to ${status}`,
      },
    });

    // Create notification for student
    await prisma.notification.create({
      data: {
        userId: existing.userId,
        title: `Financial Document Review: ${status}`,
        message: reviewerNotes
          ? `Your document "${existing.title}" status changed to ${status}. Notes: ${reviewerNotes}`
          : `Your document "${existing.title}" status changed to ${status}.`,
        type: status === 'APPROVED_INTERNAL' ? 'SUCCESS' : status === 'CORRECTIONS_REQUESTED' ? 'WARNING' : 'INFO',
        link: '/dashboard/financial-documents',
      },
    });

    // Admin audit log
    await prisma.auditLog.create({
      data: {
        userId: adminUser.id,
        action: `FINANCIAL_DOC_${status}`,
        entityType: 'FinancialDoc',
        entityId: id,
        details: JSON.stringify({
          studentEmail: existing.user.email,
          previousStatus,
          newStatus: status,
          reviewerNotes,
        }),
      },
    });

    return res.json({
      message: `Document status updated to ${status}.`,
      document: updated,
    });
  } catch (error) {
    console.error('Error reviewing financial document:', error);
    return res.status(500).json({ error: 'Failed to record document review.' });
  }
};

export const getSecureDocumentLink = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  try {
    const doc = await prisma.financialDocumentSubmission.findUnique({
      where: { id },
    });

    if (!doc) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    // Authorization check: Only the owning student or an admin/moderator may view
    const isOwner = user.id === doc.userId;
    const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'].includes(user.role);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Unauthorized to access this private document.' });
    }

    // Return authorized temporary secure metadata & viewing receipt
    return res.json({
      authorized: true,
      documentId: doc.id,
      title: doc.title,
      originalFilename: doc.originalFilename,
      mimeType: doc.mimeType,
      fileSizeBytes: doc.fileSizeBytes,
      disclaimer: doc.verificationDisclaimer,
      expiresInSeconds: 300,
    });
  } catch (error) {
    console.error('Error generating secure document link:', error);
    return res.status(500).json({ error: 'Could not access document link.' });
  }
};
