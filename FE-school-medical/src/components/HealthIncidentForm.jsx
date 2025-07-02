import React, { useState, useEffect } from 'react';
import { healthIncidentAPI } from '../api/healthIncidentApi';
import { studentAPI } from '../api/studentsApi';
import { X, AlertTriangle, Calendar, User, FileText, Save } from 'lucide-react';

const HealthIncidentForm = ({ isOpen, onClose, onIncidentSaved, editingIncident = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    incidentDate: '',
    description: '',
  });
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState('');

  // Ensure students is always an array to prevent map errors
  const safeStudents = Array.isArray(students) ? students : [];

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
        incidentDate: editingIncident.incidentDate || '',
        description: editingIncident.description || '',
      });
    } else {
      setFormData({
        studentId: '',
        incidentDate: new Date().toISOString().split('T')[0], // Default to today
        description: '',
      });
    }
    setError('');
  }, [isEditing, editingIncident, isOpen]);

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
      
      console.log('Fetching students...');
        // Use getMyStudents which handles role-based access properly
      const response = await studentAPI.getMyStudents();
      console.log('Students API response:', response);
      
      // getMyStudents returns an array directly, not a paginated response
      const studentsData = Array.isArray(response) ? response : [];
      console.log('Processed students data:', studentsData);
      
      setStudents(studentsData);
      
      if (studentsData.length === 0) {
        console.warn('No students found in the response');
        setError('No students found. Please make sure students are registered in the system.');
      } else {
        console.log(`Successfully loaded ${studentsData.length} students`);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      
      // More detailed error handling
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        console.error('Server error status:', status, error.response.data);
        
        if (status === 401) {
          setError('Session expired. Please login again.');
        } else if (status === 403) {
          setError('Access denied. You may not have permission to view the student list, but you can still enter a student ID manually.');
        } else if (status === 404) {
          setError('Student data endpoint not found. Please contact support.');
        } else if (status >= 500) {
          setError('Server error occurred. Please try again later.');
        } else {
          setError(`Failed to load students (Error ${status}). You can still enter a student ID manually.`);
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error('Network error:', error.request);
        setError('Network error. Please check your connection and try again.');
      } else {
        // Something else happened
        console.error('Unexpected error:', error.message);
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
    console.log(`Form field changed: ${name} = "${value}"`);
    setFormData(prev => ({
      ...prev,
      [name]: String(value) // Ensure all values are strings
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Form submission started. Current form data:', formData);

    try {
      // Validate required fields - ensure all fields are strings
      const studentId = String(formData.studentId || '').trim();
      const description = String(formData.description || '').trim();
      
      if (!studentId || !formData.incidentDate || !description) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
      }

      console.log('Submitting health incident with data:', {
        studentId: studentId,
        incidentDate: formData.incidentDate,
        description: description
      });

      // Try both formats to see which one works
      const incidentData = {
        studentId: studentId,  // Direct field approach
        // student: { studentId: studentId },  // Nested object approach  
        incidentDate: formData.incidentDate,
        description: description,
      };

      console.log('Formatted incident data for API:', incidentData);

      let result;
      if (isEditing && editingIncident) {
        const incidentId = editingIncident.incidentId || editingIncident.id;
        console.log('Updating existing incident with ID:', incidentId, 'Full incident object:', editingIncident);
        if (!incidentId) {
          throw new Error('Incident ID is missing from the editing incident object');
        }
        result = await healthIncidentAPI.updateHealthIncident(incidentId, incidentData);
      } else {
        console.log('Creating new incident');
        result = await healthIncidentAPI.createHealthIncident(incidentData);
      }
      
      console.log('Health incident operation successful:', result);

      // Reset form
      setFormData({
        studentId: '',
        incidentDate: new Date().toISOString().split('T')[0],
        description: '',
      });

      // Notify parent component
      if (onIncidentSaved) {
        onIncidentSaved();
      }

      // Close modal
      onClose();
    } catch (err) {
      console.error('Error submitting health incident:', err);
      
      // More detailed error handling for submission
      if (err.response) {
        const status = err.response.status;
        const errorData = err.response.data;
        console.error('Server error:', status, errorData);
        
        if (status === 401) {
          setError('Session expired. Please login again.');
        } else if (status === 403) {
          setError('Access denied. Please check your permissions.');
        } else if (status === 400) {
          // Bad request - could be validation error
          const errorMessage = errorData?.message || errorData?.error || 'Invalid data provided';
          setError(`Validation error: ${errorMessage}. Please check all fields and try again.`);
        } else if (status === 404) {
          setError('Student not found. Please verify the Student ID is correct.');
        } else if (status >= 500) {
          setError('Server error occurred. Please try again later.');
        } else {
          setError(`Failed to save health incident (Error ${status}). Please try again.`);
        }
      } else if (err.request) {
        console.error('Network error:', err.request);
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
        console.error('Unexpected error:', err.message);
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
              </label>
              {loadingStudents ? (
                <div className="flex items-center py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm text-gray-600">Loading students...</span>
                </div>
              ) : (
                <>
                  {safeStudents.length > 0 ? (
                    <>
                      <select
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Choose a student</option>
                        {safeStudents.map(student => (
                          <option key={student.studentId} value={student.studentId}>
                            {student.fullName} (ID: {student.studentId}) - {student.className || 'No Class'}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <>
                      {/* Show current student info prominently when editing */}
                      {isEditing && editingIncident && (editingIncident.student || editingIncident.studentId) && (
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
                            Student ID is pre-filled below. You can change it if needed.
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
                  onChange={handleInputChange}
                  required
                  max={new Date().toISOString().split('T')[0]} // Can't select future dates
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
