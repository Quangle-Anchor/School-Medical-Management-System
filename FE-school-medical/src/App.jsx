// import ManagerDashboard from './pages/managerDashboard/index.jsx';
import AdminDashboard from "./pages/adminDashboard";
import NurseDashboard from "./pages/nurseDashboard/NurseDashboard";
import ParentDashboard from "./pages/parentDashboard/ParentDashboard";
import StudentDashboard from "./pages/studentDashboard/StudentDashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AboutPage from "./pages/about/About";
import HomePage from "./pages/home/Homepage";
import LoginPage from "./pages/login/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/managerDashboard" element={<ManagerDashboard />} /> */}
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/nurseDashboard" element={<NurseDashboard />} />
        <Route path="/parentDashboard" element={<ParentDashboard />} />
        <Route path="/studentDashboard" element={<StudentDashboard />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
