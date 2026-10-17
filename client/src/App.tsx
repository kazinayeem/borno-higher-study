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

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
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

                  {/* Interactive Tools */}
                  <Route path="/calculator" element={<TuitionCalculatorPage />} />
                  <Route path="/english-checker" element={<EnglishCheckerPage />} />
                  <Route path="/advisor" element={<AiAdvisorPage />} />
                  <Route path="/compare" element={<ComparePage />} />
                  <Route path="/saved" element={<SavedItemsPage />} />
                  <Route path="/planner" element={<ApplicationPlannerPage />} />

                  {/* Account & Dashboard */}
                  <Route path="/dashboard" element={<StudentDashboardPage />} />
                  <Route path="/auth" element={<AuthPage />} />

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
