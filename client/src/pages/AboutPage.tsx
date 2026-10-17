import React from 'react';
import { Logo } from '../components/common/Logo.js';
import { ShieldCheck, Target, Heart, Award, CheckCircle2, Sparkles } from 'lucide-react';
import { SeoHead } from '../components/common/SeoHead.js';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <SeoHead
        title="About Borno Higher Study — Global Education Intelligence"
        description="Learn about Borno Higher Study's mission to provide transparent, verified higher education data, tuition costs in BDT, and grounded AI study advising."
        canonicalPath="/about"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4">
          <Logo className="justify-center" />
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-navy pt-2">
            Democratizing Global Higher Education
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Borno Higher Study was founded on a singular conviction: international students deserve verified, factual, and transparent higher education data without agent bias or hidden agendas.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Target className="w-5 h-5 text-teal-700" />
            </div>
            <h3 className="font-extrabold text-xl text-brand-navy">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To empower students from Bangladesh and across the world with authenticated university tuition fees, living expenses in BDT, verified scholarships, and grounded AI study-abroad guidance.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Award className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="font-extrabold text-xl text-brand-navy">Our Standards</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Zero fabricated rankings. Zero promotional bias. Every degree prerequisite, IELTS subscore requirement, and application deadline is traceable to official university admission portals.
            </p>
          </div>
        </div>

        {/* Core Principles */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-card space-y-6">
          <h2 className="text-2xl font-extrabold text-brand-navy">
            Our Verification Methodology
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <p>
                <strong>Official Source Attribution:</strong> Every university catalog record links directly to the institution's official international student admissions prospectus.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <p>
                <strong>Accurate Financial Breakdown:</strong> We clearly distinguish statutory institutional tuition from estimated monthly living expenses and user assumptions.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <p>
                <strong>Grounded RAG Artificial Intelligence:</strong> The Borno Study Advisor uses deterministic checks and retrieval-augmented generation to ensure factual accuracy with official citations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
