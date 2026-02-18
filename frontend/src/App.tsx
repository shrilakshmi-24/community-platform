import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import OTPVerification from './pages/OTPVerification';
import ProtectedRoute from './components/ProtectedRoute';
import PublicHome from './pages/PublicHome';
import Home from './pages/Home';

import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import HybridLayout from './components/HybridLayout';
import BusinessList from './pages/BusinessList';
import CareerList from './pages/CareerList';
import SupportRequest from './pages/SupportRequest';
import ProfilePage from './pages/ProfilePage';
import EventsPage from './pages/EventsPage';
import AchievementsPage from './pages/AchievementsPage';
import AdminLogin from './pages/AdminLogin';
import NotificationsPage from './pages/NotificationsPage';
import AboutUs from './pages/AboutUs';
import DonationsPage from './pages/DonationsPage';
import ScholarshipsPage from './pages/ScholarshipsPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import EducationLoanPage from './pages/EducationLoanPage';
import BusinessCollaborationPage from './pages/BusinessCollaborationPage';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import UserList from './pages/admin/UserList';
import UserVerification from './pages/admin/UserVerification';
import ContentModeration from './pages/admin/ContentModeration';
import DonationManager from './pages/admin/DonationManager';
import AdminReports from './pages/admin/AdminReports';
import ScholarshipManager from './pages/admin/ScholarshipManager';
import AdminContentCreation from './pages/admin/AdminContentCreation';

// Profile section pages
import AboutMe from './pages/profile/AboutMe';
import Family from './pages/profile/Family';
import Business from './pages/profile/Business';

// Help Desk Pages
import HelpRequestForm from './pages/help/HelpRequestForm';
import HelpRequestList from './pages/help/HelpRequestList';
import EmergencyRequests from './pages/help/EmergencyRequests';
import AdminHelpDesk from './pages/admin/AdminHelpDesk';

// Component to handle conditional home page rendering
const HomePage = () => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('App render: isLoading=', isLoading, 'isAuthenticated=', isAuthenticated);

  if (isLoading) {
    console.log('App is loading...');
    return null; // or a loading spinner
  }

  return isAuthenticated ? <Navigate to="/home" replace /> : <PublicHome />;
};



// ... imports ...

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Hybrid routes (accessible to both, wrapper decides layout) */}
            <Route element={<HybridLayout />}>
              <Route path="/about" element={<AboutUs />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
            </Route>

            {/* Public routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<Login />} />
              <Route path="verify-otp" element={<OTPVerification />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<UserList />} />
              <Route path="verify" element={<UserVerification />} />
              <Route path="moderation" element={<ContentModeration />} />
              <Route path="donations" element={<DonationManager />} />
              <Route path="scholarships" element={<ScholarshipManager />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="create-content" element={<AdminContentCreation />} />
              <Route path="help-desk" element={<AdminHelpDesk />} />
            </Route>

            {/* Protected authenticated routes */}
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="home" element={<Home />} />
              <Route path="business" element={<BusinessList />} />
              <Route path="career" element={<CareerList />} />
              <Route path="support" element={<SupportRequest />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="about" element={<AboutUs />} />

              <Route path="events" element={<EventsPage />} />
              <Route path="achievements" element={<AchievementsPage />} />
              <Route path="announcements" element={<AnnouncementsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="donations" element={<DonationsPage />} />
              <Route path="scholarships" element={<ScholarshipsPage />} />
              <Route path="education-loan" element={<EducationLoanPage />} />
              <Route path="business-collaboration" element={<BusinessCollaborationPage />} />

              {/* Help Desk Routes */}
              <Route path="help/create" element={<HelpRequestForm />} />
              <Route path="help/my-requests" element={<HelpRequestList />} />
              <Route path="help/emergency" element={<EmergencyRequests />} />

              {/* Profile section routes */}
              <Route path="profile/about-me" element={<AboutMe />} />
              <Route path="profile/family" element={<Family />} />
              <Route path="profile/business" element={<Business />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
