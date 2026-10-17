import React, { useState } from 'react';
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
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { savedUniversityIds, savedScholarshipIds } = useSaved();
  const { compareSlugs } = useCompare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const totalSaved = savedUniversityIds.length + savedScholarshipIds.length;

  const navLinks = [
    { name: 'Countries', path: '/countries', icon: Globe },
    { name: 'Universities', path: '/universities', icon: GraduationCap },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Scholarships', path: '/scholarships', icon: Award },
    { name: 'Tuition Calculator', path: '/calculator', icon: Calculator },
    { name: 'AI Study Advisor', path: '/advisor', icon: Sparkles, highlight: true },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    link.highlight
                      ? 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200/60'
                      : active
                      ? 'text-teal-700 bg-teal-50/50 font-bold'
                      : 'text-slate-600 hover:text-brand-navy hover:bg-slate-100/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${link.highlight ? 'text-teal-600' : ''}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Tools & User Profile */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Compare Tray */}
            <Link
              to="/compare"
              className="relative p-2 rounded-full text-slate-600 hover:text-brand-navy hover:bg-slate-100 transition-colors"
              title="Compare Universities"
            >
              <Scale className="w-4 h-4" />
              {compareSlugs.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {compareSlugs.length}
                </span>
              )}
            </Link>

            {/* Saved Bookmarks */}
            <Link
              to="/saved"
              className="relative p-2 rounded-full text-slate-600 hover:text-brand-navy hover:bg-slate-100 transition-colors"
              title="Saved Items"
            >
              <Bookmark className="w-4 h-4" />
              {totalSaved > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {totalSaved}
                </span>
              )}
            </Link>

            {/* Authentication Buttons / Profile */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800 leading-none">{user.name}</p>
                    <p className="text-slate-500 text-[9px] uppercase font-bold mt-0.5">{user.role}</p>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
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
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium"
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
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-brand-navy rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/universities"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-brand-navy hover:bg-brand-navy-light rounded-xl shadow-xs transition-colors"
                >
                  Explore Universities
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/compare"
              className="relative p-2 text-slate-600 hover:text-brand-navy"
            >
              <Scale className="w-5 h-5" />
              {compareSlugs.length > 0 && (
                <span className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareSlugs.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                    link.highlight
                      ? 'bg-teal-50 text-teal-800'
                      : isActive(link.path)
                      ? 'bg-slate-100 text-teal-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5 text-teal-600" />
                  {link.name}
                </Link>
              );
            })}
            <Link
              to="/saved"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              <Bookmark className="w-5 h-5 text-teal-600" />
              Saved Items ({totalSaved})
            </Link>
            <Link
              to="/planner"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              <Calendar className="w-5 h-5 text-teal-600" />
              Application Planner
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg text-sm font-semibold bg-slate-100 text-slate-800"
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
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 rounded-lg text-sm font-semibold text-rose-600 bg-rose-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/universities"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-bold bg-brand-navy text-white shadow-xs"
                >
                  Explore Universities
                </Link>
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100"
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
