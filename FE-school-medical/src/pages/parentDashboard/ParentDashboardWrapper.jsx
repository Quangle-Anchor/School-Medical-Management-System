import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/SideBar';
import ChartCard from '../../components/ChartCard';
import DashboardCard from '../../components/DashboardCard';
import HealthEventsView from '../../components/HealthEventsView';
import UpcomingHealthEventsCard from '../../components/UpcomingHealthEventsCard';
import MyChildView from './MyChildView';
import AddStudentForm from './AddStudentForm';
import MyMedicationRequests from './MyMedicationRequests';
import HealthIncidentsView from '../nurseDashboard/HealthIncidentsView';
import { User, Calendar, FileText, Heart, Plus } from 'lucide-react';
import { studentAPI } from '../../api/studentsApi';
import  { healthIncidentAPI } from '../../api/healthIncidentApi';  
import { medicationAPI } from '../../api/medicationApi';
import { healthEventAPI } from '../../api/healthEventApi';
import { formatEventDate, getCategoryStyle, safeDisplay } from '../../utils/dashboardUtils';


const ParentDashboardWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [healthIncidentsCount, setHealthIncidentsCount] = useState(0);
  const [medicationRequestsCount, setMedicationRequestsCount] = useState(0);
  const [futureHealthEventsCount, setFutureHealthEventsCount] = useState(0);

  // Get current view from URL
  const getCurrentView = () => {
    const path = location.pathname;    if (path.includes('/my-child')) return 'my-child';
    if (path.includes('/health-event')) return 'health-event';
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
    fetchMedicationRequests();
    fetchFutureHealthEventsCount();
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

  const fetchMedicationRequests = async () => {
    try {
      const medicationRequests = await medicationAPI.getMyMedicationRequests();
      setMedicationRequestsCount(medicationRequests ? medicationRequests.length : 0);
    } catch (error) {
      console.error('Error fetching medication requests:', error);
      setMedicationRequestsCount(0);
    }
  };

  const fetchFutureHealthEventsCount = async () => {
    try {
      const events = await healthEventAPI.getUpcomingEvents(); // Get all upcoming events
      setFutureHealthEventsCount(events ? events.length : 0);
    } catch (error) {
      console.error('Error fetching future health events count:', error);
      setFutureHealthEventsCount(0);
    }
  };
  const handleStudentAdded = (newStudent) => {
    setStudents(prev => [...prev, newStudent]);
    // Refresh health incidents count after adding a new student
    // The useEffect will handle fetching incidents for the new student
  };

  const handleMedicationRequestAdded = () => {
    // Refresh medication requests count when a new request is added
    fetchMedicationRequests();
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
      case 'health-event':
        navigate('/parentDashboard/health-event');
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


  // Dashboard cards data
  const parentCardData = [
    { 
      title: 'My Children', 
      value: loading ? '...' : students.length.toString(), 
      change: 'Active students',
      changeType: 'neutral',
      icon: User
    },
    { 
      title: 'Upcoming Health Events', 
      value: loading ? '...' : futureHealthEventsCount.toString(), 
      change: 'Scheduled events',
      changeType: 'positive',
      icon: Calendar
    },    { 
      title: 'Health Incidents', 
      value: loading ? '...' : healthIncidentsCount.toString(),
      change: 'Health incidents',
      changeType: 'neutral',
      icon: FileText
    },
    { 
      title: 'Medication Requests', 
      value: loading ? '...' : medicationRequestsCount.toString(),
      change: 'Total requests sent',
      changeType: 'neutral',
      icon: Heart
    },
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

// Content rendering in Siderbar
  const renderContent = () => {  
    switch (activeView) {
      case 'my-child':
        return (
          <MyChildView 
            students={students} 
            onStudentAdded={handleStudentAdded}
            onAddStudent={() => setShowAddForm(true)}
          />
        );
      case 'health-event':
        return <HealthEventsView userRole="parent" />;      

        
        case 'medical-records':
        return <HealthIncidentsView isParentView={true} students={students} parentLoading={loading} />;
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
        return <MyMedicationRequests onRequestAdded={handleMedicationRequestAdded} />;

      case 'medication-requests':
        return <MyMedicationRequests onRequestAdded={handleMedicationRequestAdded} />;

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
              
              {/* Upcoming Health Events */}
              <UpcomingHealthEventsCard 
                userRole="parent"
                onViewAll={() => handleMenuClick('health-event')}
              />
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