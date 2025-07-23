import React, { useState } from 'react';
import { Activity, Users, Calendar, Stethoscope } from 'lucide-react';
import Sidebar from './SideBar';
import DashboardCard from './DashboardCard';
import ChartCard from './ChartCard';
import TopNavbar from './Navbar';

const Dashboard = ({ cardData = [], userRole = 'parent', customActions, activeMenu = 'dashboard', onMenuClick, recentActivity = [] }) => {
  console.log('Dashboard props:', { userRole, hasCustomActions: !!customActions });
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const displayCardData = cardData;
 return (
    <div className="m-0 font-sans antialiased font-normal text-base leading-default bg-gray-100 text-slate-500">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={toggleSidebar} 
        userRole={userRole}
        activeMenu={activeMenu}
        onMenuClick={onMenuClick}
      />
      
      <main className={`ease-soft-in-out xl:ml-68.5 relative h-full max-h-screen rounded-xl transition-all duration-200 ${sidebarCollapsed ? 'xl:ml-20' : ''}`}>
        <TopNavbar 
          title={userRole === 'parent' ? 'Parent Dashboard' : 'Medical Dashboard'}
          breadcrumb={[userRole === 'parent' ? 'Parent' : 'Medical', 'Dashboard']}
          userInfo={{ name: localStorage.getItem("fullname") || "User" }}
        />
        
        <div className="w-full px-6 py-6 mx-auto">
          {/* Metrics Cards */}
          <div className="dashboard-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCardData.map((card, index) => (
              <DashboardCard key={index} {...card} />
            ))}
          </div>
          
          {/* Charts and Tables */}
          <div className="dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ChartCard userRole={userRole} />
            
            {/* Recent Activity */}
            <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border">
              <div className="p-4 pb-0 mb-0 bg-white border-b-0 rounded-t-2xl">
                <div className="flex flex-wrap -mx-3">
                  <div className="flex items-center w-full max-w-full px-3 shrink-0 md:w-8/12 md:flex-none">
                    <h6 className="mb-0 text-slate-700 font-bold">Recent Activity</h6>
                  </div>
                </div>
              </div>
              <div className="flex-auto pb-0">
                <div className="p-4 pt-6">
                  {recentActivity.length > 0 ? recentActivity.map((item, index) => (
                    <div key={index} className="flex items-center mb-4 last:mb-0">
                      <div className="flex items-center justify-center w-8 h-8 mr-4 text-center bg-gray-500 shadow-md rounded-xl">
                        <Activity className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h6 className="mb-1 text-sm font-normal leading-normal text-slate-700">
                          {item.action}
                        </h6>
                        <p className="mb-0 text-xs leading-tight text-slate-400">{item.time}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-center bg-gray-500 shadow-md rounded-xl">
                        <Activity className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm text-slate-400">
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
          
          {/* Custom Actions */}
          {customActions && (
            <div className="w-full mt-6">
              {customActions}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;