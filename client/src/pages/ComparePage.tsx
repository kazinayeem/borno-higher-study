import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext.js';
import { UNIVERSITIES_DATA } from '../data/universitiesData.js';
import { COUNTRIES_DATA } from '../data/countriesData.js';
import {
  Scale,
  X,
  Plus,
  ExternalLink,
  ShieldCheck,
  Award,
  Coins,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { SeoHead } from '../components/common/SeoHead.js';

export const ComparePage: React.FC = () => {
  const { compareSlugs, removeFromCompare, clearCompare, addToCompare } = useCompare();

  const selectedUnis = compareSlugs
    .map((slug) => UNIVERSITIES_DATA.find((u) => u.slug === slug))
    .filter(Boolean) as typeof UNIVERSITIES_DATA;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <SeoHead
        title="Compare Universities Side-by-Side | Borno Higher Study"
        description="Benchmark up to four international universities side-by-side. Compare annual tuition fees, world rankings, acceptance rates, and minimum IELTS criteria."
        canonicalPath="/compare"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              <Scale className="w-4 h-4 text-amber-600" />
              <span>Multi-University Benchmarking</span>
            </div>
            <h1 className="text-3xl font-extrabold text-brand-navy mt-1">
              University Comparison Matrix
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Compare rankings, verified tuition ranges, living expenses, and work rights side by side (Max 4).
            </p>
          </div>

          {selectedUnis.length > 0 && (
            <button
              onClick={clearCompare}
              className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200"
            >
              Clear Comparison Tray
            </button>
          )}
        </div>

        {selectedUnis.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
            <Scale className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">Your Comparison Tray is Empty</h3>
            <p className="text-xs text-slate-500">
              Click the scale icon (<Scale className="w-3.5 h-3.5 inline text-amber-600" />) on any university card in the directory to add it to your side-by-side comparison.
            </p>
            <Link
              to="/universities"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md"
            >
              <span>Explore Universities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="p-4 sm:p-6 w-48 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    Attribute
                  </th>
                  {selectedUnis.map((uni) => (
                    <th key={uni.id} className="p-4 sm:p-6 min-w-[260px] max-w-[300px] align-top">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-extrabold text-base text-brand-navy leading-snug">
                            {uni.name}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {uni.cityName}, {uni.countryName}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCompare(uni.slug)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                  {selectedUnis.length < 4 && (
                    <th className="p-4 sm:p-6 min-w-[220px] bg-slate-50/40 border-l border-dashed border-slate-200 align-middle text-center">
                      <Link
                        to="/universities"
                        className="inline-flex flex-col items-center gap-2 text-slate-500 hover:text-teal-600 p-4 border border-dashed border-slate-300 rounded-2xl hover:border-teal-500 transition-colors"
                      >
                        <Plus className="w-6 h-6" />
                        <span className="text-xs font-bold">Add University</span>
                      </Link>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Ranking */}
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-slate-500 bg-slate-50/40">
                    QS World Ranking
                  </td>
                  {selectedUnis.map((u) => (
                    <td key={u.id} className="p-4 sm:p-6">
                      <span className="font-bold text-slate-800">
                        {u.qsRanking ? `#${u.qsRanking}` : 'Unranked / Regional'}
                      </span>
                    </td>
                  ))}
                  {selectedUnis.length < 4 && <td className="p-4 sm:p-6 bg-slate-50/20" />}
                </tr>

                {/* University Type */}
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-slate-500 bg-slate-50/40">
                    Institution Type
                  </td>
                  {selectedUnis.map((u) => (
                    <td key={u.id} className="p-4 sm:p-6">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs">
                        {u.type}
                      </span>
                    </td>
                  ))}
                  {selectedUnis.length < 4 && <td className="p-4 sm:p-6 bg-slate-50/20" />}
                </tr>

                {/* Annual Tuition Range */}
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-slate-500 bg-slate-50/40">
                    Annual Tuition
                  </td>
                  {selectedUnis.map((u) => {
                    const min = Math.min(...u.programs.map((p) => p.annualTuitionLocal));
                    const max = Math.max(...u.programs.map((p) => p.annualTuitionLocal));
                    const curr = u.programs[0]?.currencyCode || 'EUR';
                    return (
                      <td key={u.id} className="p-4 sm:p-6 font-bold text-teal-700">
                        {curr} {min.toLocaleString()} {min !== max && `– ${max.toLocaleString()}`}
                      </td>
                    );
                  })}
                  {selectedUnis.length < 4 && <td className="p-4 sm:p-6 bg-slate-50/20" />}
                </tr>

                {/* Living Cost Benchmark */}
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-slate-500 bg-slate-50/40">
                    Destination Living Cost
                  </td>
                  {selectedUnis.map((u) => {
                    const country = COUNTRIES_DATA.find((c) => c.slug === u.countrySlug);
                    return (
                      <td key={u.id} className="p-4 sm:p-6 text-slate-700">
                        ~{country?.currencySymbol}{country?.avgLivingCostMonthly}/mo (~{Math.round((country?.avgLivingCostMonthly || 0) * (country?.exchangeRateToBdt || 1)).toLocaleString()} BDT)
                      </td>
                    );
                  })}
                  {selectedUnis.length < 4 && <td className="p-4 sm:p-6 bg-slate-50/20" />}
                </tr>

                {/* Post-Study Work Visa */}
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-slate-500 bg-slate-50/40">
                    Post-Study Work Visa
                  </td>
                  {selectedUnis.map((u) => {
                    const country = COUNTRIES_DATA.find((c) => c.slug === u.countrySlug);
                    return (
                      <td key={u.id} className="p-4 sm:p-6 text-xs text-slate-600 leading-snug">
                        {country?.postStudyWorkVisa}
                      </td>
                    );
                  })}
                  {selectedUnis.length < 4 && <td className="p-4 sm:p-6 bg-slate-50/20" />}
                </tr>

                {/* Verified Programs Count */}
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-slate-500 bg-slate-50/40">
                    Verified Degree Programs
                  </td>
                  {selectedUnis.map((u) => (
                    <td key={u.id} className="p-4 sm:p-6">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-800">{u.programs.length} Verified Programs</span>
                        <div className="text-xs text-slate-500 space-y-0.5">
                          {u.programs.slice(0, 3).map((p) => (
                            <p key={p.id}>• {p.name}</p>
                          ))}
                        </div>
                      </div>
                    </td>
                  ))}
                  {selectedUnis.length < 4 && <td className="p-4 sm:p-6 bg-slate-50/20" />}
                </tr>

                {/* Link to Details */}
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-slate-500 bg-slate-50/40">
                    Action
                  </td>
                  {selectedUnis.map((u) => (
                    <td key={u.id} className="p-4 sm:p-6">
                      <Link
                        to={`/universities/${u.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold transition-colors"
                      >
                        <span>View University</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  ))}
                  {selectedUnis.length < 4 && <td className="p-4 sm:p-6 bg-slate-50/20" />}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
