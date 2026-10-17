import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  AlertTriangle,
  CheckCircle,
  Flag,
  Globe,
  Info,
  DollarSign,
  History,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ApplicationDeadlineItem, DeadlineStatus } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { ReportCorrectionModal } from './ReportCorrectionModal.js';

interface DeadlinesPanelProps {
  universityId?: string;
  programId?: string;
  scholarshipId?: string;
  entityName: string;
  entitySlug?: string;
  entityType: 'UNIVERSITY' | 'PROGRAM' | 'SCHOLARSHIP';
}

export const DeadlinesPanel: React.FC<DeadlinesPanelProps> = ({
  universityId,
  programId,
  scholarshipId,
  entityName,
  entitySlug,
  entityType,
}) => {
  const { user, token, isAuthenticated } = useAuth();

  const [deadlines, setDeadlines] = useState<ApplicationDeadlineItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [selectedIntake, setSelectedIntake] = useState<string>('all');
  const [selectedAudience, setSelectedAudience] = useState<string>('all');

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [bookmarkLoading, setBookmarkLoading] = useState<string | null>(null);

  // Expanded revision histories
  const [expandedRevisions, setExpandedRevisions] = useState<Set<string>>(new Set());

  // Report Modal state
  const [reportingDeadline, setReportingDeadline] = useState<ApplicationDeadlineItem | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Fetch deadlines
  const fetchDeadlines = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (universityId) queryParams.append('universityId', universityId);
      if (programId) queryParams.append('programId', programId);
      if (scholarshipId) queryParams.append('scholarshipId', scholarshipId);

      const res = await fetch(`/api/deadlines?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to load application deadlines.');
      const data = await res.json();
      setDeadlines(data.deadlines || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error loading application deadlines.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's bookmarks if authenticated
  const fetchBookmarks = async () => {
    if (!isAuthenticated || !token) return;
    try {
      const res = await fetch('/api/deadlines/my-bookmarks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const ids = new Set<string>((data.bookmarks || []).map((b: any) => b.deadlineId));
        setBookmarkedIds(ids);
      }
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    }
  };

  useEffect(() => {
    fetchDeadlines();
  }, [universityId, programId, scholarshipId]);

  useEffect(() => {
    fetchBookmarks();
  }, [isAuthenticated, token]);

  const handleToggleBookmark = async (deadlineId: string) => {
    if (!isAuthenticated) {
      alert('Please log in or sign up to save deadlines to your Application Planner.');
      return;
    }

    try {
      setBookmarkLoading(deadlineId);
      const res = await fetch('/api/deadlines/bookmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ deadlineId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update planner.');

      setBookmarkedIds((prev) => {
        const updated = new Set(prev);
        if (data.bookmarked) {
          updated.add(deadlineId);
        } else {
          updated.delete(deadlineId);
        }
        return updated;
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBookmarkLoading(null);
    }
  };

  const toggleRevision = (id: string) => {
    setExpandedRevisions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getStatusBadge = (status: DeadlineStatus, isDisputed: boolean) => {
    if (isDisputed) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
          Under Review / Disputed
        </span>
      );
    }

    switch (status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            Open for Applications
          </span>
        );
      case 'CLOSING_SOON':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <Clock className="w-3.5 h-3.5 text-rose-600" />
            Closing Soon
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-300">
            <Calendar className="w-3.5 h-3.5 text-sky-600" />
            Upcoming
          </span>
        );
      case 'ROLLING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-300">
            <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
            Rolling Admissions
          </span>
        );
      case 'EXTENDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-300">
            <Calendar className="w-3.5 h-3.5 text-purple-600" />
            Deadline Extended
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            Applications Closed
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
            Temporarily Suspended
          </span>
        );
      case 'NOT_ANNOUNCED':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Not Officially Announced
          </span>
        );
    }
  };

  const formatDate = (isoString?: string | null, time?: string | null, tz?: string | null) => {
    if (!isoString) return 'Not officially announced';
    const date = new Date(isoString);
    const dateFormatted = date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const timeFormatted = time ? ` at ${time}` : '';
    const tzFormatted = tz ? ` (${tz})` : '';
    return `${dateFormatted}${timeFormatted}${tzFormatted}`;
  };

  // Unique intake semesters
  const intakeOptions = Array.from(new Set(deadlines.map((d) => d.intakeSemester)));

  const filteredDeadlines = deadlines.filter((d) => {
    if (selectedIntake !== 'all' && d.intakeSemester !== selectedIntake) return false;
    if (selectedAudience !== 'all' && d.targetAudience !== selectedAudience) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 my-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-50 text-teal-700">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-heading font-semibold text-brand-navy tracking-tight">
              Application Deadlines & Intakes
            </h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Real-time, verified application rounds sourced directly from official institution admissions portals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setReportingDeadline(null);
              setIsReportModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            <Flag className="w-3.5 h-3.5 text-slate-500" />
            Report Date Error
          </button>
        </div>
      </div>

      {/* Filter Tabs if multiple intakes or audiences */}
      {deadlines.length > 1 && (
        <div className="flex flex-wrap items-center gap-3 pt-5 pb-2">
          {intakeOptions.length > 1 && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">Intake:</span>
              <button
                type="button"
                onClick={() => setSelectedIntake('all')}
                className={`px-3 py-1 rounded-full border transition-colors ${
                  selectedIntake === 'all'
                    ? 'bg-navy-900 text-white border-navy-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                All
              </button>
              {intakeOptions.map((intake) => (
                <button
                  key={intake}
                  type="button"
                  onClick={() => setSelectedIntake(intake)}
                  className={`px-3 py-1 rounded-full border transition-colors ${
                    selectedIntake === intake
                      ? 'bg-navy-900 text-white border-navy-900'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {intake}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs ml-auto">
            <span className="text-slate-500 font-medium">Eligibility:</span>
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              <option value="all">All Applicants</option>
              <option value="INTERNATIONAL">International</option>
              <option value="DOMESTIC">Domestic</option>
              <option value="ALL">Both / Universal</option>
            </select>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm">Checking official admission timelines...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-4 my-4 bg-red-50 text-red-800 border border-red-200 rounded-xl text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredDeadlines.length === 0 && (
        <div className="py-12 px-4 text-center bg-slate-50/70 border border-dashed border-slate-200 rounded-xl my-4">
          <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">
            No verified application dates published yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
            Borno Higher Study verifies deadlines strictly against official admission bulletins to avoid outdated or misleading student advice.
          </p>
          <button
            type="button"
            onClick={() => {
              setReportingDeadline(null);
              setIsReportModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors"
          >
            <Flag className="w-3.5 h-3.5" />
            Submit Official Deadline Link
          </button>
        </div>
      )}

      {/* Deadlines List */}
      {!loading && !error && filteredDeadlines.length > 0 && (
        <div className="space-y-5 pt-4">
          {filteredDeadlines.map((deadline) => {
            const isBookmarked = bookmarkedIds.has(deadline.id);
            const isRevisionsExpanded = expandedRevisions.has(deadline.id);

            return (
              <div
                key={deadline.id}
                className={`p-5 sm:p-6 rounded-xl border transition-all ${
                  deadline.isDisputed
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-slate-200 hover:border-teal-300 bg-white'
                }`}
              >
                {/* Dispute Alert Banner */}
                {deadline.isDisputed && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Deadline information under review:</span> A student report indicated that this deadline may have changed. Our team is verifying with official portal updates.
                      {deadline.disputeNote && (
                        <p className="mt-1 text-amber-800 font-mono text-[11px]">
                          Note: {deadline.disputeNote}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Card Top Row: Intake & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-heading font-semibold text-brand-navy">
                        {deadline.intakeSemester} {deadline.academicYear}
                      </span>
                      {deadline.roundName && (
                        <span className="text-xs px-2.5 py-0.5 bg-slate-100 text-slate-700 font-medium rounded-md">
                          {deadline.roundName}
                        </span>
                      )}
                      <span className="text-xs px-2.5 py-0.5 bg-teal-50 text-teal-800 font-medium rounded-md">
                        {deadline.applicationType}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 bg-slate-100 text-slate-600 font-medium rounded-md">
                        {deadline.targetAudience === 'INTERNATIONAL'
                          ? 'International Students'
                          : deadline.targetAudience === 'DOMESTIC'
                          ? 'Domestic Only'
                          : 'Universal'}
                      </span>
                    </div>
                    {deadline.program && (
                      <p className="text-xs text-slate-500 mt-1">
                        Applies to: <span className="font-medium text-slate-700">{deadline.program.name}</span> ({deadline.program.degreeLevel})
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(deadline.computedStatus, deadline.isDisputed)}
                    <button
                      type="button"
                      disabled={bookmarkLoading === deadline.id}
                      onClick={() => handleToggleBookmark(deadline.id)}
                      title={isBookmarked ? 'Remove from Planner' : 'Add to Personal Planner'}
                      className={`p-2 rounded-lg border transition-all ${
                        isBookmarked
                          ? 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-navy-900 hover:bg-slate-100'
                      }`}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-teal-700" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Key Dates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 border-y border-slate-100 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-slate-500 font-medium">Application Opens</div>
                      <div className="text-slate-800 font-semibold mt-0.5">
                        {deadline.isRolling
                          ? 'Rolling Open'
                          : formatDate(deadline.openDate, deadline.openTime, deadline.timeZone)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-rose-50 text-rose-700 rounded-lg shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-slate-500 font-medium">Application Closes</div>
                      <div className="text-slate-800 font-semibold mt-0.5">
                        {deadline.isRolling
                          ? 'Rolling / Open Until Program Filled'
                          : formatDate(deadline.closeDate, deadline.closeTime, deadline.timeZone)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info Row: Fee & Verification */}
                <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-2 text-xs text-slate-500">
                  <div className="flex items-center gap-4 flex-wrap">
                    {deadline.applicationFee !== undefined && deadline.applicationFee !== null && (
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                        Application Fee: {deadline.currencyCode || 'USD'} {deadline.applicationFee}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                      Last verified:{' '}
                      <span className="text-slate-700 font-medium">
                        {new Date(deadline.lastVerifiedAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </span>
                  </div>

                  {/* Actions: Links & Reporting */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {deadline.officialAppUrl && (
                      <a
                        href={deadline.officialAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-semibold"
                      >
                        Apply on Official Portal
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {deadline.officialSourceUrl && (
                      <a
                        href={deadline.officialSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-navy-900 underline underline-offset-2"
                      >
                        Official Dates Source
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setReportingDeadline(deadline);
                        setIsReportModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 ml-1"
                    >
                      <Flag className="w-3 h-3" />
                      Report Correction
                    </button>
                  </div>
                </div>

                {/* Revision History Toggle */}
                {deadline.revisions && deadline.revisions.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => toggleRevision(deadline.id)}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium"
                    >
                      <History className="w-3.5 h-3.5" />
                      {isRevisionsExpanded ? 'Hide Revision History' : 'View Verified Changes & Extensions'}
                      {isRevisionsExpanded ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>

                    {isRevisionsExpanded && (
                      <div className="mt-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
                        <div className="font-semibold text-slate-700">Audit History:</div>
                        {deadline.revisions.map((rev) => (
                          <div key={rev.id} className="text-slate-600 border-l-2 border-teal-500 pl-2 py-0.5">
                            <span className="font-medium text-slate-800">{rev.reason}</span>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Status changed to <span className="font-semibold">{rev.newStatus}</span> by {rev.changedBy} on{' '}
                              {new Date(rev.timestamp).toLocaleDateString('en-GB')}.
                              {rev.sourceEvidenceUrl && (
                                <a
                                  href={rev.sourceEvidenceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-1 text-teal-700 underline inline-flex items-center gap-0.5"
                                >
                                  View Source Evidence <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Report Modal */}
      <ReportCorrectionModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setReportingDeadline(null);
        }}
        entityType={reportingDeadline ? 'DEADLINE' : entityType}
        entityId={reportingDeadline ? reportingDeadline.id : (universityId || programId || scholarshipId || '')}
        entityName={reportingDeadline ? `${entityName} (${reportingDeadline.intakeSemester} ${reportingDeadline.academicYear})` : entityName}
        entitySlug={entitySlug}
        defaultField={reportingDeadline ? 'CLOSE_DATE' : 'OTHER'}
        currentValue={reportingDeadline ? formatDate(reportingDeadline.closeDate, reportingDeadline.closeTime, reportingDeadline.timeZone) : ''}
      />
    </div>
  );
};
