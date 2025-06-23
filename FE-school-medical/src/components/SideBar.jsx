import React from 'react';
import PropTypes from 'prop-types';
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
  AlertTriangle
} from 'lucide-react';

const Sidebar = ({ isCollapsed, onToggle, userRole = 'parent', onMenuClick, activeMenu }) => {  // Different menu items based on user role
  const getMenuItems = () => {    if (userRole === 'parent') {
      return [
        { id: 'dashboard', icon: Activity, label: 'Dashboard' },
        { id: 'my-child', icon: User, label: 'My Child' },
        { id: 'appointments', icon: Calendar, label: 'Appointments' },
        { id: 'medical-records', icon: FileText, label: 'Medical Records' },
        { id: 'health-reports', icon: Heart, label: 'Health Reports' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
        { id: 'messages', icon: MessageSquare, label: 'Messages' },
        { id: 'medical-request', icon: Syringe, label: 'Medical Request' },
        { id: 'settings', icon: Settings, label: 'Settings' },
      ];
    }
    
    if (userRole === 'admin') {
      return [
        { id: 'dashboard', icon: Activity, label: 'Dashboard' },
        { id: 'user-management', icon: Users, label: 'User Management' },
        { id: 'system-settings', icon: Settings, label: 'System Settings' },
        { id: 'reports', icon: FileText, label: 'Reports' },
        { id: 'audit-logs', icon: Bell, label: 'Audit Logs' },
        { id: 'analytics', icon: Stethoscope, label: 'Analytics' },
      ];
    }    if (userRole === 'nurse') {
      return [
        { id: 'dashboard', icon: Activity, label: 'Dashboard' },
        { id: 'patients', icon: Users, label: 'Patients' },
        { id: 'appointments', icon: Calendar, label: 'Appointments' },
        { id: 'medical-records', icon: FileText, label: 'Medical Records' },
        { id: 'health-incidents', icon: AlertTriangle, label: 'Health Incidents' },
        { id: 'medication-requests', icon: Syringe, label: 'Medication Requests' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
        { id: 'inventory', icon: Warehouse, label: 'inventory' },
        { id: 'settings', icon: Settings, label: 'Settings' },
      ];
    }
    
    if (userRole === 'manager') {
      return [
        { id: 'dashboard', icon: Activity, label: 'Dashboard' },
        { id: 'staff-management', icon: Users, label: 'Staff Management' },
        { id: 'scheduling', icon: Calendar, label: 'Scheduling' },
        { id: 'inventory', icon: FileText, label: 'Inventory' },
        { id: 'financial', icon: Heart, label: 'Financial' },
        { id: 'reports', icon: Bell, label: 'Reports' },
        { id: 'quality-assurance', icon: Stethoscope, label: 'Quality Assurance' },
        { id: 'settings', icon: Settings, label: 'Settings' },
      ];
    }
    
    if (userRole === 'student') {
      return [
        { id: 'dashboard', icon: Activity, label: 'Dashboard' },
        { id: 'my-health', icon: Heart, label: 'My Health' },
        { id: 'appointments', icon: Calendar, label: 'Appointments' },
        { id: 'health-records', icon: FileText, label: 'Health Records' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
        { id: 'health-tips', icon: BookOpen, label: 'Health Tips' },
        { id: 'settings', icon: Settings, label: 'Settings' },
      ];
    }
    
    // Log warning for unknown roles and return empty array
    console.warn(`Unknown user role: ${userRole}`);
    return [];
  };  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('fullname');
    
    // Dispatch custom event to notify other components of logout
    window.dispatchEvent(new CustomEvent('authChange'));
    
    window.location.replace('/login');
  }

  const menuItems = getMenuItems();
  // const userInfo = getUserInfo();

  return (
    <div className={`bg-white border-r border-border transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">MediCare</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1 hover:bg-accent rounded-md transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button 
                onClick={() => onMenuClick && onMenuClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  activeMenu === item.id
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
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