import React, { useState, useEffect } from "react";
import Sidebar from "../../components/SideBar";
import DashboardCard from "../../components/DashboardCard";
import ChartCard from "../../components/ChartCard";
import UpcomingHealthEventsCard from "../../components/UpcomingHealthEventsCard";
import { Users, Settings, FileText, Bell, Activity } from "lucide-react";
import UserManagement from "./UserManagement";
import { userApi } from "../../api/userApi";

const AdminDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    // Lấy số lượng user thực tế từ API
    const fetchUsers = async () => {
      try {
        const users = await userApi.getAll();
        setTotalUsers(users.length);
      } catch {
        setTotalUsers(0);
      }
    };
    fetchUsers();
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMenuClick = (menuId) => {
    setActiveView(menuId);
  };

  // Admin dashboard data
  const adminCardData = [
    {
      title: "Total Users",
      value: totalUsers || 0,
      change: totalUsers > 0 ? "" : "",
      changeType: totalUsers > 0 ? "positive" : "neutral",
      icon: Users,
    },
  ];

  const renderContent = () => {
    switch (activeView) {
      case "user-management":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <UserManagement />
            </div>
          </div>
        );

      // ...other cases (system-settings, reports, etc.) giữ nguyên...
      default:
        return (
          <div className="dashboard-content">
            {/* Header */}
            <div className="dashboard-header">
              <div className="flex items-center justify-between">
                <div>
                  <h1>Admin Dashboard</h1>
                  <p>Welcome back! Here's your system overview and administration tools.</p>
                </div>
                <button className="soft-btn">
                  System Status
                </button>
              </div>
            </div>

            {/* Dashboard Cards */}
            <div className="dashboard-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {adminCardData.map((card, index) => (
                <DashboardCard key={index} {...card} />
              ))}
            </div>

            {/* System Overview */}
            <div className="dashboard-grid grid grid-cols-1 lg:grid-cols-2">
              {/* Calendar Card */}
              <div className="component-container">
                <ChartCard userRole="admin" />
              </div>
              {/* Upcoming Health Events Section */}
              <div className="component-container">
                <UpcomingHealthEventsCard userRole="admin" />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        userRole="admin"
        activeMenu={activeView}
        onMenuClick={handleMenuClick}
      />
      <main className={`soft-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
