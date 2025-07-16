import React from "react";
import PropTypes from "prop-types";
import {
  Activity,
  Calendar,
  Users,
  Settings,
  FileText,
  Bell,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Heart,
  BookOpen,
  MessageSquare,
  User,
  LogOut,
  Warehouse,
  Syringe,
  AlertTriangle,
  Clock,
} from "lucide-react";

const Sidebar = ({
  isCollapsed,
  onToggle,
  userRole = "parent",
  onMenuClick,
  activeMenu,
}) => {
  // Different menu items based on user role
  const getMenuItems = () => {
    if (userRole === "parent") {
      return [
        { id: "dashboard", icon: Activity, label: "Dashboard" },
        { id: "my-child", icon: User, label: "My Child" },
        { id: "health-event", icon: Calendar, label: "Health Events" },
        { id: "medical-records", icon: FileText, label: "Medical Records" },
        { id: "notifications", icon: Bell, label: "Notifications" },
        { id: "medical-request", icon: Syringe, label: "Medical Request" },
        { id: "medication-schedules", icon: Clock, label: "Medication Schedules" },
      ];
    }

    if (userRole === "admin") {
      return [
        { id: "dashboard", icon: Activity, label: "Dashboard" },
        { id: "user-management", icon: Users, label: "User Management" },
      ];
    }
    if (userRole === "nurse") {
      return [
        { id: "dashboard", icon: Activity, label: "Dashboard" },
        { id: "students", icon: Users, label: "Students" },
        { id: "health-events", icon: Calendar, label: "Health Events" },
        {
          id: "health-incidents",
          icon: AlertTriangle,
          label: "Health Incidents",
        },
        {
          id: "medication-requests",
          icon: Syringe,
          label: "Medication Requests",
        },
        {
          id: "medication-schedules",
          icon: Clock,
          label: "Medication Schedules",
        },
        { id: "notifications", icon: Bell, label: "Notifications" },
        { id: "inventory", icon: Warehouse, label: "Inventory" },
      ];
    }

    if (userRole === "Principal") {
      return [
        { id: "dashboard", icon: Activity, label: "Dashboard" },
        { id: "nurse-management", icon: Users, label: "Staff Management" },
        { id: "scheduling", icon: Calendar, label: "Scheduling" },
        { id: "notifications", icon: Bell, label: "Notifications" },
        { id: "inventory", icon: Warehouse, label: "Inventory" },        
      ];
    }
    return [];
  };
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("fullname");

    // Dispatch custom event to notify other components of logout
    window.dispatchEvent(new CustomEvent("authChange"));

    window.location.replace("/login");
  };

  const menuItems = getMenuItems();
  // const userInfo = getUserInfo();

  return (
    <aside className={`soft-sidebar ${isCollapsed ? 'soft-sidebar-collapsed' : ''}`}>
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">Medical System</h1>
                <p className="text-sm text-gray-500 capitalize">{userRole} Dashboard</p>
              </div>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <li key={index}>
                <button
                  onClick={() => onMenuClick && onMenuClick(item.id)}
                  className={`soft-menu-item w-full ${isActive ? 'active' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <div className="soft-menu-icon">
                    <Icon size={16} />
                  </div>
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={handleLogout}
          className="soft-menu-item w-full text-red-600 hover:bg-red-50"
          title={isCollapsed ? 'Logout' : ''}
        >
          <div className="soft-menu-icon">
            <LogOut size={16} />
          </div>
          {!isCollapsed && (
            <span className="font-medium">Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  userRole: PropTypes.string,
  onMenuClick: PropTypes.func,
  activeMenu: PropTypes.string,
};

export default Sidebar;
