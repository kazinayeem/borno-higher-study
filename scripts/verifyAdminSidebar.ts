import fs from 'fs';
import path from 'path';
import { ADMIN_NAV_GROUPS, findActiveNavItem } from '../client/src/components/admin/sidebar/adminNavConfig.js';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, message: string) {
  results.push({ name, passed: condition, message });
  if (condition) {
    console.log(`✅ PASS - ${name} (${message})`);
  } else {
    console.error(`❌ FAIL - ${name} (${message})`);
  }
}

async function runAdminSidebarVerification() {
  console.log('========================================================================');
  console.log('🛡️ BORNO HIGHER STUDY: SUPER ADMIN SIDEBAR SYSTEM TEST SUITE');
  console.log('========================================================================\n');

  try {
    const rootDir = process.cwd();
    const clientDir = path.join(rootDir, 'client/src');
    const sidebarDir = path.join(clientDir, 'components/admin/sidebar');

    // --------------------------------------------------------------------
    // 1. Sidebar Component Files Existence
    // --------------------------------------------------------------------
    const requiredFiles = [
      'adminNavConfig.ts',
      'SidebarCollapseButton.tsx',
      'AdminSidebarHeader.tsx',
      'AdminNavigationItem.tsx',
      'AdminNavigationGroup.tsx',
      'AdminSidebarFooter.tsx',
      'AdminSidebar.tsx',
      'AdminBreadcrumbs.tsx',
      'AdminHeader.tsx',
      'MobileSidebarDrawer.tsx',
      'AdminLayout.tsx',
      'index.ts',
    ];

    let allFilesExist = true;
    for (const file of requiredFiles) {
      if (!fs.existsSync(path.join(sidebarDir, file))) {
        allFilesExist = false;
        console.error(`Missing sidebar file: ${file}`);
      }
    }
    assert(allFilesExist, '1. Sidebar Component Files', 'All 12 sidebar components exist in client/src/components/admin/sidebar');

    // --------------------------------------------------------------------
    // 2. Information Architecture Groups Verification
    // --------------------------------------------------------------------
    const expectedGroupIds = [
      'main',
      'content_publishing',
      'education_data',
      'immigration_research',
      'people_access',
      'documents_finance',
      'system_pipelines',
    ];

    const actualGroupIds = ADMIN_NAV_GROUPS.map((g) => g.id);
    const allGroupsPresent = expectedGroupIds.every((id) => actualGroupIds.includes(id));
    assert(allGroupsPresent, '2.1 Information Architecture Groups', `All 7 standard groups defined (${actualGroupIds.join(', ')})`);

    // Verify 16 modules are mapped
    const allNavItems = ADMIN_NAV_GROUPS.flatMap((g) => g.items);
    assert(allNavItems.length === 16, '2.2 Total Navigation Modules', `All 16 admin modules configured (Found: ${allNavItems.length})`);

    // --------------------------------------------------------------------
    // 3. Mapping of all 15 Previous Horizontal Tabs & Ingestion Pipeline
    // --------------------------------------------------------------------
    const previousTabs = [
      'overview',
      'content',
      'link-health',
      'career-toolkit',
      'work-guide',
      'academic',
      'coverage',
      'visa',
      'english-tests',
      'moi',
      'reports',
      'deadlines',
      'contributors',
      'posts',
      'documents',
    ];

    const mappedTabs = allNavItems.filter((i) => i.tab).map((i) => i.tab as string);
    const allPreviousTabsCovered = previousTabs.every((tab) => mappedTabs.includes(tab));
    assert(allPreviousTabsCovered, '3.1 Complete Tab Preservation', 'All 15 horizontal tabs mapped into sidebar without deletion');

    const csvPipelineItem = allNavItems.find((i) => i.href === '/admin/verification');
    assert(!!csvPipelineItem, '3.2 CSV Ingestion Pipeline Mapped', 'CSV & Ingestion Pipeline linked to /admin/verification');

    // --------------------------------------------------------------------
    // 4. Role-Based Permissions Check (Super Admin vs Admin)
    // --------------------------------------------------------------------
    const financialDocsItem = allNavItems.find((i) => i.id === 'documents');
    assert(
      financialDocsItem?.roles?.includes('SUPER_ADMIN') && !financialDocsItem?.roles?.includes('ADMIN'),
      '4.1 Financial Documents Restriction',
      'Financial documents queue strictly restricted to SUPER_ADMIN'
    );

    const docGroup = ADMIN_NAV_GROUPS.find((g) => g.id === 'documents_finance');
    assert(
      docGroup?.roles?.includes('SUPER_ADMIN') && !docGroup?.roles?.includes('ADMIN'),
      '4.2 Financial Documents Group Restriction',
      'Documents & Finance group strictly restricted to SUPER_ADMIN'
    );

    // --------------------------------------------------------------------
    // 5. Active Nav Item Resolution Helper
    // --------------------------------------------------------------------
    const matchOverview = findActiveNavItem('overview', '/super-admin/dashboard');
    assert(matchOverview?.item.id === 'overview' && matchOverview?.group.id === 'main', '5.1 Match Overview Tab', 'Resolves overview tab to main group');

    const matchAcademic = findActiveNavItem('academic', '/super-admin/dashboard');
    assert(matchAcademic?.item.id === 'academic' && matchAcademic?.group.id === 'education_data', '5.2 Match Academic Tab', 'Resolves academic tab to education_data group');

    const matchVerification = findActiveNavItem(null, '/admin/verification');
    assert(matchVerification?.item.id === 'verification' && matchVerification?.group.id === 'system_pipelines', '5.3 Match Direct Route', 'Resolves /admin/verification to system_pipelines group');

    // --------------------------------------------------------------------
    // 6. Bilingual Support & Authentic Bengali Unicode
    // --------------------------------------------------------------------
    let allItemsHaveBengali = true;
    for (const item of allNavItems) {
      if (!item.labelBn || !item.descriptionBn) {
        allItemsHaveBengali = false;
        console.error(`Item missing Bengali translation: ${item.id}`);
      }
    }
    assert(allItemsHaveBengali, '6.1 Bilingual Item Labels & Descriptions', 'All 16 navigation items contain authentic Bengali labels and descriptions');

    const allGroupsHaveBengali = ADMIN_NAV_GROUPS.every((g) => !!g.titleBn);
    assert(allGroupsHaveBengali, '6.2 Bilingual Group Titles', 'All 7 navigation groups contain authentic Bengali titles');

    // --------------------------------------------------------------------
    // 7. AdminDashboardPage Layout & Tab Bar Removal
    // --------------------------------------------------------------------
    const dashboardPagePath = path.join(clientDir, 'pages/AdminDashboardPage.tsx');
    const dashboardContent = fs.readFileSync(dashboardPagePath, 'utf8');

    assert(dashboardContent.includes('<AdminLayout'), '7.1 AdminLayout Integration', 'AdminDashboardPage wrapped inside AdminLayout');
    assert(!dashboardContent.includes('className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200"'), '7.2 Horizontal Tabs Removed', 'Old overflowing horizontal tabs bar successfully removed');

    // --------------------------------------------------------------------
    // 8. AdminVerificationPage Layout
    // --------------------------------------------------------------------
    const verificationPagePath = path.join(clientDir, 'pages/AdminVerificationPage.tsx');
    const verificationContent = fs.readFileSync(verificationPagePath, 'utf8');

    assert(verificationContent.includes('<AdminLayout'), '8.1 Verification Page AdminLayout Integration', 'AdminVerificationPage wrapped inside AdminLayout');

    // --------------------------------------------------------------------
    // 9. Navbar & Footer Clean Exclusion
    // --------------------------------------------------------------------
    const navbarPath = path.join(clientDir, 'components/layout/Navbar.tsx');
    const navbarContent = fs.readFileSync(navbarPath, 'utf8');
    assert(navbarContent.includes('isAdminDashboard') && navbarContent.includes('return null;'), '9.1 Consumer Navbar Exclusion', 'Public Navbar excludes dedicated admin dashboard routes');

    const footerPath = path.join(clientDir, 'components/layout/Footer.tsx');
    const footerContent = fs.readFileSync(footerPath, 'utf8');
    assert(footerContent.includes('isAdminDashboard') && footerContent.includes('return null;'), '9.2 Consumer Footer Exclusion', 'Public Footer excludes dedicated admin dashboard routes');

    // --------------------------------------------------------------------
    // 10. Responsive & Accessibility Features
    // --------------------------------------------------------------------
    const layoutContent = fs.readFileSync(path.join(sidebarDir, 'AdminLayout.tsx'), 'utf8');
    assert(layoutContent.includes('borno_admin_sidebar_collapsed'), '10.1 Sidebar State Persistence', 'Sidebar collapsed state saved to localStorage key');
    assert(layoutContent.includes('hidden md:flex'), '10.2 Responsive Sidebar Media Query', 'Desktop sidebar hidden on mobile screens below md (768px)');

    const drawerContent = fs.readFileSync(path.join(sidebarDir, 'MobileSidebarDrawer.tsx'), 'utf8');
    assert(drawerContent.includes('role="dialog"') && drawerContent.includes('aria-modal="true"'), '10.3 Mobile Drawer Accessibility', 'Mobile drawer configured with semantic dialog and modal attributes');
    assert(drawerContent.includes('Escape'), '10.4 Escape Key Listener', 'Mobile drawer supports keyboard Escape key dismissal');

    // --------------------------------------------------------------------
    // Summary
    // --------------------------------------------------------------------
    console.log('\n========================================================================');
    const passedCount = results.filter((r) => r.passed).length;
    const totalCount = results.length;
    console.log(`TOTAL RESULTS: ${passedCount}/${totalCount} TESTS PASSED`);
    console.log('========================================================================');

    if (passedCount !== totalCount) {
      process.exit(1);
    }
  } catch (err: any) {
    console.error('Unhandled test suite failure:', err);
    process.exit(1);
  }
}

runAdminSidebarVerification();
