import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { AdminNavGroup, AdminNavItem } from './adminNavConfig.js';
import { AdminNavigationItem } from './AdminNavigationItem.js';
import { useLanguage } from '../../../context/LanguageContext.js';

interface AdminNavigationGroupProps {
  group: AdminNavGroup;
  activeItemId: string;
  isCollapsed: boolean;
  userRole?: string;
  badgeCounts: {
    applications?: number;
    pendingPosts?: number;
    docQueue?: number;
  };
  onSelectItem: (item: AdminNavItem) => void;
}

export const AdminNavigationGroup: React.FC<AdminNavigationGroupProps> = ({
  group,
  activeItemId,
  isCollapsed,
  userRole,
  badgeCounts,
  onSelectItem,
}) => {
  const { isBengali } = useLanguage();
  const hasActiveChild = group.items.some((item) => item.id === activeItemId);

  // Group expansion state
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    return hasActiveChild || group.defaultExpanded !== false;
  });

  // Auto-expand group if an item inside it becomes active
  useEffect(() => {
    if (hasActiveChild) {
      setIsExpanded(true);
    }
  }, [hasActiveChild]);

  // Filter items based on user role permissions
  const visibleItems = group.items.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    if (!userRole) return false;
    return item.roles.includes(userRole as any);
  });

  if (visibleItems.length === 0) return null;

  // Filter group based on role permission
  if (group.roles && group.roles.length > 0) {
    if (!userRole || !group.roles.includes(userRole as any)) {
      return null;
    }
  }

  const title = isBengali && group.titleBn ? group.titleBn : group.title;

  return (
    <div className="py-1">
      {/* Group Header (only when sidebar is expanded) */}
      {!isCollapsed && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors focus:outline-hidden focus:ring-1 focus:ring-teal-500 rounded-sm"
        >
          <span className="truncate">{title}</span>
          <span className="p-0.5 text-slate-400">
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </span>
        </button>
      )}

      {/* Divider when collapsed */}
      {isCollapsed && (
        <div className="my-2 border-t border-slate-200/60 dark:border-slate-800" />
      )}

      {/* Group Items */}
      {(isExpanded || isCollapsed) && (
        <div className="space-y-0.5">
          {visibleItems.map((item) => {
            const count = item.badgeKey ? badgeCounts[item.badgeKey] : undefined;
            const isActive = item.id === activeItemId;

            return (
              <AdminNavigationItem
                key={item.id}
                item={item}
                isActive={isActive}
                isCollapsed={isCollapsed}
                badgeCount={count}
                onSelect={onSelectItem}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
