import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { ApplicationDeadlineItem, University } from '../../types/index.js';
import {
  Calendar,
  Clock,
  ExternalLink,
  Plus,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  Search,
  History,
  X,
  Globe,
  DollarSign,
} from 'lucide-react';

export const AdminDeadlinesManager: React.FC = () => {
  const { token } = useAuth();

  const [deadlines, setDeadlines] = useState<ApplicationDeadlineItem[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [intakeFilter, setIntakeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<ApplicationDeadlineItem | null>(null);

  // Create form state
  const [universityId, setUniversityId] = useState('');
  const [intakeSemester, setIntakeSemester] = useState('Autumn 2026');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [applicationType, setApplicationType] = useState('POSTGRADUATE');
  const [targetAudience, setTargetAudience] = useState('INTERNATIONAL');
  const [roundName, setRoundName] = useState('Main Round');
  const [openDate, setOpenDate] = useState('2026-01-15');
  const [closeDate, setCloseDate] = useState('2026-07-31');
  const [timeZone, setTimeZone] = useState('GMT');
  const [isRolling, setIsRolling] = useState(false);
  const [applicationFee, setApplicationFee] = useState<number | ''>(50);
  const [currencyCode, setCurrencyCode] = useState('EUR');
  const [officialAppUrl, setOfficialAppUrl] = useState('');
  const [officialSourceUrl, setOfficialSourceUrl] = useState('');
  const [submittingForm, setSubmittingForm] = useState(false);

  // Edit / Extension form state
  const [editCloseDate, setEditCloseDate] = useState('');
  const [editStatus, setEditStatus] = useState('OPEN');
  const [editReason, setEditReason] = useState('');
  const [editSourceUrl, setEditSourceUrl] = useState('');
  const [editIsDisputed, setEditIsDisputed] = useState(false);
  const [editDisputeNote, setEditDisputeNote] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchDeadlinesAndUnis = async () => {
    try {
      setLoading(true);
      setError(null);

      // Deadlines
      const resD = await fetch('/api/deadlines');
      const dataD = await resD.json();
      setDeadlines(dataD.deadlines || []);

      // Universities
      const resU = await fetch('/api/universities?limit=100');
      const dataU = await resU.json();
      setUniversities(dataU.universities || []);
      if (dataU.universities && dataU.universities.length > 0 && !universityId) {
        setUniversityId(dataU.universities[0].id);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error fetching deadlines.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeadlinesAndUnis();
  }, []);

  const handleCreateDeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!officialSourceUrl) {
      alert('Official Source URL is required to verify this intake.');
      return;
    }

    try {
      setSubmittingForm(true);
      const res = await fetch('/api/deadlines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          universityId,
          intakeSemester,
          academicYear,
          applicationType,
          targetAudience,
          roundName,
          openDate: isRolling ? null : openDate,
          closeDate: isRolling ? null : closeDate,
          timeZone,
          isRolling,
          applicationFee: applicationFee === '' ? null : applicationFee,
          currencyCode,
          officialAppUrl,
          officialSourceUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create application deadline.');

      setToastMessage('Verified application intake deadline created successfully.');
      setIsCreateModalOpen(false);
      fetchDeadlinesAndUnis();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingForm(false);
    }
  };

  const handleUpdateDeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingDeadline) return;

    if (!editReason) {
      alert('Please specify the justification or official reason for this deadline modification.');
      return;
    }

    try {
      setSubmittingForm(true);
      const res = await fetch(`/api/deadlines/${editingDeadline.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          closeDate: editCloseDate ? new Date(editCloseDate).toISOString() : null,
          status: editStatus,
          reason: editReason,
          officialSourceUrl: editSourceUrl || editingDeadline.officialSourceUrl,
          isDisputed: editIsDisputed,
          disputeNote: editDisputeNote,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update application deadline.');

      setToastMessage('Deadline updated and recorded in immutable revision audit trail.');
      setEditingDeadline(null);
      fetchDeadlinesAndUnis();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingForm(false);
    }
  };

  const openEditModal = (d: ApplicationDeadlineItem) => {
    setEditingDeadline(d);
    setEditCloseDate(d.closeDate ? d.closeDate.substring(0, 10) : '');
    setEditStatus(d.status || 'OPEN');
    setEditReason('');
    setEditSourceUrl(d.officialSourceUrl || '');
    setEditIsDisputed(d.isDisputed || false);
    setEditDisputeNote(d.disputeNote || '');
  };

  const filtered = deadlines.filter((d) => {
    if (intakeFilter !== 'all' && d.intakeSemester !== intakeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchUni = d.university?.name.toLowerCase().includes(q);
      const matchProg = d.program?.name.toLowerCase().includes(q);
      const matchIntake = d.intakeSemester.toLowerCase().includes(q);
      return matchUni || matchProg || matchIntake;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-xs text-emerald-700 underline font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by institution or intake..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <select
            value={intakeFilter}
            onChange={(e) => setIntakeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-600"
          >
            <option value="all">All Intake Semesters</option>
            <option value="Autumn 2026">Autumn 2026</option>
            <option value="Spring 2027">Spring 2027</option>
            <option value="Semester 1 2026">Semester 1 2026</option>
            <option value="Rolling 2026">Rolling 2026</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Create Intake & Deadline
        </button>
      </div>

      {/* Deadlines Table */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">Loading application intakes...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-xl text-sm">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 px-4 text-center bg-white rounded-2xl border border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No application deadlines found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Click "Create Intake & Deadline" to publish verified opening and closing dates for any university.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Institution & Program</th>
                  <th className="py-3 px-4">Intake & Type</th>
                  <th className="py-3 px-4">Application Window</th>
                  <th className="py-3 px-4">Computed Status</th>
                  <th className="py-3 px-4">Fee</th>
                  <th className="py-3 px-4">Official Sources</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-heading font-semibold text-brand-navy">
                        {d.university?.name || 'Institution-wide'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {d.program ? d.program.name : 'All Programs'} ({d.targetAudience})
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">
                        {d.intakeSemester} {d.academicYear}
                      </span>
                      <div className="text-[11px] text-teal-700 font-medium">
                        {d.applicationType}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {d.isRolling ? (
                        <span className="text-teal-700 font-bold">Rolling Admissions</span>
                      ) : (
                        <div>
                          <div>
                            Opens: {d.openDate ? new Date(d.openDate).toLocaleDateString('en-GB') : 'TBA'}
                          </div>
                          <div>
                            Closes: {d.closeDate ? new Date(d.closeDate).toLocaleDateString('en-GB') : 'TBA'}
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {d.isDisputed ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          Disputed
                        </span>
                      ) : (
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            d.computedStatus === 'OPEN'
                              ? 'bg-emerald-100 text-emerald-800'
                              : d.computedStatus === 'CLOSING_SOON'
                              ? 'bg-rose-100 text-rose-800'
                              : d.computedStatus === 'UPCOMING'
                              ? 'bg-sky-100 text-sky-800'
                              : d.computedStatus === 'ROLLING'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {d.computedStatus}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {d.applicationFee !== null && d.applicationFee !== undefined ? (
                        <span className="font-medium text-slate-700">
                          {d.currencyCode} {d.applicationFee}
                        </span>
                      ) : (
                        <span className="text-slate-400">Free / None</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <a
                        href={d.officialSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-700 hover:text-teal-800 font-medium inline-flex items-center gap-1 underline underline-offset-2"
                      >
                        Evidence Source <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openEditModal(d)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3 text-slate-500" />
                        Edit / Extend
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-heading font-semibold text-brand-navy tracking-tight">
                Create Application Intake & Deadline
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeadline} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Target Institution <span className="text-rose-500">*</span>
                </label>
                <select
                  value={universityId}
                  onChange={(e) => setUniversityId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  required
                >
                  {universities.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.countryName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Intake Semester</label>
                  <input
                    type="text"
                    value={intakeSemester}
                    onChange={(e) => setIntakeSemester(e.target.value)}
                    placeholder="e.g. Autumn 2026"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="e.g. 2026-2027"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Application Type</label>
                  <select
                    value={applicationType}
                    onChange={(e) => setApplicationType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="UNDERGRADUATE">Undergraduate</option>
                    <option value="POSTGRADUATE">Postgraduate</option>
                    <option value="PHD">PhD / Doctorate</option>
                    <option value="FOUNDATION">Foundation / Pathway</option>
                    <option value="SCHOLARSHIP">Scholarship Round</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Eligibility</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="INTERNATIONAL">International Students</option>
                    <option value="DOMESTIC">Domestic Applicants</option>
                    <option value="ALL">Universal</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={isRolling}
                    onChange={(e) => setIsRolling(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-600"
                  />
                  Rolling Admissions (Open Until Program Capacity Filled)
                </label>

                {!isRolling && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Open Date</label>
                      <input
                        type="date"
                        value={openDate}
                        onChange={(e) => setOpenDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Close Date</label>
                      <input
                        type="date"
                        value={closeDate}
                        onChange={(e) => setCloseDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Application Fee</label>
                  <input
                    type="number"
                    value={applicationFee}
                    onChange={(e) => setApplicationFee(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 50"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Currency</label>
                  <input
                    type="text"
                    value={currencyCode}
                    onChange={(e) => setCurrencyCode(e.target.value)}
                    placeholder="e.g. EUR, USD, AUD"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Official Application Portal URL:
                </label>
                <input
                  type="url"
                  value={officialAppUrl}
                  onChange={(e) => setOfficialAppUrl(e.target.value)}
                  placeholder="https://admissions.institution.edu/apply"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Official Source Verification URL <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="url"
                  value={officialSourceUrl}
                  onChange={(e) => setOfficialSourceUrl(e.target.value)}
                  placeholder="https://www.institution.edu/admissions/key-dates"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingForm}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold"
                >
                  {submittingForm ? 'Creating...' : 'Publish Verified Intake'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit / Extend Modal */}
      {editingDeadline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-heading font-semibold text-brand-navy tracking-tight">
                Edit or Extend Application Deadline
              </h3>
              <button
                type="button"
                onClick={() => setEditingDeadline(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateDeadline} className="space-y-4 text-xs">
              <div>
                <span className="text-slate-500">Institution:</span>
                <p className="font-bold text-navy-950">
                  {editingDeadline.university?.name} ({editingDeadline.intakeSemester} {editingDeadline.academicYear})
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">New Closing Date:</label>
                <input
                  type="date"
                  value={editCloseDate}
                  onChange={(e) => setEditCloseDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Application Status:</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="OPEN">Open</option>
                  <option value="EXTENDED">Deadline Extended</option>
                  <option value="CLOSED">Closed</option>
                  <option value="SUSPENDED">Temporarily Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Official Justification / Reason <span className="text-rose-500">*</span>:
                </label>
                <textarea
                  rows={2}
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  placeholder="e.g. Faculty of Science extended international portal deadline until Aug 15."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Official Evidence Source URL:</label>
                <input
                  type="url"
                  value={editSourceUrl}
                  onChange={(e) => setEditSourceUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-900">
                  <input
                    type="checkbox"
                    checked={editIsDisputed}
                    onChange={(e) => setEditIsDisputed(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-600"
                  />
                  Mark Information as Disputed
                </label>
                {editIsDisputed && (
                  <input
                    type="text"
                    value={editDisputeNote}
                    onChange={(e) => setEditDisputeNote(e.target.value)}
                    placeholder="Dispute note shown to students..."
                    className="w-full px-3 py-1.5 border border-amber-300 rounded-lg text-xs"
                  />
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingDeadline(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingForm}
                  className="px-5 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl font-bold"
                >
                  {submittingForm ? 'Saving...' : 'Save & Record Revision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
