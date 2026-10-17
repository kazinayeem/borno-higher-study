import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  UserCheck,
  GraduationCap,
  Building2,
  Clock,
  ArrowRight,
  BookOpen,
  Mail,
  ArrowLeft,
} from 'lucide-react';
import { getBlogAuthorBySlug } from '../services/api';
import { ArticleAuthorItem } from '../types';

export const AuthorProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [author, setAuthor] = useState<ArticleAuthorItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    async function loadAuthor() {
      setLoading(true);
      try {
        const data = await getBlogAuthorBySlug(slug!);
        setAuthor(data);
      } catch (err) {
        console.error('Failed to load author profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAuthor();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Author Not Found</h2>
        <Link to="/blog" className="mt-3 inline-block text-teal-700 font-semibold text-sm">
          &larr; Return to Blog Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Profile Header */}
      <header className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="text-xs font-bold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Research & Guides
          </Link>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-brand-navy text-white flex items-center justify-center text-3xl font-heading font-semibold shadow-2xs">
              {author.name.charAt(0)}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-heading font-semibold text-brand-navy tracking-tight">
                  {author.name}
                </h1>
                {author.verifiedExpert && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                    Verified Fellow
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-slate-600 mt-1">{author.roleTitle}</p>

              {author.affiliation && (
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {author.affiliation}
                </p>
              )}

              {author.credentials && (
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  {author.credentials}
                </p>
              )}

              <p className="mt-4 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100 pt-4">
                {author.bio}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Authored Articles Archive */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xl font-heading font-semibold text-brand-navy tracking-tight mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-600" />
          Authored Publications & Guides ({author.articles?.length || 0})
        </h2>

        <div className="space-y-4">
          {author.articles?.map((art) => (
            <div
              key={art.id}
              className="bg-white p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition shadow-card"
            >
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span className="font-semibold text-teal-700 uppercase tracking-wider">
                  {art.category?.name}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 tabular-nums">
                  <Clock className="w-3 h-3" />
                  {art.readingTimeMinutes} min read
                </span>
                <span>•</span>
                <span>Published {new Date(art.publishedAt || art.lastReviewedAt).toLocaleDateString()}</span>
              </div>

              <Link to={`/blog/${art.slug}`} className="group">
                <h3 className="text-base sm:text-lg font-heading font-semibold text-brand-navy group-hover:text-teal-700 transition leading-snug tracking-tight">
                  {art.title}
                </h3>
              </Link>

              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                {art.summary}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                <Link
                  to={`/blog/${art.slug}`}
                  className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                >
                  Read Full Article &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
