import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/SideBar';
import DashboardCard from '../../components/DashboardCard';
import ChartCard from '../../components/ChartCard';
import UpcomingHealthEventsCard from '../../components/UpcomingHealthEventsCard';
import HealthEventsView from '../../components/HealthEventsView';
import HealthEventsCRUD from '../../components/HealthEventsCRUD';
import InventoryViewReadOnly from './InventoryViewReadOnly';
import { Users, Calendar, FileText, Heart, Activity, Stethoscope, Search, Eye, Mail, Phone, WarehouseIcon, User } from 'lucide-react';
import { userApi } from '../../api/userApi';
import { inventoryAPI } from '../../api/inventoryApi';
import { healthIncidentAPI } from '../../api/healthIncidentApi';

const PrincipalDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current view from URL path
  const getCurrentViewFromURL = () => {
    const path = location.pathname;
    if (path.includes('/nurse-management')) return 'nurse-management';
    if (path.includes('/scheduling')) return 'scheduling';
    if (path.includes('/inventory')) return 'inventory';
    return 'dashboard'; // default view
  };
  

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState(getCurrentViewFromURL());
  const [nurseCount, setNurseCount] = useState('--');
  const [lowStockCount, setLowStockCount] = useState('--');
  const [healthIncidentsCount, setHealthIncidentsCount] = useState('--');
  const [isLoadingNurses, setIsLoadingNurses] = useState(true);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);
  const [isLoadingHealthIncidents, setIsLoadingHealthIncidents] = useState(true);
  const [totalStaff, setTotalStaff] = useState('--');
  const [staffBreakdown, setStaffBreakdown] = useState({
    nurses: 0,
    administrative: 0,
    medical: 0,
    support: 0
  });
  const [nurses, setNurses] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('nurses');
  
  // Update activeView when URL changes
  useEffect(() => {
    const newView = getCurrentViewFromURL();
    setActiveView(newView);
  }, [location.pathname]);
  
  useEffect(() => {
    // Fetch staff data including nurses
    const fetchStaffData = async () => {
      try {
        setIsLoadingNurses(true);
        const users = await userApi.getAll();
        
        // Calculate total staff
        setTotalStaff(users.length.toString());
        
        // Count nurses and admins
        const nursesOnly = users.filter(user => user.roleName === 'Nurse');
        const adminsOnly = users.filter(user => user.roleName === 'Admin');
        setNurseCount(nursesOnly.length.toString());
        setNurses(nursesOnly); // Store the actual nurse data
        setAdmins(adminsOnly); // Store the actual admin data
        
        // Calculate staff breakdown
        const adminStaff = users.filter(user => user.roleName === 'Admin').length;
        const principalStaff = users.filter(user => user.roleName === 'Principal').length;
        const parentStaff = users.filter(user => user.roleName === 'Parent').length;
        
        setStaffBreakdown({
          nurses: nursesOnly.length,
          administrative: adminStaff + principalStaff, 
          medical: nursesOnly.length, // Counting nurses as medical staff
          support: parentStaff // Counting parents as support staff
        });
      } catch (error) {
        console.error('Error fetching staff data:', error);
        setNurseCount('Error');
        setTotalStaff('Error');
      } finally {
        setIsLoadingNurses(false);
      }
    };
    
  // Fetch low stock items count using the same logic as InventoryView
  const fetchLowStockItems = async () => {
    try {
      setIsLoadingInventory(true);
      const inventory = await inventoryAPI.getAllInventory();
      
      // Use the same logic as InventoryView - use totalQuantity as the actual quantity
      const lowStockItems = inventory.filter(item => {
        const actualQuantity = item.totalQuantity || item.quantity || 0;
        return (item.status || inventoryAPI.getStockStatus(actualQuantity)) === 'low';
      });
      
      setLowStockCount(lowStockItems.length.toString());
    } catch (error) {
      console.error('Error fetching low stock items:', error);
      setLowStockCount('Error');
    } finally {
      setIsLoadingInventory(false);
    }
  };

  // Fetch health incidents count
  const fetchHealthIncidents = async () => {
    try {
      setIsLoadingHealthIncidents(true);
      const incidents = await healthIncidentAPI.getAllHealthIncidents();
      setHealthIncidentsCount(incidents.length.toString());
    } catch (error) {
      console.error('Error fetching health incidents:', error);
      setHealthIncidentsCount('Error');
    } finally {
      setIsLoadingHealthIncidents(false);
    }
  };
    
    fetchStaffData();
    fetchLowStockItems();
    fetchHealthIncidents();
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMenuClick = (menuId) => {
    // Navigate to the appropriate URL
    const basePath = '/principalDashboard';
    switch (menuId) {
      case 'nurse-management':
        navigate(`${basePath}/nurse-management`);
        break;
      case 'scheduling':
        navigate(`${basePath}/scheduling`);
        break;
      case 'inventory':
        navigate(`${basePath}/inventory`);
        break;
      default:
        navigate(basePath);
        break;
    }
  };

  // Filter users based on search term and active tab
  const getFilteredUsers = () => {
    const users = activeTab === 'nurses' ? nurses : admins;
    return users.filter(user => 
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
  };

  // Principal dashboard data
  const principalCardData = [
    {
      title: 'Total Nurses',
      value: isLoadingNurses ? '--' : nurseCount,
      change: isLoadingNurses ? 'Loading...' : 'Medical staff',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Total Administrator',
      value: isLoadingNurses ? '--' : admins.length.toString(),
      change: isLoadingNurses ? 'Loading...' : 'Administrative staff',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Low Stock Items',
      value: isLoadingInventory ? '--' : lowStockCount,
      change: isLoadingInventory ? 'Loading...' : 'Items need restocking',
      changeType: parseInt(lowStockCount) > 5 ? 'negative' : 'positive',
      icon: WarehouseIcon ,
    },

    {
      title: 'Total Health Incidents',
      value: isLoadingHealthIncidents ? '--' : healthIncidentsCount,
      change: isLoadingHealthIncidents ? 'Loading...' : 'Total recorded incidents',
      changeType: 'positive',
      icon: Stethoscope,
    },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'nurse-management':
        const filteredUsers = getFilteredUsers();
        
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Staff Management</h1>
            
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-white border rounded-lg text-center">
                <h3 className="font-medium">Total Nurses</h3>
                <p className="text-2xl font-bold text-blue-600">{nurses.length}</p>
                <p className="text-sm text-gray-600">Active nurse members</p>
              </div>
              <div className="p-4 bg-white border rounded-lg text-center">
                <h3 className="font-medium">Total Admins</h3>
                <p className="text-2xl font-bold text-green-600">{admins.length}</p>
                <p className="text-sm text-gray-600">Administrative staff</p>
              </div>
              <div className="p-4 bg-white border rounded-lg text-center">
                <h3 className="font-medium">Total Staff</h3>
                <p className="text-2xl font-bold text-purple-600">{nurses.length + admins.length}</p>
                <p className="text-sm text-gray-600">Medical & Admin staff</p>
              </div>
            </div>

            {/* Staff List */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold">Staff Directory</h2>
                  {/* Tabs */}
                  <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setActiveTab('nurses')}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        activeTab === 'nurses' 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Nurses ({nurses.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('admins')}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        activeTab === 'admins' 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Admins ({admins.length})
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {isLoadingNurses ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading staff...</p>
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredUsers.map((user) => (
                    <div key={user.userId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          user.roleName === 'Nurse' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          <Users className={`w-6 h-6 ${
                            user.roleName === 'Nurse' ? 'text-blue-600' : 'text-green-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{user.fullName || 'N/A'}</h3>
                          <p className="text-sm text-gray-500">@{user.username}</p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                            user.roleName === 'Nurse' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.roleName}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          <span className="truncate">{user.email || 'No email'}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          <span>{user.phone || 'No phone'}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleViewUser(user)}
                        className={`w-full px-3 py-2 text-white text-sm rounded-md transition-colors flex items-center justify-center ${
                          user.roleName === 'Nurse' 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">
                    {searchTerm 
                      ? `No ${activeTab} found matching your search.` 
                      : `No ${activeTab} found.`}
                  </p>
                </div>
              )}
            </div>

            {/* User Details Modal */}
            {selectedUser && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{selectedUser.roleName} Details</h2>
                    <button
                      onClick={closeUserDetails}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Profile Section */}
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        selectedUser.roleName === 'Nurse' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        <Users className={`w-8 h-8 ${
                          selectedUser.roleName === 'Nurse' ? 'text-blue-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{selectedUser.fullName || 'N/A'}</h3>
                        <p className="text-gray-600">@{selectedUser.username}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                          selectedUser.roleName === 'Nurse' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {selectedUser.roleName}
                        </span>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h4 className="font-medium mb-3">Contact Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{selectedUser.email || 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{selectedUser.phone || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Account Information */}
                    <div>
                      <h4 className="font-medium mb-3">Account Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">User ID</p>
                          <p className="font-medium">{selectedUser.userId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Username</p>
                          <p className="font-medium">@{selectedUser.username}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Role</p>
                          <p className="font-medium">{selectedUser.roleName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium">{selectedUser.fullName || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <button
                        onClick={closeUserDetails}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'scheduling':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Health Event Scheduling</h1>
            <HealthEventsCRUD 
              title="Health Events Management"
              description="Manage and schedule all health events for the school" />
          </div>
        );
      
      case 'inventory':
        return <InventoryViewReadOnly />;

      default:
        return (
          <div className="p-6 space-y-6 bg-gray-50 min-h-full">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Principal Dashboard
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Welcome back! Here's your operational overview and administrative insights.
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Monthly Report
                </button>
              </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {principalCardData.map((card, index) => (
                <DashboardCard key={index} {...card} />
              ))}
            </div>

            {/* Principal Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              
              {/* Calendar Card */}
              <ChartCard userRole="principal" />

              {/* Upcoming Health Events Section */}
              <UpcomingHealthEventsCard userRole="principal" />
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
        userRole="Principal"
        activeMenu={activeView}
        onMenuClick={handleMenuClick}
      />
      
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default PrincipalDashboard;
