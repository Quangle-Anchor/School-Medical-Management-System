import React, { useState, useEffect } from 'react';
import { User, Calendar, Phone, Mail, MapPin, Edit, Plus, Eye, Heart, FileText } from 'lucide-react';
import { studentAPI } from '../api/studentsApi';
import AddStudentForm from './AddStudentForm';

const MyChildView = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your children...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Children</h1>
            <p className="text-gray-600">Manage your children's profiles and health information</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Child
          </button>
        </div>

        {/* Children List */}
        {students.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No children added yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first child's information</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Child
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div key={student.studentId} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                {/* Student Avatar */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{student.fullName}</h3>
                    <p className="text-sm text-gray-600">Age: {calculateAge(student.dateOfBirth)} years</p>
                  </div>
                </div>

                {/* Student Info */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Born: {formatDate(student.dateOfBirth)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>Gender: {student.gender || 'Not specified'}</span>
                  </div>

                  {student.className && (
                    <div className="flex items-center text-sm text-gray-600">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>Class: {student.className}</span>
                    </div>
                  )}

                  {student.address && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{student.address}</span>
                    </div>
                  )}

                  {student.phoneNumber && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{student.phoneNumber}</span>
                    </div>
                  )}

                  {student.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{student.email}</span>
                    </div>
                  )}
                </div>

                {/* Health Status */}
                <div className="mt-4 p-3 bg-green-50 rounded-md">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">Health Status: Good</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">Last checkup: 2 weeks ago</p>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => setSelectedStudent(student)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Student Detail Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.fullName}</h2>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <span className="sr-only">Close</span>
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Full Name:</span> {selectedStudent.fullName}</p>
                    <p><span className="font-medium">Date of Birth:</span> {formatDate(selectedStudent.dateOfBirth)}</p>
                    <p><span className="font-medium">Age:</span> {calculateAge(selectedStudent.dateOfBirth)} years</p>
                    <p><span className="font-medium">Gender:</span> {selectedStudent.gender || 'Not specified'}</p>
                    <p><span className="font-medium">Address:</span> {selectedStudent.address || 'Not provided'}</p>
                    <p><span className="font-medium">Phone:</span> {selectedStudent.phoneNumber || 'Not provided'}</p>
                    <p><span className="font-medium">Email:</span> {selectedStudent.email || 'Not provided'}</p>
                  </div>
                </div>

                {/* School Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">School Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Class:</span> {selectedStudent.className || 'Not assigned'}</p>
                    <p><span className="font-medium">School Year:</span> {selectedStudent.schoolYear || 'Not specified'}</p>
                  </div>

                  <h3 className="font-semibold text-lg border-b pb-2 mt-6">Parent Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Parent Name:</span> {selectedStudent.parentName || 'Not provided'}</p>
                    <p><span className="font-medium">Parent Phone:</span> {selectedStudent.parentPhone || 'Not provided'}</p>
                    <p><span className="font-medium">Parent Email:</span> {selectedStudent.parentEmail || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Edit Information
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Student Form */}
        <AddStudentForm
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          onStudentAdded={handleStudentAdded}
        />
      </div>
    </div>
  );
};

export default MyChildView;
