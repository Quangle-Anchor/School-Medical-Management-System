import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import PrincipalDashboard from "./pages/principalDashboard/PrincipalDashboard";
import NurseDashboard from "./pages/nurseDashboard/NurseDashboardNew";
import ParentDashboard from "./pages/parentDashboard/ParentDashboardWrapper";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/Settings/Settings";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom"; // Thêm Navigate
import { useState, useEffect } from "react";

import AboutPage from "./pages/about/About";
import HomePage from "./pages/home/Homepage";
import Contact from "./pages/Contact/Contact";
import HealthLookupPage from "./pages/HealthLookupPage/HealthLookupPage";
import LoginPage from "./pages/login/Login";
import SignUp from "./pages/login/SignUp";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import VerifyOtp from "./pages/forgotPassword/VerifyOtp";
import ResetPassword from "./pages/forgotPassword/ResetPassword";
import RecoverySuccess from "./pages/forgotPassword/RecoverySuccess";

import backgroundImg from "./assets/img/back.png";

function AppContent() {
  const location = useLocation();
  const hideFooter = ["/login", "/signup"].includes(location.pathname);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMouseNearTop, setIsMouseNearTop] = useState(false);

  // Lấy trạng thái đăng nhập từ localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  useEffect(() => {
    if (hideFooter) return; // Don't apply scroll behavior on login/signup pages

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        // Always show navbar at the top of the page
        setIsNavbarVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past threshold - hide navbar
        if (!isMouseNearTop) {
          setIsNavbarVisible(false);
        }
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navbar
        setIsNavbarVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    const handleMouseMove = (e) => {
      // Show navbar when mouse is near the top 100px of the screen
      const isNearTop = e.clientY <= 100;
      setIsMouseNearTop(isNearTop);

      if (isNearTop && !isNavbarVisible) {
        setIsNavbarVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [lastScrollY, isNavbarVisible, isMouseNearTop, hideFooter]);

  return (
    <div className="min-h-screen relative">
      {/* Background overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div> */}

      {/* Smart Navbar - always visible, but smart behavior only on non-login/signup pages */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
          hideFooter || isNavbarVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Navbar />
      </div>

      {/* Main content area with padding for navbar */}
      <div className="relative z-10 pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          {/* Chỉ cho phép truy cập Health Lookup khi chưa đăng nhập */}
          <Route
            path="/health-lookup"
            element={
              !isAuthenticated ? (
                <HealthLookupPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<Contact />} />
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
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
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
        </Routes>

        {/* Footer - hidden on login/signup pages */}
        {!hideFooter && <Footer />}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
