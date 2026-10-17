import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, LogOut, User } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext.js';
import { useLanguage } from '../../../context/LanguageContext.js';

interface AdminSidebarFooterProps {
  isCollapsed: boolean;
}

export const AdminSidebarFooter: React.FC<AdminSidebarFooterProps> = ({ isCollapsed }) => {
  const { user, logout } = useAuth();
  const { isBengali } = useLanguage();

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';

  return (
    <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0 transition-colors">
      {!isCollapsed ? (
        <div className="space-y-3">
          {/* User profile card */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-brand-navy dark:bg-teal-700 text-white font-bold text-xs flex items-center justify-center shrink-0 ring-2 ring-teal-500/20">
              {userInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {user?.email || 'admin@borno.edu'}
              </p>
            </div>
          </div>

          {/* Quick Action Links */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-slate-800 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <Link
              to="/"
              className="inline-flex items-center gap-1 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
              title="Return to public platform"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isBengali ? 'মূল ওয়েবসাইট' : 'Public Site'}</span>
            </Link>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              title="Log out of admin session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isBengali ? 'লগআউট' : 'Logout'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Collapsed mode icons */
        <div className="flex flex-col items-center gap-2">
          <Link
            to="/"
            aria-label="Return to public platform"
            title="Return to public platform"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={logout}
            aria-label="Log out of admin session"
            title="Log out of admin session"
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
