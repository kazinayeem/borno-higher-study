import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import {
  Flag,
  X,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Send,
  Info,
} from 'lucide-react';

export interface ReportCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: 'UNIVERSITY' | 'PROGRAM' | 'SCHOLARSHIP' | 'DEADLINE' | 'OTHER';
  entityId: string;
  entityName: string;
  entitySlug?: string;
  defaultField?: string;
  currentValue?: string;
}

const FIELD_OPTIONS = [
  { value: 'CLOSE_DATE', label: 'Incorrect Application Closing Date' },
  { value: 'OPEN_DATE', label: 'Incorrect Application Opening Date' },
  { value: 'TUITION_FEE', label: 'Wrong Tuition Fees or Currency' },
  { value: 'ENGLISH_REQS', label: 'Incorrect IELTS, TOEFL, or PTE Minimums' },
  { value: 'ADMISSION_REQS', label: 'Incorrect GPA or Academic Prerequisites' },
  { value: 'SCHOLARSHIP_ELIGIBILITY', label: 'Incorrect Scholarship Eligibility' },
  { value: 'OFFICIAL_LINK', label: 'Broken or Unofficial Link' },
  { value: 'NOT_FOUND_ON_WEBSITE', label: 'Program/Institution Not Found on Official Website' },
  { value: 'MISLEADING_INFO', label: 'Potentially Misleading or Fraudulent Information' },
  { value: 'DUPLICATE_RECORD', label: 'Duplicate Institution or Course Record' },
  { value: 'OTHER', label: 'Other Factual Error' },
];

export const ReportCorrectionModal: React.FC<ReportCorrectionModalProps> = ({
  isOpen,
  onClose,
  entityType,
  entityId,
  entityName,
  entitySlug,
  defaultField = 'CLOSE_DATE',
  currentValue = '',
}) => {
  const { user, token, isAuthenticated } = useAuth();

  const [field, setField] = useState(defaultField);
  const [description, setDescription] = useState('');
  const [proposedCorrection, setProposedCorrection] = useState('');
  const [officialEvidenceUrl, setOfficialEvidenceUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !officialEvidenceUrl.trim()) {
      setErrorMsg('Please describe the discrepancy and provide an official evidence link.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch('/api/reports/submit', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          entityType,
          entityId,
          entitySlug,
          entityName,
          fieldBelievedIncorrect: field,
          reasonCategory: field,
          description,
          currentValue,
          proposedCorrection,
          officialEvidenceUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit report');

      setSubmittedReport(data.report || { reportNumber: data.reportNumber });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Report Incorrect Information
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Community verification & factual accuracy safeguard
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedReport ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Correction Report Queued</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Report <strong>#{submittedReport.reportNumber}</strong> on "{entityName}" has been received.
              Our verification team checks all reports against official university and ministry sources
              before publishing any platform updates.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 max-w-md mx-auto text-left">
              <p className="font-semibold text-slate-700 mb-1">Safe Verification Protocol:</p>
              <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li>Public data is never modified automatically to prevent accidental or malicious alterations.</li>
                <li>Your private identity is never published alongside public corrections.</li>
                <li>You can track the investigation status in your student dashboard.</li>
              </ul>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Target record indicator */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Target Record:
              </span>
              <span className="font-bold text-slate-900">{entityName}</span>
              <span className="text-slate-400 ml-1.5 font-mono text-[11px]">({entityType})</span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Field Believed Incorrect
              </label>
              <select
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white text-slate-900"
              >
                {FIELD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Value (as shown)
                </label>
                <input
                  type="text"
                  value={currentValue}
                  disabled
                  className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Proposed Correct Value
                </label>
                <input
                  type="text"
                  placeholder="e.g. July 15, 2026 or €13,500"
                  value={proposedCorrection}
                  onChange={(e) => setProposedCorrection(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Evidence URL (Required)
              </label>
              <input
                type="url"
                required
                placeholder="https://www.institution.edu/official-admissions-page"
                value={officialEvidenceUrl}
                onChange={(e) => setOfficialEvidenceUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white text-slate-900"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Must be an official university catalog, government portal, or admissions bulletin link.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Explanation & Discrepancy Details
              </label>
              <textarea
                rows={3}
                required
                placeholder="Explain why the current information is outdated or inaccurate..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white text-slate-900"
              />
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Guarantee:</strong> Reporter details are never published on the public
                site. All factual updates are verified by authorized staff reviewers before public release.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold disabled:opacity-60 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Submitting Report...' : 'Submit Report for Verification'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default ReportCorrectionModal;
