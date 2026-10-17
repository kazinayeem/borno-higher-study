import { Request, Response } from 'express';
import { COUNTRIES_DATA } from '../data/countriesData.js';
import { UNIVERSITIES_DATA } from '../data/universitiesData.js';
import { SCHOLARSHIPS_DATA } from '../data/scholarshipsData.js';

export const calculateCost = (req: Request, res: Response) => {
  const {
    countrySlug,
    universitySlug,
    programId,
    studyDurationMonths,
    scholarshipId,
    monthlyLivingCostOverride,
  } = req.body;

  const country = COUNTRIES_DATA.find((c) => c.slug === countrySlug);
  if (!country) {
    return res.status(400).json({ error: 'Valid country is required' });
  }

  const university = UNIVERSITIES_DATA.find((u) => u.slug === universitySlug);
  const program = university?.programs.find((p) => p.id === programId);

  // Defaults if program not selected: use country benchmarks
  const durationMonths = Number(studyDurationMonths) || (program ? program.durationMonths : 24);
  const durationYears = durationMonths / 12;

  const annualTuitionLocal = program
    ? program.annualTuitionLocal
    : (country.avgTuitionMin + country.avgTuitionMax) / 2;

  const totalTuitionLocal = annualTuitionLocal * durationYears;
  const applicationFeeLocal = program ? program.applicationFeeLocal : 0;

  const monthlyLivingLocal =
    monthlyLivingCostOverride !== undefined && Number(monthlyLivingCostOverride) > 0
      ? Number(monthlyLivingCostOverride)
      : country.avgLivingCostMonthly;

  const totalLivingLocal = monthlyLivingLocal * durationMonths;

  // Evaluate scholarship
  let scholarshipDeductionLocal = 0;
  let scholarshipApplied = null;

  if (scholarshipId) {
    const scholarship = SCHOLARSHIPS_DATA.find((s) => s.id === scholarshipId);
    if (scholarship) {
      scholarshipApplied = {
        name: scholarship.name,
        type: scholarship.type,
        coveragePercent: scholarship.coveragePercent,
        isFullyFunded: scholarship.isFullyFunded,
        isEstimateOnly: true,
      };

      if (scholarship.isFullyFunded) {
        // covers full tuition and living stipend
        scholarshipDeductionLocal = totalTuitionLocal + (scholarship.stipendMonthlyLocal * durationMonths);
      } else {
        scholarshipDeductionLocal = (totalTuitionLocal * scholarship.coveragePercent) / 100;
      }
    }
  }

  const totalCostBeforeAid = totalTuitionLocal + totalLivingLocal + applicationFeeLocal;
  const netEstimatedCostLocal = Math.max(0, totalCostBeforeAid - scholarshipDeductionLocal);

  const rate = country.exchangeRateToBdt;

  return res.json({
    currency: {
      localCode: country.currencyCode,
      localSymbol: country.currencySymbol,
      exchangeRateToBdt: rate,
    },
    duration: {
      months: durationMonths,
      years: durationYears,
    },
    breakdown: {
      annualTuitionLocal,
      annualTuitionBdt: Math.round(annualTuitionLocal * rate),
      totalTuitionLocal,
      totalTuitionBdt: Math.round(totalTuitionLocal * rate),
      applicationFeeLocal,
      applicationFeeBdt: Math.round(applicationFeeLocal * rate),
      monthlyLivingLocal,
      monthlyLivingBdt: Math.round(monthlyLivingLocal * rate),
      totalLivingLocal,
      totalLivingBdt: Math.round(totalLivingLocal * rate),
      totalCostBeforeAidLocal: totalCostBeforeAid,
      totalCostBeforeAidBdt: Math.round(totalCostBeforeAid * rate),
      scholarshipDeductionLocal,
      scholarshipDeductionBdt: Math.round(scholarshipDeductionLocal * rate),
      netEstimatedCostLocal,
      netEstimatedCostBdt: Math.round(netEstimatedCostLocal * rate),
    },
    metadata: {
      officialTuitionVerified: Boolean(program),
      scholarshipApplied,
      disclaimer: "Tuition figures are official verified university rates. Living costs are official averages or user estimates. Scholarship reductions are estimates and subject to formal admissions award.",
      lastVerifiedAt: program ? program.lastVerifiedAt : country.lastVerifiedAt,
    },
  });
};
