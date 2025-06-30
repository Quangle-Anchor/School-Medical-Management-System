import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/SideBar';
import DashboardCard from '../../components/DashboardCard';
import StudentsView from './StudentsView';
import NurseMedicationRequests from './NurseMedicationRequests';
import HealthIncidentsView from './HealthIncidentsView';
import InventoryView from './InventoryView';
import { Users, Calendar, FileText, Heart, Activity, Stethoscope, Bell, Warehouse } from 'lucide-react';
import  { healthIncidentAPI } from '../../api/healthIncidentApi';  
import { studentAPI } from '../../api/studentsApi';

const NurseDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [healthIncidents, setHealthIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  // Get current view from URL
  const getCurrentView = () => {
    const path = location.pathname;    
    if (path.includes('/students')) return 'students';
    if (path.includes('/appointments')) return 'appointments';
    if (path.includes('/medical-records')) return 'medical-records';
    if (path.includes('/health-incidents')) return 'health-incidents';
    if (path.includes('/medication-requests')) return 'medication-requests';
    if (path.includes('/notifications')) return 'notifications';
    if (path.includes('/inventory')) return 'inventory';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };
  const [activeView, setActiveView] = useState(getCurrentView());
  
  // Update active view when URL changes
  useEffect(() => {
    setActiveView(getCurrentView());
  }, [location.pathname]);

  // Fetch health incidents on component mount
  useEffect(() => {
    fetchHealthIncidents();
  }, []);
  // Fetch students on component mount  
  useEffect(() => {
    fetchStudents();
  }, []);
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMenuClick = (menuId) => {
    if (menuId === 'dashboard') {
      navigate('/nurseDashboard');
    } else {
      navigate(`/nurseDashboard/${menuId}`);
    }
    setActiveView(menuId);
  };

  const fetchStudents = async () => {
    try {
      console.log('Fetching students for nurse dashboard...');
      // Use getAllStudents to get all students in the database
      const studentsData = await studentAPI.getAllStudents();
      console.log('Received students data:', studentsData, 'Type:', typeof studentsData, 'IsArray:', Array.isArray(studentsData));
      setStudents(Array.isArray(studentsData) ? studentsData : []); // Ensure we always set an array
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };
  const fetchHealthIncidents = async () => {
    try {
      const incidents = await healthIncidentAPI.getAllHealthIncidents();
      setHealthIncidents(incidents || []); // Ensure we always set an array
    } catch (error) {
      console.error('Error fetching health incidents:', error);
      setHealthIncidents([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Nurse dashboard data
  const nurseCardData = [
    {
      title: 'Total Students',
      value: loading ? '...' : (Array.isArray(students) ? students.length : 0).toString(),
      change: 'Students in database',
      changeType: 'neutral',
      icon: Users,
    },
    {
      title: 'Appointments',
      value: '18',
      change: '6 remaining today',
      changeType: 'neutral',
      icon: Calendar,
    },    {
      title: 'Health Incidents',
      value: loading ? '...' : healthIncidents.length.toString(),
      change: 'Total recorded incidents',
      changeType: healthIncidents.length > 5 ? 'negative' : 'neutral',
      icon: Heart,
    },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'students':
        return <StudentsView />;
      
      case 'medication-requests':
        return <NurseMedicationRequests />;
      
      case 'appointments':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Appointments</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
              <p className="text-gray-600 mb-4">Manage today's appointments and patient visits.</p>
              <div className="space-y-3">
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">9:00 AM - Health Checkup</h3>
                      <p className="text-sm text-gray-600">Patient: John Smith</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">In Progress</span>
                  </div>
                </div>
                <div className="p-4 border-l-4 border-green-500 bg-green-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">10:30 AM - Vaccination</h3>
                      <p className="text-sm text-gray-600">Patient: Emma Johnson</p>
                    </div>
                    <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Completed</span>
                  </div>
                </div>
                <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">2:00 PM - Follow-up</h3>
                      <p className="text-sm text-gray-600">Patient: Michael Brown</p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">Upcoming</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'medical-records':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Medical Records</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Patient Records</h2>
              <p className="text-gray-600 mb-4">Access and update patient medical records and history.</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-medium">Records Updated</h3>
                    <p className="text-2xl font-bold text-blue-600">15</p>
                    <p className="text-sm text-gray-600">Today</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-medium">Pending Reviews</h3>
                    <p className="text-2xl font-bold text-yellow-600">8</p>
                    <p className="text-sm text-gray-600">Requiring attention</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-medium">Total Records</h3>
                    <p className="text-2xl font-bold text-green-600">1,247</p>
                    <p className="text-sm text-gray-600">In system</p>
                  </div>
                </div>
              </div>
            </div>
          </div>        );
      
      case 'health-incidents':
        return <HealthIncidentsView />;
      
    
      case 'notifications':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Alerts & Notifications</h2>
              <p className="text-gray-600 mb-4">Stay updated with important alerts and system notifications.</p>
              <div className="space-y-3">
                <div className="p-4 border-l-4 border-red-500 bg-red-50">
                  <h3 className="font-medium text-red-800">Emergency Alert</h3>
                  <p className="text-sm text-red-600">Patient in Room 205 requires immediate attention</p>
                  <p className="text-xs text-red-500">5 minutes ago</p>
                </div>
                <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                  <h3 className="font-medium text-yellow-800">Medication Reminder</h3>
                  <p className="text-sm text-yellow-600">Time for medication round - Ward B</p>
                  <p className="text-xs text-yellow-500">15 minutes ago</p>
                </div>
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <h3 className="font-medium text-blue-800">Schedule Update</h3>
                  <p className="text-sm text-blue-600">Tomorrow's shift schedule has been updated</p>
                  <p className="text-xs text-blue-500">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>        );      
      
      case 'inventory':
        return <InventoryView />;

      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Nurse Settings</h2>
              <p className="text-gray-600 mb-4">Configure your preferences and account settings.</p>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Notification Preferences</h3>
                  <p className="text-sm text-gray-600">Manage alert settings and notification types</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Shift Schedule</h3>
                  <p className="text-sm text-gray-600">View and update your work schedule</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Profile Information</h3>
                  <p className="text-sm text-gray-600">Update your professional profile and credentials</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-6 space-y-6 bg-gray-50 min-h-full">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Nurse Dashboard
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Welcome back! Here's your patient care overview and daily tasks.
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Emergency Protocol
                </button>
              </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {nurseCardData.map((card, index) => (
                <DashboardCard key={index} {...card} />
              ))}
            </div>

            {/* Patient Care Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Recent Patient Activities</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Health checkup completed - John Smith</p>
                      <p className="text-xs text-gray-600">10 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Medication administered - Emma Johnson</p>
                      <p className="text-xs text-gray-600">25 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Vital signs recorded - Michael Brown</p>
                      <p className="text-xs text-gray-600">45 minutes ago</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Care Plan Tasks</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Wound dressing change</p>
                      <p className="text-xs text-gray-600">Room 302 - Due: 2:00 PM</p>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded">
                      Complete
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Medication round</p>
                      <p className="text-xs text-gray-600">Ward B - Due: 3:00 PM</p>
                    </div>
                    <button className="px-3 py-1 bg-yellow-600 text-white text-xs rounded">
                      Pending
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Patient discharge prep</p>
                      <p className="text-xs text-gray-600">Room 105 - Due: 4:30 PM</p>
                    </div>
                    <button className="px-3 py-1 bg-green-600 text-white text-xs rounded">
                      Ready
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={toggleSidebar} 
        userRole="nurse"
        activeMenu={activeView}
        onMenuClick={handleMenuClick}
      />
      
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default NurseDashboard;
