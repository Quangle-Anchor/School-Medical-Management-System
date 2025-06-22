import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import ManagerDashboard from "./pages/managerDashboard/ManagerDashboard";
import NurseDashboard from "./pages/nurseDashboard/NurseDashboardNew";
import ParentDashboard from "./pages/parentDashboard/ParentDashboardWrapper";
import StudentDashboard from "./pages/studentDashboard/StudentDashboardNew";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import AboutPage from "./pages/about/About";
import HomePage from "./pages/home/Homepage";
import Contact from "./pages/Contact/Contact";
import LoginPage from "./pages/login/Login";
import SignUp from "./pages/login/SignUp";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {
  const location = useLocation();
  const hideNavbarFooter = ['/login', '/signup'].includes(location.pathname);

  return (
    <>
     <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/adminDashboard"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />{" "}
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
      {!hideNavbarFooter && <Footer />}
    </>
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
