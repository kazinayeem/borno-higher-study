import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
  Check,
  X,
  FileText,
  Globe,
  Filter,
  DollarSign,
  GraduationCap,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  getCountryWorkGuideOverview,
  adminGetCountryWorkCorrectionReports,
  adminReviewCorrectionReport,
  adminVerifyPolicy,
} from '../../services/api.js';
import { CountryWorkOverviewItem, PolicyCorrectionReportItem } from '../../types/index.js';

export const AdminCountryWorkGuideManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CORRECTIONS' | 'COMPLIANCE'>('OVERVIEW');
  const [countries, setCountries] = useState<CountryWorkOverviewItem[]>([]);
  const [reports, setReports] = useState<PolicyCorrectionReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Verification modal state
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verifyCountryId, setVerifyCountryId] = useState('');
  const [verifyEntityType, setVerifyEntityType] = useState('STUDENT_WORK');
  const [verifyStatus, setVerifyStatus] = useState('VERIFIED');
  const [verifyFindings, setVerifyFindings] = useState('');
  const [verifySourceUrl, setVerifySourceUrl] = useState('');
  const [isSubmittingVerify, setIsSubmittingVerify] = useState(false);

  // Review modal / action state
  const [reviewNoteModal, setReviewNoteModal] = useState<{
    id: string;
    action: 'APPROVED' | 'REJECTED';
    countryName: string;
  } | null>(null);
  const [adminNoteText, setAdminNoteText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [overviewData, reportsData] = await Promise.all([
        getCountryWorkGuideOverview(),
        adminGetCountryWorkCorrectionReports().catch(() => []),
      ]);
      setCountries(overviewData?.data || []);
      setReports(Array.isArray(reportsData?.reports) ? reportsData.reports : Array.isArray(reportsData) ? reportsData : []);
    } catch (err) {
      console.error('Failed to load country work guide admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenVerifyModal = (countryId?: string) => {
    setVerifyCountryId(countryId || (countries[0]?.id || ''));
    setVerifyEntityType('STUDENT_WORK');
    setVerifyStatus('VERIFIED');
    setVerifyFindings('Verified with current official government gazette / immigration portal.');
    setVerifySourceUrl('');
    setIsVerifyModalOpen(true);
  };

  const handleSaveVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCountryId || !verifySourceUrl) {
      alert('Please specify the country and a valid source URL');
      return;
    }
    setIsSubmittingVerify(true);
    try {
      await adminVerifyPolicy({
        countryId: verifyCountryId,
        entityType: verifyEntityType,
        status: verifyStatus,
        findings: verifyFindings,
        sourceUrl: verifySourceUrl,
      });
      setActionMessage('Policy verification record logged successfully.');
      setIsVerifyModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save verification');
    } finally {
      setIsSubmittingVerify(false);
    }
  };

  const handleReviewReport = async () => {
    if (!reviewNoteModal) return;
    setIsSubmittingReview(true);
    try {
      await adminReviewCorrectionReport(
        reviewNoteModal.id,
        reviewNoteModal.action,
        adminNoteText || (reviewNoteModal.action === 'APPROVED' ? 'Correction verified and applied to database.' : 'Reviewed and rejected: official source remains authoritative.')
      );
      setActionMessage(`Report marked as ${reviewNoteModal.action}.`);
      setReviewNoteModal(null);
      setAdminNoteText('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to review correction report');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const filteredCountries = countries.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      (c.officialLanguages && c.officialLanguages.some((l) => l.toLowerCase().includes(search.toLowerCase())));
    return matchesSearch;
  });

  const filteredReports = reports.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200 mb-2">
            <Briefcase className="w-4 h-4 text-teal-600" />
            <span>Country Work, Minimum Wage & Career Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 tracking-tight">
            Work Policies, Wage Audits & Student Correction Queue
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Audit legal hour limits, CBA vs. statutory minimum wages, post-graduation visa pathways, and moderate crowd-sourced student correction notices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenVerifyModal()}
            className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Log Policy Verification</span>
          </button>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Global Action Message */}
      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center justify-between">
          <span>{actionMessage}</span>
          <button
            type="button"
            onClick={() => setActionMessage(null)}
            className="text-teal-600 hover:text-teal-900 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'OVERVIEW'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          Country Verification Matrix ({countries.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('CORRECTIONS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'CORRECTIONS'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Student Corrections Queue ({reports.filter((r) => r.status === 'PENDING').length} Pending)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('COMPLIANCE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'COMPLIANCE'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          Statutory Compliance & Legal Units Checklist
        </button>
      </div>

      {/* TAB 1: OVERVIEW & VERIFICATION MATRIX */}
      {activeTab === 'OVERVIEW' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search country by name, code or language..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div className="text-xs text-slate-500">
              Showing <strong>{filteredCountries.length}</strong> of {countries.length} countries
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Student Work Limit</th>
                  <th className="py-3 px-4">Minimum Wage Model</th>
                  <th className="py-3 px-4">Post-Study Permit</th>
                  <th className="py-3 px-4">Official Sources</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCountries.map((c) => (
                  <tr key={c.code} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{c.flagEmoji}</span>
                        <div>
                          <span>{c.name}</span>
                          <span className="block text-[10px] text-slate-400 uppercase font-mono">{c.code} • {c.officialLanguages?.[0] || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {c.studentWork ? (
                        <div>
                          <span className="font-semibold">{c.studentWork.termTimeRuleText}</span>
                          <span className="block text-[10px] text-slate-400">{c.studentWork.holidayRuleText}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No policy recorded</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {c.wagePolicy ? (
                        <div>
                          {c.wagePolicy.hasStatutoryMinimum && c.wagePolicy.primaryRate ? (
                            <span className="font-semibold text-emerald-700">
                              {c.wagePolicy.primaryRate.currencySymbol}{c.wagePolicy.primaryRate.amount.toFixed(2)} / {c.wagePolicy.primaryRate.rateUnit.toLowerCase()}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-purple-700 font-semibold text-[11px]">
                              Collective Bargaining (CBA)
                            </span>
                          )}
                          <span className="block text-[10px] text-slate-400">{c.wagePolicy.governingBody}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No wage policy</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {c.postStudyWork ? (
                        <div>
                          <span className="font-semibold">{c.postStudyWork.routeName}</span>
                          <span className="block text-[10px] text-slate-400">Up to {c.postStudyWork.durationMonthsMax} months • {c.postStudyWork.leadsToPermanentResidence ? 'PR Pathway' : 'Temporary'}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        {c.officialSourceCount} verified portals
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200">
                        <CheckCircle2 className="w-3 h-3 text-teal-600" />
                        VERIFIED
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenVerifyModal(c.id)}
                          className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-[11px] transition-colors"
                        >
                          Verify
                        </button>
                        <Link
                          to={`/country-work-guide/${c.code.toLowerCase()}`}
                          target="_blank"
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Open Guide in New Tab"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT CORRECTIONS QUEUE */}
      {activeTab === 'CORRECTIONS' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Student & Contributor Policy Correction Reports</h3>
              <p className="text-xs text-slate-500">Crowdsourced corrections submitted by verified students studying abroad.</p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {filteredReports.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No correction reports match your current filter.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredReports.map((report) => (
                <div key={report.id} className="py-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        report.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : report.status === 'APPROVED'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {report.status}
                      </span>
                      <span className="font-bold text-sm text-slate-900">
                        {report.country?.flagEmoji} {report.country?.name} ({report.country?.code})
                      </span>
                      <span className="text-xs text-slate-400">• Policy Category: <strong>{report.entityType}</strong></span>
                    </div>

                    {report.status === 'PENDING' && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setReviewNoteModal({ id: report.id, action: 'APPROVED', countryName: report.country?.name || '' })}
                          className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve Correction
                        </button>
                        <button
                          type="button"
                          onClick={() => setReviewNoteModal({ id: report.id, action: 'REJECTED', countryName: report.country?.name || '' })}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="font-semibold text-slate-700 block mb-1">Reported Issue:</span>
                      <p className="text-slate-600">{report.reportedIssue}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-200">
                      <span className="font-semibold text-teal-900 block mb-1">Proposed Correction:</span>
                      <p className="text-teal-800">{report.proposedCorrection}</p>
                    </div>
                  </div>

                  {report.evidenceUrl && (
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <span>Evidence Link:</span>
                      <a
                        href={report.evidenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-700 hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        {report.evidenceUrl}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {report.adminNotes && (
                    <div className="p-2.5 rounded-lg bg-slate-100 text-xs text-slate-700 italic">
                      <strong>Staff Note:</strong> {report.adminNotes}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Submitted by: <strong>{report.user?.name || 'Anonymous Student'}</strong> ({report.user?.email || 'N/A'})</span>
                    <span>Date: {new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: STATUTORY COMPLIANCE & LEGAL UNITS CHECKLIST */}
      {activeTab === 'COMPLIANCE' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-teal-900 font-bold uppercase tracking-wider text-[11px] mb-0.5">
                Statutory Unit Integrity Policy:
              </strong>
              Never convert legal statutory hours or limits into arbitrary units. Foreign labor and immigration courts enforce precise legal statutory periods:
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">🇦🇺 Australia — Fair Work & DHA</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">48 Hours / Fortnight</span>
              </div>
              <p className="text-slate-600">
                Immigration rules strictly enforce 48 hours per fortnightly cycle (14 consecutive days starting Monday). Do NOT describe this as 24h per week, as averaging hours across individual weeks is legally penalized.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">🇩🇪 Germany — §16b AufenthG</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">140 Full / 280 Half Days</span>
              </div>
              <p className="text-slate-600">
                Increased from 120/240 days under the 2024 Skilled Immigration Act (Fachkräfteeinwanderungsgesetz). Any shift up to 4 hours counts as a half day; beyond 4 hours counts as a full day. Academic assistant (HiWi) work is exempt from this limit.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">🇸🇪 Sweden &amp; 🇫🇮 Finland — Nordic Model</span>
                <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 text-[10px] font-bold">No Statutory Minimum Wage</span>
              </div>
              <p className="text-slate-600">
                Wages are governed 100% by sectoral collective bargaining agreements (Kollektivavtal in Sweden, TES in Finland). Presenting a fictitious statutory minimum wage is legally inaccurate and misleading to students.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">🇺🇸 United States — F-1 SEVIS</span>
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold">20h/wk On-Campus Only</span>
              </div>
              <p className="text-slate-600">
                Off-campus employment is strictly unlawful during the first academic year without USCIS Economic Hardship or CPT authorization. Severe visa revocation consequences apply.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">🇨🇦 Canada — IRCC (Fall 2024 Rule)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">24h/wk Off-Campus</span>
              </div>
              <p className="text-slate-600">
                IRCC updated the off-campus student work threshold to 24 hours per week during academic terms, balancing work experience with academic course completion. Full-time work permitted during scheduled breaks.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">🇬🇧 United Kingdom — UKVI Student Route</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">20h/wk Term-Time</span>
              </div>
              <p className="text-slate-600">
                Degree-level students are permitted 20 hours per week during term time and full-time during official vacations. Self-employment, freelance work, gig platforming (Deliveroo/UberEats as sole trader) and professional sports are strictly prohibited.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VERIFICATION MODAL */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                Log Policy Verification Record
              </h3>
              <button
                type="button"
                onClick={() => setIsVerifyModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVerification} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Country</label>
                <select
                  value={verifyCountryId}
                  onChange={(e) => setVerifyCountryId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                >
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.flagEmoji} {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Entity / Policy Category</label>
                <select
                  value={verifyEntityType}
                  onChange={(e) => setVerifyEntityType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="STUDENT_WORK">Student Work Policy</option>
                  <option value="MINIMUM_WAGE">Minimum Wage Policy</option>
                  <option value="POST_STUDY_WORK">Post-Study Work Permit</option>
                  <option value="CAREER_ROADMAP">Career Roadmap</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Verification Status</label>
                <select
                  value={verifyStatus}
                  onChange={(e) => setVerifyStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="VERIFIED">VERIFIED (Active, current & validated)</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW (Pending legislative review)</option>
                  <option value="OUTDATED">OUTDATED (Policy superseded)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Official Government Source URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={verifySourceUrl}
                  onChange={(e) => setVerifySourceUrl(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Findings & Audit Notes</label>
                <textarea
                  rows={3}
                  value={verifyFindings}
                  onChange={(e) => setVerifyFindings(e.target.value)}
                  placeholder="Summarize validation findings..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVerifyModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingVerify}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold"
                >
                  {isSubmittingVerify ? 'Saving...' : 'Record Verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW NOTE MODAL */}
      {reviewNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {reviewNoteModal.action === 'APPROVED' ? 'Approve Correction' : 'Reject Correction'} — {reviewNoteModal.countryName}
            </h3>
            <p className="text-xs text-slate-500">
              Provide an administrative rationale for the student author and database revision log.
            </p>

            <textarea
              rows={3}
              value={adminNoteText}
              onChange={(e) => setAdminNoteText(e.target.value)}
              placeholder="e.g., Verified against official gazette and updated database."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-teal-500"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setReviewNoteModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReviewReport}
                disabled={isSubmittingReview}
                className={`px-4 py-2 rounded-xl text-white text-xs font-bold ${
                  reviewNoteModal.action === 'APPROVED' ? 'bg-teal-600 hover:bg-teal-500' : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {isSubmittingReview ? 'Processing...' : `Confirm ${reviewNoteModal.action}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminCountryWorkGuideManager;
