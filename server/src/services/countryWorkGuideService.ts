// Borno Higher Study — Country Work Guide Service
// Database-backed business logic for Global Country Comparison, Minimum Wages,
// Student Work Regulations, Post-Study Work Routes, Career Roadmaps, and Admin Verification.

import { PrismaClient } from '@prisma/client';
import { COUNTRY_WORK_GUIDE_DATA, CountryWorkGuideItem } from '../data/countryWorkGuideData.js';
import { MINIMUM_WAGE_DATASET } from '../data/minimumWageData.js';
import { STUDENT_WORK_HOURS_DATASET } from '../data/studentWorkHoursData.js';
import { POST_STUDY_WORK_DATASET } from '../data/postStudyWorkData.js';

const prisma = new PrismaClient();

export interface StudentPlannerInput {
  degreeLevel: 'BACHELORS' | 'MASTERS' | 'DOCTORATE';
  subjectArea?: string;
  preferredStudyLanguage?: string;
  languagesSpoken?: string[];
  annualTuitionBudgetUsd?: number;
  priority?: 'MINIMUM_WAGE' | 'MAX_WORK_HOURS' | 'POST_STUDY_DURATION' | 'PR_PATHWAY' | 'LOW_TUITION';
  preferredDestinations?: string[];
  interestInInternships?: boolean;
}

export class CountryWorkGuideService {
  /**
   * Dataset 1: Independent Seeding of Minimum Wage Policies (All 42 countries)
   */
  async seedMinimumWages(): Promise<{ seeded: number }> {
    console.log('[CountryWorkGuideService] Seeding Dataset 1: Minimum Wage Policies (42 countries)...');
    let seeded = 0;
    for (const item of MINIMUM_WAGE_DATASET) {
      const country = await prisma.country.findFirst({
        where: {
          OR: [{ code: item.countryCode }, { slug: item.countryCode.toLowerCase() }],
        },
      });
      if (!country) continue;
      const countryId = country.id;

      const existingWagePolicy = await prisma.minimumWagePolicy.findFirst({
        where: { countryId },
      });

      const wagePolicy = existingWagePolicy
        ? await prisma.minimumWagePolicy.update({
            where: { id: existingWagePolicy.id },
            data: {
              policyType: item.policyType,
              hasStatutoryMinimum: item.hasStatutoryMinimum,
              governingBody: item.governingBody,
              legislationName: item.legislationName,
              overview: item.overview,
              collectiveBargainingNote: item.collectiveBargainingNote,
              sourceUrl: item.sourceUrl,
              verificationStatus: item.verificationStatus,
            },
          })
        : await prisma.minimumWagePolicy.create({
            data: {
              countryId,
              policyType: item.policyType,
              hasStatutoryMinimum: item.hasStatutoryMinimum,
              governingBody: item.governingBody,
              legislationName: item.legislationName,
              overview: item.overview,
              collectiveBargainingNote: item.collectiveBargainingNote,
              sourceUrl: item.sourceUrl,
              verificationStatus: item.verificationStatus,
            },
          });

      // Upsert jurisdictions if present
      const jurisdictionMap: Record<string, string> = {};
      if (item.jurisdictions) {
        for (const jur of item.jurisdictions) {
          const existingJur = await prisma.wageJurisdiction.findFirst({
            where: { countryId, name: jur.name },
          });
          const createdJur = existingJur
            ? await prisma.wageJurisdiction.update({
                where: { id: existingJur.id },
                data: {
                  jurisdictionType: jur.jurisdictionType,
                  description: jur.description,
                },
              })
            : await prisma.wageJurisdiction.create({
                data: {
                  countryId,
                  name: jur.name,
                  jurisdictionType: jur.jurisdictionType,
                  description: jur.description,
                },
              });
          jurisdictionMap[jur.name] = createdJur.id;
        }
      }

      // Upsert rates
      for (const rate of item.rates) {
        const jurisdictionId = rate.jurisdictionName ? jurisdictionMap[rate.jurisdictionName] || null : null;
        const existingRate = await prisma.minimumWageRate.findFirst({
          where: {
            policyId: wagePolicy.id,
            rateUnit: rate.rateUnit,
            rateType: rate.rateType,
            jurisdictionId: jurisdictionId,
          },
        });

        if (existingRate) {
          await prisma.minimumWageRate.update({
            where: { id: existingRate.id },
            data: {
              amount: rate.amount,
              currencyCode: rate.currencyCode,
              currencySymbol: rate.currencySymbol,
              effectiveDate: new Date(rate.effectiveDate),
              endDate: rate.endDate ? new Date(rate.endDate) : null,
              isCurrent: rate.isCurrent,
              rateType: rate.rateType,
              ageCategory: rate.ageCategory,
              apprenticeException: rate.apprenticeException,
              industryExceptions: rate.industryExceptions,
              estimatedBdtHourly: rate.estimatedBdtHourly,
              bdtExchangeRateUsed: rate.bdtExchangeRateUsed,
              exchangeRateProvider: rate.exchangeRateProvider,
              rateNotes: rate.rateNotes,
              officialSourceUrl: rate.officialSourceUrl,
              verificationStatus: rate.verificationStatus,
            },
          });
        } else {
          await prisma.minimumWageRate.create({
            data: {
              policyId: wagePolicy.id,
              jurisdictionId,
              rateUnit: rate.rateUnit,
              amount: rate.amount,
              currencyCode: rate.currencyCode,
              currencySymbol: rate.currencySymbol,
              effectiveDate: new Date(rate.effectiveDate),
              endDate: rate.endDate ? new Date(rate.endDate) : null,
              isCurrent: rate.isCurrent,
              rateType: rate.rateType,
              ageCategory: rate.ageCategory,
              apprenticeException: rate.apprenticeException,
              industryExceptions: rate.industryExceptions,
              estimatedBdtHourly: rate.estimatedBdtHourly,
              bdtExchangeRateUsed: rate.bdtExchangeRateUsed,
              exchangeRateProvider: rate.exchangeRateProvider,
              rateNotes: rate.rateNotes,
              officialSourceUrl: rate.officialSourceUrl,
              verificationStatus: rate.verificationStatus,
            },
          });
        }
      }
      seeded++;
    }
    console.log(`[CountryWorkGuideService] Dataset 1: ${seeded} Minimum Wage policies synchronized.`);
    return { seeded };
  }

  /**
   * Dataset 2: Independent Seeding of Legal Student Work Hours & Regulations (All 42 countries)
   */
  async seedStudentWorkHours(): Promise<{ seeded: number }> {
    console.log('[CountryWorkGuideService] Seeding Dataset 2: Legal Student Work Hours (42 countries)...');
    let seeded = 0;
    for (const item of STUDENT_WORK_HOURS_DATASET) {
      const country = await prisma.country.findFirst({
        where: {
          OR: [{ code: item.countryCode }, { slug: item.countryCode.toLowerCase() }],
        },
      });
      if (!country) continue;
      const countryId = country.id;

      const existingStudentWork = await prisma.studentWorkPolicy.findFirst({
        where: { countryId },
      });

      const studentWork = existingStudentWork
        ? await prisma.studentWorkPolicy.update({
            where: { id: existingStudentWork.id },
            data: {
              eligibilityStatus: item.eligibilityStatus,
              termTimeLimitHours: item.termTimeLimitHours,
              termTimeUnit: item.termTimeUnit,
              termTimeRuleText: item.termTimeRuleText,
              holidayLimitHours: item.holidayLimitHours,
              holidayTimeUnit: item.holidayTimeUnit,
              holidayRuleText: item.holidayRuleText,
              onCampusRules: item.onCampusRules,
              offCampusRules: item.offCampusRules,
              selfEmploymentAllowed: item.selfEmploymentAllowed,
              selfEmploymentRules: item.selfEmploymentRules,
              internshipRules: item.internshipRules,
              assistantshipRules: item.assistantshipRules,
              canWorkBeforeCourseStarts: item.canWorkBeforeCourseStarts,
              postCompletionRules: item.postCompletionRules,
              visaConditionPrecedenceNote: item.visaConditionPrecedenceNote,
              sourceUrl: item.sourceUrl,
              verificationStatus: item.verificationStatus,
            },
          })
        : await prisma.studentWorkPolicy.create({
            data: {
              countryId,
              eligibilityStatus: item.eligibilityStatus,
              termTimeLimitHours: item.termTimeLimitHours,
              termTimeUnit: item.termTimeUnit,
              termTimeRuleText: item.termTimeRuleText,
              holidayLimitHours: item.holidayLimitHours,
              holidayTimeUnit: item.holidayTimeUnit,
              holidayRuleText: item.holidayRuleText,
              onCampusRules: item.onCampusRules,
              offCampusRules: item.offCampusRules,
              selfEmploymentAllowed: item.selfEmploymentAllowed,
              selfEmploymentRules: item.selfEmploymentRules,
              internshipRules: item.internshipRules,
              assistantshipRules: item.assistantshipRules,
              canWorkBeforeCourseStarts: item.canWorkBeforeCourseStarts,
              postCompletionRules: item.postCompletionRules,
              visaConditionPrecedenceNote: item.visaConditionPrecedenceNote,
              sourceUrl: item.sourceUrl,
              verificationStatus: item.verificationStatus,
            },
          });

      // Upsert exceptions
      if (item.exceptions) {
        for (const exc of item.exceptions) {
          const existingExc = await prisma.studentWorkException.findFirst({
            where: { policyId: studentWork.id, category: exc.category },
          });
          if (existingExc) {
            await prisma.studentWorkException.update({
              where: { id: existingExc.id },
              data: {
                description: exc.description,
                allowedHours: exc.allowedHours,
                timeUnit: exc.timeUnit,
              },
            });
          } else {
            await prisma.studentWorkException.create({
              data: {
                policyId: studentWork.id,
                category: exc.category,
                description: exc.description,
                allowedHours: exc.allowedHours,
                timeUnit: exc.timeUnit,
              },
            });
          }
        }
      }

      // Upsert authorizations
      if (item.authorizations) {
        for (const auth of item.authorizations) {
          const existingAuth = await prisma.studentWorkAuthorization.findFirst({
            where: { policyId: studentWork.id, authorizationType: auth.authorizationType },
          });
          if (existingAuth) {
            await prisma.studentWorkAuthorization.update({
              where: { id: existingAuth.id },
              data: {
                authorityName: auth.authorityName,
                procedureDescription: auth.procedureDescription,
                processingTimeDays: auth.processingTimeDays,
                officialFormUrl: auth.officialFormUrl,
              },
            });
          } else {
            await prisma.studentWorkAuthorization.create({
              data: {
                policyId: studentWork.id,
                authorizationType: auth.authorizationType,
                authorityName: auth.authorityName,
                procedureDescription: auth.procedureDescription,
                processingTimeDays: auth.processingTimeDays,
                officialFormUrl: auth.officialFormUrl,
              },
            });
          }
        }
      }
      seeded++;
    }
    console.log(`[CountryWorkGuideService] Dataset 2: ${seeded} Student Work policies synchronized.`);
    return { seeded };
  }

  /**
   * Dataset 3: Independent Seeding of Post-Study Work Routes & Graduate Visas (All 42 countries)
   */
  async seedPostStudyWork(): Promise<{ seeded: number }> {
    console.log('[CountryWorkGuideService] Seeding Dataset 3: Post-Study Work Routes (42 countries)...');
    let seeded = 0;
    for (const item of POST_STUDY_WORK_DATASET) {
      const country = await prisma.country.findFirst({
        where: {
          OR: [{ code: item.countryCode }, { slug: item.countryCode.toLowerCase() }],
        },
      });
      if (!country) continue;
      const countryId = country.id;

      const existingRoute = await prisma.postStudyWorkRoute.findFirst({
        where: { countryId, routeName: item.routeName },
      });

      const durationNotes = item.workRightsScope || `Permit duration ranges from ${item.durationMonthsMin} to ${item.durationMonthsMax} months based on qualification.`;
      const applicationDeadlineDescription = item.applicationDeadlineDaysAfterGraduation
        ? `Application must be lodged within ${item.applicationDeadlineDaysAfterGraduation} days of formal course completion.`
        : 'Must apply prior to expiration of student immigration status.';

      const createdRoute = existingRoute
        ? await prisma.postStudyWorkRoute.update({
            where: { id: existingRoute.id },
            data: {
              routeCode: item.officialVisaSubclass,
              durationMonthsMin: item.durationMonthsMin,
              durationMonthsMax: item.durationMonthsMax,
              durationNotes,
              jobOfferRequired: item.jobOfferRequired,
              leadsToPermanentResidence: item.leadsToPermanentResidence,
              prPathwayDetails: item.prTransitionPathway,
              isExtensionPossible: item.renewalAllowed,
              applicationDeadlineDays: item.applicationDeadlineDaysAfterGraduation,
              applicationDeadlineDescription,
              applicationFeeAmount: item.officialApplicationFee,
              applicationFeeCurrency: item.applicationFeeCurrency,
              governmentApplicationUrl: item.sourceUrl,
              verificationStatus: item.verificationStatus,
            },
          })
        : await prisma.postStudyWorkRoute.create({
            data: {
              countryId,
              routeName: item.routeName,
              routeCode: item.officialVisaSubclass,
              durationMonthsMin: item.durationMonthsMin,
              durationMonthsMax: item.durationMonthsMax,
              durationNotes,
              jobOfferRequired: item.jobOfferRequired,
              leadsToPermanentResidence: item.leadsToPermanentResidence,
              prPathwayDetails: item.prTransitionPathway,
              isExtensionPossible: item.renewalAllowed,
              applicationDeadlineDays: item.applicationDeadlineDaysAfterGraduation,
              applicationDeadlineDescription,
              applicationFeeAmount: item.officialApplicationFee,
              applicationFeeCurrency: item.applicationFeeCurrency,
              governmentApplicationUrl: item.sourceUrl,
              verificationStatus: item.verificationStatus,
            },
          });

      if (item.eligibilityRules) {
        for (const rule of item.eligibilityRules) {
          const existingRule = await prisma.graduateEligibilityRule.findFirst({
            where: { routeId: createdRoute.id, qualificationLevel: rule.qualificationLevel },
          });
          const institutionCriteria = 'Accredited Higher Education Institution';
          const description = rule.notes || `Eligibility criteria for ${rule.qualificationLevel} level degree qualification.`;
          const studyDurationRequirement = rule.studyDurationRequirement || 'Full-time study completion';

          if (existingRule) {
            await prisma.graduateEligibilityRule.update({
              where: { id: existingRule.id },
              data: {
                institutionCriteria,
                studyDurationRequirement,
                description,
              },
            });
          } else {
            await prisma.graduateEligibilityRule.create({
              data: {
                routeId: createdRoute.id,
                qualificationLevel: rule.qualificationLevel,
                institutionCriteria,
                studyDurationRequirement,
                description,
              },
            });
          }
        }
      }
      seeded++;
    }
    console.log(`[CountryWorkGuideService] Dataset 3: ${seeded} Post-Study Work routes synchronized.`);
    return { seeded };
  }

  /**
   * Seeding Languages, Sectors, Roadmaps, and Sources
   */
  async seedLanguagesAndRoadmaps(): Promise<void> {
    console.log('[CountryWorkGuideService] Synchronizing language profiles, career sectors, roadmaps, and official sources...');
    for (const item of COUNTRY_WORK_GUIDE_DATA) {
      const country = await prisma.country.findFirst({
        where: {
          OR: [{ code: item.countryCode }, { slug: item.countryCode.toLowerCase() }],
        },
      });
      if (!country) continue;
      const countryId = country.id;

      // 1. Languages
      for (const lang of item.languages) {
        const existingLang = await prisma.countryLanguage.findFirst({
          where: { countryId, languageCode: lang.languageCode },
        });

        const createdLang = existingLang
          ? await prisma.countryLanguage.update({
              where: { id: existingLang.id },
              data: {
                languageName: lang.languageName,
                isOfficial: lang.isOfficial,
                isNational: lang.isNational,
                isRegional: lang.isRegional,
                isWidelySpoken: lang.isWidelySpoken,
                higherEdUsage: lang.higherEdUsage,
                jobMarketUsage: lang.jobMarketUsage,
                notes: lang.notes,
              },
            })
          : await prisma.countryLanguage.create({
              data: {
                countryId,
                languageName: lang.languageName,
                languageCode: lang.languageCode,
                isOfficial: lang.isOfficial,
                isNational: lang.isNational,
                isRegional: lang.isRegional,
                isWidelySpoken: lang.isWidelySpoken,
                higherEdUsage: lang.higherEdUsage,
                jobMarketUsage: lang.jobMarketUsage,
                notes: lang.notes,
              },
            });

        if (lang.usages && lang.usages.length > 0) {
          for (const usage of lang.usages) {
            const existingUsage = await prisma.languageUsage.findFirst({
              where: {
                countryLanguageId: createdLang.id,
                contextType: usage.contextType,
              },
            });
            if (!existingUsage) {
              await prisma.languageUsage.create({
                data: {
                  countryLanguageId: createdLang.id,
                  contextType: usage.contextType,
                  proficiencyRequired: usage.proficiencyRequired,
                  description: usage.description,
                  exceptions: usage.exceptions,
                },
              });
            }
          }
        }
      }

      // 2. Career Sectors & Occupations
      for (const sector of item.careerSectors) {
        const existingSector = await prisma.careerSector.findFirst({
          where: { countryId, slug: sector.slug },
        });

        const createdSector = existingSector
          ? await prisma.careerSector.update({
              where: { id: existingSector.id },
              data: {
                name: sector.name,
                overview: sector.overview,
                demandStatus: sector.demandStatus,
                shortageListOfficial: sector.shortageListOfficial,
                shortageSourceDate: sector.shortageSourceDate ? new Date(sector.shortageSourceDate) : null,
                averageSalaryMin: sector.averageSalaryMin,
                averageSalaryMax: sector.averageSalaryMax,
                salaryCurrency: sector.salaryCurrency,
                officialPortalName: sector.officialPortalName,
                officialPortalUrl: sector.officialPortalUrl,
              },
            })
          : await prisma.careerSector.create({
              data: {
                countryId,
                name: sector.name,
                slug: sector.slug,
                overview: sector.overview,
                demandStatus: sector.demandStatus,
                shortageListOfficial: sector.shortageListOfficial,
                shortageSourceDate: sector.shortageSourceDate ? new Date(sector.shortageSourceDate) : null,
                averageSalaryMin: sector.averageSalaryMin,
                averageSalaryMax: sector.averageSalaryMax,
                salaryCurrency: sector.salaryCurrency,
                officialPortalName: sector.officialPortalName,
                officialPortalUrl: sector.officialPortalUrl,
              },
            });

        for (const occ of sector.occupations) {
          const existingOcc = await prisma.occupationProfile.findFirst({
            where: { sectorId: createdSector.id, title: occ.title },
          });
          if (!existingOcc) {
            await prisma.occupationProfile.create({
              data: {
                sectorId: createdSector.id,
                title: occ.title,
                code: occ.code,
                isRegulated: occ.isRegulated,
                regulatorBody: occ.regulatorBody,
                licensingRequirements: occ.licensingRequirements,
                entryQualification: occ.entryQualification,
                languageProficiency: occ.languageProficiency,
                typicalStartingSalary: occ.typicalStartingSalary,
                salarySource: occ.salarySource,
                jobOutlook: occ.jobOutlook,
                exampleEmployers: occ.exampleEmployers ? JSON.stringify(occ.exampleEmployers) : null,
              },
            });
          }
        }
      }

      // 3. Career Roadmaps & Steps
      for (const roadmap of item.careerRoadmaps) {
        const existingRoadmap = await prisma.careerRoadmap.findFirst({
          where: { countryId, title: roadmap.title },
        });

        const createdRoadmap = existingRoadmap
          ? await prisma.careerRoadmap.update({
              where: { id: existingRoadmap.id },
              data: {
                targetAudience: roadmap.targetAudience,
                summary: roadmap.summary,
                disclaimer: roadmap.disclaimer || undefined,
              },
            })
          : await prisma.careerRoadmap.create({
              data: {
                countryId,
                title: roadmap.title,
                targetAudience: roadmap.targetAudience,
                summary: roadmap.summary,
                disclaimer: roadmap.disclaimer || undefined,
              },
            });

        for (const step of roadmap.steps) {
          const existingStep = await prisma.careerRoadmapStep.findFirst({
            where: { roadmapId: createdRoadmap.id, stageCode: step.stageCode },
          });
          if (existingStep) {
            await prisma.careerRoadmapStep.update({
              where: { id: existingStep.id },
              data: {
                stageTitle: step.stageTitle,
                timelineDescription: step.timelineDescription,
                stepOrder: step.stepOrder,
                actionItems: JSON.stringify(step.actionItems),
                criticalRules: step.criticalRules || null,
                keyResources: step.keyResources ? JSON.stringify(step.keyResources) : null,
              },
            });
          } else {
            await prisma.careerRoadmapStep.create({
              data: {
                roadmapId: createdRoadmap.id,
                stageCode: step.stageCode,
                stageTitle: step.stageTitle,
                timelineDescription: step.timelineDescription,
                stepOrder: step.stepOrder,
                actionItems: JSON.stringify(step.actionItems),
                criticalRules: step.criticalRules || null,
                keyResources: step.keyResources ? JSON.stringify(step.keyResources) : null,
              },
            });
          }
        }
      }

      // 4. Official Sources
      for (const src of item.officialSources) {
        const existingSrc = await prisma.countryOfficialSource.findFirst({
          where: { countryId, sourceUrl: src.sourceUrl },
        });
        if (existingSrc) {
          await prisma.countryOfficialSource.update({
            where: { id: existingSrc.id },
            data: {
              authorityName: src.authorityName,
              category: src.category,
              sourceTitle: src.sourceTitle,
              retrievalDate: new Date(src.retrievalDate),
              policyEffectiveDate: src.policyEffectiveDate ? new Date(src.policyEffectiveDate) : null,
              status: src.status,
              notes: src.notes,
            },
          });
        } else {
          await prisma.countryOfficialSource.create({
            data: {
              countryId,
              authorityName: src.authorityName,
              category: src.category,
              sourceTitle: src.sourceTitle,
              sourceUrl: src.sourceUrl,
              retrievalDate: new Date(src.retrievalDate),
              policyEffectiveDate: src.policyEffectiveDate ? new Date(src.policyEffectiveDate) : null,
              status: src.status,
              notes: src.notes,
            },
          });
        }
      }
    }
  }

  /**
   * Orchestrates synchronization across all 3 independent datasets
   */
  async seedAllCountryWorkDatasets(): Promise<{ mwCount: number; swCount: number; pswCount: number }> {
    console.log('[CountryWorkGuideService] Synchronizing 3 independent datasets for all 42 countries...');
    const mw = await this.seedMinimumWages();
    const sw = await this.seedStudentWorkHours();
    const psw = await this.seedPostStudyWork();
    await this.seedLanguagesAndRoadmaps();
    return { mwCount: mw.seeded, swCount: sw.seeded, pswCount: psw.seeded };
  }

  /**
   * Backward-compatible entrypoint
   */
  async seedCountryWorkGuideData() {
    return this.seedAllCountryWorkDatasets();
  }

  /**
   * 1. Get Global Overview & Country Work Directory
   */
  async getGlobalOverview(filters: {
    search?: string;
    continent?: string;
    policyType?: string;
    studentWorkStatus?: string;
    hasPostStudyRoute?: boolean;
  }) {
    await this.ensureSeeded();

    const countries = await prisma.country.findMany({
      where: {
        AND: [
          filters.search
            ? {
                OR: [
                  { name: { contains: filters.search } },
                  { code: { contains: filters.search } },
                  { capitalCity: { contains: filters.search } },
                ],
              }
            : {},
          filters.continent ? { continent: filters.continent } : {},
        ],
      },
      include: {
        countryLanguages: true,
        minimumWagePolicies: {
          include: {
            rates: {
              where: { isCurrent: true },
            },
          },
        },
        studentWorkPolicies: true,
        postStudyWorkRoutes: true,
        officialSources: {
          take: 3,
        },
      },
      orderBy: { name: 'asc' },
    });

    return countries.map((c) => {
      const wagePolicy = c.minimumWagePolicies[0] || null;
      const studentWork = c.studentWorkPolicies[0] || null;
      const primaryRate = wagePolicy?.rates?.find((r) => r.rateType === 'STATUTORY') || wagePolicy?.rates?.[0] || null;
      const postStudyRoute = c.postStudyWorkRoutes[0] || null;

      return {
        id: c.id,
        name: c.name,
        code: c.code,
        slug: c.slug,
        flagEmoji: c.flagEmoji,
        continent: c.continent,
        region: c.region,
        capitalCity: c.capitalCity,
        currencyCode: c.currencyCode,
        currencySymbol: c.currencySymbol,
        exchangeRateToBdt: c.exchangeRateToBdt,
        avgLivingCostMonthly: c.avgLivingCostMonthly,
        officialLanguages: c.countryLanguages.filter((l) => l.isOfficial).map((l) => l.languageName),
        widelySpokenLanguages: c.countryLanguages.filter((l) => l.isWidelySpoken).map((l) => l.languageName),
        wagePolicy: wagePolicy
          ? {
              policyType: wagePolicy.policyType,
              hasStatutoryMinimum: wagePolicy.hasStatutoryMinimum,
              governingBody: wagePolicy.governingBody,
              overview: wagePolicy.overview,
              primaryRate: primaryRate
                ? {
                    amount: primaryRate.amount,
                    currencySymbol: primaryRate.currencySymbol,
                    currencyCode: primaryRate.currencyCode,
                    rateUnit: primaryRate.rateUnit,
                    estimatedBdtHourly: primaryRate.estimatedBdtHourly,
                  }
                : null,
              verificationStatus: wagePolicy.verificationStatus,
            }
          : null,
        studentWork: studentWork
          ? {
              eligibilityStatus: studentWork.eligibilityStatus,
              termTimeRuleText: studentWork.termTimeRuleText,
              holidayRuleText: studentWork.holidayRuleText,
              selfEmploymentAllowed: studentWork.selfEmploymentAllowed,
              sourceUrl: studentWork.sourceUrl,
              verificationStatus: studentWork.verificationStatus,
            }
          : null,
        postStudyWork: postStudyRoute
          ? {
              routeName: postStudyRoute.routeName,
              durationMonthsMax: postStudyRoute.durationMonthsMax,
              jobOfferRequired: postStudyRoute.jobOfferRequired,
              leadsToPermanentResidence: postStudyRoute.leadsToPermanentResidence,
            }
          : null,
        officialSourceCount: c.officialSources.length,
        lastVerifiedAt: c.lastVerifiedAt,
      };
    });
  }

  /**
   * 2. Get Detailed Country Work Profile by Code or Slug
   */
  async getCountryWorkProfile(codeOrSlug: string) {
    await this.ensureSeeded();

    const country = await prisma.country.findFirst({
      where: {
        OR: [
          { code: codeOrSlug.toUpperCase() },
          { slug: codeOrSlug.toLowerCase() },
          { id: codeOrSlug },
        ],
      },
      include: {
        countryLanguages: {
          include: { usages: true },
        },
        wageJurisdictions: true,
        minimumWagePolicies: {
          include: {
            rates: {
              include: { jurisdiction: true },
              orderBy: { amount: 'desc' },
            },
          },
        },
        studentWorkPolicies: {
          include: {
            exceptions: true,
            authorizations: true,
          },
        },
        postStudyWorkRoutes: {
          include: {
            eligibilityRules: true,
          },
        },
        careerSectors: {
          include: {
            occupations: true,
          },
        },
        careerRoadmaps: {
          include: {
            steps: {
              orderBy: { stepOrder: 'asc' },
            },
          },
        },
        officialSources: {
          orderBy: { retrievalDate: 'desc' },
        },
        policyVerifications: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        policyRevisions: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!country) return null;

    return {
      ...country,
      majorCitiesParsed: JSON.parse(country.majorCities || '[]'),
      languagesParsed: JSON.parse(country.languages || '[]'),
      careerRoadmaps: country.careerRoadmaps.map((r) => ({
        ...r,
        steps: r.steps.map((s) => ({
          ...s,
          actionItems: JSON.parse(s.actionItems || '[]'),
          keyResources: s.keyResources ? JSON.parse(s.keyResources) : [],
        })),
      })),
      careerSectors: country.careerSectors.map((sec) => ({
        ...sec,
        occupations: sec.occupations.map((occ) => ({
          ...occ,
          exampleEmployers: occ.exampleEmployers ? JSON.parse(occ.exampleEmployers) : [],
        })),
      })),
    };
  }

  /**
   * 3. Multi-Country Side-by-Side Comparison
   */
  async getSideBySideComparison(countryCodes: string[]) {
    await this.ensureSeeded();

    const upperCodes = countryCodes.map((c) => c.toUpperCase());
    const profiles = await Promise.all(
      upperCodes.map((code) => this.getCountryWorkProfile(code))
    );

    return profiles.filter((p) => p !== null);
  }

  /**
   * 4. Minimum Wage Database
   */
  async getMinimumWageDirectory(filter?: { policyType?: string; hasStatutory?: boolean }) {
    await this.ensureSeeded();

    const policies = await prisma.minimumWagePolicy.findMany({
      where: {
        AND: [
          filter?.policyType ? { policyType: filter.policyType } : {},
          filter?.hasStatutory !== undefined ? { hasStatutoryMinimum: filter.hasStatutory } : {},
        ],
      },
      include: {
        country: true,
        rates: {
          include: { jurisdiction: true },
        },
      },
      orderBy: { country: { name: 'asc' } },
    });

    return policies;
  }

  /**
   * 5. International Student Work Rules Database
   */
  async getStudentWorkRulesDirectory(filter?: { eligibilityStatus?: string; selfEmployment?: boolean }) {
    await this.ensureSeeded();

    const rules = await prisma.studentWorkPolicy.findMany({
      where: {
        AND: [
          filter?.eligibilityStatus ? { eligibilityStatus: filter.eligibilityStatus } : {},
          filter?.selfEmployment !== undefined ? { selfEmploymentAllowed: filter.selfEmployment } : {},
        ],
      },
      include: {
        country: true,
        exceptions: true,
        authorizations: true,
      },
      orderBy: { country: { name: 'asc' } },
    });

    return rules;
  }

  /**
   * 6. Post-Study Work Routes Database
   */
  async getPostStudyWorkRoutesDirectory(filter?: { jobOfferRequired?: boolean; leadsToPR?: boolean }) {
    await this.ensureSeeded();

    const routes = await prisma.postStudyWorkRoute.findMany({
      where: {
        AND: [
          filter?.jobOfferRequired !== undefined ? { jobOfferRequired: filter.jobOfferRequired } : {},
          filter?.leadsToPR !== undefined ? { leadsToPermanentResidence: filter.leadsToPR } : {},
        ],
      },
      include: {
        country: true,
        eligibilityRules: true,
      },
      orderBy: { country: { name: 'asc' } },
    });

    return routes;
  }

  /**
   * 7. Career Roadmaps Directory
   */
  async getCareerRoadmapsDirectory() {
    await this.ensureSeeded();

    const roadmaps = await prisma.careerRoadmap.findMany({
      include: {
        country: true,
        steps: {
          orderBy: { stepOrder: 'asc' },
        },
      },
      orderBy: { country: { name: 'asc' } },
    });

    return roadmaps.map((r) => ({
      ...r,
      steps: r.steps.map((s) => ({
        ...s,
        actionItems: JSON.parse(s.actionItems || '[]'),
        keyResources: s.keyResources ? JSON.parse(s.keyResources) : [],
      })),
    }));
  }

  /**
   * 8. Official Sources Directory & Methodology
   */
  async getOfficialSourcesDirectory(filter?: { category?: string; status?: string }) {
    await this.ensureSeeded();

    const sources = await prisma.countryOfficialSource.findMany({
      where: {
        AND: [
          filter?.category ? { category: filter.category } : {},
          filter?.status ? { status: filter.status } : {},
        ],
      },
      include: {
        country: true,
      },
      orderBy: [{ retrievalDate: 'desc' }, { country: { name: 'asc' } }],
    });

    return sources;
  }

  /**
   * 9. Optional Personalized Student Study-to-Work Planner
   */
  async generatePersonalizedPlan(input: StudentPlannerInput) {
    await this.ensureSeeded();

    const allProfiles = await prisma.country.findMany({
      include: {
        countryLanguages: true,
        minimumWagePolicies: {
          include: { rates: { where: { isCurrent: true } } },
        },
        studentWorkPolicies: true,
        postStudyWorkRoutes: {
          include: { eligibilityRules: true },
        },
        careerSectors: {
          include: { occupations: true },
        },
      },
    });

    const recommendations = allProfiles.map((country) => {
      let matchScore = 70;
      const verifiedFacts: string[] = [];
      const criticalCautions: string[] = [];
      const planningSuggestions: string[] = [];

      // 1. Language matching
      const languages = country.countryLanguages;
      const officialLangs = languages.filter((l) => l.isOfficial).map((l) => l.languageName);
      const isEnglishSpoken = languages.some((l) => l.languageCode === 'en');

      if (input.preferredStudyLanguage?.toLowerCase() === 'english') {
        if (isEnglishSpoken) {
          matchScore += 10;
          verifiedFacts.push(`English is widely recognized or the official medium of instruction for degree programs.`);
        } else {
          criticalCautions.push(`Official medium is ${officialLangs.join(', ')}. While English-medium Master courses exist, day-to-day and local jobs require ${officialLangs[0]}.`);
        }
      }

      // 2. Student Work & Wages
      const studentWork = country.studentWorkPolicies[0];
      const wagePolicy = country.minimumWagePolicies[0];
      const primaryRate = wagePolicy?.rates?.[0];

      if (studentWork) {
        verifiedFacts.push(`Legal student work limit: ${studentWork.termTimeRuleText}.`);
        if (!studentWork.selfEmploymentAllowed) {
          criticalCautions.push(`Self-employment and freelance gig work (e.g. food delivery/independent coding) are strictly forbidden.`);
        }
      } else {
        criticalCautions.push(`Student employment policies require official individual visa verification.`);
      }

      if (wagePolicy) {
        if (wagePolicy.hasStatutoryMinimum && primaryRate) {
          verifiedFacts.push(`Statutory minimum wage is ${primaryRate.currencySymbol}${primaryRate.amount}/${primaryRate.rateUnit.toLowerCase()} (~৳${primaryRate.estimatedBdtHourly || 'N/A'}/hr estimate).`);
        } else if (wagePolicy.policyType === 'NO_STATUTORY_MINIMUM') {
          verifiedFacts.push(`No statutory national minimum wage: wages are set by industry collective bargaining agreements (Kollektivavtal/TES).`);
        }
      }

      // 3. Post-Study Work Routes
      const postStudy = country.postStudyWorkRoutes[0];
      if (postStudy) {
        verifiedFacts.push(`Post-study work permit: "${postStudy.routeName}" for up to ${postStudy.durationMonthsMax} months.`);
        if (!postStudy.jobOfferRequired) {
          matchScore += 10;
          verifiedFacts.push(`No prior job offer is required to apply for the post-study route.`);
        }
        if (postStudy.leadsToPermanentResidence) {
          matchScore += 5;
          verifiedFacts.push(`Time on qualified work permits can lead to permanent residence pathways.`);
        }
      }

      // 4. Budget check
      if (input.annualTuitionBudgetUsd) {
        if (country.avgTuitionMin === 0 && country.continent === 'Europe') {
          matchScore += 10;
          verifiedFacts.push(`Low or nominal tuition fees available at state universities.`);
        } else if (country.avgTuitionMin * 1.1 > input.annualTuitionBudgetUsd) {
          criticalCautions.push(`Average international tuition (${country.currencySymbol}${country.avgTuitionMin}/yr) may exceed your stated budget.`);
        }
      }

      // Transparent disclaimer
      planningSuggestions.push(`Note: Student wages and permitted hours must NOT be treated as guaranteed income. Living expenses and tuition should be guaranteed in advance.`);

      return {
        country: {
          id: country.id,
          name: country.name,
          code: country.code,
          flagEmoji: country.flagEmoji,
          continent: country.continent,
          currencyCode: country.currencyCode,
          currencySymbol: country.currencySymbol,
        },
        matchScore: Math.min(98, Math.max(40, matchScore)),
        verifiedFacts,
        criticalCautions,
        planningSuggestions,
      };
    });

    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * 10. Admin Policy Management & Verification
   */
  async verifyPolicy(data: {
    countryId: string;
    entityType: string;
    entityId?: string;
    status: string;
    findings: string;
    sourceUrl: string;
    userId?: string;
  }) {
    const record = await prisma.policyVerification.create({
      data: {
        countryId: data.countryId,
        entityType: data.entityType,
        entityId: data.entityId,
        verificationStatus: data.status,
        findings: data.findings,
        sourceUrl: data.sourceUrl,
        verifiedByUserId: data.userId,
      },
    });

    // Also update country lastVerifiedAt
    await prisma.country.update({
      where: { id: data.countryId },
      data: { lastVerifiedAt: new Date() },
    });

    return record;
  }

  async submitCorrectionReport(data: {
    countryId: string;
    entityType: string;
    reportedIssue: string;
    proposedCorrection: string;
    evidenceUrl?: string;
    userId?: string;
  }) {
    return prisma.policyCorrectionReport.create({
      data: {
        countryId: data.countryId,
        entityType: data.entityType,
        reportedIssue: data.reportedIssue,
        proposedCorrection: data.proposedCorrection,
        evidenceUrl: data.evidenceUrl,
        userId: data.userId,
      },
    });
  }

  async getCorrectionReports(status?: string) {
    return prisma.policyCorrectionReport.findMany({
      where: status ? { status } : {},
      include: {
        country: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async reviewCorrectionReport(id: string, status: string, adminNotes: string) {
    return prisma.policyCorrectionReport.update({
      where: { id },
      data: {
        status,
        adminNotes,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Dedicated Dataset 1 Query: Minimum Wages
   */
  async getMinimumWagesDataset(countryCode?: string) {
    await this.ensureSeeded();
    return prisma.minimumWagePolicy.findMany({
      where: countryCode ? { country: { code: countryCode.toUpperCase() } } : {},
      include: {
        country: {
          select: {
            id: true,
            name: true,
            code: true,
            slug: true,
            flagEmoji: true,
            currencyCode: true,
            currencySymbol: true,
            exchangeRateToBdt: true,
            continent: true,
          },
        },
        rates: {
          include: { jurisdiction: true },
          orderBy: { amount: 'desc' },
        },
      },
      orderBy: { country: { name: 'asc' } },
    });
  }

  /**
   * Dedicated Dataset 2 Query: Legal Student Work Hours & Regulations
   */
  async getStudentWorkHoursDataset(countryCode?: string) {
    await this.ensureSeeded();
    return prisma.studentWorkPolicy.findMany({
      where: countryCode ? { country: { code: countryCode.toUpperCase() } } : {},
      include: {
        country: {
          select: {
            id: true,
            name: true,
            code: true,
            slug: true,
            flagEmoji: true,
            continent: true,
          },
        },
        exceptions: true,
        authorizations: true,
      },
      orderBy: { country: { name: 'asc' } },
    });
  }

  /**
   * Dedicated Dataset 3 Query: Post-Study Work Routes & Graduate Visas
   */
  async getPostStudyWorkDataset(countryCode?: string) {
    await this.ensureSeeded();
    return prisma.postStudyWorkRoute.findMany({
      where: countryCode ? { country: { code: countryCode.toUpperCase() } } : {},
      include: {
        country: {
          select: {
            id: true,
            name: true,
            code: true,
            slug: true,
            flagEmoji: true,
            continent: true,
          },
        },
        eligibilityRules: true,
      },
      orderBy: { country: { name: 'asc' } },
    });
  }

  /**
   * Admin: Update Minimum Wage Policy independently
   */
  async adminUpdateMinimumWage(countryCodeOrId: string, data: any) {
    const country = await prisma.country.findFirst({
      where: { OR: [{ id: countryCodeOrId }, { code: countryCodeOrId.toUpperCase() }] },
    });
    if (!country) throw new Error('Country not found');

    const policy = await prisma.minimumWagePolicy.findFirst({
      where: { countryId: country.id },
    });
    if (!policy) throw new Error('Minimum wage policy not found for country');

    return prisma.minimumWagePolicy.update({
      where: { id: policy.id },
      data: {
        policyType: data.policyType ?? policy.policyType,
        hasStatutoryMinimum: data.hasStatutoryMinimum ?? policy.hasStatutoryMinimum,
        governingBody: data.governingBody ?? policy.governingBody,
        legislationName: data.legislationName ?? policy.legislationName,
        overview: data.overview ?? policy.overview,
        collectiveBargainingNote: data.collectiveBargainingNote ?? policy.collectiveBargainingNote,
        sourceUrl: data.sourceUrl ?? policy.sourceUrl,
        verificationStatus: data.verificationStatus ?? policy.verificationStatus,
        updatedAt: new Date(),
      },
      include: { country: true, rates: true },
    });
  }

  /**
   * Admin: Update Student Work Policy independently
   */
  async adminUpdateStudentWorkPolicy(countryCodeOrId: string, data: any) {
    const country = await prisma.country.findFirst({
      where: { OR: [{ id: countryCodeOrId }, { code: countryCodeOrId.toUpperCase() }] },
    });
    if (!country) throw new Error('Country not found');

    const policy = await prisma.studentWorkPolicy.findFirst({
      where: { countryId: country.id },
    });
    if (!policy) throw new Error('Student work policy not found for country');

    return prisma.studentWorkPolicy.update({
      where: { id: policy.id },
      data: {
        eligibilityStatus: data.eligibilityStatus ?? policy.eligibilityStatus,
        termTimeLimitHours: data.termTimeLimitHours ?? policy.termTimeLimitHours,
        termTimeUnit: data.termTimeUnit ?? policy.termTimeUnit,
        termTimeRuleText: data.termTimeRuleText ?? policy.termTimeRuleText,
        holidayLimitHours: data.holidayLimitHours ?? policy.holidayLimitHours,
        holidayTimeUnit: data.holidayTimeUnit ?? policy.holidayTimeUnit,
        holidayRuleText: data.holidayRuleText ?? policy.holidayRuleText,
        onCampusRules: data.onCampusRules ?? policy.onCampusRules,
        offCampusRules: data.offCampusRules ?? policy.offCampusRules,
        selfEmploymentAllowed: data.selfEmploymentAllowed ?? policy.selfEmploymentAllowed,
        selfEmploymentRules: data.selfEmploymentRules ?? policy.selfEmploymentRules,
        sourceUrl: data.sourceUrl ?? policy.sourceUrl,
        verificationStatus: data.verificationStatus ?? policy.verificationStatus,
        updatedAt: new Date(),
      },
      include: { country: true, exceptions: true, authorizations: true },
    });
  }

  /**
   * Admin: Update Post-Study Work Route independently
   */
  async adminUpdatePostStudyWorkRoute(routeId: string, data: any) {
    return prisma.postStudyWorkRoute.update({
      where: { id: routeId },
      data: {
        routeName: data.routeName,
        routeCode: data.routeCode,
        durationMonthsMin: data.durationMonthsMin,
        durationMonthsMax: data.durationMonthsMax,
        jobOfferRequired: data.jobOfferRequired,
        leadsToPermanentResidence: data.leadsToPermanentResidence,
        prPathwayDetails: data.prPathwayDetails,
        governmentApplicationUrl: data.governmentApplicationUrl,
        verificationStatus: data.verificationStatus,
        updatedAt: new Date(),
      },
      include: { country: true, eligibilityRules: true },
    });
  }

  /**
   * Helper: Ensure all 3 datasets are populated (42 countries each)
   */
  private async ensureSeeded() {
    const mwCount = await prisma.minimumWagePolicy.count();
    const swCount = await prisma.studentWorkPolicy.count();
    const pswCount = await prisma.postStudyWorkRoute.count();
    if (mwCount < 40 || swCount < 40 || pswCount < 40) {
      await this.seedAllCountryWorkDatasets();
    }
  }
}

export const countryWorkGuideService = new CountryWorkGuideService();
