import React, { useState, useEffect } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Edit2,
  Plus,
  RefreshCw,
  Search,
  Check,
  X,
  Building2,
  GraduationCap,
  ShieldAlert,
} from 'lucide-react';
import {
  getMoiPolicies,
  adminCreateMoiPolicy,
  adminUpdateMoiPolicy,
  adminGetMoiCorrections,
  adminReviewMoiCorrection,
  adminGetOutdatedMoiPolicies,
  getUniversities,
} from '../../services/api';

export const AdminMoiManager: React.FC = () => {
  const [subTab, setSubTab] = useState<'policies' | 'corrections' | 'outdated'>('policies');
  const [loading, setLoading] = useState(true);
  const [policies, setPolicies] = useState<any[]>([]);
  const [corrections, setCorrections] = useState<any[]>([]);
  const [outdatedPolicies, setOutdatedPolicies] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [allUniversities, setAllUniversities] = useState<any[]>([]);

  // Policy Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<any | null>(null);
  const [policyForm, setPolicyForm] = useState({
    id: '',
    universityId: '',
    country: 'United Kingdom',
    qualificationLevel: 'POSTGRADUATE_TAUGHT',
    departmentName: '',
    acceptanceStatus: 'ACCEPTED_WITH_CONDITIONS',
    scope: 'ADMISSION_ONLY',
    eligibleInstitutions: '',
    eligibleCountries: '',
    minDegreeDurationYears: '3.0',
    graduationValidityYears: '5',
    requiredCertificateWording: '',
    transcriptsRequired: true,
    separateTestRequired: 'CONDITIONAL',
    visaSeparateRequirementNote: 'University academic MOI acceptance does NOT automatically satisfy immigration/visa rules.',
    applicableIntakes: 'Autumn 2026, Spring 2027',
    officialPolicyUrl: '',
    sourceExcerpt: '',
    reviewerNotes: '',
    changeReason: '',
  });

  // Correction Review Modal
  const [reviewingCorrection, setReviewingCorrection] = useState<any | null>(null);
  const [adminReviewNotes, setAdminReviewNotes] = useState('');

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadAll();
    loadUniversitiesList();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [policiesRes, corrRes, outRes] = await Promise.all([
        getMoiPolicies({ limit: 50 }),
        adminGetMoiCorrections(),
        adminGetOutdatedMoiPolicies(),
      ]);
      setPolicies(policiesRes.policies || []);
      setStats(policiesRes.stats || {});
      setCorrections(corrRes || []);
      setOutdatedPolicies(outRes || []);
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Failed to load MOI admin data' });
    } finally {
      setLoading(false);
    }
  };

  const loadUniversitiesList = async () => {
    try {
      const res = await getUniversities();
      setAllUniversities(res.universities || []);
    } catch {
      // Fallback
    }
  };

  const handleOpenCreateModal = () => {
    setEditingPolicy(null);
    setPolicyForm({
      id: '',
      universityId: allUniversities[0]?.id || '',
      country: 'United Kingdom',
      qualificationLevel: 'POSTGRADUATE_TAUGHT',
      departmentName: '',
      acceptanceStatus: 'ACCEPTED_WITH_CONDITIONS',
      scope: 'ADMISSION_ONLY',
      eligibleInstitutions: '',
      eligibleCountries: '',
      minDegreeDurationYears: '3.0',
      graduationValidityYears: '5',
      requiredCertificateWording: '',
      transcriptsRequired: true,
      separateTestRequired: 'CONDITIONAL',
      visaSeparateRequirementNote: 'University academic MOI acceptance does NOT automatically satisfy immigration/visa rules.',
      applicableIntakes: 'Autumn 2026, Spring 2027',
      officialPolicyUrl: '',
      sourceExcerpt: '',
      reviewerNotes: '',
      changeReason: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: any) => {
    setEditingPolicy(p);
    setPolicyForm({
      id: p.id,
      universityId: p.universityId,
      country: p.country,
      qualificationLevel: p.qualificationLevel,
      departmentName: p.departmentName || '',
      acceptanceStatus: p.acceptanceStatus,
      scope: p.scope || 'ADMISSION_ONLY',
      eligibleInstitutions: p.eligibleInstitutions || '',
      eligibleCountries: p.eligibleCountries || '',
      minDegreeDurationYears: String(p.minDegreeDurationYears || '3.0'),
      graduationValidityYears: String(p.graduationValidityYears || '5'),
      requiredCertificateWording: p.requiredCertificateWording || '',
      transcriptsRequired: p.transcriptsRequired !== false,
      separateTestRequired: p.separateTestRequired || 'CONDITIONAL',
      visaSeparateRequirementNote: p.visaSeparateRequirementNote || '',
      applicableIntakes: p.applicableIntakes || 'Autumn 2026, Spring 2027',
      officialPolicyUrl: p.officialPolicyUrl,
      sourceExcerpt: p.sourceExcerpt || '',
      reviewerNotes: p.reviewerNotes || '',
      changeReason: '',
    });
    setIsModalOpen(true);
  };

  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyForm.universityId || !policyForm.officialPolicyUrl) {
      setFeedback({ type: 'error', message: 'University and Official Policy URL are required' });
      return;
    }

    try {
      setSaving(true);
      if (editingPolicy) {
        await adminUpdateMoiPolicy(editingPolicy.id, policyForm);
        setFeedback({ type: 'success', message: 'MOI policy updated successfully with audit trail.' });
      } else {
        await adminCreateMoiPolicy(policyForm);
        setFeedback({ type: 'success', message: 'New MOI policy created and published.' });
      }
      setIsModalOpen(false);
      loadAll();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save policy' });
    } finally {
      setSaving(false);
    }
  };

  const handleReviewCorrection = async (action: 'APPROVED' | 'REJECTED') => {
    if (!reviewingCorrection) return;
    try {
      setSaving(true);
      await adminReviewMoiCorrection(reviewingCorrection.id, action, adminReviewNotes);
      setFeedback({ type: 'success', message: `Correction ${action.toLowerCase()} successfully.` });
      setReviewingCorrection(null);
      setAdminReviewNotes('');
      loadAll();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to review correction' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-navy-950 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <span>MOI Acceptance &amp; English Waivers Manager</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Maintain verified Medium of Instruction exemptions, required transcript notations, course restrictions, and student corrections.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add University Policy</span>
          </button>
          <button
            onClick={loadAll}
            className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-gray-500 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-medium text-gray-500">Total Policies</div>
          <div className="text-2xl font-extrabold text-navy-950 mt-1">{stats.totalApproved || 0}</div>
          <div className="text-[11px] text-teal-600 font-medium mt-1">Verified admissions records</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-medium text-gray-500">Selected Institutions</div>
          <div className="text-2xl font-extrabold text-teal-800 mt-1">{stats.acceptedSelectedInstitutions || 0}</div>
          <div className="text-[11px] text-gray-400 mt-1">Vetted institution roster</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-medium text-gray-500">Student Corrections</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{corrections.length}</div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">Pending admin review</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-medium text-gray-500">Outdated Policies</div>
          <div className="text-2xl font-extrabold text-red-600 mt-1">{outdatedPolicies.length}</div>
          <div className="text-[11px] text-gray-400 mt-1">&gt; 180 days since verification</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-gray-200 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setSubTab('policies')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition-colors ${
            subTab === 'policies'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Policies ({policies.length})</span>
        </button>

        <button
          onClick={() => setSubTab('corrections')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition-colors ${
            subTab === 'corrections'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Student Corrections ({corrections.length})</span>
        </button>

        <button
          onClick={() => setSubTab('outdated')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition-colors ${
            subTab === 'outdated'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Outdated Policies ({outdatedPolicies.length})</span>
        </button>
      </div>

      {/* Sub-Tab 1: Policies List */}
      {subTab === 'policies' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">University &amp; Country</th>
                  <th className="py-3.5 px-4">Level</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Duration / Validity</th>
                  <th className="py-3.5 px-4">Separate Test</th>
                  <th className="py-3.5 px-4">Last Verified</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {policies.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-navy-950">{p.university?.name}</div>
                      <div className="text-[11px] text-gray-500">{p.country}</div>
                      {p.eligibleInstitutions && (
                        <div className="text-[10px] text-purple-700 truncate max-w-xs font-medium mt-0.5">
                          Roster: {p.eligibleInstitutions}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-700">
                      {p.qualificationLevel.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                        {p.acceptanceStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <div>{p.minDegreeDurationYears ? `${p.minDegreeDurationYears}+ yrs` : '—'}</div>
                      <div className="text-[10px] text-gray-400">
                        {p.graduationValidityYears ? `<= ${p.graduationValidityYears} yrs ago` : 'No expiry'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-medium">
                      {p.separateTestRequired}
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(p.lastVerifiedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-navy-900 transition-colors"
                        title="Edit Policy"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <a
                        href={p.officialPolicyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-teal-600 transition-colors inline-block"
                        title="View Official Source"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Corrections Queue */}
      {subTab === 'corrections' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          {corrections.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <span>No pending MOI correction reports. All community submissions reviewed!</span>
            </div>
          ) : (
            <div className="space-y-4">
              {corrections.map((corr) => (
                <div
                  key={corr.id}
                  className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                        {corr.issueCategory}
                      </span>
                      <span className="font-bold text-navy-950 text-sm">{corr.universityName}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(corr.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {corr.description}
                  </p>

                  {corr.evidenceUrl && (
                    <a
                      href={corr.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-teal-600 hover:underline flex items-center space-x-1"
                    >
                      <span>Evidence URL: {corr.evidenceUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-[11px] text-gray-500">
                      Reporter: {corr.reporterName || 'Anonymous student'} ({corr.reporterEmail || 'No email'})
                    </span>
                    <button
                      onClick={() => {
                        setReviewingCorrection(corr);
                        setAdminReviewNotes('');
                      }}
                      className="px-3 py-1.5 bg-navy-900 hover:bg-navy-800 text-white rounded-lg text-xs font-semibold"
                    >
                      Review &amp; Act
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 3: Outdated Policies */}
      {subTab === 'outdated' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          {outdatedPolicies.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <span>All policies have been verified within the last 180 days!</span>
            </div>
          ) : (
            <div className="space-y-3">
              {outdatedPolicies.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl border border-red-200 bg-red-50/30 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-navy-950 text-sm">{p.university?.name}</div>
                    <div className="text-xs text-gray-500">
                      Last verified: {new Date(p.lastVerifiedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={p.officialPolicyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleOpenEditModal(p)}
                      className="px-3 py-1.5 bg-navy-900 text-white rounded-lg text-xs font-semibold hover:bg-navy-800"
                    >
                      Re-Verify &amp; Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Policy Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <h3 className="font-semibold text-lg">
                {editingPolicy ? 'Edit MOI Policy & Revision Log' : 'Create MOI Policy'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePolicy} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 uppercase mb-1">University</label>
                  <select
                    value={policyForm.universityId}
                    onChange={(e) => setPolicyForm({ ...policyForm, universityId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                    disabled={!!editingPolicy}
                  >
                    {allUniversities.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 uppercase mb-1">Country</label>
                  <input
                    type="text"
                    value={policyForm.country}
                    onChange={(e) => setPolicyForm({ ...policyForm, country: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 uppercase mb-1">Qualification Level</label>
                  <select
                    value={policyForm.qualificationLevel}
                    onChange={(e) => setPolicyForm({ ...policyForm, qualificationLevel: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                  >
                    <option value="UNDERGRADUATE">Undergraduate</option>
                    <option value="POSTGRADUATE_TAUGHT">Postgraduate Taught</option>
                    <option value="POSTGRADUATE_RESEARCH">Postgraduate Research (PhD)</option>
                    <option value="ALL">All Levels</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 uppercase mb-1">Acceptance Status</label>
                  <select
                    value={policyForm.acceptanceStatus}
                    onChange={(e) => setPolicyForm({ ...policyForm, acceptanceStatus: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 font-medium"
                  >
                    <option value="ACCEPTED_FOR_SPECIFIED_COURSES">ACCEPTED_FOR_SPECIFIED_COURSES</option>
                    <option value="ACCEPTED_WITH_CONDITIONS">ACCEPTED_WITH_CONDITIONS</option>
                    <option value="ACCEPTED_ONLY_FOR_SELECTED_INSTITUTIONS">ACCEPTED_ONLY_FOR_SELECTED_INSTITUTIONS</option>
                    <option value="NOT_ACCEPTED">NOT_ACCEPTED</option>
                    <option value="POLICY_REQUIRES_DIRECT_CONFIRMATION">POLICY_REQUIRES_DIRECT_CONFIRMATION</option>
                    <option value="OFFICIAL_POLICY_NOT_VERIFIED">OFFICIAL_POLICY_NOT_VERIFIED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 uppercase mb-1">Scope</label>
                  <select
                    value={policyForm.scope}
                    onChange={(e) => setPolicyForm({ ...policyForm, scope: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                  >
                    <option value="ADMISSION_ONLY">ADMISSION_ONLY</option>
                    <option value="BOTH">BOTH (Admission &amp; Visa)</option>
                    <option value="NEITHER">NEITHER</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 uppercase mb-1">Separate Test Required</label>
                  <select
                    value={policyForm.separateTestRequired}
                    onChange={(e) => setPolicyForm({ ...policyForm, separateTestRequired: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                  >
                    <option value="CONDITIONAL">CONDITIONAL</option>
                    <option value="NO_TEST_REQUIRED">NO_TEST_REQUIRED</option>
                    <option value="SEPARATE_TEST_REQUIRED">SEPARATE_TEST_REQUIRED</option>
                    <option value="DEPENDS_ON_COURSE">DEPENDS_ON_COURSE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 uppercase mb-1">Min Degree Duration (Yrs)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={policyForm.minDegreeDurationYears}
                    onChange={(e) => setPolicyForm({ ...policyForm, minDegreeDurationYears: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 uppercase mb-1">Graduation Validity (Yrs)</label>
                  <input
                    type="number"
                    value={policyForm.graduationValidityYears}
                    onChange={(e) => setPolicyForm({ ...policyForm, graduationValidityYears: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">Eligible Institutions / Roster</label>
                <input
                  type="text"
                  placeholder="e.g. BUET, IBA DU, NSU, BRAC University, etc."
                  value={policyForm.eligibleInstitutions}
                  onChange={(e) => setPolicyForm({ ...policyForm, eligibleInstitutions: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">Official Policy URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://www.university.edu/admissions/language-waivers"
                  value={policyForm.officialPolicyUrl}
                  onChange={(e) => setPolicyForm({ ...policyForm, officialPolicyUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">Source Excerpt / Policy Text</label>
                <textarea
                  rows={2}
                  value={policyForm.sourceExcerpt}
                  onChange={(e) => setPolicyForm({ ...policyForm, sourceExcerpt: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">Change Reason / Audit Note</label>
                <input
                  type="text"
                  placeholder="e.g. Updated 2026 admissions policy recency rules"
                  value={policyForm.changeReason}
                  onChange={(e) => setPolicyForm({ ...policyForm, changeReason: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold"
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
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 p-6 space-y-4">
            <h3 className="text-base font-bold text-navy-950">Review Student Correction</h3>
            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="font-semibold text-gray-900">{reviewingCorrection.universityName}: </span>
              {reviewingCorrection.description}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Admin Review Notes
              </label>
              <textarea
                rows={3}
                placeholder="Reason for approval or rejection..."
                value={adminReviewNotes}
                onChange={(e) => setAdminReviewNotes(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setReviewingCorrection(null)}
                className="px-3 py-1.5 border rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleReviewCorrection('REJECTED')}
                disabled={saving}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
              >
                Reject Report
              </button>
              <button
                type="button"
                onClick={() => handleReviewCorrection('APPROVED')}
                disabled={saving}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
              >
                Approve &amp; Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
