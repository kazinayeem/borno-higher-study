import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SeoHead } from '../components/common/SeoHead.js';
import { Breadcrumbs } from '../components/common/Breadcrumbs.js';
import { EmptyState } from '../components/common/EmptyState.js';
import { PostItem } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import {
  BookOpen,
  Search,
  PenSquare,
  Users,
  ShieldAlert,
  ArrowRight,
  Clock,
  Sparkles,
  Award,
  Globe2,
} from 'lucide-react';

const FALLBACK_POSTS: PostItem[] = [
  {
    id: 'post-seed-1',
    slug: 'ireland-critical-skills-employment-guide-cs-graduates',
    title: 'How I Transitioned from TU Dublin to an Ireland Critical Skills Employment Permit',
    excerpt:
      'A practical step-by-step roadmap on landing a tech role in Dublin after a Master in Computer Science, covering the Third Level Graduate Scheme (1G) and CSEP transition.',
    content: '',
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
  },
  {
    id: 'post-seed-2',
    slug: 'lithuania-ktu-engineering-cost-of-living-breakdown',
    title: 'Kaunas Student Life & KTU Engineering: Real Monthly Living Cost Breakdown',
    excerpt:
      'Detailed monthly expenditure for international students in Kaunas, Lithuania — accommodation, food, public transit, and university dormitories with practical savings tips.',
    content: '',
    category: 'ACCOMMODATION_AND_CITY',
    tags: ['Lithuania', 'KTU', 'Kaunas', 'Living Costs', 'Engineering'],
    status: 'APPROVED',
    publishedAt: '2026-10-01T12:00:00.000Z',
    createdAt: '2026-09-30T14:00:00.000Z',
    updatedAt: '2026-10-01T12:00:00.000Z',
    author: {
      id: 'author-2',
      name: 'Nusrat Jahan',
      role: 'CONTRIBUTOR',
    },
  },
  {
    id: 'post-seed-3',
    slug: 'german-blocked-account-and-public-university-admission',
    title: 'Navigating German Public University Applications & Blocked Account Setup',
    excerpt:
      'Complete guide to uni-assist VPD, German health insurance, and funding your Sperrkonto without intermediary markups.',
    content: '',
    category: 'APPLICATION_GUIDE',
    tags: ['Germany', 'Public Universities', 'Blocked Account', 'Uni-Assist'],
    status: 'APPROVED',
    publishedAt: '2026-10-05T09:00:00.000Z',
    createdAt: '2026-10-04T11:00:00.000Z',
    updatedAt: '2026-10-05T09:00:00.000Z',
    author: {
      id: 'author-3',
      name: 'Arif Chowdhury',
      role: 'CONTRIBUTOR',
    },
  },
];

const CATEGORIES = [
  { key: 'ALL', label: 'All Community Guides' },
  { key: 'STUDENT_EXPERIENCE', label: 'Student Experiences' },
  { key: 'APPLICATION_GUIDE', label: 'Application Guides' },
  { key: 'SCHOLARSHIP_EXPERIENCE', label: 'Scholarship Stories' },
  { key: 'ACCOMMODATION_AND_CITY', label: 'City & Living Costs' },
  { key: 'IELTS_PTE_PREPARATION', label: 'IELTS / Test Prep' },
  { key: 'COURSE_REVIEW', label: 'Course & College Reviews' },
];

export const CommunityPage: React.FC = () => {
  const { isContributor } = useAuth();
  const [posts, setPosts] = useState<PostItem[]>(FALLBACK_POSTS);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/community/posts')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch posts');
        return res.json();
      })
      .then((data) => {
        const postList = Array.isArray(data) ? data : data?.posts || [];
        if (postList.length > 0) {
          setPosts(postList);
        }
      })
      .catch(() => {
        // use fallback posts
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'ALL' || post.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        (post.tags && post.tags.some((t) => t.toLowerCase().includes(q))) ||
        post.author.name.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <SeoHead
        title="Student Contributor Community & Guides | Borno Higher Study"
        description="Read authentic, verified study-abroad experiences, university comparisons, admission timelines, and living cost guides shared by international student contributors."
        canonicalPath="/community"
      />

      {/* Header Banner */}
      <section className="bg-slate-900 text-white pt-10 pb-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Student Community' }]} />

          <div className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-3">
                <Users className="w-3.5 h-3.5" />
                <span>Peer-to-Peer International Education Knowledge</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Student Contributor Community
              </h1>
              <p className="mt-3 text-slate-300 text-base sm:text-lg leading-relaxed">
                Authentic field notes, admission timelines, visa experiences, and city guides written
                by verified Bangladeshi and international scholars studying across the globe.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
              <Link
                to="/community/contribute"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-sm shadow-md transition-all"
              >
                <PenSquare className="w-4 h-4" />
                {isContributor ? 'Write a Guide' : 'Become a Contributor'}
              </Link>
              <Link
                to="/workspaces"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all"
              >
                <Users className="w-4 h-4 text-teal-400" />
                Study Workspaces
              </Link>
            </div>
          </div>

          {/* Legal / Authenticity Disclaimer */}
          <div className="mt-8 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs text-amber-200/90 leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px] block sm:inline mr-2">
                Student-Submitted Content:
              </span>
              Articles and reviews published in the Community section represent the personal opinions
              and experiences of verified student contributors. Official entry requirements, tuition fees,
              and visa regulations must be confirmed directly via official university and government portals.
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Controls: Category Pills & Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-thin">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.key
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, topics, countries..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-slate-500 font-medium">Loading community contributions...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No community posts found"
              description="No articles matched your selected category or search keyword. Try clearing filters or submit the first guide on this topic!"
              actionText="Clear Filters"
              onReset={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
            />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => {
              const formattedDate = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recently';

              return (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-6">
                    {/* Top tags */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 text-[11px] font-bold uppercase tracking-wider">
                        {post.category.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {formattedDate}
                      </span>
                    </div>

                    <Link to={`/community/${post.slug}`}>
                      <h2 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="mt-2.5 text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer / Author attribution */}
                  <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {post.author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800 leading-tight">
                          {post.author.name}
                        </p>
                        <p className="text-[10px] text-teal-700 font-bold uppercase tracking-wider">
                          Verified Contributor
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/community/${post.slug}`}
                      className="text-xs font-bold text-slate-700 hover:text-teal-700 flex items-center gap-1 transition-colors"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Contributor Callout Card */}
        <section className="mt-16 bg-radial from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Award className="w-3.5 h-3.5" />
              Student Contributor Program
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Studying Abroad? Help Future Bangladeshi Students Succeed.
            </h2>
            <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
              Share your insights on university admissions, visa interviews, blocked accounts, accommodation hunts,
              and scholarship applications. All approved guides feature verified contributor badges and give back to our
              growing scholar community.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 items-center">
              <Link
                to="/community/contribute"
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-colors"
              >
                Apply for Contributor Access
              </Link>
              <span className="text-xs text-slate-400">
                Individual accounts with admin review & multi-user study circles
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default CommunityPage;
