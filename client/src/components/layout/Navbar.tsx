import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../common/Logo.js';
import { useAuth } from '../../context/AuthContext.js';
import { useSaved } from '../../context/SavedContext.js';
import { useCompare } from '../../context/CompareContext.js';
import {
  Globe,
  GraduationCap,
  BookOpen,
  Award,
  Calculator,
  CheckCircle2,
  Sparkles,
  Bookmark,
  Scale,
  Menu,
  X,
  User,
  Shield,
  LogOut,
  Calendar,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { savedUniversityIds, savedScholarshipIds } = useSaved();
  const { compareSlugs } = useCompare();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  const totalSaved = savedUniversityIds.length + savedScholarshipIds.length;

  // Handle scroll state for subtle shadow and depth
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setToolsDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdowns on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
        setToolsDropdownOpen(false);
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

  const isActive = (path: string) => location.pathname === path;

  // Core navigation items
  const primaryLinks = [
    { name: 'Countries', path: '/countries', icon: Globe },
    { name: 'Universities', path: '/universities', icon: GraduationCap },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Scholarships', path: '/scholarships', icon: Award },
  ];

  // Expanded tool items
  const toolLinks = [
    {
      name: 'Cost Calculator',
      path: '/calculator',
      icon: Calculator,
      desc: 'Tuition & living expenses in BDT',
    },
    {
      name: 'English Checker',
      path: '/english-checker',
      icon: CheckCircle2,
      desc: 'IELTS, TOEFL & PTE eligibility',
    },
    {
      name: 'University Compare',
      path: '/compare',
      icon: Scale,
      desc: 'Side-by-side institution analysis',
    },
    {
      name: 'Application Planner',
      path: '/planner',
      icon: Calendar,
      desc: 'Study abroad checklist & timeline',
    },
  ];

  const isToolsActive =
    isActive('/calculator') ||
    isActive('/english-checker') ||
    isActive('/compare') ||
    isActive('/planner');

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md transition-all duration-200 ${
        isScrolled
          ? 'border-b border-slate-200/90 shadow-xs bg-white/98'
          : 'border-b border-slate-200/70 bg-white/90'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* 1. Brand Logo */}
          <div className="flex items-center shrink-0">
            <Logo />
          </div>

          {/* 2. Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 2xl:gap-2">
            {/* Primary Discovery Links */}
            {primaryLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold transition-colors whitespace-nowrap ${
                    active
                      ? 'text-teal-700 bg-teal-50 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-teal-600' : 'text-slate-400'}`} />
                  {link.name}
                </Link>
              );
            })}

            {/* Direct Tools on Extra Wide Desktop (>= 1360px), Dropdown on Compact Desktop (1024px-1359px) */}
            <div className="hidden 2xl:flex items-center gap-1">
              <Link
                to="/calculator"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold transition-colors whitespace-nowrap ${
                  isActive('/calculator')
                    ? 'text-teal-700 bg-teal-50 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Calculator
                  className={`w-3.5 h-3.5 ${isActive('/calculator') ? 'text-teal-600' : 'text-slate-400'}`}
                />
                Cost Calculator
              </Link>
              <Link
                to="/english-checker"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold transition-colors whitespace-nowrap ${
                  isActive('/english-checker')
                    ? 'text-teal-700 bg-teal-50 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${isActive('/english-checker') ? 'text-teal-600' : 'text-slate-400'}`}
                />
                English Checker
              </Link>
            </div>

            {/* Tools Dropdown for Compact Desktop */}
            <div className="relative 2xl:hidden" ref={toolsMenuRef}>
              <button
                type="button"
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold transition-colors whitespace-nowrap ${
                  isToolsActive || toolsDropdownOpen
                    ? 'text-teal-700 bg-teal-50 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
                aria-expanded={toolsDropdownOpen}
              >
                <span>Tools</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    toolsDropdownOpen ? 'rotate-180 text-teal-600' : 'text-slate-400'
                  }`}
                />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {toolLinks.map((tool) => {
                    const ToolIcon = tool.icon;
                    const active = isActive(tool.path);
                    return (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        onClick={() => setToolsDropdownOpen(false)}
                        className={`flex items-start gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                          active
                            ? 'bg-teal-50 text-teal-800 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <ToolIcon className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">{tool.name}</p>
                          <p className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                            {tool.desc}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* AI Advisor Badge Link */}
            <Link
              to="/advisor"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs xl:text-[13px] font-bold transition-all whitespace-nowrap ${
                isActive('/advisor')
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200/60'
              }`}
            >
              <Sparkles
                className={`w-3.5 h-3.5 ${isActive('/advisor') ? 'text-teal-100' : 'text-teal-600'}`}
              />
              AI Study Advisor
            </Link>
          </nav>

          {/* 3. Action Tools & User Profile */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 shrink-0">
            {/* Compare Tray Button */}
            <Link
              to="/compare"
              className={`relative inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                isActive('/compare')
                  ? 'bg-amber-50 text-amber-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Compare Universities"
              aria-label="Compare Universities"
            >
              <Scale className="w-4 h-4" />
              {compareSlugs.length > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {compareSlugs.length}
                </span>
              )}
            </Link>

            {/* Saved Bookmarks Button */}
            <Link
              to="/saved"
              className={`relative inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                isActive('/saved')
                  ? 'bg-teal-50 text-teal-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Saved Items"
              aria-label="Saved Items"
            >
              <Bookmark className="w-4 h-4" />
              {totalSaved > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {totalSaved}
                </span>
              )}
            </Link>

            {/* Vertical Divider */}
            <div className="w-px h-5 bg-slate-200/80 mx-0.5" />

            {/* User Profile or Sign In / CTA */}
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left focus:outline-hidden"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden xl:block text-xs leading-none">
                    <p className="font-semibold text-slate-800 max-w-[100px] truncate">{user.name}</p>
                    <p className="text-slate-400 text-[9px] uppercase font-bold mt-0.5">{user.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-800 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Student Dashboard
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-teal-700 hover:bg-teal-50 font-medium"
                      >
                        <Shield className="w-3.5 h-3.5 text-teal-600" />
                        Admin Verification
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth"
                  className="h-9 px-3 flex items-center justify-center text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  to="/universities"
                  className="h-9 px-3.5 flex items-center justify-center text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
                >
                  <span className="hidden 2xl:inline">Explore Universities</span>
                  <span className="inline 2xl:hidden">Explore Now</span>
                </Link>
              </div>
            )}
          </div>

          {/* 4. Mobile & Tablet Controls */}
          <div className="flex lg:hidden items-center gap-1 sm:gap-2 shrink-0">
            {/* Compare Quick Access on Tablet */}
            <Link
              to="/compare"
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Compare Universities"
            >
              <Scale className="w-5 h-5" />
              {compareSlugs.length > 0 && (
                <span className="absolute top-1 right-1 min-w-[15px] h-3.5 px-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {compareSlugs.length}
                </span>
              )}
            </Link>

            {/* Saved Quick Access on Tablet */}
            <Link
              to="/saved"
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Saved Bookmarks"
            >
              <Bookmark className="w-5 h-5" />
              {totalSaved > 0 && (
                <span className="absolute top-1 right-1 min-w-[15px] h-3.5 px-0.5 bg-teal-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {totalSaved}
                </span>
              )}
            </Link>

            {/* Hamburger / Close Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Mobile & Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-1 gap-1">
            {/* All Primary Destinations */}
            {primaryLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-teal-50 text-teal-800'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-teal-600' : 'text-slate-400'}`} />
                  {link.name}
                </Link>
              );
            })}

            {/* All Interactive Tools */}
            {toolLinks.map((tool) => {
              const ToolIcon = tool.icon;
              const active = isActive(tool.path);
              return (
                <Link
                  key={tool.path}
                  to={tool.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-teal-50 text-teal-800'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ToolIcon className={`w-5 h-5 ${active ? 'text-teal-600' : 'text-slate-400'}`} />
                    <span>{tool.name}</span>
                  </div>
                  {tool.path === '/compare' && compareSlugs.length > 0 && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {compareSlugs.length}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* AI Study Advisor */}
            <Link
              to="/advisor"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold mt-1 transition-colors ${
                isActive('/advisor')
                  ? 'bg-teal-600 text-white'
                  : 'bg-teal-50 text-teal-800 border border-teal-200/60'
              }`}
            >
              <Sparkles className={`w-5 h-5 ${isActive('/advisor') ? 'text-white' : 'text-teal-600'}`} />
              AI Study Advisor
            </Link>

            {/* Saved Bookmarks */}
            <Link
              to="/saved"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <Bookmark className="w-5 h-5 text-slate-400" />
                <span>Saved Bookmarks</span>
              </div>
              {totalSaved > 0 && (
                <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {totalSaved}
                </span>
              )}
            </Link>
          </div>

          {/* User Auth Section in Mobile Drawer */}
          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg text-sm font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200"
                >
                  Student Dashboard ({user.name})
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg text-sm font-semibold bg-teal-50 text-teal-800 border border-teal-200"
                  >
                    Admin Verification Dashboard
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 rounded-lg text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/universities"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg text-sm font-bold bg-slate-900 text-white shadow-xs hover:bg-slate-800"
                >
                  Explore Universities
                </Link>
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Sign In / Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
