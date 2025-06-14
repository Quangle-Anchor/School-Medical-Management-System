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
  User
} from 'lucide-react';

const Sidebar = ({ isCollapsed, onToggle, userRole = 'doctor', activeMenu = 'Dashboard', onMenuClick }) => {
  // Different menu items based on user role
  const getMenuItems = () => {
    if (userRole === 'parent') {
      return [
        { icon: Activity, label: 'Dashboard', id: 'dashboard' },
        { icon: User, label: 'My Child', id: 'my-child' },
        { icon: Calendar, label: 'Appointments', id: 'appointments' },
        { icon: FileText, label: 'Medical Records', id: 'medical-records' },
        { icon: Heart, label: 'Health Reports', id: 'health-reports' },
        { icon: Bell, label: 'Notifications', id: 'notifications' },
        { icon: MessageSquare, label: 'Messages', id: 'messages' },
        { icon: BookOpen, label: 'Health Tips', id: 'health-tips' },
        { icon: Settings, label: 'Settings', id: 'settings' },
      ];
    }
      // Default menu items for doctors/medical staff
    return [
      { icon: Activity, label: 'Dashboard', id: 'dashboard' },
      { icon: Users, label: 'Patients', id: 'patients' },
      { icon: Calendar, label: 'Appointments', id: 'appointments' },
      { icon: FileText, label: 'Medical Records', id: 'medical-records' },
      { icon: Bell, label: 'Alerts', id: 'alerts' },
      { icon: Settings, label: 'Settings', id: 'settings' },
    ];
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
      </div>      {/* Navigation */}
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
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">{userInfo.initials}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{userInfo.name}</p>
              <p className="text-xs text-muted-foreground">{userInfo.email}</p>
            </div>
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
  activeMenu: PropTypes.string,
  onMenuClick: PropTypes.func,
};

export default Sidebar;