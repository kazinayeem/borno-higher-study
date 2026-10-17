import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getUniversities } from '../services/api.js';
import { COUNTRIES_DATA } from '../data/countriesData.js';
import { University } from '../types/index.js';
import { UniversityCard } from '../components/common/UniversityCard.js';
import { Search, Filter, GraduationCap, X, Globe, Building2, Sparkles } from 'lucide-react';

const CONTINENTS = [
  'All Continents',
  'Europe',
  'North America',
  'Asia',
  'Oceania',
  'South America',
  'Africa'
];

export const UniversitiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedContinent, setSelectedContinent] = useState('All Continents');
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || 'all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || 'all');
  const [maxIelts, setMaxIelts] = useState(searchParams.get('maxIelts') || '');

  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUniversities({
      country: selectedCountry,
      level: selectedLevel,
      search,
    }).then((res) => {
      let list = res.universities;

      // Continent filter
      if (selectedContinent !== 'All Continents') {
        const matchingCountrySlugs = new Set(
          COUNTRIES_DATA.filter((c) => c.continent === selectedContinent).map((c) => c.slug)
        );
        list = list.filter((u: any) => u.continent === selectedContinent || matchingCountrySlugs.has(u.countrySlug));
      }

      // Public / Private filter
      if (selectedType !== 'all') {
        list = list.filter((u) => u.type === selectedType);
      }

      // IELTS filter
      if (maxIelts) {
        const target = parseFloat(maxIelts);
        if (!isNaN(target)) {
          list = list.filter((u) => u.programs.some((p) => p.ieltsOverall <= target));
        }
      }

      setUniversities(list);
      setLoading(false);
    });
  }, [selectedContinent, selectedCountry, selectedType, selectedLevel, search, maxIelts]);

  const clearFilters = () => {
    setSearch('');
    setSelectedContinent('All Continents');
    setSelectedCountry('all');
    setSelectedType('all');
    setSelectedLevel('all');
    setMaxIelts('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>100+ Verified Universities Milestone</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-navy">
            Explore Global Universities
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Search verified higher education institutions across 6 continents. Verified against the International Association of Universities WHED directory and national accreditation bodies.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search university name, program, city, or WHED ID…"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Continent Selector */}
            <div>
              <select
                value={selectedContinent}
                onChange={(e) => setSelectedContinent(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
              >
                {CONTINENTS.map((c) => (
                  <option key={c} value={c}>
                    🌐 {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Selector */}
            <div>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
              >
                <option value="all">🌍 All Countries</option>
                {COUNTRIES_DATA.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.flagEmoji} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Degree Level */}
            <div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
              >
                <option value="all">🎓 Any Degree Level</option>
                <option value="BACHELOR">Bachelor's Degree</option>
                <option value="MASTER">Master's Degree (MSc)</option>
                <option value="PHD">Doctorate (PhD)</option>
              </select>
            </div>

            {/* IELTS Score Cap */}
            <div>
              <select
                value={maxIelts}
                onChange={(e) => setMaxIelts(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
              >
                <option value="">📝 Max IELTS Score</option>
                <option value="6.0">IELTS 6.0</option>
                <option value="6.5">IELTS 6.5</option>
                <option value="7.0">IELTS 7.0</option>
                <option value="7.5">IELTS 7.5+</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 gap-2">
            <div className="flex items-center gap-3">
              <span>
                Found <strong>{universities.length}</strong> verified university records
              </span>
              <span className="text-slate-300">|</span>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                Type:
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-slate-100 border-none rounded px-2 py-0.5 text-xs text-slate-800 font-semibold"
                >
                  <option value="all">All Institutions</option>
                  <option value="PUBLIC">Public Universities</option>
                  <option value="PRIVATE">Private Universities</option>
                </select>
              </label>
            </div>

            <button
              onClick={clearFilters}
              className="text-teal-700 font-semibold hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
          </div>
        ) : universities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((uni) => (
              <UniversityCard key={uni.id} university={uni} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No Universities Match Your Filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Try resetting your filters or broadening your continent, destination, and degree criteria.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-brand-navy text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
