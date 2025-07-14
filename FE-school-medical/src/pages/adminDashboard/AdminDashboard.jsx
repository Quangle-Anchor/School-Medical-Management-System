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
    {
      title: "System Health",
      value: 0, // Show 0 if no real data
      change: "",
      changeType: "neutral",
      icon: Activity,
    },
    {
      title: "Reports Generated",
      value: 0, // Show 0 if no real data
      change: "",
      changeType: "neutral",
      icon: FileText,
    },
    {
      title: "Active Alerts",
      value: 0, // Show 0 if no real data
      change: "",
      changeType: "neutral",
      icon: Bell,
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
          <div className="p-6 space-y-6 bg-gray-50 min-h-full">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Welcome back! Here's your system overview and administration
                    tools.
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div
                className="bg-white rounded-lg shadow p-6"
                style={{
                  background: "radial-gradient(at center, #E8FEFF, #FFFFFF)",
                }}
              >
                <h2 className="text-xl font-bold mb-4">
                  Recent System Activities
                </h2>
                <div className="space-y-3">
                  <div className="text-center py-8 text-gray-400">
                    Không có hoạt động hệ thống gần đây
                  </div>
                </div>
              </div>

              {/* Calendar Card */}
              <ChartCard userRole="admin" />

              {/* Upcoming Health Events Section */}
              <UpcomingHealthEventsCard userRole="admin" />
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

      <main className="flex-1 overflow-hidden">{renderContent()}</main>
    </div>
  );
};

export default AdminDashboard;
