import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminNavItem } from './adminNavConfig.js';
import { useLanguage } from '../../../context/LanguageContext.js';

interface AdminNavigationItemProps {
  item: AdminNavItem;
  isActive: boolean;
  isCollapsed: boolean;
  badgeCount?: number;
  onSelect: (item: AdminNavItem) => void;
}

export const AdminNavigationItem: React.FC<AdminNavigationItemProps> = ({
  item,
  isActive,
  isCollapsed,
  badgeCount,
  onSelect,
}) => {
  const { isBengali } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(false);
  const Icon = item.icon;
  const label = isBengali && item.labelBn ? item.labelBn : item.label;

  const content = (
    <>
      <Icon
        className={`w-4 h-4 shrink-0 transition-colors ${
          isActive
            ? 'text-teal-800 dark:text-teal-400'
            : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
        }`}
      />

      {!isCollapsed && (
        <span className="truncate flex-1 text-left text-xs tracking-tight">
          {label}
        </span>
      )}

      {!isCollapsed && badgeCount !== undefined && badgeCount > 0 && (
        <span
          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
            isActive
              ? 'bg-teal-200/80 dark:bg-teal-800 text-teal-900 dark:text-teal-100'
              : 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300'
          }`}
        >
          {badgeCount}
        </span>
      )}

      {isCollapsed && badgeCount !== undefined && badgeCount > 0 && (
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
      )}

      {/* Flyout Tooltip when sidebar is collapsed */}
      {isCollapsed && showTooltip && (
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="bg-slate-900 dark:bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl border border-slate-700/60 whitespace-nowrap flex items-center gap-2">
            <span className="font-semibold">{label}</span>
            {badgeCount !== undefined && badgeCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                {badgeCount}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );

  const activeClasses = isActive
    ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 border-l-[3px] border-teal-600 dark:border-teal-400 font-semibold shadow-2xs'
    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50 border-l-[3px] border-transparent font-medium';

  const baseClasses = `relative group flex items-center gap-2.5 px-3 py-2 rounded-r-lg text-xs transition-all duration-150 focus:outline-hidden focus:ring-2 focus:ring-teal-500 ${
    isCollapsed ? 'justify-center px-0 py-2.5 rounded-lg border-l-0' : ''
  } ${activeClasses}`;

  if (item.href) {
    return (
      <Link
        to={item.href}
        onClick={() => onSelect(item)}
        aria-current={isActive ? 'page' : undefined}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={baseClasses}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      aria-current={isActive ? 'page' : undefined}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={`w-full ${baseClasses}`}
    >
      {content}
    </button>
  );
};
