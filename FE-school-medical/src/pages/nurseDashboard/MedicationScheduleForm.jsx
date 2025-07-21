import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { medicationScheduleAPI } from '../../api/medicationScheduleApi';
import { medicationAPI } from '../../api/medicationApi';
import { inventoryAPI } from '../../api/inventoryApi';
import { Calendar, Clock, User, Save, ArrowLeft, AlertCircle, CheckCircle, Package, Users } from 'lucide-react';

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
  
  const [confirmedRequests, setConfirmedRequests] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Schedule Form State
  const [scheduleForm, setScheduleForm] = useState({
    requestId: '', // Now tracks selected request
    scheduledDate: '',
    scheduledTime: '',
    notes: ''
  });

  // Inventory Export Form State
  const [inventoryForm, setInventoryForm] = useState({
    inventoryId: '',
    quantityToDeduct: ''
  });

  // Selected inventory item details
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);

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
      const [requestsData, inventoryData] = await Promise.all([
        medicationAPI.getAllRequests(),
        inventoryAPI.getAllInventory()
      ]);
      // Only confirmed requests
      setConfirmedRequests(Array.isArray(requestsData)
        ? requestsData.filter(r => r.confirmationStatus?.toLowerCase() === 'confirmed')
        : []);
      setInventoryItems(Array.isArray(inventoryData) ? inventoryData : []);
    } catch (error) {
      setError('Failed to load medication requests and inventory data');
      setConfirmedRequests([]);
      setInventoryItems([]);
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
          
        setScheduleForm({
          requestId: schedule.requestId?.toString() || '',
          scheduledDate: formattedDate,
          scheduledTime: schedule.scheduledTime || '',
          notes: schedule.notes || ''
        });
      } else {
        setError('Schedule not found');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setError(`Schedule with ID ${scheduleId} not found`);
      } else {
        setError('Failed to fetch schedule details for editing');
      }
    }
  };

  const handleScheduleFormChange = (field, value) => {
    setScheduleForm(prev => ({
      ...prev,
      [field]: value
    }));

    // When a request is selected, update form with request details
    if (field === 'requestId' && value) {
      const selectedReq = confirmedRequests.find(
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

  const handleInventoryFormChange = (field, value) => {
    setInventoryForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Update selected inventory item details when inventory is selected
    if (field === 'inventoryId' && value) {
      const selectedItem = inventoryItems.find(item => 
        item.inventoryId.toString() === value
      );
      setSelectedInventoryItem(selectedItem || null);
      // Reset quantity when changing inventory item
      setInventoryForm(prev => ({
        ...prev,
        quantityToDeduct: ''
      }));
    }
  };

  const handleInventorySelect = (e) => {
    const value = e.target.value;
    handleInventoryFormChange('inventoryId', value);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    handleInventoryFormChange('quantityToDeduct', value);
  };

  const validateForms = () => {
    // Schedule form validation
    if (!scheduleForm.requestId) {
      setError('Please select a medication request');
      return false;
    }
    if (!scheduleForm.scheduledDate) {
      setError('Please select a scheduled date');
      return false;
    }
    if (!scheduleForm.scheduledTime) {
      setError('Please select a scheduled time');
      return false;
    }

    // Inventory form validation (required for new schedules)
    if (!isEditMode) {
      if (!inventoryForm.inventoryId) {
        setError('Please select an inventory item to deduct from');
        return false;
      }
      if (!inventoryForm.quantityToDeduct || inventoryForm.quantityToDeduct <= 0) {
        setError('Please enter a valid quantity to deduct');
        return false;
      }
      if (selectedInventoryItem && parseInt(inventoryForm.quantityToDeduct) > selectedInventoryItem.totalQuantity) {
        setError(`Quantity to deduct cannot exceed available stock (${selectedInventoryItem.totalQuantity})`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForms()) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const schedulePayload = {
        requestId: parseInt(scheduleForm.requestId),
        scheduledDate: scheduleForm.scheduledDate,
        scheduledTime: scheduleForm.scheduledTime,
        notes: scheduleForm.notes || ""
      };

      try {
        if (isEditMode) {
          await medicationScheduleAPI.updateSchedule(scheduleId, schedulePayload);
          setSuccess('Medication schedule updated successfully');
        } else {
          // For new schedule, first try to deduct from inventory
          const inventoryPayload = {
            inventoryId: parseInt(inventoryForm.inventoryId),
            quantityToDeduct: parseInt(inventoryForm.quantityToDeduct)
          };

          // First try to deduct from inventory
          await medicationScheduleAPI.deductInventory(inventoryPayload);

          // If inventory deduction succeeds, create the schedule
          await medicationScheduleAPI.createSchedule(schedulePayload);
          setSuccess('Medication schedule created and inventory updated successfully');
        }
      } catch (deductError) {
        // If inventory deduction fails, throw a more specific error
        if (deductError.response?.status === 400) {
          throw new Error('Not enough quantity in inventory. Please check available stock.');
        } else {
          throw deductError;
        }
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

      setError(errorMessage);
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
              {isEditMode ? 'Update the medication schedule details' : 'Schedule medication administration and manage inventory'}
            </p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

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
                    Confirmed Request <span className="text-red-500">*</span>
                  </div>
                </label>
                <select
                  value={scheduleForm.requestId}
                  onChange={(e) => handleScheduleFormChange('requestId', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a confirmed request</option>
                  {confirmedRequests.map((req) => (
                    <option key={req.requestId} value={req.requestId}>
                      {req.studentName || req.fullName || 'Unknown'} - {req.studentCode} (Request #{req.requestId})
                    </option>
                  ))}
                </select>
                {/* Show selected request details */}
                {scheduleForm.requestId && (() => {
                  const selectedReq = confirmedRequests.find(
                    r => r.requestId?.toString() === scheduleForm.requestId.toString()
                  );
                  if (!selectedReq) return (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="font-medium text-red-900 mb-2">No confirmed request found for this request ID.</h3>
                    </div>
                  );
                  return (
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 mb-2">Request Details</h3>
                      <div className="space-y-1 text-sm text-blue-800">
                        <p><span className="font-medium">Student Name:</span> {selectedReq.studentName || selectedReq.fullName || 'Unknown'}</p>
                        <p><span className="font-medium">Student Code:</span> {selectedReq.studentCode}</p>
                        <p><span className="font-medium">Class:</span> {selectedReq.studentClass}</p>
                        <p><span className="font-medium">Medication Name:</span> {selectedReq.medicationName}</p>
                        <p><span className="font-medium">Total Quantity:</span> {selectedReq.totalQuantity}</p>
                        <p><span className="font-medium">Parent Name:</span> {selectedReq.parentName}</p>
                        
                      </div>
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
                  onChange={(e) => handleScheduleFormChange('scheduledDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Scheduled Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Scheduled Time <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="time"
                  value={scheduleForm.scheduledTime}
                  onChange={(e) => handleScheduleFormChange('scheduledTime', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
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
            </div>
          </div>

          {/* Export Inventory Form - Right Side */}
          {!isEditMode && (
            <div className="bg-white shadow-md rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Package className="w-5 h-5 mr-2 text-green-600" />
                Inventory Export
              </h2>
              
              <div className="space-y-6">
                {/* Inventory Item Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      Inventory Item <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <select
                    value={inventoryForm.inventoryId}
                    onChange={handleInventorySelect}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="">Select an inventory item</option>
                    {inventoryItems.map((item) => (
                      <option key={item.inventoryId} value={item.inventoryId}>
                        {item.item?.itemName} (Available: {item.totalQuantity} {item.item?.unit})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Available Quantity Display */}
                {selectedInventoryItem && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Selected Item Details</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Item:</span> {selectedInventoryItem.item?.itemName}</p>
                      <p><span className="font-medium">Available Quantity:</span> {selectedInventoryItem.totalQuantity} {selectedInventoryItem.item?.unit}</p>
                      <p><span className="font-medium">Category:</span> {selectedInventoryItem.item?.category}</p>
                      {selectedInventoryItem.item?.description && (
                        <p><span className="font-medium">Description:</span> {selectedInventoryItem.item.description}</p>
                      )}
                    </div>
                    
                    {/* Stock Status Indicator */}
                    <div className="mt-3">
                      {selectedInventoryItem.totalQuantity === 0 ? (
                        <div className="flex items-center text-red-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">Out of Stock</span>
                        </div>
                      ) : selectedInventoryItem.totalQuantity <= 5 ? (
                        <div className="flex items-center text-yellow-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">Low Stock Warning</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">In Stock</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quantity to Deduct */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity to Deduct <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={inventoryForm.quantityToDeduct}
                    onChange={handleQuantityChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter quantity to deduct"
                    min="1"
                    max={selectedInventoryItem?.totalQuantity || ''}
                    required
                  />
                  {selectedInventoryItem && (
                    <p className="mt-1 text-xs text-gray-500">
                      Maximum available: {selectedInventoryItem.totalQuantity} {selectedInventoryItem.item?.unit}
                    </p>
                  )}
                </div>

                {/* Export Summary */}
                {inventoryForm.quantityToDeduct && selectedInventoryItem && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-900 mb-2">Export Summary</h3>
                    <div className="space-y-1 text-sm text-green-800">
                      <p>Item: {selectedInventoryItem.item?.itemName}</p>
                      <p>Quantity to deduct: {inventoryForm.quantityToDeduct} {selectedInventoryItem.item?.unit}</p>
                      <p>Remaining after export: {selectedInventoryItem.totalQuantity - parseInt(inventoryForm.quantityToDeduct || 0)} {selectedInventoryItem.item?.unit}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Edit Mode: Show placeholder for inventory section */}
          {isEditMode && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Inventory Export</h3>
                <p className="text-sm">Inventory adjustments are not available when editing existing schedules.</p>
              </div>
            </div>
          )}
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
                {isEditMode ? 'Update Schedule' : 'Create Schedule & Export Inventory'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicationScheduleForm;
