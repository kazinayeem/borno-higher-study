import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
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
  School,
  Globe,
  Award,
  Layers,
  FileCheck2,
  ShieldAlert,
  ArrowRight,
  Plus,
} from 'lucide-react';
import {
  getAcademicRequirements,
  adminGetAcademicCorrections,
  adminReviewAcademicCorrection,
  adminUpdateAcademicRequirement,
  adminSeedAcademicData,
  getGradeScales,
  getQualificationEquivalencies,
} from '../../services/api';
import {
  AcademicRequirementItem,
  AcademicCorrectionReportItem,
  GradeScaleItem,
  QualificationEquivalencyItem,
} from '../../types/index';

export const AdminAcademicEligibilityManager: React.FC = () => {
  const [subTab, setSubTab] = useState<'requirements' | 'corrections' | 'equivalencies' | 'scales' | 'sync'>('requirements');
  const [loading, setLoading] = useState(true);

  // Data states
  const [requirements, setRequirements] = useState<AcademicRequirementItem[]>([]);
  const [corrections, setCorrections] = useState<AcademicCorrectionReportItem[]>([]);
  const [gradeScales, setGradeScales] = useState<GradeScaleItem[]>([]);
  const [equivalencies, setEquivalencies] = useState<QualificationEquivalencyItem[]>([]);

  // Editing requirement modal
  const [editingReq, setEditingReq] = useState<AcademicRequirementItem | null>(null);
  const [editForm, setEditForm] = useState({
    minSscGpa: '',
    minHscGpa: '',
    hscStreamRequired: 'SCIENCE',
    directEntryAccepted: true,
    foundationEntryOption: '',
    minBachelorCgpa: '',
    bachelorClassRequired: '',
    bachelorDegreeTitleRequired: '',
    minMasterCgpa: '',
    researchProposalRequired: false,
    supervisorRequired: false,
    adminApprovalStatus: 'APPROVED',
    sourceUrl: '',
    adminNotes: '',
  });

  // Reviewing student correction report modal
  const [reviewingCorrection, setReviewingCorrection] = useState<AcademicCorrectionReportItem | null>(null);
  const [adminReviewNotes, setAdminReviewNotes] = useState('');

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [reqRes, corrRes, scalesRes, equivsRes] = await Promise.all([
        getAcademicRequirements({ limit: 100 }),
        adminGetAcademicCorrections().catch(() => []),
        getGradeScales(),
        getQualificationEquivalencies(),
      ]);
      setRequirements(reqRes.requirements || []);
      setCorrections(corrRes || []);
      setGradeScales(scalesRes.gradeScales || []);
      setEquivalencies(equivsRes.equivalencies || []);
    } catch (err) {
      console.error('Failed to load academic admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditReqOpen = (req: AcademicRequirementItem) => {
    setEditingReq(req);
    setEditForm({
      minSscGpa: req.minSscGpa !== null && req.minSscGpa !== undefined ? String(req.minSscGpa) : '',
      minHscGpa: req.minHscGpa !== null && req.minHscGpa !== undefined ? String(req.minHscGpa) : '',
      hscStreamRequired: req.hscStreamRequired || 'SCIENCE',
      directEntryAccepted: req.directEntryAccepted ?? true,
      foundationEntryOption: req.foundationEntryOption || '',
      minBachelorCgpa: req.minBachelorCgpa !== null && req.minBachelorCgpa !== undefined ? String(req.minBachelorCgpa) : '',
      bachelorClassRequired: req.bachelorClassRequired || '',
      bachelorDegreeTitleRequired: req.bachelorDegreeTitleRequired || '',
      minMasterCgpa: req.minMasterCgpa !== null && req.minMasterCgpa !== undefined ? String(req.minMasterCgpa) : '',
      researchProposalRequired: req.researchProposalRequired ?? false,
      supervisorRequired: req.supervisorRequired ?? false,
      adminApprovalStatus: req.adminApprovalStatus || 'APPROVED',
      sourceUrl: req.sourceUrl || '',
      adminNotes: req.adminNotes || '',
    });
  };

  const handleUpdateRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReq) return;
    try {
      setSaving(true);
      setFeedback(null);
      await adminUpdateAcademicRequirement(editingReq.id, {
        minSscGpa: editForm.minSscGpa ? parseFloat(editForm.minSscGpa) : null,
        minHscGpa: editForm.minHscGpa ? parseFloat(editForm.minHscGpa) : null,
        hscStreamRequired: editForm.hscStreamRequired || null,
        directEntryAccepted: editForm.directEntryAccepted,
        foundationEntryOption: editForm.foundationEntryOption || null,
        minBachelorCgpa: editForm.minBachelorCgpa ? parseFloat(editForm.minBachelorCgpa) : null,
        bachelorClassRequired: editForm.bachelorClassRequired || null,
        bachelorDegreeTitleRequired: editForm.bachelorDegreeTitleRequired || null,
        minMasterCgpa: editForm.minMasterCgpa ? parseFloat(editForm.minMasterCgpa) : null,
        researchProposalRequired: editForm.researchProposalRequired,
        supervisorRequired: editForm.supervisorRequired,
        adminApprovalStatus: editForm.adminApprovalStatus as any,
        sourceUrl: editForm.sourceUrl,
        adminNotes: editForm.adminNotes,
      });

      setFeedback({ type: 'success', message: `Academic requirement for ${editingReq.university?.name} updated.` });
      setEditingReq(null);
      loadAll();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update academic requirement' });
    } finally {
      setSaving(false);
    }
  };

  const handleReviewCorrection = async (action: 'APPROVED' | 'REJECTED') => {
    if (!reviewingCorrection) return;
    try {
      setSaving(true);
      setFeedback(null);
      await adminReviewAcademicCorrection(reviewingCorrection.id, action, adminReviewNotes);
      setFeedback({
        type: 'success',
        message: `Correction report #${reviewingCorrection.id.slice(-6)} marked as ${action}.`,
      });
      setReviewingCorrection(null);
      setAdminReviewNotes('');
      loadAll();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to review correction report' });
    } finally {
      setSaving(false);
    }
  };

  const handleSeedData = async () => {
    try {
      setSaving(true);
      setFeedback(null);
      const res = await adminSeedAcademicData();
      setFeedback({ type: 'success', message: res.message || 'Academic requirements data synchronized.' });
      loadAll();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to synchronize academic data' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-navy-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm border border-navy-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            Verified Academic Eligibility Control Center
          </div>
          <h2 className="text-xl font-bold tracking-tight">Academic Requirements & Subject Prerequisites Management</h2>
          <p className="text-xs text-navy-200 mt-1 max-w-2xl">
            Maintain verified minimum GPA thresholds, subject prerequisites, qualification equivalencies (ECCTIS, Anabin, WES), and moderate student proposed corrections before publishing updates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAll}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-teal-300 text-xs font-semibold border border-navy-700 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleSeedData}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            Sync Official Benchmarks
          </button>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>
      )}

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setSubTab('requirements')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'requirements' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Requirements Catalog ({requirements.length})
        </button>
        <button
          onClick={() => setSubTab('corrections')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'corrections' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          Student Corrections Queue ({corrections.filter((c) => c.status === 'PENDING').length} Pending)
        </button>
        <button
          onClick={() => setSubTab('equivalencies')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'equivalencies' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-teal-600" />
          Qualification Equivalencies ({equivalencies.length})
        </button>
        <button
          onClick={() => setSubTab('scales')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'scales' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-purple-600" />
          Grade Scales ({gradeScales.length})
        </button>
      </div>

      {/* TAB 1: REQUIREMENTS CATALOG */}
      {subTab === 'requirements' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Official Academic Requirements Registry</h3>
            <span className="text-xs font-semibold text-slate-500">{requirements.length} Published Benchmarks</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3">Institution & Country</th>
                  <th className="px-5 py-3">Degree Level</th>
                  <th className="px-5 py-3">Academic Thresholds</th>
                  <th className="px-5 py-3">Subject Prerequisites</th>
                  <th className="px-5 py-3">Entry Route</th>
                  <th className="px-5 py-3">Verified Source</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requirements.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-900 block">{req.university?.name}</span>
                      <span className="text-slate-500">{req.countryCode} • {req.program?.name || 'Departmental Benchmark'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-bold border border-teal-200 text-[10px]">
                        {req.degreeLevel}
                      </span>
                    </td>
                    <td className="px-5 py-4 space-y-0.5">
                      {req.minBachelorCgpa && (
                        <div>
                          <span className="text-slate-400">Bachelor CGPA:</span>{' '}
                          <strong className="text-slate-900">{req.minBachelorCgpa.toFixed(2)}/4.00</strong>
                        </div>
                      )}
                      {req.minHscGpa && (
                        <div>
                          <span className="text-slate-400">HSC GPA:</span>{' '}
                          <strong className="text-slate-900">{req.minHscGpa.toFixed(2)}/5.00</strong>{' '}
                          {req.hscStreamRequired && `(${req.hscStreamRequired})`}
                        </div>
                      )}
                      {req.minSscGpa && (
                        <div>
                          <span className="text-slate-400">SSC GPA:</span>{' '}
                          <strong className="text-slate-900">{req.minSscGpa.toFixed(2)}/5.00</strong>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {req.subjectRequirements && req.subjectRequirements.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {req.subjectRequirements.map((s) => (
                            <span key={s.id} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-700">
                              {s.subjectName} ({s.minimumGradeLetter || s.minimumGradeNumeric})
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">General Eligibility</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`font-semibold ${
                          req.directEntryAccepted ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {req.directEntryAccepted ? 'Direct Year 1' : 'Foundation Required'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <a
                        href={req.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1"
                      >
                        Official Page
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <span className="block text-[10px] text-slate-400 mt-0.5">
                        {new Date(req.verificationTimestamp).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleEditReqOpen(req)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT CORRECTIONS QUEUE */}
      {subTab === 'corrections' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Student & Contributor Correction Reports</h3>
              <p className="text-xs text-slate-500">
                Editorial verification policy: Student submissions never overwrite approved data directly. Admin approval is mandatory.
              </p>
            </div>
            <span className="text-xs bg-amber-50 text-amber-800 font-bold px-3 py-1 rounded-full border border-amber-200">
              {corrections.filter((c) => c.status === 'PENDING').length} Pending Review
            </span>
          </div>

          {corrections.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">No student correction reports submitted yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {corrections.map((corr) => (
                <div key={corr.id} className="p-5 hover:bg-slate-50/50 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          corr.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : corr.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {corr.status}
                      </span>
                      <strong className="text-xs text-slate-900">
                        {corr.universityName} {corr.programName ? `• ${corr.programName}` : ''}
                      </strong>
                      <span className="text-[10px] text-slate-400">
                        {new Date(corr.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <strong>Issue:</strong> {corr.issueCategory} — {corr.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs pt-1">
                      <a
                        href={corr.officialEvidenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-700 font-semibold inline-flex items-center gap-1"
                      >
                        Verify University Evidence Link
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      {corr.reporterEmail && (
                        <span className="text-slate-400">Reporter: {corr.reporterEmail}</span>
                      )}
                    </div>
                  </div>

                  {corr.status === 'PENDING' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setReviewingCorrection(corr);
                          setAdminReviewNotes('Verified against official university admissions brochure.');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
                      >
                        Review Report
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: QUALIFICATION EQUIVALENCIES */}
      {subTab === 'equivalencies' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Official National Equivalency Frameworks</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="px-4 py-2.5">Country</th>
                  <th className="px-4 py-2.5">Home Qualification</th>
                  <th className="px-4 py-2.5">Standard Equivalency</th>
                  <th className="px-4 py-2.5">Evaluator</th>
                  <th className="px-4 py-2.5">Official Policy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {equivalencies.map((eq) => (
                  <tr key={eq.id}>
                    <td className="px-4 py-3 font-bold">{eq.countryCode}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{eq.homeQualification}</td>
                    <td className="px-4 py-3 text-teal-700 font-bold">{eq.standardEquivalency}</td>
                    <td className="px-4 py-3">{eq.credentialEvaluator}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {eq.isOfficialPolicy ? 'Official Policy' : 'Advisory Estimate'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: GRADE SCALES */}
      {subTab === 'scales' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gradeScales.map((scale) => (
            <div key={scale.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-teal-600 text-sm">{scale.name}</span>
                <span className="text-slate-400 font-mono font-bold">Max: {scale.maxScale}</span>
              </div>
              <p className="text-slate-600">{scale.description}</p>
              <p className="text-slate-500">
                <strong>Authority:</strong> {scale.officialScaleAuthority}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: EDIT ACADEMIC REQUIREMENT */}
      {editingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-base">Edit Academic Requirement</h4>
                <p className="text-xs text-navy-200">{editingReq.university?.name} ({editingReq.degreeLevel})</p>
              </div>
              <button onClick={() => setEditingReq(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleUpdateRequirement} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Bachelor CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.minBachelorCgpa}
                    onChange={(e) => setEditForm({ ...editForm, minBachelorCgpa: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g. 3.50"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min HSC GPA</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.minHscGpa}
                    onChange={(e) => setEditForm({ ...editForm, minHscGpa: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g. 4.80"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min SSC GPA</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.minSscGpa}
                    onChange={(e) => setEditForm({ ...editForm, minSscGpa: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g. 4.50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">HSC Stream Required</label>
                  <select
                    value={editForm.hscStreamRequired}
                    onChange={(e) => setEditForm({ ...editForm, hscStreamRequired: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="SCIENCE">SCIENCE</option>
                    <option value="COMMERCE">COMMERCE</option>
                    <option value="HUMANITIES">HUMANITIES</option>
                    <option value="ANY">ANY STREAM</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Direct Entry Accepted?</label>
                  <select
                    value={editForm.directEntryAccepted ? 'YES' : 'NO'}
                    onChange={(e) => setEditForm({ ...editForm, directEntryAccepted: e.target.value === 'YES' })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="YES">Yes - Direct Year 1 Accepted</option>
                    <option value="NO">No - Approved Foundation Required</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Foundation Year Option / Note</label>
                <input
                  type="text"
                  value={editForm.foundationEntryOption}
                  onChange={(e) => setEditForm({ ...editForm, foundationEntryOption: e.target.value })}
                  placeholder="e.g. Requires 1-year International Foundation Year"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official University Source URL *</label>
                <input
                  type="url"
                  value={editForm.sourceUrl}
                  onChange={(e) => setEditForm({ ...editForm, sourceUrl: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingReq(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {saving ? 'Saving...' : 'Save Requirement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REVIEW STUDENT CORRECTION */}
      {reviewingCorrection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden text-xs">
            <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
              <h4 className="font-bold text-base">Review Correction Proposal</h4>
              <button onClick={() => setReviewingCorrection(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border space-y-1">
                <span className="text-slate-400 font-semibold block">Proposed by student:</span>
                <p className="text-slate-800 font-medium">{reviewingCorrection.description}</p>
                <a
                  href={reviewingCorrection.officialEvidenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline font-bold inline-flex items-center gap-1 mt-1"
                >
                  Inspect Evidence URL
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Admin Editorial Note</label>
                <textarea
                  value={adminReviewNotes}
                  onChange={(e) => setAdminReviewNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Notes explaining approval or rejection reason..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  onClick={() => handleReviewCorrection('REJECTED')}
                  disabled={saving}
                  className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-xl"
                >
                  Reject Proposal
                </button>
                <button
                  onClick={() => handleReviewCorrection('APPROVED')}
                  disabled={saving}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Approve Correction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
