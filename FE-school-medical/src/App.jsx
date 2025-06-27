import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import ManagerDashboard from "./pages/managerDashboard/ManagerDashboard";
import NurseDashboard from "./pages/nurseDashboard/NurseDashboardNew";
import ParentDashboard from "./pages/parentDashboard/ParentDashboardWrapper";
import StudentDashboard from "./pages/studentDashboard/StudentDashboardNew";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/Settings/Settings";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import AboutPage from "./pages/about/About";
import HomePage from "./pages/home/Homepage";
import Contact from "./pages/Contact/Contact";
import Calendar from "./pages/calendar/Calendar";
import LoginPage from "./pages/login/Login";
import SignUp from "./pages/login/SignUp";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import backgroundImg from "./assets/img/back.png";

function AppContent() {
  const location = useLocation();
  const hideFooter = ['/login', '/signup'].includes(location.pathname);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMouseNearTop, setIsMouseNearTop] = useState(false);

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

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };  }, [lastScrollY, isNavbarVisible, isMouseNearTop, hideFooter]);

  return (
    <div 
      className="min-h-screen relative"
    
    >
      {/* Background overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div> */}
      
      {/* Smart Navbar - always visible, but smart behavior only on non-login/signup pages */}
      <div 
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
          (hideFooter || isNavbarVisible) ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <Navbar />
      </div>

      {/* Main content area with padding for navbar */}
      <div className="relative z-10 pt-16">
        <Routes>        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
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
          path="/managerDashboard"
          element={
            <ProtectedRoute requiredRole="Manager">
              <ManagerDashboard />
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
        <Route
          path="/studentDashboard"
          element={
            <ProtectedRoute requiredRole="Student">
              <StudentDashboard />
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
