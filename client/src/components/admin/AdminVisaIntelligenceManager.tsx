import React, { useState, useEffect } from 'react';
import {
  Compass,
  BarChart3,
  MapPin,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Edit2,
  RefreshCw,
  Search,
  Check,
  X,
  Building2,
  Globe2,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import {
  getVisaStatistics,
  getVisaCentres,
  adminGetVisaCorrections,
  adminReviewVisaCorrection,
  adminUpdateVisaStatistics,
  adminSeedVisaData,
} from '../../services/api';
import { VisaStatisticsItem, VisaApplicationCentreItem, VisaCorrectionReportItem } from '../../types/index';

export const AdminVisaIntelligenceManager: React.FC = () => {
  const [subTab, setSubTab] = useState<'statistics' | 'centres' | 'corrections' | 'sync'>('statistics');
  const [loading, setLoading] = useState(true);

  // Data states
  const [statistics, setStatistics] = useState<VisaStatisticsItem[]>([]);
  const [centres, setCentres] = useState<VisaApplicationCentreItem[]>([]);
  const [corrections, setCorrections] = useState<VisaCorrectionReportItem[]>([]);

  // Editing statistics modal
  const [editingStat, setEditingStat] = useState<VisaStatisticsItem | null>(null);
  const [editForm, setEditForm] = useState({
    approvalRate: '',
    refusalRate: '',
    applicationsDecided: '',
    applicationsApproved: '',
    applicationsRefused: '',
    reportingPeriod: '',
    dataStatus: 'OFFICIAL',
    calculationBasis: '',
  });

  // Review correction modal
  const [reviewingCorrection, setReviewingCorrection] = useState<VisaCorrectionReportItem | null>(null);
  const [adminReviewNotes, setAdminReviewNotes] = useState('');

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [statsRes, centresRes, corrRes] = await Promise.all([
        getVisaStatistics({ limit: 50, applicantNationality: 'ALL' }),
        getVisaCentres(),
        adminGetVisaCorrections().catch(() => []),
      ]);
      setStatistics(statsRes.statistics || []);
      setCentres(centresRes.centres || []);
      setCorrections(corrRes || []);
    } catch (err) {
      console.error('Failed to load admin visa data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStatOpen = (stat: VisaStatisticsItem) => {
    setEditingStat(stat);
    setEditForm({
      approvalRate: stat.approvalRate !== null ? String(stat.approvalRate) : '',
      refusalRate: stat.refusalRate !== null ? String(stat.refusalRate) : '',
      applicationsDecided: stat.applicationsDecided ? String(stat.applicationsDecided) : '',
      applicationsApproved: stat.applicationsApproved ? String(stat.applicationsApproved) : '',
      applicationsRefused: stat.applicationsRefused ? String(stat.applicationsRefused) : '',
      reportingPeriod: stat.reportingPeriod || '',
      dataStatus: stat.dataStatus || 'OFFICIAL',
      calculationBasis: stat.calculationBasis || '',
    });
  };

  const handleUpdateStat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStat) return;
    try {
      setSaving(true);
      await adminUpdateVisaStatistics(editingStat.id, {
        approvalRate: editForm.approvalRate ? parseFloat(editForm.approvalRate) : null,
        refusalRate: editForm.refusalRate ? parseFloat(editForm.refusalRate) : null,
        applicationsDecided: editForm.applicationsDecided ? parseInt(editForm.applicationsDecided, 10) : null,
        applicationsApproved: editForm.applicationsApproved ? parseInt(editForm.applicationsApproved, 10) : null,
        applicationsRefused: editForm.applicationsRefused ? parseInt(editForm.applicationsRefused, 10) : null,
        reportingPeriod: editForm.reportingPeriod,
        dataStatus: editForm.dataStatus as any,
        calculationBasis: editForm.calculationBasis,
      });

      setFeedback({ type: 'success', message: 'Visa statistics successfully updated and published.' });
      setEditingStat(null);
      await loadAll();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update visa statistics.' });
    } finally {
      setSaving(false);
    }
  };

  const handleReviewCorrection = async (action: 'APPROVED' | 'REJECTED') => {
    if (!reviewingCorrection) return;
    try {
      setSaving(true);
      await adminReviewVisaCorrection(reviewingCorrection.id, action, adminReviewNotes);
      setFeedback({
        type: 'success',
        message: `Correction report successfully ${action.toLowerCase()} and reporter notified.`,
      });
      setReviewingCorrection(null);
      setAdminReviewNotes('');
      await loadAll();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to review correction.' });
    } finally {
      setSaving(false);
    }
  };

  const handleTriggerSeed = async () => {
    try {
      setSaving(true);
      await adminSeedVisaData();
      setFeedback({ type: 'success', message: 'Official visa datasets successfully synchronized and verified.' });
      await loadAll();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to re-sync visa dataset.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats Overview */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Super Admin Visa Controls</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-950">
            Live Global Visa Intelligence &amp; Centres Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage official approval rates, Bangladesh application centre jurisdictions, India-travel determinations, and student error queues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAll}
            disabled={loading}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:text-navy-950 hover:bg-slate-100 transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleTriggerSeed}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sync Official Datasets</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-2 text-xs font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Subtab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setSubTab('statistics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            subTab === 'statistics'
              ? 'bg-navy-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Visa Statistics ({statistics.length})</span>
        </button>

        <button
          onClick={() => setSubTab('centres')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            subTab === 'centres'
              ? 'bg-navy-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Application Centres ({centres.length})</span>
        </button>

        <button
          onClick={() => setSubTab('corrections')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            subTab === 'corrections'
              ? 'bg-navy-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Pending Student Reports ({corrections.length})</span>
        </button>
      </div>

      {/* Subtab 1: Statistics Records */}
      {subTab === 'statistics' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Country &amp; Category</th>
                  <th className="p-3.5">Nationality</th>
                  <th className="p-3.5">Reporting Period</th>
                  <th className="p-3.5">Decided</th>
                  <th className="p-3.5">Approval %</th>
                  <th className="p-3.5">Refusal %</th>
                  <th className="p-3.5">Data Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {statistics.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5">
                      <span className="font-bold text-navy-950 block">{s.countryName} ({s.countryCode})</span>
                      <span className="text-[10px] text-slate-400">{s.visaCategory}</span>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-800">
                      {s.applicantNationality}
                    </td>
                    <td className="p-3.5">
                      <span className="font-medium text-slate-700">{s.reportingPeriod}</span>
                      <span className="text-[10px] text-slate-400 block">{s.reportingPeriodType}</span>
                    </td>
                    <td className="p-3.5 font-mono">
                      {s.applicationsDecided ? s.applicationsDecided.toLocaleString() : '—'}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-600">
                      {s.approvalRate !== null ? `${s.approvalRate}%` : '—'}
                    </td>
                    <td className="p-3.5 font-bold text-red-600">
                      {s.refusalRate !== null ? `${s.refusalRate}%` : '—'}
                    </td>
                    <td className="p-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        s.dataStatus === 'OFFICIAL'
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.dataStatus === 'UNAVAILABLE'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {s.dataStatus}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleEditStatOpen(s)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 2: Application Centres & India Travel Records */}
      {subTab === 'centres' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Destination Country</th>
                  <th className="p-3.5">Centre Facility</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Must Travel to India?</th>
                  <th className="p-3.5">Legal / Operational Reason</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {centres.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 font-bold text-navy-950">
                      {c.destinationCountryName} ({c.destinationCountryCode})
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-800 block">{c.centreName}</span>
                      <span className="text-[10px] text-teal-600">{c.serviceProvider}</span>
                    </td>
                    <td className="p-3.5 text-slate-600">
                      {c.city}, {c.country}
                    </td>
                    <td className="p-3.5">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        c.mustTravelToIndia === 'NO'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.mustTravelToIndia === 'YES'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.mustTravelToIndia}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600 max-w-xs text-[11px] truncate" title={c.indiaTravelReason || ''}>
                      {c.indiaTravelReason || 'Local processing confirmed'}
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 3: Student Corrections Queue */}
      {subTab === 'corrections' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-navy-950">
              Student Correction Reports Queue ({corrections.length})
            </h3>
            <span className="text-[11px] text-slate-500">
              Authorized administrator review required before public updates.
            </span>
          </div>

          {corrections.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">All student reports have been reviewed.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Queue is currently clear.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {corrections.map((corr) => (
                <div key={corr.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {corr.targetType}
                      </span>
                      <h4 className="font-bold text-sm text-navy-950">{corr.countryName}</h4>
                      <span className="text-xs text-slate-500">• {corr.issueCategory}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(corr.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200/70">
                    {corr.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                    <div className="flex items-center gap-3 text-slate-500">
                      {corr.reporterName && <span>Reporter: <strong>{corr.reporterName}</strong></span>}
                      {corr.evidenceUrl && (
                        <a
                          href={corr.evidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>Evidence Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setReviewingCorrection(corr);
                          setAdminReviewNotes('');
                        }}
                        className="px-3 py-1.5 bg-navy-900 text-white hover:bg-navy-800 rounded-lg text-xs font-semibold transition-all"
                      >
                        Review &amp; Resolve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Statistics Modal */}
      {editingStat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Edit Visa Statistics</h3>
                <p className="text-xs text-slate-300">{editingStat.countryName} ({editingStat.applicantNationality})</p>
              </div>
              <button onClick={() => setEditingStat(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStat} className="p-6 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Approval Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.approvalRate}
                    onChange={(e) => setEditForm({ ...editForm, approvalRate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Refusal Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.refusalRate}
                    onChange={(e) => setEditForm({ ...editForm, refusalRate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-red-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Decided</label>
                  <input
                    type="number"
                    value={editForm.applicationsDecided}
                    onChange={(e) => setEditForm({ ...editForm, applicationsDecided: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Approved</label>
                  <input
                    type="number"
                    value={editForm.applicationsApproved}
                    onChange={(e) => setEditForm({ ...editForm, applicationsApproved: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Refused</label>
                  <input
                    type="number"
                    value={editForm.applicationsRefused}
                    onChange={(e) => setEditForm({ ...editForm, applicationsRefused: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reporting Period</label>
                <input
                  type="text"
                  value={editForm.reportingPeriod}
                  onChange={(e) => setEditForm({ ...editForm, reportingPeriod: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Data Status</label>
                <select
                  value={editForm.dataStatus}
                  onChange={(e) => setEditForm({ ...editForm, dataStatus: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="OFFICIAL">OFFICIAL (Verified Government)</option>
                  <option value="UNAVAILABLE">UNAVAILABLE (Explicit Missing Flag)</option>
                  <option value="INDEPENDENTLY_REPORTED">INDEPENDENTLY_REPORTED</option>
                  <option value="ESTIMATED">ESTIMATED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Calculation Basis Note</label>
                <input
                  type="text"
                  value={editForm.calculationBasis}
                  onChange={(e) => setEditForm({ ...editForm, calculationBasis: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStat(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Correction Modal */}
      {reviewingCorrection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Review Student Report</h3>
                <p className="text-xs text-slate-300">{reviewingCorrection.countryName} • {reviewingCorrection.issueCategory}</p>
              </div>
              <button onClick={() => setReviewingCorrection(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                <p className="font-semibold text-slate-900 mb-1">Student Description:</p>
                {reviewingCorrection.description}
              </div>

              {reviewingCorrection.evidenceUrl && (
                <div className="text-xs text-slate-600">
                  <span className="font-semibold block mb-0.5">Submitted Official URL:</span>
                  <a
                    href={reviewingCorrection.evidenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:underline flex items-center gap-1 font-mono break-all"
                  >
                    <span>{reviewingCorrection.evidenceUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Super Admin Decision Notes
                </label>
                <textarea
                  rows={3}
                  value={adminReviewNotes}
                  onChange={(e) => setAdminReviewNotes(e.target.value)}
                  placeholder="Record your verification findings or rejection rationale..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleReviewCorrection('REJECTED')}
                  disabled={saving}
                  className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  Reject Report
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewingCorrection(null)}
                    className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReviewCorrection('APPROVED')}
                    disabled={saving}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
                  >
                    Approve &amp; Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
