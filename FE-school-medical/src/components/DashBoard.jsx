import React, { useState } from 'react';
import { Activity, Users, Calendar, Stethoscope } from 'lucide-react';
import Sidebar from './SideBar';
import DashboardCard from './DashboardCard';
import ChartCard from './ChartCard';

const Dashboard = ({ cardData, userRole = 'parent', customActions, activeMenu = 'dashboard', onMenuClick }) => {
  console.log('Dashboard props:', { userRole, hasCustomActions: !!customActions });
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Default card data if none provided
  const defaultCardData = [
    {
      title: 'Total Patients',
      value: '1,247',
      change: '+12% from last month',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Health Events Today',
      value: '89',
      change: '+5 from yesterday',
      changeType: 'positive',
      icon: Calendar,
    },
    {
      title: 'Active Cases',
      value: '156',
      change: '+8% from last week',
      changeType: 'positive',
      icon: Activity,
    },
    {
      title: 'Emergency Cases',
      value: '23',
      change: '-2 from yesterday',
      changeType: 'negative',
      icon: Stethoscope,
    },
  ];

  const displayCardData = cardData || defaultCardData;
 return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={toggleSidebar} 
        userRole={userRole}
        activeMenu={activeMenu}
        onMenuClick={onMenuClick}
      />
      
      <main className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {userRole === 'parent' ? 'Parent Dashboard' : 'Medical Dashboard'}
              </h1>
              <p className="text-muted-foreground">
                {userRole === 'parent' 
                  ? "Welcome back! Here's your child's health overview and updates."
                  : "Welcome back! Here's today's patient overview and health statistics."
                }
              </p>
            </div>            <div className="flex items-center space-x-4">
              {customActions ? customActions : (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  {userRole === 'parent' ? 'View Reports' : 'Generate Report'}
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCardData.map((card, index) => (
              <DashboardCard key={index} {...card} />
            ))}
          </div>          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard userRole={userRole} />
            
            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-border p-6"
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
                <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
                <p className="text-sm text-muted-foreground">
                  {userRole === 'parent' 
                    ? "Latest updates about your child's health"
                    : "Latest updates from the medical center"
                  }
                </p>
              </div>
              <div className="space-y-4">
                {(userRole === 'parent' ? [
                  { action: 'Health checkup completed', time: '2 days ago', type: 'checkup' },
                  { action: 'Vaccination reminder', time: '1 week ago', type: 'reminder' },
                  { action: 'Medical report available', time: '2 weeks ago', type: 'report' },
                  { action: 'Appointment scheduled', time: '3 weeks ago', type: 'appointment' },
                ] : [
                  { action: 'New patient registered', time: '2 minutes ago', type: 'patient' },
                  { action: 'Appointment #1234 completed', time: '5 minutes ago', type: 'appointment' },
                  { action: 'Lab results received', time: '10 minutes ago', type: 'lab' },
                  { action: 'Emergency alert received', time: '15 minutes ago', type: 'emergency' },
                ]).map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-md hover:bg-accent transition-colors">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;