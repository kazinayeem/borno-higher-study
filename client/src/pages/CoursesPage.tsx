import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getPrograms, getSubjects } from '../services/api.js';
import { COUNTRIES_DATA } from '../data/countriesData.js';
import { ProgramItem, SubjectItem } from '../types/index.js';
import {
  BookOpen,
  Search,
  Layers,
  GraduationCap,
  Calendar,
  ExternalLink,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || 'all');
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || 'all');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || 'all');

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
      setLoading(false);
    });
  }, [selectedCountry, selectedLevel, selectedSubject, search]);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            <BookOpen className="w-4 h-4 text-teal-600" />
            <span>Academic Discipline & Course Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-navy">
            Explore Verified Degree Programs
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Discover verified Computer Science, Software Engineering, AI, and Engineering degree courses across our 30 destination network.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search program title, discipline…"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Subject Selector */}
            <div>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
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
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
              >
                <option value="all">🌍 All 30 Countries</option>
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
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
              >
                <option value="all">🎓 Any Level</option>
                <option value="BACHELOR">Bachelor's Degree</option>
                <option value="MASTER">Master's Degree</option>
                <option value="PHD">Doctorate (PhD)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map((prog) => (
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
                    <span className="text-slate-400 block">Annual Tuition</span>
                    <span className="font-extrabold text-brand-navy text-sm">
                      {prog.currencyCode} {prog.annualTuitionLocal.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-center">
                    <span className="text-slate-400 block">Min IELTS</span>
                    <span className="font-bold text-teal-700 text-sm">{prog.ieltsOverall}</span>
                  </div>

                  <Link
                    to={`/courses/${prog.id}`}
                    className="px-4 py-2 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white font-bold"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
