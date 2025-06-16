import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import SignupPage from './auth/SignupPage';
import ResetPasswordPage from './auth/ResetPasswordPage';
import SetNewPasswordPage from './auth/SetNewPasswordPage';
import EmailVerificationPage from './auth/EmailVerificationPage';
import VerificationSentPage from './auth/VerificationSentPage';
import ProfilePage from './profile/ProfilePage';
import AuthGuard from '../guards/AuthGuard';
import GuestGuard from '../guards/GuestGuard';
import App from '../App';
import MainLayout from '../components/layouts/MainLayout';
import Dashboard from './Dashboard';
import ProjectsPage from './ProjectsPage';
import ProjectDetailsPage from './ProjectDetailsPage';
import TasksPage from './TasksPage';
import TaskPage from './TaskPage';
import ButtonsShowCase from './ButtonsShowCase';
import DropdownShowcase from './DropdownShowcase';
import TableShowcase from './TableShowcase';
import FormsShowcase from './FormsShowcase';
import ProgressShowcase from './ProgressShowcase';
import CountersShowcase from './CountersShowcase';
import UIComponentsShowcase from './UIComponentsShowcase';
import ContainersShowcase from './ContainersShowcase';
import SearchbarShowcase from './SearchbarShowcase';
import InboxPage from './InboxPage';
import Page2 from './Page2';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}      
      <Route path="/" element={<App />}>
        <Route index element={<ButtonsShowCase />} />
        <Route path="button-showcase" element={<ButtonsShowCase />} />
        <Route path="dropdown-showcase" element={<DropdownShowcase />} />
        <Route path="table-showcase" element={<TableShowcase />} />
        <Route path="forms-showcase" element={<FormsShowcase />} />        <Route path="progress-showcase" element={<ProgressShowcase />} />
        <Route path="counters-showcase" element={<CountersShowcase />} />
        <Route path="containers-showcase" element={<ContainersShowcase />} />
        <Route path="ui-components-showcase" element={<UIComponentsShowcase />} />
        <Route path="searchbar-showcase" element={<SearchbarShowcase />} />
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

      {/* Protected routes (only accessible to authenticated users) */}      <Route element={<AuthGuard />}>        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:projectId" element={<ProjectDetailsPage />} />          <Route path="tasks" element={<TasksPage />} />
          <Route path="tasks/:taskId" element={<TaskPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="inbox" element={<InboxPage />} />
        </Route>
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
