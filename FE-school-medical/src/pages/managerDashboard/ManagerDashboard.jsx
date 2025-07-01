import React, { useState } from 'react';
import Sidebar from '../../components/SideBar';
import DashboardCard from '../../components/DashboardCard';
import ChartCard from '../../components/ChartCard';
import { Users, Calendar, FileText, Heart, Activity, Stethoscope, Bell } from 'lucide-react';

const ManagerDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMenuClick = (menuId) => {
    setActiveView(menuId);
  };

  // Manager dashboard data
  const managerCardData = [
    {
      title: 'Total Staff',
      value: '156',
      change: '+8 new hires this month',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Monthly Revenue',
      value: '$45,230',
      change: '+12% from last month',
      changeType: 'positive',
      icon: Heart,
    },
    {
      title: 'Operational Cost',
      value: '$28,450',
      change: '-5% from last month',
      changeType: 'positive',
      icon: FileText,
    },
    {
      title: 'Patient Satisfaction',
      value: '94%',
      change: '+2% improvement',
      changeType: 'positive',
      icon: Stethoscope,
    },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'staff-management':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Staff Management</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Employee Management</h2>
              <p className="text-gray-600 mb-4">Manage staff schedules, performance, and HR activities.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <h3 className="font-medium">Total Employees</h3>
                  <p className="text-2xl font-bold text-blue-600">156</p>
                  <p className="text-sm text-gray-600">Active staff members</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <h3 className="font-medium">On Duty Today</h3>
                  <p className="text-2xl font-bold text-green-600">89</p>
                  <p className="text-sm text-gray-600">Currently working</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <h3 className="font-medium">Absent Today</h3>
                  <p className="text-2xl font-bold text-red-600">12</p>
                  <p className="text-sm text-gray-600">On leave/sick</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Department Overview</h3>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Nursing Staff</span>
                      <span className="text-sm font-medium">65 active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Administrative</span>
                      <span className="text-sm font-medium">23 active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Medical Staff</span>
                      <span className="text-sm font-medium">34 active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Support Staff</span>
                      <span className="text-sm font-medium">34 active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'scheduling':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Scheduling</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Staff Scheduling</h2>
              <p className="text-gray-600 mb-4">Manage work schedules and shift assignments.</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Today's Shifts</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Morning Shift</span>
                        <span className="text-sm font-medium">45 staff</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Afternoon Shift</span>
                        <span className="text-sm font-medium">32 staff</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Night Shift</span>
                        <span className="text-sm font-medium">12 staff</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Overtime Hours</h3>
                    <p className="text-2xl font-bold text-yellow-600">156 hrs</p>
                    <p className="text-sm text-gray-600">This week</p>
                    <button className="mt-2 px-3 py-1 bg-yellow-600 text-white text-sm rounded">
                      Manage Overtime
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'inventory':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Inventory</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Medical Inventory</h2>
              <p className="text-gray-600 mb-4">Track medical supplies, equipment, and pharmaceutical inventory.</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-medium">Low Stock Items</h3>
                    <p className="text-2xl font-bold text-red-600">8</p>
                    <p className="text-sm text-gray-600">Require reorder</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-medium">Total Items</h3>
                    <p className="text-2xl font-bold text-blue-600">1,247</p>
                    <p className="text-sm text-gray-600">In inventory</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-medium">Monthly Usage</h3>
                    <p className="text-2xl font-bold text-green-600">$12,340</p>
                    <p className="text-sm text-gray-600">Supplies consumed</p>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Critical Items</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Surgical Masks</span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Low Stock</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Hand Sanitizer</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Medium Stock</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Thermometers</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Good Stock</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'financial':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Financial</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Financial Overview</h2>
              <p className="text-gray-600 mb-4">Monitor revenue, expenses, and financial performance.</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Monthly Revenue</h3>
                    <p className="text-2xl font-bold text-green-600">$45,230</p>
                    <p className="text-sm text-gray-600">+12% from last month</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Monthly Expenses</h3>
                    <p className="text-2xl font-bold text-red-600">$28,450</p>
                    <p className="text-sm text-gray-600">-5% from last month</p>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Expense Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Staff Salaries</span>
                      <span className="text-sm font-medium">$18,500 (65%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Medical Supplies</span>
                      <span className="text-sm font-medium">$5,200 (18%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Utilities</span>
                      <span className="text-sm font-medium">$2,850 (10%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Other</span>
                      <span className="text-sm font-medium">$1,900 (7%)</span>
                    </div>
                  </div>
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
              <h2 className="text-lg font-semibold mb-4">Management Reports</h2>
              <p className="text-gray-600 mb-4">Generate and review operational and performance reports.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Financial Reports</h3>
                  <p className="text-sm text-gray-600">Revenue, expenses, and profitability analysis</p>
                  <button className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded">Generate</button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Staff Performance</h3>
                  <p className="text-sm text-gray-600">Employee productivity and performance metrics</p>
                  <button className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded">Generate</button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Patient Satisfaction</h3>
                  <p className="text-sm text-gray-600">Patient feedback and satisfaction scores</p>
                  <button className="mt-2 px-3 py-1 bg-purple-600 text-white text-sm rounded">Generate</button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Operational Efficiency</h3>
                  <p className="text-sm text-gray-600">Process efficiency and resource utilization</p>
                  <button className="mt-2 px-3 py-1 bg-yellow-600 text-white text-sm rounded">Generate</button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'quality-assurance':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Quality Assurance</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Quality Management</h2>
              <p className="text-gray-600 mb-4">Monitor and maintain healthcare quality standards.</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">Quality Score</h3>
                    <p className="text-2xl font-bold text-green-600">94%</p>
                    <p className="text-sm text-gray-600">Overall quality rating</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">Compliance Rate</h3>
                    <p className="text-2xl font-bold text-blue-600">98%</p>
                    <p className="text-sm text-gray-600">Policy compliance</p>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Recent Audits</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Safety Protocols</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Passed</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Patient Care Standards</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Passed</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Equipment Maintenance</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Review</span>
                    </div>
                  </div>
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
              <h2 className="text-lg font-semibold mb-4">Manager Settings</h2>
              <p className="text-gray-600 mb-4">Configure management preferences and system settings.</p>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Department Configuration</h3>
                  <p className="text-sm text-gray-600">Manage department settings and hierarchies</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Approval Workflows</h3>
                  <p className="text-sm text-gray-600">Configure approval processes and workflows</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Report Preferences</h3>
                  <p className="text-sm text-gray-600">Customize report formats and scheduling</p>
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
                    Manager Dashboard
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Welcome back! Here's your operational overview and management insights.
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Monthly Report
                </button>
              </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {managerCardData.map((card, index) => (
                <DashboardCard key={index} {...card} />
              ))}
            </div>

            {/* Management Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Department Performance</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Nursing Department</h3>
                      <p className="text-sm text-gray-600">65 staff members</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded">Excellent</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Administrative</h3>
                      <p className="text-sm text-gray-600">23 staff members</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">Good</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Support Services</h3>
                      <p className="text-sm text-gray-600">34 staff members</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">Average</span>
                  </div>
                </div>
              </div>
              
              {/* Calendar Card */}
              <ChartCard userRole="manager" />
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
        userRole="manager"
        activeMenu={activeView}
        onMenuClick={handleMenuClick}
      />
      
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default ManagerDashboard;
