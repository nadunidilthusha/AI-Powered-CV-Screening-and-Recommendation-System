import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './routePaths';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

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

const AppRoutes = () => {
  return (
    <Routes>
      {/* =========================
          PUBLIC / AUTH ROUTES
      ========================== */}
      <Route element={<AuthLayout />}>
        <Route
          path={ROUTES.LOGIN}
          element={<LoginPage />}
        />

        <Route
          path={ROUTES.REGISTER}
          element={<RegisterPage />}
        />

        <Route
          path={ROUTES.FORGOT_PASSWORD}
          element={<ForgotPasswordPage />}
        />
      </Route>

      {/* =========================
          PROTECTED ROUTES
      ========================== */}
      <Route element={<ProtectedRoute />}>

        {/* =========================
            ADMIN ROUTES
        ========================== */}
        <Route element={<RoleRoute allow={['admin']} />}>
          <Route element={<AdminLayout />}>

            {/* Admin Dashboard stays at "/" */}
            <Route
              path={ROUTES.DASHBOARD}
              element={<DashboardPage />}
            />

            <Route
              path={ROUTES.PROFILE}
              element={<ProfilePage />}
            />

            <Route
              path={ROUTES.SETTINGS}
              element={<SettingsPage />}
            />

            <Route
              path={ROUTES.ADMIN_USERS}
              element={<UserManagementPage />}
            />

            <Route
              path={ROUTES.ADMIN_API_CONFIG}
              element={<ApiConfigurationPage />}
            />

            <Route
              path={ROUTES.ADMIN_SYSTEM_STATUS}
              element={<SystemStatusPage />}
            />

            <Route
              path={ROUTES.ADMIN_DATABASE_STATUS}
              element={<DatabaseStatusPage />}
            />

          </Route>
        </Route>

        {/* =========================
            HR MANAGER ROUTES
        ========================== */}
        <Route element={<RoleRoute allow={['hr_manager']} />}>
          <Route element={<HrLayout />}>

            {/* HR Dashboard */}
            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            <Route
              path={ROUTES.PROFILE}
              element={<ProfilePage />}
            />

            <Route
              path={ROUTES.SETTINGS}
              element={<SettingsPage />}
            />

            {/* Job Routes */}
            <Route
              path={ROUTES.JOBS}
              element={<JobListPage />}
            />

            <Route
              path={ROUTES.JOB_CREATE}
              element={<CreateJobPage />}
            />

            <Route
              path={ROUTES.JOB_DETAILS}
              element={<JobDetailsPage />}
            />

            <Route
              path={ROUTES.JOB_EDIT}
              element={<EditJobPage />}
            />

            {/* CV Upload - existing job-specific route */}
            <Route
              path={ROUTES.CV_UPLOAD}
              element={<CvUploadPage />}
            />

            {/* CV Upload - sidebar navigation route */}
            <Route
              path="/cv-upload"
              element={<CvUploadPage />}
            />

            {/* Candidate Routes */}
            <Route
              path={ROUTES.CANDIDATES}
              element={<CandidateListPage />}
            />

            <Route
              path={ROUTES.CANDIDATE_DETAILS}
              element={<CandidateDetailsPage />}
            />

            {/* Reports */}
            <Route
              path={ROUTES.REPORTS}
              element={<ReportsPage />}
            />

          </Route>
        </Route>

      </Route>
    </Routes>
  );
};

export default AppRoutes;