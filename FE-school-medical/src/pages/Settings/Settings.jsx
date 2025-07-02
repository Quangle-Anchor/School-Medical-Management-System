import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon,
  ShieldCheckIcon,
  EyeIcon,
  CogIcon,
  UserIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    role: localStorage.getItem('role') || 'User',
    name: localStorage.getItem('fullname') || 'User',
  });

  const [settings, setSettings] = useState({
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    healthAlerts: true,
    appointmentReminders: true,
    medicationReminders: true,
    
    // Privacy settings
    profileVisibility: 'private',
    dataSharing: false,
    analyticsOptOut: false,
    
    // Appearance settings
    theme: 'light',
    language: 'en',
    timezone: 'auto',
    
    // Security settings
    twoFactorAuth: false,
    sessionTimeout: '30',
    loginNotifications: true,
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    // Here you would typically save to backend
    console.log(`Setting changed: ${setting} = ${value}`);
  };

  const SettingToggle = ({ label, description, value, onChange, disabled = false }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900">{label}</h4>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <button
        onClick={() => !disabled && onChange(!value)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          value 
            ? 'bg-blue-600' 
            : disabled 
              ? 'bg-gray-200 cursor-not-allowed' 
              : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const SettingSelect = ({ label, description, value, options, onChange }) => (
    <div className="py-3">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900">{label}</h4>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="ml-4 block w-32 rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your preferences and account settings</p>
        </div>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <UserIcon className="h-6 w-6 text-blue-600 mr-3" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Edit Profile</div>
                  <div className="text-sm text-gray-500">Update your information</div>
                </div>
              </button>
              
              <button className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <ShieldCheckIcon className="h-6 w-6 text-green-600 mr-3" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Security</div>
                  <div className="text-sm text-gray-500">Password & 2FA</div>
                </div>
              </button>
              
              <button className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <EyeIcon className="h-6 w-6 text-purple-600 mr-3" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Privacy</div>
                  <div className="text-sm text-gray-500">Data & permissions</div>
                </div>
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <BellIcon className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
            </div>
            
            <div className="space-y-1 border-b border-gray-200 pb-4">
              <SettingToggle
                label="Email Notifications"
                description="Receive notifications via email"
                value={settings.emailNotifications}
                onChange={(value) => handleSettingChange('notifications', 'emailNotifications', value)}
              />
              
              <SettingToggle
                label="Push Notifications"
                description="Receive push notifications in your browser"
                value={settings.pushNotifications}
                onChange={(value) => handleSettingChange('notifications', 'pushNotifications', value)}
              />
              
              <SettingToggle
                label="SMS Notifications"
                description="Receive important alerts via SMS"
                value={settings.smsNotifications}
                onChange={(value) => handleSettingChange('notifications', 'smsNotifications', value)}
              />
            </div>
            
            <div className="space-y-1 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Specific Alerts</h3>
              
              <SettingToggle
                label="Health Alerts"
                description="Emergency health notifications"
                value={settings.healthAlerts}
                onChange={(value) => handleSettingChange('notifications', 'healthAlerts', value)}
              />
              
              <SettingToggle
                label="Appointment Reminders"
                description="Upcoming appointment notifications"
                value={settings.appointmentReminders}
                onChange={(value) => handleSettingChange('notifications', 'appointmentReminders', value)}
              />
              
              <SettingToggle
                label="Medication Reminders"
                description="Medication schedule alerts"
                value={settings.medicationReminders}
                onChange={(value) => handleSettingChange('notifications', 'medicationReminders', value)}
              />
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <ShieldCheckIcon className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Privacy & Security</h2>
            </div>
            
            <div className="space-y-1">
              <SettingSelect
                label="Profile Visibility"
                description="Who can see your profile information"
                value={settings.profileVisibility}
                options={[
                  { value: 'private', label: 'Private' },
                  { value: 'healthcare', label: 'Healthcare Staff' },
                  { value: 'public', label: 'Public' },
                ]}
                onChange={(value) => handleSettingChange('privacy', 'profileVisibility', value)}
              />
              
              <SettingToggle
                label="Data Sharing"
                description="Allow anonymized data sharing for research"
                value={settings.dataSharing}
                onChange={(value) => handleSettingChange('privacy', 'dataSharing', value)}
              />
              
              <SettingToggle
                label="Two-Factor Authentication"
                description="Add extra security to your account"
                value={settings.twoFactorAuth}
                onChange={(value) => handleSettingChange('security', 'twoFactorAuth', value)}
              />
              
              <SettingSelect
                label="Session Timeout"
                description="Automatically log out after inactivity"
                value={settings.sessionTimeout}
                options={[
                  { value: '15', label: '15 minutes' },
                  { value: '30', label: '30 minutes' },
                  { value: '60', label: '1 hour' },
                  { value: '240', label: '4 hours' },
                  { value: 'never', label: 'Never' },
                ]}
                onChange={(value) => handleSettingChange('security', 'sessionTimeout', value)}
              />
              
              <SettingToggle
                label="Login Notifications"
                description="Get notified of new login attempts"
                value={settings.loginNotifications}
                onChange={(value) => handleSettingChange('security', 'loginNotifications', value)}
              />
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <CogIcon className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Appearance & Language</h2>
            </div>
            
            <div className="space-y-1">
              <SettingSelect
                label="Theme"
                description="Choose your preferred color scheme"
                value={settings.theme}
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'auto', label: 'Auto' },
                ]}
                onChange={(value) => handleSettingChange('appearance', 'theme', value)}
              />
              
              <SettingSelect
                label="Language"
                description="Select your preferred language"
                value={settings.language}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'vi', label: 'Tiếng Việt' },
                  { value: 'es', label: 'Español' },
                  { value: 'fr', label: 'Français' },
                ]}
                onChange={(value) => handleSettingChange('appearance', 'language', value)}
              />
              
              <SettingSelect
                label="Timezone"
                description="Your local timezone for appointments"
                value={settings.timezone}
                options={[
                  { value: 'auto', label: 'Auto-detect' },
                  { value: 'UTC+7', label: 'UTC+7 (Vietnam)' },
                  { value: 'UTC+0', label: 'UTC+0 (GMT)' },
                  { value: 'UTC-5', label: 'UTC-5 (EST)' },
                  { value: 'UTC-8', label: 'UTC-8 (PST)' },
                ]}
                onChange={(value) => handleSettingChange('appearance', 'timezone', value)}
              />
            </div>
          </div>

          {/* Role-specific Settings */}
          {user.role !== 'Student' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {user.role} Settings
              </h2>
              
              <div className="space-y-4">
                {user.role === 'Parent' && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Child Monitoring</h3>
                    <p className="text-sm text-blue-700">
                      Configure how you receive updates about your children's health and school activities.
                    </p>
                  </div>
                )}
                
                {user.role === 'Nurse' && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-900 mb-2">Medical Alerts</h3>
                    <p className="text-sm text-green-700">
                      Set priority levels for different types of medical situations and emergency protocols.
                    </p>
                  </div>
                )}
                
                {user.role === 'Admin' && (
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-medium text-purple-900 mb-2">System Management</h3>
                    <p className="text-sm text-purple-700">
                      Configure system-wide settings, user permissions, and data management preferences.
                    </p>
                  </div>
                )}
                
                {user.role === 'Principal' && (
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h3 className="font-medium text-orange-900 mb-2">Reporting & Analytics</h3>
                    <p className="text-sm text-orange-700">
                      Set up automated reports and configure dashboard preferences for school health analytics.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Data & Storage */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Data & Storage</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Download Your Data</h3>
                  <p className="text-sm text-gray-600">Get a copy of all your data</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Download
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Clear Cache</h3>
                  <p className="text-sm text-gray-600">Clear stored data to free up space</p>
                </div>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-red-200">
            <h2 className="text-xl font-semibold text-red-900 mb-6">Danger Zone</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <h3 className="font-medium text-red-900">Deactivate Account</h3>
                  <p className="text-sm text-red-600">Temporarily disable your account</p>
                </div>
                <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 border border-red-300">
                  Deactivate
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <h3 className="font-medium text-red-900">Delete Account</h3>
                  <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
