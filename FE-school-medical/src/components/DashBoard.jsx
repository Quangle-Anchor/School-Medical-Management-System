
import React, { useState } from 'react';
import { Activity, Users, Calendar, Stethoscope } from 'lucide-react';
import Sidebar from './SideBar';
import DashboardCard from './DashboardCard';
import ChartCard from './ChartCard';

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const cardData = [
    {
      title: 'Total Patients',
      value: '1,247',
      change: '+12% from last month',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Appointments Today',
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

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      
      <main className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Medical Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's today's patient overview and health statistics.</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Generate Report
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cardData.map((card, index) => (
              <DashboardCard key={index} {...card} />
            ))}
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard />
            
            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-border p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
                <p className="text-sm text-muted-foreground">Latest updates from the medical center</p>
              </div>
              <div className="space-y-4">
                {[
                  { action: 'New patient registered', time: '2 minutes ago', type: 'patient' },
                  { action: 'Appointment #1234 completed', time: '5 minutes ago', type: 'appointment' },
                  { action: 'Lab results received', time: '10 minutes ago', type: 'lab' },
                  { action: 'Emergency alert received', time: '15 minutes ago', type: 'emergency' },
                ].map((item, index) => (
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