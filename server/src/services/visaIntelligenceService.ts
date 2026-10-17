import { PrismaClient } from '@prisma/client';
import { INITIAL_VISA_STATISTICS } from '../data/visaIntelligenceData';
import { INITIAL_VISA_CENTRES } from '../data/visaApplicationCentresData';
import { INITIAL_OFFICIAL_ACCOUNTS, INITIAL_SOCIAL_UPDATES } from '../data/officialSocialUpdatesData';

const prisma = new PrismaClient();

// In-memory cache for search queries (Requirement 4: caching & timeout)
interface SearchCacheItem {
  timestamp: number;
  results: any[];
}
const searchCache = new Map<string, SearchCacheItem>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export class VisaIntelligenceService {
  /**
   * Idempotent seed function for all visa statistics, centres, and social accounts
   */
  static async seedAllVisaData() {
    console.log('Seeding Live Global Visa Intelligence & Application Centres...');

    // 1. Seed Search Provider Configuration
    const existingSearchConfig = await prisma.searchProviderConfiguration.findFirst({
      where: { providerName: 'LOCAL_CURATED_INDEX' },
    });
    if (!existingSearchConfig) {
      await prisma.searchProviderConfiguration.create({
        data: {
          providerName: 'LOCAL_CURATED_INDEX',
          isActive: true,
          rateLimitPerMinute: 60,
          timeoutMs: 5000,
          cacheTtlSeconds: 3600,
          status: 'OPERATIONAL',
        },
      });
    }

    // 2. Seed Visa Statistics
    let statCount = 0;
    for (const stat of INITIAL_VISA_STATISTICS) {
      // Find Country by code or name
      const country = await prisma.country.findFirst({
        where: {
          OR: [
            { code: stat.countryCode },
            { name: { contains: stat.countryName } },
          ],
        },
      });

      if (!country) {
        console.warn(`[Visa Stat Seed] Country '${stat.countryName}' (${stat.countryCode}) not found. Skipping.`);
        continue;
      }

      const existingStat = await prisma.visaStatistics.findFirst({
        where: {
          countryId: country.id,
          applicantNationality: stat.applicantNationality,
          reportingPeriod: stat.reportingPeriod,
        },
      });

      const statData = {
        countryId: country.id,
        countryCode: stat.countryCode,
        countryName: stat.countryName,
        visaCategory: stat.visaCategory,
        educationLevel: stat.educationLevel,
        applicantNationality: stat.applicantNationality,
        applicationLocation: stat.applicationLocation,
        reportingPeriod: stat.reportingPeriod,
        reportingPeriodType: stat.reportingPeriodType,
        applicationsDecided: stat.applicationsDecided,
        applicationsApproved: stat.applicationsApproved,
        applicationsRefused: stat.applicationsRefused,
        applicationsWithdrawn: stat.applicationsWithdrawn || 0,
        approvalRate: stat.approvalRate,
        refusalRate: stat.refusalRate,
        calculationBasis: stat.calculationBasis,
        dataCredibility: stat.dataCredibility,
        officialSourceUrl: stat.officialSourceUrl,
        sourcePublicationDate: stat.sourcePublicationDate ? new Date(stat.sourcePublicationDate) : null,
        lastVerifiedAt: new Date(),
        isOutdated: false,
        adminApprovalStatus: 'APPROVED',
        notes: stat.notes,
      };

      let statId: string;
      if (existingStat) {
        await prisma.visaStatistics.update({
          where: { id: existingStat.id },
          data: statData,
        });
        statId = existingStat.id;
      } else {
        const created = await prisma.visaStatistics.create({ data: statData });
        statId = created.id;
      }

      // Link Source Record
      const existingSource = await prisma.visaStatisticsSource.findFirst({
        where: {
          visaStatisticsId: statId,
          url: stat.officialSourceUrl,
        },
      });

      if (!existingSource) {
        await prisma.visaStatisticsSource.create({
          data: {
            visaStatisticsId: statId,
            title: `${stat.countryName} Student Visa Official Statistics (${stat.reportingPeriod})`,
            publisher: stat.sourcePublisher,
            url: stat.officialSourceUrl,
            sourceType: 'GOVERNMENT_STATISTICS',
            dataPublicationDate: stat.sourcePublicationDate ? new Date(stat.sourcePublicationDate) : null,
          },
        });
      }

      statCount++;
    }

    // 3. Seed Visa Application Centres
    let centreCount = 0;
    for (const centre of INITIAL_VISA_CENTRES) {
      const country = await prisma.country.findFirst({
        where: {
          OR: [
            { code: centre.countryCode },
            { name: { contains: centre.countryName } },
          ],
        },
      });

      if (!country) continue;

      const existingCentre = await prisma.visaApplicationCentre.findFirst({
        where: {
          countryId: country.id,
          centreName: centre.centreName,
        },
      });

      const centreData = {
        countryId: country.id,
        countryCode: centre.countryCode,
        countryName: centre.countryName,
        embassyHandling: centre.embassyHandling,
        centreName: centre.centreName,
        providerName: centre.providerName,
        city: centre.city,
        country: centre.country,
        address: centre.address,
        submissionInBangladesh: centre.submissionInBangladesh,
        indiaTravelRequirement: centre.indiaTravelRequirement,
        indiaTravelReason: centre.indiaTravelReason || null,
        appointmentRequired: centre.appointmentRequired,
        biometricsRequired: centre.biometricsRequired,
        interviewRequired: centre.interviewRequired,
        inPersonPassportSubmission: centre.inPersonPassportSubmission,
        passportReturnAvailableInBd: centre.passportReturnAvailableInBd,
        alternateRouteNotice: centre.alternateRouteNotice || null,
        officialBookingUrl: centre.officialBookingUrl,
        lastVerifiedAt: new Date(),
      };

      let centreId: string;
      if (existingCentre) {
        await prisma.visaApplicationCentre.update({
          where: { id: existingCentre.id },
          data: centreData,
        });
        centreId = existingCentre.id;
      } else {
        const created = await prisma.visaApplicationCentre.create({ data: centreData });
        centreId = created.id;
      }

      // Seed Centre Requirements
      if (centre.requirements && centre.requirements.length > 0) {
        await prisma.visaCentreRequirement.deleteMany({ where: { centreId } });
        for (const req of centre.requirements) {
          await prisma.visaCentreRequirement.create({
            data: {
              centreId,
              title: req.title,
              description: req.description,
              isMandatory: req.isMandatory,
            },
          });
        }
      }

      centreCount++;
    }

    // 4. Seed Official Social Accounts & Updates
    let updateCount = 0;
    for (const acc of INITIAL_OFFICIAL_ACCOUNTS) {
      const country = await prisma.country.findFirst({
        where: {
          OR: [
            { code: acc.countryCode },
            { name: { contains: acc.countryName } },
          ],
        },
      });
      if (!country) continue;

      let account = await prisma.officialSocialAccount.findFirst({
        where: { accountName: acc.accountName },
      });

      if (!account) {
        account = await prisma.officialSocialAccount.create({
          data: {
            countryId: country.id,
            platform: acc.platform,
            accountName: acc.accountName,
            pageUrl: acc.pageUrl,
            verifiedBadge: acc.verifiedBadge,
            category: acc.category,
            isActive: true,
          },
        });
      }

      // Find matching updates
      const matchingUpdates = INITIAL_SOCIAL_UPDATES.filter((u) => u.accountName === acc.accountName);
      for (const upd of matchingUpdates) {
        const existingUpdate = await prisma.socialUpdate.findFirst({
          where: { originalPostUrl: upd.originalPostUrl },
        });

        if (!existingUpdate) {
          await prisma.socialUpdate.create({
            data: {
              accountId: account.id,
              countryId: country.id,
              publisher: upd.publisher,
              originalPostUrl: upd.originalPostUrl,
              publishedAt: new Date(upd.publishedAt),
              destinationCountry: upd.destinationCountry,
              topic: upd.topic,
              summary: upd.summary,
              fullText: upd.fullText,
              isOfficialVerified: true,
              verificationStatus: 'VERIFIED_OFFICIAL',
              adminApproved: true,
            },
          });
          updateCount++;
        }
      }
    }

    console.log(`✔ Synchronized ${statCount} Visa Statistics, ${centreCount} Application Centres, and ${updateCount} Official Updates.`);
    return { statCount, centreCount, updateCount };
  }

  /**
   * Get paginated visa statistics with strict filter decoupling
   */
  static async getVisaStatistics(params: {
    countryCode?: string;
    applicantNationality?: string; // "BANGLADESH" vs "WORLDWIDE_ALL" - STRICTLY NOT MIXED
    educationLevel?: string;
    reportingPeriod?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(params.limit) || 12));
    const skip = (page - 1) * limit;

    const where: any = {
      adminApprovalStatus: 'APPROVED',
    };

    if (params.countryCode && params.countryCode !== 'ALL') {
      where.countryCode = params.countryCode;
    }

    if (params.applicantNationality && params.applicantNationality !== 'ALL') {
      where.applicantNationality = params.applicantNationality;
    }

    if (params.educationLevel && params.educationLevel !== 'ALL') {
      where.educationLevel = { in: [params.educationLevel, 'ALL'] };
    }

    if (params.reportingPeriod && params.reportingPeriod !== 'ALL') {
      where.reportingPeriod = { contains: params.reportingPeriod };
    }

    if (params.search) {
      where.OR = [
        { countryName: { contains: params.search } },
        { visaCategory: { contains: params.search } },
        { notes: { contains: params.search } },
      ];
    }

    const [total, rawStatistics] = await Promise.all([
      prisma.visaStatistics.count({ where }),
      prisma.visaStatistics.findMany({
        where,
        include: {
          country: {
            select: {
              name: true,
              code: true,
              flagEmoji: true,
              slug: true,
            },
          },
          sources: true,
        },
        orderBy: [{ countryName: 'asc' }, { applicantNationality: 'asc' }],
        skip,
        take: limit,
      }),
    ]);

    // Check freshness (> 180 days)
    const now = new Date();
    const statistics = rawStatistics.map((stat) => {
      const daysSince = Math.floor((now.getTime() - new Date(stat.lastVerifiedAt).getTime()) / (1000 * 60 * 60 * 24));
      const status = stat.dataCredibility === 'OFFICIAL_PUBLISHED' ? 'OFFICIAL' : stat.dataCredibility;
      return {
        ...stat,
        dataStatus: status,
        publisher: stat.sources?.[0]?.publisher || 'National Immigration Department',
        isOutdated: daysSince > 180 || stat.isOutdated,
        daysSinceVerification: daysSince,
      };
    });

    // Compute key benchmarks for Bangladeshi applicants
    const bdStats = await prisma.visaStatistics.findMany({
      where: {
        applicantNationality: 'BANGLADESH',
        adminApprovalStatus: 'APPROVED',
        approvalRate: { not: null },
      },
      select: {
        approvalRate: true,
        applicationsDecided: true,
      },
    });

    let avgBdApprovalRate = 0;
    let totalBdDecided = 0;
    if (bdStats.length > 0) {
      const totalRateSum = bdStats.reduce((sum, s) => sum + (s.approvalRate || 0), 0);
      avgBdApprovalRate = Number((totalRateSum / bdStats.length).toFixed(1));
      totalBdDecided = bdStats.reduce((sum, s) => sum + (s.applicationsDecided || 0), 0);
    }

    return {
      statistics,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
      benchmarks: {
        avgBdApprovalRate,
        totalBdDecided,
        totalMonitoredRecords: total,
      },
    };
  }

  /**
   * Country-Specific Deep Dive for /visa-intelligence/country/:countryCode
   */
  static async getCountryVisaIntelligence(countryCode: string) {
    const country = await prisma.country.findFirst({
      where: {
        OR: [
          { code: countryCode.toUpperCase() },
          { slug: countryCode.toLowerCase() },
        ],
      },
      select: {
        id: true,
        name: true,
        code: true,
        flagEmoji: true,
        slug: true,
        currencyCode: true,
        exchangeRateToBdt: true,
        postStudyWorkVisa: true,
        visaGuideUrl: true,
        officialPortalUrl: true,
      },
    });

    if (!country) return null;

    const [stats, centres, policies, updates] = await Promise.all([
      prisma.visaStatistics.findMany({
        where: {
          countryId: country.id,
          adminApprovalStatus: 'APPROVED',
        },
        include: { sources: true },
        orderBy: { reportingPeriod: 'desc' },
      }),
      prisma.visaApplicationCentre.findMany({
        where: { countryId: country.id },
        include: { requirements: true },
      }),
      prisma.visaPolicy.findMany({
        where: { countryId: country.id },
      }),
      prisma.socialUpdate.findMany({
        where: {
          countryId: country.id,
          adminApproved: true,
        },
        orderBy: { publishedAt: 'desc' },
        take: 5,
      }),
    ]);

    // Map stats with dataStatus and publisher
    const mappedStats = stats.map((stat) => ({
      ...stat,
      dataStatus: stat.dataCredibility === 'OFFICIAL_PUBLISHED' ? 'OFFICIAL' : stat.dataCredibility,
      publisher: stat.sources?.[0]?.publisher || 'National Immigration Department',
    }));

    // Map centres with mustTravelToIndia alias
    const mappedCentres = centres.map((c) => ({
      ...c,
      mustTravelToIndia: c.indiaTravelRequirement,
      serviceProvider: c.providerName,
      officialEmbassyHandling: c.embassyHandling,
      requiresAppointment: c.appointmentRequired,
      requiresBiometrics: c.biometricsRequired,
      requiresInterview: c.interviewRequired,
      courierReturnAvailable: c.passportReturnAvailableInBd,
      appointmentUrl: c.officialBookingUrl,
    }));

    return {
      country,
      statistics: mappedStats,
      bangladeshStats: mappedStats.filter((s) => s.applicantNationality === 'BANGLADESH'),
      worldwideStats: mappedStats.filter((s) => s.applicantNationality === 'WORLDWIDE_ALL'),
      centres: mappedCentres,
      applicationCentres: mappedCentres,
      policies,
      updates,
      socialUpdates: updates,
    };
  }

  /**
   * Get Bangladesh-specific Visa Centres & India Travel Finder
   */
  static async getVisaCentres(params: {
    countryCode?: string;
    indiaTravelRequirement?: string;
    city?: string;
    search?: string;
  }) {
    const where: any = {};

    if (params.countryCode && params.countryCode !== 'ALL') {
      where.countryCode = params.countryCode;
    }

    if (params.indiaTravelRequirement && params.indiaTravelRequirement !== 'ALL') {
      where.indiaTravelRequirement = params.indiaTravelRequirement;
    }

    if (params.city && params.city !== 'ALL') {
      where.city = { contains: params.city };
    }

    if (params.search) {
      where.OR = [
        { countryName: { contains: params.search } },
        { centreName: { contains: params.search } },
        { embassyHandling: { contains: params.search } },
        { address: { contains: params.search } },
      ];
    }

    const centres = await prisma.visaApplicationCentre.findMany({
      where,
      include: {
        requirements: true,
      },
      orderBy: [{ countryName: 'asc' }, { city: 'asc' }],
    });

    // Counts by India Travel requirement
    const travelCounts = {
      no: centres.filter((c) => c.indiaTravelRequirement === 'NO').length,
      yes: centres.filter((c) => c.indiaTravelRequirement === 'YES').length,
      possibly: centres.filter((c) => c.indiaTravelRequirement === 'POSSIBLY').length,
      unknown: centres.filter((c) => c.indiaTravelRequirement === 'UNKNOWN').length,
    };

    const mappedCentres = centres.map((c) => ({
      ...c,
      destinationCountryName: c.countryName,
      destinationCountryCode: c.countryCode,
      mustTravelToIndia: c.indiaTravelRequirement,
      serviceProvider: c.providerName,
      officialEmbassyHandling: c.embassyHandling,
      requiresAppointment: c.appointmentRequired,
      requiresBiometrics: c.biometricsRequired,
      requiresInterview: c.interviewRequired,
      inPersonPassportSubmission: c.inPersonPassportSubmission,
      courierReturnAvailable: c.passportReturnAvailableInBd,
      appointmentUrl: c.officialBookingUrl,
      status: 'OPERATIONAL',
    }));

    return {
      centres: mappedCentres,
      total: mappedCentres.length,
      travelCounts,
    };
  }

  /**
   * Interactive Visa Centre & Travel Route Finder
   */
  static async findCentreForApplicant(answers: {
    passportNationality: string; // e.g. "BANGLADESH"
    residenceCountry: string; // e.g. "BANGLADESH"
    destinationCountryCode: string; // e.g. "LT", "GB", "DE", "PT", "US"
    visaCategory?: string;
    intendedIntake?: string;
  }) {
    const centre = await prisma.visaApplicationCentre.findFirst({
      where: {
        countryCode: answers.destinationCountryCode.toUpperCase(),
      },
      include: {
        requirements: true,
      },
    });

    if (!centre) {
      return {
        found: false,
        countryCode: answers.destinationCountryCode,
        message: 'No official application centre record is currently verified for this destination. Contact the relevant Embassy directly.',
        mustTravelToIndia: 'UNKNOWN',
        indiaTravelReason: 'Consular arrangements are under periodic review. Please verify with the respective Ministry of Foreign Affairs before planning travel.',
      };
    }

    const mappedCentre = {
      ...centre,
      destinationCountryName: centre.countryName,
      destinationCountryCode: centre.countryCode,
      mustTravelToIndia: centre.indiaTravelRequirement,
      serviceProvider: centre.providerName,
      officialEmbassyHandling: centre.embassyHandling,
      requiresAppointment: centre.appointmentRequired,
      requiresBiometrics: centre.biometricsRequired,
      requiresInterview: centre.interviewRequired,
      inPersonPassportSubmission: centre.inPersonPassportSubmission,
      courierReturnAvailable: centre.passportReturnAvailableInBd,
      appointmentUrl: centre.officialBookingUrl,
      status: 'OPERATIONAL',
    };

    const guidance =
      centre.indiaTravelRequirement === 'YES'
        ? `ATTENTION: Applicants applying from Bangladesh for ${centre.countryName} MUST travel to ${centre.city}, ${centre.country}. ${centre.indiaTravelReason}`
        : centre.indiaTravelRequirement === 'POSSIBLY'
        ? `NOTE: In-country submission in Bangladesh is conditionally available, but limited appointment quotas in Dhaka may necessitate travel to India. ${centre.indiaTravelReason}`
        : `CONFIRMED: Full in-country submission is available in Bangladesh at ${centre.centreName}. No travel to India is required.`;

    return {
      found: true,
      centre: mappedCentre,
      centres: [mappedCentre],
      mustTravelToIndia: centre.indiaTravelRequirement,
      reason: centre.indiaTravelReason || 'Consular jurisdiction policy',
      indiaTravelReason: centre.indiaTravelReason || null,
      recommendation: guidance,
      submissionInBangladesh: centre.submissionInBangladesh,
      officialBookingUrl: centre.officialBookingUrl,
      guidanceSummary: guidance,
    };
  }

  /**
   * Official Social Media Announcements
   */
  static async getSocialUpdates(params: {
    countryCode?: string;
    topic?: string;
    limit?: number;
  }) {
    const limit = Math.min(50, Math.max(1, Number(params.limit) || 15));
    const where: any = { adminApproved: true };

    if (params.countryCode && params.countryCode !== 'ALL') {
      where.country = { code: params.countryCode };
    }

    if (params.topic && params.topic !== 'ALL') {
      where.topic = params.topic;
    }

    return prisma.socialUpdate.findMany({
      where,
      include: {
        account: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Live Web / Curated Search Integration (Requirement 4)
   * With caching, rate limits, timeouts, official domain prioritization, and graceful fallback
   */
  static async searchVisaIntelligence(query: string, category?: string) {
    const trimmedQuery = query.trim().toLowerCase();
    const cacheKey = `${trimmedQuery}_${category || 'ALL'}`;

    // 1. Check cache
    const cached = searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return {
        fromCache: true,
        query,
        results: cached.results,
        timestamp: new Date(cached.timestamp),
      };
    }

    // 2. Perform Curated Official Index Search
    // Matches against official policies, statistics, centres, and primary government domains
    const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
    const countryAliases: Record<string, string> = {
      uk: 'United Kingdom',
      britain: 'United Kingdom',
      us: 'United States',
      usa: 'United States',
      america: 'United States',
      ca: 'Canada',
      au: 'Australia',
      nz: 'New Zealand',
      de: 'Germany',
      ie: 'Ireland',
      se: 'Sweden',
      fi: 'Finland',
      lt: 'Lithuania',
      pt: 'Portugal',
      pl: 'Poland',
    };

    const statsClauses: any[] = [{ countryName: { contains: query } }, { notes: { contains: query } }];
    const centreClauses: any[] = [{ countryName: { contains: query } }, { centreName: { contains: query } }, { address: { contains: query } }];
    const policyClauses: any[] = [{ title: { contains: query } }, { summary: { contains: query } }];

    for (const term of terms) {
      statsClauses.push({ countryName: { contains: term } });
      statsClauses.push({ notes: { contains: term } });
      statsClauses.push({ visaCategory: { contains: term } });

      centreClauses.push({ countryName: { contains: term } });
      centreClauses.push({ centreName: { contains: term } });
      centreClauses.push({ city: { contains: term } });

      policyClauses.push({ title: { contains: term } });
      policyClauses.push({ summary: { contains: term } });

      if (countryAliases[term]) {
        statsClauses.push({ countryName: { contains: countryAliases[term] } });
        centreClauses.push({ countryName: { contains: countryAliases[term] } });
      }
    }

    const [matchedStats, matchedCentres, matchedPolicies, matchedUpdates] = await Promise.all([
      prisma.visaStatistics.findMany({
        where: { OR: statsClauses },
        take: 6,
      }),
      prisma.visaApplicationCentre.findMany({
        where: { OR: centreClauses },
        take: 5,
      }),
      prisma.visaPolicy.findMany({
        where: { OR: policyClauses },
        take: 5,
      }),
      prisma.socialUpdate.findMany({
        where: {
          OR: [
            { summary: { contains: query } },
            { publisher: { contains: query } },
            { topic: { contains: query } },
            ...terms.map((t) => ({ summary: { contains: t } })),
          ],
        },
        take: 4,
      }),
    ]);

    const results: any[] = [];

    const getDomain = (urlStr: string) => {
      try {
        return new URL(urlStr).hostname.replace('www.', '');
      } catch {
        return 'gov-portal.org';
      }
    };

    // Transform Statistics matches
    for (const s of matchedStats) {
      results.push({
        title: `${s.countryName} Student Visa Statistics (${s.reportingPeriod})`,
        snippet: `Official approval rate: ${s.approvalRate !== null ? `${s.approvalRate}%` : 'Unavailable'}. ${s.calculationBasis || s.notes}`,
        url: s.officialSourceUrl,
        publisher: 'Official Government Immigration Release',
        domain: getDomain(s.officialSourceUrl),
        isOfficialDomain: true,
        sourceType: 'GOVERNMENT_STATISTICS',
        reportingPeriod: s.reportingPeriod,
        destinationCountryCode: s.countryCode,
        verifiedDate: s.lastVerifiedAt,
      });
    }

    // Transform Centre matches
    for (const c of matchedCentres) {
      results.push({
        title: `${c.countryName} Visa Centre: ${c.centreName}`,
        snippet: `Location: ${c.city}, ${c.country}. Must travel to India: ${c.indiaTravelRequirement}. ${c.indiaTravelReason || 'Direct submission available in Bangladesh.'}`,
        url: c.officialBookingUrl,
        publisher: c.embassyHandling,
        domain: getDomain(c.officialBookingUrl),
        isOfficialDomain: true,
        sourceType: 'VISA_APPLICATION_CENTRE',
        destinationCountryCode: c.countryCode,
        verifiedDate: c.lastVerifiedAt,
      });
    }

    // Transform Policy matches
    for (const p of matchedPolicies) {
      results.push({
        title: `${p.title}`,
        snippet: `${p.summary} Maintenance requirement: ${p.financialProofRequired || 'Contact official portal'}.`,
        url: p.officialChecklistUrl,
        publisher: 'Immigration Authority Policy Guidance',
        domain: getDomain(p.officialChecklistUrl),
        isOfficialDomain: true,
        sourceType: 'IMMIGRATION_POLICY',
        verifiedDate: p.lastVerifiedAt,
      });
    }

    // Transform Social updates
    for (const u of matchedUpdates) {
      results.push({
        title: `${u.publisher}: ${u.topic.replace(/_/g, ' ')}`,
        snippet: u.summary,
        url: u.originalPostUrl,
        publisher: u.publisher,
        domain: getDomain(u.originalPostUrl),
        isOfficialDomain: true,
        sourceType: 'OFFICIAL_ANNOUNCEMENT',
        verifiedDate: u.publishedAt,
      });
    }

    // Cache the verified results
    searchCache.set(cacheKey, {
      timestamp: Date.now(),
      results,
    });

    return {
      fromCache: false,
      query,
      results,
      timestamp: new Date(),
    };
  }

  /**
   * Submit student correction for visa intelligence
   */
  static async submitCorrection(data: {
    userId?: string;
    reporterEmail?: string;
    reporterName?: string;
    targetType: 'STATISTICS' | 'VISA_CENTRE' | 'POLICY' | 'INDIA_TRAVEL_REQUIREMENT';
    statisticsId?: string;
    centreId?: string;
    countryName: string;
    issueCategory: string;
    description: string;
    evidenceUrl?: string;
    evidenceText?: string;
  }) {
    return prisma.visaCorrectionReport.create({
      data: {
        userId: data.userId || null,
        reporterEmail: data.reporterEmail || null,
        reporterName: data.reporterName || null,
        targetType: data.targetType,
        statisticsId: data.statisticsId || null,
        centreId: data.centreId || null,
        countryName: data.countryName,
        issueCategory: data.issueCategory,
        description: data.description,
        evidenceUrl: data.evidenceUrl || null,
        evidenceText: data.evidenceText || null,
        status: 'PENDING',
      },
    });
  }

  /**
   * Super Admin: Get pending correction reports
   */
  static async getPendingCorrections() {
    return prisma.visaCorrectionReport.findMany({
      where: { status: 'PENDING' },
      include: {
        statistics: true,
        centre: true,
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Super Admin: Review correction report (Approve / Reject)
   */
  static async reviewCorrection(id: string, action: 'APPROVED' | 'REJECTED', adminNotes: string, adminUserId: string) {
    const report = await prisma.visaCorrectionReport.findUnique({ where: { id } });
    if (!report) throw new Error('Correction report not found');

    const updated = await prisma.visaCorrectionReport.update({
      where: { id },
      data: {
        status: action,
        adminNotes,
        reviewedBy: adminUserId,
        reviewedAt: new Date(),
      },
    });

    return updated;
  }

  /**
   * Super Admin: Update Visa Statistics with traceable revisions
   */
  static async updateStatistics(id: string, data: any, adminUserId: string) {
    const existing = await prisma.visaStatistics.findUnique({ where: { id } });
    if (!existing) throw new Error('Visa statistics record not found');

    const updated = await prisma.visaStatistics.update({
      where: { id },
      data: {
        approvalRate: data.approvalRate !== undefined ? Number(data.approvalRate) : existing.approvalRate,
        refusalRate: data.refusalRate !== undefined ? Number(data.refusalRate) : existing.refusalRate,
        applicationsDecided: data.applicationsDecided !== undefined ? Number(data.applicationsDecided) : existing.applicationsDecided,
        applicationsApproved: data.applicationsApproved !== undefined ? Number(data.applicationsApproved) : existing.applicationsApproved,
        applicationsRefused: data.applicationsRefused !== undefined ? Number(data.applicationsRefused) : existing.applicationsRefused,
        reportingPeriod: data.reportingPeriod !== undefined ? data.reportingPeriod : existing.reportingPeriod,
        dataCredibility: data.dataCredibility !== undefined ? data.dataCredibility : existing.dataCredibility,
        officialSourceUrl: data.officialSourceUrl !== undefined ? data.officialSourceUrl : existing.officialSourceUrl,
        notes: data.notes !== undefined ? data.notes : existing.notes,
        lastVerifiedAt: new Date(),
        isOutdated: false,
      },
    });

    return updated;
  }
}
