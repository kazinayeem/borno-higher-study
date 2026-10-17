import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  Circle,
  FileCheck,
  AlertTriangle,
  RotateCcw,
  Save,
  ArrowRight,
  ShieldCheck,
  Download,
  ExternalLink,
  Zap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PageIntro } from '../components/motion/index';
import { getChecklistItems, getChecklistProgress, saveChecklistProgress } from '../services/api';
import { ChecklistItem } from '../types/index';

export const CVChecklistPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Generate or read a stable local sessionKey for guests
  const getSessionKey = () => {
    let key = localStorage.getItem('borno_checklist_session');
    if (!key) {
      key = 'sess_' + Math.random().toString(36).substring(2, 12);
      localStorage.setItem('borno_checklist_session', key);
    }
    return key;
  };

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const sessionKey = getSessionKey();
        const [itemsRes, progressRes] = await Promise.all([
          getChecklistItems(),
          getChecklistProgress(sessionKey)
        ]);
        setItems(itemsRes.items || []);

        const initialCompleted: Record<string, boolean> = {};
        if (progressRes.completedItems) {
          progressRes.completedItems.forEach((id: string) => {
            initialCompleted[id] = true;
          });
        }
        setCompleted(initialCompleted);
      } catch (e) {
        console.error('Failed to load checklist:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleItem = async (id: string) => {
    const nextCompleted = { ...completed, [id]: !completed[id] };
    setCompleted(nextCompleted);

    // Save automatically
    try {
      const sessionKey = getSessionKey();
      const completedArray = Object.keys(nextCompleted).filter((k) => nextCompleted[k]);
      await saveChecklistProgress(completedArray, sessionKey);
      setSaveStatus(isBn ? 'সংরক্ষিত' : 'Saved');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (e) {
      console.warn('Failed to sync checklist progress:', e);
    }
  };

  const handleReset = async () => {
    if (window.confirm(isBn ? 'আপনি কি পুরো চেকলিস্ট রিসেট করতে চান?' : 'Reset all checklist items?')) {
      setCompleted({});
      const sessionKey = getSessionKey();
      await saveChecklistProgress([], sessionKey);
    }
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#080E1A] text-slate-900 dark:text-slate-100 pb-24 transition-colors">
      {/* Header */}
      <div className="bg-[#0B192C] dark:bg-[#070D18] text-white pt-14 pb-16 border-b border-slate-800">
        <PageIntro className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-teal-400 text-xs font-semibold tracking-wide uppercase mb-3">
            <FileCheck className="w-4 h-4 text-teal-400" />
            {isBn ? 'প্রি-সাবমিশন ভেরিফিকেশন' : 'Pre-Submission Verification'}
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading font-semibold text-white tracking-tight mb-3">
            {isBn ? 'আবেদন জমা দেওয়ার পূর্ববর্তী সিভি চেকলিস্ট' : 'The 10-Point Pre-Submission CV Checklist'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {isBn
              ? 'বিশ্ববিদ্যালয় পোর্টাল, স্কলারশিপ বোর্ড বা অধ্যাপকের নিকট সিভি ইমেইল করার পূর্বে এই ১০টি মানদণ্ড যাচাই করে নিন। আপনার অগ্রগতি স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকে।'
              : 'Before uploading your CV to an admissions portal or emailing a potential faculty supervisor, verify each critical dimension below. Your progress saves automatically.'}
          </p>

          {/* Progress Bar Container */}
          <div className="mt-8 p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-slate-300">
                {isBn ? 'ভেরিফিকেশন সম্পন্ন:' : 'Verification Readiness:'} {completedCount} / {totalCount} ({progressPercent}%)
              </span>
              {saveStatus && (
                <span className="text-teal-400 font-normal">
                  ✓ {saveStatus}
                </span>
              )}
            </div>
            <div className="w-full h-3 rounded-full bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </PageIntro>
      </div>

      {/* Main Checklist Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="text-xs text-slate-500 font-medium">
              {isBn ? 'চেকলিস্টে টিক চিহ্ন দিন:' : 'Mark each verified item before submission:'}
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isBn ? 'সব রিসেট করুন' : 'Reset Progress'}</span>
            </button>
          </div>

          {/* Checklist Items */}
          <div className="space-y-4">
            {items.map((item, index) => {
              const isChecked = !!completed[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                    isChecked
                      ? 'bg-teal-50/60 dark:bg-teal-950/20 border-teal-500/40'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 shrink-0 focus:outline-none"
                    aria-label="Toggle Check"
                  >
                    {isChecked ? (
                      <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                    )}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        #{index + 1} • {isBn ? item.categoryBn : item.category}
                      </span>
                      {item.importance === 'CRITICAL' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400">
                          {isBn ? 'অপরিহার্য' : 'CRITICAL'}
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-sm font-bold transition-colors ${
                        isChecked
                          ? 'line-through text-slate-500 dark:text-slate-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {isBn ? item.titleBn : item.titleEn}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {isBn ? item.descriptionBn : item.descriptionEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Callout */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              {progressPercent === 100 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  {isBn ? 'অভিনন্দন! আপনার সিভি সম্পূর্ণভাবে প্রস্তুত।' : 'Congratulations! Your CV is fully verified.'}
                </span>
              ) : (
                <span>
                  {isBn
                    ? `বাকি আছে: ${totalCount - completedCount}টি মানদণ্ড`
                    : `Remaining: ${totalCount - completedCount} checkpoints to verify`}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/career-toolkit/cv-review"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors shadow-xs"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isBn ? 'সিভি কোয়ালিটি রিভিউ করুন' : 'Run Rule-Based Review'}</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
