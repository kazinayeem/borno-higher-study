import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminNavGroup, AdminNavItem } from './adminNavConfig.js';
import { useLanguage } from '../../../context/LanguageContext.js';

interface AdminBreadcrumbsProps {
  activeGroup?: AdminNavGroup;
  activeItem?: AdminNavItem;
}

export const AdminBreadcrumbs: React.FC<AdminBreadcrumbsProps> = ({
  activeGroup,
  activeItem,
}) => {
  const { isBengali } = useLanguage();

  const groupTitle = activeGroup
    ? isBengali && activeGroup.titleBn
      ? activeGroup.titleBn
      : activeGroup.title
    : '';

  const itemLabel = activeItem
    ? isBengali && activeItem.labelBn
      ? activeItem.labelBn
      : activeItem.label
    : '';

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-slate-500 dark:text-slate-400">
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li>
          <Link
            to="/super-admin/dashboard"
            className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">{isBengali ? 'কনসোল' : 'Control Center'}</span>
          </Link>
        </li>

        {activeGroup && (
          <>
            <li aria-hidden="true">
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </li>
            <li>
              <span className="font-medium text-slate-600 dark:text-slate-400">
                {groupTitle}
              </span>
            </li>
          </>
        )}

        {activeItem && (
          <>
            <li aria-hidden="true">
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </li>
            <li>
              <span className="font-semibold text-teal-800 dark:text-teal-400" aria-current="page">
                {itemLabel}
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};
