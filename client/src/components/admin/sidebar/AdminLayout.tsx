import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar.js';
import { AdminHeader } from './AdminHeader.js';
import { MobileSidebarDrawer } from './MobileSidebarDrawer.js';
import { findActiveNavItem, AdminNavItem } from './adminNavConfig.js';
import { useAuth } from '../../../context/AuthContext.js';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onSelectTab: (tab: string) => void;
  badgeCounts: {
    applications?: number;
    pendingPosts?: number;
    docQueue?: number;
  };
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab = 'overview',
  onSelectTab,
  badgeCounts,
}) => {
  const location = useLocation();
  const { user } = useAuth();
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);

  // Persistence for collapsed state in localStorage
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('borno_admin_sidebar_collapsed');
    if (saved !== null) {
      return saved === 'true';
    }
    // Default to collapsed rail on medium screens (768px-1279px), expanded on large screens (>=1280px)
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1280;
    }
    return false;
  });

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Toggle and save collapsed state
  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('borno_admin_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Keyboard shortcut: Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleToggleCollapse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Determine active item and group
  const activeMatch = findActiveNavItem(activeTab, location.pathname);
  const activeItemId = activeMatch?.item.id || activeTab;

  const handleSelectItem = (item: AdminNavItem) => {
    if (item.tab) {
      onSelectTab(item.tab);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden flex bg-slate-50 dark:bg-slate-950 font-sans transition-colors">
      {/* 1. Desktop Collapsible Sidebar (Hidden below 768px) */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        activeItemId={activeItemId}
        userRole={user?.role}
        badgeCounts={badgeCounts}
        onSelectItem={handleSelectItem}
        className="hidden md:flex"
      />

      {/* 2. Mobile Off-Canvas Drawer (< 768px) */}
      <MobileSidebarDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        activeItemId={activeItemId}
        userRole={user?.role}
        badgeCounts={badgeCounts}
        onSelectItem={handleSelectItem}
        triggerButtonRef={triggerButtonRef}
      />

      {/* 3. Main Application Shell */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <AdminHeader
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
          activeGroup={activeMatch?.group}
          activeItem={activeMatch?.item}
          badgeCounts={badgeCounts}
          onSelectTab={onSelectTab}
        />

        {/* Scrollable Main Content Area */}
        <main
          id="admin-main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto min-w-0 p-4 sm:p-6 lg:p-8 focus:outline-hidden"
        >
          <div className="max-w-7xl mx-auto min-w-0 space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
