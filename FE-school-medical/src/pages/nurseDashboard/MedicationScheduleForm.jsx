import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { medicationScheduleAPI } from '../../api/medicationScheduleApi';
import { medicationAPI } from '../../api/medicationApi';
import { inventoryAPI } from '../../api/inventoryApi';
import InventorySearchWidget from '../../components/InventorySearchWidget';
import { Calendar, Clock, User, Pill, Save, ArrowLeft, AlertCircle, CheckCircle, Package } from 'lucide-react';

const MedicationScheduleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const isEditMode = Boolean(id);
  
  const [confirmedRequests, setConfirmedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showInventorySearch, setShowInventorySearch] = useState(false);
  const [inventoryInfo, setInventoryInfo] = useState(null);
  const [inventoryChecking, setInventoryChecking] = useState(false);
  
  const [formData, setFormData] = useState({
    requestId: '',
    scheduledDate: '',
    scheduledTime: '',
    notes: ''
  });

  useEffect(() => {
    fetchConfirmedRequests();
    if (isEditMode) {
      fetchScheduleDetails();
    }
  }, [id, isEditMode]);

  const fetchConfirmedRequests = async () => {
    try {
      const allRequests = await medicationAPI.getAllRequests();
      const confirmed = allRequests.filter(request => request.confirmationStatus === 'confirmed');
      setConfirmedRequests(confirmed);
    } catch (error) {
      console.error('Error fetching confirmed requests:', error);
      setError('Failed to fetch medication requests');
      setConfirmedRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduleDetails = async () => {
    try {
      // Note: You may need to add a get single schedule API endpoint
      // For now, we'll fetch all and find the one we need
      const schedules = await medicationScheduleAPI.getAllSchedulesForNurse();
      const schedule = schedules.find(s => s.scheduleId.toString() === id);        if (schedule) {
          setFormData({
            requestId: schedule.requestId.toString(),
            scheduledDate: schedule.scheduledDate,
            scheduledTime: schedule.scheduledTime,
            notes: schedule.notes || ''
          });
      } else {
        setError('Schedule not found');
      }
    } catch (error) {
      console.error('Error fetching schedule details:', error);
      setError('Failed to fetch schedule details');
    }
  };

  const checkInventoryStock = async (medicationName) => {
    if (!medicationName) {
      setInventoryInfo(null);
      return;
    }

    setInventoryChecking(true);
    try {
      console.log('Checking inventory for medication:', medicationName);
      
      const inventoryItems = await inventoryAPI.getAllInventory();
      console.log('Total inventory items:', inventoryItems.length);
      console.log('Available medications:', inventoryItems.map(item => item.item?.itemName));
      
      // Try exact match first, then partial match
      let medicationItem = inventoryItems.find(item => 
        item.item?.itemName?.toLowerCase() === medicationName.toLowerCase()
      );
      
      // If no exact match, try partial match
      if (!medicationItem) {
        medicationItem = inventoryItems.find(item => 
          item.item?.itemName?.toLowerCase().includes(medicationName.toLowerCase()) ||
          medicationName.toLowerCase().includes(item.item?.itemName?.toLowerCase())
        );
      }

      if (medicationItem) {
        console.log('Found matching medication:', medicationItem);
        setInventoryInfo({
          found: true,
          itemName: medicationItem.item.itemName,
          currentQuantity: medicationItem.totalQuantity || 0,
          unit: medicationItem.item.unit || 'units',
          inventoryId: medicationItem.inventoryId
        });
      } else {
        console.log('No matching medication found for:', medicationName);
        setInventoryInfo({
          found: false,
          searchedName: medicationName
        });
      }
    } catch (error) {
      console.error('Error checking inventory:', error);
      setInventoryInfo(null);
    } finally {
      setInventoryChecking(false);
    }
  };

  const updateInventoryQuantity = async (medicationName, quantityToDeduct) => {
    try {
      console.log('Starting inventory update for:', medicationName, 'quantity to deduct:', quantityToDeduct);
      
      // Search for the medication in inventory
      const inventoryItems = await inventoryAPI.getAllInventory();
      console.log('Total inventory items found:', inventoryItems.length);
      
      const medicationItem = inventoryItems.find(item => 
        item.item?.itemName?.toLowerCase().includes(medicationName.toLowerCase())
      );

      if (!medicationItem) {
        console.warn(`Medication "${medicationName}" not found in inventory`);
        console.log('Available medications:', inventoryItems.map(item => item.item?.itemName));
        return false;
      }

      console.log('Found medication item:', medicationItem);
      
      const currentQuantity = medicationItem.totalQuantity || 0;
      const newQuantity = Math.max(0, currentQuantity - quantityToDeduct);

      console.log(`Updating quantity: ${currentQuantity} - ${quantityToDeduct} = ${newQuantity}`);

      // Update the inventory with reduced quantity
      const updateData = {
        itemName: medicationItem.item.itemName,
        category: medicationItem.item.category,
        description: medicationItem.item.description || '',
        manufacturer: medicationItem.item.manufacturer || '',
        expiryDate: medicationItem.item.expiryDate || null,
        storageInstructions: medicationItem.item.storageInstructions || '',
        unit: medicationItem.item.unit || 'units',
        totalQuantity: newQuantity
      };

      console.log('Sending update request with data:', updateData);
      
      await inventoryAPI.updateInventoryItem(medicationItem.inventoryId, updateData);
      
      console.log(`✅ Inventory updated successfully: ${medicationName} quantity reduced from ${currentQuantity} to ${newQuantity}`);
      return true;
    } catch (error) {
      console.error('❌ Error updating inventory quantity:', error);
      console.error('Error details:', error.response?.data || error.message);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Check inventory stock before proceeding (for new schedules only)
      if (!isEditMode && inventoryInfo) {
        if (!inventoryInfo.found) {
          const confirmProceed = window.confirm(
            `The medication "${inventoryInfo.searchedName}" was not found in inventory. Do you want to proceed with scheduling anyway?`
          );
          if (!confirmProceed) {
            setSubmitting(false);
            return;
          }
        } else if (inventoryInfo.currentQuantity === 0) {
          const confirmProceed = window.confirm(
            `"${inventoryInfo.itemName}" is currently out of stock (0 ${inventoryInfo.unit}). Do you want to proceed with scheduling anyway?`
          );
          if (!confirmProceed) {
            setSubmitting(false);
            return;
          }
        } else if (inventoryInfo.currentQuantity <= 5) {
          const confirmProceed = window.confirm(
            `"${inventoryInfo.itemName}" has low stock (${inventoryInfo.currentQuantity} ${inventoryInfo.unit}). Do you want to proceed with scheduling?`
          );
          if (!confirmProceed) {
            setSubmitting(false);
            return;
          }
        }
      }

      if (isEditMode) {
        await medicationScheduleAPI.updateSchedule(id, formData);
        setSuccess('Medication schedule updated successfully');
      } else {
        // Find the selected medication request to get medication details
        const selectedRequest = confirmedRequests.find(req => 
          req.requestId.toString() === formData.requestId
        );

        if (selectedRequest) {
          // Create the schedule first
          await medicationScheduleAPI.createSchedule(formData);
          
          // Then update inventory quantity (only if medication was found in inventory)
          if (inventoryInfo && inventoryInfo.found && inventoryInfo.currentQuantity > 0) {
            const medicationName = selectedRequest.medicationName;
            
            // Use the totalQuantity from the medication request
            const quantityToDeduct = parseInt(selectedRequest.totalQuantity) || 1;
            
            console.log('Attempting to deduct inventory:', {
              medicationName,
              originalDosage: selectedRequest.dosage,
              totalQuantityFromRequest: selectedRequest.totalQuantity,
              quantityToDeduct,
              currentStock: inventoryInfo.currentQuantity
            });
            
            const inventoryUpdated = await updateInventoryQuantity(medicationName, quantityToDeduct);
            
            if (inventoryUpdated) {
              setSuccess(`Medication schedule created successfully. Inventory updated: ${quantityToDeduct} ${inventoryInfo.unit} of ${medicationName} deducted from stock.`);
            } else {
              setSuccess('Medication schedule created successfully. Note: Inventory quantity could not be updated automatically.');
            }
          } else {
            if (inventoryInfo && inventoryInfo.found && inventoryInfo.currentQuantity === 0) {
              setSuccess('Medication schedule created successfully. Note: Inventory was at 0 stock, no deduction made.');
            } else {
              setSuccess('Medication schedule created successfully. Note: Inventory was not updated (medication not found in stock).');
            }
          }
        } else {
          await medicationScheduleAPI.createSchedule(formData);
          setSuccess('Medication schedule created successfully');
        }
      }
      
      // Navigate back after a short delay to show success message
      setTimeout(() => {
        navigate('/nurseDashboard/medication-schedules');
      }, 2500);
    } catch (error) {
      console.error('Error saving schedule:', error);
      setError(`Failed to ${isEditMode ? 'update' : 'create'} medication schedule`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Check inventory when medication request is selected
    if (field === 'requestId' && value) {
      const selectedRequest = confirmedRequests.find(req => 
        req.requestId.toString() === value
      );
      if (selectedRequest) {
        checkInventoryStock(selectedRequest.medicationName);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full mx-auto">
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
              {isEditMode ? 'Update the medication schedule details' : 'Schedule medication administration for a student'}
            </p>
          </div>
          <button
            onClick={() => setShowInventorySearch(!showInventorySearch)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              showInventorySearch 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{showInventorySearch ? 'Hide' : 'Show'} Inventory</span>
          </button>
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

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className={`${showInventorySearch ? 'xl:col-span-2' : 'xl:col-span-3'} transition-all duration-300`}>
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
            {/* Medication Request Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Pill className="w-4 h-4 mr-2" />
                  Medication Request <span className="text-red-500">*</span>
                </div>
              </label>
              <select
                value={formData.requestId}
                onChange={(e) => handleInputChange('requestId', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isEditMode} // Disable in edit mode
              >
                <option value="">Select a confirmed medication request</option>
                {confirmedRequests.map((request) => (                <option key={request.requestId} value={request.requestId}>
                  {request.studentName} - {request.medicationName} ({request.dosage}) - Qty: {request.totalQuantity}
                </option>
                ))}
              </select>
              {isEditMode && (
                <p className="mt-1 text-xs text-gray-500">
                  Medication request cannot be changed in edit mode
                </p>
              )}
              
              {/* Inventory Status Display */}
              {formData.requestId && (
                <div className="mt-3">
                  {inventoryChecking ? (
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Checking inventory...
                    </div>
                  ) : inventoryInfo ? (
                    inventoryInfo.found ? (
                      <div className={`p-3 rounded-lg border ${
                        inventoryInfo.currentQuantity > 0 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Package className={`w-4 h-4 mr-2 ${
                              inventoryInfo.currentQuantity > 0 ? 'text-green-600' : 'text-red-600'
                            }`} />
                            <span className={`text-sm font-medium ${
                              inventoryInfo.currentQuantity > 0 ? 'text-green-800' : 'text-red-800'
                            }`}>
                              Inventory Stock: {inventoryInfo.itemName}
                            </span>
                          </div>
                          <div className={`text-sm font-semibold ${
                            inventoryInfo.currentQuantity > 0 ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {inventoryInfo.currentQuantity} {inventoryInfo.unit}
                          </div>
                        </div>
                        {inventoryInfo.currentQuantity === 0 && (
                          <p className="text-xs text-red-600 mt-1">
                            ⚠️ No stock available. Schedule may need to be postponed.
                          </p>
                        )}
                        {inventoryInfo.currentQuantity > 0 && inventoryInfo.currentQuantity <= 5 && (
                          <p className="text-xs text-yellow-600 mt-1">
                            ⚠️ Low stock warning. Consider restocking soon.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg border bg-yellow-50 border-yellow-200">
                        <div className="flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800">
                            Medication not found in inventory
                          </span>
                        </div>
                        <p className="text-xs text-yellow-600 mt-1">
                          "{inventoryInfo.searchedName}" was not found in the inventory system.
                        </p>
                      </div>
                    )
                  ) : null}
                </div>
              )}
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
                value={formData.scheduledDate}
                onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min={new Date().toISOString().split('T')[0]} // Prevent past dates
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
                value={formData.scheduledTime}
                onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
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
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Additional notes for medication administration (optional)..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
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
      </div>
        </div>

        {/* Inventory Search Column */}
        {showInventorySearch && (
          <div className="xl:col-span-1">
            <div className="sticky top-6">
              <InventorySearchWidget 
                isOpen={showInventorySearch} 
                onClose={() => setShowInventorySearch(false)} 
              />
            </div>
          </div>
        )}
      </div>

      {/* Selected Request Details */}
      {formData.requestId && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Selected Medication Request</h3>
          {(() => {
            const selectedRequest = confirmedRequests.find(r => r.requestId.toString() === formData.requestId);
            if (!selectedRequest) return null;
            
            return (
              <div className="text-sm text-blue-800 space-y-1">
                <p><span className="font-medium">Student:</span> {selectedRequest.studentName}</p>
                <p><span className="font-medium">Medication:</span> {selectedRequest.medicationName}</p>
                <p><span className="font-medium">Dosage:</span> {selectedRequest.dosage}</p>
                <p><span className="font-medium">Total Quantity:</span> {selectedRequest.totalQuantity}</p>
                <p><span className="font-medium">Frequency:</span> {selectedRequest.frequency}</p>
                {selectedRequest.parentName && (
                  <p><span className="font-medium">Parent:</span> {selectedRequest.parentName}</p>
                )}
              </div>
            );
          })()}
        </div>
      )}
      
      {/* Floating Inventory Button for Mobile */}
      <div className="xl:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowInventorySearch(!showInventorySearch)}
          className={`p-4 rounded-full shadow-lg transition-all ${
            showInventorySearch 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
          title={showInventorySearch ? 'Hide Inventory' : 'Show Inventory'}
        >
          <Package className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Inventory Overlay */}
      {showInventorySearch && (
        <div className="xl:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="absolute inset-x-4 top-4 bottom-4 bg-white rounded-lg">
            <InventorySearchWidget 
              isOpen={showInventorySearch} 
              onClose={() => setShowInventorySearch(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationScheduleForm;
