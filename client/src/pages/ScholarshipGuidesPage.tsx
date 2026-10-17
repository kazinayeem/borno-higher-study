import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Sparkles,
} from 'lucide-react';
import { getBlogArticles } from '../services/api';
import { ArticleItem } from '../types';

export const ScholarshipGuidesPage: React.FC = () => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    async function loadScholarshipGuides() {
      setLoading(true);
      try {
        const res = await getBlogArticles({
          category: 'scholarships-funding',
          search: searchQuery.trim() || undefined,
          limit: 30,
        });
        setArticles(res.articles);
      } catch (err) {
        console.error('Failed to load scholarship guides:', err);
      } finally {
        setLoading(false);
      }
    }
    loadScholarshipGuides();
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-3">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Verified Funding & Grants Intelligence
            </div>
            <h1 className="text-3xl md:text-5xl font-heading font-semibold text-brand-navy tracking-tight">
              International Scholarships & Funding Guides
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Researched step-by-step guides on fully funded government grants, graduate research assistantships (RA/TA), tuition waiver calculations, timeline planning, and scam identification.
            </p>
          </div>

          {/* Search bar */}
          <div className="mt-6 max-w-lg">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scholarship guides (e.g., DAAD, RA/TA, Scams)..."
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Editorial Notice on Scam Prevention */}
        <div className="mb-8 p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Strict Editorial Policy on Legitimate Funding</strong>
            <p className="mt-1 text-amber-900 leading-relaxed">
              Legitimate international university and government scholarships never require application processing fees or deposit guarantees through unauthorized intermediaries. We only publish verified funding frameworks grounded in official university bursary and government ministries.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-600">Loading scholarship guides...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <article
                key={art.id}
                className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                      Scholarship Guide
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
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
