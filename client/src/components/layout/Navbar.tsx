import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../common/Logo.js';
import { useAuth } from '../../context/AuthContext.js';
import { useSaved } from '../../context/SavedContext.js';
import { useCompare } from '../../context/CompareContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { gsap, isReducedMotion, MOTION_DURATIONS, MOTION_EASE } from '../../utils/motion.js';
import {
  Globe,
  GraduationCap,
  BookOpen,
  Award,
  Calculator,
  Compass,
  FileCheck2,
  Calendar,
  Scale,
  Menu,
  X,
  User,
  Shield,
  LogOut,
  ChevronDown,
  Building2,
  Sparkles,
  Bookmark,
  ExternalLink,
  Sun,
  Moon,
  Check,
  FileText,
  Users,
  Search,
  CheckCircle2,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, isSuperAdmin, logout } = useAuth();
  const { savedUniversityIds, savedScholarshipIds } = useSaved();
  const { compareSlugs } = useCompare();
  const { language, setLanguage, t, isBengali } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const totalSaved = savedUniversityIds.length + savedScholarshipIds.length;

  useEffect(() => {
    if (!navRef.current || isReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -12, opacity: 0 },
        { y: 0, opacity: 1, duration: MOTION_DURATIONS.standard, ease: MOTION_EASE.editorial, clearProps: 'transform' }
      );
    }, navRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setUserDropdownOpen(false);
    setLangMenuOpen(false);
  }, [location.pathname]);

  // Handle outside click & escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
        setUserDropdownOpen(false);
        setLangMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setUserDropdownOpen(false);
        setLangMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-50 w-full transition-all duration-200 border-b ${
        isScrolled
          ? 'bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md border-slate-200/90 dark:border-slate-800 shadow-xs'
          : 'bg-white dark:bg-[#0B132B] border-slate-200/80 dark:border-slate-800/70'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo - Compact and restrained */}
          <div className="flex items-center shrink-0">
            <Logo compact={false} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5" aria-label="Main Navigation">
            {/* 1. Universities */}
            <Link
              to="/universities"
              className={`px-2.5 xl:px-3 py-1.5 rounded-md text-xs xl:text-sm font-medium transition-colors ${
                isActive('/universities')
                  ? 'text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 font-semibold'
                  : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
              }`}
            >
              {t('navigation.universities')}
            </Link>

            {/* 2. Programs / Courses */}
            <Link
              to="/courses"
              className={`px-2.5 xl:px-3 py-1.5 rounded-md text-xs xl:text-sm font-medium transition-colors ${
                isActive('/courses')
                  ? 'text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 font-semibold'
                  : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
              }`}
            >
              {t('navigation.programs')}
            </Link>

            {/* 3. Countries */}
            <Link
              to="/countries"
              className={`px-2.5 xl:px-3 py-1.5 rounded-md text-xs xl:text-sm font-medium transition-colors ${
                isActive('/countries')
                  ? 'text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 font-semibold'
                  : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
              }`}
            >
              {t('navigation.countries')}
            </Link>

            {/* 4. Scholarships */}
            <Link
              to="/scholarships"
              className={`px-2.5 xl:px-3 py-1.5 rounded-md text-xs xl:text-sm font-medium transition-colors ${
                isActive('/scholarships')
                  ? 'text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 font-semibold'
                  : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
              }`}
            >
              {t('navigation.scholarships')}
            </Link>

            {/* INTERMEDIATE WIDTH COLLAPSIBLE: On 1024px-1279px, group secondary items into a clean 'More' menu */}
            <div className="relative xl:hidden">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'more' ? null : 'more')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeDropdown === 'more'
                    ? 'text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
                aria-expanded={activeDropdown === 'more'}
              >
                <span>{isBengali ? 'আরও টুল ও গাইড' : 'Admissions & Tools'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {activeDropdown === 'more' && (
                <div className="absolute left-0 mt-1.5 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-dropdown p-2 z-50 max-h-[80vh] overflow-y-auto">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-1">
                      Admissions &amp; Visa
                    </p>
                    <div className="space-y-0.5">
                      <Link to="/eligibility-checker" className="block px-2 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                        {t('navigation.academicEligibilityChecker')}
                      </Link>
                      <Link to="/academic-requirements" className="block px-2 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                        {t('navigation.academicThresholds')}
                      </Link>
                      <Link to="/visa-intelligence" className="block px-2 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                        {t('navigation.liveVisaIntel')}
                      </Link>
                      <Link to="/visa-application-centres" className="block px-2 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                        {t('navigation.applicationCentres')}
                      </Link>
                      <Link to="/country-work-guide" className="block px-2 py-1.5 rounded-lg text-xs font-semibold text-teal-700 dark:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                        {t('navigation.countryWorkGuide')} (Wages &amp; Rules)
                      </Link>
                    </div>
                  </div>

                  <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-1">
                      Student Tools &amp; Career
                    </p>
                    <div className="space-y-0.5">
                      <Link to="/calculator" className="block px-2 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                        {t('navigation.tuitionCalculator')}
                      </Link>
                      <Link to="/english-tests" className="block px-2 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                        {t('navigation.englishTests')}
                      </Link>
                      <Link to="/english-checker" className="block px-2 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                        English Eligibility Checker
                      </Link>
                      <Link to="/advisor" className="block px-2 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                        AI Study Advisor
                      </Link>
                      <Link to="/career-toolkit" className="block px-2 py-1.5 rounded-lg text-xs font-semibold text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40">
                        CV &amp; Career Toolkit (Europass)
                      </Link>
                    </div>
                  </div>

                  <div className="p-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-1">
                      Research &amp; Community
                    </p>
                    <div className="space-y-0.5">
                      <Link to="/blog" className="block px-2 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                        {t('navigation.editorialGuides')}
                      </Link>
                      <Link to="/research" className="block px-2 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                        {t('navigation.researchLibrary')}
                      </Link>
                      <Link to="/community" className="block px-2 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                        Student Community
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* FULL EXPANSION (xl: screens 1280px and wider) */}
            {/* 5. Admissions & Visa Dropdown */}
            <div className="relative hidden xl:block">
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'admissions' ? null : 'admissions')
                }
                className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-md text-xs xl:text-sm font-medium transition-colors ${
                  isActive('/eligibility-checker') ||
                  isActive('/academic-requirements') ||
                  isActive('/study-guides') ||
                  isActive('/visa-intelligence') ||
                  isActive('/visa-application-centres') ||
                  activeDropdown === 'admissions'
                    ? 'text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
                aria-expanded={activeDropdown === 'admissions'}
              >
                <span>{isBengali ? 'ভর্তি ও ভিসা' : 'Admissions & Visa'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {activeDropdown === 'admissions' && (
                <div className="absolute left-0 mt-1.5 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-dropdown p-1.5 z-50">
                  <Link
                    to="/eligibility-checker"
                    className="block px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800/70 transition"
                  >
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{t('navigation.academicEligibilityChecker')}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Evaluate SSC/HSC GPA &amp; degree CGPA criteria
                    </p>
                  </Link>
                  <Link
                    to="/academic-requirements"
                    className="block px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800/70 transition border-t border-slate-100 dark:border-slate-800"
                  >
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{t('navigation.academicThresholds')}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Prerequisites by destination, level, and faculty
                    </p>
                  </Link>
                  <Link
                    to="/visa-intelligence"
                    className="block px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800/70 transition border-t border-slate-100 dark:border-slate-800"
                  >
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{t('navigation.liveVisaIntel')}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Statutory proof of funds &amp; application timelines
                    </p>
                  </Link>
                  <Link
                    to="/visa-application-centres"
                    className="block px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800/70 transition border-t border-slate-100 dark:border-slate-800"
                  >
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{t('navigation.applicationCentres')}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      VFS Dhaka/Sylhet biometrics &amp; transit rules
                    </p>
                  </Link>
                  <Link
                    to="/visa-statistics"
                    className="block px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800/70 transition border-t border-slate-100 dark:border-slate-800"
                  >
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{t('navigation.visaStatistics')}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Unmixed official approval and refusal rates
                    </p>
                  </Link>
                  <Link
                    to="/country-work-guide"
                    className="block px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800/70 transition border-t border-slate-100 dark:border-slate-800"
                  >
                    <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                      <span>{t('navigation.countryWorkGuide')}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">New</span>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Wages, student hours, post-study routes &amp; roadmaps
                    </p>
                  </Link>
                </div>
              )}
            </div>

            {/* 6. Tools & Career Dropdown */}
            <div className="relative hidden xl:block">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'tools' ? null : 'tools')}
                className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-md text-xs xl:text-sm font-medium transition-colors ${
                  isActive('/calculator') ||
                  isActive('/english-tests') ||
                  isActive('/english-checker') ||
                  isActive('/advisor') ||
                  isActive('/career-toolkit') ||
                  isActive('/planner') ||
                  activeDropdown === 'tools'
                    ? 'text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
                aria-expanded={activeDropdown === 'tools'}
              >
                <span>{isBengali ? 'টুলস ও ক্যারিয়ার' : 'Tools & Career'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {activeDropdown === 'tools' && (
                <div className="absolute left-0 mt-1.5 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-dropdown p-1.5 z-50">
                  <Link
                    to="/calculator"
                    className="block px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800/70 transition"
                  >
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{t('navigation.tuitionCalculator')}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Net tuition, blocked accounts &amp; BDT conversion
                    </p>
                  </Link>
                  <Link
                    to="/english-tests"
                    className="block px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800/70 transition border-t border-slate-100 dark:border-slate-800"
                  >
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{t('navigation.englishTests')}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      IELTS, PTE, TOEFL &amp; university cutoffs
                    </p>
                  </Link>
                  <Link
                    to="/english-checker"
                    className="block px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800/70 transition border-t border-slate-100 dark:border-slate-800"
                  >
                    <p className="font-semibold text-slate-900 dark:text-slate-100">English Eligibility Checker</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Filter institutions matching your exact scores
                    </p>
                  </Link>
                  <Link
                    to="/advisor"
                    className="block px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800/70 transition border-t border-slate-100 dark:border-slate-800"
                  >
                    <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span>AI Study Advisor</span>
                      <Sparkles className="w-3 h-3 text-teal-600" />
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Interactive degree &amp; country recommendation
                    </p>
                  </Link>
                  <Link
                    to="/career-toolkit"
                    className="block px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800/70 transition border-t border-slate-100 dark:border-slate-800"
                  >
                    <p className="font-semibold text-teal-700 dark:text-teal-400">
                      CV &amp; Career Toolkit
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Europass, Academic CVs, Builder &amp; 52 Records
                    </p>
                  </Link>
                </div>
              )}
            </div>

            {/* 7. Research & Community Dropdown */}
            <div className="relative hidden xl:block">
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'research' ? null : 'research')
                }
                className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-md text-xs xl:text-sm font-medium transition-colors ${
                  isActive('/blog') ||
                  isActive('/research') ||
                  isActive('/community') ||
                  activeDropdown === 'research'
                    ? 'text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
                aria-expanded={activeDropdown === 'research'}
              >
                <span>{isBengali ? 'রিসার্চ ও কমিউনিটি' : 'Research & Community'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {activeDropdown === 'research' && (
                <div className="absolute right-0 mt-1.5 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-dropdown p-1.5 z-50">
                  <Link
                    to="/blog"
                    className="block px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800/70 transition"
                  >
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{t('navigation.editorialGuides')}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      100+ comprehensive long-form admissions roadmaps
                    </p>
                  </Link>
                  <Link
                    to="/research"
                    className="block px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800/70 transition border-t border-slate-100 dark:border-slate-800"
                  >
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{t('navigation.researchLibrary')}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Peer-reviewed academic research with registered DOIs
                    </p>
                  </Link>
                  <Link
                    to="/community"
                    className="block px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800/70 transition border-t border-slate-100 dark:border-slate-800"
                  >
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Student Community Forum</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Peer discussions, visa experiences &amp; verification
                    </p>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Utility & Authentication Area */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Quick Compare */}
            <Link
              to="/compare"
              className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative transition"
              title={t('navigation.compareItems')}
              aria-label={t('navigation.compareItems')}
            >
              <Scale className="w-4 h-4" />
              {compareSlugs.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-teal-700 text-white text-[10px] font-bold flex items-center justify-center">
                  {compareSlugs.length}
                </span>
              )}
            </Link>

            {/* Saved Bookmarks */}
            <Link
              to="/saved"
              className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative transition"
              title={t('navigation.savedItems')}
              aria-label={t('navigation.savedItems')}
            >
              <Bookmark className="w-4 h-4" />
              {totalSaved > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-teal-700 text-white text-[10px] font-bold flex items-center justify-center">
                  {totalSaved}
                </span>
              )}
            </Link>

            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold transition"
                aria-label={`Language: ${language === 'en' ? 'English' : 'বাংলা'}`}
                title="Select language / ভাষা নির্বাচন"
              >
                <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span className="hidden sm:inline">{language === 'en' ? 'EN' : 'বাং'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-dropdown p-1 z-50">
                  <button
                    type="button"
                    onClick={() => { setLanguage('en'); setLangMenuOpen(false); }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      language === 'en'
                        ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLanguage('bn'); setLangMenuOpen(false); }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition font-bengali ${
                      language === 'bn'
                        ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>বাংলা</span>
                    {language === 'bn' && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              aria-label={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
              title={isDark ? t('navigation.lightMode') : t('navigation.darkMode')}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Authentication Portal Action */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-[#0B192C] dark:bg-teal-900 text-white flex items-center justify-center text-xs font-bold">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <span className="hidden md:inline max-w-[90px] truncate">{user.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-dropdown p-1.5 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
                      <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {user.role}
                      </span>
                    </div>

                    {isAdmin || isSuperAdmin ? (
                      <>
                        <Link
                          to="/super-admin/dashboard"
                          className="block px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
                        >
                          {t('navigation.superAdminDashboard')}
                        </Link>
                        <Link
                          to="/super-admin/dashboard?tab=career-toolkit"
                          className="block px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-teal-800 dark:text-teal-400 font-semibold"
                        >
                          Career Toolkit Governance
                        </Link>
                        <Link
                          to="/super-admin/dashboard?tab=content"
                          className="block px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
                        >
                          {t('navigation.contentStudio')}
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/student/dashboard"
                        className="block px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
                      >
                        {t('navigation.studentDashboard')}
                      </Link>
                    )}

                    <Link
                      to="/planner"
                      className="block px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
                      {t('navigation.applicationPlanner')}
                    </Link>

                    <button
                      type="button"
                      onClick={logout}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border-t border-slate-100 dark:border-slate-800 mt-1 flex items-center gap-1.5 font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      {t('navigation.signOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  to="/student/login"
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-navy dark:bg-teal-700 hover:bg-slate-800 dark:hover:bg-teal-600 transition shadow-2xs flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-teal-400 hidden sm:inline" />
                  <span>{t('navigation.studentSignIn')}</span>
                </Link>
                <Link
                  to="/super-admin/login"
                  className="hidden md:inline-flex px-2 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition"
                  title={t('navigation.superAdminPortal')}
                >
                  Admin
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition min-w-[38px] min-h-[38px] flex items-center justify-center"
              aria-label={t('navigation.menu')}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-white dark:bg-[#0B132B] border-t border-slate-200 dark:border-slate-800 overflow-y-auto z-40 p-5 space-y-6 transition-colors">
          {/* Quick Mobile Language & Theme Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t('navigation.language')}:</span>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded text-xs font-bold ${
                  language === 'en'
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`px-2.5 py-1 rounded text-xs font-bold font-bengali ${
                  language === 'bn'
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                বাংলা
              </button>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
              <span>{isDark ? t('navigation.lightMode') : t('navigation.darkMode')}</span>
            </button>
          </div>

          {/* User Sign In Actions on Mobile */}
          {!isAuthenticated && (
            <div className="grid grid-cols-2 gap-3 pb-2">
              <Link
                to="/student/login"
                className="w-full py-2.5 px-3 rounded-lg bg-[#0B192C] text-white text-xs font-semibold text-center hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-teal-400" />
                <span>{t('navigation.studentSignIn')}</span>
              </Link>
              <Link
                to="/super-admin/login"
                className="w-full py-2.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                <span>Super Admin</span>
              </Link>
            </div>
          )}

          {/* Section 1: Directory */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Institution &amp; Degree Discovery
            </h4>
            <div className="space-y-1">
              <Link
                to="/universities"
                className="flex items-center justify-between p-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span>{t('navigation.universities')} (940+)</span>
              </Link>
              <Link
                to="/courses"
                className="flex items-center justify-between p-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span>{t('navigation.programs')}</span>
              </Link>
              <Link
                to="/countries"
                className="flex items-center justify-between p-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span>{t('navigation.countries')} (42)</span>
              </Link>
              <Link
                to="/scholarships"
                className="flex items-center justify-between p-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span>{t('navigation.scholarships')} (20 Verified)</span>
              </Link>
            </div>
          </div>

          {/* Section 2: Admissions & Funding */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Admissions, Criteria &amp; Funding
            </h4>
            <div className="space-y-1">
              <Link
                to="/eligibility-checker"
                className="flex items-center justify-between p-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span>{t('navigation.academicEligibilityChecker')}</span>
              </Link>
              <Link
                to="/academic-requirements"
                className="flex items-center justify-between p-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span>{t('navigation.academicThresholds')}</span>
              </Link>
              <Link
                to="/english-tests"
                className="flex items-center justify-between p-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span>{t('navigation.englishTests')}</span>
              </Link>
              <Link
                to="/english-checker"
                className="flex items-center justify-between p-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span>English Eligibility Checker</span>
              </Link>
              <Link
                to="/career-toolkit"
                className="flex items-center justify-between p-2 rounded-lg text-sm font-semibold text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40"
              >
                <span>CV &amp; Career Toolkit (Europass)</span>
              </Link>
              <Link
                to="/country-work-guide"
                className="flex items-center justify-between p-2 rounded-lg text-sm font-semibold text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40"
              >
                <span>{t('navigation.countryWorkGuide')} (Wages &amp; Rules)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                  New
                </span>
              </Link>
            </div>
          </div>

          {/* Section 3: Tools & Intelligence */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Tools &amp; Visa Intelligence
            </h4>
            <div className="space-y-1">
              <Link
                to="/calculator"
                className="flex items-center justify-between p-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span>{t('navigation.tuitionCalculator')} (BDT)</span>
              </Link>
              <Link
                to="/advisor"
                className="flex items-center justify-between p-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span className="flex items-center gap-1.5">
                  <span>AI Study Advisor</span>
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                </span>
              </Link>
              <Link
                to="/visa-intelligence"
                className="flex items-center justify-between p-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span>{t('navigation.liveVisaIntel')}</span>
              </Link>
              <Link
                to="/visa-application-centres"
                className="flex items-center justify-between p-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span>{t('navigation.applicationCentres')}</span>
              </Link>
              <Link
                to="/community"
                className="flex items-center justify-between p-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span>Student Community Forum</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
