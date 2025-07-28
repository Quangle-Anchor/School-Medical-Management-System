import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { User, Activity, Calendar, X } from 'lucide-react';
import { studentAPI } from '../../api/studentsApi';
import { validateBirthdate, formatDateForInput } from '../../utils/dateUtils';
import { useToast } from '../../hooks/useToast';

const AddStudentForm = ({ isOpen, onClose, onStudentAdded, editingStudent = null, isEditing = false }) => {  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    className: '',
    bloodType: '',
    heightCm: '',
    weightKg: '',
    healthStatus: 'on', // Default health status to match DB values
    medicalConditions: '',
    allergies: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateError, setDateError] = useState('');
  const [loadingHealthInfo, setLoadingHealthInfo] = useState(false);
  const { showSuccess, showError } = useToast();  // Initialize form data when editing
  useEffect(() => {
    const loadFormData = async () => {
      if (isEditing && editingStudent) {
        setLoadingHealthInfo(true);
        
        // Load basic student data
        const basicData = {
          fullName: editingStudent.fullName || '',
          dateOfBirth: editingStudent.dateOfBirth ? formatDateForInput(editingStudent.dateOfBirth) : '',
          gender: editingStudent.gender || '',
          className: editingStudent.className || '',
          bloodType: editingStudent.bloodType || '',
          heightCm: editingStudent.heightCm ? editingStudent.heightCm.toString() : '',
          weightKg: editingStudent.weightKg ? editingStudent.weightKg.toString() : '',
          healthStatus: editingStudent.healthStatus || 'on', // Get health status from student data
          medicalConditions: '',
          allergies: '',
          notes: '',
        };

        try {
          // Fetch existing health info
          const healthInfoResponse = await studentAPI.getHealthInfoByStudentId(editingStudent.studentId);
          
          if (healthInfoResponse && healthInfoResponse.length > 0) {
            const healthInfo = healthInfoResponse[0];
            console.log('Loaded health info:', healthInfo);
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
          healthStatus: 'on',
          medicalConditions: '',
          allergies: '',
          notes: '',
        });
      }
      setError('');
      setDateError('');
    };

    loadFormData();
  }, [isEditing, editingStudent, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate date of birth
    if (name === 'dateOfBirth') {
      const dateValidation = validateBirthdate(value);
      setDateError(dateValidation.isValid ? '' : dateValidation.error);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate birthdate before submission
    const dateValidation = validateBirthdate(formData.dateOfBirth);
    if (!dateValidation.isValid) {
      setError(dateValidation.error);
      setLoading(false);
      return;
    }

    try {
      const studentData = {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        className: formData.className,
        bloodType: formData.bloodType || null,
        heightCm: formData.heightCm ? parseInt(formData.heightCm) : null,
        weightKg: formData.weightKg ? parseInt(formData.weightKg) : null,
        healthStatus: formData.healthStatus || 'on', // Add healthStatus to student data
      };

      let savedStudent;
        if (isEditing && editingStudent) {
        // Update existing student
        savedStudent = await studentAPI.updateStudent(editingStudent.studentId, studentData);
      } else {
        // Create new student
        savedStudent = await studentAPI.createStudent(studentData);
      }      // Handle health info (for both create and update)
      const healthInfoData = {
        studentId: savedStudent.studentId,
        medicalConditions: formData.medicalConditions || null,
        allergies: formData.allergies || null,
        notes: formData.notes || null,
      };

      // Only create/update health info if there's actual health information
      const hasHealthInfo = formData.medicalConditions || formData.allergies || formData.notes;

      if (isEditing && editingStudent) {
        // When editing, check if health info already exists
        try {
          const existingHealthInfo = await studentAPI.getHealthInfoByStudentId(editingStudent.studentId);
          
          console.log('Existing health info:', existingHealthInfo);
          console.log('Health info data to save:', healthInfoData);
          
          if (existingHealthInfo && existingHealthInfo.length > 0) {
            // Update existing health info if there's data to save
            if (hasHealthInfo) {
              const healthInfoId = existingHealthInfo[0].healthInfoId;
              console.log('Updating health info ID:', healthInfoId);
              await studentAPI.updateHealthInfo(healthInfoId, healthInfoData);
            }
          } else if (hasHealthInfo) {
            // No existing health info, create new one only if there's data
            console.log('Creating new health info');
            await studentAPI.createHealthInfo(healthInfoData);
          }
        } catch (error) {
          // Fallback: create health info only if there's data to save
          if (hasHealthInfo) {
            await studentAPI.createHealthInfo(healthInfoData);
          }
        }
      } else if (hasHealthInfo) {
        // Only create health info for new students if there's actual health data
        console.log('Creating health info for new student:', healthInfoData);
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
        healthStatus: 'on',
        medicalConditions: '',
        allergies: '',
        notes: '',
      });
      // Notify parent component with complete student data
      if (onStudentAdded) {
        onStudentAdded(completeStudentData);
      }

      // Show success message
      showSuccess(`Student ${isEditing ? 'updated' : 'added'} successfully!`);

      // Close modal
      onClose();    } catch (err) {
      // More specific error handling with toast notifications
      let errorMessage = '';
      if (err.message.includes('Authentication required')) {
        errorMessage = 'Session expired. Please login again.';
        showError(errorMessage);
        // The API already handles redirection to login
      } else if (err.message.includes('Access forbidden')) {
        errorMessage = 'You do not have permission to perform this action.';
        showError(errorMessage);
      } else if (err.message.includes('400')) {
        errorMessage = 'Invalid data provided. Please check all fields and try again.';
        showError(errorMessage);
      } else if (err.message.includes('401')) {
        errorMessage = 'Authentication failed. Please login again.';
        showError(errorMessage);
      } else if (err.message.includes('403')) {
        errorMessage = 'Access denied. Please check your permissions.';
        showError(errorMessage);
      } else if (err.message.includes('500')) {
        errorMessage = 'Server error occurred. Please try again later.';
        showError(errorMessage);
      } else {
        errorMessage = 'Failed to add student. Please check your connection and try again.';
        showError(errorMessage);
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" 
      style={{ zIndex: 99999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ zIndex: 99999, position: 'relative' }}
      >        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {isEditing ? 'Edit Student' : 'Add New Children'}
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
                  max={new Date().toISOString().split('T')[0]} // No future dates
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    dateError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {dateError && (
                  <p className="mt-1 text-sm text-red-600">{dateError}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Enter the student's birth date 
                </p>
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
              <div className="md:col-span-3">
                <label className="block text-sm font-medium mb-1">Health Status *</label>
                <select
                  name="healthStatus"
                  value={formData.healthStatus}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Healthy">Healthy</option>
                  <option value="Sick">Sick</option>
                  <option value="Good">Good</option>
                  <option value="Normal">Normal</option>
                </select>
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
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Student' : 'Add Student')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Use React portal to render the modal at the root level
  return ReactDOM.createPortal(modalContent, document.body);
};

export default AddStudentForm;