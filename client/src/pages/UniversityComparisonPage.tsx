import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Calendar,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
  Layers,
} from 'lucide-react';
import { getUniversityComparisons } from '../services/api';
import { UniversityComparisonItem } from '../types';

export const UniversityComparisonPage: React.FC = () => {
  const [comparisons, setComparisons] = useState<UniversityComparisonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompId, setSelectedCompId] = useState<string>('');

  useEffect(() => {
    async function loadComparisons() {
      setLoading(true);
      try {
        const data = await getUniversityComparisons();
        setComparisons(data);
        if (data.length > 0) {
          setSelectedCompId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load university comparisons:', err);
      } finally {
        setLoading(false);
      }
    }
    loadComparisons();
  }, []);

  const activeComp = comparisons.find((c) => c.id === selectedCompId) || comparisons[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 mb-3">
              <Building2 className="w-3.5 h-3.5 text-teal-600" />
              Evidence-Based Comparison Matrix
            </div>
            <h1 className="text-3xl md:text-5xl font-heading font-semibold text-brand-navy tracking-tight">
              International University Comparisons
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Transparent, side-by-side criteria evaluation across collegiate structures, tuition fees, minimum A-Level/HSC prerequisite equivalencies, and language compliance.
            </p>
          </div>

          {/* Quick Comparison Selector Tabs */}
          {comparisons.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {comparisons.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCompId(c.id)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                    selectedCompId === c.id
                      ? 'bg-brand-navy text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {c.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-600">Loading university matrices...</p>
          </div>
        ) : activeComp ? (
          <div className="space-y-8">
            {/* Overview Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                    Scope: {activeComp.comparisonScope.replace('_', ' ')}
                  </span>
                  <h2 className="text-xl md:text-2xl font-heading font-semibold text-brand-navy tracking-tight mt-1">
                    {activeComp.title}
                  </h2>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <span>Last Verified: {new Date(activeComp.lastVerifiedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                {activeComp.summaryNotes}
              </p>

              {/* Methodology Disclosure Alert */}
              <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Methodological Disclosure & Sources:</strong>
                  <p className="mt-0.5">{activeComp.methodologyDisclosure}</p>
                </div>
              </div>
            </div>

            {/* Side-by-Side Data Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-card">
              <div className="p-5 border-b border-slate-200/80 bg-slate-50">
                <h3 className="text-base font-heading font-semibold text-brand-navy">
                  Verified Data Points & Criteria Matrix
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct comparison based on current statutory university prospectuses.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm">
                  <thead className="bg-[#0B192C] text-white">
                    <tr>
                      <th className="py-3 px-5 font-semibold">Evaluated Institution</th>
                      <th className="py-3 px-5 font-semibold">Criterion Dimension</th>
                      <th className="py-3 px-5 font-semibold">Published Value</th>
                      <th className="py-3 px-5 font-semibold">Primary Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {activeComp.dataPoints?.map((dp) => (
                      <tr key={dp.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-5 font-bold text-slate-900">
                          {dp.entityIdentifier}
                        </td>
                        <td className="py-3.5 px-5 text-slate-700 font-medium">
                          {dp.attributeKey}
                        </td>
                        <td className="py-3.5 px-5 text-slate-900">
                          {dp.attributeValue}
                        </td>
                        <td className="py-3.5 px-5 text-teal-700">
                          {dp.dataSourceUrl ? (
                            <a
                              href={dp.dataSourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:underline text-xs"
                            >
                              Official Catalog <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-400 text-xs">University Prospectus</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Related In-Depth Guides */}
            <div className="bg-slate-100 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Need a full methodological guide on choosing universities?
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Read our long-form guides covering the 6 pillars of university selection and department auditing.
                </p>
              </div>
              <Link
                to="/blog/category/university-comparisons"
                className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shrink-0"
              >
                Read 15 University Guides &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-xl border border-slate-200 p-8">
            <p className="text-sm font-semibold text-slate-700">No comparison matrices found.</p>
          </div>
        )}
      </main>
    </div>
  );
};
