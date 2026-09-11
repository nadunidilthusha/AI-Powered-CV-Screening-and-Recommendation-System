import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './routePaths';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import useAuth from '../hooks/useAuth';

import AuthLayout from '../components/layout/AuthLayout';
import AdminLayout from '../components/layout/AdminLayout';
import HrLayout from '../components/layout/HrLayout';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

import ProfilePage from '../pages/profile/ProfilePage';
import SettingsPage from '../pages/settings/SettingsPage';
import DashboardPage from '../pages/dashboard/DashboardPage';

import JobListPage from '../pages/jobs/JobListPage';
import CreateJobPage from '../pages/jobs/CreateJobPage';
import JobDetailsPage from '../pages/jobs/JobDetailsPage';
import EditJobPage from '../pages/jobs/EditJobPage';

import CvUploadPage from '../pages/cv-upload/CvUploadPage';

import CandidateListPage from '../pages/candidates/CandidateListPage';
import CandidateDetailsPage from '../pages/candidates/CandidateDetailsPage';

import ReportsPage from '../pages/reports/ReportsPage';

import UserManagementPage from '../pages/admin/UserManagementPage';
import ApiConfigurationPage from '../pages/admin/ApiConfigurationPage';
import SystemStatusPage from '../pages/admin/SystemStatusPage';
import DatabaseStatusPage from '../pages/admin/DatabaseStatusPage';

// Picks the sidebar/topbar shell based on the logged-in user's role, so
// Dashboard/Jobs/Candidates/etc. are declared ONCE instead of being
// duplicated under two separate RoleRoute branches. The duplication was
// the actual bug: React Router always matched the first branch (admin)
// for shared paths like "/", regardless of the real user's role, which
// caused an infinite redirect loop with no console error.
const RoleAwareLayout = () => {
  const { user } = useAuth();
  return user?.role === 'admin' ? <AdminLayout /> : <HrLayout />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public / auth routes */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
      </Route>

      {/* Protected routes: any authenticated user, admin or hr_manager */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleAwareLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />

          <Route path={ROUTES.JOBS} element={<JobListPage />} />
          <Route path={ROUTES.JOB_CREATE} element={<CreateJobPage />} />
          <Route path={ROUTES.JOB_DETAILS} element={<JobDetailsPage />} />
          <Route path={ROUTES.JOB_EDIT} element={<EditJobPage />} />

          <Route path={ROUTES.CV_UPLOAD} element={<CvUploadPage />} />

          <Route path={ROUTES.CANDIDATES} element={<CandidateListPage />} />
          <Route path={ROUTES.CANDIDATE_DETAILS} element={<CandidateDetailsPage />} />

          <Route path={ROUTES.REPORTS} element={<ReportsPage />} />

          {/* Admin-only pages, still inside the same protected shell */}
          <Route element={<RoleRoute allow={['admin']} />}>
            <Route path={ROUTES.ADMIN_USERS} element={<UserManagementPage />} />
            <Route path={ROUTES.ADMIN_API_CONFIG} element={<ApiConfigurationPage />} />
            <Route path={ROUTES.ADMIN_SYSTEM_STATUS} element={<SystemStatusPage />} />
            <Route path={ROUTES.ADMIN_DATABASE_STATUS} element={<DatabaseStatusPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;