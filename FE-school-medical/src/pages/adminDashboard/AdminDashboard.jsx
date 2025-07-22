import React, { useState, useEffect } from "react";
import Sidebar from "../../components/SideBar";
import TopNavbar from "../../components/Navbar";
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

  const fetchUsers = async () => {
    try {
      const users = await userApi.getAll();
      setTotalUsers(users.length);
    } catch {
      setTotalUsers(0);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMenuClick = (menuId) => {
    setActiveView(menuId);
    // Refresh data khi quay về dashboard
    if (menuId === "dashboard") {
      fetchUsers();
    }
  };

  // Hàm để refresh total users từ UserManagement
  const handleUserUpdated = () => {
    fetchUsers();
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
              <UserManagement onUserUpdated={handleUserUpdated} />
            </div>
          </div>
        );

      // ...other cases (system-settings, reports, etc.) giữ nguyên...
      default:
        return (
          <div className="bg-gray-100 p-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600">
                    Welcome back! Here's your system overview and administration
                    tools.
                  </p>
                </div>
              </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {adminCardData.map((card, index) => (
                <DashboardCard key={index} {...card} />
              ))}
            </div>

            {/* System Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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
    <div className="bg-gray-100 p-6">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        userRole="admin"
        activeMenu={activeView}
        onMenuClick={handleMenuClick}
      />
      <main
        className={`ease-soft-in-out xl:ml-68.5 relative h-full max-h-screen transition-all duration-200 ${
          sidebarCollapsed ? "xl:ml-20" : ""
        }`}
      >
        <TopNavbar
          title="Admin Dashboard"
          breadcrumb={["Admin", "Dashboard"]}
          userInfo={{ name: localStorage.getItem("fullname") || "Admin User" }}
        />

        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
