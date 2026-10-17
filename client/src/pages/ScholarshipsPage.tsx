import React, { useState, useEffect } from 'react';
import { getScholarships } from '../services/api.js';
import { COUNTRIES_DATA } from '../data/countriesData.js';
import { Scholarship } from '../types/index.js';
import { ScholarshipCard } from '../components/common/ScholarshipCard.js';
import { Award, Search, Filter, CheckCircle2 } from 'lucide-react';

export const ScholarshipsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedDegree, setSelectedDegree] = useState('all');
  const [fullyFundedOnly, setFullyFundedOnly] = useState(false);
  const [bangladeshOnly, setBangladeshOnly] = useState(false);

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getScholarships({
      country: selectedCountry,
      fullyFunded: fullyFundedOnly,
      bangladeshOnly: bangladeshOnly,
      search,
    }).then((res) => {
      setScholarships(res.scholarships);
      setLoading(false);
    });
  }, [selectedCountry, fullyFundedOnly, bangladeshOnly, search]);

  const filteredScholarships = scholarships.filter((s) => {
    if (selectedDegree !== 'all') {
      if (!s.degreeLevels.includes(selectedDegree as any)) return false;
    }
    return true;
  });


  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Scholarship Discovery Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-navy">
            World Scholarships
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Official government-funded international education programs, multilateral schemes, and national scholarship portals across 30+ destinations.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search scholarship name, funding government, provider (e.g. Erasmus, DAAD, Chevening, Fulbright)…"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
              >
                <option value="all">🌍 All Host Destinations</option>
                {COUNTRIES_DATA.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.flagEmoji} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedDegree}
                onChange={(e) => setSelectedDegree(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
              >
                <option value="all">🎓 All Degree Levels</option>
                <option value="BACHELOR">Bachelor's Degrees</option>
                <option value="MASTER">Master's Degrees</option>
                <option value="PHD">Doctoral / PhD Degrees</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={fullyFundedOnly}
                  onChange={(e) => setFullyFundedOnly(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                />
                <span>🌟 Fully Funded Only (100% Tuition + Living Stipend)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={bangladeshOnly}
                  onChange={(e) => setBangladeshOnly(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                />
                <span>🇧🇩 Open to Bangladeshi Citizens</span>
              </label>
            </div>

            <span className="text-slate-500">
              Showing <strong>{filteredScholarships.length}</strong> verified programs
            </span>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
          </div>
        ) : filteredScholarships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((sch) => (
              <ScholarshipCard key={sch.id} scholarship={sch} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No Scholarships Match Your Query</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Try toggling off the fully funded filter or selecting all destinations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
