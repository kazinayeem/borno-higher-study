import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
} from 'lucide-react';
import { getBlogArticles } from '../services/api';
import { ArticleItem } from '../types';

export const StudyGuidesPage: React.FC = () => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ADMISSIONS' | 'PLANNING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadStudyGuides() {
      setLoading(true);
      try {
        const categorySlug =
          activeTab === 'ADMISSIONS'
            ? 'admissions-eligibility'
            : activeTab === 'PLANNING'
            ? 'planning-careers'
            : undefined;

        const res = await getBlogArticles({
          category: categorySlug,
          search: searchQuery.trim() || undefined,
          limit: 30,
        });

        // If 'ALL', include both admissions and planning
        if (activeTab === 'ALL') {
          const filtered = res.articles.filter(
            (a) =>
              a.category?.slug === 'admissions-eligibility' ||
              a.category?.slug === 'planning-careers'
          );
          setArticles(filtered.length > 0 ? filtered : res.articles);
        } else {
          setArticles(res.articles);
        }
      } catch (err) {
        console.error('Failed to load study guides:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStudyGuides();
  }, [activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 mb-3">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              Academic Admissions & Student Planning Hub
            </div>
            <h1 className="text-3xl md:text-5xl font-heading font-semibold text-brand-navy tracking-tight">
              International Study & Admission Guides
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              In-depth analysis of SSC and HSC qualifications evaluated by international credential frameworks, GPA translations, prerequisite course audits, and step-by-step application planning.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            {[
              { label: 'All Guides', value: 'ALL' },
              { label: 'Academic Eligibility & Prerequisites', value: 'ADMISSIONS' },
              { label: 'Student Planning, Budgets & Careers', value: 'PLANNING' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as any)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  activeTab === tab.value
                    ? 'bg-[#0B192C] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Interactive Tool Banner */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-[#0B192C] to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Automated Evaluation
            </span>
            <h3 className="text-lg font-heading font-semibold text-white mt-1">
              Test Your Academic Qualifications In Real Time
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Input your Bangladesh SSC/HSC GPA or university CGPA to see matching requirements across 900+ global institutions.
            </p>
          </div>
          <Link
            to="/eligibility-checker"
            className="px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition shrink-0 shadow-2xs"
          >
            Launch Eligibility Checker &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-600">Loading study guides...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <article
                key={art.id}
                className="bg-white rounded-xl border border-slate-200/80 p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-card transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-800 border border-indigo-200">
                      {art.category?.name || 'Study Guide'}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 tabular-nums">
                      <Clock className="w-3 h-3" />
                      {art.readingTimeMinutes} min
                    </span>
                  </div>

                  <Link to={`/blog/${art.slug}`} className="group">
                    <h3 className="text-base font-heading font-semibold text-brand-navy group-hover:text-teal-700 transition leading-snug line-clamp-2 tracking-tight">
                      {art.title}
                    </h3>
                  </Link>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {art.summary}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium truncate max-w-[150px]">
                    {art.author?.name || 'Borno Editorial'}
                  </span>
                  <Link
                    to={`/blog/${art.slug}`}
                    className="font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 shrink-0"
                  >
                    Read Guide
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
