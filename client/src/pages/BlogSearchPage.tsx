import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Clock, ArrowRight, Filter, BookOpen, Sparkles } from 'lucide-react';
import { getBlogArticles, getBlogCategories } from '../services/api';
import { ArticleItem, ArticleCategoryItem } from '../types';

export const BlogSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [categories, setCategories] = useState<ArticleCategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDegree, setSelectedDegree] = useState<string>('ALL');
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await getBlogCategories();
        setCategories(cats);
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function executeSearch() {
      setLoading(true);
      try {
        const res = await getBlogArticles({
          search: queryParam.trim() || undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          degreeLevel: selectedDegree !== 'ALL' ? selectedDegree : undefined,
          limit: 30,
        });
        setArticles(res.articles);
        setTotal(res.total);
      } catch (err) {
        console.error('Failed to execute search:', err);
      } finally {
        setLoading(false);
      }
    }
    executeSearch();
  }, [queryParam, selectedCategory, selectedDegree]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchQuery.trim() ? { q: searchQuery.trim() } : {});
  };

  const handleQuickKeyword = (kw: string) => {
    setSearchQuery(kw);
    setSearchParams({ q: kw });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Search Header */}
      <header className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-heading font-semibold text-brand-navy tracking-tight">
              Search Educational Research & Guides
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Query across our catalog of 100+ verified guides, institutional matrices, and research explainers.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, institution, country, prerequisite, or IELTS band..."
              className="w-full pl-12 pr-28 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-sm text-sm sm:text-base"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs sm:text-sm font-semibold transition"
            >
              Search
            </button>
          </form>

          {/* Quick Keywords */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Popular:</span>
            {['Computer Science', 'DAAD Scholarship', 'IELTS UKVI', 'SSC HSC Evaluation', 'Post-Study Work', 'Oxford vs Cambridge'].map(
              (kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => handleQuickKeyword(kw)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  {kw}
                </button>
              )
            )}
          </div>
        </div>
      </header>

      {/* Main Results Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs sm:text-sm font-bold text-slate-800">
            {queryParam ? (
              <span>
                Search results for "<strong className="text-teal-700">{queryParam}</strong>" ({total})
              </span>
            ) : (
              <span>All Available Research & Guides ({total})</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Category:
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            <span className="text-slate-300">|</span>

            <div className="text-xs text-slate-600 font-semibold">Degree:</div>
            <select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800"
            >
              <option value="ALL">All Levels</option>
              <option value="UNDERGRADUATE">Undergraduate / BSc</option>
              <option value="POSTGRADUATE">Postgraduate / MSc</option>
              <option value="DOCTORAL">PhD / Doctoral</option>
            </select>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-600">Querying verified articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8 max-w-lg mx-auto">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No matching articles found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try broader keywords or reset the category and degree level filters.
            </p>
            <Link
              to="/blog"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
            >
              Browse all 100+ articles &rarr;
            </Link>
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
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {art.category?.name || 'Guide'}
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
