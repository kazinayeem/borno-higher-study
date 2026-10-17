import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, ShieldAlert, ExternalLink, Send } from 'lucide-react';
import { submitVisaCorrection } from '../../services/api';

interface VisaReportCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'STATISTICS' | 'CENTRE' | 'POLICY' | 'INDIA_TRAVEL';
  statisticsId?: string;
  centreId?: string;
  countryName: string;
  itemTitle?: string;
  onSuccess?: () => void;
}

export const VisaReportCorrectionModal: React.FC<VisaReportCorrectionModalProps> = ({
  isOpen,
  onClose,
  targetType,
  statisticsId,
  centreId,
  countryName,
  itemTitle,
  onSuccess,
}) => {
  const [issueCategory, setIssueCategory] = useState(
    targetType === 'INDIA_TRAVEL'
      ? 'INCORRECT_INDIA_TRAVEL'
      : targetType === 'STATISTICS'
      ? 'INCORRECT_APPROVAL_RATE'
      : 'INCORRECT_CENTRE_LOCATION'
  );
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

    try {
      setSubmitting(true);
      setError(null);
      await submitVisaCorrection({
        targetType,
        statisticsId,
        centreId,
        countryName,
        issueCategory,
        description: description.trim(),
        evidenceUrl: evidenceUrl.trim() || undefined,
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
              <h3 className="font-semibold text-base leading-tight">Report Incorrect Visa Information</h3>
              <p className="text-xs text-navy-200 mt-0.5">{countryName} {itemTitle ? `• ${itemTitle}` : ''}</p>
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

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-navy-950 mb-1">Thank you for your report!</h4>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                Our editorial team and Super Admins will verify your official source submission. Verified changes will be published in the live directory.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  Help keep visa intelligence accurate for Bangladeshi students. Submissions must cite official government portals (e.g. Home Office, VFS Global, Embassy websites). Unverified rumors are rejected.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Issue Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Issue Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={issueCategory}
                  onChange={(e) => setIssueCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="INCORRECT_APPROVAL_RATE">Incorrect visa approval / refusal rate</option>
                  <option value="OUTDATED_STATISTICS">Outdated statistics or reporting period</option>
                  <option value="INCORRECT_CENTRE_LOCATION">Incorrect application centre location / city</option>
                  <option value="INCORRECT_INDIA_TRAVEL">Incorrect India-travel requirement rule</option>
                  <option value="BROKEN_OFFICIAL_LINK">Broken official government source link</option>
                  <option value="MISLEADING_REQUIREMENTS">Misleading visa document requirements</option>
                  <option value="OUTDATED_FEES_OR_TIMES">Outdated processing times or service fee</option>
                  <option value="OTHER">Other visa intelligence issue</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  What is incorrect? Please explain <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what the official policy states and where our data deviates..."
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              {/* Evidence URL */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
                  <span>Official Evidence URL (Recommended)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </label>
                <input
                  type="url"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://www.gov.uk/... or https://visa.vfsglobal.com/..."
                  className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Reporter Info */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Your Email</label>
                  <input
                    type="email"
                    value={reporterEmail}
                    onChange={(e) => setReporterEmail(e.target.value)}
                    placeholder="For review updates"
                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
