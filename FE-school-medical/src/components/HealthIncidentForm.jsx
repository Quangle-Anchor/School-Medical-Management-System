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
      setFormData({
        studentId: editingIncident.student?.studentId || '',
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
      
      // Check if user has token before making API call
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }
      
      const response = await studentAPI.getAllStudents();
      setStudents(response.data || response || []);
    } catch (error) {
      if (error.message.includes('401') || error.message.includes('Authentication')) {
        setError('Session expired. Please login again.');
      } else if (error.message.includes('403')) {
        setError('Access denied. You do not have permission to access student data.');
      } else {
        setError('Failed to load students. Please try again.');
      }
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.studentId || !formData.incidentDate || !formData.description.trim()) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
      }

      const incidentData = {
        student: { studentId: formData.studentId },
        incidentDate: formData.incidentDate,
        description: formData.description.trim(),
      };

      if (isEditing && editingIncident) {
        await healthIncidentAPI.updateHealthIncident(editingIncident.incidentId, incidentData);
      } else {
        await healthIncidentAPI.createHealthIncident(incidentData);
      }

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
      if (err.message.includes('Authentication required') || err.message.includes('401')) {
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
              </label>
              {loadingStudents ? (
                <div className="flex items-center py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm text-gray-600">Loading students...</span>
                </div>
              ) : (
                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a student</option>
                  {students.map(student => (
                    <option key={student.studentId} value={student.studentId}>
                      {student.fullName} (ID: {student.studentId}) - {student.className}
                    </option>
                  ))}
                </select>
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
