import React, { useState, useEffect } from 'react';
import { healthIncidentAPI } from '../../api/healthIncidentApi';
import { studentAPI } from '../../api/studentsApi';
import { X, AlertTriangle, Calendar, User, FileText, Save, Search, ChevronDown } from 'lucide-react';
import { validateIncidentDate, formatDateForInput, getTodayString } from '../../utils/dateUtils';
import { useToast } from '../../hooks/useToast';

const HealthIncidentForm = ({ isOpen, onClose, onIncidentSaved, editingIncident = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    incidentDate: getTodayString(), // Always set to today
    description: '',
  });
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState('');
  const [dateError, setDateError] = useState('');
  const { showSuccess, showError } = useToast();
  
  // Search functionality state
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Ensure students is always an array to prevent map errors
  const safeStudents = Array.isArray(students) ? students : [];

  // Filter students based on search term
  const filteredStudents = safeStudents.filter(student => 
    student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentCode?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.className?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load students when component mounts
  useEffect(() => {
    if (isOpen) {
      // Check authentication first
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }
      
      fetchAllStudents();
    }
  }, [isOpen]);

  // Initialize form data when editing
  useEffect(() => {
    if (isEditing && editingIncident) {
      const studentId = editingIncident.student?.studentId || editingIncident.studentId || '';
      
      setFormData({
        studentId: String(studentId), // Ensure it's always a string
        incidentDate: getTodayString(), // Always use today's date, even when editing
        description: editingIncident.description || '',
      });
      
      // Set selected student for display
      if (editingIncident.student) {
        setSelectedStudent(editingIncident.student);
        setSearchTerm(editingIncident.student.fullName || '');
      } else if (studentId && students.length > 0) {
        // Try to find the student in the loaded students list
        const foundStudent = students.find(s => String(s.studentId) === String(studentId));
        if (foundStudent) {
          setSelectedStudent(foundStudent);
          setSearchTerm(foundStudent.fullName || '');
        } else {
          // Clear the selection to show the manual input field
          setSelectedStudent(null);
          setSearchTerm('');
        }
      }
    } else {
      setFormData({
        studentId: '',
        incidentDate: getTodayString(), // Always use today's date
        description: '',
      });
      setSelectedStudent(null);
      setSearchTerm('');
    }
    setError('');
    setDateError('');
    setIsDropdownOpen(false);
  }, [isEditing, editingIncident, isOpen, students]);

  // Additional effect to set selected student after students are loaded
  useEffect(() => {
    if (isEditing && editingIncident && students.length > 0 && !selectedStudent) {
      const studentId = editingIncident.student?.studentId || editingIncident.studentId || '';
      if (studentId) {
        const foundStudent = students.find(s => String(s.studentId) === String(studentId));
        if (foundStudent) {
          setSelectedStudent(foundStudent);
          setSearchTerm(foundStudent.fullName || '');
        }
      }
    }
  }, [students, isEditing, editingIncident, selectedStudent]);

  const fetchAllStudents = async () => {
    try {
      setLoadingStudents(true);
      setError(''); // Clear any previous errors
      
      // Check if user has token before making API call 
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }
      
      console.log('Fetching confirmed students...');
      
      const role = localStorage.getItem('role');
      let studentsData = [];
      
      if (role === 'Parent') {
        // For parents, use the existing getMyConfirmedStudents
        const response = await studentAPI.getMyConfirmedStudents();
        studentsData = Array.isArray(response) ? response : [];
      } else {
        // For nurses/admins, get all students and filter confirmed ones
        const response = await studentAPI.getAllStudents(0, 1000);
        const allStudents = response.content || [];
        // Filter only confirmed students using confirmationStatus
        studentsData = allStudents.filter(student => student.confirmationStatus === 'confirmed');
      }
      
      setStudents(studentsData);
      
      if (studentsData.length === 0) {
        setError('No confirmed students found. Only confirmed students can have health incidents recorded.');
      }
    } catch (error) {
      
      // More detailed error handling
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        
        if (status === 401) {
          setError('Session expired. Please login again.');
        } else if (status === 403) {
          setError('Access denied. You may not have permission to view confirmed students, but you can still enter a student code manually.');
        } else if (status === 404) {
          setError('Student data endpoint not found. Please contact support.');
        } else if (status >= 500) {
          setError('Server error occurred. Please try again later.');
        } else {
          setError(`Failed to load confirmed students (Error ${status}). You can still enter a student code manually.`);
        }
      } else if (error.request) {
        // Request was made but no response received
        setError('Network error. Please check your connection and try again.');
      } else {
        // Something else happened
        setError('An unexpected error occurred. Please try again.');
      }
      
      // Set empty array on error to prevent map issues
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate incident date
    if (name === 'incidentDate') {
      const dateValidation = validateIncidentDate(value);
      setDateError(dateValidation.isValid ? '' : dateValidation.error);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: String(value) // Ensure all values are strings
    }));
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setSearchTerm(student.fullName);
    setFormData(prev => {
      const updated = {
        ...prev,
        studentId: String(student.studentId)
      };
      return updated;
    });
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(true);
    
    // If search is cleared, clear the selection
    if (!value) {
      setSelectedStudent(null);
      setFormData(prev => {
        const updated = {
          ...prev,
          studentId: ''
        };
        return updated;
      });
    }
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields - ensure all fields are strings
      const studentId = String(formData.studentId || '').trim();
      const description = String(formData.description || '').trim();
      
      if (!studentId) {
        setError('Please enter a valid Student ID.');
        setLoading(false);
        return;
      }
      if (!formData.incidentDate || !description) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
      }
 
      // Try both formats to see which one works
      const incidentData = {
        studentId: studentId,  // Direct field approach
        // student: { studentId: studentId },  // Nested object approach  
        incidentDate: formData.incidentDate,
        description: description,
      };

      let result;
      if (isEditing && editingIncident) {
        const incidentId = editingIncident.incidentId || editingIncident.id;
        if (!incidentId) {
          throw new Error('Incident ID is missing from the editing incident object');
        }
        result = await healthIncidentAPI.updateHealthIncident(incidentId, incidentData);
      } else {
        result = await healthIncidentAPI.createHealthIncident(incidentData);
      }

      // Reset form
      setFormData({
        studentId: '',
        incidentDate: getTodayString(),
        description: '',
      });

      // Show success message
      showSuccess(`Health incident ${isEditing ? 'updated' : 'recorded'} successfully!`);

      // Notify parent component
      if (onIncidentSaved) {
        onIncidentSaved();
      }

      // Close modal
      onClose();
    } catch (err) {
      
      // More detailed error handling for submission
      if (err.response) {
        const status = err.response.status;
        const errorData = err.response.data;
        
        if (status === 401) {
          const errorMsg = 'Session expired. Please login again.';
          setError(errorMsg);
          showError(errorMsg);
        } else if (status === 403) {
          const errorMsg = 'Access denied. Please check your permissions.';
          setError(errorMsg);
          showError(errorMsg);
        } else if (status === 400) {
          // Bad request - could be validation error
          const errorMessage = errorData?.message || errorData?.error || 'Invalid data provided';
          const errorMsg = `Validation error: ${errorMessage}. Please check all fields and try again.`;
          setError(errorMsg);
          showError(errorMsg);
        } else if (status === 404) {
          const errorMsg = 'Student not found. Please verify the Student Code is correct.';
          setError(errorMsg);
          showError(errorMsg);
        } else if (status >= 500) {
          const errorMsg = 'Server error occurred. Please try again later.';
          setError(errorMsg);
          showError(errorMsg);
        } else {
          const errorMsg = `Failed to save health incident (Error ${status}). Please try again.`;
          setError(errorMsg);
          showError(errorMsg);
        }
      } else if (err.request) {
        setError('Network error. Please check your connection and try again.');
      } else if (err.message.includes('Authentication required') || err.message.includes('401')) {
        setError('Session expired. Please login again.');
      } else if (err.message.includes('403')) {
        setError('Access denied. Please check your permissions.');
      } else if (err.message.includes('400')) {
        setError('Invalid data provided. Please check all fields and try again.');
      } else if (err.message.includes('500')) {
        setError('Server error occurred. Please try again later.');
      } else {
        setError('Failed to save health incident. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2 text-orange-600" />
            {isEditing ? 'Edit Health Incident' : 'Record New Health Incident'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Selection */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Student Information
            </h3>
            <div>
              <label className="block text-sm font-medium mb-1">
                Select Student <span className="text-red-500">*</span>
                <span className="ml-2 text-xs text-green-600 font-normal">(Confirmed students only)</span>
              </label>
              {loadingStudents ? (
                <div className="flex items-center py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm text-gray-600">Loading students...</span>
                </div>
              ) : (
                <>
                  {safeStudents.length > 0 ? (
                    <div className="relative">
                      {/* Search Input */}
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={handleSearchChange}
                          onFocus={() => setIsDropdownOpen(true)}
                          placeholder="Search confirmed students by name, code, or class..."
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required={!selectedStudent}
                        />
                        <button
                          type="button"
                          onClick={handleDropdownToggle}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                      </div>

                      {/* Selected Student Display */}
                      {selectedStudent && (
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center">
                                <div className="font-medium text-blue-900">{selectedStudent.fullName}</div>                              </div>
                              <div className="text-sm text-blue-700">
                                Code: {selectedStudent.studentCode || 'N/A'} • Class: {selectedStudent.className || 'No Class'}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedStudent(null);
                                setSearchTerm('');
                                setFormData(prev => {
                                  const updated = { ...prev, studentId: '' };
                                  return updated;
                                });
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Dropdown List */}
                      {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredStudents.length > 0 ? (
                            filteredStudents.map(student => (
                              <button
                                key={student.studentId}
                                type="button"
                                onClick={() => handleStudentSelect(student)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-blue-50"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">{student.fullName}</div>
                                    <div className="text-sm text-gray-600">
                                      ID: {student.studentId} • Class: {student.className || 'No Class'}
                                    </div>
                                  </div>
                                  <div className="text-green-600 ml-2">
                                  </div>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-500 text-center">
                              {searchTerm ? 'No confirmed students found matching your search' : 'No confirmed students available'}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Click outside handler */}
                      {isDropdownOpen && (
                        <div
                          className="fixed inset-0 z-5"
                          onClick={() => setIsDropdownOpen(false)}
                        />
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Show current student info prominently when editing and student not found in dropdown */}
                      {isEditing && editingIncident && (editingIncident.student || editingIncident.studentId) && !selectedStudent && (
                        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <div className="text-sm font-medium text-blue-900 mb-1">
                            Current Student Information:
                          </div>
                          <div className="text-sm text-blue-700">
                            <strong>
                              {editingIncident.student?.fullName || 
                               editingIncident.studentName || 
                               'Student Name Not Available'}
                            </strong>
                            <br />
                            Student ID: {editingIncident.student?.studentId || editingIncident.studentId}
                            {editingIncident.student?.className && (
                              <>
                                <br />
                                Class: {editingIncident.student.className}
                              </>
                            )}
                          </div>
                          <div className="text-xs text-blue-600 mt-1">
                            {safeStudents.length > 0 
                              ? "This student was not found in the current student list. The student ID is pre-filled below. You can change it if needed."
                              : "Student ID is pre-filled below. You can change it if needed."
                            }
                          </div>
                        </div>
                      )}
                      <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter Student ID (e.g., ST001)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="mt-1 text-sm text-gray-600">
                        {isEditing ? (
                          formData.studentId ? 
                            `Current student ID: ${formData.studentId}. You can change this if needed.` :
                            'Student list could not be loaded. The current student information is shown above.'
                        ) : (
                          'Enter the student ID directly since the student list could not be loaded.'
                        )}
                      </div>
                    </>
                  )}
                  {safeStudents.length === 0 && !error && (
                    <div className="mt-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          No students found. Please make sure students are registered in the system.
                        </div>
                        <button
                          type="button"
                          onClick={fetchAllStudents}
                          className="text-sm bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded transition-colors"
                          disabled={loadingStudents}
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Incident Details */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Incident Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Incident Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="incidentDate"
                  value={formData.incidentDate}
                  readOnly
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Incident date is automatically set to today
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Describe the health incident in detail (symptoms, circumstances, actions taken, etc.)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Please provide detailed information about the incident, including symptoms, what happened, and any immediate care provided.
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'Updating...' : 'Recording...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Update Incident' : 'Record Incident'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HealthIncidentForm;
