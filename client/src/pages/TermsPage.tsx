import React from 'react';
import { ShieldAlert, FileText, Lock, CheckCircle } from 'lucide-react';
import { SeoHead } from '../components/common/SeoHead.js';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <SeoHead
        title="Terms of Service & Privacy Policy | Borno Higher Study"
        description="Terms of service, data verification policies, and privacy disclosures for the Borno Higher Study platform."
        canonicalPath="/terms"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
            Governance & Legal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mt-1">
            Terms of Service & Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Last Updated: February 2025 • Borno Higher Study
          </p>
        </div>

        {/* Disclaimer Highlight */}
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
            <span>Official University Source & Data Accuracy Disclaimer</span>
          </div>
          <p>
            Borno Higher Study aggregates admissions information, tuition fee structures, and scholarship criteria published by official university portals and government education ministries. While our data verification pipeline checks sources regularly, academic institutions reserve the unilateral right to amend deadlines, tuition schedules, and admission quotas. Users must always verify critical application deadlines on official university admissions pages before submitting final documentation.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-card space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              1. Platform Purpose & Scope
            </h2>
            <p>
              Borno Higher Study is an informational and academic discovery platform. Borno Higher Study does not act as an immigration law firm, does not issue visas, and cannot guarantee university admission decisions or scholarship awards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy flex items-center gap-2">
              <Lock className="w-5 h-5 text-teal-600" />
              2. Privacy & Student Data Protection
            </h2>
            <p>
              We respect student privacy. Student account preferences, saved bookmarks, and custom calculator figures are stored securely. We do not sell student contact information to unauthorized commercial brokers or third-party advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-teal-600" />
              3. AI Study Advisor Usage
            </h2>
            <p>
              The Borno Study Advisor provides consultative exploration using retrieval-augmented generation. It is designed to assist discovery and summarize official policies, but does not substitute for direct institutional communication.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
