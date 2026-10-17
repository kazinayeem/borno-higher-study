import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getUniversities } from '../services/api.js';
import { COUNTRIES_DATA } from '../data/countriesData.js';
import { University } from '../types/index.js';
import { UniversityCard } from '../components/common/UniversityCard.js';
import { SeoHead } from '../components/common/SeoHead.js';
import { Pagination } from '../components/common/Pagination.js';
import { EmptyState } from '../components/common/EmptyState.js';
import { CardSkeleton } from '../components/common/LoadingSkeleton.js';
import { Search, Filter, GraduationCap, X, Globe, Building2, Sparkles, ArrowUpDown } from 'lucide-react';

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
  const [selectedContinent, setSelectedContinent] = useState(searchParams.get('continent') || 'All Continents');
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || 'all');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || 'all');
  const [maxIelts, setMaxIelts] = useState(searchParams.get('maxIelts') || '');
  const [sortBy, setSortBy] = useState<'ranking' | 'name' | 'acceptance'>('ranking');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

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
      setCurrentPage(1);
      setLoading(false);
    });
  }, [selectedContinent, selectedCountry, selectedType, selectedLevel, search, maxIelts]);

  const updateParam = (key: string, val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val && val !== 'all' && val !== 'All Continents') {
      next.set(key, val);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const handleContinentChange = (val: string) => {
    setSelectedContinent(val);
    updateParam('continent', val);
  };

  const handleCountryChange = (val: string) => {
    setSelectedCountry(val);
    updateParam('country', val);
  };

  const handleTypeChange = (val: string) => {
    setSelectedType(val);
    updateParam('type', val);
  };

  const handleLevelChange = (val: string) => {
    setSelectedLevel(val);
    updateParam('level', val);
  };

  const handleIeltsChange = (val: string) => {
    setMaxIelts(val);
    updateParam('maxIelts', val);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedContinent('All Continents');
    setSelectedCountry('all');
    setSelectedType('all');
    setSelectedLevel('all');
    setMaxIelts('');
    setSearchParams({});
    setCurrentPage(1);
  };

  // Sort
  const sortedUniversities = useMemo(() => {
    return [...universities].sort((a, b) => {
      if (sortBy === 'ranking') {
        const rankA = a.qsRanking || 9999;
        const rankB = b.qsRanking || 9999;
        return rankA - rankB;
      }
      if (sortBy === 'acceptance') {
        const accA = a.acceptanceRate || 100;
        const accB = b.acceptanceRate || 100;
        return accB - accA;
      }
      return a.name.localeCompare(b.name);
    });
  }, [universities, sortBy]);

  // Paginate
  const paginatedUniversities = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedUniversities.slice(start, start + pageSize);
  }, [sortedUniversities, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedUniversities.length / pageSize);

  // Active filter chips
  const activeChips = [
    search ? { key: 'search', label: `"${search}"`, onClear: () => setSearch('') } : null,
    selectedContinent !== 'All Continents' ? { key: 'continent', label: `Continent: ${selectedContinent}`, onClear: () => handleContinentChange('All Continents') } : null,
    selectedCountry !== 'all' ? { key: 'country', label: `Country: ${COUNTRIES_DATA.find((c) => c.slug === selectedCountry)?.name || selectedCountry}`, onClear: () => handleCountryChange('all') } : null,
    selectedType !== 'all' ? { key: 'type', label: `Type: ${selectedType}`, onClear: () => handleTypeChange('all') } : null,
    selectedLevel !== 'all' ? { key: 'level', label: `Level: ${selectedLevel}`, onClear: () => handleLevelChange('all') } : null,
    maxIelts ? { key: 'ielts', label: `IELTS ≤ ${maxIelts}`, onClear: () => handleIeltsChange('') } : null,
  ].filter(Boolean) as { key: string; label: string; onClear: () => void }[];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <SeoHead
        title="Explore 130+ Global Universities | Borno Higher Study"
        description="Search accredited universities across Europe, North America, Asia, Oceania, South America, and Africa. Filter by degree level, published tuition fees, and IELTS criteria."
        canonicalPath="/universities"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>100+ Verified Universities Milestone</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-navy">
            Explore Global Universities
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Search verified institutions cross-referenced with the UNESCO-IAU World Higher Education Database. Discover official admissions, tuition, and degrees.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
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
                onChange={(e) => handleContinentChange(e.target.value)}
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
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
              >
                <option value="all">🌍 All Destinations</option>
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
                onChange={(e) => handleLevelChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
              >
                <option value="all">🎓 Any Degree Level</option>
                <option value="BACHELOR">Bachelor's Degree</option>
                <option value="MASTER">Master's Degree</option>
                <option value="PHD">Doctorate (PhD)</option>
              </select>
            </div>

            {/* IELTS Score Cap */}
            <div>
              <select
                value={maxIelts}
                onChange={(e) => handleIeltsChange(e.target.value)}
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

          {/* Active Chips & Sort */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 font-medium">
                Found <strong>{sortedUniversities.length}</strong> verified university records
              </span>

              {activeChips.map((chip) => (
                <span
                  key={chip.key}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200"
                >
                  <span>{chip.label}</span>
                  <button
                    onClick={chip.onClear}
                    className="hover:text-rose-600 transition-colors"
                    aria-label={`Remove filter ${chip.label}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {activeChips.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-teal-700 hover:text-teal-800 font-semibold underline ml-1"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800"
                >
                  <option value="all">All Types</option>
                  <option value="PUBLIC">Public Universities</option>
                  <option value="PRIVATE">Private Universities</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800"
                >
                  <option value="ranking">QS World Ranking</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="acceptance">Acceptance Rate</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : paginatedUniversities.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedUniversities.map((uni) => (
                <UniversityCard key={uni.id} university={uni} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={sortedUniversities.length}
              pageSize={pageSize}
            />
          </>
        ) : (
          <EmptyState
            title="No Universities Match Your Filters"
            description="Try broadening your continent selection, resetting IELTS limits, or clearing search query to see all institutions."
            onReset={clearFilters}
          />
        )}
      </div>
    </div>
  );
};
