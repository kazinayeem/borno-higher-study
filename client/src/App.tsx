import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';

// Providers
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

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SavedProvider>
          <CompareProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
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

                  {/* Interactive Tools & English Test Comparison */}
                  <Route path="/english-tests" element={<EnglishTestsPage />} />
                  <Route path="/university-test-acceptance" element={<UniversityTestAcceptancePage />} />
                  <Route path="/english-test-advisor" element={<EnglishTestAdvisorPage />} />
                  <Route path="/moi-acceptance" element={<MoiDirectoryPage />} />
                  <Route path="/moi-eligibility-checker" element={<MoiEligibilityCheckerPage />} />
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
              </main>
              <Footer />
            </div>
          </CompareProvider>
        </SavedProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
