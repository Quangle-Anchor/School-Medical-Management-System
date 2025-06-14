import React, { useState, useEffect } from 'react';
import Dashboard from '../../components/DashBoard';
import MyChildView from '../../components/MyChildView';
import AddStudentForm from '../../components/AddStudentForm';
import { User, Calendar, FileText, Heart, Plus } from 'lucide-react';
import { studentAPI } from '../../api/studentsApi';

const ParentDashboardWrapper = () => {
  const [students, setStudents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const studentsData = await studentAPI.getAllStudents();
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentAdded = (newStudent) => {
    setStudents(prev => [...prev, newStudent]);
  };

  const handleMenuClick = (menuId) => {
    setActiveView(menuId);
  };

  const parentCardData = [
    { 
      title: 'My Children', 
      value: loading ? '...' : students.length.toString(), 
      change: 'Active profiles',
      changeType: 'neutral',
      icon: User
    },
    { 
      title: 'Upcoming Appointments', 
      value: '1', 
      change: 'This week',
      changeType: 'positive',
      icon: Calendar
    },
    { 
      title: 'Health Records', 
      value: '12', 
      change: 'Total documents',
      changeType: 'neutral',
      icon: FileText
    },
    { 
      title: 'Health Score', 
      value: '85%', 
      change: '+5% from last month',
      changeType: 'positive',
      icon: Heart
    },
  ];

  // Render different views based on activeView
  const renderContent = () => {
    switch (activeView) {
      case 'my-child':
        return <MyChildView />;
      case 'appointments':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Appointments</h1>
            <p className="text-gray-600">Appointment management coming soon...</p>
          </div>
        );
      case 'medical-records':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Medical Records</h1>
            <p className="text-gray-600">Medical records view coming soon...</p>
          </div>
        );
      case 'health-reports':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Health Reports</h1>
            <p className="text-gray-600">Health reports view coming soon...</p>
          </div>
        );
      case 'notifications':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Notifications</h1>
            <p className="text-gray-600">Notifications view coming soon...</p>
          </div>
        );
      case 'messages':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Messages</h1>
            <p className="text-gray-600">Messages view coming soon...</p>
          </div>
        );
      case 'health-tips':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Health Tips</h1>
            <p className="text-gray-600">Health tips view coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Settings</h1>
            <p className="text-gray-600">Settings view coming soon...</p>
          </div>
        );
      default:
        return (
          <Dashboard 
            cardData={parentCardData} 
            userRole="parent"
            activeMenu={activeView}
            onMenuClick={handleMenuClick}
            customActions={
              <button 
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </button>
            }
          />
        );
    }
  };

  return (
    <>
      {renderContent()}
      
      <AddStudentForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onStudentAdded={handleStudentAdded}
      />
    </>
  );
};

export default ParentDashboardWrapper;
