import { Request, Response } from 'express';
import { UNIVERSITIES_DATA, UniversityRecord } from '../data/universitiesData.js';
import { COUNTRIES_DATA } from '../data/countriesData.js';
import { SCHOLARSHIPS_DATA } from '../data/scholarshipsData.js';

interface ImportJob {
  id: string;
  sourceName: string;
  sourceType: string;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED';
  createdAt: string;
}

const IMPORT_JOBS: ImportJob[] = [
  {
    id: "job-101",
    sourceName: "Studyinfo.fi Finnish National Education Portal",
    sourceType: "API_SYNC",
    totalRecords: 38,
    validRecords: 38,
    invalidRecords: 0,
    status: "COMPLETED",
    createdAt: "2025-02-15T08:30:00Z"
  },
  {
    id: "job-102",
    sourceName: "German DAAD Hochschulkompass Export (Q1)",
    sourceType: "CSV_IMPORT",
    totalRecords: 120,
    validRecords: 118,
    invalidRecords: 2,
    status: "COMPLETED",
    createdAt: "2025-02-14T11:00:00Z"
  },
  {
    id: "job-103",
    sourceName: "Universitaly Official Catalog",
    sourceType: "API_SYNC",
    totalRecords: 45,
    validRecords: 45,
    invalidRecords: 0,
    status: "COMPLETED",
    createdAt: "2025-02-10T14:20:00Z"
  }
];

const AUDIT_LOGS = [
  {
    id: "aud-1",
    actor: "Admin (admin@borno.edu)",
    action: "VERIFIED_RECORD",
    entity: "Aalto University - MSc Computer Science",
    timestamp: "2025-02-15T09:12:00Z",
    details: "Checked tuition €15,000 against official aalto.fi prospectus.",
  },
  {
    id: "aud-2",
    actor: "Admin (admin@borno.edu)",
    action: "UPDATED_SCHOLARSHIP",
    entity: "Stipendium Hungaricum 2025 Intake",
    timestamp: "2025-02-13T16:04:00Z",
    details: "Updated application window and Bangladesh nomination process.",
  },
  {
    id: "aud-3",
    actor: "SYSTEM_ROBOT",
    action: "SCHEDULED_HEALTH_CHECK",
    entity: "Official Admissions URLs",
    timestamp: "2025-02-12T00:00:00Z",
    details: "100% of university official links responded with HTTP 200 OK.",
  }
];

export const getAdminStats = (req: Request, res: Response) => {
  const totalPrograms = UNIVERSITIES_DATA.reduce((acc, u) => acc + u.programs.length, 0);

  return res.json({
    summary: {
      totalCountries: COUNTRIES_DATA.length,
      totalUniversities: UNIVERSITIES_DATA.length,
      totalPrograms,
      totalScholarships: SCHOLARSHIPS_DATA.length,
      verifiedCount: UNIVERSITIES_DATA.filter((u) => u.verificationStatus === 'VERIFIED').length,
      pendingReviewCount: UNIVERSITIES_DATA.filter((u) => u.verificationStatus === 'PENDING_REVIEW').length,
      needsUpdateCount: UNIVERSITIES_DATA.filter((u) => u.verificationStatus === 'NEEDS_UPDATE').length,
    },
    recentImportJobs: IMPORT_JOBS,
    recentAuditLogs: AUDIT_LOGS,
  });
};

export const updateUniversityVerification = (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const uni = UNIVERSITIES_DATA.find((u) => u.id === id);
  if (!uni) {
    return res.status(404).json({ error: 'University not found' });
  }

  uni.verificationStatus = status;
  uni.lastVerifiedAt = new Date().toISOString();

  AUDIT_LOGS.unshift({
    id: `aud-${Date.now()}`,
    actor: (req as any).user?.email || 'Admin',
    action: `STATUS_${status}`,
    entity: uni.name,
    timestamp: new Date().toISOString(),
    details: notes || `Verification status manually updated to ${status}`,
  });

  return res.json({
    message: 'University record updated successfully.',
    university: uni,
  });
};

export const previewCsvImport = (req: Request, res: Response) => {
  const { rawCsvText } = req.body;

  if (!rawCsvText) {
    return res.status(400).json({ error: 'CSV text content is required.' });
  }

  // Parse CSV lines
  const lines = rawCsvText.trim().split('\n');
  if (lines.length < 2) {
    return res.status(400).json({ error: 'CSV must contain a header line and at least one data row.' });
  }

  const headers = lines[0].split(',').map((h: string) => h.trim().toLowerCase());
  const rows = lines.slice(1).map((line: string) => line.split(',').map((cell: string) => cell.trim()));

  const preview = rows.map((cols: string[], idx: number) => {
    const rowObj: Record<string, string> = {};
    headers.forEach((h: string, i: number) => {
      rowObj[h] = cols[i] || '';
    });

    const isDuplicate = UNIVERSITIES_DATA.some(
      (u) => u.name.toLowerCase() === (rowObj['name'] || '').toLowerCase()
    );

    return {
      rowIndex: idx + 1,
      name: rowObj['name'] || 'Unknown',
      country: rowObj['country'] || '',
      city: rowObj['city'] || '',
      tuition: rowObj['tuition'] || '',
      isDuplicate,
      status: isDuplicate ? 'DUPLICATE_FOUND' : 'READY_TO_IMPORT',
    };
  });

  return res.json({
    totalRows: preview.length,
    readyCount: preview.filter((p: any) => p.status === 'READY_TO_IMPORT').length,
    duplicateCount: preview.filter((p: any) => p.status === 'DUPLICATE_FOUND').length,
    previewRows: preview,
  });
};
