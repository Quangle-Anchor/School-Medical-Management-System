import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/SideBar';
import ChartCard from '../../components/ChartCard';
import DashboardCard from '../../components/DashboardCard';
import MyChildView from './MyChildView';
import AddStudentForm from './AddStudentForm';
import MyMedicationRequests from './MyMedicationRequests';
import HealthIncidentsView from '../nurseDashboard/HealthIncidentsView';
import { User, Calendar, FileText, Heart, Plus } from 'lucide-react';
import { studentAPI } from '../../api/studentsApi';
import  { healthIncidentAPI } from '../../api/healthIncidentApi';  


const ParentDashboardWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [healthIncidentsCount, setHealthIncidentsCount] = useState(0);

  // Get current view from URL
  const getCurrentView = () => {
    const path = location.pathname;    if (path.includes('/my-child')) return 'my-child';
    if (path.includes('/appointments')) return 'appointments';
    if (path.includes('/medical-records')) return 'medical-records';
    if (path.includes('/health-reports')) return 'health-reports';
    if (path.includes('/medication-requests')) return 'medication-requests';
    if (path.includes('/notifications')) return 'notifications';
    if (path.includes('/messages')) return 'messages';
    if (path.includes('/medical-request')) return 'medical-request';
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

  // Fetch health incidents after students are loaded
  useEffect(() => {
    if (students.length > 0) {
      fetchHealthIncidents();
    } else if (students.length === 0 && !loading) {
      setHealthIncidentsCount(0);
    }
  }, [students, loading]);
  const fetchStudents = async () => {
    try {
      const studentsData = await studentAPI.getMyStudents();
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };  const fetchHealthIncidents = async () => {
    try {
      if (students.length === 0) {
        setHealthIncidentsCount(0);
        return;
      }

      let totalCount = 0;
      // Fetch health incidents for each student
      for (const student of students) {
        try {
          const incidents = await healthIncidentAPI.getHealthIncidentsByStudent(student.studentId);
          totalCount += incidents ? incidents.length : 0;
        } catch (error) {
          console.error(`Error fetching health incidents for student ${student.studentId}:`, error);
          // Continue with other students even if one fails
        }
      }
      setHealthIncidentsCount(totalCount);
    } catch (error) {
      console.error('Error fetching health incidents:', error);
      setHealthIncidentsCount(0);
    }
  };
  const handleStudentAdded = (newStudent) => {
    setStudents(prev => [...prev, newStudent]);
    // Refresh health incidents count after adding a new student
    // The useEffect will handle fetching incidents for the new student
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
      case 'medical-request':
        navigate('/parentDashboard/medical-request');
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
    },    { 
      title: 'Health Records', 
      value: loading ? '...' : healthIncidentsCount.toString(),
      change: 'Health incidents',
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

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

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
        );      case 'medical-records':
        return <HealthIncidentsView isParentView={true} students={students} />;
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
          </div>        );
      case 'medical-request':
        return <MyMedicationRequests />;
      case 'medication-requests':
        return <MyMedicationRequests />;
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <p>Settings content coming soon...</p>
          </div>
        );   
      default:
        return (
          <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Parent Dashboard
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Welcome back! Here's your child's health overview and updates.
                  </p>
                </div>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Student</span>
                </button>
              </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {parentCardData.map((card, index) => (
                <DashboardCard key={index} {...card} />
              ))}
            </div>

            {/* Charts and Calendar Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calendar Card */}
              <ChartCard userRole="parent" />
              
              {/* Recent Activity */}
              <div className="bg-white rounded-lg border border-gray-200 p-6"
                style={{
                  background: `linear-gradient(
                    45deg,
                    rgba(142,197,252,1)   0%,
                    rgba(141,211,255,1)  25%,
                    rgba(161,216,255,1)  50%,
                    rgba(193,210,255,1)  75%,
                    rgba(224,195,255,1) 100%
                  )`
                }}>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <p className="text-sm text-gray-600">
                    Latest updates about your child's health
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    { action: 'Health checkup completed', time: '2 days ago', type: 'checkup' },
                    { action: 'Vaccination reminder', time: '1 week ago', type: 'reminder' },
                    { action: 'Medical report available', time: '2 weeks ago', type: 'report' },
                    { action: 'Appointment scheduled', time: '3 weeks ago', type: 'appointment' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-md hover:bg-white/20 transition-colors">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.action}</p>
                        <p className="text-xs text-gray-700">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={toggleSidebar} 
        userRole="parent"
        activeMenu={activeView}
        onMenuClick={handleMenuClick}
      />
      
      <main className="flex-1">
        {renderContent()}
      </main>
      
      <AddStudentForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onStudentAdded={handleStudentAdded}
      />
    </div>
  );
};

export default ParentDashboardWrapper;