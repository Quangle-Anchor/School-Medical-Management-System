import React, { useState, useEffect } from 'react';
import { User, Activity, Calendar, X } from 'lucide-react';
import { studentAPI } from '../../api/studentsApi';

const AddStudentForm = ({ isOpen, onClose, onStudentAdded, editingStudent = null, isEditing = false }) => {  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    className: '',
    bloodType: '',
    heightCm: '',
    weightKg: '',
    medicalConditions: '',
    allergies: '',
    notes: '',
  });
    const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingHealthInfo, setLoadingHealthInfo] = useState(false);  // Initialize form data when editing
  useEffect(() => {
    const loadFormData = async () => {
      if (isEditing && editingStudent) {
        setLoadingHealthInfo(true);
        
        // Load basic student data
        const basicData = {
          fullName: editingStudent.fullName || '',
          dateOfBirth: editingStudent.dateOfBirth || '',
          gender: editingStudent.gender || '',
          className: editingStudent.className || '',
          bloodType: editingStudent.bloodType || '',
          heightCm: editingStudent.heightCm ? editingStudent.heightCm.toString() : '',
          weightKg: editingStudent.weightKg ? editingStudent.weightKg.toString() : '',
          medicalConditions: '',
          allergies: '',
          notes: '',
        };

        try {
          // Fetch existing health info
          const healthInfoResponse = await studentAPI.getHealthInfoByStudentId(editingStudent.studentId);
          
          if (healthInfoResponse && healthInfoResponse.length > 0) {
            const healthInfo = healthInfoResponse[0];
            basicData.medicalConditions = healthInfo.medicalConditions || '';
            basicData.allergies = healthInfo.allergies || '';
            basicData.notes = healthInfo.notes || '';
          }        } catch (error) {
          // Continue with empty health info fields
        } finally {
          setLoadingHealthInfo(false);
        }

        setFormData(basicData);
      } else {
        // Reset form for adding new student
        setFormData({
          fullName: '',
          dateOfBirth: '',
          gender: '',
          className: '',
          bloodType: '',
          heightCm: '',
          weightKg: '',
          medicalConditions: '',
          allergies: '',
          notes: '',
        });
      }
      setError('');
    };

    loadFormData();
  }, [isEditing, editingStudent, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const studentData = {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        className: formData.className,
        bloodType: formData.bloodType || null,
        heightCm: formData.heightCm ? parseInt(formData.heightCm) : null,
        weightKg: formData.weightKg ? parseInt(formData.weightKg) : null,
      };

      let savedStudent;
        if (isEditing && editingStudent) {
        // Update existing student
        savedStudent = await studentAPI.updateStudent(editingStudent.studentId, studentData);
      } else {
        // Create new student
        savedStudent = await studentAPI.createStudent(studentData);
      }// Handle health info (for both create and update)
      const healthInfoData = {
        student: { studentId: savedStudent.studentId },
        medicalConditions: formData.medicalConditions || null,
        allergies: formData.allergies || null,
        notes: formData.notes || null,
      };

      if (isEditing && editingStudent) {
        // When editing, check if health info already exists
        try {
          const existingHealthInfo = await studentAPI.getHealthInfoByStudentId(editingStudent.studentId);
            if (existingHealthInfo && existingHealthInfo.length > 0) {
            // Update existing health info (even if all fields are empty)
            const healthInfoId = existingHealthInfo[0].healthInfoId;
            await studentAPI.updateHealthInfo(healthInfoId, healthInfoData);
          } else if (formData.medicalConditions || formData.allergies || formData.notes) {
            // No existing health info, but user provided health data, create new one
            await studentAPI.createHealthInfo(healthInfoData);
          }
        } catch (error) {
          // Fallback: only create if there's actual health data
          if (formData.medicalConditions || formData.allergies || formData.notes) {
            await studentAPI.createHealthInfo(healthInfoData);
          }        }
      } else if (formData.medicalConditions || formData.allergies || formData.notes) {
        // Creating new student, only create health info if there's data
        await studentAPI.createHealthInfo(healthInfoData);
      }
      
      // After saving both student and health info, fetch the complete student data
      // to ensure the parent component gets the full, up-to-date student object
      let completeStudentData = { ...savedStudent };
      
      try {
        const healthInfoResponse = await studentAPI.getHealthInfoByStudentId(savedStudent.studentId);
        if (healthInfoResponse && healthInfoResponse.length > 0) {
          const healthInfo = healthInfoResponse[0];
          completeStudentData = {
            ...savedStudent,
            medicalConditions: healthInfo.medicalConditions || '',
            allergies: healthInfo.allergies || '',
            notes: healthInfo.notes || ''
          };        }
      } catch (error) {
        // If we can't fetch health info, still use the form data
        completeStudentData = {
          ...savedStudent,
          medicalConditions: formData.medicalConditions || '',
          allergies: formData.allergies || '',
          notes: formData.notes || ''
        };
      }
      
      // Reset form
      setFormData({
        fullName: '',
        dateOfBirth: '',
        gender: '',
        className: '',
        bloodType: '',
        heightCm: '',
        weightKg: '',
        medicalConditions: '',
        allergies: '',
        notes: '',
      });
        // Notify parent component with complete student data
      if (onStudentAdded) {
        onStudentAdded(completeStudentData);
      }      // Close modal
      onClose();} catch (err) {
      // More specific error handling
      if (err.message.includes('Authentication required')) {
        setError('Session expired. Please login again.');
        // The API already handles redirection to login
      } else if (err.message.includes('Access forbidden')) {
        setError('You do not have permission to perform this action.');
      } else if (err.message.includes('400')) {
        setError('Invalid data provided. Please check all fields and try again.');
      } else if (err.message.includes('401')) {
        setError('Authentication failed. Please login again.');
      } else if (err.message.includes('403')) {
        setError('Access denied. Please check your permissions.');
      } else if (err.message.includes('500')) {
        setError('Server error occurred. Please try again later.');
      } else {
        setError('Failed to add student. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {isEditing ? 'Edit Student' : 'Add New Student'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loadingHealthInfo && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm text-blue-700">Loading health information...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Information */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Student Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Class Name *</label>
                <input
                  type="text"
                  name="className"
                  value={formData.className}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Grade 1A, 10A1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Health Information */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Health Information
            </h3>            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Blood Type</label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Height (cm)</label>
                <input
                  type="number"
                  name="heightCm"
                  value={formData.heightCm}
                  onChange={handleInputChange}
                  min="50"
                  max="250"
                  placeholder="e.g., 120"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                <input
                  type="number"
                  name="weightKg"
                  value={formData.weightKg}
                  onChange={handleInputChange}
                  min="10"
                  max="200"
                  placeholder="e.g., 35"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Medical Conditions</label>
                <input
                  type="text"
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleInputChange}
                  placeholder="e.g., Asthma, Diabetes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Allergies</label>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  placeholder="e.g., Peanuts, Milk"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium mb-1">Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Any additional health information or notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Student' : 'Add Student')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentForm;