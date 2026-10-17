import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, ShieldAlert, ExternalLink, Send } from 'lucide-react';
import { submitEnglishTestCorrection } from '../../services/api';

interface TestReportCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'TEST_FEE' | 'UNIVERSITY_POLICY';
  feeId?: string;
  policyId?: string;
  itemTitle: string;
  currentValueSnippet?: string;
  onSuccess?: () => void;
}

export const TestReportCorrectionModal: React.FC<TestReportCorrectionModalProps> = ({
  isOpen,
  onClose,
  targetType,
  feeId,
  policyId,
  itemTitle,
  currentValueSnippet,
  onSuccess,
}) => {
  const [category, setCategory] = useState('INCORRECT_SCORE');
  const [proposedChange, setProposedChange] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedChange.trim()) {
      setError('Please provide specific details of the proposed correction.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await submitEnglishTestCorrection({
        targetType,
        feeId,
        policyId,
        correctionCategory: category,
        proposedChange: proposedChange.trim(),
        evidenceUrl: evidenceUrl.trim() || undefined,
        evidenceNotes: evidenceNotes.trim() || undefined,
        reporterName: reporterName.trim() || undefined,
        reporterEmail: reporterEmail.trim() || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
        setSuccess(false);
        setProposedChange('');
        setEvidenceUrl('');
        setEvidenceNotes('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Report Incorrect Information</h3>
              <p className="text-xs text-gray-300">Community accuracy & verified admissions reporting</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Correction Report Received</h4>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                Thank you for keeping Borno Higher Study accurate! A Super Admin will verify your evidence against official university admissions notices.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700">
                <span className="font-semibold text-navy-900">Reporting on:</span> {itemTitle}
                {currentValueSnippet && (
                  <div className="mt-1 text-gray-500 italic truncate">Current data: {currentValueSnippet}</div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Category of Inaccuracy *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm rounded-xl border border-gray-300 px-3 py-2 text-gray-800 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="INCORRECT_FEE">Incorrect Registration Fee (BDT / USD)</option>
                  <option value="OUTDATED_POLICY">Outdated Acceptance Policy</option>
                  <option value="INCORRECT_SCORE">Incorrect Minimum Overall or Component Score</option>
                  <option value="WRONG_ONLINE_RESTRICTION">Wrong Online/At-Home Test Restriction</option>
                  <option value="BROKEN_LINK">Broken Official Policy Link</option>
                  <option value="OTHER">Other Factual Correction</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Proposed Correction & Factual Detail *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="State the correct score threshold, current exam fee, or revised policy update..."
                  value={proposedChange}
                  onChange={(e) => setProposedChange(e.target.value)}
                  className="w-full text-sm rounded-xl border border-gray-300 p-3 text-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Official Evidence URL (Recommended)
                </label>
                <input
                  type="url"
                  placeholder="https://www.university.ac.uk/admissions/english-requirements"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  className="w-full text-sm rounded-xl border border-gray-300 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="Student Contributor"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full text-xs rounded-xl border border-gray-300 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email (For Updates)</label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={reporterEmail}
                    onChange={(e) => setReporterEmail(e.target.value)}
                    className="w-full text-xs rounded-xl border border-gray-300 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {submitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Submit for Verification
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
