import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  Sun,
  Moon,
  Globe,
  Check,
  ChevronDown,
  User,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Users,
  PenSquare,
  FileLock2,
} from 'lucide-react';
import { AdminBreadcrumbs } from './AdminBreadcrumbs.js';
import { AdminNavGroup, AdminNavItem } from './adminNavConfig.js';
import { useAuth } from '../../../context/AuthContext.js';
import { useLanguage } from '../../../context/LanguageContext.js';
import { useTheme } from '../../../context/ThemeContext.js';

interface AdminHeaderProps {
  onOpenMobileDrawer: () => void;
  activeGroup?: AdminNavGroup;
  activeItem?: AdminNavItem;
  badgeCounts: {
    applications?: number;
    pendingPosts?: number;
    docQueue?: number;
  };
  onSelectTab: (tab: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenMobileDrawer,
  activeGroup,
  activeItem,
  badgeCounts,
  onSelectTab,
}) => {
  const { user, logout, isSuperAdmin } = useAuth();
  const { language, setLanguage, isBengali } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();

  // Dropdown states
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalPending =
    (badgeCounts.applications || 0) +
    (badgeCounts.pendingPosts || 0) +
    (isSuperAdmin ? badgeCounts.docQueue || 0 : 0);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';

  return (
    <header className="h-16 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0 transition-colors z-20">
      {/* Left: Mobile Hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileDrawer}
          aria-label="Open navigation menu"
          className="md:hidden p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <AdminBreadcrumbs activeGroup={activeGroup} activeItem={activeItem} />
          {activeItem && (
            <h1 className="text-sm sm:text-base font-heading font-bold text-slate-900 dark:text-white truncate leading-tight mt-0.5">
              {isBengali && activeItem.labelBn ? activeItem.labelBn : activeItem.label}
            </h1>
          )}
        </div>
      </div>

      {/* Right: Controls & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* 1. Language Toggle */}
        <div className="relative" ref={langRef}>
          <button
            type="button"
            onClick={() => setLangOpen(!langOpen)}
            aria-label="Select language"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-colors focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          >
            <Globe className="w-3.5 h-3.5 text-teal-800 dark:text-teal-400" />
            <span>{language === 'bn' ? 'বাংলা' : 'EN'}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {langOpen && (
            <div className="absolute right-0 mt-1 w-32 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-50 text-xs">
              <button
                type="button"
                onClick={() => {
                  setLanguage('en');
                  setLangOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors ${
                  language === 'en' ? 'font-bold text-teal-800 dark:text-teal-400' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                <span>English</span>
                {language === 'en' && <Check className="w-3.5 h-3.5 text-teal-800" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLanguage('bn');
                  setLangOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors ${
                  language === 'bn' ? 'font-bold text-teal-800 dark:text-teal-400' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                <span>বাংলা</span>
                {language === 'bn' && <Check className="w-3.5 h-3.5 text-teal-800" />}
              </button>
            </div>
          )}
        </div>

        {/* 2. Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-colors focus:outline-hidden focus:ring-2 focus:ring-teal-500"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* 3. Action Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label={`Pending review notifications: ${totalPending}`}
            className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-colors focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          >
            <Bell className="w-4 h-4" />
            {totalPending > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-xs">
                {totalPending}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white">
                  {isBengali ? 'পর্যালোচনা কিউ' : 'Pending Review Queues'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                  {totalPending} Total
                </span>
              </div>

              <div className="py-2 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('contributors');
                    setNotificationsOpen(false);
                  }}
                  className="w-full p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-800 dark:text-teal-400" />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {isBengali ? 'কন্ট্রিবিউটর আবেদন' : 'Contributor Applications'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {isBengali ? 'যাচাইকৃত শিক্ষার্থী প্রোফাইল' : 'Verified student profiles'}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px]">
                    {badgeCounts.applications || 0}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('posts');
                    setNotificationsOpen(false);
                  }}
                  className="w-full p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <PenSquare className="w-4 h-4 text-teal-800 dark:text-teal-400" />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {isBengali ? 'কমিউনিটি মডারেশন' : 'Community Discussions'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {isBengali ? 'অপেক্ষমাণ প্রশ্ন ও পোস্ট' : 'Pending student questions'}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px]">
                    {badgeCounts.pendingPosts || 0}
                  </span>
                </button>

                {isSuperAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab('documents');
                      setNotificationsOpen(false);
                    }}
                    className="w-full p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-between text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileLock2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {isBengali ? 'আর্থিক নথি যাচাই' : 'Financial Documents'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {isBengali ? 'ব্যাংক স্টেটমেন্ট ও সনদ' : 'Confidential solvency files'}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px]">
                      {badgeCounts.docQueue || 0}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 4. User Workspace Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-label="User account menu"
            className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          >
            <div className="w-8 h-8 rounded-full bg-teal-800 dark:bg-teal-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              {userInitial}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[10px] font-medium text-teal-800 dark:text-teal-400 tracking-wider uppercase">
                {user?.role || 'SUPER_ADMIN'}
              </span>
            </div>
            <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                <p className="font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <Link
                to="/"
                onClick={() => setProfileOpen(false)}
                className="w-full px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span>{isBengali ? 'মূল ওয়েবসাইট দেখুন' : 'View Public Website'}</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                }}
                className="w-full px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 text-rose-600 dark:text-rose-400 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isBengali ? 'লগআউট' : 'Sign Out'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
