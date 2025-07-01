import React, { useState } from 'react';
import Sidebar from '../../components/SideBar';
import DashboardCard from '../../components/DashboardCard';
import ChartCard from '../../components/ChartCard';
import { Heart, Calendar, FileText, Bell, Activity, BookOpen } from 'lucide-react';

const StudentDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMenuClick = (menuId) => {
    setActiveView(menuId);
  };

  // Student dashboard data
  const studentCardData = [
    {
      title: 'Health Score',
      value: '92%',
      change: '+3% this month',
      changeType: 'positive',
      icon: Heart,
    },
    {
      title: 'Next Appointment',
      value: 'Jun 25',
      change: 'Annual checkup',
      changeType: 'neutral',
      icon: Calendar,
    },
    {
      title: 'Health Records',
      value: '8',
      change: 'Documents available',
      changeType: 'neutral',
      icon: FileText,
    },
    {
      title: 'Notifications',
      value: '2',
      change: '1 new health tip',
      changeType: 'positive',
      icon: Bell,
    },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'my-health':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">My Health</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Health Overview</h2>
              <p className="text-gray-600 mb-4">Track your health status and wellness metrics.</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Current Health Status</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Overall Score</span>
                        <span className="text-sm font-medium text-green-600">92%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">BMI</span>
                        <span className="text-sm font-medium">21.5 (Normal)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Blood Pressure</span>
                        <span className="text-sm font-medium text-green-600">120/80</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Last Checkup</span>
                        <span className="text-sm font-medium">2 months ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Vaccination Status</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">COVID-19</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Up to date</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Flu Shot</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Current</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tetanus</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Due soon</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Health Goals</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Daily Exercise (30 min)</span>
                      <span className="text-sm font-medium text-green-600">5/7 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Water Intake (8 glasses)</span>
                      <span className="text-sm font-medium text-blue-600">6/8 today</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sleep (8 hours)</span>
                      <span className="text-sm font-medium text-green-600">7.5 hrs avg</span>
                    </div>
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
              <h2 className="text-lg font-semibold mb-4">My Appointments</h2>
              <p className="text-gray-600 mb-4">View and manage your medical appointments.</p>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Annual Health Checkup</h3>
                      <p className="text-sm text-gray-600">June 25, 2025 at 2:00 PM</p>
                      <p className="text-sm text-gray-600">Dr. Smith - General Medicine</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">Upcoming</span>
                  </div>
                </div>
                <div className="p-4 border-l-4 border-green-500 bg-green-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Dental Cleaning</h3>
                      <p className="text-sm text-gray-600">June 18, 2025 at 10:00 AM</p>
                      <p className="text-sm text-gray-600">Dr. Johnson - Dental</p>
                    </div>
                    <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Completed</span>
                  </div>
                </div>
                <div className="p-4 border-l-4 border-gray-300 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Eye Examination</h3>
                      <p className="text-sm text-gray-600">May 15, 2025 at 11:30 AM</p>
                      <p className="text-sm text-gray-600">Dr. Brown - Ophthalmology</p>
                    </div>
                    <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">Past</span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Schedule New Appointment
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'health-records':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Health Records</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">My Medical Records</h2>
              <p className="text-gray-600 mb-4">Access your medical history and health documents.</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Recent Records</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Annual Checkup Report</span>
                        <button className="text-blue-600 text-xs hover:underline">View</button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Blood Test Results</span>
                        <button className="text-blue-600 text-xs hover:underline">View</button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Vaccination Record</span>
                        <button className="text-blue-600 text-xs hover:underline">View</button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Document Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Records</span>
                        <span className="text-sm font-medium">8 documents</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Lab Results</span>
                        <span className="text-sm font-medium">3 documents</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Prescriptions</span>
                        <span className="text-sm font-medium">2 documents</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Reports</span>
                        <span className="text-sm font-medium">3 documents</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Emergency Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Emergency Contact</p>
                      <p className="text-sm text-gray-600">Parent: (555) 123-4567</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Allergies</p>
                      <p className="text-sm text-gray-600">Penicillin, Shellfish</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Blood Type</p>
                      <p className="text-sm text-gray-600">O+</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Medical ID</p>
                      <p className="text-sm text-gray-600">STU-2025-001</p>
                    </div>
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
              <h2 className="text-lg font-semibold mb-4">Health Notifications</h2>
              <p className="text-gray-600 mb-4">Stay updated with important health reminders and alerts.</p>
              <div className="space-y-3">
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <h3 className="font-medium text-blue-800">Appointment Reminder</h3>
                  <p className="text-sm text-blue-600">Your annual checkup is scheduled for June 25 at 2:00 PM</p>
                  <p className="text-xs text-blue-500">1 week from now</p>
                </div>
                <div className="p-4 border-l-4 border-green-500 bg-green-50">
                  <h3 className="font-medium text-green-800">New Health Tip</h3>
                  <p className="text-sm text-green-600">Staying hydrated: Tips for maintaining proper hydration</p>
                  <p className="text-xs text-green-500">2 hours ago</p>
                </div>
                <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                  <h3 className="font-medium text-yellow-800">Vaccination Due</h3>
                  <p className="text-sm text-yellow-600">Tetanus vaccination is due next month</p>
                  <p className="text-xs text-yellow-500">1 day ago</p>
                </div>
                <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                  <h3 className="font-medium text-purple-800">Health Goal Update</h3>
                  <p className="text-sm text-purple-600">Congratulations! You've met your exercise goal for this week</p>
                  <p className="text-xs text-purple-500">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'health-tips':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Health Tips</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Health & Wellness Tips</h2>
              <p className="text-gray-600 mb-4">Learn about healthy habits and wellness practices.</p>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Daily Hydration</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Drinking enough water is essential for your health. Aim for 8 glasses of water daily 
                    to maintain proper hydration and support your body's functions.
                  </p>
                  <span className="text-xs text-blue-600">Nutrition • June 18, 2025</span>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Exercise for Students</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Regular physical activity improves concentration and academic performance. 
                    Try to get at least 30 minutes of activity daily, even if it's just walking.
                  </p>
                  <span className="text-xs text-green-600">Fitness • June 15, 2025</span>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Healthy Sleep Habits</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Quality sleep is crucial for your physical and mental health. Maintain a 
                    consistent sleep schedule and aim for 7-9 hours of sleep each night.
                  </p>
                  <span className="text-xs text-purple-600">Wellness • June 12, 2025</span>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Stress Management</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Managing stress is important for your overall well-being. Practice deep breathing, 
                    meditation, or engage in hobbies you enjoy to help reduce stress levels.
                  </p>
                  <span className="text-xs text-orange-600">Mental Health • June 10, 2025</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
              <p className="text-gray-600 mb-4">Manage your account preferences and health information.</p>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Personal Information</h3>
                  <p className="text-sm text-gray-600">Update your contact details and emergency information</p>
                  <button className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded">Edit</button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Notification Preferences</h3>
                  <p className="text-sm text-gray-600">Choose how you want to receive health notifications</p>
                  <button className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded">Configure</button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Privacy Settings</h3>
                  <p className="text-sm text-gray-600">Control who can access your health information</p>
                  <button className="mt-2 px-3 py-1 bg-purple-600 text-white text-sm rounded">Manage</button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Health Goals</h3>
                  <p className="text-sm text-gray-600">Set and customize your personal health goals</p>
                  <button className="mt-2 px-3 py-1 bg-orange-600 text-white text-sm rounded">Update</button>
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
                    Student Dashboard
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Welcome back! Here's your health overview and wellness tracking.
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Health Report
                </button>
              </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {studentCardData.map((card, index) => (
                <DashboardCard key={index} {...card} />
              ))}
            </div>

            {/* Health Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Health Tracker</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Daily Exercise</h3>
                      <p className="text-sm text-gray-600">30 minutes recommended</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded">Completed</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Water Intake</h3>
                      <p className="text-sm text-gray-600">6/8 glasses today</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">In Progress</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Sleep Quality</h3>
                      <p className="text-sm text-gray-600">7.5 hours last night</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded">Good</span>
                  </div>
                </div>
              </div>
              
              {/* Calendar Card */}
              <ChartCard userRole="student" />
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
        userRole="student"
        activeMenu={activeView}
        onMenuClick={handleMenuClick}
      />
      
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default StudentDashboard;
