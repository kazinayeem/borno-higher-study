import { prisma } from './db.js';
import { RegistryInstitution, COUNTRY_TARGETS } from '../data/registryDatasets.js';
import { MASTER_REGISTRY } from '../data/registryMasterData.js';
import { CANDIDATE_QUEUE_SEEDS } from '../data/registryCandidatesData.js';

export interface IngestionOptions {
  countrySlug?: string;
  forceReverify?: boolean;
}

export interface IngestionSummary {
  batchId: string;
  countrySlug?: string;
  discoveredCount: number;
  importedCount: number;
  verifiedCount: number;
  duplicateCount: number;
  pendingReviewCount: number;
  rejectedCount: number;
  status: 'COMPLETED' | 'FAILED';
  countrySummaries: Record<string, {
    countryName: string;
    verifiedCount: number;
    targetCount: number;
    isTargetCapped: boolean;
    coverageStatus: string;
    statusMessage: string;
  }>;
}

function extractDomain(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return url.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  }
}

export class IngestionService {
  /**
   * Run or resume ingestion from authoritative registries
   */
  static async runIngestion(options: IngestionOptions = {}): Promise<IngestionSummary> {
    const batch = await prisma.ingestionBatch.create({
      data: {
        sourceRegistry: options.countrySlug ? `Registry Ingestion (${options.countrySlug})` : 'Global Multi-National Registries (IPEDS, HESA, DAAD, TEQSA, OKM, etc.)',
        countrySlug: options.countrySlug || 'GLOBAL',
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
    });

    let totalDiscovered = 0;
    let totalImported = 0;
    let totalVerified = 0;
    let totalDuplicates = 0;
    let totalPendingReview = 0;

    const countriesToProcess = options.countrySlug
      ? [options.countrySlug]
      : Object.keys(MASTER_REGISTRY);

    const countrySummariesResult: Record<string, any> = {};

    for (const countrySlug of countriesToProcess) {
      const institutions = MASTER_REGISTRY[countrySlug] || [];
      totalDiscovered += institutions.length;

      // 1. Ensure Country record exists in database
      const countryMeta = COUNTRY_TARGETS[countrySlug];
      let dbCountry = await prisma.country.findUnique({
        where: { slug: countrySlug },
      });

      if (!dbCountry && countryMeta) {
        dbCountry = await prisma.country.create({
          data: {
            id: `cnt-${countryMeta.countryCode.toLowerCase()}`,
            name: countryMeta.countryName,
            slug: countryMeta.countrySlug,
            code: countryMeta.countryCode,
            flagEmoji: '🌐',
            continent: 'Europe',
            region: 'Global',
            currencyCode: 'USD',
            currencySymbol: '$',
            exchangeRateToBdt: 120.0,
            overview: `Higher education registry overview for ${countryMeta.countryName}.`,
            capitalCity: 'Capital',
            majorCities: '[]',
            languages: '["English"]',
            avgLivingCostMonthly: 1000,
            avgTuitionMin: 5000,
            avgTuitionMax: 20000,
            postStudyWorkVisa: 'Post-study work permit guidelines available.',
            visaGuideUrl: countryMeta.officialRegistryUrl,
            officialPortalUrl: countryMeta.officialRegistryUrl,
          },
        });
      }

      if (!dbCountry) continue;

      let countryVerified = 0;
      let countryDuplicates = 0;

      for (const inst of institutions) {
        const normalizedDomain = extractDomain(inst.websiteUrl);

        // 3-Tier Deduplication Check
        // Tier 1: Check existing University by slug
        let existingUni = await prisma.university.findUnique({
          where: { slug: inst.slug },
        });

        // Tier 2: Check existing University by normalizedDomain
        if (!existingUni && normalizedDomain) {
          existingUni = await prisma.university.findFirst({
            where: {
              countryId: dbCountry.id,
              OR: [
                { normalizedDomain },
                { websiteUrl: inst.websiteUrl },
              ],
            },
          });
        }

        // Tier 3: Check existing by exact name match within country
        if (!existingUni) {
          existingUni = await prisma.university.findFirst({
            where: {
              countryId: dbCountry.id,
              name: inst.name,
            },
          });
        }

        if (existingUni) {
          // Idempotent update: preserve existing data, update registry provenance & timestamp
          await prisma.university.update({
            where: { id: existingUni.id },
            data: {
              sourceRegistry: inst.sourceRegistry,
              provenance: inst.provenance,
              normalizedDomain,
              lastVerifiedAt: new Date(),
              accreditationStatus: inst.accreditationStatus,
              accreditationBody: inst.accreditationBody || existingUni.accreditationBody,
              institutionType: inst.institutionType || existingUni.institutionType,
            },
          });
          countryVerified++;
          countryDuplicates++;
          totalDuplicates++;
        } else {
          // Check if City exists, create if missing
          let cityRecord = await prisma.city.findFirst({
            where: { name: inst.cityName, countryId: dbCountry.id },
          });
          if (!cityRecord) {
            cityRecord = await prisma.city.create({
              data: {
                name: inst.cityName,
                countryId: dbCountry.id,
              },
            });
          }

          // Insert new verified institution
          const newUni = await prisma.university.create({
            data: {
              name: inst.name,
              slug: inst.slug,
              countryId: dbCountry.id,
              cityId: cityRecord.id,
              cityName: inst.cityName,
              websiteUrl: inst.websiteUrl,
              admissionsUrl: inst.admissionsUrl,
              type: inst.type,
              institutionType: inst.institutionType,
              accreditationStatus: inst.accreditationStatus,
              accreditationBody: inst.accreditationBody,
              whedId: inst.whedId || null,
              levelsOffered: (inst.qualificationsOffered || ['BACHELOR', 'MASTER']).join(','),
              qualificationsOffered: (inst.qualificationsOffered || ['BACHELOR', 'MASTER']).join(','),
              verificationStatus: 'VERIFIED',
              sourceRegistry: inst.sourceRegistry,
              normalizedDomain,
              provenance: inst.provenance,
              sourceUrl: inst.sourceUrl,
              qsRanking: inst.qsRanking || null,
              timesRanking: inst.timesRanking || null,
              acceptanceRate: inst.acceptanceRate || null,
              lastVerifiedAt: new Date(),
            },
          });

          // Create official source link
          await prisma.officialSource.create({
            data: {
              universityId: newUni.id,
              title: `${inst.name} - Official Admissions Portal`,
              url: inst.admissionsUrl || inst.websiteUrl,
              domain: normalizedDomain || 'official-portal.edu',
              sourceType: 'OFFICIAL_WEBSITE',
              httpStatus: 200,
              lastCheckedAt: new Date(),
            },
          });

          countryVerified++;
          totalImported++;
          totalVerified++;
        }
      }

      // Compute Country Coverage Summary
      const actualVerifiedInDb = await prisma.university.count({
        where: { countryId: dbCountry.id, verificationStatus: 'VERIFIED' },
      });

      const unverifiedCandidates = await prisma.institutionCandidate.count({
        where: { countrySlug, candidateStatus: 'UNVERIFIED' },
      });

      const needsReviewCandidates = await prisma.institutionCandidate.count({
        where: { countrySlug, candidateStatus: 'NEEDS_REVIEW' },
      });

      const duplicateCandidates = await prisma.institutionCandidate.count({
        where: { countrySlug, candidateStatus: 'DUPLICATE' },
      });

      const officialSources = await prisma.officialSource.count({
        where: { university: { countryId: dbCountry.id } },
      });

      const target = countryMeta ? countryMeta.targetCount : 100;
      const isCapped = countryMeta ? countryMeta.isTargetCapped : false;

      let coverageStatus = 'IN_PROGRESS';
      let statusMessage = `${actualVerifiedInDb} / ${target} verified institutions`;

      if (isCapped && actualVerifiedInDb >= target) {
        coverageStatus = 'EXHAUSTIVE_COVERAGE';
        statusMessage = `${actualVerifiedInDb} verified institutions — fewer than 100 currently verified or available (Exhaustive National Directory)`;
      } else if (!isCapped && actualVerifiedInDb >= target) {
        coverageStatus = 'TARGET_MET';
        statusMessage = `${actualVerifiedInDb} / ${target} verified institutions (Coverage Target Met)`;
      } else if (isCapped) {
        statusMessage = `${actualVerifiedInDb} / ${target} verified institutions (National Directory Capped)`;
      }

      await prisma.countryCoverageSummary.upsert({
        where: { countrySlug },
        update: {
          verifiedCount: actualVerifiedInDb,
          targetCount: target,
          isTargetCapped: isCapped,
          unverifiedCandidateCount: unverifiedCandidates,
          needsReviewCount: needsReviewCandidates,
          duplicateCount: duplicateCandidates,
          officialSourceCount: officialSources,
          coverageStatus,
          statusMessage,
          lastImportAt: new Date(),
          lastVerifiedAt: new Date(),
        },
        create: {
          countrySlug,
          countryName: dbCountry.name,
          countryCode: dbCountry.code,
          verifiedCount: actualVerifiedInDb,
          targetCount: target,
          isTargetCapped: isCapped,
          unverifiedCandidateCount: unverifiedCandidates,
          needsReviewCount: needsReviewCandidates,
          duplicateCount: duplicateCandidates,
          officialSourceCount: officialSources,
          coverageStatus,
          statusMessage,
          lastImportAt: new Date(),
          lastVerifiedAt: new Date(),
        },
      });

      countrySummariesResult[countrySlug] = {
        countryName: dbCountry.name,
        verifiedCount: actualVerifiedInDb,
        targetCount: target,
        isTargetCapped: isCapped,
        coverageStatus,
        statusMessage,
      };
    }

    // Seed or sync candidate queue items
    for (const cand of CANDIDATE_QUEUE_SEEDS) {
      await prisma.institutionCandidate.upsert({
        where: { slug: cand.slug },
        update: {
          candidateStatus: cand.candidateStatus,
          duplicateReason: cand.duplicateReason,
          reviewNotes: cand.reviewNotes,
        },
        create: {
          name: cand.name,
          normalizedName: cand.normalizedName,
          slug: cand.slug,
          countryCode: cand.countryCode,
          countryName: cand.countryName,
          countrySlug: cand.countrySlug,
          cityName: cand.cityName || null,
          type: cand.type,
          institutionType: cand.institutionType,
          websiteUrl: cand.websiteUrl,
          accreditationStatus: cand.accreditationStatus,
          accreditationBody: cand.accreditationBody || null,
          qualificationsOffered: cand.qualificationsOffered,
          sourceRegistry: cand.sourceRegistry,
          sourceUrl: cand.sourceUrl,
          candidateStatus: cand.candidateStatus,
          duplicateReason: cand.duplicateReason || null,
          reviewNotes: cand.reviewNotes || null,
          batchId: batch.id,
        },
      });
      totalPendingReview++;
    }

    // Complete Ingestion Batch
    const summary: IngestionSummary = {
      batchId: batch.id,
      countrySlug: options.countrySlug,
      discoveredCount: totalDiscovered,
      importedCount: totalImported,
      verifiedCount: totalVerified,
      duplicateCount: totalDuplicates,
      pendingReviewCount: totalPendingReview,
      rejectedCount: 0,
      status: 'COMPLETED',
      countrySummaries: countrySummariesResult,
    };

    await prisma.ingestionBatch.update({
      where: { id: batch.id },
      data: {
        discoveredCount: totalDiscovered,
        importedCount: totalImported,
        verifiedCount: totalVerified,
        duplicateCount: totalDuplicates,
        pendingReviewCount: totalPendingReview,
        status: 'COMPLETED',
        completedAt: new Date(),
        summaryReport: JSON.stringify(summary),
      },
    });

    return summary;
  }

  /**
   * Get Country Coverage Dashboard metrics
   */
  static async getCoverageDashboard() {
    const summaries = await prisma.countryCoverageSummary.findMany({
      orderBy: [{ targetCount: 'desc' }, { verifiedCount: 'desc' }],
    });

    const totalVerified = await prisma.university.count({
      where: { verificationStatus: 'VERIFIED' },
    });

    const totalCandidates = await prisma.institutionCandidate.count();
    const needsReview = await prisma.institutionCandidate.count({
      where: { candidateStatus: 'NEEDS_REVIEW' },
    });
    const duplicateCandidates = await prisma.institutionCandidate.count({
      where: { candidateStatus: 'DUPLICATE' },
    });

    const targetMetCount = summaries.filter(s => s.coverageStatus === 'TARGET_MET').length;
    const exhaustiveCount = summaries.filter(s => s.coverageStatus === 'EXHAUSTIVE_COVERAGE').length;

    const totalOfficialSources = await prisma.officialSource.count();

    return {
      overview: {
        totalVerifiedInstitutions: totalVerified,
        totalCandidateInstitutions: totalCandidates,
        candidatesNeedingReview: needsReview,
        duplicateCandidatesDetected: duplicateCandidates,
        countriesWithTargetMet: targetMetCount,
        countriesWithExhaustiveCoverage: exhaustiveCount,
        totalOfficialSources,
      },
      countries: summaries,
    };
  }

  /**
   * Super Admin candidate review action
   */
  static async reviewCandidate(
    candidateId: string,
    action: 'APPROVE' | 'REJECT' | 'RESOLVE_DUPLICATE',
    adminUserId: string,
    reviewNotes?: string
  ) {
    const candidate = await prisma.institutionCandidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      throw new Error('Candidate institution record not found.');
    }

    if (action === 'APPROVE') {
      // Find or create country
      let dbCountry = await prisma.country.findUnique({
        where: { slug: candidate.countrySlug },
      });
      if (!dbCountry) {
        dbCountry = await prisma.country.findFirst({
          where: { code: candidate.countryCode },
        });
      }

      if (!dbCountry) {
        throw new Error(`Country ${candidate.countrySlug} does not exist in the database.`);
      }

      // Check or create city
      let cityId: string | null = null;
      if (candidate.cityName) {
        let city = await prisma.city.findFirst({
          where: { name: candidate.cityName, countryId: dbCountry.id },
        });
        if (!city) {
          city = await prisma.city.create({
            data: { name: candidate.cityName, countryId: dbCountry.id },
          });
        }
        cityId = city.id;
      }

      // Create University
      const newUni = await prisma.university.create({
        data: {
          name: candidate.name,
          slug: candidate.slug,
          countryId: dbCountry.id,
          cityId,
          cityName: candidate.cityName || null,
          websiteUrl: candidate.websiteUrl,
          admissionsUrl: candidate.admissionsUrl || candidate.websiteUrl,
          type: candidate.type,
          institutionType: candidate.institutionType,
          accreditationStatus: candidate.accreditationStatus,
          accreditationBody: candidate.accreditationBody,
          whedId: candidate.whedId,
          levelsOffered: candidate.qualificationsOffered,
          qualificationsOffered: candidate.qualificationsOffered,
          verificationStatus: 'VERIFIED',
          sourceRegistry: candidate.sourceRegistry,
          normalizedDomain: extractDomain(candidate.websiteUrl),
          provenance: `Approved by Super Admin from candidate queue (${candidate.sourceRegistry}).`,
          sourceUrl: candidate.sourceUrl,
          candidateId: candidate.id,
          lastVerifiedAt: new Date(),
        },
      });

      // Update candidate status
      await prisma.institutionCandidate.update({
        where: { id: candidate.id },
        data: {
          candidateStatus: 'APPROVED',
          reviewedBy: adminUserId,
          reviewedAt: new Date(),
          reviewNotes: reviewNotes || 'Approved into live directory.',
        },
      });

      // Record AuditLog
      await prisma.auditLog.create({
        data: {
          userId: adminUserId,
          action: 'INSTITUTION_CANDIDATE_APPROVED',
          entityType: 'UNIVERSITY',
          entityId: newUni.id,
          details: `Super Admin approved candidate "${candidate.name}" into directory.`,
        },
      });

      return { success: true, university: newUni, status: 'APPROVED' };
    } else if (action === 'REJECT') {
      await prisma.institutionCandidate.update({
        where: { id: candidate.id },
        data: {
          candidateStatus: 'REJECTED',
          reviewedBy: adminUserId,
          reviewedAt: new Date(),
          reviewNotes: reviewNotes || 'Rejected by Super Admin: does not meet accreditation standards.',
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: adminUserId,
          action: 'INSTITUTION_CANDIDATE_REJECTED',
          entityType: 'INSTITUTION_CANDIDATE',
          entityId: candidate.id,
          details: `Super Admin rejected candidate "${candidate.name}". Reason: ${reviewNotes || 'Unverified'}`,
        },
      });

      return { success: true, status: 'REJECTED' };
    } else if (action === 'RESOLVE_DUPLICATE') {
      await prisma.institutionCandidate.update({
        where: { id: candidate.id },
        data: {
          candidateStatus: 'DUPLICATE',
          reviewedBy: adminUserId,
          reviewedAt: new Date(),
          reviewNotes: reviewNotes || 'Resolved as duplicate/campus branch.',
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: adminUserId,
          action: 'INSTITUTION_CANDIDATE_RESOLVED_DUPLICATE',
          entityType: 'INSTITUTION_CANDIDATE',
          entityId: candidate.id,
          details: `Super Admin resolved candidate "${candidate.name}" as duplicate.`,
        },
      });

      return { success: true, status: 'DUPLICATE' };
    }

    throw new Error('Invalid review action.');
  }
}
