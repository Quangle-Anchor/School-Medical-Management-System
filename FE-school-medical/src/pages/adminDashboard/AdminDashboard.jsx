import React, { useState, useEffect } from "react";
import Sidebar from "../../components/SideBar";
import TopNavbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import ChartCard from "../../components/ChartCard";
import UpcomingHealthEventsCard from "../../components/UpcomingHealthEventsCard";
import { Users, Settings, FileText, Bell, Activity, X, User } from "lucide-react";
import UserManagement from "./UserManagement";
import { userApi } from "../../api/userApi";

const AdminDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const closeUserDetails = () => {
    setSelectedUser(null);
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

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedUser.roleName === "Nurse" ? "Nurse Details" : "User Details"}
                </h2>
                <button
                  onClick={closeUserDetails}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Profile Section */}
                <div className="flex items-center space-x-6 p-6 bg-gray-50 rounded-lg">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center ${
                      selectedUser.roleName === "Nurse"
                        ? "bg-blue-100"
                        : "bg-green-100"
                    }`}
                  >
                    <User
                      className={`w-10 h-10 ${
                        selectedUser.roleName === "Nurse"
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">
                      {selectedUser.fullName || "N/A"}
                    </h3>
                    <p className="text-gray-600 text-lg mb-2">
                      @{selectedUser.username}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 text-sm rounded-full ${
                        selectedUser.roleName === "Nurse"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {selectedUser.roleName}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-xl font-medium text-gray-900 mb-6">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <p className="text-gray-900 text-lg">{selectedUser.email || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Phone</p>
                        <p className="text-gray-900 text-lg">{selectedUser.phone || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div>
                  <h4 className="text-xl font-medium text-gray-900 mb-6">Account Information</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">User ID</p>
                      <p className="text-gray-900 text-lg">{selectedUser.userId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Username</p>
                      <p className="text-gray-900 text-lg">@{selectedUser.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Role</p>
                      <p className="text-gray-900 text-lg">{selectedUser.roleName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Full Name</p>
                      <p className="text-gray-900 text-lg">{selectedUser.fullName || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={closeUserDetails}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
