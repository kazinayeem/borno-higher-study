import React from 'react';
import { ADMIN_NAV_GROUPS, AdminNavItem } from './adminNavConfig.js';
import { AdminSidebarHeader } from './AdminSidebarHeader.js';
import { AdminNavigationGroup } from './AdminNavigationGroup.js';
import { AdminSidebarFooter } from './AdminSidebarFooter.js';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeItemId: string;
  userRole?: string;
  badgeCounts: {
    applications?: number;
    pendingPosts?: number;
    docQueue?: number;
  };
  onSelectItem: (item: AdminNavItem) => void;
  className?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  activeItemId,
  userRole,
  badgeCounts,
  onSelectItem,
  className = '',
}) => {
  return (
    <aside
      aria-label="Admin Navigation Sidebar"
      className={`h-screen flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 ease-in-out select-none shrink-0 ${
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      } ${className}`}
    >
      {/* 1. Header with branding and collapse button */}
      <AdminSidebarHeader
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
        userRole={userRole}
      />

      {/* 2. Scrollable navigation body */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {ADMIN_NAV_GROUPS.map((group) => (
          <AdminNavigationGroup
            key={group.id}
            group={group}
            activeItemId={activeItemId}
            isCollapsed={isCollapsed}
            userRole={userRole}
            badgeCounts={badgeCounts}
            onSelectItem={onSelectItem}
          />
        ))}
      </nav>

      {/* 3. Footer with pinned user profile and exit */}
      <AdminSidebarFooter isCollapsed={isCollapsed} />
    </aside>
  );
};
