import React, { useState } from 'react';
import Sidebar from '../../components/SideBar';
import DashboardCard from '../../components/DashboardCard';
import ChartCard from '../../components/ChartCard';
import { Users, Settings, FileText, Bell, Activity, Stethoscope } from 'lucide-react';

const AdminDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMenuClick = (menuId) => {
    setActiveView(menuId);
  };

  // Admin dashboard data
  const adminCardData = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12% from last month',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'System Health',
      value: '99.9%',
      change: 'Operational',
      changeType: 'positive',
      icon: Activity,
    },
    {
      title: 'Reports Generated',
      value: '156',
      change: '+23 this week',
      changeType: 'positive',
      icon: FileText,
    },
    {
      title: 'Active Alerts',
      value: '3',
      change: '2 resolved today',
      changeType: 'neutral',
      icon: Bell,
    },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'user-management':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Manage System Users</h2>
              <p className="text-gray-600 mb-4">Create, edit, and manage user accounts across the system.</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Total Active Users</h3>
                    <p className="text-sm text-gray-600">2,847 users currently active</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Manage Users
                  </button>
                </div>
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Role Permissions</h3>
                    <p className="text-sm text-gray-600">Configure user roles and permissions</p>
                  </div>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Configure Roles
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'system-settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">System Settings</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">System Configuration</h2>
              <p className="text-gray-600 mb-4">Configure system-wide settings and preferences.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Database Settings</h3>
                  <p className="text-sm text-gray-600">Configure database connections and optimization</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Security Settings</h3>
                  <p className="text-sm text-gray-600">Manage security policies and authentication</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Backup Settings</h3>
                  <p className="text-sm text-gray-600">Schedule and manage system backups</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Notification Settings</h3>
                  <p className="text-sm text-gray-600">Configure system notifications and alerts</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'reports':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Reports</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">System Reports</h2>
              <p className="text-gray-600 mb-4">Generate and view system reports and analytics.</p>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">User Activity Report</h3>
                  <p className="text-sm text-gray-600">Track user engagement and system usage</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">System Performance Report</h3>
                  <p className="text-sm text-gray-600">Monitor system performance and health metrics</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Security Report</h3>
                  <p className="text-sm text-gray-600">Review security events and incidents</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'audit-logs':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">System Audit Trail</h2>
              <p className="text-gray-600 mb-4">View detailed logs of system activities and changes.</p>
              <div className="space-y-2">
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                  <p className="text-sm font-medium">User Login - admin@medicare.com</p>
                  <p className="text-xs text-gray-600">2 minutes ago</p>
                </div>
                <div className="p-3 border-l-4 border-green-500 bg-green-50">
                  <p className="text-sm font-medium">System Settings Updated</p>
                  <p className="text-xs text-gray-600">15 minutes ago</p>
                </div>
                <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                  <p className="text-sm font-medium">New User Created - nurse@medicare.com</p>
                  <p className="text-xs text-gray-600">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'analytics':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Analytics</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">System Analytics</h2>
              <p className="text-gray-600 mb-4">View comprehensive analytics and insights.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Usage Analytics</h3>
                  <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                    <p className="text-gray-500">Usage Chart Placeholder</p>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Performance Metrics</h3>
                  <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                    <p className="text-gray-500">Performance Chart Placeholder</p>
                  </div>
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
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Welcome back! Here's your system overview and administration tools.
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  System Status
                </button>
              </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {adminCardData.map((card, index) => (
                <DashboardCard key={index} {...card} />
              ))}
            </div>

            {/* System Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Recent System Activities</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">System backup completed successfully</p>
                      <p className="text-xs text-gray-600">5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New user registration approved</p>
                      <p className="text-xs text-gray-600">12 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">System maintenance scheduled</p>
                      <p className="text-xs text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Calendar Card */}
              <ChartCard userRole="admin" />
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
        userRole="admin"
        activeMenu={activeView}
        onMenuClick={handleMenuClick}
      />
      
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
