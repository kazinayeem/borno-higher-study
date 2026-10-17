import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { SidebarCollapseButton } from './SidebarCollapseButton.js';

interface AdminSidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  userRole?: string;
}

export const AdminSidebarHeader: React.FC<AdminSidebarHeaderProps> = ({
  isCollapsed,
  onToggleCollapse,
  userRole = 'SUPER_ADMIN',
}) => {
  return (
    <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900 transition-colors">
      {!isCollapsed ? (
        <>
          <Link
            to="/super-admin/dashboard"
            className="flex items-center gap-2.5 min-w-0 group focus:outline-hidden focus:ring-2 focus:ring-teal-500 rounded-lg p-1"
          >
            {/* Brand emblem */}
            <div className="w-8 h-8 rounded-lg bg-teal-800 dark:bg-teal-700 flex items-center justify-center text-white font-heading font-black text-lg shrink-0 shadow-xs">
              ব
            </div>
            <div className="min-w-0 flex flex-col">
              <span className="font-heading font-bold text-sm tracking-tight text-slate-900 dark:text-white truncate">
                Borno Higher Study
              </span>
              <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-800 dark:text-teal-400">
                <ShieldCheck className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                <span className="tracking-wider uppercase">{userRole.replace('_', ' ')}</span>
              </div>
            </div>
          </Link>

          <SidebarCollapseButton
            isCollapsed={isCollapsed}
            onToggle={onToggleCollapse}
          />
        </>
      ) : (
        <div className="w-full flex flex-col items-center gap-2">
          <Link
            to="/super-admin/dashboard"
            aria-label="Borno Higher Study Super Admin Console"
            className="w-8 h-8 rounded-lg bg-teal-800 dark:bg-teal-700 flex items-center justify-center text-white font-heading font-black text-lg shrink-0 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          >
            ব
          </Link>
          <SidebarCollapseButton
            isCollapsed={isCollapsed}
            onToggle={onToggleCollapse}
          />
        </div>
      )}
    </div>
  );
};
