import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './routes/auth/LoginPage';
import SignupPage from './routes/auth/SignupPage';
import ResetPasswordPage from './routes/auth/ResetPasswordPage';
import SetNewPasswordPage from './routes/auth/SetNewPasswordPage';
import EmailVerificationPage from './routes/auth/EmailVerificationPage';
import VerificationSentPage from './routes/auth/VerificationSentPage';
import ProfilePage from './routes/profile/ProfilePage';
import AuthGuard from './guards/AuthGuard';
import GuestGuard from './guards/GuestGuard';
import App from './App';
import MainLayout from './components/layouts/MainLayout';
import Dashboard from './routes/Dashboard';
import ProjectsPage from './routes/ProjectsPage';
import TasksPage from './routes/TasksPage';
import ButtonsShowCase from './routes/ButtonsShowCase';
import DropdownShowcase from './routes/DropdownShowcase';
import TableShowcase from './routes/TableShowcase';
import FormsShowcase from './routes/FormsShowcase';
import Page2 from './routes/Page2';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<App />}>
        <Route index element={<ButtonsShowCase />} />
        <Route path="button-showcase" element={<ButtonsShowCase />} />
        <Route path="dropdown-showcase" element={<DropdownShowcase />} />
        <Route path="table-showcase" element={<TableShowcase />} />
        <Route path="forms-showcase" element={<FormsShowcase />} />
        <Route path="page2" element={<Page2 />} />
      </Route>

      {/* Auth routes (only accessible to non-authenticated users) */}
      <Route element={<GuestGuard />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/set-new-password/:token" element={<SetNewPasswordPage />} />
      </Route>

      {/* Email verification routes (accessible to both authenticated and non-authenticated users) */}
      <Route path="/email-verification/:token" element={<EmailVerificationPage />} />
      <Route path="/verification-sent" element={<VerificationSentPage />} />

      {/* Protected routes (only accessible to authenticated users) */}
      <Route element={<AuthGuard />}>
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="inbox" element={
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Inbox</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Your messages and notifications will appear here.
              </p>
            </div>
          } />
        </Route>
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
