import React, { useState } from 'react';
import { Activity, Users, Calendar, Stethoscope } from 'lucide-react';
import Sidebar from './SideBar';
import DashboardCard from './DashboardCard';
import ChartCard from './ChartCard';

const Dashboard = ({ cardData = [], userRole = 'parent', customActions, activeMenu = 'dashboard', onMenuClick, recentActivity = [] }) => {
  console.log('Dashboard props:', { userRole, hasCustomActions: !!customActions });
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const displayCardData = cardData;
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
                {recentActivity.length > 0 ? recentActivity.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-md hover:bg-accent transition-colors">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Activity className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {userRole === 'parent' 
                        ? "No recent health activity to display"
                        : "No recent medical center activity to display"
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;