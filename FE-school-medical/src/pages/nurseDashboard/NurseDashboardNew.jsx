import React, { useState } from 'react';
import Sidebar from '../../components/SideBar';
import DashboardCard from '../../components/DashboardCard';
import { Users, Calendar, FileText, Heart, Activity, Stethoscope, Bell } from 'lucide-react';

const NurseDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMenuClick = (menuId) => {
    setActiveView(menuId);
  };

  // Nurse dashboard data
  const nurseCardData = [
    {
      title: 'Patients Today',
      value: '24',
      change: '+3 from yesterday',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Appointments',
      value: '18',
      change: '6 remaining today',
      changeType: 'neutral',
      icon: Calendar,
    },
    {
      title: 'Health Checkups',
      value: '12',
      change: 'Completed today',
      changeType: 'positive',
      icon: Heart,
    },
    {
      title: 'Emergency Cases',
      value: '2',
      change: 'Active alerts',
      changeType: 'negative',
      icon: Stethoscope,
    },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'patients':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Patients</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Patient Management</h2>
              <p className="text-gray-600 mb-4">View and manage patient information and care plans.</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Active Patients</h3>
                    <p className="text-sm text-gray-600">24 patients under care today</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Recent Admissions</h4>
                    <p className="text-sm text-gray-600">3 new patients admitted</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Discharge Planning</h4>
                    <p className="text-sm text-gray-600">5 patients ready for discharge</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
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
          </div>
        );
      
      case 'health-checkups':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Health Checkups</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Checkup Management</h2>
              <p className="text-gray-600 mb-4">Conduct and track routine health checkups and screenings.</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Routine Checkups</h3>
                    <p className="text-sm text-gray-600">Annual physical examinations and wellness checks</p>
                    <button className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded">Schedule</button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Specialized Screenings</h3>
                    <p className="text-sm text-gray-600">Targeted health screenings and tests</p>
                    <button className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded">Manage</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
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
          </div>
        );
      
      case 'emergency':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Emergency</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Emergency Response</h2>
              <p className="text-gray-600 mb-4">Handle emergency situations and critical care protocols.</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
                    <h3 className="font-medium text-red-800">Active Emergencies</h3>
                    <p className="text-2xl font-bold text-red-600">2</p>
                    <p className="text-sm text-red-600">Requiring immediate response</p>
                  </div>
                  <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
                    <h3 className="font-medium text-green-800">Response Time</h3>
                    <p className="text-2xl font-bold text-green-600">2.5 min</p>
                    <p className="text-sm text-green-600">Average today</p>
                  </div>
                </div>
                <button className="w-full py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700">
                  EMERGENCY ALERT
                </button>
              </div>
            </div>
          </div>
        );
      
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
