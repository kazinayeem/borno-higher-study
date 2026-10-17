import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SeoHead } from '../components/common/SeoHead.js';
import { Breadcrumbs } from '../components/common/Breadcrumbs.js';
import { useAuth } from '../context/AuthContext.js';
import { FinancialDocumentItem } from '../types/index.js';
import {
  FileLock2,
  UploadCloud,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Lock,
  ArrowRight,
  Info,
  HelpCircle,
  Eye,
  ShieldAlert,
} from 'lucide-react';

const CATEGORIES = [
  { value: 'BANK_STATEMENT', label: 'Bank Statement (6-month active history)' },
  { value: 'SOLVENCY_CERTIFICATE', label: 'Bank Solvency Certificate' },
  { value: 'SCHOLARSHIP_AWARD_LETTER', label: 'Scholarship Award Letter' },
  { value: 'SPONSORSHIP_LETTER', label: 'Sponsorship Affidavit / Letter' },
  { value: 'TUITION_RECEIPT', label: 'Tuition Deposit / Payment Receipt' },
  { value: 'OTHER', label: 'Other Financial Evidence' },
];

export const FinancialDocumentsPage: React.FC = () => {
  const { user, token, isAuthenticated } = useAuth();

  const [documents, setDocuments] = useState<FinancialDocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload modal / form state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docCategory, setDocCategory] = useState('BANK_STATEMENT');
  const [countryIntended, setCountryIntended] = useState('Ireland');
  const [purpose, setPurpose] = useState('Visa financial readiness verification');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [fileType, setFileType] = useState('application/pdf');
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchDocuments = () => {
    if (!token) return;
    setLoading(true);
    fetch('/api/financial-documents/my-submissions', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load documents');
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.documents || [];
        setDocuments(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDocuments();
    }
  }, [isAuthenticated, token]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size: 10MB limit
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('File exceeds 10MB limit.');
        return;
      }
      setFileName(file.name);
      setFileSize(file.size);
      setFileType(file.type || 'application/pdf');
      setErrorMsg(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) {
      setErrorMsg('Please select a file to submit.');
      return;
    }
    if (!disclaimerAgreed) {
      setErrorMsg('You must acknowledge the internal scope and non-legal disclaimer.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/financial-documents/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documentCategory: docCategory,
          originalFileName: fileName,
          fileSizeBytes: fileSize,
          fileType: fileType,
          submissionPurpose: purpose,
          countryIntended: countryIntended,
          disclaimerAcknowledged: disclaimerAgreed,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setSuccessMsg('Financial document securely queued for internal staff review.');
      setShowUploadModal(false);
      setFileName('');
      setFileSize(0);
      setDisclaimerAgreed(false);
      fetchDocuments();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading document');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 py-20">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-teal-400 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Private Document Vault</h1>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Financial documents such as bank statements and solvency certificates are confidential.
            Please sign in with your individual account to access this vault.
          </p>
          <div className="mt-6">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED_INTERNAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Internal Review Completed
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-[11px] font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Under Review
          </span>
        );
      case 'INFO_REQUESTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-50 text-sky-800 text-[11px] font-bold">
            <Info className="w-3.5 h-3.5 text-sky-600" /> Info Requested
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 text-[11px] font-bold">
            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Rejected / Incomplete
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold">
            <Clock className="w-3.5 h-3.5 text-slate-500" /> {status.replace(/_/g, ' ')}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <SeoHead
        title="Private Financial Document Review Vault | Borno Higher Study"
        description="Confidential document verification module for bank statements, solvency certificates, and scholarship letters. Not for public indexing or AI training."
        canonicalPath="/dashboard/financial-documents"
        noIndex={true}
      />

      {/* Top Banner */}
      <div className="bg-slate-900 text-white pt-8 pb-10 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Student Dashboard', href: '/dashboard' },
              { label: 'Financial Documents' },
            ]}
          />
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-2">
                <FileLock2 className="w-3.5 h-3.5" />
                <span>Confidential Document Vault</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Bank Statement & Financial Document Review
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
            >
              <UploadCloud className="w-4 h-4" /> Submit Document
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Critical Legal Disclaimer */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-950 leading-relaxed mb-8 flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-amber-900 uppercase tracking-wider text-[11px] mb-1">
              Important Scope Notice & Legal Disclaimer
            </h2>
            <p>
              An internal review completed by Borno Higher Study staff verifies readability, formatting, and standard
              advisory criteria (such as minimum account duration or currency coverage) for your intended destination.
              <strong>
                {' '}
                This review must NEVER be presented as proof that a bank statement is authentic, that the issuing bank
                has verified it, that funds are legally sufficient for a visa, or that a university or embassy
                immigration authority will grant an approval.
              </strong>{' '}
              All official visa and admission decisions rest exclusively with the relevant government authorities.
            </p>
          </div>
        </div>

        {/* Security / Privacy Safeguards Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-start gap-3">
            <Lock className="w-4 h-4 text-teal-600 shrink-0 mt-1" />
            <div>
              <p className="text-xs font-bold text-slate-900">Zero Public Exposure</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                Stored in private encrypted vaults. Never published on blogs, search engines, or feeds.
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-1" />
            <div>
              <p className="text-xs font-bold text-slate-900">Audited Staff Access</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                Only authenticated reviewers inspect documents. Complete timestamped audit history recorded.
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-start gap-3">
            <FileText className="w-4 h-4 text-teal-600 shrink-0 mt-1" />
            <div>
              <p className="text-xs font-bold text-slate-900">No AI Model Training</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                Financial data is never fed into external generative AI systems or third-party datasets.
              </p>
            </div>
          </div>
        </div>

        {/* Documents Table / List */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Your Submitted Documents</h2>
              <p className="text-[11px] text-slate-500">Track internal advisory status and feedback</p>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs text-slate-500">Loading document vault...</div>
          ) : documents.length === 0 ? (
            <div className="py-16 text-center">
              <FileLock2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No documents submitted yet</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                Submit a bank statement, solvency certificate, or scholarship letter to check its readiness
                for visa requirements.
              </p>
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Submit First Document
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <div key={doc.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(doc.status)}
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {doc.documentCategory.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">{doc.originalFileName}</p>
                    <p className="text-xs text-slate-500">
                      Target Country: <strong>{doc.countryIntended || 'General'}</strong> • Size:{' '}
                      {(doc.fileSizeBytes / 1024).toFixed(0)} KB • Submitted:{' '}
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </p>

                    {doc.adminNotes && (
                      <div className="mt-2 p-3 rounded-lg bg-teal-50 border border-teal-200 text-xs text-teal-900">
                        <strong>Reviewer Feedback:</strong> {doc.adminNotes}
                      </div>
                    )}

                    {doc.rejectionReason && (
                      <div className="mt-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900">
                        <strong>Correction Required:</strong> {doc.rejectionReason}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-[11px] px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-mono">
                      Confidential ID: {doc.id.slice(-6)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileLock2 className="w-4 h-4 text-teal-600" />
                Upload Financial Document
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                Close
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Document Category
                </label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white text-slate-900"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Intended Destination Country
                  </label>
                  <input
                    type="text"
                    required
                    value={countryIntended}
                    onChange={(e) => setCountryIntended(e.target.value)}
                    placeholder="e.g. Ireland, Germany, UK"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    File (PDF, PNG, JPG max 10MB)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Submission Purpose / Notes
                </label>
                <textarea
                  rows={2}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Checking if balance history satisfies Irish immigration 6-month rule..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white text-slate-900"
                />
              </div>

              {/* Mandatory Non-legal acknowledgment */}
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={disclaimerAgreed}
                    onChange={(e) => setDisclaimerAgreed(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                  />
                  <span className="text-[11px] text-amber-950 leading-relaxed">
                    I acknowledge that this review is strictly advisory for internal readiness and
                    does not represent legal banking certification or guarantee visa issuance.
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold disabled:opacity-60"
                >
                  {submitting ? 'Submitting...' : 'Upload Securely'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default FinancialDocumentsPage;
