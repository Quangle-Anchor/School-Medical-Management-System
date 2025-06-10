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
  Stethoscope
} from 'lucide-react';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const menuItems = [
    { icon: Activity, label: 'Dashboard', active: true },
    { icon: Users, label: 'Patients' },
    { icon: Calendar, label: 'Appointments' },
    { icon: FileText, label: 'Medical Records' },
    { icon: Bell, label: 'Alerts' },
    { icon: Settings, label: 'Settings' },
  ];

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
              <button className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                item.active 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent text-muted-foreground hover:text-foreground'
              }`}>
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
              <span className="text-sm font-medium">DR</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Dr. Smith</p>
              <p className="text-xs text-muted-foreground">doctor@medicare.com</p>
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
};

export default Sidebar;