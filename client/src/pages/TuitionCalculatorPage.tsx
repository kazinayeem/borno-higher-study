import React, { useState, useEffect } from 'react';
import { COUNTRIES_DATA } from '../data/countriesData.js';
import { UNIVERSITIES_DATA } from '../data/universitiesData.js';
import { SCHOLARSHIPS_DATA } from '../data/scholarshipsData.js';
import { calculateTuitionCost } from '../services/api.js';
import {
  Calculator,
  Coins,
  GraduationCap,
  Sparkles,
  Info,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { SeoHead } from '../components/common/SeoHead.js';
import { PageIntro } from '../components/motion/index.js';

export const TuitionCalculatorPage: React.FC = () => {
  const [selectedCountrySlug, setSelectedCountrySlug] = useState('finland');
  const [selectedUniSlug, setSelectedUniSlug] = useState('aalto-university');
  const [selectedProgramId, setSelectedProgramId] = useState('aalto-cs-msc');
  const [durationMonths, setDurationMonths] = useState(24);
  const [scholarshipId, setScholarshipId] = useState('');
  const [monthlyLivingOverride, setMonthlyLivingOverride] = useState<number | ''>('');

  const [calculation, setCalculation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Available universities in chosen country
  const countryUniversities = UNIVERSITIES_DATA.filter(
    (u) => u.countrySlug === selectedCountrySlug
  );
  const currentUniversity = UNIVERSITIES_DATA.find((u) => u.slug === selectedUniSlug);
  const countryScholarships = SCHOLARSHIPS_DATA.filter(
    (s) => s.countrySlug === selectedCountrySlug
  );

  const runCalculation = async () => {
    setLoading(true);
    try {
      const res = await calculateTuitionCost({
        countrySlug: selectedCountrySlug,
        universitySlug: selectedUniSlug,
        programId: selectedProgramId,
        studyDurationMonths: durationMonths,
        scholarshipId: scholarshipId || undefined,
        monthlyLivingCostOverride: monthlyLivingOverride !== '' ? Number(monthlyLivingOverride) : undefined,
      });
      setCalculation(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runCalculation();
  }, [selectedCountrySlug, selectedUniSlug, selectedProgramId, durationMonths, scholarshipId, monthlyLivingOverride]);

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#0B132B] py-10 transition-colors">
      <SeoHead
        title="Tuition & Living Cost Calculator in BDT — Borno Higher Study"
        description="Calculate degree tuition fees, estimated living costs, and scholarship deductions with real-time conversion to Bangladeshi Taka (BDT) for 42 study abroad countries."
        canonicalPath="/calculator"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <PageIntro className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-400">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400"></span>
            <span>Financial Solvency &amp; Living Benchmark Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-semibold text-brand-navy dark:text-white tracking-tight">
            Tuition & Study Investment Calculator
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Calculate verified tuition rates, statutory living allowances, and scholarship waivers with deterministic conversion to <strong>Bangladeshi Taka (BDT)</strong> and foreign currencies.
          </p>
        </PageIntro>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card space-y-5">
            <h3 className="font-heading font-semibold text-lg text-brand-navy dark:text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-teal-600" />
              Configure Study Plan
            </h3>

            {/* Destination Country */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">1. Destination Country</label>
              <select
                value={selectedCountrySlug}
                onChange={(e) => {
                  setSelectedCountrySlug(e.target.value);
                  const firstUni = UNIVERSITIES_DATA.find((u) => u.countrySlug === e.target.value);
                  if (firstUni) {
                    setSelectedUniSlug(firstUni.slug);
                    setSelectedProgramId(firstUni.programs[0]?.id || '');
                  } else {
                    setSelectedUniSlug('');
                    setSelectedProgramId('');
                  }
                  setScholarshipId('');
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
              >
                {COUNTRIES_DATA.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.flagEmoji} {c.name} ({c.currencyCode})
                  </option>
                ))}
              </select>
            </div>

            {/* University */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">2. University</label>
              <select
                value={selectedUniSlug}
                onChange={(e) => {
                  setSelectedUniSlug(e.target.value);
                  const uni = UNIVERSITIES_DATA.find((u) => u.slug === e.target.value);
                  setSelectedProgramId(uni?.programs[0]?.id || '');
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
              >
                {countryUniversities.length > 0 ? (
                  countryUniversities.map((u) => (
                    <option key={u.slug} value={u.slug}>
                      {u.name} ({u.cityName})
                    </option>
                  ))
                ) : (
                  <option value="">National Average Benchmarks</option>
                )}
              </select>
            </div>

            {/* Program */}
            {currentUniversity && currentUniversity.programs.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">3. Verified Degree Program</label>
                <select
                  value={selectedProgramId}
                  onChange={(e) => {
                    setSelectedProgramId(e.target.value);
                    const prog = currentUniversity.programs.find((p) => p.id === e.target.value);
                    if (prog) setDurationMonths(prog.durationMonths);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
                >
                  {currentUniversity.programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.degreeLevel})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Study Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between">
                <span>4. Degree Duration: {durationMonths} Months</span>
                <span className="text-teal-600 font-semibold">({durationMonths / 12} Years)</span>
              </label>
              <input
                type="range"
                min="12"
                max="48"
                step="6"
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 Year (12m)</span>
                <span>2 Years (24m)</span>
                <span>3 Years (36m)</span>
                <span>4 Years (48m)</span>
              </div>
            </div>

            {/* Scholarship or Tuition Waiver */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">5. Apply Verified Scholarship (Estimate)</label>
              <select
                value={scholarshipId}
                onChange={(e) => setScholarshipId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
              >
                <option value="">No Scholarship Applied (Full Self-Funded)</option>
                {countryScholarships.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.isFullyFunded ? 'Fully Funded' : `${s.coveragePercent}% Waiver`})
                  </option>
                ))}
              </select>
            </div>

            {/* Monthly Living Cost Override */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between">
                <span>6. Monthly Living Expense (Optional Customization)</span>
              </label>
              <input
                type="number"
                value={monthlyLivingOverride}
                onChange={(e) => setMonthlyLivingOverride(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder={`Default national benchmark (~${calculation?.currency?.localSymbol || ''}${calculation?.breakdown?.monthlyLivingLocal || ''})`}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Results Breakdown Column (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-heading font-semibold text-xl text-brand-navy tracking-tight">
                  Comprehensive Cost Breakdown
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
                  Live Exchange Rate: 1 {calculation?.currency?.localCode} = {calculation?.currency?.exchangeRateToBdt} BDT
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Breakdown</span>
              </div>
            </div>

            {calculation ? (
              <div className="space-y-4">
                {/* Tuition Cost Row */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      Total Tuition Fee ({calculation.duration.years} Years)
                    </span>
                    <span className="text-xs text-slate-500 tabular-nums">
                      Annual: {calculation.currency.localSymbol} {calculation.breakdown.annualTuitionLocal.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-heading font-semibold text-brand-navy block tabular-nums">
                      {calculation.currency.localSymbol} {calculation.breakdown.totalTuitionLocal.toLocaleString()}
                    </span>
                    <span className="text-xs font-medium text-teal-700 tabular-nums">
                      ~{calculation.breakdown.totalTuitionBdt.toLocaleString()} BDT
                    </span>
                  </div>
                </div>

                {/* Living Expenses Row */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      Estimated Living Costs ({calculation.duration.months} Months)
                    </span>
                    <span className="text-xs text-slate-500 tabular-nums">
                      Estimated ~{calculation.currency.localSymbol} {calculation.breakdown.monthlyLivingLocal}/month
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-heading font-semibold text-brand-navy block tabular-nums">
                      {calculation.currency.localSymbol} {calculation.breakdown.totalLivingLocal.toLocaleString()}
                    </span>
                    <span className="text-xs font-medium text-teal-700 tabular-nums">
                      ~{calculation.breakdown.totalLivingBdt.toLocaleString()} BDT
                    </span>
                  </div>
                </div>

                {/* Scholarship Waiver Deduction (If Applied) */}
                {calculation.breakdown.scholarshipDeductionLocal > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-amber-900 block flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        Scholarship Waiver Deduction (Estimated)
                      </span>
                      <span className="text-xs text-amber-700">
                        {calculation.metadata.scholarshipApplied?.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-heading font-semibold text-amber-700 block tabular-nums">
                        - {calculation.currency.localSymbol} {calculation.breakdown.scholarshipDeductionLocal.toLocaleString()}
                      </span>
                      <span className="text-xs font-medium text-amber-800 tabular-nums">
                        - {calculation.breakdown.scholarshipDeductionBdt.toLocaleString()} BDT
                      </span>
                    </div>
                  </div>
                )}

                {/* Total Net Study Budget Highlight Box */}
                <div className="p-6 rounded-2xl bg-brand-navy text-white space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Estimated Net Total Outlay</span>
                    <span>Tuition + Living - Scholarships</span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div className="text-3xl sm:text-4xl font-heading font-semibold text-amber-400 tabular-nums">
                      {calculation.currency.localSymbol} {calculation.breakdown.netEstimatedCostLocal.toLocaleString()}
                    </div>
                    <div className="text-lg sm:text-xl font-heading font-semibold text-white bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 tabular-nums">
                      ~{calculation.breakdown.netEstimatedCostBdt.toLocaleString()} BDT
                    </div>
                  </div>
                </div>

                {/* Transparency Note */}
                <div className="p-4 rounded-xl bg-teal-50 border border-teal-200/60 text-xs text-teal-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-teal-700" />
                    Official vs. Estimated Figures:
                  </p>
                  <p className="text-teal-800 leading-relaxed">
                    Tuition fees are official verified amounts from institutional prospectuses. Monthly living costs represent official visa proof thresholds. Scholarships are estimates subject to competitive formal admission decisions.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
