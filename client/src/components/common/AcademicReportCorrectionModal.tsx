import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, ShieldAlert, ExternalLink, Send } from 'lucide-react';
import { submitAcademicCorrection } from '../../services/api';

interface AcademicReportCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  academicRequirementId?: string;
  universityName: string;
  programName?: string;
  degreeLevel?: string;
  onSuccess?: () => void;
}

export const AcademicReportCorrectionModal: React.FC<AcademicReportCorrectionModalProps> = ({
  isOpen,
  onClose,
  academicRequirementId,
  universityName,
  programName,
  degreeLevel,
  onSuccess,
}) => {
  const [issueCategory, setIssueCategory] = useState('INCORRECT_GPA_REQUIREMENT');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
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
    if (!evidenceUrl.trim()) {
      setError('An official university or credential authority source link is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await submitAcademicCorrection({
        academicRequirementId,
        universityName,
        programName,
        degreeLevel,
        issueCategory,
        description: description.trim(),
        officialEvidenceUrl: evidenceUrl.trim(),
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
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-300 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">Propose Academic Requirement Correction</h3>
              <p className="text-xs text-navy-200 mt-0.5">
                {universityName} {programName ? `• ${programName}` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-md"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">Correction Report Submitted</h4>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Thank you for contributing to academic integrity. Our editorial team will cross-check the official university course catalog before publishing updates.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
              <p className="font-semibold text-amber-950 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Editorial Verification Policy
              </p>
              <p>
                Student reports do not directly overwrite approved requirements. Every report must cite an official university catalog or department entry page for admin review.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Issue Category *</label>
              <select
                value={issueCategory}
                onChange={(e) => setIssueCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                required
              >
                <option value="INCORRECT_GPA_REQUIREMENT">Incorrect Minimum GPA / CGPA Threshold</option>
                <option value="MISSING_SUBJECT_PREREQUISITE">Missing or Incorrect Subject Prerequisite (Math, Physics, etc.)</option>
                <option value="EQUIVALENCY_DISCREPANCY">Qualification Equivalency or Foundation Year Policy Change</option>
                <option value="DEGREE_STREAM_REQUIREMENT">Required Stream (Science/Commerce/Arts) Inaccuracy</option>
                <option value="RESEARCH_PROPOSAL_SUPERVISOR">PhD Research Proposal / Supervisor Requirement Inaccuracy</option>
                <option value="OUTDATED_COURSE_PAGE">Outdated / Dead Official URL</option>
                <option value="OTHER">Other Academic Admission Detail</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Correction Details & Explanation *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the published requirement difference (e.g. 'University now requires minimum CGPA 3.30 instead of 3.00, and Higher Secondary Mathematics is mandatory for BSc Data Science')."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Official University Evidence URL *
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://www.ox.ac.uk/admissions/graduate/courses/..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 pr-8"
                  required
                />
                <ExternalLink className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Your Name (Optional)</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g. Rafiqul Islam"
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Your Email (Optional)</label>
                <input
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  placeholder="rafiq@example.com"
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-xl shadow-sm transition-all"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
