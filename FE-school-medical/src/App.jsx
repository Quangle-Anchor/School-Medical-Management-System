// import ManagerDashboard from './pages/managerDashboard';
import AdminDashboard from './pages/adminDashboard';
import NurseDashboard from './pages/nurseDashboard';
import ParentDashboard from './pages/parentDashboard';
import StudentDashboard from './pages/studentDashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import Navbar from './components/Navbar'; 
function App() {
  return (
    <BrowserRouter>
      <Navbar />
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
  {/* <Route path="/manager-dashboard" element={<ManagerDashboard />} /> */}
  <Route path="/admin-dashboard" element={<AdminDashboard />} />
  <Route path="/nurse-dashboard" element={<NurseDashboard />} />
  <Route path="/parent-dashboard" element={<ParentDashboard />} />
  <Route path="/student-dashboard" element={<StudentDashboard />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;