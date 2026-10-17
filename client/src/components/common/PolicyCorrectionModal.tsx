import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, ShieldAlert, ExternalLink, Send } from 'lucide-react';
import { submitCountryPolicyCorrection } from '../../services/api';

interface PolicyCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  countryId: string;
  countryName: string;
  entityType: 'MINIMUM_WAGE' | 'STUDENT_WORK' | 'POST_STUDY_WORK' | 'LANGUAGE' | 'CAREER';
  defaultTitle?: string;
  onSuccess?: () => void;
}

export const PolicyCorrectionModal: React.FC<PolicyCorrectionModalProps> = ({
  isOpen,
  onClose,
  countryId,
  countryName,
  entityType,
  defaultTitle,
  onSuccess,
}) => {
  const [reportedIssue, setReportedIssue] = useState('');
  const [proposedCorrection, setProposedCorrection] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportedIssue.trim()) {
      setError('Please specify the exact discrepancy or outdated rule.');
      return;
    }
    if (!proposedCorrection.trim()) {
      setError('Please provide the corrected factual regulation or wage value.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await submitCountryPolicyCorrection({
        countryId,
        entityType,
        reportedIssue: reportedIssue.trim(),
        proposedCorrection: proposedCorrection.trim(),
        evidenceUrl: evidenceUrl.trim() || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
        setSuccess(false);
        setReportedIssue('');
        setProposedCorrection('');
        setEvidenceUrl('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit correction report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800/60">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Propose Policy Correction
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {countryName} • {defaultTitle || entityType.replace(/_/g, ' ')}
            </p>
          </div>
        </div>

        {success ? (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-center space-y-2">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="text-lg font-semibold text-emerald-900 dark:text-emerald-200">
              Report Submitted for Editorial Review
            </h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Thank you for upholding factual accuracy. Our editorial verification team will review your primary source.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-sm text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Identified Discrepancy or Outdated Policy *
              </label>
              <textarea
                value={reportedIssue}
                onChange={(e) => setReportedIssue(e.target.value)}
                placeholder="e.g. The national minimum wage was adjusted on July 1 to €12.82/hr or student work hour limits were updated under the Skilled Immigration Act..."
                rows={3}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Proposed Correct Rule or Value *
              </label>
              <textarea
                value={proposedCorrection}
                onChange={(e) => setProposedCorrection(e.target.value)}
                placeholder="State the accurate statutory rate, legal hour allowance, or official permit condition..."
                rows={2}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Official Primary Source URL (Government Gazette / Ministry)
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://www.gov.uk/ or https://www.canada.ca/..."
                  className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:outline-none"
                />
                <ExternalLink className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Authoritative government, labor department, or immigration gazettes only.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-primary-500/20 disabled:opacity-50 transition-colors"
              >
                {submitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit for Review
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
