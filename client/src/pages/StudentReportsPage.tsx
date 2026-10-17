import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { InformationReportItem } from '../types/index.js';
import { SeoHead } from '../components/common/SeoHead.js';
import { Breadcrumbs } from '../components/common/Breadcrumbs.js';
import {
  Flag,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  MessageSquare,
  Send,
  ShieldCheck,
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Search,
} from 'lucide-react';

export const StudentReportsPage: React.FC = () => {
  const { user, token, isAuthenticated } = useAuth();

  const [reports, setReports] = useState<InformationReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Expanded report cards
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  // Resubmission form state
  const [resubmittingId, setResubmittingId] = useState<string | null>(null);
  const [additionalEvidenceUrl, setAdditionalEvidenceUrl] = useState('');
  const [resubmitMessage, setResubmitMessage] = useState('');
  const [submittingResubmit, setSubmittingResubmit] = useState(false);
  const [resubmitSuccess, setResubmitSuccess] = useState<string | null>(null);

  const fetchMyReports = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/reports/my-reports', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load your reports.');
      const data = await res.json();
      setReports(data.reports || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error loading reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyReports();
    }
  }, [isAuthenticated, token]);

  const handleResubmit = async (reportId: string) => {
    if (!additionalEvidenceUrl && !resubmitMessage) {
      alert('Please provide an updated official source URL or a message.');
      return;
    }

    try {
      setSubmittingResubmit(true);
      const res = await fetch(`/api/reports/${reportId}/resubmit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          additionalEvidenceUrl,
          message: resubmitMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to resubmit evidence.');

      setResubmitSuccess(data.message || 'Evidence submitted successfully.');
      setResubmittingId(null);
      setAdditionalEvidenceUrl('');
      setResubmitMessage('');
      fetchMyReports();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingResubmit(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <Flag className="w-12 h-12 text-teal-600 mx-auto mb-4" />
          <h2 className="text-xl font-heading font-semibold text-brand-navy tracking-tight mb-2">Authentication Required</h2>
          <p className="text-sm text-slate-600 mb-6">
            Please log in to your Borno Higher Study account to track your submitted corrections and respond to editorial feedback.
          </p>
          <Link
            to="/login?redirect=/dashboard/reports"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Sign In to Continue
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Approved & Published
          </span>
        );
      case 'MORE_INFO_REQUESTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            More Evidence Requested
          </span>
        );
      case 'RESUBMITTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-300">
            <RefreshCw className="w-3.5 h-3.5 text-sky-600" />
            Resubmitted for Review
          </span>
        );
      case 'UNDER_INVESTIGATION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-300">
            <Clock className="w-3.5 h-3.5 text-purple-600" />
            Under Investigation
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            Not Approved
          </span>
        );
      case 'DUPLICATE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            Duplicate Report
          </span>
        );
      case 'SUBMITTED':
      case 'PENDING_REVIEW':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            Pending Review
          </span>
        );
    }
  };

  const filteredReports = reports.filter((r) => {
    if (statusFilter === 'pending' && !['SUBMITTED', 'PENDING_REVIEW', 'UNDER_INVESTIGATION'].includes(r.status)) {
      return false;
    }
    if (statusFilter === 'action_needed' && r.status !== 'MORE_INFO_REQUESTED') {
      return false;
    }
    if (statusFilter === 'approved' && !['APPROVED', 'RESOLVED'].includes(r.status)) {
      return false;
    }
    if (statusFilter === 'rejected' && !['REJECTED', 'DUPLICATE'].includes(r.status)) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchEntity = r.entityName.toLowerCase().includes(q);
      const matchNumber = r.reportNumber.toLowerCase().includes(q);
      const matchField = r.fieldBelievedIncorrect.toLowerCase().includes(q);
      return matchEntity || matchNumber || matchField;
    }
    return true;
  });

  const countActionNeeded = reports.filter((r) => r.status === 'MORE_INFO_REQUESTED').length;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <SeoHead
        title="My Data Reports & Corrections — Borno Higher Study"
        description="Track the status of your submitted factual corrections, deadlines, tuition reports, and official evidence requests."
        canonicalPath="/dashboard/reports"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Factual Error Reports' },
          ]}
        />

        {/* Hero Header */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
                  <Flag className="w-6 h-6" />
                </span>
                <h1 className="text-2xl sm:text-3xl font-heading font-semibold text-brand-navy tracking-tight">
                  My Community Factual Reports
                </h1>
              </div>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl">
                Borno Higher Study relies on strict official-source verification. Track your submissions below, check editorial decisions, or provide additional institutional evidence if requested.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/universities"
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors inline-flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                Browse Directory
              </Link>
            </div>
          </div>

          {/* Privacy & Safeguard Banner */}
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              <strong>Privacy Guaranteed:</strong> Your identity and report history are strictly private to you and the editorial board. No student names are ever displayed on public university or program pages.
            </span>
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Total Submitted</span>
              <p className="text-2xl font-bold text-navy-950 mt-1">{reports.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
              <span className="text-xs text-amber-800 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-600" /> Action Needed
              </span>
              <p className="text-2xl font-bold text-amber-900 mt-1">{countActionNeeded}</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <span className="text-xs text-emerald-800 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
              </span>
              <p className="text-2xl font-bold text-emerald-900 mt-1">
                {reports.filter((r) => ['APPROVED', 'RESOLVED'].includes(r.status)).length}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200">
              <span className="text-xs text-sky-800 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-sky-600" /> In Review
              </span>
              <p className="text-2xl font-bold text-sky-900 mt-1">
                {reports.filter((r) => ['SUBMITTED', 'PENDING_REVIEW', 'UNDER_INVESTIGATION', 'RESUBMITTED'].includes(r.status)).length}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                statusFilter === 'all'
                  ? 'bg-navy-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Reports ({reports.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('action_needed')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                statusFilter === 'action_needed'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
              }`}
            >
              Evidence Needed ({countActionNeeded})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                statusFilter === 'pending'
                  ? 'bg-teal-700 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              In Progress
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('approved')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                statusFilter === 'approved'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Approved
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('rejected')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                statusFilter === 'rejected'
                  ? 'bg-rose-700 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Not Approved
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search reports by institution or #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Resubmit Success Toast */}
        {resubmitSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{resubmitSuccess}</span>
            </div>
            <button
              type="button"
              onClick={() => setResubmitSuccess(null)}
              className="text-xs text-emerald-700 underline font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Reports List */}
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm">Loading your factual submissions...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-xl text-sm">
            {error}
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="py-16 px-4 text-center bg-white rounded-2xl border border-slate-200">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No reports found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
              You haven't submitted any factual reports in this category. You can report incorrect dates, outdated tuition fees, or broken links directly from any institution page.
            </p>
            <Link
              to="/universities"
              className="inline-flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-semibold hover:bg-navy-800 transition-colors"
            >
              Browse Universities
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => {
              const isExpanded = expandedReportId === report.id;
              const isActionNeeded = report.status === 'MORE_INFO_REQUESTED';

              return (
                <div
                  key={report.id}
                  className={`bg-white rounded-2xl border transition-all ${
                    isActionNeeded
                      ? 'border-amber-300 shadow-md ring-1 ring-amber-200'
                      : 'border-slate-200/90 shadow-sm hover:border-slate-300'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs font-bold text-navy-950 bg-slate-100 px-2 py-0.5 rounded">
                          {report.reportNumber}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800">
                          {report.entityType}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          Field: {report.fieldBelievedIncorrect}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(report.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(report.status)}
                      </div>
                    </div>

                    {/* Entity title */}
                    <div className="mt-3">
                      <h3 className="text-lg font-heading font-semibold text-brand-navy tracking-tight">
                        {report.entityName}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        <strong className="text-slate-700">Issue reported:</strong> {report.description}
                      </p>
                    </div>

                    {/* Quick values comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 block font-medium">Current Listed Value</span>
                        <span className="text-slate-700 font-mono mt-0.5 block break-words">
                          {report.currentValue || 'Not specifically provided'}
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                        <span className="text-emerald-800 block font-medium">Proposed Correction</span>
                        <span className="text-emerald-950 font-mono font-semibold mt-0.5 block break-words">
                          {report.proposedCorrection || 'Factual inaccuracy without replacement proposal'}
                        </span>
                      </div>
                    </div>

                    {/* Action Needed Banner */}
                    {isActionNeeded && (
                      <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 space-y-2">
                        <div className="flex items-center gap-2 font-bold text-amber-950">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          Editor Feedback: Additional Verification Required
                        </div>
                        <p className="text-amber-800">
                          {report.adminFeedback || 'Please provide an updated official admission bulletin URL or direct departmental link.'}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setExpandedReportId(report.id);
                            setResubmittingId(report.id);
                          }}
                          className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-xs transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Respond & Resubmit Evidence
                        </button>
                      </div>
                    )}

                    {/* Toggle expand button */}
                    <div className="mt-4 flex items-center justify-between text-xs pt-2">
                      <div className="flex items-center gap-3">
                        <a
                          href={report.officialEvidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-700 hover:text-teal-800 font-semibold inline-flex items-center gap-1"
                        >
                          Evidence Source <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedReportId(isExpanded ? null : report.id)}
                        className="text-slate-600 hover:text-navy-950 font-medium inline-flex items-center gap-1"
                      >
                        {isExpanded ? 'Hide Discussion & Audit Trail' : 'View Editorial Thread & History'}
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Section: Audit Log & Comments & Resubmit */}
                  {isExpanded && (
                    <div className="p-6 bg-slate-50/70 border-t border-slate-100 rounded-b-2xl space-y-6 text-xs">
                      {/* Editorial feedback */}
                      {report.adminFeedback && (
                        <div className="p-4 bg-white rounded-xl border border-slate-200">
                          <span className="font-semibold text-slate-800 block mb-1">Editor Decision Note:</span>
                          <p className="text-slate-700">{report.adminFeedback}</p>
                          {report.reviewedAt && (
                            <span className="text-[11px] text-slate-400 mt-2 block">
                              Reviewed by {report.reviewedBy || 'Editorial Board'} on {new Date(report.reviewedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Comment Thread */}
                      {report.comments && report.comments.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4 text-teal-600" />
                            Editorial Correspondence Thread
                          </h4>
                          <div className="space-y-2.5">
                            {report.comments.map((comment) => (
                              <div
                                key={comment.id}
                                className={`p-3.5 rounded-xl border ${
                                  comment.authorRole === 'STUDENT'
                                    ? 'bg-teal-50/40 border-teal-200 ml-4'
                                    : 'bg-white border-slate-200 mr-4'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="font-bold text-slate-800">
                                    {comment.authorName} ({comment.authorRole})
                                  </span>
                                  <span className="text-[11px] text-slate-400">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-slate-700 leading-relaxed">{comment.message}</p>
                                {comment.evidenceUrl && (
                                  <a
                                    href={comment.evidenceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1.5 text-teal-700 font-semibold underline inline-flex items-center gap-1"
                                  >
                                    Linked Official Evidence <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Resubmission form when requested or initiated */}
                      {(isActionNeeded || resubmittingId === report.id) && (
                        <div className="p-4 bg-white rounded-xl border border-teal-200 shadow-sm space-y-3">
                          <h4 className="font-bold text-slate-800">Provide Additional Official Evidence</h4>
                          <p className="text-slate-500">
                            Submit a revised official institutional link or bulletin excerpt to satisfy the editorial verification requirement.
                          </p>

                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">
                              Updated Official Institutional URL <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="url"
                              placeholder="https://www.university.edu/admissions/dates"
                              value={additionalEvidenceUrl}
                              onChange={(e) => setAdditionalEvidenceUrl(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-600 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">
                              Clarification Message for the Reviewer
                            </label>
                            <textarea
                              rows={3}
                              placeholder="Describe where the date or requirement is stated on the page..."
                              value={resubmitMessage}
                              onChange={(e) => setResubmitMessage(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-600 focus:outline-none"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setResubmittingId(null);
                                setAdditionalEvidenceUrl('');
                                setResubmitMessage('');
                              }}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              disabled={submittingResubmit}
                              onClick={() => handleResubmit(report.id)}
                              className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <Send className="w-3.5 h-3.5" />
                              {submittingResubmit ? 'Resubmitting...' : 'Resubmit Evidence'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
