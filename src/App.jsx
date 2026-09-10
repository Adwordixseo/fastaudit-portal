import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import SeoHead from '@/components/seo/SeoHead';
// Add page imports here
import Landing from './pages/Landing';
import FeatureDetail from './pages/FeatureDetail';
import ResourceDetail from './pages/ResourceDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ClientLayout from '@/components/portal/ClientLayout';
import AdminLayout from '@/components/portal/AdminLayout';
import Dashboard from './pages/app/Dashboard';
import AuditPage from './pages/app/AuditPage';
import PackagesPage from './pages/app/PackagesPage';
import ProjectsPage from './pages/app/ProjectsPage';
import ReportsPage from './pages/app/ReportsPage';
import SupportPage from './pages/app/SupportPage';
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProjects from './pages/admin/AdminProjects';
import AdminPackages from './pages/admin/AdminPackages';
import AdminDocuments from './pages/admin/AdminDocuments';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminFinancials from './pages/admin/AdminFinancials';
import AdminTickets from './pages/admin/AdminTickets';
import TeamLayout from '@/components/portal/TeamLayout';
import TeamDashboard from './pages/team/TeamDashboard';
import TeamProjects from './pages/team/TeamProjects';
import TeamKeywordTool from './pages/team/TeamKeywordTool';
import TeamTasks from './pages/team/TeamTasks';
import AdminSeo from './pages/admin/AdminSeo';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

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
    <Routes>
      {/* Add your page Route elements here */}
      <Route path="/" element={<Landing />} />
      <Route path="/platform/:slug" element={<FeatureDetail />} />
      <Route path="/solutions/:slug" element={<FeatureDetail />} />
      <Route path="/resources/:slug" element={<ResourceDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
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
        </Route>
        <Route element={<TeamLayout />}>
          <Route path="/team" element={<TeamDashboard />} />
          <Route path="/team/projects" element={<TeamProjects />} />
          <Route path="/team/keywords" element={<TeamKeywordTool />} />
          <Route path="/team/tasks" element={<TeamTasks />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
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