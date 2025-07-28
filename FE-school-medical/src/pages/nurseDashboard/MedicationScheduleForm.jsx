import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { medicationScheduleAPI } from '../../api/medicationScheduleApi';
import { medicationAPI } from '../../api/medicationApi';
import { Calendar, Clock, User, Save, ArrowLeft, AlertCircle, CheckCircle, Package, Users } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import '../../styles/time-picker.css';
import { 
  getMedicationScheduleDate, 
  validateMedicationScheduleTime, 
  validateScheduleDate,
  getMinScheduleTime,
  getCurrentTime,
  formatTimeTo24Hour
} from '../../utils/dateUtils';

const MedicationScheduleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  const getScheduleIdFromPath = () => {
    const path = location.pathname;
    const match = path.match(/\/nurseDashboard\/medication-schedules\/edit\/(\d+)/);
    return match ? match[1] : null;
  };

  const scheduleId = id || getScheduleIdFromPath();
  const isEditMode = Boolean(scheduleId);
  
  const [availableRequests, setAvailableRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const { showSuccess, showError: showErrorToast } = useToast();
  
  // Schedule Form State
  const [scheduleForm, setScheduleForm] = useState({
    requestId: '', // Now tracks selected request
    scheduledDate: getMedicationScheduleDate(), // Always set to today for nurses
    scheduledTime: '',
    notes: '',
    dispensedQuantity: ''
  });

  useEffect(() => {
    fetchInitialData();
    if (isEditMode && scheduleId) {
      fetchScheduleDetails();
    }
  }, [scheduleId, isEditMode]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Fetch all medication requests for nurse
      const requestsData = await medicationAPI.getAllRequests();
      // Include both confirmed and in_progress requests
      setAvailableRequests(Array.isArray(requestsData)
        ? requestsData.filter(r => {
            const status = r.confirmationStatus?.toLowerCase();
            return status === 'confirmed' || status === 'in_progress';
          })
        : []);
    } catch (error) {
      const errorMessage = 'Failed to load medication requests data';
      showErrorToast(errorMessage);
      setAvailableRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduleDetails = async () => {
    try {
      const schedule = await medicationScheduleAPI.getScheduleById(scheduleId);
      
      if (schedule) {
        const formattedDate = schedule.scheduledDate ? 
          new Date(schedule.scheduledDate).toISOString().split('T')[0] : '';
        const formattedTime = formatTimeTo24Hour(schedule.scheduledTime || '');
          
        setScheduleForm({
          requestId: schedule.requestId?.toString() || '',
          scheduledDate: formattedDate,
          scheduledTime: formattedTime,
          notes: schedule.notes || '',
          dispensedQuantity: schedule.dispensedQuantity || ''
        });
      } else {
        const errorMessage = 'Schedule not found';
        showErrorToast(errorMessage);
      }
    } catch (error) {
      let errorMessage;
      if (error.response?.status === 404) {
        errorMessage = `Schedule with ID ${scheduleId} not found`;
      } else {
        errorMessage = 'Failed to fetch schedule details for editing';
      }
      showErrorToast(errorMessage);
    }
  };

  const handleScheduleFormChange = (field, value) => {
    // Format time to 24-hour format
    if (field === 'scheduledTime') {
      // TimePicker returns null when cleared, handle this case
      if (value === null || value === undefined) {
        value = '';
      } else if (typeof value === 'string') {
        value = formatTimeTo24Hour(value);
      }
    }

    setScheduleForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }

    // Real-time validation
    if (field === 'scheduledDate') {
      const dateValidation = validateScheduleDate(value, true); // true for medication schedule
      if (!dateValidation.isValid) {
        setValidationErrors(prev => ({
          ...prev,
          scheduledDate: dateValidation.error
        }));
      }
    } else if (field === 'scheduledTime') {
      const timeValidation = validateMedicationScheduleTime(value, scheduleForm.scheduledDate);
      if (!timeValidation.isValid) {
        setValidationErrors(prev => ({
          ...prev,
          scheduledTime: timeValidation.error
        }));
      }
    }

    // When a request is selected, update form with request details
    if (field === 'requestId' && value) {
      const selectedReq = availableRequests.find(
        r => r.requestId?.toString() === value.toString()
      );
      if (selectedReq) {
        setScheduleForm(prev => ({
          ...prev,
          requestId: value,
          medicationName: selectedReq.medicationName,
          dosage: selectedReq.dosage,
          frequency: selectedReq.frequency
        }));
      }
    }
  };

  const validateForms = () => {
    let errors = {};
    let isValid = true;

    // Schedule form validation
    if (!scheduleForm.requestId) {
      errors.requestId = 'Please select a medication request';
      isValid = false;
    }

    // Date validation
    if (!scheduleForm.scheduledDate) {
      errors.scheduledDate = 'Please select a scheduled date';
      isValid = false;
    } else {
      const dateValidation = validateScheduleDate(scheduleForm.scheduledDate, true); // true for medication schedule
      if (!dateValidation.isValid) {
        errors.scheduledDate = dateValidation.error;
        isValid = false;
      }
    }

    // Time validation
    if (!scheduleForm.scheduledTime) {
      errors.scheduledTime = 'Please select a scheduled time';
      isValid = false;
    } else {
      const timeValidation = validateMedicationScheduleTime(scheduleForm.scheduledTime, scheduleForm.scheduledDate);
      if (!timeValidation.isValid) {
        errors.scheduledTime = timeValidation.error;
        isValid = false;
      }
    }

    // Quantity validation
    if (!scheduleForm.dispensedQuantity || scheduleForm.dispensedQuantity <= 0) {
      errors.dispensedQuantity = 'Please enter a valid dispensed quantity';
      isValid = false;
    }

    setValidationErrors(errors);

    // Show first error in toast
    if (!isValid) {
      const firstError = Object.values(errors)[0];
      showErrorToast(firstError);
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForms()) {
      return;
    }

    setSubmitting(true);

    try {
      const schedulePayload = {
        requestId: parseInt(scheduleForm.requestId),
        scheduledDate: scheduleForm.scheduledDate,
        scheduledTime: scheduleForm.scheduledTime,
        notes: scheduleForm.notes || "",
        dispensedQuantity: parseInt(scheduleForm.dispensedQuantity)
      };

      if (isEditMode) {
        await medicationScheduleAPI.updateSchedule(scheduleId, schedulePayload);
        showSuccess('Medication schedule updated successfully');
      } else {
        await medicationScheduleAPI.createSchedule(schedulePayload);
        showSuccess('Medication schedule created successfully');
      }

      // Navigate back after showing success message
      setTimeout(() => {
        navigate('/nurseDashboard/medication-schedules');
      }, 2500);
    } catch (error) {
      let errorMessage;

      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 403) {
          errorMessage = "You don't have permission to perform this action. Please make sure you are logged in as a nurse.";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your connection.";
      } else {
        // Something happened in setting up the request
        errorMessage = error.message || `Failed to ${isEditMode ? 'update' : 'create'} medication schedule`;
      }

      // Show error only in toast
      showErrorToast(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (isEditMode && !scheduleId) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/nurseDashboard/medication-schedules')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Schedules
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-900 mb-2">
            No Schedule ID Provided
          </h2>
          <p className="text-red-700 mb-4">
            Unable to edit schedule without a valid schedule ID.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => navigate('/nurseDashboard/medication-schedules')}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit' : 'Create'} Medication Schedule
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode ? 'Update the medication schedule details' : 'Schedule medication administration for available requests'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Create Schedule Form - Left Side */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Schedule Information
            </h2>
            
            <div className="space-y-6">
              {/* Request Selection */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Available Request <span className="text-red-500">*</span>
                  </div>
                </label>
                <select
                  value={scheduleForm.requestId}
                  onChange={(e) => {
                    const selectedReq = availableRequests.find(
                      r => r.requestId?.toString() === e.target.value
                    );
                    // Only allow selection if stock is sufficient
                    if (!selectedReq || selectedReq.isSufficientStock !== false) {
                      handleScheduleFormChange('requestId', e.target.value);
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.requestId ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select an available request</option>
                  {availableRequests.map((req) => {
                    const hasInsufficientStock = req.isSufficientStock === false;
                    const status = req.confirmationStatus?.toLowerCase();
                    return (
                      <option 
                        key={req.requestId} 
                        value={req.requestId}
                        disabled={hasInsufficientStock}
                        style={{
                          color: hasInsufficientStock ? '#dc2626' : (status === 'confirmed' ? '#059669' : '#d97706'),
                          backgroundColor: hasInsufficientStock ? '#fef2f2' : (status === 'confirmed' ? '#f0fdf4' : '#fffbeb')
                        }}
                      >
                        {hasInsufficientStock ? '🚫 ' : (status === 'confirmed' ? '✅ ' : '🟡 ')}
                        {req.studentName || req.fullName || 'Unknown'} - {req.studentCode} (Request #{req.requestId})
                        {hasInsufficientStock ? ' - Insufficient Stock' : ''}
                      </option>
                    );
                  })}
                </select>
                {/* Legend for status colors */}
                <div className="mt-2 text-xs text-gray-600 space-y-1">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <span className="text-green-600 mr-1">✅</span>
                      Confirmed
                    </span>
                    <span className="flex items-center">
                      <span className="text-orange-600 mr-1">🟡</span>
                      In Progress
                    </span>
                    <span className="flex items-center">
                      <span className="text-red-600 mr-1">🚫</span>
                      Insufficient Stock (Disabled)
                    </span>
                  </div>
                </div>
                {validationErrors.requestId && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {validationErrors.requestId}
                  </p>
                )}
                {/* Show selected request details */}
                {scheduleForm.requestId && (() => {
                  const selectedReq = availableRequests.find(
                    r => r.requestId?.toString() === scheduleForm.requestId.toString()
                  );
                  if (!selectedReq) return (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="font-medium text-red-900 mb-2">No available request found for this request ID.</h3>
                    </div>
                  );
                })()}
              </div>

              {/* Scheduled Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Scheduled Date <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="date"
                  value={scheduleForm.scheduledDate}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                  required
                />
                <p className="mt-1 text-xs text-blue-600">
                  📅 Medication schedules can only be created for today
                </p>
                {validationErrors.scheduledDate && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {validationErrors.scheduledDate}
                  </p>
                )}
              </div>

              {/* Scheduled Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Scheduled Time (24-hour format) <span className="text-red-500">*</span>
                  </div>
                </label>
                <div className={`w-full px-4 py-3 border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 ${
                  validationErrors.scheduledTime ? 'border-red-300' : 'border-gray-300'
                }`}>
                  <TimePicker
                    value={scheduleForm.scheduledTime}
                    onChange={(value) => handleScheduleFormChange('scheduledTime', value)}
                    className={validationErrors.scheduledTime ? 'time-picker-error' : ''}
                    clockIcon={null}
                    clearIcon={null}
                    format="HH:mm"
                    locale="en-US"
                    disableClock={true}
                    hourPlaceholder="HH"
                    minutePlaceholder="MM"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  ⏰ Current time: {getCurrentTime()} (24-hour format) - Schedule must be in the future
                </p>
                {validationErrors.scheduledTime && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {validationErrors.scheduledTime}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Notes
                  </div>
                </label>
                <textarea
                  value={scheduleForm.notes}
                  onChange={(e) => handleScheduleFormChange('notes', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Additional notes for medication administration..."
                />
              </div>

              {/* Dispensed Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Dispensed Quantity <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="number"
                  value={scheduleForm.dispensedQuantity}
                  onChange={(e) => handleScheduleFormChange('dispensedQuantity', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.dispensedQuantity ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter quantity to dispense"
                  min="1"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter the actual quantity to be dispensed for this administration
                </p>
                {validationErrors.dispensedQuantity && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {validationErrors.dispensedQuantity}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Request Summary - Right Side */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-600" />
              Request Summary
            </h2>
            
            {scheduleForm.requestId ? (() => {
              const selectedReq = availableRequests.find(
                r => r.requestId?.toString() === scheduleForm.requestId.toString()
              );
              if (!selectedReq) return (
                <div className="text-center text-gray-500 py-8">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Request not found</p>
                </div>
              );
              return (
                <div className="space-y-4">
                  {/* Request Status */}
                  <div className={`border rounded-lg p-4 ${
                    selectedReq.confirmationStatus?.toLowerCase() === 'confirmed' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-orange-50 border-orange-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className={`font-medium ${
                          selectedReq.confirmationStatus?.toLowerCase() === 'confirmed' 
                            ? 'text-green-900' 
                            : 'text-orange-900'
                        }`}>
                          {selectedReq.confirmationStatus?.toLowerCase() === 'confirmed' ? '✅' : '🟡'} 
                          {selectedReq.confirmationStatus || 'Unknown Status'}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Request #{selectedReq.requestId}
                      </span>
                    </div>
                  </div>

                  {/* Student Information */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Student Information</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Name:</span> {selectedReq.studentName || selectedReq.fullName || 'Unknown'}</p>
                      <p><span className="font-medium">Class:</span> {selectedReq.studentClass}</p>
                    </div>
                  </div>

                  {/* Parent Information */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Parent Information</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Name:</span> {selectedReq.parentName}</p>
                      <p><span className="font-medium">Email:</span> {selectedReq.parentEmail}</p>
                    </div>
                  </div>

                  {/* Medication Information */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">Medication Information</h3>
                    <div className="space-y-1 text-sm text-blue-800">
                      <p><span className="font-medium">Medication:</span> {selectedReq.medicationName}</p>
                      <p><span className="font-medium">Dosage:</span> {selectedReq.dosage}</p>
                      <p><span className="font-medium">Frequency:</span> {selectedReq.frequency}</p>
                      <p><span className="font-medium">Total Requested:</span> {selectedReq.totalQuantity}</p>
                      
                      {(selectedReq.morningQuantity || selectedReq.noonQuantity || selectedReq.eveningQuantity) && (
                        <div className="mt-2 pt-2 border-t border-blue-300">
                          <p className="font-medium mb-1">Daily Distribution:</p>
                          {selectedReq.morningQuantity && (
                            <p className="ml-2">• Morning: {selectedReq.morningQuantity}</p>
                          )}
                          {selectedReq.noonQuantity && (
                            <p className="ml-2">• Noon: {selectedReq.noonQuantity}</p>
                          )}
                          {selectedReq.eveningQuantity && (
                            <p className="ml-2">• Evening: {selectedReq.eveningQuantity}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stock Status */}
                  {selectedReq.isSufficientStock !== undefined && (
                    <div className={`border rounded-lg p-4 ${
                      selectedReq.isSufficientStock 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center">
                        {selectedReq.isSufficientStock ? (
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
                        )}
                        <span className={`font-medium ${
                          selectedReq.isSufficientStock ? 'text-green-900' : 'text-red-900'
                        }`}>
                          {selectedReq.isSufficientStock ? 'Sufficient Stock Available' : 'Insufficient Stock Warning'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })() : (
              <div className="text-center text-gray-500 py-8">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No Request Selected</h3>
                <p className="text-sm">Please select a medication request to view details.</p>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t bg-white shadow-md rounded-xl p-6">
          <button
            type="button"
            onClick={() => navigate('/nurseDashboard/medication-schedules')}
            className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditMode ? 'Update Schedule' : 'Create Schedule'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicationScheduleForm;
