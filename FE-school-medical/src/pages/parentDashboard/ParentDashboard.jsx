import React, { useState, useEffect } from 'react';
import Dashboard from '../../components/DashBoard';
import AddStudentForm from '../../components/AddStudentForm';
import { User, Calendar, FileText, Heart, Plus } from 'lucide-react';
import { studentAPI } from '../../api/studentsApi';

const ParentDashboard = () => {
  const [students, setStudents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

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
    // Update the card data with new count
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

  return (
    <>      <Dashboard 
        cardData={parentCardData} 
        userRole="parent"
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
      
      <AddStudentForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onStudentAdded={handleStudentAdded}
      />
    </>
  );
};

export default ParentDashboard;