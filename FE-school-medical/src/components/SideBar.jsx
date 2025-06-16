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
  LogOut
} from 'lucide-react';

const Sidebar = ({ isCollapsed, onToggle, userRole = 'doctor', onMenuClick, activeMenu }) => {
  // Different menu items based on user role
  const getMenuItems = () => {
    if (userRole === 'parent') {
      return [
        { id: 'dashboard', icon: Activity, label: 'Dashboard' },
        { id: 'my-child', icon: User, label: 'My Child' },
        { id: 'appointments', icon: Calendar, label: 'Appointments' },
        { id: 'medical-records', icon: FileText, label: 'Medical Records' },
        { id: 'health-reports', icon: Heart, label: 'Health Reports' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
        { id: 'messages', icon: MessageSquare, label: 'Messages' },
        { id: 'health-tips', icon: BookOpen, label: 'Health Tips' },
        { id: 'settings', icon: Settings, label: 'Settings' },
      ];
    }
    
    // Default menu items for doctors/medical staff
    return [
      { id: 'dashboard', icon: Activity, label: 'Dashboard' },
      { id: 'patients', icon: Users, label: 'Patients' },
      { id: 'appointments', icon: Calendar, label: 'Appointments' },
      { id: 'medical-records', icon: FileText, label: 'Medical Records' },
      { id: 'alerts', icon: Bell, label: 'Alerts' },
      { id: 'settings', icon: Settings, label: 'Settings' },
    ];
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    window.location.replace('/login');
  };

  const getUserInfo = () => {
    if (userRole === 'parent') {
      return {
        initials: 'JD',
        name: 'John Doe',
        email: 'parent@medicare.com',
        role: 'Parent'
      };
    }
    
    return {
      initials: 'DR',
      name: 'Dr. Smith',
      email: 'doctor@medicare.com',
      role: 'Doctor'
    };
  };

  const menuItems = getMenuItems();
  const userInfo = getUserInfo();

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

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {!isCollapsed && (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">{userInfo.initials}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{userInfo.name}</p>
                <p className="text-xs text-muted-foreground">{userInfo.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors hover:bg-red-50 text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
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