// import ManagerDashboard from './pages/managerDashboard/index.jsx';
import AdminDashboard from "./pages/adminDashboard";
import NurseDashboard from "./pages/nurseDashboard";
import ParentDashboard from "./pages/parentDashboard";
import StudentDashboard from "./pages/studentDashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AboutPage from "./pages/about/About";
import HomePage from "./pages/home/Homepage";
import LoginPage from "./pages/login/Login";
import Navbar from "./components/Navbar";
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
    </BrowserRouter>
  );
}

export default App;
