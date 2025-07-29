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
  UserCheck,
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
        { id: "student-confirmations", icon: UserCheck, label: "Student Confirmations" },
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
 

  return (
    <aside className={`max-w-62.5 ease-nav-brand z-990 fixed inset-y-0 my-4 ml-4 flex flex-col w-full -translate-x-full bg-gray-50 shadow-sm overflow-hidden rounded-2xl border-0 p-0 antialiased transition-transform duration-200 xl:left-0 xl:translate-x-0 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo/Header */}
      <div className="h-19.5">
        <div className="block px-8 py-6 m-0 text-sm whitespace-nowrap text-slate-700">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center mr-2 ${isCollapsed ? 'mr-0' : 'mr-3'}`}>
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <span className="ml-1 font-semibold transition-all duration-200 ease-nav-brand text-slate-700">
                  Medical System
                </span>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-1">
                  {userRole === "parent" ? "Parent Portal" : 
                   userRole === "nurse" ? "Nurse Dashboard" :
                   userRole === "admin" ? "Admin Panel" : 
                   userRole === "Principal" ? "Principal Dashboard" : "Healthcare"}
                </p>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onToggle}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors xl:hidden"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-slate-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          )}
        </button>
      </div>

      <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />

      {/* Navigation Menu */}
      <div className="flex-1 items-center block w-auto overflow-y-auto overflow-x-hidden pb-20">
        <ul className="flex flex-col pl-0 mb-0">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <li key={index} className="mt-0.5 w-full">
                <button
                  onClick={() => onMenuClick && onMenuClick(item.id)}
                  className={`flex items-center w-full py-2 px-4 my-1 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-sky-100 text-sky-600 border-l-4 border-sky-500'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <div className={`mr-3 flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 flex-shrink-0 ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'bg-white fill-current text-slate-700 hover:bg-slate-50'
                  }`}>
                    <Icon size={16} />
                  </div>
                  {!isCollapsed && (
                    <span className="duration-300 pointer-events-none ease-soft flex-1 text-left">
                      {item.label}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="py-2.7 text-sm ease-nav-brand flex items-center whitespace-nowrap rounded-lg px-4 font-medium transition-colors text-red-500 hover:text-red-600 w-full hover:bg-red-50"
          title={isCollapsed ? 'Logout' : ''}
        >
          <div className="shadow-soft-2xl mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 bg-center stroke-0 text-center text-red-500 flex-shrink-0">
            <LogOut size={16} />
          </div>
          {!isCollapsed && (
            <span className="duration-300 pointer-events-none ease-soft flex-1 text-left">
              Logout
            </span>
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
