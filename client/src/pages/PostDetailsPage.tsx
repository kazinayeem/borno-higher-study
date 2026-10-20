import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SeoHead } from '../components/common/SeoHead.js';
import { Breadcrumbs } from '../components/common/Breadcrumbs.js';
import { PostItem } from '../types/index.js';
import {
  Clock,
  ArrowLeft,
  ShieldAlert,
  Share2,
  Bookmark,
  Calendar,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const PostDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/community/posts/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then((data) => {
        setPost(data);
      })
      .catch(() => {
        // Fallback for demonstration if API fails or offline
        if (slug === 'ireland-critical-skills-employment-guide-cs-graduates') {
          setPost({
            id: 'post-seed-1',
            slug: 'ireland-critical-skills-employment-guide-cs-graduates',
            title: 'How I Transitioned from TU Dublin to an Ireland Critical Skills Employment Permit',
            excerpt:
              'A practical step-by-step roadmap on landing a tech role in Dublin after a Master in Computer Science, covering the Third Level Graduate Scheme (1G) and CSEP transition.',
            content: `
### Overview of Ireland's Post-Study Work Pathway
Ireland offers one of Europe's most attractive post-study work routes for STEM graduates. As an international master's graduate from a recognized Irish higher education institution like Technological University Dublin (TU Dublin), you are eligible for the **Third Level Graduate Scheme (Stamp 1G)** for up to 24 months.

### Timeline from Graduation to CSEP
1. **Completion of Final Exams & Transcripts (September):**
   Request a formal Letter of Completion from the academic registry immediately once final exam board results are published.
2. **Applying for Stamp 1G at Burgh Quay / Local Garda Station:**
   Ensure your private medical insurance remains active. Stamp 1G grants full-time work authorization (up to 40 hours per week).
3. **Targeting Eligible Occupations on the Critical Skills List:**
   Software engineers, cloud architects, data scientists, and cybersecurity specialists qualify under SOC code classifications. The minimum salary threshold for a Critical Skills Employment Permit (CSEP) is €38,000 per year (increasing under the latest DETE schedule).
4. **Employer Sponsorship & Processing:**
   Once you receive a job offer with an eligible salary, either you or the prospective employer can submit the CSEP application online via EPOS (Employment Permits Online System). Processing currently takes 3 to 6 weeks.

### Practical Tips for Bangladeshi Students
- **Start Networking in Semester 2:** Attend local tech meetups (DublinJS, Python Ireland) and career fairs in the RDS.
- **Housing in Dublin:** Secure your accommodation early; university dormitories or verified student accommodation hubs are recommended for your initial 6 months.
- **Official Verification:** Always check the Department of Enterprise, Trade and Employment (DETE) website for updated minimum remuneration thresholds.
            `,
            category: 'STUDENT_EXPERIENCE',
            tags: ['Ireland', 'Computer Science', 'TU Dublin', 'Post-Study Work', '1G Visa'],
            status: 'APPROVED',
            publishedAt: '2026-09-15T10:00:00.000Z',
            createdAt: '2026-09-14T08:00:00.000Z',
            updatedAt: '2026-09-15T10:00:00.000Z',
            author: {
              id: 'author-1',
              name: 'Tanvir Hossain',
              role: 'CONTRIBUTOR',
            },
          });
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-slate-500 font-medium">Loading guide content...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 py-20">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Post Not Found</h1>
          <p className="mt-2 text-xs text-slate-600">
            The guide or experience you are looking for does not exist or is currently pending moderation.
          </p>
          <div className="mt-6">
            <Link
              to="/community"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Community
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div className="min-h-screen bg-white pb-24">
      <SeoHead
        title={`${post.title} | Borno Student Community`}
        description={post.excerpt}
        canonicalPath={`/community/${post.slug}`}
      />

      {/* Top Breadcrumb Header */}
      <div className="bg-slate-50/80 border-b border-slate-200/80 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Breadcrumbs
            items={[
              { label: 'Student Community', href: '/community' },
              { label: post.title },
            ]}
          />
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        {/* Back Link */}
        <Link
          to="/community"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Community Guides</span>
        </Link>

        {/* Category & Date */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider">
            {post.category.replace(/_/g, ' ')}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5" />
            5 min read
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          {post.title}
        </h1>

        {/* Author Details Bar */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-black text-sm flex items-center justify-center shrink-0">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-tight">{post.author.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wide">
                  Verified Student Contributor
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Student Contributor Disclaimer Banner */}
        <div className="mt-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider text-[11px] text-amber-800 block sm:inline mr-2">
              Student-Submitted Information Notice:
            </span>
            This article reflects the author's individual experience and research as a student. Institutional
            policies, scholarship eligibility, admission criteria, and national immigration laws (such as Stamp 1G,
            blocked accounts, or CSEP permits) change periodically. Always verify requirements against official
            government and university websites before making financial or academic commitments.
          </div>
        </div>

        {/* Excerpt */}
        <div className="mt-8 text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed border border-teal-200/80 dark:border-teal-800/60 p-5 italic bg-teal-50/40 dark:bg-teal-950/20 rounded-xl">
          "{post.excerpt}"
        </div>

        {/* Article Body */}
        <div className="mt-8 prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm sm:text-base space-y-4 whitespace-pre-line font-normal">
          {post.content}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 mr-2">Topic Tags:</span>
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA Card for Readers */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold">Have your own study abroad experience to share?</h3>
            <p className="mt-1 text-xs text-slate-300 max-w-lg">
              Join Borno's Student Contributor Program. Help thousands of aspiring students plan their
              future with authentic, peer-reviewed advice.
            </p>
          </div>
          <Link
            to="/community/contribute"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Apply to Contribute
          </Link>
        </div>
      </article>
    </div>
  );
};
export default PostDetailsPage;
