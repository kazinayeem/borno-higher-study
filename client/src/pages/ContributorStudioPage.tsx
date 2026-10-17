import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SeoHead } from '../components/common/SeoHead.js';
import { Breadcrumbs } from '../components/common/Breadcrumbs.js';
import { useAuth } from '../context/AuthContext.js';
import { PostItem, ContributorApplicationItem } from '../types/index.js';
import {
  PenSquare,
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Send,
  Eye,
  Info,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

const CATEGORIES = [
  { value: 'STUDENT_EXPERIENCE', label: 'Study-Abroad Experience' },
  { value: 'APPLICATION_GUIDE', label: 'Application & Visa Guide' },
  { value: 'SCHOLARSHIP_EXPERIENCE', label: 'Scholarship Success Story' },
  { value: 'ACCOMMODATION_AND_CITY', label: 'City & Accommodation Guide' },
  { value: 'IELTS_PTE_PREPARATION', label: 'IELTS / TOEFL / PTE Strategy' },
  { value: 'COURSE_REVIEW', label: 'Course & Institution Review' },
];

export const ContributorStudioPage: React.FC = () => {
  const { user, token, isAuthenticated, isContributor } = useAuth();

  // Tab for approved contributors: 'write' | 'my-posts'
  const [activeTab, setActiveTab] = useState<'write' | 'my-posts'>('write');

  // Application form state
  const [appFullName, setAppFullName] = useState(user?.name || '');
  const [appEmail, setAppEmail] = useState(user?.email || '');
  const [appInstitution, setAppInstitution] = useState('');
  const [appCountry, setAppCountry] = useState('Ireland');
  const [appDegree, setAppDegree] = useState('MASTER');
  const [appField, setAppField] = useState('Computer Science');
  const [appMotivation, setAppMotivation] = useState('');
  const [appSampleTopic, setAppSampleTopic] = useState('');
  const [appLinkedin, setAppLinkedin] = useState('');
  const [appSubmitted, setAppSubmitted] = useState(false);
  const [appLoading, setAppLoading] = useState(false);
  const [appError, setAppError] = useState<string | null>(null);

  // Post editor state
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState('STUDENT_EXPERIENCE');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postTags, setPostTags] = useState('Ireland, Visa, Master');
  const [postAgreed, setPostAgreed] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [postSuccess, setPostSuccess] = useState<string | null>(null);
  const [postError, setPostError] = useState<string | null>(null);

  // My posts list
  const [myPosts, setMyPosts] = useState<PostItem[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Fetch my posts if contributor
  useEffect(() => {
    if (isAuthenticated && token && isContributor) {
      setLoadingPosts(true);
      fetch('/api/community/posts', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const list = Array.isArray(data) ? data : data?.posts || [];
          if (list.length > 0) {
            // Filter posts authored by current user
            const userPosts = list.filter((p: PostItem) => p.author?.id === user?.id);
            setMyPosts(userPosts);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingPosts(false));
    }
  }, [isAuthenticated, token, isContributor, user?.id]);

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    setAppLoading(true);
    setAppError(null);

    try {
      const res = await fetch('/api/community/contributor-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: appFullName,
          email: appEmail,
          institution: appInstitution,
          countryOfStudy: appCountry,
          degreeLevel: appDegree,
          fieldOfStudy: appField,
          motivation: appMotivation,
          sampleTopic: appSampleTopic,
          linkedinOrProfile: appLinkedin,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit application');
      setAppSubmitted(true);
    } catch (err: any) {
      setAppError(err.message || 'Something went wrong');
    } finally {
      setAppLoading(false);
    }
  };

  const handlePostSubmit = async (status: 'DRAFT' | 'PENDING_REVIEW') => {
    if (!postTitle.trim() || !postExcerpt.trim() || !postContent.trim()) {
      setPostError('Please fill in title, summary excerpt, and guide content.');
      return;
    }
    if (status === 'PENDING_REVIEW' && !postAgreed) {
      setPostError('Please acknowledge the accuracy disclaimer before submitting for review.');
      return;
    }

    setPostLoading(true);
    setPostError(null);
    setPostSuccess(null);

    try {
      const tagsArray = postTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: postTitle,
          excerpt: postExcerpt,
          content: postContent,
          category: postCategory,
          tags: tagsArray,
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save post');

      setPostSuccess(
        status === 'PENDING_REVIEW'
          ? 'Guide successfully submitted for Admin Moderation! It will appear publicly upon approval.'
          : 'Draft saved successfully.'
      );

      // Reset form if submitted
      if (status === 'PENDING_REVIEW') {
        setPostTitle('');
        setPostExcerpt('');
        setPostContent('');
        setPostAgreed(false);
      }
    } catch (err: any) {
      setPostError(err.message || 'Error saving post');
    } finally {
      setPostLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 py-20">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-4">
            <Award className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Student Contributor Studio</h1>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Please sign in with your individual student account to apply as a verified contributor or
            draft educational guides.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/auth"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Sign In to Your Account
            </Link>
            <Link
              to="/community"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Browse Public Community Guides
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <SeoHead
        title="Student Contributor Studio | Borno Higher Study"
        description="Submit authentic study-abroad experiences, guides, and college reviews. Managed with strict moderation and individual contributor accountability."
        canonicalPath="/community/contribute"
      />

      <div className="bg-slate-900 text-white pt-8 pb-10 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Community', href: '/community' },
              { label: 'Contributor Studio' },
            ]}
          />
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Verified Contributor Program</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Contributor Studio & Submission
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                User: <strong className="text-white">{user?.name}</strong> ({user?.role})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {!isContributor ? (
          /* Student Contributor Application Form */
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-10">
            {appSubmitted ? (
              <div className="py-12 text-center max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-black text-slate-900">Application Submitted!</h2>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Thank you for applying to the Borno Student Contributor Program. Our administration team
                  reviews all applications within 1-2 business days to maintain quality and avoid misleading advice.
                </p>
                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-left">
                  <p className="font-semibold text-slate-700 mb-1">What happens next?</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>An admin reviews your academic background and sample topic.</li>
                    <li>Upon approval, your role updates to <strong>Verified Student Contributor</strong>.</li>
                    <li>You will be able to submit articles, draft guides, and view editorial review feedback.</li>
                  </ul>
                </div>
                <div className="mt-6">
                  <Link
                    to="/community"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                  >
                    Back to Community Guides
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="border-b border-slate-100 pb-5 mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    Apply for Contributor Publishing Access
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    To safeguard students from inaccurate visa or financial claims, Borno requires
                    individual verified contributor profiles before articles are submitted for moderation.
                  </p>
                </div>

                {appError && (
                  <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{appError}</span>
                  </div>
                )}

                <form onSubmit={handleApplicationSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={appFullName}
                        onChange={(e) => setAppFullName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={appEmail}
                        onChange={(e) => setAppEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Institution / College
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. TU Dublin, KTU, DBS"
                        value={appInstitution}
                        onChange={(e) => setAppInstitution(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Country of Study
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ireland, Lithuania, Germany"
                        value={appCountry}
                        onChange={(e) => setAppCountry(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Degree Level
                      </label>
                      <select
                        value={appDegree}
                        onChange={(e) => setAppDegree(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
                      >
                        <option value="BACHELOR">Bachelor Degree</option>
                        <option value="MASTER">Master / Postgraduate</option>
                        <option value="PHD">Doctoral / PhD</option>
                        <option value="DIPLOMA">Diploma / Vocational</option>
                        <option value="PATHWAY">Foundation / Pathway</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Field of Study / Major
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Computer Science, Mechanical Eng."
                        value={appField}
                        onChange={(e) => setAppField(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        LinkedIn or Academic Profile (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        value={appLinkedin}
                        onChange={(e) => setAppLinkedin(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Proposed First Topic or Experience
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. How I prepared for the Irish Stamp 2 visa interview and secured student housing"
                      value={appSampleTopic}
                      onChange={(e) => setAppSampleTopic(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Why do you want to contribute to Borno Higher Study?
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Briefly describe your motivation to help prospective international scholars..."
                      value={appMotivation}
                      onChange={(e) => setAppMotivation(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={appLoading}
                      className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors disabled:opacity-60 flex items-center gap-2"
                    >
                      {appLoading ? (
                        <>Submitting Application...</>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" /> Submit Contributor Application
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ) : (
          /* Approved Contributor Post Studio */
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'write'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <PenSquare className="w-3.5 h-3.5" />
                Write & Submit Guide
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('my-posts')}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'my-posts'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                My Submissions & Moderation Status
              </button>
            </div>

            {activeTab === 'write' ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h2 className="text-lg font-bold text-slate-900">
                    Draft a Student Guide or Review
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Every article undergoes editorial review before public publication to maintain data
                    integrity and authenticity.
                  </p>
                </div>

                {postSuccess && (
                  <div className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-600" />
                    <span>{postSuccess}</span>
                  </div>
                )}

                {postError && (
                  <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{postError}</span>
                  </div>
                )}

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Guide Title
                      </label>
                      <input
                        type="text"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        placeholder="e.g. My Experience Studying MSc Data Science at Griffith College Dublin"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Category
                      </label>
                      <select
                        value={postCategory}
                        onChange={(e) => setPostCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Short Summary / Excerpt (displayed on cards)
                    </label>
                    <textarea
                      rows={2}
                      value={postExcerpt}
                      onChange={(e) => setPostExcerpt(e.target.value)}
                      placeholder="Concise 1-2 sentence overview of your key takeaways and advice..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Guide Content (Supports headings, bullet points, and markdown)
                    </label>
                    <textarea
                      rows={12}
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="Write your detailed guide here. Include practical steps, timeline milestones, real costs, and official links where applicable..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={postTags}
                      onChange={(e) => setPostTags(e.target.value)}
                      placeholder="Ireland, Masters, Visa, Dublin"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
                    />
                  </div>

                  {/* Disclaimer Checkbox */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={postAgreed}
                        onChange={(e) => setPostAgreed(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                      />
                      <span className="text-xs text-amber-950 leading-relaxed">
                        <strong>Contributor Authenticity Commitment:</strong> I confirm this submission is
                        based on genuine academic experience and does not include fabricated visa claims,
                        unverified financial promises, or copyright infringement. I understand that Borno admins
                        review and moderate all submissions prior to publication.
                      </span>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      disabled={postLoading}
                      onClick={() => handlePostSubmit('PENDING_REVIEW')}
                      className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-colors disabled:opacity-60 flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" /> Submit for Admin Review
                    </button>
                    <button
                      type="button"
                      disabled={postLoading}
                      onClick={() => handlePostSubmit('DRAFT')}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                    >
                      Save as Private Draft
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* My Submissions List */
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">My Submitted Guides</h2>

                {loadingPosts ? (
                  <div className="py-12 text-center text-xs text-slate-500">
                    Loading submissions...
                  </div>
                ) : myPosts.length === 0 ? (
                  <div className="py-12 text-center">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">No submissions yet</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Draft your first guide using the "Write & Submit Guide" tab above.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {myPosts.map((post) => (
                      <div key={post.id} className="py-4 flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                post.status === 'APPROVED'
                                  ? 'bg-teal-100 text-teal-800'
                                  : post.status === 'PENDING_REVIEW'
                                  ? 'bg-amber-100 text-amber-800'
                                  : post.status === 'REJECTED'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {post.status.replace(/_/g, ' ')}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 mt-1">{post.title}</h3>
                          {post.moderatorNote && (
                            <p className="mt-1 text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                              <strong>Moderator Note:</strong> {post.moderatorNote}
                            </p>
                          )}
                        </div>

                        {post.status === 'APPROVED' && (
                          <Link
                            to={`/community/${post.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 shrink-0"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Public Guide
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default ContributorStudioPage;
