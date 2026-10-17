import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Sparkles,
  Award,
  Globe,
  Building2,
  GraduationCap,
  FileCheck2,
  Compass,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Filter,
  CheckCircle2,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { getBlogArticles, getBlogCategories, getUniversityComparisons, getCountryComparisons } from '../services/api';
import { ArticleItem, ArticleCategoryItem, UniversityComparisonItem, CountryComparisonItem } from '../types';

export const BlogHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ArticleCategoryItem[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<ArticleItem[]>([]);
  const [latestArticles, setLatestArticles] = useState<ArticleItem[]>([]);
  const [mostReadArticles, setMostReadArticles] = useState<ArticleItem[]>([]);
  const [editorPicks, setEditorPicks] = useState<ArticleItem[]>([]);
  const [universityComparisons, setUniversityComparisons] = useState<UniversityComparisonItem[]>([]);
  const [countryComparisons, setCountryComparisons] = useState<CountryComparisonItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDegree, setSelectedDegree] = useState<string>('ALL');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [catsRes, featRes, latestRes, mostReadRes, picksRes, uCompRes, cCompRes] =
          await Promise.all([
            getBlogCategories(),
            getBlogArticles({ featured: true, limit: 3 }),
            getBlogArticles({ sortBy: 'latest', limit: 9 }),
            getBlogArticles({ sortBy: 'most_read', limit: 5 }),
            getBlogArticles({ editorPick: true, limit: 4 }),
            getUniversityComparisons(),
            getCountryComparisons(),
          ]);

        setCategories(catsRes);
        setFeaturedArticles(featRes.articles);
        setLatestArticles(latestRes.articles);
        setMostReadArticles(mostReadRes.articles);
        setEditorPicks(picksRes.articles);
        setUniversityComparisons(uCompRes);
        setCountryComparisons(cCompRes);
      } catch (err) {
        console.error('Failed to load blog home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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

  const heroArticle = featuredArticles[0] || latestArticles[0];
  const secondaryFeatured = featuredArticles.slice(1, 3);

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-slate-800">
      {/* Editorial Header / Masthead */}
      <header className="bg-white border-b border-slate-200 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 mb-3 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                <span className="tracking-wide uppercase text-[11px] text-slate-600 font-semibold">Independent Education Research & Publishing</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-heading font-semibold text-brand-navy tracking-tight">
                Research Library & Policy Guides
              </h1>
              <p className="mt-2 text-base md:text-lg text-slate-600 max-w-3xl leading-relaxed">
                Over 100+ independently researched guides, university comparison matrices, scholarship funding methodologies, and peer-reviewed education research explainers.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
              <Link
                to="/compare/universities"
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                University Comparisons
              </Link>
              <Link
                to="/compare/countries"
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                Country Matrices
              </Link>
              <Link
                to="/research"
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                Research Library
              </Link>
              <Link
                to="/scholarships/guides"
                className="px-3.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition"
              >
                Scholarship Guides
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <form onSubmit={handleSearchSubmit} className="relative max-w-3xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 100+ articles by topic, university, country, IELTS score, or keyword..."
                className="w-full pl-12 pr-28 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent shadow-sm text-sm md:text-base"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-sm font-semibold transition shadow-sm"
              >
                Search
              </button>
            </form>
          </div>

          {/* Category Navigation Pills */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition ${
                selectedCategory === 'all'
                  ? 'bg-[#0B192C] text-white shadow'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All Articles (100+)
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition flex items-center gap-1.5 ${
                  selectedCategory === cat.slug
                    ? 'bg-[#0B192C] text-white shadow'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat.name}
                {cat.articleCount !== undefined && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                      selectedCategory === cat.slug ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {cat.articleCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Loading verified educational guides...</p>
          </div>
        ) : (
          <>
            {/* Featured Article Section */}
            {heroArticle && selectedCategory === 'all' && (
              <section className="mb-14">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Hero Card */}
                  <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
                    <div className="p-6 md:p-8">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
                          {heroArticle.category?.name || 'Featured Analysis'}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {heroArticle.readingTimeMinutes} min read
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">
                          Reviewed {new Date(heroArticle.lastReviewedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <Link to={`/blog/${heroArticle.slug}`} className="group">
                        <h2 className="text-2xl md:text-3xl font-heading font-semibold text-brand-navy group-hover:text-teal-700 transition leading-tight tracking-tight">
                          {heroArticle.title}
                        </h2>
                      </Link>

                      <p className="mt-4 text-slate-600 text-base md:text-lg leading-relaxed line-clamp-3">
                        {heroArticle.summary}
                      </p>

                      <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                            {heroArticle.author?.name ? heroArticle.author.name.charAt(0) : 'B'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {heroArticle.author?.name || 'Borno Editorial Board'}
                            </p>
                            <p className="text-xs text-slate-500">
                              {heroArticle.author?.roleTitle || 'Research Specialist'}
                            </p>
                          </div>
                        </div>

                        <Link
                          to={`/blog/${heroArticle.slug}`}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800"
                        >
                          Read Full Article
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Featured / Highlights */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-card">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-teal-600" />
                        Editor's Research Picks
                      </h3>

                      <div className="space-y-4">
                        {editorPicks.slice(0, 3).map((pick) => (
                          <div key={pick.id} className="pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                            <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider">
                              {pick.category?.name}
                            </span>
                            <Link
                              to={`/blog/${pick.slug}`}
                              className="block text-sm font-heading font-semibold text-brand-navy hover:text-teal-700 transition mt-1 leading-snug line-clamp-2"
                            >
                              {pick.title}
                            </Link>
                            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 tabular-nums">
                              <span>{pick.readingTimeMinutes} min read</span>
                              <span>•</span>
                              <span>{pick.viewCount.toLocaleString()} reads</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Comparative Tool Callout */}
                    <div className="bg-brand-navy text-white p-6 rounded-xl shadow-card">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-teal-500 text-white mb-2">
                        Institutional Matrices
                      </span>
                      <h4 className="text-base font-heading font-semibold text-white tracking-tight">
                        Compare Global Universities Responsibly
                      </h4>
                      <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                        Examine faculty ratios, degree accreditation, research expenditure, and verified living costs without commercial ranking distortions.
                      </p>
                      <Link
                        to="/compare/universities"
                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-300 hover:text-teal-200"
                      >
                        Explore University Matrices
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Main Articles Grid with Filters */}
            <section className="mb-14">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-heading font-semibold text-brand-navy tracking-tight">
                    {selectedCategory === 'all'
                      ? 'Comprehensive Research & Guides'
                      : categories.find((c) => c.slug === selectedCategory)?.name || 'Articles'}
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Every article verified by Borno's Academic Review Board with primary statutory references.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    Level:
                  </div>
                  <select
                    value={selectedDegree}
                    onChange={(e) => setSelectedDegree(e.target.value)}
                    className="text-xs font-medium border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
                  >
                    <option value="ALL">All Levels</option>
                    <option value="UNDERGRADUATE">Undergraduate / BSc</option>
                    <option value="POSTGRADUATE">Postgraduate / MSc</option>
                    <option value="DOCTORAL">PhD / Doctoral</option>
                  </select>
                </div>
              </div>

              {/* Grid of Articles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestArticles
                  .filter((art) => {
                    if (selectedCategory !== 'all' && art.category?.slug !== selectedCategory) {
                      return false;
                    }
                    if (selectedDegree !== 'ALL' && art.degreeLevel !== selectedDegree && art.degreeLevel !== 'ALL') {
                      return false;
                    }
                    return true;
                  })
                  .map((article) => (
                    <article
                      key={article.id}
                      className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                            {article.category?.name || 'Guide'}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readingTimeMinutes} min
                          </span>
                        </div>

                        <Link to={`/blog/${article.slug}`} className="group">
                          <h3 className="text-base font-heading font-semibold text-brand-navy group-hover:text-teal-700 transition leading-snug line-clamp-2">
                            {article.title}
                          </h3>
                        </Link>

                        <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">
                          {article.summary}
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">
                          {article.author?.name || 'Borno Editorial Board'}
                        </span>
                        <Link
                          to={`/blog/${article.slug}`}
                          className="font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                        >
                          Read Guide
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </article>
                  ))}
              </div>

              {/* Browse All or Load More */}
              <div className="mt-8 text-center">
                <Link
                  to="/blog/categories"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-2xs transition"
                >
                  Explore All 8 Categories & 100+ Guides
                  <ArrowRight className="w-4 h-4 text-teal-600" />
                </Link>
              </div>
            </section>

            {/* University & Country Comparison Highlight Section */}
            <section className="mb-14 bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-card">
              <div className="max-w-3xl mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
                  Data-Driven Matrices
                </span>
                <h2 className="text-2xl font-heading font-semibold text-brand-navy tracking-tight mt-2">
                  Featured University & Destination Comparisons
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Side-by-side criteria evaluation tables with statutory data collection dates and transparent methodologies.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* University Comparison Card */}
                {universityComparisons.slice(0, 1).map((uComp) => (
                  <div key={uComp.id} className="p-5 rounded-xl border border-slate-200/80 bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
                        <Building2 className="w-4 h-4" />
                        University Matrix
                      </div>
                      <h3 className="text-lg font-heading font-semibold text-brand-navy tracking-tight">
                        {uComp.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {uComp.summaryNotes}
                      </p>

                      <div className="mt-4 space-y-2">
                        {uComp.dataPoints?.slice(0, 3).map((dp) => (
                          <div key={dp.id} className="text-xs flex items-center justify-between p-2 rounded bg-white border border-slate-200/80">
                            <span className="font-semibold text-slate-700">{dp.entityIdentifier}</span>
                            <span className="text-slate-600 tabular-nums">{dp.attributeValue}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link
                      to="/compare/universities"
                      className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800"
                    >
                      View Full University Comparison Matrix
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}

                {/* Country Comparison Card */}
                {countryComparisons.slice(0, 1).map((cComp) => (
                  <div key={cComp.id} className="p-5 rounded-xl border border-slate-200/80 bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
                        <Globe className="w-4 h-4" />
                        Country Matrix
                      </div>
                      <h3 className="text-lg font-heading font-semibold text-brand-navy tracking-tight">
                        {cComp.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {cComp.summaryNotes}
                      </p>

                      <div className="mt-4 space-y-2">
                        {cComp.dataPoints?.slice(0, 3).map((dp) => (
                          <div key={dp.id} className="text-xs flex items-center justify-between p-2 rounded bg-white border border-slate-200/80">
                            <span className="font-semibold text-slate-700">{dp.entityIdentifier}</span>
                            <span className="text-slate-600 tabular-nums">{dp.attributeValue}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link
                      to="/compare/countries"
                      className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800"
                    >
                      View Full Country Comparison Matrix
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            {/* Most Read Articles & Editorial Integrity Banner */}
            <section className="mb-14">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Most Read Column */}
                <div className="lg:col-span-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-heading font-semibold text-brand-navy tracking-tight flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-teal-600" />
                      Most-Read Educational Guides
                    </h3>
                    <span className="text-xs text-slate-500">Based on verified reader metrics</span>
                  </div>

                  <div className="space-y-4">
                    {mostReadArticles.map((art, idx) => (
                      <div
                        key={art.id}
                        className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-start gap-4 hover:border-slate-300 transition"
                      >
                        <span className="text-2xl font-heading font-semibold text-slate-300 tabular-nums w-6 text-center">
                          {idx + 1}
                        </span>
                        <div className="flex-1">
                          <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider">
                            {art.category?.name}
                          </span>
                          <Link
                            to={`/blog/${art.slug}`}
                            className="block text-base font-heading font-semibold text-brand-navy hover:text-teal-700 transition leading-snug"
                          >
                            {art.title}
                          </Link>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                            <span>{art.author?.name || 'Borno Editorial'}</span>
                            <span>•</span>
                            <span>{art.readingTimeMinutes} min read</span>
                            <span>•</span>
                            <span>{art.viewCount.toLocaleString()} views</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Editorial Quality & Verification Pledge */}
                <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 self-start">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-700" />
                  </div>
                  <h4 className="text-base font-bold text-[#0B192C]">
                    Borno Editorial Integrity Standard
                  </h4>
                  <ul className="mt-3 space-y-2 text-xs text-slate-600 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold">✓</span>
                      <span><strong>Verified Citations</strong>: All claims cited directly from primary university catalogs or immigration statutes.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold">✓</span>
                      <span><strong>No Paid Rankings</strong>: We never accept financial compensation to favor an institution or study destination.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold">✓</span>
                      <span><strong>Human Fact-Checking</strong>: AI drafts undergo strict peer and editorial review prior to publication.</span>
                    </li>
                  </ul>

                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <Link
                      to="/research"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
                    >
                      Read Research Methodology
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};
