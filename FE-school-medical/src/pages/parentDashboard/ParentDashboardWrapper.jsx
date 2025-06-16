import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Dashboard from '../../components/DashBoard';
import MyChildView from '../../components/MyChildView';
import AddStudentForm from '../../components/AddStudentForm';
import { User, Calendar, FileText, Heart, Plus } from 'lucide-react';
import { studentAPI } from '../../api/studentsApi';

const ParentDashboardWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get current view from URL
  const getCurrentView = () => {
    const path = location.pathname;
    if (path.includes('/my-child')) return 'my-child';
    if (path.includes('/appointments')) return 'appointments';
    if (path.includes('/medical-records')) return 'medical-records';
    if (path.includes('/health-reports')) return 'health-reports';
    if (path.includes('/notifications')) return 'notifications';
    if (path.includes('/messages')) return 'messages';
    if (path.includes('/health-tips')) return 'health-tips';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const [activeView, setActiveView] = useState(getCurrentView());

  // Update active view when URL changes
  useEffect(() => {
    setActiveView(getCurrentView());
  }, [location.pathname]);

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const studentsData = await studentAPI.getAllStudents();
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentAdded = (newStudent) => {
    setStudents(prev => [...prev, newStudent]);
  };

  const handleMenuClick = (menuId) => {
    // Update URL and let React Router handle the navigation
    switch (menuId) {
      case 'dashboard':
        navigate('/parentDashboard');
        break;
      case 'my-child':
        navigate('/parentDashboard/my-child');
        break;
      case 'appointments':
        navigate('/parentDashboard/appointments');
        break;
      case 'medical-records':
        navigate('/parentDashboard/medical-records');
        break;
      case 'health-reports':
        navigate('/parentDashboard/health-reports');
        break;
      case 'notifications':
        navigate('/parentDashboard/notifications');
        break;
      case 'messages':
        navigate('/parentDashboard/messages');
        break;
      case 'health-tips':
        navigate('/parentDashboard/health-tips');
        break;
      case 'settings':
        navigate('/parentDashboard/settings');
        break;
      default:
        navigate('/parentDashboard');
    }
  };

  const parentCardData = [
    { 
      title: 'My Children', 
      value: loading ? '...' : students.length.toString(), 
      change: 'Active profiles',
      changeType: 'neutral',
      icon: User
    },
    { 
      title: 'Upcoming Appointments', 
      value: '1', 
      change: 'This week',
      changeType: 'positive',
      icon: Calendar
    },
    { 
      title: 'Health Records', 
      value: '12', 
      change: 'Total documents',
      changeType: 'neutral',
      icon: FileText
    },
    { 
      title: 'Health Score', 
      value: '85%', 
      change: '+5% from last month',
      changeType: 'positive',
      icon: Heart
    },
  ];

  const renderContent = () => {  // Content rendering in Siderbar
    switch (activeView) {
      case 'my-child':
        return (
          <MyChildView 
            students={students} 
            onStudentAdded={handleStudentAdded}
            onAddStudent={() => setShowAddForm(true)}
          />
        );
      case 'appointments':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Appointments</h1>
            <p>Appointments content coming soon...</p>
          </div>
        );
      case 'medical-records':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Medical Records</h1>
            <p>Medical records content coming soon...</p>
          </div>
        );
      case 'health-reports':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Health Reports</h1>
            <p>Health reports content coming soon...</p>
          </div>
        );
      case 'notifications':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            <p>Notifications content coming soon...</p>
          </div>
        );
      case 'messages':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Messages</h1>
            <p>Messages content coming soon...</p>
          </div>
        );
      case 'health-tips':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Health Tips</h1>
            <p>Health tips content coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <p>Settings content coming soon...</p>
          </div>
        );
      default:
        return (
          <Dashboard 
            cardData={parentCardData} 
            userRole="parent"
            onMenuClick={handleMenuClick}
            activeMenu={activeView}
            customActions={
              <button 
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Student</span>
              </button>
            }
          />
        );
    }
  };

  return (
    <>
      {renderContent()}
      
      <AddStudentForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onStudentAdded={handleStudentAdded}
      />
    </>
  );
};

export default ParentDashboardWrapper;