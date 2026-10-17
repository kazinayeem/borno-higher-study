import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  Calendar,
  CheckCircle2,
  Bookmark,
  Share2,
  Printer,
  Copy,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Flag,
  ArrowRight,
  UserCheck,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';
import {
  getBlogArticleBySlug,
  toggleArticleBookmark,
  checkArticleIsBookmarked,
  submitContentCorrection,
} from '../services/api';
import { ArticleItem } from '../types';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Interaction states
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Correction Modal State
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionCategory, setCorrectionCategory] = useState('FACTUAL_ERROR');
  const [claimedErrorText, setClaimedErrorText] = useState('');
  const [suggestedCorrection, setSuggestedCorrection] = useState('');
  const [officialEvidenceUrl, setOfficialEvidenceUrl] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [correctionSubmitted, setCorrectionSubmitted] = useState(false);
  const [correctionSubmitting, setCorrectionSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    async function fetchArticle() {
      setLoading(true);
      setError(null);
      try {
        const data = await getBlogArticleBySlug(slug!);
        setArticle(data);
        setBookmarkCount(data.bookmarkCount);

        // Check if user has bookmarked
        try {
          const bmStatus = await checkArticleIsBookmarked(data.id);
          setIsBookmarked(bmStatus.isBookmarked);
        } catch {
          setIsBookmarked(false);
        }
      } catch (err: any) {
        setError(err.message || 'Article could not be found');
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [slug]);

  const handleToggleBookmark = async () => {
    if (!article) return;
    try {
      const res = await toggleArticleBookmark(article.id);
      setIsBookmarked(res.isBookmarked);
      setBookmarkCount((prev) => (res.isBookmarked ? prev + 1 : Math.max(0, prev - 1)));
    } catch {
      alert('Please log in as a student to bookmark articles.');
    }
  };

  const handleCopyCitation = () => {
    if (!article) return;
    const authorName = article.author?.name || 'Borno Higher Study Editorial Board';
    const year = new Date(article.publishedAt || article.lastReviewedAt).getFullYear();
    const citation = `${authorName} (${year}). "${article.title}". Borno Higher Study Research & Guides. Available at: ${window.location.href} (Accessed ${new Date().toLocaleDateString()}).`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmitCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article || !claimedErrorText || !officialEvidenceUrl) return;

    setCorrectionSubmitting(true);
    try {
      await submitContentCorrection({
        articleId: article.id,
        articleTitle: article.title,
        articleUrl: window.location.href,
        correctionCategory,
        claimedErrorText,
        suggestedCorrection,
        officialEvidenceUrl,
        reporterName,
        reporterEmail,
      });
      setCorrectionSubmitted(true);
      setTimeout(() => {
        setShowCorrectionModal(false);
        setCorrectionSubmitted(false);
        setClaimedErrorText('');
        setSuggestedCorrection('');
        setOfficialEvidenceUrl('');
      }, 2000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit correction report');
    } finally {
      setCorrectionSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading researched guide...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-slate-50 py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Article Not Found</h1>
          <p className="text-slate-600 mb-6">{error || 'The requested article could not be loaded.'}</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Research Hub
          </Link>
        </div>
      </div>
    );
  }

  // Parse FAQs, Takeaways, Citations, TOC
  let faqs: Array<{ question: string; answer: string }> = [];
  try {
    if (article.faqJson) faqs = JSON.parse(article.faqJson);
  } catch {}

  let keyTakeaways: string[] = [];
  try {
    if (article.keyTakeawaysJson) keyTakeaways = JSON.parse(article.keyTakeawaysJson);
  } catch {}

  let citations: any[] = [];
  try {
    if (article.citationsJson) citations = JSON.parse(article.citationsJson);
  } catch {}

  let headingsList: string[] = [];
  try {
    if (article.tableOfContents) headingsList = JSON.parse(article.tableOfContents);
  } catch {}

  // Basic Markdown Renderer for longform content
  const renderMarkdownContent = (raw: string) => {
    // Process markdown sections, headings, tables, blockquotes
    const lines = raw.split('\n');
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    const flushTable = (key: string) => {
      if (tableRows.length > 0) {
        const [headers, separator, ...dataRows] = tableRows;
        elements.push(
          <div key={`table-${key}`} className="my-6 overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#0B192C] text-white">
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="py-3 px-4 font-semibold border-b border-slate-700">
                      {h.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {dataRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50 transition">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-3 px-4 text-slate-700">
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Table line
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        inTable = true;
        const cols = trimmed
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim());
        tableRows.push(cols);
        return;
      } else if (inTable) {
        flushTable(`flush-${idx}`);
      }

      // Headings
      if (trimmed.startsWith('## ')) {
        const text = trimmed.replace('## ', '');
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        elements.push(
          <h2
            key={idx}
            id={id}
            className="text-2xl font-heading font-semibold text-brand-navy tracking-tight mt-10 mb-4 pt-4 border-t border-slate-100 scroll-mt-20"
          >
            {text}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        const text = trimmed.replace('### ', '');
        elements.push(
          <h3 key={idx} className="text-lg font-heading font-semibold text-slate-900 tracking-tight mt-6 mb-2">
            {text}
          </h3>
        );
      } else if (trimmed.startsWith('> [!WARNING]')) {
        elements.push(
          <div key={idx} className="my-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-heading font-semibold">Important Statutory Caveat</p>
              <p className="mt-1 text-amber-800 text-xs sm:text-sm leading-relaxed">
                Meeting published minimum prerequisites does not guarantee admissions or visa issuance. Always cross-verify directly with primary institutional and consular sources.
              </p>
            </div>
          </div>
        );
      } else if (trimmed.startsWith('- ')) {
        elements.push(
          <li key={idx} className="ml-5 list-disc text-slate-700 text-sm sm:text-base leading-[1.75] my-1.5">
            {trimmed.replace('- ', '')}
          </li>
        );
      } else if (trimmed.startsWith('1. ') || trimmed.startsWith('2. ') || trimmed.startsWith('3. ') || trimmed.startsWith('4. ')) {
        elements.push(
          <li key={idx} className="ml-5 list-decimal text-slate-700 text-sm sm:text-base leading-[1.75] my-1.5">
            {trimmed.replace(/^\d+\.\s*/, '')}
          </li>
        );
      } else if (trimmed.length > 0) {
        elements.push(
          <p key={idx} className="my-3.5 text-slate-700 text-base leading-[1.75]">
            {trimmed}
          </p>
        );
      }
    });

    if (inTable) {
      flushTable('flush-end');
    }

    return elements;
  };

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Article Breadcrumbs & Top Bar */}
      <nav className="border-b border-slate-200 bg-slate-50 py-3 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Link to="/" className="hover:text-slate-800">
              Home
            </Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-slate-800">
              Research & Guides
            </Link>
            <span>/</span>
            <Link to={`/blog/category/${article.category?.slug}`} className="hover:text-teal-700 font-medium">
              {article.category?.name}
            </Link>
            <span>/</span>
            <span className="text-slate-700 truncate max-w-xs">{article.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleBookmark}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold border transition ${
                isBookmarked
                  ? 'bg-teal-50 border-teal-300 text-teal-800'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-teal-700 text-teal-700' : ''}`} />
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              <span className="text-[11px] text-slate-400">({bookmarkCount})</span>
            </button>
            <button
              onClick={handleCopyCitation}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
              title="Copy academic citation"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>{copiedCitation ? 'Copied!' : 'Cite'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
              title="Print or save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Link
            to={`/blog/category/${article.category?.slug}`}
            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition"
          >
            {article.category?.name}
          </Link>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {article.readingTimeMinutes} min read ({article.wordCount} words)
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs font-medium text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Verified: {new Date(article.verifiedDate).toLocaleDateString()}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-brand-navy tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed font-normal">
          {article.summary}
        </p>

        {/* Author Bylines & Peer Review Details */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-sm">
              {article.author?.name ? article.author.name.charAt(0) : 'B'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Link
                  to={article.author ? `/authors/${article.author.slug}` : '#'}
                  className="text-sm font-bold text-slate-900 hover:text-teal-700 transition"
                >
                  {article.author?.name || 'Borno Higher Study Editorial Board'}
                </Link>
                {article.author?.verifiedExpert && (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                    <UserCheck className="w-3 h-3 text-teal-600" />
                    Verified Fellow
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {article.author?.roleTitle || 'International Admissions Research Group'}
              </p>
              {article.author?.credentials && (
                <p className="text-[11px] text-slate-400">{article.author.credentials}</p>
              )}
            </div>
          </div>

          <div className="text-right text-xs text-slate-500">
            <p>Last Evaluated: <strong className="text-slate-700">{new Date(article.lastReviewedAt).toLocaleDateString()}</strong></p>
            <p className="mt-0.5">Auditor: <span className="text-slate-700">{article.verifiedBy || 'Borno Editorial Board'}</span></p>
          </div>
        </div>
      </header>

      {/* Main Grid: Content + Table of Contents Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Article Main Content (8 cols) */}
          <main className="lg:col-span-8 max-w-3xl">
            {/* Key Takeaways Box */}
            {keyTakeaways.length > 0 && (
              <div className="mb-8 p-5 rounded-2xl bg-teal-50/70 border border-teal-200/80">
                <h3 className="text-sm font-bold uppercase tracking-wider text-teal-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-700" />
                  Key Methodological Takeaways
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-teal-950 leading-relaxed">
                  {keyTakeaways.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="text-teal-700 font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Markdown Long-form Content */}
            <div className="prose prose-slate max-w-none">
              {renderMarkdownContent(article.content)}
            </div>

            {/* Important Limitations Caveat */}
            {article.limitations && (
              <div className="my-10 p-5 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Evaluation Limitations & Caveats
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {article.limitations}
                </p>
              </div>
            )}

            {/* Attached Peer-Reviewed Research Paper Explainer */}
            {article.researchPaper && (
              <div className="my-10 p-6 rounded-2xl bg-slate-900 text-white shadow-card">
                <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2">
                  <BookOpen className="w-4 h-4" />
                  Attached Academic Research Explainer
                </div>
                <h3 className="text-xl font-heading font-semibold text-white tracking-tight">
                  {article.researchPaper.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Published in {article.researchPaper.journalOrConference} ({article.researchPaper.publicationYear}) • DOI: {article.researchPaper.doi || 'Indexed'}
                </p>
                <div className="mt-4 p-4 rounded-xl bg-slate-800 text-xs text-slate-200 leading-relaxed space-y-2">
                  <p><strong>Research Question:</strong> {article.researchPaper.researchQuestion}</p>
                  <p><strong>Methodology:</strong> {article.researchPaper.methodologySummary}</p>
                  <p><strong>Findings:</strong> {article.researchPaper.keyFindingsSummary}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Sample Size: {article.researchPaper.sampleSize || 'National Cohort'}
                  </span>
                  <a
                    href={article.researchPaper.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-300 hover:text-teal-200"
                  >
                    View Primary DOI / Source
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Verified Citations & Primary Sources Section */}
            {article.sources && article.sources.length > 0 && (
              <section className="my-10 pt-8 border-t border-slate-200">
                <h3 className="text-lg font-heading font-semibold text-brand-navy tracking-tight mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  Primary Evidence & Official Sources
                </h3>
                <div className="space-y-3">
                  {article.sources.map((src, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3.5 rounded-lg border border-slate-200/80 bg-white hover:bg-slate-50 transition flex items-start justify-between gap-4"
                    >
                      <div className="text-xs">
                        <p className="font-semibold text-slate-900">{src.title}</p>
                        <p className="text-slate-500 mt-0.5">
                          Published by <span className="font-medium text-slate-700">{src.publisher}</span> • Type: {src.sourceType.replace('_', ' ')}
                        </p>
                      </div>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 shrink-0"
                      >
                        Verify
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ Accordion */}
            {faqs.length > 0 && (
              <section className="my-10 pt-8 border-t border-slate-200">
                <h3 className="text-lg font-heading font-semibold text-brand-navy tracking-tight mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-3">
                  {faqs.map((faq, fIdx) => (
                    <div
                      key={fIdx}
                      className="border border-slate-200/80 rounded-xl overflow-hidden bg-white"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(openFaqIndex === fIdx ? null : fIdx)}
                        className="w-full text-left p-4 text-sm font-semibold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                      >
                        <span className="font-heading">{faq.question}</span>
                        {openFaqIndex === fIdx ? (
                          <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                      </button>
                      {openFaqIndex === fIdx && (
                        <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Next Steps & Tools Callout */}
            <div className="my-10 p-6 rounded-2xl bg-teal-50 border border-teal-200/80">
              <h4 className="text-base font-heading font-semibold text-teal-950 tracking-tight">
                Evaluate Your Profile Against These Criteria
              </h4>
              <p className="mt-1 text-xs sm:text-sm text-teal-800 leading-relaxed">
                Use Borno's automated calculators and qualification assessment engines to see if your SSC/HSC, English test score, or budget meets the criteria discussed in this guide.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/eligibility-checker"
                  className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-sm"
                >
                  Run Eligibility Checker
                </Link>
                <Link
                  to="/calculator"
                  className="px-4 py-2 rounded-lg bg-white hover:bg-slate-100 text-teal-900 border border-teal-300 text-xs font-bold transition"
                >
                  Estimate Total Living Cost
                </Link>
              </div>
            </div>

            {/* Reader Correction Form Trigger */}
            <div className="my-8 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Notice a statutory change or outdated tuition fee?</span>
              <button
                onClick={() => setShowCorrectionModal(true)}
                className="inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-800 font-bold"
              >
                <Flag className="w-3.5 h-3.5" />
                Report Outdated / Incorrect Info
              </button>
            </div>
          </main>

          {/* Sticky Table of Contents & Author Profile Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Table of Contents */}
            {headingsList.length > 0 && (
              <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Table of Contents
                </h4>
                <nav className="space-y-2">
                  {headingsList.map((head, hIdx) => {
                    const id = head.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    return (
                      <a
                        key={hIdx}
                        href={`#${id}`}
                        className="block text-xs font-medium text-slate-600 hover:text-teal-700 hover:underline transition leading-snug"
                      >
                        {hIdx + 1}. {head}
                      </a>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* Author Profile Bio */}
            {article.author && (
              <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  About the Author
                </h4>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-base shrink-0">
                    {article.author.name.charAt(0)}
                  </div>
                  <div>
                    <Link
                      to={`/authors/${article.author.slug}`}
                      className="text-sm font-bold text-[#0B192C] hover:text-teal-700 transition"
                    >
                      {article.author.name}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{article.author.roleTitle}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                  {article.author.bio}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{article.author.affiliation}</span>
                  <Link
                    to={`/authors/${article.author.slug}`}
                    className="font-bold text-teal-700 hover:text-teal-800"
                  >
                    View Bio &rarr;
                  </Link>
                </div>
              </div>
            )}

            {/* Related Articles */}
            {article.relatedArticles && article.relatedArticles.length > 0 && (
              <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Related Research & Guides
                </h4>
                <div className="space-y-3">
                  {article.relatedArticles.map((rel) => (
                    <div key={rel.id} className="pb-2.5 border-b border-slate-100 last:border-0 last:pb-0">
                      <span className="text-[10px] font-semibold text-teal-700 uppercase">
                        {rel.category?.name}
                      </span>
                      <Link
                        to={`/blog/${rel.slug}`}
                        className="block text-xs font-bold text-slate-900 hover:text-teal-700 transition mt-0.5 leading-snug line-clamp-2"
                      >
                        {rel.title}
                      </Link>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {rel.readingTimeMinutes} min read
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Reader Correction Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Flag className="w-4 h-4 text-amber-600" />
                Submit Information Correction
              </h3>
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {correctionSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-900">Thank You</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Your correction report has been logged for fact-checking by our editorial board.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitCorrection} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Issue Category *
                  </label>
                  <select
                    value={correctionCategory}
                    onChange={(e) => setCorrectionCategory(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900"
                  >
                    <option value="FACTUAL_ERROR">Factual Error in Text</option>
                    <option value="OUTDATED_FEE">Outdated Tuition or Living Cost</option>
                    <option value="BROKEN_SOURCE">Broken Official Source Link</option>
                    <option value="MISLEADING_REQUIREMENT">Prerequisite / Score Requirement Changed</option>
                    <option value="OTHER">Other Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Specific Statement / Claim in Question *
                  </label>
                  <textarea
                    rows={2}
                    value={claimedErrorText}
                    onChange={(e) => setClaimedErrorText(e.target.value)}
                    placeholder="Quote the exact sentence or statistic that appears incorrect..."
                    required
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Suggested Correction & Details
                  </label>
                  <textarea
                    rows={2}
                    value={suggestedCorrection}
                    onChange={(e) => setSuggestedCorrection(e.target.value)}
                    placeholder="Provide the updated value or factual explanation..."
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Evidence URL (University or Government Portal) *
                  </label>
                  <input
                    type="url"
                    value={officialEvidenceUrl}
                    onChange={(e) => setOfficialEvidenceUrl(e.target.value)}
                    placeholder="https://www.ox.ac.uk/... or https://www.gov.uk/..."
                    required
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="Optional"
                      className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Email</label>
                    <input
                      type="email"
                      value={reporterEmail}
                      onChange={(e) => setReporterEmail(e.target.value)}
                      placeholder="For follow-up"
                      className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCorrectionModal(false)}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={correctionSubmitting}
                    className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow"
                  >
                    {correctionSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
