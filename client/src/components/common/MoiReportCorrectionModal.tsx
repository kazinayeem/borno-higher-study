import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, ShieldAlert, ExternalLink, Send } from 'lucide-react';
import { submitMoiCorrection } from '../../services/api';

interface MoiReportCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  policyId?: string;
  universityName: string;
  currentPolicySnippet?: string;
  onSuccess?: () => void;
}

export const MoiReportCorrectionModal: React.FC<MoiReportCorrectionModalProps> = ({
  isOpen,
  onClose,
  policyId,
  universityName,
  currentPolicySnippet,
  onSuccess,
}) => {
  const [issueCategory, setIssueCategory] = useState('INCORRECT_MOI_STATUS');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceText, setEvidenceText] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide specific details explaining the correction.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await submitMoiCorrection({
        moiPolicyId: policyId,
        universityName,
        issueCategory,
        description: description.trim(),
        evidenceUrl: evidenceUrl.trim() || undefined,
        evidenceText: evidenceText.trim() || undefined,
        reporterName: reporterName.trim() || undefined,
        reporterEmail: reporterEmail.trim() || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
        setSuccess(false);
        setDescription('');
        setEvidenceUrl('');
        setEvidenceText('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit correction report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-lg">Report MOI Policy Correction</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
            <p className="font-medium text-amber-950">Authoritative Review Guarantee</p>
            <p className="mt-0.5">
              Corrections are reviewed against primary university admissions documentation before being published. Student reports never overwrite verified records directly.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Target Institution
            </label>
            <div className="p-2.5 bg-gray-50 rounded-lg text-sm font-medium text-navy-900 border border-gray-200">
              {universityName}
            </div>
            {currentPolicySnippet && (
              <p className="text-xs text-gray-500 mt-1 italic">
                Current record: "{currentPolicySnippet}"
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Issue Category
            </label>
            <select
              value={issueCategory}
              onChange={(e) => setIssueCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            >
              <option value="INCORRECT_MOI_STATUS">Incorrect MOI Acceptance Status</option>
              <option value="OUTDATED_POLICY">Outdated Exemption Policy (New Intake Rule)</option>
              <option value="MISSING_COURSE_RESTRICTION">Course-Specific Exclusion / Restriction</option>
              <option value="VISA_MISMATCH">Immigration / Visa Rule Distinction Mismatch</option>
              <option value="BROKEN_LINK">Broken or Redirected Policy URL</option>
              <option value="OTHER">Other Factual Correction</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Correction Details <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Explain the discrepancy (e.g. 'University now requires 4-year degree instead of 3-year' or 'Faculty of Business now mandates IELTS 7.0')..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Official Verification URL (Recommended)
            </label>
            <div className="relative">
              <input
                type="url"
                placeholder="https://www.university.edu/admissions/english-waivers"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
              <ExternalLink className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Your Name (Optional)
              </label>
              <input
                type="text"
                placeholder="Student contributor"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Your Email (Optional)
              </label>
              <input
                type="email"
                placeholder="student@example.com"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 text-green-700 bg-green-50 p-3 rounded-lg text-xs">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Thank you! Correction report submitted and queued for Super Admin review.</span>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || success}
              className="inline-flex items-center space-x-2 px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Correction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
