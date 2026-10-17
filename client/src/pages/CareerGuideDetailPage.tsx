import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText,
  Calendar,
  User,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  Share2,
  BookOpen,
  Sparkles,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PageIntro } from '../components/motion/index';
import { getCareerGuideBySlug, getCareerGuides } from '../services/api';
import { CareerGuideItem } from '../types/index';

interface CareerGuideDetailPageProps {
  overrideSlug?: string;
}

export const CareerGuideDetailPage: React.FC<CareerGuideDetailPageProps> = ({ overrideSlug }) => {
  const params = useParams<{ slug: string }>();
  const slug = overrideSlug || params.slug || 'cv-writing-guide';

  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [guide, setGuide] = useState<CareerGuideItem | null>(null);
  const [allGuides, setAllGuides] = useState<CareerGuideItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [gRes, allRes] = await Promise.all([
          getCareerGuideBySlug(slug),
          getCareerGuides()
        ]);
        setGuide(gRes);
        setAllGuides(allRes.guides || []);
      } catch (e) {
        console.error('Failed to load guide:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFA] dark:bg-[#080E1A]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-500">Loading guide...</p>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#FBFBFA] dark:bg-[#080E1A]">
        <h2 className="text-2xl font-bold mb-2">Guide Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The requested career toolkit guide could not be retrieved.</p>
        <Link to="/career-toolkit" className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold">
          Return to Career Toolkit Hub
        </Link>
      </div>
    );
  }

  const relatedGuides = allGuides.filter((g) => g.slug !== slug).slice(0, 3);
  const title = isBn && guide.titleBn ? guide.titleBn : guide.titleEn;
  const summary = isBn && guide.summaryBn ? guide.summaryBn : guide.summaryEn;
  const content = isBn && guide.contentBn ? guide.contentBn : guide.contentEn;

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#080E1A] text-slate-900 dark:text-slate-100 pb-24 transition-colors">
      {/* Header Banner */}
      <div className="bg-[#0B192C] dark:bg-[#070D18] text-white pt-14 pb-16 border-b border-slate-800">
        <PageIntro className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link
            to="/career-toolkit"
            className="inline-flex items-center gap-2 text-xs font-medium text-teal-400 hover:text-teal-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isBn ? 'ক্যারিয়ার টুলকিট হোমে ফিরুন' : 'Back to Career Toolkit Hub'}</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-800 text-teal-400 border border-slate-700 uppercase tracking-wider">
              {guide.category.replace('_', ' ')}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {isBn ? 'সর্বশেষ যাচাই: ' : 'Last Reviewed: '} {guide.lastReviewed}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-semibold text-white tracking-tight mb-4 leading-snug">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {summary}
          </p>

          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-teal-400" />
              <span>{guide.author}</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/career-toolkit/cv-builder"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isBn ? 'সিভি বিল্ডারে যান' : 'Open CV Builder'}</span>
              </Link>
            </div>
          </div>
        </PageIntro>
      </div>

      {/* Main Reading Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-8">
          
          {/* Official Verification Callout for Europass */}
          {slug === 'europass-cv' && (
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-blue-900 dark:text-blue-200">
                  {isBn ? 'অফিশিয়াল ইউরোপিয়ান ইউনিয়ন পোর্টাল রেফারেন্স' : 'Official European Union Portal Reference'}
                </p>
                <p className="text-blue-800 dark:text-blue-300 leading-relaxed">
                  {isBn
                    ? 'বর্ণ হায়ার স্টাডি ইউরোপাস সিভি তৈরির অফিশিয়াল প্ল্যাটফর্ম নয়। অফিসিয়াল অনলাইন বিল্ডার ব্যবহারের জন্য দয়া করে ইউরোপীয় কমিশনের সরকারি পোর্টাল ভিজিট করুন।'
                    : 'Borno Higher Study is an independent international education platform. To create or edit your official EU profile, please use the official European Commission portal.'}
                </p>
                <a
                  href="https://europass.europa.eu/en/create-europass-cv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-300 font-semibold hover:underline pt-1"
                >
                  <span>{isBn ? 'অফিসিয়াল ইউরোপাস বিল্ডারে প্রবেশ করুন' : 'Launch Official European Commission Europass Builder'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Guide Markdown / Editorial Content */}
          <article className="prose dark:prose-invert prose-slate max-w-none text-sm sm:text-base leading-relaxed space-y-5">
            {content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-xl font-bold text-slate-900 dark:text-white pt-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('#### ')) {
                return (
                  <h4 key={idx} className="text-base font-bold text-slate-900 dark:text-white pt-2">
                    {paragraph.replace('#### ', '')}
                  </h4>
                );
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n- ').map(item => item.replace('- ', ''));
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                    {items.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.startsWith('1. ')) {
                const items = paragraph.split(/\n\d+\.\s+/).filter(Boolean);
                return (
                  <ol key={idx} className="list-decimal pl-5 space-y-1.5 text-slate-700 dark:text-slate-300">
                    {items.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ol>
                );
              }
              return (
                <p key={idx} className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </article>

          {/* Bottom Action Footer */}
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/career-toolkit/cv-review"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <Zap className="w-4 h-4" />
              <span>{isBn ? 'আপনার সিভি স্ক্যান করুন' : 'Test CV in Rule-Based Reviewer'}</span>
            </Link>

            <Link
              to="/career-toolkit/cv-checklist"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
            >
              <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>{isBn ? 'প্রি-সাবমিশন চেকলিস্ট দেখুন' : 'Verify with 10-Point Checklist'}</span>
            </Link>
          </div>
        </div>

        {/* Related Guides Recommendation Carousel */}
        {relatedGuides.length > 0 && (
          <div className="mt-12 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isBn ? 'সম্পর্কিত অন্যান্য অ্যাপ্লিকেশন গাইড' : 'Explore Related Career Guides'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedGuides.map((rg) => (
                <Link
                  key={rg.slug}
                  to={`/career-toolkit/${rg.slug}`}
                  className="p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-500/50 transition-all group flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 mb-2 inline-block">
                      {rg.category}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
                      {isBn && rg.titleBn ? rg.titleBn : rg.titleEn}
                    </h4>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-teal-600 dark:text-teal-400 font-medium">
                    <span>{isBn ? 'পড়ুন' : 'Read'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
