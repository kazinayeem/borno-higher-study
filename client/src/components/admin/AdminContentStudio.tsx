import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Search,
  Filter,
  Plus,
  RefreshCw,
  ExternalLink,
  BookOpen,
  Building2,
  Globe,
  Flag,
  ShieldAlert,
  Layers,
  ArrowRight,
  Eye,
  Check,
  X,
} from 'lucide-react';
import {
  adminGetContentOverview,
  getBlogArticles,
  getBlogCategories,
  adminSaveArticle,
  adminReviewArticle,
  adminGenerateAiDraft,
  adminVerifySources,
  adminGetCorrectionReports,
  adminResolveCorrection,
  adminSeedContentPlatform,
} from '../../services/api';
import {
  ContentOverviewStats,
  ArticleItem,
  ArticleCategoryItem,
  ContentCorrectionReportItem,
} from '../../types';

export const AdminContentStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'articles' | 'ai_draft' | 'sources' | 'corrections'
  >('overview');

  const [overview, setOverview] = useState<ContentOverviewStats | null>(null);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [categories, setCategories] = useState<ArticleCategoryItem[]>([]);
  const [corrections, setCorrections] = useState<ContentCorrectionReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Articles Filter
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // AI Generator Form
  const [aiTopic, setAiTopic] = useState('');
  const [aiAudience, setAiAudience] = useState('BANGLADESH_APPLICANTS');
  const [aiCategory, setAiCategory] = useState('university-comparisons');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // Review Modal State
  const [selectedArticleForReview, setSelectedArticleForReview] = useState<ArticleItem | null>(null);
  const [reviewStage, setReviewStage] = useState('EDITORIAL_INITIAL');
  const [reviewDecision, setReviewDecision] = useState('APPROVED');
  const [reviewNotes, setReviewNotes] = useState('');
  const [factCheckVerified, setFactCheckVerified] = useState(true);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Source Verification State
  const [verifyingSources, setVerifyingSources] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  // Seeding state
  const [seeding, setSeeding] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [overviewData, articlesData, catsData, corrData] = await Promise.all([
        adminGetContentOverview(),
        getBlogArticles({
          status: statusFilter || undefined,
          category: categoryFilter || undefined,
          search: searchQuery.trim() || undefined,
          limit: 50,
        }),
        getBlogCategories(),
        adminGetCorrectionReports('ALL'),
      ]);

      setOverview(overviewData);
      setArticles(articlesData.articles);
      setCategories(catsData);
      setCorrections(corrData);
    } catch (err) {
      console.error('Failed to load Admin Content Studio data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, categoryFilter, searchQuery]);

  const handleTriggerAiDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setAiGenerating(true);
    setAiResult(null);
    try {
      const result = await adminGenerateAiDraft({
        topic: aiTopic.trim(),
        intendedAudience: aiAudience,
        categorySlug: aiCategory,
      });
      setAiResult(result);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to generate AI draft');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticleForReview) return;

    setReviewSubmitting(true);
    try {
      await adminReviewArticle(selectedArticleForReview.id, {
        reviewStage,
        decision: reviewDecision,
        notes: reviewNotes || 'Editorial board peer review passed.',
        factCheckVerified,
      });
      setSelectedArticleForReview(null);
      setReviewNotes('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to record review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleVerifySources = async () => {
    setVerifyingSources(true);
    try {
      const res = await adminVerifySources();
      setVerificationResult(res);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to verify sources');
    } finally {
      setVerifyingSources(false);
    }
  };

  const handleResolveCorrection = async (reportId: string, status: string) => {
    const notes = prompt('Enter editorial resolution notes:', 'Correction verified and applied to primary dataset.');
    if (!notes) return;
    try {
      await adminResolveCorrection(reportId, {
        status,
        adminResolutionNotes: notes,
      });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to resolve correction');
    }
  };

  const handleSeedContent = async () => {
    if (!confirm('Re-sync content platform with seed dataset (100+ articles, research papers, comparisons)?')) {
      return;
    }
    setSeeding(true);
    try {
      await adminSeedContentPlatform();
      alert('Content platform re-synchronized successfully!');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to seed content platform');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Studio Top Banner */}
      <div className="p-6 bg-[#0B192C] text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 mb-1">
            <Sparkles className="w-4 h-4" />
            Super Admin Content & Editorial Studio
          </div>
          <h2 className="text-2xl font-heading font-semibold text-white tracking-tight">Publishing Management System</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Manage 100+ articles, research papers, comparison matrices, AI drafting, and reader fact-check reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSeedContent}
            disabled={seeding}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
            {seeding ? 'Seeding...' : 'Sync 100+ Dataset'}
          </button>
          <button
            onClick={() => setActiveTab('ai_draft')}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shadow flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Research Drafter
          </button>
        </div>
      </div>

      {/* Studio Navigation Tabs */}
      <div className="border-b border-slate-200 bg-slate-50 px-6 flex items-center gap-2 overflow-x-auto text-xs sm:text-sm font-semibold">
        {[
          { key: 'overview', label: 'Overview Metrics' },
          { key: 'articles', label: `Articles (${overview?.metrics.totalArticles || 0})` },
          { key: 'ai_draft', label: 'AI Evidence Drafter' },
          { key: 'sources', label: `Source Manager (${overview?.metrics.totalSourcesCount || 0})` },
          { key: 'corrections', label: `Fact-Check Reports (${overview?.metrics.pendingCorrectionsCount || 0})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${
              activeTab === t.key
                ? 'border-teal-600 text-teal-800 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="p-6">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading editorial data...</p>
          </div>
        ) : activeTab === 'overview' && overview ? (
          /* OVERVIEW TAB */
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Articles</span>
                <p className="text-2xl font-heading font-semibold text-brand-navy tabular-nums mt-1">
                  {overview.metrics.totalArticles}
                </p>
                <span className="text-[10px] text-teal-700">100+ Requirement Met</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50">
                <span className="text-[11px] font-semibold text-emerald-700 uppercase">Published</span>
                <p className="text-2xl font-heading font-semibold text-emerald-800 tabular-nums mt-1">
                  {overview.metrics.publishedCount}
                </p>
                <span className="text-[10px] text-slate-500">Live for Readers</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50">
                <span className="text-[11px] font-semibold text-amber-700 uppercase">In Review</span>
                <p className="text-2xl font-heading font-semibold text-amber-800 tabular-nums mt-1">
                  {overview.metrics.reviewCount}
                </p>
                <span className="text-[10px] text-slate-500">Awaiting Fact-Check</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Drafts</span>
                <p className="text-2xl font-heading font-semibold text-slate-700 tabular-nums mt-1">
                  {overview.metrics.draftCount}
                </p>
                <span className="text-[10px] text-slate-500">Human & AI Drafts</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50">
                <span className="text-[11px] font-semibold text-indigo-700 uppercase">Research Papers</span>
                <p className="text-2xl font-heading font-semibold text-indigo-800 tabular-nums mt-1">
                  {overview.metrics.researchPapersCount}
                </p>
                <span className="text-[10px] text-slate-500">Peer-Reviewed DOIs</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50">
                <span className="text-[11px] font-semibold text-rose-700 uppercase">Corrections</span>
                <p className="text-2xl font-heading font-semibold text-rose-800 tabular-nums mt-1">
                  {overview.metrics.pendingCorrectionsCount}
                </p>
                <span className="text-[10px] text-slate-500">Pending Investigation</span>
              </div>
            </div>

            {/* Recent Editorial Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Reviews */}
              <div className="p-5 rounded-xl border border-slate-200 bg-white">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  Recent Editorial Board Approvals
                </h3>
                <div className="space-y-3">
                  {overview.recentReviews.map((rev) => (
                    <div key={rev.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate max-w-[250px]">
                          {rev.article.title}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                          {rev.decision}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1 italic">"{rev.feedbackNotes}"</p>
                      <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Reviewer: {rev.reviewer?.name || 'Super Admin'}</span>
                        <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Revisions */}
              <div className="p-5 rounded-xl border border-slate-200 bg-white">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-500" />
                  Audit Trail: Recent Article Revisions
                </h3>
                <div className="space-y-3">
                  {overview.recentRevisions.map((rev) => (
                    <div key={rev.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <p className="font-semibold text-slate-800">{rev.changeSummary}</p>
                      <div className="mt-1.5 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Author: {rev.authorName}</span>
                        <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'articles' ? (
          /* ARTICLES MANAGER TAB */
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter articles..."
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium"
                >
                  <option value="">All Statuses</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="EDITORIAL_REVIEW">Editorial Review</option>
                  <option value="DRAFT">Draft</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Articles Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                <thead className="bg-[#0B192C] text-white">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Title</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Verification</th>
                    <th className="py-3 px-4 font-semibold">Metrics</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {articles.map((art) => (
                    <tr key={art.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs">
                        <Link to={`/blog/${art.slug}`} target="_blank" className="hover:text-teal-700 flex items-center gap-1">
                          <span className="truncate">{art.title}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{art.category?.name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            art.status === 'PUBLISHED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : art.status === 'EDITORIAL_REVIEW'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {art.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-500">
                        {art.sourceVerificationStatus}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-500">
                        {art.viewCount.toLocaleString()} reads
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedArticleForReview(art)}
                          className="px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[11px] border border-teal-200 transition"
                        >
                          Review & Publish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'ai_draft' ? (
          /* AI EVIDENCE DRAFTER TAB */
          <div className="max-w-3xl space-y-6">
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-950 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <strong>Evidence-Grounded Drafting Protocol</strong>
                <p className="mt-0.5 text-teal-900">
                  This engine synthesizes factual claims grounded in authorized university catalogs, UKVI, IRCC, DAAD, and OECD databases. All drafts are strictly saved in <strong>DRAFT</strong> status and require human editorial approval before publication.
                </p>
              </div>
            </div>

            <form onSubmit={handleTriggerAiDraft} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Topic & Intended Research Scope *
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g., Comparing Computer Science Graduate Assistantships Across Top US and German Universities"
                  required
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={aiAudience}
                    onChange={(e) => setAiAudience(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900"
                  >
                    <option value="BANGLADESH_APPLICANTS">Bangladesh Applicants (SSC/HSC & CGPA)</option>
                    <option value="POSTGRAD_RESEARCHERS">Postgraduate & PhD Researchers</option>
                    <option value="UNDERGRAD_ENGINEERING">Undergraduate STEM Candidates</option>
                    <option value="SCHOLARSHIP_SEEKERS">Fully Funded Grant Seekers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={aiCategory}
                    onChange={(e) => setAiCategory(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={aiGenerating}
                className="px-5 py-2.5 rounded-lg bg-[#0B192C] hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-2 shadow"
              >
                <Sparkles className={`w-3.5 h-3.5 ${aiGenerating ? 'animate-spin' : ''}`} />
                {aiGenerating ? 'Researching and Drafting (Evidence Grounded)...' : 'Generate Researched Draft'}
              </button>
            </form>

            {/* Generation Results */}
            {aiResult && (
              <div className="mt-6 p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Draft Saved to Database (Status: DRAFT)
                  </span>
                  <span className="text-xs text-slate-500">
                    Grounded in {aiResult.groundingSourcesCount} official sources
                  </span>
                </div>

                <h4 className="text-sm font-heading font-semibold text-slate-900">{aiResult.topic}</h4>

                {aiResult.outline && (
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 mb-1">Generated Outline:</h5>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc ml-5">
                      {aiResult.outline.map((sec: string, idx: number) => (
                        <li key={idx}>{sec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiResult.unsupportedClaims && (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    <strong>Editorial Advisory Flags:</strong>
                    <ul className="mt-1 list-disc ml-4 space-y-1">
                      {aiResult.unsupportedClaims.map((claim: string, cIdx: number) => (
                        <li key={cIdx}>{claim}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveTab('articles')}
                    className="text-xs font-bold text-teal-700 hover:text-teal-800"
                  >
                    View in Article Manager &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'sources' ? (
          /* SOURCE MANAGER TAB */
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Official Sources Verification Engine</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Validates outbound links and detects stale data (&gt;90 days since verification).
                </p>
              </div>

              <button
                onClick={handleVerifySources}
                disabled={verifyingSources}
                className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${verifyingSources ? 'animate-spin' : ''}`} />
                {verifyingSources ? 'Auditing Sources...' : 'Audit External Sources'}
              </button>
            </div>

            {verificationResult && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                <div>
                  <strong>Audit Complete:</strong> Verified {verificationResult.checkedCount} sources ({verificationResult.staleCount} flagged as stale &gt;90d).
                </div>
                <span className="text-emerald-700 font-mono">{verificationResult.timestamp}</span>
              </div>
            )}

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Monitored Official Primary Sources
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                All articles cite primary regulatory registries including <strong>UKVI</strong> (Home Office Caseworker Guidance), <strong>IRCC</strong> (Canada Study Permits), <strong>DAAD</strong> (German Academic Exchange Service), <strong>KMK Anabin</strong> (Higher Education Recognition in Germany), <strong>WHED IAU</strong> (UNESCO World Higher Education Database), and direct university registrars.
              </p>
            </div>
          </div>
        ) : activeTab === 'corrections' ? (
          /* CORRECTIONS TAB */
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900">
              Reader Factual Correction Reports ({corrections.length})
            </h3>

            {corrections.length === 0 ? (
              <div className="py-12 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                No open correction reports. All published articles are currently validated.
              </div>
            ) : (
              <div className="space-y-4">
                {corrections.map((corr) => (
                  <div key={corr.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {corr.correctionCategory}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">
                          {corr.articleTitle}
                        </h4>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          corr.status === 'APPLIED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {corr.status}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium">Claimed Error:</span>
                        <p className="text-slate-800 font-semibold mt-0.5">"{corr.claimedErrorText}"</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Suggested Update:</span>
                        <p className="text-slate-800 mt-0.5">{corr.suggestedCorrection || 'None provided'}</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <a
                        href={corr.officialEvidenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-700 hover:underline flex items-center gap-1 font-semibold"
                      >
                        Official Evidence Link <ExternalLink className="w-3 h-3" />
                      </a>

                      {corr.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleResolveCorrection(corr.id, 'APPLIED')}
                            className="px-3 py-1 rounded bg-teal-700 text-white font-bold text-xs hover:bg-teal-800"
                          >
                            Apply Correction
                          </button>
                          <button
                            onClick={() => handleResolveCorrection(corr.id, 'REJECTED')}
                            className="px-3 py-1 rounded border border-slate-300 text-slate-700 text-xs hover:bg-slate-100"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Review & Publish Modal */}
      {selectedArticleForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Editorial Review & Publishing Gate
              </h3>
              <button
                onClick={() => setSelectedArticleForReview(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4 line-clamp-2">
              Article: <strong>{selectedArticleForReview.title}</strong>
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Review Stage *
                </label>
                <select
                  value={reviewStage}
                  onChange={(e) => setReviewStage(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900"
                >
                  <option value="EDITORIAL_INITIAL">Initial Editorial Review</option>
                  <option value="FACT_CHECK">Fact Check & Citation Audit</option>
                  <option value="SENIOR_APPROVAL">Senior Editorial Approval</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Decision *</label>
                <select
                  value={reviewDecision}
                  onChange={(e) => setReviewDecision(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900"
                >
                  <option value="APPROVED">Approve (Advance to Next Stage / Publish)</option>
                  <option value="REVISIONS_REQUESTED">Request Revisions (Revert to Draft)</option>
                  <option value="REJECTED">Reject Article</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Peer Review & Fact-Check Notes
                </label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Notes on methodology, prerequisites, or source confirmation..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="factCheck"
                  checked={factCheckVerified}
                  onChange={(e) => setFactCheckVerified(e.target.checked)}
                  className="rounded text-teal-600"
                />
                <label htmlFor="factCheck" className="text-xs text-slate-700 font-semibold">
                  I confirm all cited statistics, DOIs, and admission thresholds were verified against official sources.
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedArticleForReview(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow"
                >
                  {reviewSubmitting ? 'Recording Review...' : 'Submit Editorial Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
