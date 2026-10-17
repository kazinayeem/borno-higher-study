import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';

// Providers
import { ThemeProvider } from './context/ThemeContext.js';
import { LanguageProvider } from './context/LanguageContext.js';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { SavedProvider } from './context/SavedContext.js';
import { CompareProvider } from './context/CompareContext.js';

// 22 Pages
import { HomePage } from './pages/HomePage.js';
import { CountriesPage } from './pages/CountriesPage.js';
import { CountryDetailsPage } from './pages/CountryDetailsPage.js';
import { UniversitiesPage } from './pages/UniversitiesPage.js';
import { UniversityDetailsPage } from './pages/UniversityDetailsPage.js';
import { CoursesPage } from './pages/CoursesPage.js';
import { CourseDetailsPage } from './pages/CourseDetailsPage.js';
import { ScholarshipsPage } from './pages/ScholarshipsPage.js';
import { ScholarshipDetailsPage } from './pages/ScholarshipDetailsPage.js';
import { TuitionCalculatorPage } from './pages/TuitionCalculatorPage.js';
import { EnglishCheckerPage } from './pages/EnglishCheckerPage.js';
import { EnglishPrepPage } from './pages/EnglishPrepPage.js';
import { AiAdvisorPage } from './pages/AiAdvisorPage.js';
import { ComparePage } from './pages/ComparePage.js';
import { SavedItemsPage } from './pages/SavedItemsPage.js';
import { ApplicationPlannerPage } from './pages/ApplicationPlannerPage.js';
import { StudentDashboardPage } from './pages/StudentDashboardPage.js';
import { AuthPage } from './pages/AuthPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';
import { AdminVerificationPage } from './pages/AdminVerificationPage.js';
import { TermsPage } from './pages/TermsPage.js';
import { CommunityPage } from './pages/CommunityPage.js';
import { PostDetailsPage } from './pages/PostDetailsPage.js';
import { ContributorStudioPage } from './pages/ContributorStudioPage.js';
import { FinancialDocumentsPage } from './pages/FinancialDocumentsPage.js';
import { WorkspacesPage } from './pages/WorkspacesPage.js';
import { StudentReportsPage } from './pages/StudentReportsPage.js';
import { SuperAdminLoginPage } from './pages/SuperAdminLoginPage.js';
import { StudentLoginPage } from './pages/StudentLoginPage.js';
import { EnglishTestsPage } from './pages/EnglishTestsPage.js';
import { UniversityTestAcceptancePage } from './pages/UniversityTestAcceptancePage.js';
import { EnglishTestAdvisorPage } from './pages/EnglishTestAdvisorPage.js';
import { MoiDirectoryPage } from './pages/MoiDirectoryPage.js';
import { MoiEligibilityCheckerPage } from './pages/MoiEligibilityCheckerPage.js';
import { VisaIntelligenceDashboardPage } from './pages/VisaIntelligenceDashboardPage.js';
import { VisaStatisticsPage } from './pages/VisaStatisticsPage.js';
import { VisaApplicationCentresPage } from './pages/VisaApplicationCentresPage.js';
import { VisaUpdatesPage } from './pages/VisaUpdatesPage.js';
import { CountryVisaDetailPage } from './pages/CountryVisaDetailPage.js';
import { EligibilityCheckerPage } from './pages/EligibilityCheckerPage.js';
import { AcademicRequirementsPage } from './pages/AcademicRequirementsPage.js';
import { BlogHomePage } from './pages/BlogHomePage.js';
import { ArticleDetailPage } from './pages/ArticleDetailPage.js';
import { BlogCategoriesPage } from './pages/BlogCategoriesPage.js';
import { BlogSearchPage } from './pages/BlogSearchPage.js';
import { ResearchLibraryPage } from './pages/ResearchLibraryPage.js';
import { UniversityComparisonPage } from './pages/UniversityComparisonPage.js';
import { CountryComparisonPage } from './pages/CountryComparisonPage.js';
import { ScholarshipGuidesPage } from './pages/ScholarshipGuidesPage.js';
import { StudyGuidesPage } from './pages/StudyGuidesPage.js';
import { AuthorProfilePage } from './pages/AuthorProfilePage.js';
import { CareerToolkitHubPage } from './pages/CareerToolkitHubPage.js';
import { CareerGuideDetailPage } from './pages/CareerGuideDetailPage.js';
import { CVExamplesPage } from './pages/CVExamplesPage.js';
import { CVChecklistPage } from './pages/CVChecklistPage.js';
import { CVQualityReviewPage } from './pages/CVQualityReviewPage.js';
import { CVBuilderPage } from './pages/CVBuilderPage.js';
import { CountryWorkGuideHubPage } from './pages/CountryWorkGuideHubPage.js';
import { CountryWorkProfilePage } from './pages/CountryWorkProfilePage.js';
import { CountryWorkComparePage } from './pages/CountryWorkComparePage.js';
import { StudentWorkRulesPage } from './pages/StudentWorkRulesPage.js';
import { MinimumWagesPage } from './pages/MinimumWagesPage.js';
import { PostStudyWorkPage } from './pages/PostStudyWorkPage.js';
import { CareerRoadmapsPage } from './pages/CareerRoadmapsPage.js';
import { CountryWorkSourcesPage } from './pages/CountryWorkSourcesPage.js';

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/super-admin/login" replace />;
  if (!isAdmin) return <Navigate to="/student/dashboard" replace />;
  return <>{children}</>;
};

const ProtectedSuperAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSuperAdmin, isAdmin, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/super-admin/login" replace />;
  if (!isSuperAdmin && !isAdmin) return <Navigate to="/student/dashboard" replace />;
  return <>{children}</>;
};

import { RouteTransition } from './components/motion/index.js';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <SavedProvider>
              <CompareProvider>
                <div className="flex flex-col min-h-screen bg-white dark:bg-[#0B132B] text-slate-800 dark:text-slate-100 transition-colors duration-200">
                  <Navbar />
                  <main className="flex-1">
                    <RouteTransition>
                      <Routes>
                  {/* Public Discovery */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/countries" element={<CountriesPage />} />
                  <Route path="/countries/:slug" element={<CountryDetailsPage />} />
                  <Route path="/universities" element={<UniversitiesPage />} />
                  <Route path="/universities/:slug" element={<UniversityDetailsPage />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/courses/:id" element={<CourseDetailsPage />} />
                  <Route path="/scholarships" element={<ScholarshipsPage />} />
                  <Route path="/scholarships/:id" element={<ScholarshipDetailsPage />} />

                  {/* Community & Contributor Program */}
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/community/:slug" element={<PostDetailsPage />} />
                  <Route path="/community/contribute" element={<ContributorStudioPage />} />
                  <Route path="/workspaces" element={<WorkspacesPage />} />

                  {/* Global Academic Eligibility & Subject Requirements Engine */}
                  <Route path="/eligibility-checker" element={<EligibilityCheckerPage />} />
                  <Route path="/academic-requirements" element={<AcademicRequirementsPage />} />

                  {/* Section 15: Premium Research, Education Blog & Super Admin Content Platform */}
                  <Route path="/blog" element={<BlogHomePage />} />
                  <Route path="/blog/:slug" element={<ArticleDetailPage />} />
                  <Route path="/blog/categories" element={<BlogCategoriesPage />} />
                  <Route path="/blog/category/:slug" element={<BlogCategoriesPage />} />
                  <Route path="/blog/search" element={<BlogSearchPage />} />
                  <Route path="/research" element={<ResearchLibraryPage />} />
                  <Route path="/research/:slug" element={<ResearchLibraryPage />} />
                  <Route path="/compare/universities" element={<UniversityComparisonPage />} />
                  <Route path="/compare/countries" element={<CountryComparisonPage />} />
                  <Route path="/scholarships/guides" element={<ScholarshipGuidesPage />} />
                  <Route path="/study-guides" element={<StudyGuidesPage />} />
                  <Route path="/authors/:slug" element={<AuthorProfilePage />} />
                  <Route
                    path="/super-admin/content"
                    element={
                      <ProtectedSuperAdminRoute>
                        <Navigate to="/super-admin/dashboard?tab=content" replace />
                      </ProtectedSuperAdminRoute>
                    }
                  />

                  {/* Section 17: Complete CV, Europass & Career Toolkit */}
                  <Route path="/career-toolkit" element={<CareerToolkitHubPage />} />
                  <Route path="/career-toolkit/cv-writing-guide" element={<CareerGuideDetailPage overrideSlug="cv-writing-guide" />} />
                  <Route path="/career-toolkit/europass-cv" element={<CareerGuideDetailPage overrideSlug="europass-cv" />} />
                  <Route path="/career-toolkit/academic-cv" element={<CareerGuideDetailPage overrideSlug="academic-cv" />} />
                  <Route path="/career-toolkit/research-cv" element={<CareerGuideDetailPage overrideSlug="research-cv" />} />
                  <Route path="/career-toolkit/scholarship-cv" element={<CareerGuideDetailPage overrideSlug="scholarship-cv" />} />
                  <Route path="/career-toolkit/student-resume" element={<CareerGuideDetailPage overrideSlug="student-resume" />} />
                  <Route path="/career-toolkit/cover-letter" element={<CareerGuideDetailPage overrideSlug="cover-letter" />} />
                  <Route path="/career-toolkit/personal-statement" element={<CareerGuideDetailPage overrideSlug="personal-statement" />} />
                  <Route path="/career-toolkit/cv-examples" element={<CVExamplesPage />} />
                  <Route path="/career-toolkit/cv-checklist" element={<CVChecklistPage />} />
                  <Route path="/career-toolkit/cv-review" element={<CVQualityReviewPage />} />
                  <Route path="/career-toolkit/cv-builder" element={<CVBuilderPage />} />
                  <Route
                    path="/super-admin/career-toolkit"
                    element={
                      <ProtectedSuperAdminRoute>
                        <Navigate to="/super-admin/dashboard?tab=career-toolkit" replace />
                      </ProtectedSuperAdminRoute>
                    }
                  />

                  {/* Global Country Language, Minimum Wage, Student Work & Post-Study Career Platform */}
                  <Route path="/country-work-guide" element={<CountryWorkGuideHubPage />} />
                  <Route path="/country-work-guide/compare" element={<CountryWorkComparePage />} />
                  <Route path="/country-work-guide/student-work-rules" element={<StudentWorkRulesPage />} />
                  <Route path="/country-work-guide/minimum-wages" element={<MinimumWagesPage />} />
                  <Route path="/country-work-guide/post-study-work" element={<PostStudyWorkPage />} />
                  <Route path="/country-work-guide/career-roadmaps" element={<CareerRoadmapsPage />} />
                  <Route path="/country-work-guide/sources" element={<CountryWorkSourcesPage />} />
                  <Route path="/country-work-guide/:countryCode" element={<CountryWorkProfilePage />} />

                  {/* Interactive Tools & English Test Comparison */}
                  <Route path="/english-tests" element={<EnglishTestsPage />} />
                  <Route path="/university-test-acceptance" element={<UniversityTestAcceptancePage />} />
                  <Route path="/english-test-advisor" element={<EnglishTestAdvisorPage />} />
                  <Route path="/moi-acceptance" element={<MoiDirectoryPage />} />
                  <Route path="/moi-eligibility-checker" element={<MoiEligibilityCheckerPage />} />
                  <Route path="/moi" element={<Navigate to="/moi-acceptance" replace />} />
                  <Route
                    path="/super-admin/link-health"
                    element={
                      <ProtectedSuperAdminRoute>
                        <Navigate to="/super-admin/dashboard?tab=link-health" replace />
                      </ProtectedSuperAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/link-health"
                    element={
                      <ProtectedAdminRoute>
                        <Navigate to="/super-admin/dashboard?tab=link-health" replace />
                      </ProtectedAdminRoute>
                    }
                  />

                  {/* Live Global Visa Intelligence, Statistics & Bangladesh Centre Finder */}
                  <Route path="/visa-intelligence" element={<VisaIntelligenceDashboardPage />} />
                  <Route path="/visa-statistics" element={<VisaStatisticsPage />} />
                  <Route path="/visa-application-centres" element={<VisaApplicationCentresPage />} />
                  <Route path="/visa-updates" element={<VisaUpdatesPage />} />
                  <Route path="/visa-intelligence/country/:countryCode" element={<CountryVisaDetailPage />} />

                  <Route path="/calculator" element={<TuitionCalculatorPage />} />
                  <Route path="/english-checker" element={<EnglishCheckerPage />} />
                  <Route path="/test-prep" element={<EnglishPrepPage />} />
                  <Route path="/preparation" element={<Navigate to="/test-prep" replace />} />
                  <Route path="/advisor" element={<AiAdvisorPage />} />
                  <Route path="/compare" element={<ComparePage />} />
                  <Route path="/saved" element={<SavedItemsPage />} />
                  <Route path="/planner" element={<ApplicationPlannerPage />} />

                  {/* Two Dedicated Login & Dashboard Portals */}
                  <Route path="/super-admin/login" element={<SuperAdminLoginPage />} />
                  <Route path="/super-admin" element={<Navigate to="/super-admin/login" replace />} />
                  <Route
                    path="/super-admin/dashboard"
                    element={
                      <ProtectedSuperAdminRoute>
                        <AdminDashboardPage />
                      </ProtectedSuperAdminRoute>
                    }
                  />

                  <Route path="/student/login" element={<StudentLoginPage />} />
                  <Route path="/student/dashboard" element={<StudentDashboardPage />} />
                  <Route path="/student" element={<Navigate to="/student/login" replace />} />

                  {/* Account & Dashboard */}
                  <Route path="/dashboard" element={<StudentDashboardPage />} />
                  <Route path="/dashboard/reports" element={<StudentReportsPage />} />
                  <Route path="/dashboard/financial-documents" element={<FinancialDocumentsPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/login" element={<Navigate to="/student/login" replace />} />

                  {/* Platform Info */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/terms" element={<TermsPage />} />

                  {/* Admin Protected Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedAdminRoute>
                        <AdminDashboardPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/verification"
                    element={
                      <ProtectedAdminRoute>
                        <AdminVerificationPage />
                      </ProtectedAdminRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </RouteTransition>
            </main>
            <Footer />
            </div>
          </CompareProvider>
        </SavedProvider>
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
</BrowserRouter>
  );
};

export default App;
