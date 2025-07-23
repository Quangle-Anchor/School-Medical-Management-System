import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import PrincipalDashboard from "./pages/principalDashboard/PrincipalDashboard";
import NurseDashboard from "./pages/nurseDashboard/NurseDashboardNew";
import ParentDashboard from "./pages/parentDashboard/ParentDashboardWrapper";
import Profile from "./pages/profile/Profile";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

import AboutNova from "./pages/about/AboutNova";
import HomePage from "./pages/home/HomepageNova";
import ContactNova from "./pages/contact/ContactNova";
import HealthLookupPage from "./pages/HealthLookupPage/HealthLookupPage";
import LoginPage from "./pages/login/Login";
import SignUp from "./pages/login/SignUp";
import NovaHeaderSimple from "./components/NovaHeaderSimple";
import NovaFooter from "./components/NovaFooter";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import VerifyOtp from "./pages/forgotPassword/VerifyOtp";
import ResetPassword from "./pages/forgotPassword/ResetPassword";
import RecoverySuccess from "./pages/forgotPassword/RecoverySuccess";
import ToastNotification from "./components/ToastNotification";

function AppContent() {
  const location = useLocation();

  // Check if current page is a dashboard
  const isDashboardPage =
    location.pathname.includes("Dashboard") ||
    location.pathname.includes("/adminDashboard") ||
    location.pathname.includes("/nurseDashboard") ||
    location.pathname.includes("/principalDashboard") ||
    location.pathname.includes("/parentDashboard");

  const hideFooter =
    ["/login", "/signup", "/forgot-password", "/forgot-password/verify-otp", "/forgot-password/reset", "/forgot-password/success"].includes(location.pathname) || isDashboardPage;
  const hideNavbar = isDashboardPage; // Hide navbar on dashboard pages

  
  return (
    <div className="min-h-screen relative bg-gray-100">
      {/* Background overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div> */}

      {/* Smart Navbar - always visible on non-dashboard pages */}
      {!hideNavbar && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <NovaHeaderSimple />
        </div>
      )}

      {/* Main content area with padding for navbar */}
      <div className={`relative z-10 ${!hideNavbar ? "pt-16" : ""}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutNova />} />
          <Route path="/contact" element={<ContactNova />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-password/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password/reset" element={<ResetPassword />} />
          <Route
            path="/forgot-password/success"
            element={<RecoverySuccess />}
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminDashboard"
            element={
              <ProtectedRoute requiredRole="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nurseDashboard/*"
            element={
              <ProtectedRoute requiredRole="Nurse">
                <NurseDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/principalDashboard/*"
            element={
              <ProtectedRoute requiredRole="Principal">
                <PrincipalDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parentDashboard/*"
            element={
              <ProtectedRoute requiredRole="Parent">
                <ParentDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/health-lookup" element={<HealthLookupPage />} />
        </Routes>

        {/* Footer - hidden on login/signup pages and dashboard pages */}
        {!hideFooter && <NovaFooter />}
        
        {/* Global Toast Notification System */}
        <ToastNotification />
      </div>
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId="623576178799-bpcpe0v4n2961g59hrsdfhfpsb016mnh.apps.googleusercontent.com">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
