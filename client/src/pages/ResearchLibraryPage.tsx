import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Users,
} from 'lucide-react';
import { getResearchPapers, getResearchPaperBySlug } from '../services/api';
import { ResearchPaperItem } from '../types';

export const ResearchLibraryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [papers, setPapers] = useState<ResearchPaperItem[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaperItem | null>(null);
  const [discipline, setDiscipline] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPapers() {
      setLoading(true);
      try {
        if (slug) {
          const single = await getResearchPaperBySlug(slug);
          setSelectedPaper(single);
        } else {
          const list = await getResearchPapers(discipline);
          setPapers(list);
        }
      } catch (err) {
        console.error('Failed to load research papers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPapers();
  }, [slug, discipline]);

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 mb-3 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              <span className="tracking-wide uppercase text-[11px] text-slate-600 font-semibold">Peer-Reviewed Evidence Base</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-heading font-semibold text-brand-navy tracking-tight">
              International Higher Education Research Library
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Curated peer-reviewed publications on student mobility, PhD attrition, testing validity, and computer science pedagogy. Dissected into clear, independent explainers for prospective students and researchers.
            </p>
          </div>

          {/* Filter Bar (if on listing) */}
          {!slug && (
            <div className="mt-8 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-600">Discipline:</span>
              {[
                { label: 'All Disciplines', value: 'ALL' },
                { label: 'Student Mobility', value: 'STUDENT_MOBILITY' },
                { label: 'Postgraduate Supervision', value: 'POSTGRADUATE_SUPERVISION' },
                { label: 'Language Testing', value: 'LANGUAGE_ASSESSMENT' },
                { label: 'STEM & CS Pedagogy', value: 'STEM_PEDAGOGY' },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setDiscipline(item.value)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    discipline === item.value
                      ? 'bg-[#0B192C] text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-600">Loading research explainers...</p>
          </div>
        ) : slug && selectedPaper ? (
          /* Single Paper View */
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link
                to="/research"
                className="text-xs font-bold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 mb-3"
              >
                &larr; Back to Research Library
              </Link>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-800 border border-indigo-200">
                  {selectedPaper.researchDiscipline.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-600">{selectedPaper.journalOrConference}</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedPaper.accessStatus.replace('_', ' ')}
                </span>
              </div>

              <h2 className="text-2xl md:text-4xl font-heading font-semibold text-brand-navy tracking-tight leading-tight">
                {selectedPaper.title}
              </h2>

              <p className="mt-3 text-xs sm:text-sm text-slate-500">
                Authors:{' '}
                <strong className="text-slate-800">
                  {selectedPaper.authors?.map((a) => a.name).join(', ') || 'Research Consortium'}
                </strong>{' '}
                ({selectedPaper.publicationYear}) • Publisher: {selectedPaper.publisher}
              </p>

              {selectedPaper.doi && (
                <p className="mt-1 text-xs text-slate-500 font-mono">
                  DOI: <span className="text-teal-700">{selectedPaper.doi}</span>
                </p>
              )}
            </div>

            {/* Independent Explainer Notice */}
            <div className="my-6 p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong>Independent Academic Explainer</strong>
                <p className="mt-0.5">
                  This summary is an objective, independent explainer produced by Borno Higher Study researchers to contextualize research methodology and limitations for students. It is not an author-produced summary.
                </p>
              </div>
            </div>

            {/* Core Explainer Grid */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">
                  1. Research Question & Hypothesis
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedPaper.researchQuestion}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">
                  2. Methodology & Cohort Sample
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedPaper.methodologySummary}
                </p>
                {selectedPaper.sampleSize && (
                  <p className="mt-2 text-xs font-semibold text-slate-600">
                    Sample Size / Dataset: <span className="text-teal-700">{selectedPaper.sampleSize}</span>
                  </p>
                )}
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">
                  3. Key Empirical Findings
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedPaper.keyFindingsSummary}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  4. Methodological Limitations & Generalizability
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedPaper.limitationsNotes}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
              <a
                href={selectedPaper.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#0B192C] text-white text-xs font-bold hover:bg-slate-800 transition shadow"
              >
                Access Official Publisher Publication
                <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
              </a>
              <Link
                to="/blog"
                className="text-xs font-bold text-teal-700 hover:text-teal-800"
              >
                Browse Borno Guides &rarr;
              </Link>
            </div>
          </div>
        ) : (
          /* Papers Listing Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {papers.map((paper) => (
              <div
                key={paper.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-800 border border-indigo-200">
                      {paper.researchDiscipline.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {paper.accessStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <Link to={`/research/${paper.slug}`} className="group">
                    <h3 className="text-lg font-heading font-semibold text-brand-navy group-hover:text-teal-700 transition leading-snug tracking-tight">
                      {paper.title}
                    </h3>
                  </Link>

                  <p className="mt-1 text-xs text-slate-500">
                    {paper.journalOrConference} ({paper.publicationYear}) • {paper.publisher}
                  </p>

                  <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    <strong>Core Finding:</strong> {paper.keyFindingsSummary}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {paper.sampleSize ? `Sample: ${paper.sampleSize}` : 'Verified Paper'}
                  </span>
                  <Link
                    to={`/research/${paper.slug}`}
                    className="font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                  >
                    Read Independent Explainer
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
