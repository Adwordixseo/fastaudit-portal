import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { lazy, Suspense } from 'react';
import SeoHead from '@/components/seo/SeoHead';
// Landing stays eager (public entry); all other routes are code-split
import Landing from './pages/Landing';
const FeatureDetail = lazy(() => import('./pages/FeatureDetail'));
const Resources = lazy(() => import('./pages/Resources'));
const ResourceDetail = lazy(() => import('./pages/ResourceDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const ClientLayout = lazy(() => import('@/components/portal/ClientLayout'));
const AdminLayout = lazy(() => import('@/components/portal/AdminLayout'));
const Dashboard = lazy(() => import('./pages/app/Dashboard'));
const AuditPage = lazy(() => import('./pages/app/AuditPage'));
const PackagesPage = lazy(() => import('./pages/app/PackagesPage'));
const ProjectsPage = lazy(() => import('./pages/app/ProjectsPage'));
const ReportsPage = lazy(() => import('./pages/app/ReportsPage'));
const SupportPage = lazy(() => import('./pages/app/SupportPage'));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminPackages = lazy(() => import('./pages/admin/AdminPackages'));
const AdminDocuments = lazy(() => import('./pages/admin/AdminDocuments'));
const AdminSubscriptions = lazy(() => import('./pages/admin/AdminSubscriptions'));
const AdminFinancials = lazy(() => import('./pages/admin/AdminFinancials'));
const AdminTickets = lazy(() => import('./pages/admin/AdminTickets'));
const TeamLayout = lazy(() => import('@/components/portal/TeamLayout'));
const TeamDashboard = lazy(() => import('./pages/team/TeamDashboard'));
const TeamProjects = lazy(() => import('./pages/team/TeamProjects'));
const TeamKeywordTool = lazy(() => import('./pages/team/TeamKeywordTool'));
const TeamTasks = lazy(() => import('./pages/team/TeamTasks'));
const AdminSeo = lazy(() => import('./pages/admin/AdminSeo'));
const AdminContent = lazy(() => import('./pages/admin/AdminContent'));
const AdminResources = lazy(() => import('./pages/admin/AdminResources'));
const AdminFaqs = lazy(() => import('./pages/admin/AdminFaqs'));
const PostLoginRedirect = lazy(() => import('./pages/PostLoginRedirect'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Contact = lazy(() => import('./pages/Contact'));
const Pricing = lazy(() => import('./pages/Pricing'));

const AuthenticatedApp = () => {
  const { authError, navigateToLogin } = useAuth();

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#0a0815]"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-pink-500" /></div>}>
    <Routes>
      {/* Add your page Route elements here */}
      <Route path="/" element={<Landing />} />
      <Route path="/platform/:slug" element={<FeatureDetail />} />
      <Route path="/solutions/:slug" element={<FeatureDetail />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/resources/:slug" element={<ResourceDetail />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route path="/welcome" element={<PostLoginRedirect />} />
        <Route element={<ClientLayout />}>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/audit" element={<AuditPage />} />
          <Route path="/app/packages" element={<PackagesPage />} />
          <Route path="/app/projects" element={<ProjectsPage />} />
          <Route path="/app/reports" element={<ReportsPage />} />
          <Route path="/app/support" element={<SupportPage />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/packages" element={<AdminPackages />} />
          <Route path="/admin/documents" element={<AdminDocuments />} />
          <Route path="/admin/financials" element={<AdminFinancials />} />
          <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
          <Route path="/admin/tickets" element={<AdminTickets />} />
          <Route path="/admin/seo" element={<AdminSeo />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/resources" element={<AdminResources />} />
          <Route path="/admin/faqs" element={<AdminFaqs />} />
        </Route>
        <Route element={<TeamLayout />}>
          <Route path="/team" element={<TeamDashboard />} />
          <Route path="/team/projects" element={<TeamProjects />} />
          <Route path="/team/keywords" element={<TeamKeywordTool />} />
          <Route path="/team/tasks" element={<TeamTasks />} />
          <Route path="/team/seo" element={<AdminSeo />} />
          <Route path="/team/content" element={<AdminContent />} />
          <Route path="/team/faqs" element={<AdminFaqs />} />
          <Route path="/team/resources" element={<AdminResources />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </Suspense>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <SeoHead />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App