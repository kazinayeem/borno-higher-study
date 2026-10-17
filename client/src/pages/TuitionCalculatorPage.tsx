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
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            <Calculator className="w-4 h-4 text-teal-600" />
            <span>Interactive Tuition & Study Cost Calculator</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-navy">
            Estimate Study Abroad Investment
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Calculate verified tuition fees, estimated living expenses, and scholarship waivers with real-time conversion into Bangladeshi Taka (BDT).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-5">
            <h3 className="font-bold text-lg text-brand-navy flex items-center gap-2">
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
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-xl text-brand-navy">
                  Comprehensive Cost Breakdown
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live Exchange Rate: 1 {calculation?.currency?.localCode} = {calculation?.currency?.exchangeRateToBdt} BDT
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Breakdown</span>
              </div>
            </div>

            {calculation ? (
              <div className="space-y-4">
                {/* Tuition Cost Row */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Total Tuition Fee ({calculation.duration.years} Years)
                    </span>
                    <span className="text-xs text-slate-500">
                      Annual: {calculation.currency.localSymbol} {calculation.breakdown.annualTuitionLocal.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-brand-navy block">
                      {calculation.currency.localSymbol} {calculation.breakdown.totalTuitionLocal.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-teal-700">
                      ~{calculation.breakdown.totalTuitionBdt.toLocaleString()} BDT
                    </span>
                  </div>
                </div>

                {/* Living Expenses Row */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Estimated Living Costs ({calculation.duration.months} Months)
                    </span>
                    <span className="text-xs text-slate-500">
                      Estimated ~{calculation.currency.localSymbol} {calculation.breakdown.monthlyLivingLocal}/month
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-brand-navy block">
                      {calculation.currency.localSymbol} {calculation.breakdown.totalLivingLocal.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-teal-700">
                      ~{calculation.breakdown.totalLivingBdt.toLocaleString()} BDT
                    </span>
                  </div>
                </div>

                {/* Scholarship Waiver Deduction (If Applied) */}
                {calculation.breakdown.scholarshipDeductionLocal > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-900 block flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        Scholarship Waiver Deduction (Estimated)
                      </span>
                      <span className="text-xs text-amber-700">
                        {calculation.metadata.scholarshipApplied?.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-amber-700 block">
                        - {calculation.currency.localSymbol} {calculation.breakdown.scholarshipDeductionLocal.toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold text-amber-800">
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
                    <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">
                      {calculation.currency.localSymbol} {calculation.breakdown.netEstimatedCostLocal.toLocaleString()}
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-white bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
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
