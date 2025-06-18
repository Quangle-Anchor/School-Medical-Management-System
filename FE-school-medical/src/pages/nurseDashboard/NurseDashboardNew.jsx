import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/SideBar';
import DashboardCard from '../../components/DashboardCard';
import { Users, Calendar, FileText, Heart, Activity, Stethoscope, Bell, Warehouse } from 'lucide-react';

const NurseDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Get current view from URL
  const getCurrentView = () => {
    const path = location.pathname;
    if (path.includes('/patients')) return 'patients';
    if (path.includes('/appointments')) return 'appointments';
    if (path.includes('/medical-records')) return 'medical-records';
    if (path.includes('/health-checkups')) return 'health-checkups';
    if (path.includes('/notifications')) return 'notifications';
    if (path.includes('/inventory')) return 'inventory';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const [activeView, setActiveView] = useState(getCurrentView());

  // Update active view when URL changes
  useEffect(() => {
    setActiveView(getCurrentView());
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMenuClick = (menuId) => {
    if (menuId === 'dashboard') {
      navigate('/nurseDashboard');
    } else {
      navigate(`/nurseDashboard/${menuId}`);
    }
    setActiveView(menuId);
  };

  // Nurse dashboard data
  const nurseCardData = [
    {
      title: 'Patients Today',
      value: '24',
      change: '+3 from yesterday',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Appointments',
      value: '18',
      change: '6 remaining today',
      changeType: 'neutral',
      icon: Calendar,
    },
    {
      title: 'Health Checkups',
      value: '12',
      change: 'Completed today',
      changeType: 'positive',
      icon: Heart,
    },
    {
      title: 'Emergency Cases',
      value: '2',
      change: 'Active alerts',
      changeType: 'negative',
      icon: Stethoscope,
    },
  ];

  // Inventory data
  const inventoryData = {
    medications: [
      { id: 1, name: 'Paracetamol 500mg', quantity: 245, unit: 'tablets', status: 'good' },
      { id: 2, name: 'Ibuprofen 400mg', quantity: 45, unit: 'tablets', status: 'moderate' },
      { id: 3, name: 'Amoxicillin 250mg', quantity: 12, unit: 'capsules', status: 'low' },
      { id: 4, name: 'Cough Syrup', quantity: 8, unit: 'bottles', status: 'good' },
      { id: 5, name: 'Aspirin 325mg', quantity: 150, unit: 'tablets', status: 'good' },
      { id: 6, name: 'Insulin', quantity: 25, unit: 'vials', status: 'moderate' },
      { id: 7, name: 'Antihistamine', quantity: 75, unit: 'tablets', status: 'good' },
    ],
    equipment: [
      { id: 1, name: 'Digital Thermometer', quantity: 15, unit: 'units', status: 'good' },
      { id: 2, name: 'Blood Pressure Monitor', quantity: 8, unit: 'units', status: 'good' },
      { id: 3, name: 'Stethoscope', quantity: 12, unit: 'units', status: 'good' },
      { id: 4, name: 'Pulse Oximeter', quantity: 6, unit: 'units', status: 'moderate' },
      { id: 5, name: 'Otoscope', quantity: 4, unit: 'units', status: 'good' },
      { id: 6, name: 'Ophthalmoscope', quantity: 3, unit: 'units', status: 'moderate' },
      { id: 7, name: 'Reflex Hammer', quantity: 10, unit: 'units', status: 'good' },
    ],
    consumables: [
      { id: 1, name: 'Disposable Gloves', quantity: 500, unit: 'pairs', status: 'good' },
      { id: 2, name: 'Face Masks', quantity: 200, unit: 'pieces', status: 'good' },
      { id: 3, name: 'Syringes', quantity: 25, unit: 'pieces', status: 'moderate' },
      { id: 4, name: 'Bandages', quantity: 8, unit: 'rolls', status: 'low' },
      { id: 5, name: 'Cotton Swabs', quantity: 300, unit: 'pieces', status: 'good' },
      { id: 6, name: 'Alcohol Pads', quantity: 150, unit: 'pieces', status: 'good' },
      { id: 7, name: 'Gauze Pads', quantity: 50, unit: 'pieces', status: 'moderate' },
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'patients':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Patients</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Patient Management</h2>
              <p className="text-gray-600 mb-4">View and manage patient information and care plans.</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Active Patients</h3>
                    <p className="text-sm text-gray-600">24 patients under care today</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Recent Admissions</h4>
                    <p className="text-sm text-gray-600">3 new patients admitted</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Discharge Planning</h4>
                    <p className="text-sm text-gray-600">5 patients ready for discharge</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'appointments':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Appointments</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
              <p className="text-gray-600 mb-4">Manage today's appointments and patient visits.</p>
              <div className="space-y-3">
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">9:00 AM - Health Checkup</h3>
                      <p className="text-sm text-gray-600">Patient: John Smith</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">In Progress</span>
                  </div>
                </div>
                <div className="p-4 border-l-4 border-green-500 bg-green-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">10:30 AM - Vaccination</h3>
                      <p className="text-sm text-gray-600">Patient: Emma Johnson</p>
                    </div>
                    <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Completed</span>
                  </div>
                </div>
                <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">2:00 PM - Follow-up</h3>
                      <p className="text-sm text-gray-600">Patient: Michael Brown</p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">Upcoming</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'medical-records':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Medical Records</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Patient Records</h2>
              <p className="text-gray-600 mb-4">Access and update patient medical records and history.</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-medium">Records Updated</h3>
                    <p className="text-2xl font-bold text-blue-600">15</p>
                    <p className="text-sm text-gray-600">Today</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-medium">Pending Reviews</h3>
                    <p className="text-2xl font-bold text-yellow-600">8</p>
                    <p className="text-sm text-gray-600">Requiring attention</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-medium">Total Records</h3>
                    <p className="text-2xl font-bold text-green-600">1,247</p>
                    <p className="text-sm text-gray-600">In system</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'health-checkups':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Health Checkups</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Checkup Management</h2>
              <p className="text-gray-600 mb-4">Conduct and track routine health checkups and screenings.</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Routine Checkups</h3>
                    <p className="text-sm text-gray-600">Annual physical examinations and wellness checks</p>
                    <button className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded">Schedule</button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Specialized Screenings</h3>
                    <p className="text-sm text-gray-600">Targeted health screenings and tests</p>
                    <button className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded">Manage</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Alerts & Notifications</h2>
              <p className="text-gray-600 mb-4">Stay updated with important alerts and system notifications.</p>
              <div className="space-y-3">
                <div className="p-4 border-l-4 border-red-500 bg-red-50">
                  <h3 className="font-medium text-red-800">Emergency Alert</h3>
                  <p className="text-sm text-red-600">Patient in Room 205 requires immediate attention</p>
                  <p className="text-xs text-red-500">5 minutes ago</p>
                </div>
                <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                  <h3 className="font-medium text-yellow-800">Medication Reminder</h3>
                  <p className="text-sm text-yellow-600">Time for medication round - Ward B</p>
                  <p className="text-xs text-yellow-500">15 minutes ago</p>
                </div>
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <h3 className="font-medium text-blue-800">Schedule Update</h3>
                  <p className="text-sm text-blue-600">Tomorrow's shift schedule has been updated</p>
                  <p className="text-xs text-blue-500">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        );      case 'inventory':
        return (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="mr-4 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    ← Back
                  </button>
                )}
                <h1 className="text-2xl font-bold">
                  {selectedCategory ? 
                    `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Inventory` : 
                    'Medical Inventory'
                  }
                </h1>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add New Item
              </button>
            </div>

            {!selectedCategory ? (
              <div className="space-y-6">
                {/* Inventory Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Total Items</h3>
                    <p className="text-3xl font-bold text-blue-600">247</p>
                    <p className="text-sm text-gray-500">Active supplies</p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Low Stock</h3>
                    <p className="text-3xl font-bold text-red-600">12</p>
                    <p className="text-sm text-gray-500">Need reorder</p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Expired</h3>
                    <p className="text-3xl font-bold text-yellow-600">5</p>
                    <p className="text-sm text-gray-500">Remove soon</p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Value</h3>
                    <p className="text-3xl font-bold text-green-600">$15,420</p>
                    <p className="text-sm text-gray-500">Total inventory</p>
                  </div>
                </div>

                {/* Category Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Medications Category */}
                  <div 
                    onClick={() => setSelectedCategory('medications')}
                    className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                      <h3 className="text-xl font-semibold text-gray-800">Medications</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Total Items: {inventoryData.medications.length}</p>
                      <p className="text-sm text-gray-600">
                        Low Stock: {inventoryData.medications.filter(item => item.status === 'low').length} items
                      </p>
                      <div className="mt-4">
                        <div className="text-xs text-gray-500">Recent items:</div>
                        <div className="text-sm">Paracetamol, Ibuprofen, Amoxicillin...</div>
                      </div>
                    </div>
                    <div className="mt-4 text-blue-600 text-sm font-medium">Click to view all →</div>
                  </div>

                  {/* Medical Equipment Category */}
                  <div 
                    onClick={() => setSelectedCategory('equipment')}
                    className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                      <h3 className="text-xl font-semibold text-gray-800">Medical Equipment</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Total Items: {inventoryData.equipment.length}</p>
                      <p className="text-sm text-gray-600">
                        Low Stock: {inventoryData.equipment.filter(item => item.status === 'low').length} items
                      </p>
                      <div className="mt-4">
                        <div className="text-xs text-gray-500">Recent items:</div>
                        <div className="text-sm">Thermometers, BP Monitors, Stethoscopes...</div>
                      </div>
                    </div>
                    <div className="mt-4 text-green-600 text-sm font-medium">Click to view all →</div>
                  </div>

                  {/* Consumables Category */}
                  <div 
                    onClick={() => setSelectedCategory('consumables')}
                    className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-purple-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
                      <h3 className="text-xl font-semibold text-gray-800">Consumables</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Total Items: {inventoryData.consumables.length}</p>
                      <p className="text-sm text-gray-600">
                        Low Stock: {inventoryData.consumables.filter(item => item.status === 'low').length} items
                      </p>
                      <div className="mt-4">
                        <div className="text-xs text-gray-500">Recent items:</div>
                        <div className="text-sm">Gloves, Masks, Syringes...</div>
                      </div>
                    </div>
                    <div className="mt-4 text-purple-600 text-sm font-medium">Click to view all →</div>
                  </div>
                </div>
              </div>
            ) : (
              // Category Detail View
              <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inventoryData[selectedCategory]?.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        <span className={`text-sm font-semibold ${getStatusColor(item.status)}`}>
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Stock Level: {item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                        <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>        );
      
      case 'emergency':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Emergency Protocol</h1>
            <div className="space-y-6">
              {/* Emergency Alert Status */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-red-800 mb-4">Active Emergency Alerts</h2>
                <div className="space-y-3">
                  <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-red-800">Code Blue - Room 205</h3>
                        <p className="text-red-700">Patient requires immediate medical attention</p>
                        <p className="text-sm text-red-600">Alert triggered: 2 minutes ago</p>
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        Respond
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Procedures */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Emergency Procedures</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Cardiac Arrest</h3>
                    <p className="text-sm text-gray-600 mb-3">Immediate CPR and AED protocol</p>
                    <button className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                      View Protocol
                    </button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Respiratory Distress</h3>
                    <p className="text-sm text-gray-600 mb-3">Oxygen therapy and airway management</p>
                    <button className="px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
                      View Protocol
                    </button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Severe Allergic Reaction</h3>
                    <p className="text-sm text-gray-600 mb-3">Epinephrine administration protocol</p>
                    <button className="px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
                      View Protocol
                    </button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Fire Emergency</h3>
                    <p className="text-sm text-gray-600 mb-3">Evacuation and safety procedures</p>
                    <button className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                      View Protocol
                    </button>
                  </div>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Emergency Contacts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <h3 className="font-semibold">Emergency Services</h3>
                    <p className="text-2xl font-bold text-red-600">911</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <h3 className="font-semibold">Hospital Security</h3>
                    <p className="text-2xl font-bold text-blue-600">2911</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <h3 className="font-semibold">Poison Control</h3>
                    <p className="text-2xl font-bold text-green-600">1-800-222-1222</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Nurse Settings</h2>
              <p className="text-gray-600 mb-4">Configure your preferences and account settings.</p>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Notification Preferences</h3>
                  <p className="text-sm text-gray-600">Manage alert settings and notification types</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Shift Schedule</h3>
                  <p className="text-sm text-gray-600">View and update your work schedule</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Profile Information</h3>
                  <p className="text-sm text-gray-600">Update your professional profile and credentials</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-6 space-y-6 bg-gray-50 min-h-full">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Nurse Dashboard
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Welcome back! Here's your patient care overview and daily tasks.
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Emergency Protocol
                </button>
              </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {nurseCardData.map((card, index) => (
                <DashboardCard key={index} {...card} />
              ))}
            </div>

            {/* Patient Care Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Recent Patient Activities</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Health checkup completed - John Smith</p>
                      <p className="text-xs text-gray-600">10 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Medication administered - Emma Johnson</p>
                      <p className="text-xs text-gray-600">25 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Vital signs recorded - Michael Brown</p>
                      <p className="text-xs text-gray-600">45 minutes ago</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Care Plan Tasks</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Wound dressing change</p>
                      <p className="text-xs text-gray-600">Room 302 - Due: 2:00 PM</p>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded">
                      Complete
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Medication round</p>
                      <p className="text-xs text-gray-600">Ward B - Due: 3:00 PM</p>
                    </div>
                    <button className="px-3 py-1 bg-yellow-600 text-white text-xs rounded">
                      Pending
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Patient discharge prep</p>
                      <p className="text-xs text-gray-600">Room 105 - Due: 4:30 PM</p>
                    </div>
                    <button className="px-3 py-1 bg-green-600 text-white text-xs rounded">
                      Ready
                    </button>
                  </div>
                </div>
              </div>
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
        userRole="nurse"
        activeMenu={activeView}
        onMenuClick={handleMenuClick}
      />
      
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default NurseDashboard;
