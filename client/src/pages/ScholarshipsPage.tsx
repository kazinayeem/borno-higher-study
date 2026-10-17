import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getScholarships } from '../services/api.js';
import { COUNTRIES_DATA } from '../data/countriesData.js';
import { Scholarship } from '../types/index.js';
import { ScholarshipCard } from '../components/common/ScholarshipCard.js';
import { SeoHead } from '../components/common/SeoHead.js';
import { Pagination } from '../components/common/Pagination.js';
import { EmptyState } from '../components/common/EmptyState.js';
import { CardSkeleton } from '../components/common/LoadingSkeleton.js';
import { Award, Search, Filter, CheckCircle2, X, ArrowUpDown } from 'lucide-react';

export const ScholarshipsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || 'all');
  const [selectedDegree, setSelectedDegree] = useState(searchParams.get('degree') || 'all');
  const [fullyFundedOnly, setFullyFundedOnly] = useState(searchParams.get('fullyFunded') === 'true');
  const [bangladeshOnly, setBangladeshOnly] = useState(searchParams.get('bangladeshOnly') === 'true');
  const [sortBy, setSortBy] = useState<'name' | 'coverage' | 'deadline'>('coverage');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

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
      setCurrentPage(1);
      setLoading(false);
    });
  }, [selectedCountry, fullyFundedOnly, bangladeshOnly, search]);

  const updateParam = (key: string, val: string | boolean) => {
    const next = new URLSearchParams(searchParams);
    if (val && val !== 'all') {
      next.set(key, String(val));
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const handleCountryChange = (val: string) => {
    setSelectedCountry(val);
    updateParam('country', val);
  };

  const handleDegreeChange = (val: string) => {
    setSelectedDegree(val);
    updateParam('degree', val);
  };

  const handleFullyFundedToggle = (val: boolean) => {
    setFullyFundedOnly(val);
    updateParam('fullyFunded', val);
  };

  const handleBangladeshToggle = (val: boolean) => {
    setBangladeshOnly(val);
    updateParam('bangladeshOnly', val);
  };

  const resetAllFilters = () => {
    setSearch('');
    setSelectedCountry('all');
    setSelectedDegree('all');
    setFullyFundedOnly(false);
    setBangladeshOnly(false);
    setSearchParams({});
    setCurrentPage(1);
  };

  // Filter by degree level on client
  const filteredScholarships = useMemo(() => {
    return scholarships.filter((s) => {
      if (selectedDegree !== 'all') {
        if (!s.degreeLevels.includes(selectedDegree as any)) return false;
      }
      return true;
    });
  }, [scholarships, selectedDegree]);

  // Sort
  const sortedScholarships = useMemo(() => {
    return [...filteredScholarships].sort((a, b) => {
      if (sortBy === 'coverage') {
        if (a.isFullyFunded && !b.isFullyFunded) return -1;
        if (!a.isFullyFunded && b.isFullyFunded) return 1;
        return b.coveragePercent - a.coveragePercent;
      }
      if (sortBy === 'deadline') {
        return a.deadlineDate.localeCompare(b.deadlineDate);
      }
      return a.name.localeCompare(b.name);
    });
  }, [filteredScholarships, sortBy]);

  // Paginate
  const paginatedScholarships = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedScholarships.slice(start, start + pageSize);
  }, [sortedScholarships, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedScholarships.length / pageSize);

  // Active filter chips
  const activeChips = [
    search ? { key: 'search', label: `"${search}"`, onClear: () => setSearch('') } : null,
    selectedCountry !== 'all' ? { key: 'country', label: `Destination: ${COUNTRIES_DATA.find((c) => c.slug === selectedCountry)?.name || selectedCountry}`, onClear: () => handleCountryChange('all') } : null,
    selectedDegree !== 'all' ? { key: 'degree', label: `Degree: ${selectedDegree}`, onClear: () => handleDegreeChange('all') } : null,
    fullyFundedOnly ? { key: 'fullyFunded', label: '🌟 Fully Funded', onClear: () => handleFullyFundedToggle(false) } : null,
    bangladeshOnly ? { key: 'bangladeshOnly', label: '🇧🇩 Open to Bangladesh', onClear: () => handleBangladeshToggle(false) } : null,
  ].filter(Boolean) as { key: string; label: string; onClear: () => void }[];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <SeoHead
        title="World Scholarships — Global Government Grants & Funding | Borno Higher Study"
        description="Explore 20 verified worldwide government scholarship schemes including Erasmus Mundus, DAAD, Chevening, Commonwealth, Fulbright, MEXT, and GKS. Full funding, stipend, and official application links."
        canonicalPath="/scholarships"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>World Scholarships Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-navy">
            World Scholarships
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Official government-funded international education programs, multilateral schemes, and national scholarship portals verified for global and Bangladeshi applicants.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search scholarship name, funding government, or provider (e.g. Erasmus, DAAD, Chevening)…"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
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
                onChange={(e) => handleDegreeChange(e.target.value)}
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
                  onChange={(e) => handleFullyFundedToggle(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                />
                <span>🌟 Fully Funded (100% Tuition + Monthly Stipend)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={bangladeshOnly}
                  onChange={(e) => handleBangladeshToggle(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                />
                <span>🇧🇩 Open to Bangladeshi Citizens</span>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-slate-500 font-medium">
                Found <strong>{sortedScholarships.length}</strong> verified opportunities
              </span>

              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800"
                >
                  <option value="coverage">Coverage (Highest First)</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="deadline">Upcoming Deadline</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
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

              <button
                onClick={resetAllFilters}
                className="text-teal-700 hover:text-teal-800 font-semibold underline ml-1"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : paginatedScholarships.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedScholarships.map((sch) => (
                <ScholarshipCard key={sch.id} scholarship={sch} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={sortedScholarships.length}
              pageSize={pageSize}
            />
          </>
        ) : (
          <EmptyState
            title="No Scholarships Match Your Criteria"
            description="Try turning off the fully funded filter or selecting 'All Host Destinations' to discover more funding options."
            onReset={resetAllFilters}
          />
        )}
      </div>
    </div>
  );
};
