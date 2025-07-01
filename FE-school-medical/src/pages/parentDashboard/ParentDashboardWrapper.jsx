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
import { medicationAPI } from '../../api/medicationApi';
import { healthEventAPI } from '../../api/healthEventApi';


const ParentDashboardWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [healthIncidentsCount, setHealthIncidentsCount] = useState(0);
  const [medicationRequestsCount, setMedicationRequestsCount] = useState(0);
  const [futureHealthEvents, setFutureHealthEvents] = useState([]);

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
    fetchFutureHealthEvents();
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

  const fetchFutureHealthEvents = async () => {
    try {
      const events = await healthEventAPI.getUpcomingEvents(); // Get all upcoming events
      setFutureHealthEvents(events || []);
    } catch (error) {
      console.error('Error fetching future health events:', error);
      setFutureHealthEvents([]);
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
      value: loading ? '...' : futureHealthEvents.length.toString(), 
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

  // Format date for display
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
    return date.toLocaleDateString();
  };

  // Get category icon and color
  const getCategoryStyle = (category) => {
    const styles = {
      'Vaccination': { color: 'bg-blue-600', icon: '💉' },
      'General Checkup': { color: 'bg-green-600', icon: '🩺' },
      'Dental': { color: 'bg-purple-600', icon: '🦷' },
      'Vision': { color: 'bg-orange-600', icon: '👁️' },
      'Physical': { color: 'bg-red-600', icon: '🏃' },
      'Mental Health': { color: 'bg-indigo-600', icon: '🧠' },
      'default': { color: 'bg-gray-600', icon: '📅' }
    };
    return styles[category] || styles.default;
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
        return (
          <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Health Events</h1>
                  <p className="text-gray-600 mt-2">
                    View upcoming health events and appointments for your children
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Filter Events
                </button>
              </div>
            </div>

            {/* Future Health Events List */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Health Events</h2>
                <p className="text-sm text-gray-600 mt-1">Scheduled health events for your children</p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {futureHealthEvents.length > 0 ? (
                  futureHealthEvents.map((event, index) => {
                    const categoryStyle = getCategoryStyle(event.category);
                    return (
                      <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 ${categoryStyle.color} rounded-lg flex items-center justify-center text-white text-lg font-semibold`}>
                            {categoryStyle.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {event.category}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    Created by {event.createdBy}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900">
                                  {formatEventDate(event.scheduleDate)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(event.scheduleDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming health events</h3>
                    <p className="text-gray-600">Health events will appear here when they are scheduled by healthcare staff.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );      

        
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
              
              {/* Future Health Events */}
              <div className="bg-white rounded-lg border border-gray-200 p-6"
                style={{
        background: 'radial-gradient(at center, #E8FEFF, #FFFFFF)'
      }}>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Health Events</h3>
                  <p className="text-sm text-gray-600">
                    Scheduled health events for your child
                  </p>
                </div>
                <div className="space-y-4">
                  {futureHealthEvents.length > 0 ? (
                    futureHealthEvents.slice(0, 4).map((event, index) => {
                      const categoryStyle = getCategoryStyle(event.category);
                      return (
                        <div key={index} className="flex items-center space-x-3 p-3 rounded-md hover:bg-white/20 transition-colors">
                          <div className={`w-8 h-8 ${categoryStyle.color} rounded-full flex items-center justify-center text-white text-xs font-semibold`}>
                            {categoryStyle.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{event.title}</p>
                            <p className="text-xs text-gray-600">{event.category}</p>
                            <p className="text-xs text-gray-500">{formatEventDate(event.scheduleDate)}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">No upcoming health events</p>
                      <p className="text-xs text-gray-400">Health events will appear here when scheduled</p>
                    </div>
                  )}
                  {futureHealthEvents.length > 4 && (
                    <div className="text-center pt-2">
                      <button 
                        onClick={() => handleMenuClick('health-event')}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View all {futureHealthEvents.length} events →
                      </button>
                    </div>
                  )}
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