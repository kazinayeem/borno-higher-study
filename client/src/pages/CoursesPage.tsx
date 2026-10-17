import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getPrograms, getSubjects } from '../services/api.js';
import { COUNTRIES_DATA } from '../data/countriesData.js';
import { ProgramItem, SubjectItem } from '../types/index.js';
import { SeoHead } from '../components/common/SeoHead.js';
import { Pagination } from '../components/common/Pagination.js';
import { EmptyState } from '../components/common/EmptyState.js';
import { CardSkeleton } from '../components/common/LoadingSkeleton.js';
import {
  BookOpen,
  Search,
  Filter,
  X,
  ArrowUpDown,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || 'all');
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || 'all');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || 'all');
  const [sortBy, setSortBy] = useState<'name' | 'tuition-asc' | 'tuition-desc' | 'duration'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubjects().then((res) => setSubjects(res.subjects));
  }, []);

  useEffect(() => {
    setLoading(true);
    getPrograms({
      country: selectedCountry,
      level: selectedLevel,
      subject: selectedSubject,
      search,
    }).then((res) => {
      setPrograms(res.programs);
      setCurrentPage(1);
      setLoading(false);
    });
  }, [selectedCountry, selectedLevel, selectedSubject, search]);

  // Sync to URL
  const updateFilterParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const handleCountryChange = (val: string) => {
    setSelectedCountry(val);
    updateFilterParam('country', val);
  };

  const handleSubjectChange = (val: string) => {
    setSelectedSubject(val);
    updateFilterParam('subject', val);
  };

  const handleLevelChange = (val: string) => {
    setSelectedLevel(val);
    updateFilterParam('level', val);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCountry('all');
    setSelectedSubject('all');
    setSelectedLevel('all');
    setSearchParams({});
    setCurrentPage(1);
  };

  // Sort
  const sortedPrograms = useMemo(() => {
    return [...programs].sort((a, b) => {
      if (sortBy === 'tuition-asc') return a.annualTuitionLocal - b.annualTuitionLocal;
      if (sortBy === 'tuition-desc') return b.annualTuitionLocal - a.annualTuitionLocal;
      if (sortBy === 'duration') return a.durationMonths - b.durationMonths;
      return a.name.localeCompare(b.name);
    });
  }, [programs, sortBy]);

  // Paginate
  const paginatedPrograms = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedPrograms.slice(start, start + pageSize);
  }, [sortedPrograms, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedPrograms.length / pageSize);

  // Active filter chips
  const activeChips = [
    search ? { key: 'search', label: `"${search}"`, onClear: () => setSearch('') } : null,
    selectedCountry !== 'all'
      ? { key: 'country', label: `Country: ${COUNTRIES_DATA.find((c) => c.slug === selectedCountry)?.name || selectedCountry}`, onClear: () => handleCountryChange('all') }
      : null,
    selectedSubject !== 'all'
      ? { key: 'subject', label: `Subject: ${selectedSubject}`, onClear: () => handleSubjectChange('all') }
      : null,
    selectedLevel !== 'all'
      ? { key: 'level', label: `Degree: ${selectedLevel}`, onClear: () => handleLevelChange('all') }
      : null,
  ].filter(Boolean) as { key: string; label: string; onClear: () => void }[];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <SeoHead
        title="Explore Verified Degree Programs & Courses | Borno Higher Study"
        description="Search verified Bachelor's, Master's, and Doctoral programs across 30 international destinations. Compare annual tuition fees, credit structures, and IELTS requirements."
        canonicalPath="/courses"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            <BookOpen className="w-3.5 h-3.5 text-teal-600" />
            <span>Searchable Academic Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-navy">
            Explore Degree Programs
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Search verified degrees in Computer Science, AI, Engineering, Business, and Health Sciences. Verified against institutional course schedules.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search program title, discipline, or keywords…"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Subject Selector */}
            <div>
              <select
                value={selectedSubject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
              >
                <option value="all">📚 All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.slug} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination */}
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

            {/* Level */}
            <div>
              <select
                value={selectedLevel}
                onChange={(e) => handleLevelChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
              >
                <option value="all">🎓 Any Level</option>
                <option value="BACHELOR">Bachelor's Degree</option>
                <option value="MASTER">Master's Degree</option>
                <option value="PHD">Doctorate (PhD)</option>
              </select>
            </div>
          </div>

          {/* Active Chips & Sort */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 font-medium">
                Found <strong>{sortedPrograms.length}</strong> degree programs
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
                  onClick={handleResetFilters}
                  className="text-teal-700 hover:text-teal-800 font-semibold underline ml-1"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="sort-by" className="text-slate-500 font-medium">Sort by:</label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800"
              >
                <option value="name">Name (A-Z)</option>
                <option value="tuition-asc">Tuition: Low to High</option>
                <option value="tuition-desc">Tuition: High to Low</option>
                <option value="duration">Duration (Shortest)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : paginatedPrograms.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedPrograms.map((prog) => (
                <div
                  key={prog.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card hover:border-teal-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60">
                        {prog.degreeLevel} • {prog.subject}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {prog.durationMonths} Months ({prog.creditsEcts} ECTS)
                      </span>
                    </div>

                    <Link to={`/courses/${prog.id}`} className="block">
                      <h3 className="text-lg font-bold text-brand-navy hover:text-teal-600 transition-colors">
                        {prog.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-500 mt-1">
                      Offered by <strong>{prog.universityName}</strong> • {prog.countryName}
                    </p>

                    <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                      {prog.prerequisites}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Annual Tuition</span>
                      <span className="font-extrabold text-brand-navy text-sm">
                        {prog.currencyCode} {prog.annualTuitionLocal.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-center">
                      <span className="text-slate-400 block text-[11px]">Min IELTS</span>
                      <span className="font-bold text-teal-700 text-sm">{prog.ieltsOverall}</span>
                    </div>

                    <Link
                      to={`/courses/${prog.id}`}
                      className="px-4 py-2 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white font-bold transition-colors shadow-xs"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={sortedPrograms.length}
              pageSize={pageSize}
            />
          </>
        ) : (
          <EmptyState
            title="No Degree Programs Match Your Filters"
            description="Try selecting a different academic discipline, clearing your search query, or choosing 'All Destinations'."
            onReset={handleResetFilters}
          />
        )}
      </div>
    </div>
  );
};
