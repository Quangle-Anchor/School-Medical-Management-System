import React, { useState, useEffect } from 'react';
import { User, Calendar, Phone, Mail, MapPin, Edit,
   Plus, Eye, Heart, FileText, Activity, X, Trash2 } from 'lucide-react';
import { studentAPI } from '../../api/studentsApi';
import AddStudentForm from './AddStudentForm';



const MyChildView = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [healthInfo, setHealthInfo] = useState({});
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showDebug, setShowDebug] = useState(false); // Add debug toggle state

  useEffect(() => {
    fetchStudents();
  }, []);const fetchStudents = async () => {
    try {
      // Use getMyStudents which automatically filters by parent for parent role
      const studentsData = await studentAPI.getMyStudents();
      setStudents(studentsData);
      
      // Fetch health info for each student
      const healthData = {};
      for (const student of studentsData) {
        try {
          // Try to fetch health info from the separate health-info API
          const healthInfoResponse = await studentAPI.getHealthInfoByStudentId(student.studentId);
          
          // If health info exists, use it; otherwise use default values
          if (healthInfoResponse && healthInfoResponse.length > 0) {
            const healthInfo = healthInfoResponse[0]; // Get the first/latest health info record
            healthData[student.studentId] = {
              bloodType: student.bloodType,
              heightCm: student.heightCm,
              weightKg: student.weightKg,
              medicalConditions: healthInfo.medicalConditions || 'None',
              allergies: healthInfo.allergies || 'None',
              notes: healthInfo.notes || '',
              lastCheckup: healthInfo.updatedAt ? new Date(healthInfo.updatedAt).toLocaleDateString() : '2 weeks ago'
            };
          } else {
            // No health info found, use student data and defaults
            healthData[student.studentId] = {
              bloodType: student.bloodType,
              heightCm: student.heightCm,
              weightKg: student.weightKg,
              medicalConditions: 'None',
              allergies: 'None',
              notes: '',
              lastCheckup: 'Not available'
            };
          }        } catch (error) {
          // Set default values if there's an error
          healthData[student.studentId] = {
            bloodType: student.bloodType || 'Not specified',
            heightCm: student.heightCm,
            weightKg: student.weightKg,
            medicalConditions: 'None',
            allergies: 'None',
            notes: '',
            lastCheckup: 'Not available'
          };
        }
      }      setHealthInfo(healthData);
    } catch (error) {
      if (error.message.includes('Authentication required')) {
        setError('Session expired. Please login again.');
      } else if (error.message.includes('Access forbidden')) {
        setError('You do not have permission to view student data.');
      } else {
        setError('Failed to load student data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };const handleStudentAdded = (newStudent) => {
    setStudents(prev => [...prev, newStudent]);
    // Add health info for new student
    setHealthInfo(prev => ({
      ...prev,
      [newStudent.studentId]: {
        bloodType: newStudent.bloodType,
        heightCm: newStudent.heightCm,
        weightKg: newStudent.weightKg,
        medicalConditions: newStudent.medicalConditions || 'None',
        allergies: newStudent.allergies || 'None',
        notes: newStudent.notes || '',
        lastCheckup: 'Recently added'
      }
    }));
  };  const handleEditStudent = (student) => {
    setEditingStudent(student);
  };const handleStudentUpdated = (updatedStudent) => {
    setStudents(prev => prev.map(student => 
      student.studentId === updatedStudent.studentId ? updatedStudent : student
    ));
    // Update health info for the updated student
    setHealthInfo(prev => ({
      ...prev,
      [updatedStudent.studentId]: {
        bloodType: updatedStudent.bloodType,
        heightCm: updatedStudent.heightCm,
        weightKg: updatedStudent.weightKg,
        medicalConditions: updatedStudent.medicalConditions || 'None',
        allergies: updatedStudent.allergies || 'None',
        notes: updatedStudent.notes || '',
        lastCheckup: prev[updatedStudent.studentId]?.lastCheckup || 'Recently updated'
      }
    }));
    setEditingStudent(null);
  };  const handleDeleteStudent = async (student) => {
    setDeleting(true);
    try {
      await studentAPI.deleteStudent(student.studentId);
      
      // Remove student from the list
      setStudents(prev => prev.filter(s => s.studentId !== student.studentId));
      
      // Remove health info from state
      setHealthInfo(prev => {
        const updated = { ...prev };
        delete updated[student.studentId];
        return updated;
      });
        setDeleteConfirm(null);
    } catch (error) {
      if (error.message.includes('Authentication required')) {
        setError('Session expired. Please login again.');
      } else if (error.message.includes('Access forbidden')) {
        setError('You do not have permission to delete student data.');
      } else {
        setError('Failed to delete student. Please try again.');
      }
    } finally {
      setDeleting(false);
    }
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

  return (    <div className="p-6 bg-gray-50 min-h-screen">
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

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <div className="text-red-600 mr-2">⚠️</div>
              <span className="text-red-700">{error}</span>
              <button
                onClick={() => {
                  setError('');
                  fetchStudents();
                }}
                className="ml-auto px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

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
        ) : (          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div key={student.studentId} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow relative">                {/* Delete Button - Top Right */}
                <button
                  onClick={() => setDeleteConfirm(student)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete student"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                {/* Student Avatar */}
                <div className="flex items-center mb-4 pr-8">
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
                  </div>                  {student.className && (
                    <div className="flex items-center text-sm text-gray-600">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>Class: {student.className}</span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-600">
                    <Activity className="w-4 h-4 mr-2" />
                    <span>Blood Type: {student.bloodType || 'Not specified'}</span>
                  </div>

                  {(student.heightCm || student.weightKg) && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Heart className="w-4 h-4 mr-2" />
                      <span>
                        {student.heightCm ? `${student.heightCm}cm` : ''} 
                        {student.heightCm && student.weightKg ? ', ' : ''}
                        {student.weightKg ? `${student.weightKg}kg` : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* Health Status
                <div className="mt-4 p-3 bg-green-50 rounded-md">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">Health Status: Good</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Last checkup: {healthInfo[student.studentId]?.lastCheckup || 'Not available'}
                  </p>
                </div> */}                {/* Action Buttons */}
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => setSelectedStudent(student)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </button>                  <button 
                    onClick={() => handleEditStudent(student)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}        {/* Student Detail Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.fullName}</h2>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Full Name:</span>
                      <span className="text-gray-900">{selectedStudent.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Date of Birth:</span>
                      <span className="text-gray-900">{formatDate(selectedStudent.dateOfBirth)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Age:</span>
                      <span className="text-gray-900">{calculateAge(selectedStudent.dateOfBirth)} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Gender:</span>
                      <span className="text-gray-900">{selectedStudent.gender || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Class:</span>
                      <span className="text-gray-900">{selectedStudent.className || 'Not assigned'}</span>
                    </div>
                  </div>

                  {/* School Information */}
                  <h3 className="font-semibold text-lg border-b pb-2 mt-6 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    School Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Class:</span>
                      <span className="text-gray-900">{selectedStudent.className || 'Not assigned'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Student ID:</span>
                      <span className="text-gray-900">{selectedStudent.studentId}</span>
                    </div>
                  </div>
                </div>

                {/* Health Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2 flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Health Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Blood Type:</span>
                      <span className="text-gray-900">{selectedStudent.bloodType || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Height:</span>
                      <span className="text-gray-900">{selectedStudent.heightCm ? `${selectedStudent.heightCm} cm` : 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Weight:</span>
                      <span className="text-gray-900">{selectedStudent.weightKg ? `${selectedStudent.weightKg} kg` : 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Medical Conditions:</span>
                      <span className="text-gray-900">{healthInfo[selectedStudent.studentId]?.medicalConditions || 'None'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Allergies:</span>
                      <span className="text-gray-900">{healthInfo[selectedStudent.studentId]?.allergies || 'None'}</span>
                    </div>                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Last Checkup:</span>
                      <span className="text-gray-900">{healthInfo[selectedStudent.studentId]?.lastCheckup || 'Not available'}</span>
                    </div>
                  </div>

                  {/* Additional Notes Section */}
                  {healthInfo[selectedStudent.studentId]?.notes && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Additional Notes:</h4>
                      <div className="p-3 bg-gray-50 rounded-md border">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                          {healthInfo[selectedStudent.studentId].notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Health Status Card
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-medium text-green-800">Overall Health Status</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">Student is in good health condition</p>
                    <p className="text-xs text-green-600 mt-2">
                      Last updated: {new Date().toLocaleDateString()}
                    </p>
                  </div> */}
                </div>
              </div>              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>                <button 
                  onClick={() => {
                    setSelectedStudent(null);
                    handleEditStudent(selectedStudent);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Information
                </button>
              </div></div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Delete Student</h3>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  disabled={deleting}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">You are about to delete:</p>
                    <p className="font-semibold text-gray-900">{deleteConfirm.fullName}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  This action cannot be undone. All health information and records associated with this student will be permanently deleted.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteStudent(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Student
                    </>
                  )}
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

        {/* Edit Student Form */}
        {editingStudent && (
          <AddStudentForm
            isOpen={!!editingStudent}
            onClose={() => setEditingStudent(null)}
            onStudentAdded={handleStudentUpdated}
            editingStudent={editingStudent}
            isEditing={true}
          />
        )}
      </div>
    </div>
  );
};

export default MyChildView;
