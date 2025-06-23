import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../api/studentsApi';
import { Search, Filter, Eye, Edit, FileText, Heart, Calendar, AlertCircle, Users, User, Activity, X, Plus, Trash2 } from 'lucide-react';
import AddStudentForm from '../parentDashboard/AddStudentForm';

const PatientsView = () => {  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('');  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  // Add state for health info
  const [healthInfo, setHealthInfo] = useState({});

  // Fetch all students on component mount
  useEffect(() => {
    // Check authentication before fetching data
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
      setError('No authentication token found. Please login.');
      setLoading(false);
      return;
    }
    
    if (role !== 'Nurse' && role !== 'Admin' && role !== 'Manager') {
      setError('Access denied. Only nurses, admins, and managers can view all patients.');
      setLoading(false);
      return;
    }
    
    fetchAllStudents();
  }, []);
  const fetchAllStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user has token before making API call
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }
      
      if (role !== 'Nurse' && role !== 'Admin' && role !== 'Manager') {
        setError('Access denied. You do not have permission to view all patients.');
        return;
      }

      let response;
      try {
        // First, try the standard endpoint
        response = await studentAPI.getAllStudents();        } catch (firstError) {
        if (role === 'Nurse') {
          try {
            // Try nurse-specific endpoint
            response = await studentAPI.getAllStudentsForNurse();
          } catch (secondError) {
            try {
              // Try getMyStudents as last resort
              response = await studentAPI.getMyStudents();
            } catch (thirdError) {
              // If all fail, throw the original error
              throw firstError;
            }
          }
        } else {
          // For non-nurses, just throw the original error
          throw firstError;        }
      }      if (response && response.data) {
        setStudents(response.data);
        
        // Fetch health info for each student
        const healthData = {};
        for (const student of response.data) {
          try {
            const healthInfoResponse = await studentAPI.getHealthInfoByStudentId(student.studentId);
            if (healthInfoResponse && healthInfoResponse.length > 0) {
              const health = healthInfoResponse[0];
              healthData[student.studentId] = {
                medicalConditions: health.medicalConditions || 'None',
                allergies: health.allergies || 'None',
                notes: health.notes || '',
                lastCheckup: health.updatedAt ? new Date(health.updatedAt).toLocaleDateString() : 'Not available'
              };
            } else {
              healthData[student.studentId] = {
                medicalConditions: 'None',
                allergies: 'None',
                notes: '',
                lastCheckup: 'Not available'
              };
            }
          } catch (error) {
            // Set default values if there's an error fetching health info
            healthData[student.studentId] = {
              medicalConditions: 'None',
              allergies: 'None',
              notes: '',
              lastCheckup: 'Not available'
            };
          }
        }
        setHealthInfo(healthData);
      } else if (response && Array.isArray(response)) {
        setStudents(response);
        
        // Fetch health info for each student
        const healthData = {};
        for (const student of response) {
          try {
            const healthInfoResponse = await studentAPI.getHealthInfoByStudentId(student.studentId);
            if (healthInfoResponse && healthInfoResponse.length > 0) {
              const health = healthInfoResponse[0];
              healthData[student.studentId] = {
                medicalConditions: health.medicalConditions || 'None',
                allergies: health.allergies || 'None',
                notes: health.notes || '',
                lastCheckup: health.updatedAt ? new Date(health.updatedAt).toLocaleDateString() : 'Not available'
              };
            } else {
              healthData[student.studentId] = {
                medicalConditions: 'None',
                allergies: 'None',
                notes: '',
                lastCheckup: 'Not available'
              };
            }
          } catch (error) {
            // Set default values if there's an error fetching health info
            healthData[student.studentId] = {
              medicalConditions: 'None',
              allergies: 'None',
              notes: '',
              lastCheckup: 'Not available'
            };
          }
        }
        setHealthInfo(healthData);
      } else {
        // Unexpected API response format, use empty array
        setStudents([]);
        setHealthInfo({});
      }
    } catch (err) {
      if (err.message.includes('Authentication required') || err.message.includes('401')) {
        setError('Session expired. Please login again.');
      } else if (err.message.includes('403') || err.message.includes('forbidden')) {
        setError(`Access denied. Your role (${localStorage.getItem('role')}) may not have permission to view all patients. Please contact your administrator.`);
      } else if (err.message.includes('404')) {
        setError('Students endpoint not found. Please check if the backend server is running correctly.');
      } else if (err.message.includes('network') || err.message.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(`Failed to load patients: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter students based on search term and grade
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.className?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = filterGrade === '' || student.grade === filterGrade;
    
    return matchesSearch && matchesGrade;
  });

  // Get unique grades for filter dropdown
  const uniqueGrades = [...new Set(students.map(student => student.grade).filter(Boolean))].sort();

  const handleViewPatient = (student) => {
    setSelectedPatient(student);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
  };

  const getHealthStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setShowAddForm(true); // Reuse the same form for editing
    setShowModal(false); // Close detail modal if open
  };

  const handleStudentFormSave = async (updatedData) => {
    try {
      // Update local state
      if (editingPatient) {
        // Edit mode
        setStudents(prev => prev.map(student => 
          student.studentId === editingPatient.studentId ? updatedData : student
        ));
      } else {
        // Add mode
        setStudents(prev => [...prev, updatedData]);
      }
      
      setShowAddForm(false);
      setEditingPatient(null);
      // Refresh data to ensure consistency
      fetchAllStudents();
    } catch (error) {
      setError(editingPatient ? 'Failed to update patient information. Please try again.' : 'Failed to add new patient. Please try again.');
    }
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingPatient(null);
  };

  const handleDeletePatient = (patient) => {
    setPatientToDelete(patient);
    setShowDeleteModal(true);
  };

  const confirmDeletePatient = async () => {
    if (!patientToDelete) return;
    
    setDeleting(true);
    try {
      // Delete the patient from the backend
      await studentAPI.deleteStudent(patientToDelete.studentId);
      
      // Remove from local state
      setStudents(prev => prev.filter(student => 
        student.studentId !== patientToDelete.studentId
      ));
      
      // Remove from health info
      setHealthInfo(prev => {
        const updated = { ...prev };
        delete updated[patientToDelete.studentId];
        return updated;
      });
      
      setShowDeleteModal(false);
      setPatientToDelete(null);
    } catch (error) {
      setError('Failed to delete patient. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const cancelDeletePatient = () => {
    setShowDeleteModal(false);
    setPatientToDelete(null);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading patients...</span>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Error Loading Patients</p>
            <p className="text-red-600 text-sm">{error}</p>
            <div className="mt-3 flex space-x-2">
              <button 
                onClick={fetchAllStudents}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Try Again
              </button>
              {(error.includes('Authentication') || error.includes('Session expired')) && (
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Login Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6">      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">All Patients</h1>
          <p className="text-gray-600">Manage and view all student patient records</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Patient
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, student ID, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Grade Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
            >
              <option value="">All Grades</option>
              {uniqueGrades.map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center text-sm text-gray-600">
            Showing {filteredStudents.length} of {students.length} patients
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academic Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Health Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium">No patients found</p>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-800">
                              {student.fullName?.charAt(0) || 'N'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.fullName || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {student.studentId || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.className || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Grade {student.grade || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHealthStatusColor(student.healthStatus)}`}>
                        {student.healthStatus || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(student.updatedAt)}
                    </td>                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewPatient(student)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleEditPatient(student)}
                          className="text-green-600 hover:text-green-900 inline-flex items-center"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePatient(student)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>      {/* Patient Detail Modal */}
      {showModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.fullName}</h2>
              <button
                onClick={closeModal}
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
                    <span className="text-gray-900">{selectedPatient.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Date of Birth:</span>
                    <span className="text-gray-900">{formatDate(selectedPatient.dateOfBirth)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Age:</span>
                    <span className="text-gray-900">{calculateAge(selectedPatient.dateOfBirth)} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Gender:</span>
                    <span className="text-gray-900">{selectedPatient.gender || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Student ID:</span>
                    <span className="text-gray-900">{selectedPatient.studentId}</span>
                  </div>
                </div>

                {/* Academic Information */}
                <h3 className="font-semibold text-lg border-b pb-2 mt-6 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Academic Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Class:</span>
                    <span className="text-gray-900">{selectedPatient.className || 'Not assigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Grade:</span>
                    <span className="text-gray-900">Grade {selectedPatient.grade || 'N/A'}</span>
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
                    <span className="font-medium text-gray-600">Health Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHealthStatusColor(selectedPatient.healthStatus)}`}>
                      {selectedPatient.healthStatus || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Blood Type:</span>
                    <span className="text-gray-900">{selectedPatient.bloodType || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Height:</span>
                    <span className="text-gray-900">{selectedPatient.heightCm ? `${selectedPatient.heightCm} cm` : 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Weight:</span>
                    <span className="text-gray-900">{selectedPatient.weightKg ? `${selectedPatient.weightKg} kg` : 'Not specified'}</span>
                  </div>                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Medical Conditions:</span>
                    <span className="text-gray-900">{healthInfo[selectedPatient.studentId]?.medicalConditions || selectedPatient.medicalConditions || 'None reported'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Allergies:</span>
                    <span className="text-gray-900">{healthInfo[selectedPatient.studentId]?.allergies || selectedPatient.allergies || 'None reported'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Last Checkup:</span>
                    <span className="text-gray-900">{healthInfo[selectedPatient.studentId]?.lastCheckup || 'Not available'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Last Updated:</span>
                    <span className="text-gray-900">{formatDate(selectedPatient.updatedAt)}</span>
                  </div>
                </div>                {/* Additional Health Notes */}
                {healthInfo[selectedPatient.studentId]?.notes && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Additional Notes:</h4>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">
                        {healthInfo[selectedPatient.studentId].notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  closeModal();
                  handleDeletePatient(selectedPatient);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Patient
              </button>
              <button
                onClick={() => handleEditPatient(selectedPatient)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Information
              </button>
            </div>
          </div>
        </div>
      )}      {/* Add/Edit Patient Form Modal */}
      {showAddForm && (
        <AddStudentForm
          isOpen={showAddForm}
          onClose={handleCloseForm}
          onStudentAdded={handleStudentFormSave}
          editingStudent={editingPatient}
          isEditing={!!editingPatient}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && patientToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
              <button
                onClick={cancelDeletePatient}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                disabled={deleting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900">Delete Patient</h4>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-700">
                Are you sure you want to delete <strong>{patientToDelete.fullName}</strong> (ID: {patientToDelete.studentId})?
                This will permanently remove all patient data and health records.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDeletePatient}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePatient}
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
                    Delete Patient
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsView;
