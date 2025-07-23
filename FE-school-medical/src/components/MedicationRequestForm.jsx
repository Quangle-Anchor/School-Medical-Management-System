import React, { useState, useEffect } from 'react';
import { studentAPI } from '../api/studentsApi';
import { medicationAPI } from '../api/medicationApi';
import { X, Upload, Pill, Clock, FileText, User, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/useToast';

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
  const { showSuccess, showError } = useToast();
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
        studentId: editingRequest.studentId || '',
        medicationName: editingRequest.medicationName || '',
        dosage: editingRequest.dosage || '',
        frequency: editingRequest.frequency || '',
        totalQuantity: editingRequest.totalQuantity || '',
        morningQuantity: editingRequest.morningQuantity || '',
        noonQuantity: editingRequest.noonQuantity || '',
        eveningQuantity: editingRequest.eveningQuantity || '',
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
    e.preventDefault(); // Prevent any default behavior
    const file = e.target.files[0];
    if (file) {
      validateAndSetFile(file, e.target);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const validateAndSetFile = (file, inputElement = null) => {
    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    // Get file extension
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    // Check both MIME type and file extension for better validation
    if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(fileExtension)) {
      const errorMsg = `Invalid file format. Please upload only PDF, JPEG, JPG, or PNG files. You uploaded: ${file.name} (${file.type || 'unknown type'})`;
      setError(errorMsg);
      showError(errorMsg);
      // Clear the file input if available
      if (inputElement) {
        inputElement.value = '';
      }
      return;
    }

    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const errorMsg = `File size too large. Maximum size is 5MB. Your file is ${fileSizeMB}MB. Please compress or choose a smaller file.`;
      setError(errorMsg);
      showError(errorMsg);
      // Clear the file input if available
      if (inputElement) {
        inputElement.value = '';
      }
      return;
    }

    // File is valid
    setPrescriptionFile(file);
    setError('');
    showSuccess(`File "${file.name}" uploaded successfully!`);
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

      // Validate studentId is a valid number
      if (isNaN(parseInt(formData.studentId))) {
        setError('Please select a valid student.');
        setLoading(false);
        return;
      }

      // Validate totalQuantity if provided
      if (formData.totalQuantity && isNaN(parseInt(formData.totalQuantity))) {
        setError('Total quantity must be a valid number.');
        setLoading(false);
        return;
      }

      const medicationData = {
        studentId: parseInt(formData.studentId), // Convert to number
        medicationName: formData.medicationName,
        dosage: formData.dosage,
        frequency: formData.frequency,
        totalQuantity: formData.totalQuantity ? parseInt(formData.totalQuantity) : null,
        morningQuantity: formData.morningQuantity || null,
        noonQuantity: formData.noonQuantity || null,
        eveningQuantity: formData.eveningQuantity || null,
      };

      // Remove null values to avoid sending them to backend
      Object.keys(medicationData).forEach(key => {
        if (medicationData[key] === null || medicationData[key] === '') {
          delete medicationData[key];
        }
      });

      console.log('Sending medication data:', medicationData);

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

      // Show success message
      showSuccess(`Medication request ${isEditing ? 'updated' : 'submitted'} successfully!`);

      // Notify parent component
      if (onRequestSubmitted) {
        onRequestSubmitted();
      }

      // Close modal
      onClose();
    } catch (err) {
      console.error('Medication request error:', err);
      let errorMsg = '';
      if (err.response?.data) {
        errorMsg = `Server error: ${err.response.data}`;
      } else if (err.message.includes('Authentication required') || err.message.includes('401')) {
        errorMsg = 'Session expired. Please login again.';
      } else if (err.message.includes('403')) {
        errorMsg = 'Access denied. Please check your permissions.';
      } else if (err.message.includes('400')) {
        errorMsg = 'Invalid data provided. Please check all fields and try again.';
      } else if (err.message.includes('500')) {
        errorMsg = 'Server error occurred. Please try again later.';
      } else {
        errorMsg = 'Failed to submit medication request. Please try again.';
      }
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Stop scrolling on the body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto my-4 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Medication Request' : 'New Medication Request'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm mt-1 whitespace-pre-wrap">{error}</p>
                {error.includes('Invalid file format') && (
                  <div className="mt-2 text-xs">
                    <p className="font-medium">Supported file formats:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>PDF documents (.pdf)</li>
                      <li>JPEG images (.jpg, .jpeg)</li>
                      <li>PNG images (.png)</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Selection */}
          <div className="border rounded-xl p-4">
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
                      {student.fullName} (Code: {student.studentCode || student.studentId})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Medication Information */}
          <div className="border rounded-xl p-4">
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
          <div className="border rounded-xl p-4">
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
                  Noon Quantity
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
          <div className="border rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Prescription Document
            </h3>
            <div>
              <label className="block text-sm font-medium mb-1">
                Upload Prescription (Optional)
              </label>
              <div 
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-gray-400 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={(e) => e.preventDefault()}
              >
                <div className="space-y-1 text-center"
                     onClick={(e) => e.stopPropagation()}>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="prescription-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      onClick={(e) => e.stopPropagation()} // Prevent event bubbling
                    >
                      <span>Choose file</span>
                      <input
                        id="prescription-upload"
                        name="prescription-upload"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.jpg,.jpeg,.png,image/jpeg,image/png,image/jpg,application/pdf"
                        onChange={handleFileChange}
                        onClick={(e) => e.stopPropagation()} // Prevent event bubbling
                      />
                    </label>
                    <p className="pl-1">or drag and drop here</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    <strong>Accepted formats:</strong> PNG, JPG, JPEG, PDF<br/>
                    <strong>Maximum size:</strong> 5MB
                  </p>
                  {prescriptionFile && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            ✓ File uploaded successfully
                          </p>
                          <p className="text-xs text-green-600">
                            {prescriptionFile.name} ({(prescriptionFile.size / (1024 * 1024)).toFixed(2)}MB)
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPrescriptionFile(null);
                            document.getElementById('prescription-upload').value = '';
                            showSuccess('File removed successfully');
                          }}
                          className="ml-2 text-red-600 hover:text-red-800 text-sm underline"
                        >
                          Remove
                        </button>
                      </div>
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
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
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
