import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  Building2,
  Globe,
  Award,
  GraduationCap,
  FileCheck2,
  Compass,
  Calendar,
  Clock,
  ArrowRight,
  Filter,
  Search,
} from 'lucide-react';
import { getBlogCategories, getBlogArticles } from '../services/api';
import { ArticleCategoryItem, ArticleItem } from '../types';

export const BlogCategoriesPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [categories, setCategories] = useState<ArticleCategoryItem[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [degreeLevel, setDegreeLevel] = useState('ALL');
  const [sortBy, setSortBy] = useState<'latest' | 'most_read' | 'title'>('latest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const cats = await getBlogCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const res = await getBlogArticles({
          category: slug,
          degreeLevel: degreeLevel !== 'ALL' ? degreeLevel : undefined,
          search: searchQuery.trim() || undefined,
          sortBy,
          limit: 30,
        });
        setArticles(res.articles);
        setTotal(res.total);
      } catch (err) {
        console.error('Failed to load articles for category:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [slug, degreeLevel, sortBy, searchQuery]);

  const activeCategory = categories.find((c) => c.slug === slug);

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-5 h-5 text-teal-600" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-blue-600" />;
      case 'Award':
        return <Award className="w-5 h-5 text-amber-600" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-indigo-600" />;
      case 'FileCheck2':
        return <FileCheck2 className="w-5 h-5 text-emerald-600" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-purple-600" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-rose-600" />;
      case 'Calendar':
        return <Calendar className="w-5 h-5 text-cyan-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Category Masthead */}
      <header className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <Link to="/blog" className="hover:text-teal-700 font-medium">
                Research & Guides Hub
              </Link>
              <span>/</span>
              <span>{activeCategory ? activeCategory.name : 'All Categories'}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-heading font-semibold text-brand-navy tracking-tight">
              {activeCategory ? activeCategory.name : 'Editorial Knowledge Categories'}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
              {activeCategory
                ? activeCategory.description
                : 'Browse our peer-reviewed knowledge bases across university comparisons, admission policies, scholarship schemes, English testing, and immigration rules.'}
            </p>
          </div>

          {/* Category Cards Navigation */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/blog/category/${cat.slug}`}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-between ${
                  slug === cat.slug
                    ? 'bg-[#0B192C] text-white border-[#0B192C] shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-100/50 mb-1.5">
                  {getCategoryIcon(cat.iconName)}
                </div>
                <span className="text-xs font-bold leading-tight line-clamp-2">
                  {cat.name}
                </span>
                <span
                  className={`text-[10px] mt-1.5 px-1.5 py-0.2 rounded-full ${
                    slug === cat.slug ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {cat.articleCount ?? 0} guides
                </span>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content & Articles Filter Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Degree:
            </div>
            <select
              value={degreeLevel}
              onChange={(e) => setDegreeLevel(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800"
            >
              <option value="ALL">All Levels</option>
              <option value="UNDERGRADUATE">Undergraduate / BSc</option>
              <option value="POSTGRADUATE">Postgraduate / MSc</option>
              <option value="DOCTORAL">PhD / Doctoral</option>
            </select>

            <span className="text-slate-300">|</span>

            <div className="text-xs text-slate-600 font-semibold">Sort:</div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800"
            >
              <option value="latest">Latest Published</option>
              <option value="most_read">Most Read</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong>{articles.length}</strong> of <strong>{total}</strong> verified articles
          </span>
          {slug && (
            <Link to="/blog/categories" className="text-teal-700 hover:underline font-semibold">
              Clear category filter
            </Link>
          )}
        </div>

        {/* Articles List */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-600">Loading guides...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8">
            <p className="text-sm font-semibold text-slate-800">No articles match your active filter.</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the degree level or search keywords.</p>
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
