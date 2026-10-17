import React, { useState, useEffect } from 'react';
import {
  Award,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Edit2,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  FileText,
  Building2,
  Sparkles,
} from 'lucide-react';
import {
  getAdminEnglishTestsOverview,
  updateAdminTestFee,
  upsertAdminUniversityPolicy,
  getAdminTestCorrectionsQueue,
  reviewAdminTestCorrection,
  getAdminOutdatedTestPolicies,
  triggerAdminEnglishTestSeed,
  getUniversities,
} from '../../services/api';

export const AdminEnglishTestsManager: React.FC = () => {
  const [subTab, setSubTab] = useState<'fees' | 'policies' | 'corrections' | 'outdated'>('fees');
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any | null>(null);
  const [corrections, setCorrections] = useState<any[]>([]);
  const [outdatedPolicies, setOutdatedPolicies] = useState<any[]>([]);

  // Fee Edit Modal State
  const [editingFee, setEditingFee] = useState<any | null>(null);
  const [feeForm, setFeeForm] = useState({
    amount: '',
    currency: 'BDT',
    bdtEstimate: '',
    officialFeeSourceUrl: '',
    verificationStatus: 'VERIFIED',
    availabilityNotes: '',
  });

  // Policy Edit / Create Modal State
  const [editingPolicy, setEditingPolicy] = useState<any | null>(null);
  const [isCreatingPolicy, setIsCreatingPolicy] = useState(false);
  const [policyForm, setPolicyForm] = useState({
    id: '',
    universityId: '',
    testFormatId: '',
    academicLevel: 'UNDERGRADUATE',
    policyTier: '',
    status: 'ACCEPTED',
    minOverallScore: '',
    minListening: '',
    minReading: '',
    minWriting: '',
    minSpeaking: '',
    conditions: '',
    officialPolicyUrl: '',
    sourceExcerpt: '',
  });

  // Correction Review Modal State
  const [reviewingCorrection, setReviewingCorrection] = useState<any | null>(null);
  const [adminReviewNotes, setAdminReviewNotes] = useState('');

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [allUniversities, setAllUniversities] = useState<any[]>([]);

  useEffect(() => {
    loadAll();
    loadUniversitiesList();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [ov, corr, out] = await Promise.all([
        getAdminEnglishTestsOverview(),
        getAdminTestCorrectionsQueue(),
        getAdminOutdatedTestPolicies(),
      ]);
      setOverview(ov);
      setCorrections(corr);
      setOutdatedPolicies(out);
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Failed to load English tests admin data' });
    } finally {
      setLoading(false);
    }
  };

  const loadUniversitiesList = async () => {
    try {
      const res = await getUniversities();
      setAllUniversities(res.universities || []);
    } catch {
      //
    }
  };

  // Open Fee Edit Modal
  const handleEditFeeClick = (fee: any, format: any) => {
    setEditingFee({ ...fee, formatName: format.name });
    setFeeForm({
      amount: String(fee.amount || ''),
      currency: fee.currency || 'BDT',
      bdtEstimate: String(fee.bdtEstimate || ''),
      officialFeeSourceUrl: fee.officialFeeSourceUrl || '',
      verificationStatus: fee.verificationStatus || 'VERIFIED',
      availabilityNotes: fee.availabilityNotes || '',
    });
  };

  // Save Fee
  const handleSaveFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFee) return;

    try {
      setSaving(true);
      await updateAdminTestFee(editingFee.id, {
        amount: Number(feeForm.amount),
        currency: feeForm.currency,
        bdtEstimate: feeForm.bdtEstimate ? Number(feeForm.bdtEstimate) : undefined,
        officialFeeSourceUrl: feeForm.officialFeeSourceUrl,
        verificationStatus: feeForm.verificationStatus,
        availabilityNotes: feeForm.availabilityNotes,
      });

      setFeedback({ type: 'success', message: 'Exam fee updated and verified successfully.' });
      setEditingFee(null);
      await loadAll();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update fee' });
    } finally {
      setSaving(false);
    }
  };

  // Open Add Policy Modal
  const handleOpenAddPolicy = () => {
    setIsCreatingPolicy(true);
    setEditingPolicy(null);
    setPolicyForm({
      id: '',
      universityId: allUniversities[0]?.id || '',
      testFormatId: overview?.testFormats?.[0]?.id || '',
      academicLevel: 'UNDERGRADUATE',
      policyTier: 'STANDARD',
      status: 'ACCEPTED',
      minOverallScore: '7.0',
      minListening: '6.5',
      minReading: '6.5',
      minWriting: '6.5',
      minSpeaking: '6.5',
      conditions: '',
      officialPolicyUrl: 'https://www.ox.ac.uk/admissions',
      sourceExcerpt: 'Official verified admissions requirement',
    });
  };

  // Save Policy
  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await upsertAdminUniversityPolicy({
        id: policyForm.id || undefined,
        universityId: policyForm.universityId,
        testFormatId: policyForm.testFormatId,
        academicLevel: policyForm.academicLevel,
        policyTier: policyForm.policyTier || undefined,
        status: policyForm.status,
        minOverallScore: policyForm.minOverallScore ? Number(policyForm.minOverallScore) : undefined,
        minListening: policyForm.minListening ? Number(policyForm.minListening) : undefined,
        minReading: policyForm.minReading ? Number(policyForm.minReading) : undefined,
        minWriting: policyForm.minWriting ? Number(policyForm.minWriting) : undefined,
        minSpeaking: policyForm.minSpeaking ? Number(policyForm.minSpeaking) : undefined,
        conditions: policyForm.conditions || undefined,
        officialPolicyUrl: policyForm.officialPolicyUrl,
        sourceExcerpt: policyForm.sourceExcerpt || undefined,
      });

      setFeedback({ type: 'success', message: 'University acceptance policy saved successfully.' });
      setIsCreatingPolicy(false);
      setEditingPolicy(null);
      await loadAll();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save policy' });
    } finally {
      setSaving(false);
    }
  };

  // Review Correction
  const handleReviewCorrectionSubmit = async (decision: 'APPROVE' | 'REJECT') => {
    if (!reviewingCorrection) return;

    try {
      setSaving(true);
      await reviewAdminTestCorrection(
        reviewingCorrection.id,
        decision,
        adminReviewNotes || `Admin decision: ${decision}`
      );
      setFeedback({
        type: 'success',
        message: `Correction proposal has been ${decision === 'APPROVE' ? 'approved and applied' : 'rejected'}.`,
      });
      setReviewingCorrection(null);
      setAdminReviewNotes('');
      await loadAll();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to process correction' });
    } finally {
      setSaving(false);
    }
  };

  // Trigger Re-Seed
  const handleTriggerReSeed = async () => {
    try {
      setLoading(true);
      await triggerAdminEnglishTestSeed();
      setFeedback({ type: 'success', message: 'English test catalog and UK 15 flagships re-synchronized successfully.' });
      await loadAll();
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Failed to trigger seed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Re-seed Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5 text-teal-600" />
            Official Language Exam Governance & Accepted Standards
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-950">English Tests & Acceptance Management</h2>
          <p className="text-xs text-gray-500 mt-1">
            Maintain official exam fees, verify university acceptance policies, review student reports, and ensure traceable revisions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleTriggerReSeed}
            disabled={loading}
            className="px-4 py-2 bg-navy-900 hover:bg-navy-950 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Re-sync Catalog & UK Policies
          </button>

          <button
            onClick={handleOpenAddPolicy}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Add Policy
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1">
            Acceptance Policies
          </span>
          <div className="text-2xl font-black text-navy-950">{overview?.totalPolicies || 0}</div>
          <span className="text-[11px] text-teal-600 font-medium">45+ verified UK flagship rules</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1">
            Exam Formats & Fees
          </span>
          <div className="text-2xl font-black text-navy-950">{overview?.totalFees || 0}</div>
          <span className="text-[11px] text-gray-500 font-medium">IELTS, PTE, TOEFL Bangladesh circulars</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1">
            Pending Reports
          </span>
          <div className="text-2xl font-black text-amber-600">{overview?.pendingCorrections || 0}</div>
          <span className="text-[11px] text-amber-700 font-medium">Student submissions awaiting review</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1">
            Outdated Policies
          </span>
          <div className="text-2xl font-black text-rose-600">{overview?.outdatedPoliciesCount || 0}</div>
          <span className="text-[11px] text-rose-700 font-medium">&gt; 180 days since verification</span>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex border-b border-gray-200 gap-2">
        {[
          { key: 'fees', label: 'Official Registration Fees', icon: DollarSign, badge: overview?.totalFees },
          { key: 'policies', label: 'University Policies', icon: Building2, badge: overview?.totalPolicies },
          { key: 'corrections', label: 'Correction Queue', icon: FileText, badge: overview?.pendingCorrections },
          { key: 'outdated', label: 'Outdated Policies (>180d)', icon: Clock, badge: overview?.outdatedPoliciesCount },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSubTab(tab.key as any)}
              className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
                isActive
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Subtab 1: Fee Management */}
      {subTab === 'fees' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h3 className="font-bold text-sm text-navy-950">Official Bangladesh Registration Fees</h3>
            <span className="text-xs text-gray-500">Traceable to provider circulars only</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Test Format</th>
                  <th className="py-3 px-4">Delivery</th>
                  <th className="py-3 px-4">Published Fee</th>
                  <th className="py-3 px-4">BDT Converted Est.</th>
                  <th className="py-3 px-4">Official Source</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(overview?.testFormats || []).map((format: any) => {
                  const fee = format.fees[0];
                  return (
                    <tr key={format.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-navy-950">{format.name}</div>
                        <div className="text-[11px] text-gray-500">{format.provider.name}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            format.deliveryMode === 'ONLINE'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {format.deliveryMode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-navy-950">
                        {fee?.amount ? (
                          fee.currency === 'BDT' ? (
                            `BDT ${fee.amount.toLocaleString()}`
                          ) : (
                            `$${fee.amount} USD`
                          )
                        ) : (
                          <span className="text-gray-400">Unconfirmed</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-teal-700 font-bold">
                        {fee?.bdtEstimate ? `BDT ${fee.bdtEstimate.toLocaleString()}` : '-'}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate">
                        {fee?.officialFeeSourceUrl ? (
                          <a
                            href={fee.officialFeeSourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-teal-600 underline inline-flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {fee.officialFeeSourceUrl}
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {fee?.verificationStatus || 'VERIFIED'}
                        </span>
                        <div className="text-[10px] text-gray-400">
                          {fee?.lastVerifiedAt ? new Date(fee.lastVerifiedAt).toLocaleDateString() : '-'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {fee && (
                          <button
                            onClick={() => handleEditFeeClick(fee, format)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-navy-900 hover:bg-gray-100 transition inline-flex items-center gap-1 text-xs font-semibold"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit Fee
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 2: University Policies */}
      {subTab === 'policies' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-navy-950">University English Acceptance Standards</h3>
              <p className="text-xs text-gray-500">
                Minimum overall and component scores by institution, level, and delivery mode.
              </p>
            </div>
            <button
              onClick={handleOpenAddPolicy}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" /> Add Acceptance Rule
            </button>
          </div>

          <p className="text-xs text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-200 leading-relaxed mb-6">
            <strong>Admissions Integrity Rule: </strong>
            Acceptance of a test-centre exam (e.g. IELTS Academic) does not imply acceptance of its online version.
            Requirements must be maintained at the specific course or institution level with verifiable policy links.
          </p>

          <div className="text-center py-6">
            <span className="text-xs text-gray-500">
              Explore or search all 45+ UK flagship university rules in the public explorer:
            </span>
            <div className="mt-2">
              <a
                href="/university-test-acceptance"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold hover:bg-navy-950 transition"
              >
                Open University Acceptance Explorer <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: Student Corrections Queue */}
      {subTab === 'corrections' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h3 className="font-bold text-sm text-navy-950">Student-Submitted Correction Reports</h3>
            <span className="text-xs text-amber-700 font-semibold">
              {corrections.filter((c) => c.status === 'PENDING').length} pending admin review
            </span>
          </div>

          {corrections.length === 0 ? (
            <div className="text-center py-12 text-xs text-gray-500">
              No correction reports in queue.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Target Entity</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Proposed Correction</th>
                    <th className="py-3 px-4">Evidence</th>
                    <th className="py-3 px-4">Reporter</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {corrections.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3.5 px-4 font-bold text-navy-950">
                        {item.targetType === 'TEST_FEE'
                          ? `Fee: ${item.fee?.testFormat?.name || 'Exam Fee'}`
                          : `Policy: ${item.policy?.university?.name || 'University'} (${item.policy?.testFormat?.name || 'Test'})`}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-bold text-gray-700">
                          {item.correctionCategory}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs text-gray-800">{item.proposedChange}</td>
                      <td className="py-3.5 px-4">
                        {item.evidenceUrl ? (
                          <a
                            href={item.evidenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:text-teal-700 underline inline-flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" /> Evidence Link
                          </a>
                        ) : (
                          <span className="text-gray-400">None provided</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        <div>{item.reporterName || 'Anonymous'}</div>
                        <div className="text-[10px] text-gray-400">{item.reporterEmail}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : item.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {item.status === 'PENDING' ? (
                          <button
                            onClick={() => {
                              setReviewingCorrection(item);
                              setAdminReviewNotes('');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-950 text-white font-bold text-[11px] transition shadow-sm"
                          >
                            Review Report
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Subtab 4: Outdated Policies */}
      {subTab === 'outdated' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-navy-950">Policies Needing Verification Review</h3>
              <p className="text-xs text-gray-500">
                Admissions language rules with no review within 180 days or flagged as outdated.
              </p>
            </div>
          </div>

          {outdatedPolicies.length === 0 ? (
            <div className="text-center py-12 text-xs text-gray-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              All university policies are actively verified and within the 180-day recency benchmark.
            </div>
          ) : (
            <div className="space-y-3">
              {outdatedPolicies.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-navy-950">
                      {p.university?.name} — {p.testFormat?.name}
                    </div>
                    <div className="text-gray-500 text-[11px]">
                      Last Verified: {new Date(p.lastVerifiedAt).toLocaleDateString()} ({Math.floor(
                        (Date.now() - new Date(p.lastVerifiedAt).getTime()) / (1000 * 60 * 60 * 24)
                      )}{' '}
                      days ago)
                    </div>
                  </div>

                  <a
                    href={p.officialPolicyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-navy-900 text-white font-bold text-xs hover:bg-navy-950 transition flex items-center gap-1"
                  >
                    Check Policy URL <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fee Edit Modal */}
      {editingFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Edit Fee: {editingFee.formatName}</h3>
              <button onClick={() => setEditingFee(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFee} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Fee Amount *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={feeForm.amount}
                    onChange={(e) => setFeeForm({ ...feeForm, amount: e.target.value })}
                    className="w-full text-xs rounded-xl border border-gray-300 p-2.5 text-gray-800 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Currency *</label>
                  <select
                    value={feeForm.currency}
                    onChange={(e) => setFeeForm({ ...feeForm, currency: e.target.value })}
                    className="w-full text-xs rounded-xl border border-gray-300 p-2.5 bg-white text-gray-800 focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="BDT">BDT (Bangladeshi Taka)</option>
                    <option value="USD">USD (US Dollar)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">BDT Estimate (if quoted in USD)</label>
                <input
                  type="number"
                  placeholder="e.g. 26230"
                  value={feeForm.bdtEstimate}
                  onChange={(e) => setFeeForm({ ...feeForm, bdtEstimate: e.target.value })}
                  className="w-full text-xs rounded-xl border border-gray-300 p-2.5 text-gray-800 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Official Fee Source URL *</label>
                <input
                  type="url"
                  required
                  value={feeForm.officialFeeSourceUrl}
                  onChange={(e) => setFeeForm({ ...feeForm, officialFeeSourceUrl: e.target.value })}
                  className="w-full text-xs rounded-xl border border-gray-300 p-2.5 text-gray-800 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Availability / Circular Notes</label>
                <textarea
                  rows={2}
                  value={feeForm.availabilityNotes}
                  onChange={(e) => setFeeForm({ ...feeForm, availabilityNotes: e.target.value })}
                  className="w-full text-xs rounded-xl border border-gray-300 p-2.5 text-gray-800 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingFee(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Update & Verify Fee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Policy Edit / Create Modal */}
      {isCreatingPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Add University Language Acceptance Rule</h3>
              <button onClick={() => setIsCreatingPolicy(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePolicy} className="p-6 space-y-4 text-xs max-h-[85vh] overflow-y-auto">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">University *</label>
                <select
                  required
                  value={policyForm.universityId}
                  onChange={(e) => setPolicyForm({ ...policyForm, universityId: e.target.value })}
                  className="w-full text-xs rounded-xl border border-gray-300 p-2.5 bg-white text-gray-800 focus:ring-2 focus:ring-teal-500"
                >
                  {allUniversities.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.countrySlug})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Test Format *</label>
                  <select
                    required
                    value={policyForm.testFormatId}
                    onChange={(e) => setPolicyForm({ ...policyForm, testFormatId: e.target.value })}
                    className="w-full text-xs rounded-xl border border-gray-300 p-2.5 bg-white text-gray-800 focus:ring-2 focus:ring-teal-500"
                  >
                    {(overview?.testFormats || []).map((f: any) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.deliveryMode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Study Level *</label>
                  <select
                    value={policyForm.academicLevel}
                    onChange={(e) => setPolicyForm({ ...policyForm, academicLevel: e.target.value })}
                    className="w-full text-xs rounded-xl border border-gray-300 p-2.5 bg-white text-gray-800 focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="UNDERGRADUATE">Undergraduate</option>
                    <option value="POSTGRADUATE_TAUGHT">Postgraduate Taught (Master's)</option>
                    <option value="POSTGRADUATE_RESEARCH">Postgraduate Research (PhD)</option>
                    <option value="FOUNDATION">Foundation</option>
                    <option value="ALL">All Levels</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Acceptance Status *</label>
                  <select
                    value={policyForm.status}
                    onChange={(e) => setPolicyForm({ ...policyForm, status: e.target.value })}
                    className="w-full text-xs rounded-xl border border-gray-300 p-2.5 bg-white text-gray-800 focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="ACCEPTED">ACCEPTED</option>
                    <option value="ACCEPTED_WITH_CONDITIONS">ACCEPTED_WITH_CONDITIONS</option>
                    <option value="NOT_ACCEPTED">NOT_ACCEPTED</option>
                    <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Min Overall Score</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 7.0 or 100 or 65"
                    value={policyForm.minOverallScore}
                    onChange={(e) => setPolicyForm({ ...policyForm, minOverallScore: e.target.value })}
                    className="w-full text-xs rounded-xl border border-gray-300 p-2.5 text-gray-800 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Component breakdown */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Minimum Component Scores (L / R / W / S)</label>
                <div className="grid grid-cols-4 gap-2">
                  <input
                    type="number"
                    step="any"
                    placeholder="Listening"
                    value={policyForm.minListening}
                    onChange={(e) => setPolicyForm({ ...policyForm, minListening: e.target.value })}
                    className="p-2 text-xs rounded-xl border border-gray-300 text-gray-800"
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Reading"
                    value={policyForm.minReading}
                    onChange={(e) => setPolicyForm({ ...policyForm, minReading: e.target.value })}
                    className="p-2 text-xs rounded-xl border border-gray-300 text-gray-800"
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Writing"
                    value={policyForm.minWriting}
                    onChange={(e) => setPolicyForm({ ...policyForm, minWriting: e.target.value })}
                    className="p-2 text-xs rounded-xl border border-gray-300 text-gray-800"
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Speaking"
                    value={policyForm.minSpeaking}
                    onChange={(e) => setPolicyForm({ ...policyForm, minSpeaking: e.target.value })}
                    className="p-2 text-xs rounded-xl border border-gray-300 text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Official Policy URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://www.ox.ac.uk/admissions/..."
                  value={policyForm.officialPolicyUrl}
                  onChange={(e) => setPolicyForm({ ...policyForm, officialPolicyUrl: e.target.value })}
                  className="w-full text-xs rounded-xl border border-gray-300 p-2.5 text-gray-800 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Conditional Requirements / Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Conditional on taking pre-sessional English course..."
                  value={policyForm.conditions}
                  onChange={(e) => setPolicyForm({ ...policyForm, conditions: e.target.value })}
                  className="w-full text-xs rounded-xl border border-gray-300 p-2.5 text-gray-800 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingPolicy(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save & Publish Policy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Correction Review Modal */}
      {reviewingCorrection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Review Correction Report</h3>
              <button onClick={() => setReviewingCorrection(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="font-bold text-navy-950 block mb-0.5">Proposed Correction:</span>
                <p className="text-gray-700">{reviewingCorrection.proposedChange}</p>
                {reviewingCorrection.evidenceUrl && (
                  <a
                    href={reviewingCorrection.evidenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 underline font-semibold mt-1 inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" /> View Submitted Evidence
                  </a>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Administrator Review Notes / Public Audit Reason
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide verification reasoning for audit logs..."
                  value={adminReviewNotes}
                  onChange={(e) => setAdminReviewNotes(e.target.value)}
                  className="w-full text-xs rounded-xl border border-gray-300 p-2.5 text-gray-800 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleReviewCorrectionSubmit('REJECT')}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 font-bold transition disabled:opacity-50"
                >
                  Reject Report
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewCorrectionSubmit('APPROVE')}
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-sm disabled:opacity-50"
                >
                  Approve &amp; Update Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
