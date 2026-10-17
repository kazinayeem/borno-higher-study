import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo.js';
import { COUNTRIES_DATA } from '../../data/countriesData.js';
import { ShieldAlert, ExternalLink, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-navy text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="dark" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mt-4">
              Borno Higher Study is an international higher-education discovery platform helping students discover universities, compare degree programs, calculate tuition costs, find scholarships, and verify English proficiency with grounded AI guidance.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Grounded with official admissions & government sources.</span>
            </div>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Interactive Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/calculator" className="hover:text-teal-400 transition-colors">
                  Tuition & Cost Calculator
                </Link>
              </li>
              <li>
                <Link to="/english-checker" className="hover:text-teal-400 transition-colors">
                  IELTS / TOEFL / PTE Checker
                </Link>
              </li>
              <li>
                <Link to="/test-prep" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <span>English Test Prep Hub</span>
                  <span className="bg-amber-900/80 text-amber-300 text-[10px] px-1.5 py-0.5 rounded font-bold">New</span>
                </Link>
              </li>
              <li>
                <Link to="/advisor" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <span>Borno Study Advisor</span>
                  <span className="bg-teal-900/80 text-teal-300 text-[10px] px-1.5 py-0.5 rounded font-bold">AI</span>
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-teal-400 transition-colors">
                  University Comparison
                </Link>
              </li>
              <li>
                <Link to="/planner" className="hover:text-teal-400 transition-colors">
                  Application Planner
                </Link>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Explore Catalog
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/countries" className="hover:text-teal-400 transition-colors">
                  30 Study Destinations
                </Link>
              </li>
              <li>
                <Link to="/universities" className="hover:text-teal-400 transition-colors">
                  Global Universities
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-teal-400 transition-colors">
                  Academic Disciplines
                </Link>
              </li>
              <li>
                <Link to="/scholarships" className="hover:text-teal-400 transition-colors">
                  Scholarships & Funding
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-teal-400 transition-colors">
                  Admin Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Trust */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              About & Trust
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-teal-400 transition-colors">
                  About Borno Higher Study
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-400 transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-teal-400 transition-colors">
                  Privacy Policy & Terms
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-teal-400 transition-colors">
                  Student Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 30 Countries Quick Directory Footer Grid */}
        <div className="py-8 border-b border-slate-800/80">
          <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
            Covered Study Destinations (30 Countries)
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
            {COUNTRIES_DATA.map((c) => (
              <Link
                key={c.slug}
                to={`/countries/${c.slug}`}
                className="hover:text-teal-400 transition-colors flex items-center gap-1"
              >
                <span>{c.flagEmoji}</span>
                <span>{c.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Official-Source Disclaimer (Section 11 & 18 Requirement) */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-start gap-2.5 max-w-3xl">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-300">Official Source Disclaimer:</strong> Borno Higher Study aggregates verified admission criteria, tuition fees, and scholarship details from authenticated university websites and government education portals. Requirements are subject to change by institutional authorities without prior notice. Always confirm final intake deadlines on official university admissions pages before submitting documents.
            </p>
          </div>
          <p className="shrink-0 text-slate-400">
            © {new Date().getFullYear()} Borno Higher Study. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
