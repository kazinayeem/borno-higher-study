import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../common/Logo.js';
import { COUNTRIES_DATA } from '../../data/countriesData.js';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext.js';

export const Footer: React.FC = () => {
  const { t, formatNumber } = useTranslation();
  const location = useLocation();

  const isAdminDashboard =
    location.pathname.startsWith('/super-admin/dashboard') ||
    location.pathname === '/admin' ||
    location.pathname.startsWith('/admin/verification');

  if (isAdminDashboard) {
    return null;
  }

  return (
    <footer className="bg-[#0B192C] dark:bg-[#070E1A] text-slate-300 dark:text-slate-400 pt-16 pb-12 border-t border-slate-800 dark:border-slate-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="dark" />
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed mt-4 font-normal">
              {t('home.heroSubtitle')}
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0" />
              <span>{t('navigation.dataVerified')}</span>
            </div>
          </div>

          {/* Column 1: Exploration */}
          <div>
            <h4 className="text-white font-heading font-semibold text-xs uppercase tracking-wider mb-4">
              {t('navigation.universities')} & {t('navigation.programs')}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/universities" className="hover:text-teal-400 transition-colors">
                  {t('navigation.universities')} ({formatNumber(940)}+)
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-teal-400 transition-colors">
                  {t('navigation.programs')}
                </Link>
              </li>
              <li>
                <Link to="/countries" className="hover:text-teal-400 transition-colors">
                  {t('navigation.destinations')} ({formatNumber(42)})
                </Link>
              </li>
              <li>
                <Link to="/scholarships" className="hover:text-teal-400 transition-colors">
                  {t('navigation.scholarships')}
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="hover:text-teal-400 transition-colors">
                  {t('navigation.costCalculator')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Admissions & Visas */}
          <div>
            <h4 className="text-white font-heading font-semibold text-xs uppercase tracking-wider mb-4">
              {t('navigation.admissions')} & {t('navigation.visaGuide')}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/eligibility-checker" className="hover:text-teal-400 transition-colors">
                  {t('navigation.eligibilityChecker')}
                </Link>
              </li>
              <li>
                <Link to="/academic-requirements" className="hover:text-teal-400 transition-colors">
                  {t('navigation.academicRequirements')}
                </Link>
              </li>
              <li>
                <Link to="/english-tests" className="hover:text-teal-400 transition-colors">
                  {t('navigation.englishTests')}
                </Link>
              </li>
              <li>
                <Link to="/moi-acceptance" className="hover:text-teal-400 transition-colors">
                  {t('navigation.moiAcceptance')}
                </Link>
              </li>
              <li>
                <Link to="/visa-intelligence" className="hover:text-teal-400 transition-colors">
                  {t('navigation.visaGuide')}
                </Link>
              </li>
              <li>
                <Link to="/visa-application-centres" className="hover:text-teal-400 transition-colors">
                  {t('navigation.visaCentres')}
                </Link>
              </li>
              <li>
                <Link to="/country-work-guide" className="hover:text-teal-400 transition-colors font-medium text-emerald-400">
                  Global Work &amp; Career Guide
                </Link>
              </li>
              <li>
                <Link to="/career-toolkit" className="hover:text-teal-400 transition-colors font-medium text-teal-400">
                  CV &amp; Career Toolkit (Europass)
                </Link>
              </li>
              <li>
                <Link to="/career-toolkit/cv-builder" className="hover:text-teal-400 transition-colors">
                  Interactive CV Builder
                </Link>
              </li>
              <li>
                <Link to="/career-toolkit/cv-checklist" className="hover:text-teal-400 transition-colors">
                  Pre-Submission CV Checklist
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Research & Governance */}
          <div>
            <h4 className="text-white font-heading font-semibold text-xs uppercase tracking-wider mb-4">
              {t('navigation.research')} & {t('navigation.editorialIntegrity')}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/blog" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <span>{t('navigation.blog')}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-teal-900 text-teal-300 tabular-nums">{formatNumber(100)}+</span>
                </Link>
              </li>
              <li>
                <Link to="/research" className="hover:text-teal-400 transition-colors">
                  {t('navigation.research')}
                </Link>
              </li>
              <li>
                <Link to="/compare/universities" className="hover:text-teal-400 transition-colors">
                  {t('navigation.compareUniversities')}
                </Link>
              </li>
              <li>
                <Link to="/compare/countries" className="hover:text-teal-400 transition-colors">
                  {t('navigation.compareCountries')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-teal-400 transition-colors">
                  {t('navigation.editorialIntegrity')}
                </Link>
              </li>
              <li>
                <Link to="/super-admin/login" className="hover:text-teal-400 transition-colors text-slate-400">
                  {t('navigation.superAdmin')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Study Destinations Index */}
        <div className="py-8 border-b border-slate-800/80">
          <p className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider mb-3 font-heading">
            {t('navigation.destinations')} ({formatNumber(42)} {t('universities.country')})
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

        {/* Official Source Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-400 leading-relaxed">
          <div className="max-w-3xl">
            <p>
              <strong className="text-slate-200">{t('navigation.dataVerified')}:</strong> {t('home.dataIntegrityBadge')}
            </p>
          </div>
          <p className="shrink-0 text-slate-500 text-xs">
            © {formatNumber(new Date().getFullYear())} Borno Higher Study. {t('common.allRightsReserved') || 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
};

