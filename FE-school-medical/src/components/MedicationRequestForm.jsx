import React, { useState, useEffect } from 'react';
import { studentAPI } from '../api/studentsApi';
import { medicationAPI } from '../api/medicationApi';
import { X, Upload, Pill, Clock, FileText, User, AlertCircle } from 'lucide-react';

const MedicationRequestForm = ({ isOpen, onClose, onRequestSubmitted, editingRequest = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    medicationName: '',
    dosage: '',
    frequency: '',
    totalQuantity: '',
    morningQuantity: '',
    noonQuantity: '',
    eveningQuantity: '',
  });
  
  const [prescriptionFile, setPrescriptionFile] = useState(null);
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
      
      fetchMyStudents();
    }
  }, [isOpen]);

  // Initialize form data when editing
  useEffect(() => {
    if (isEditing && editingRequest) {
      setFormData({
        studentId: editingRequest.student?.studentId || editingRequest.studentId || '',
        medicationName: editingRequest.medicationName || editingRequest.medication_name || '',
        dosage: editingRequest.dosage || '',
        frequency: editingRequest.frequency || '',
        totalQuantity: editingRequest.totalQuantity || editingRequest.total_quantity || '',
        morningQuantity: editingRequest.morningQuantity || editingRequest.morning_quantity || '',
        noonQuantity: editingRequest.noonQuantity || editingRequest.noon_quantity || '',
        eveningQuantity: editingRequest.eveningQuantity || editingRequest.evening_quantity || '',
      });
    } else {
      setFormData({
        studentId: '',
        medicationName: '',
        dosage: '',
        frequency: '',
        totalQuantity: '',
        morningQuantity: '',
        noonQuantity: '',
        eveningQuantity: '',
      });
      setPrescriptionFile(null);
    }
    setError('');
  }, [isEditing, editingRequest, isOpen]);
  const fetchMyStudents = async () => {
    try {
      setLoadingStudents(true);
      
      // Check if user has token before making API call
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }
      
      const response = await studentAPI.getMyStudents();
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a valid file (JPEG, PNG, or PDF)');
        return;
      }

      if (file.size > maxSize) {
        setError('File size must be less than 5MB');
        return;
      }

      setPrescriptionFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.studentId || !formData.medicationName || !formData.dosage || !formData.frequency) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
      }

      const medicationData = {
        student: { studentId: formData.studentId },
        medicationName: formData.medicationName,
        dosage: formData.dosage,
        frequency: formData.frequency,
        totalQuantity: formData.totalQuantity || '',
        morningQuantity: formData.morningQuantity || '',
        noonQuantity: formData.noonQuantity || '',
        eveningQuantity: formData.eveningQuantity || '',
      };

      if (isEditing && editingRequest) {
        await medicationAPI.updateMedicationRequest(editingRequest.requestId, medicationData, prescriptionFile);
      } else {
        await medicationAPI.createMedicationRequest(medicationData, prescriptionFile);
      }

      // Reset form
      setFormData({
        studentId: '',
        medicationName: '',
        dosage: '',
        frequency: '',
        totalQuantity: '',
        morningQuantity: '',
        noonQuantity: '',
        eveningQuantity: '',
      });
      setPrescriptionFile(null);

      // Notify parent component
      if (onRequestSubmitted) {
        onRequestSubmitted();
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
        setError('Failed to submit medication request. Please try again.');
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
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Medication Request' : 'New Medication Request'}
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
            <AlertCircle className="w-5 h-5 mr-2" />
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
                      {student.fullName} (ID: {student.studentId})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Medication Information */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Pill className="w-4 h-4 mr-2" />
              Medication Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Medication Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="medicationName"
                  value={formData.medicationName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Paracetamol, Amoxicillin"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Dosage <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 500mg, 1 tablet"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Frequency <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Three times daily, Every 8 hours, As needed"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Quantity Information */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Quantity Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Total Quantity
                </label>
                <input
                  type="text"
                  name="totalQuantity"
                  value={formData.totalQuantity}
                  onChange={handleInputChange}
                  placeholder="e.g., 30 tablets, 100ml"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Morning Quantity
                </label>
                <input
                  type="text"
                  name="morningQuantity"
                  value={formData.morningQuantity}
                  onChange={handleInputChange}
                  placeholder="e.g., 1 tablet, 5ml"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Afternoon Quantity
                </label>
                <input
                  type="text"
                  name="noonQuantity"
                  value={formData.noonQuantity}
                  onChange={handleInputChange}
                  placeholder="e.g., 1 tablet, 5ml"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Evening Quantity
                </label>
                <input
                  type="text"
                  name="eveningQuantity"
                  value={formData.eveningQuantity}
                  onChange={handleInputChange}
                  placeholder="e.g., 1 tablet, 5ml"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Specify the quantities for different times of the day if applicable. Include units (tablets, ml, etc.). Leave empty if not needed.
            </p>
          </div>

          {/* Prescription File Upload */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Prescription Document
            </h3>
            <div>
              <label className="block text-sm font-medium mb-1">
                Upload Prescription (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="prescription-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="prescription-upload"
                        name="prescription-upload"
                        type="file"
                        className="sr-only"
                        accept="image/jpeg,image/png,image/jpg,application/pdf"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF up to 5MB
                  </p>
                  {prescriptionFile && (
                    <div className="mt-2">
                      <p className="text-sm text-green-600">
                        Selected: {prescriptionFile.name}
                      </p>
                    </div>
                  )}
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'Updating...' : 'Submitting...'}
                </>
              ) : (
                <>
                  <Pill className="w-4 h-4 mr-2" />
                  {isEditing ? 'Update Request' : 'Submit Request'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicationRequestForm;
