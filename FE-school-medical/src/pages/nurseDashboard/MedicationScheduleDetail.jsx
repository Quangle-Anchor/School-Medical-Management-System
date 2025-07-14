import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { medicationScheduleAPI } from '../../api/medicationScheduleApi';
import { medicationAPI } from '../../api/medicationApi';
import { inventoryAPI } from '../../api/inventoryApi';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Pill, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Package,
  Edit,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

const MedicationScheduleDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [schedule, setSchedule] = useState(null);
  const [medicationRequest, setMedicationRequest] = useState(null);
  const [inventoryInfo, setInventoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchScheduleDetails();
  }, [id]);

  const fetchScheduleDetails = async () => {
    try {
      // Fetch all schedules and find the one we need
      const schedules = await medicationScheduleAPI.getAllSchedulesForNurse();
      const foundSchedule = schedules.find(s => s.scheduleId.toString() === id);
      
      if (!foundSchedule) {
        setError('Schedule not found');
        return;
      }
      
      setSchedule(foundSchedule);
      
      // Fetch the related medication request
      try {
        const allRequests = await medicationAPI.getAllRequests();
        const relatedRequest = allRequests.find(req => 
          req.requestId.toString() === foundSchedule.requestId.toString()
        );
        
        if (relatedRequest) {
          setMedicationRequest(relatedRequest);
          
          // Check inventory for this medication
          await checkInventoryStock(relatedRequest.medicationName);
        }
      } catch (requestError) {
        console.error('Error fetching medication request:', requestError);
        // Continue without request details
      }
    } catch (error) {
      console.error('Error fetching schedule details:', error);
      setError('Failed to fetch schedule details');
    } finally {
      setLoading(false);
    }
  };

  const checkInventoryStock = async (medicationName) => {
    try {
      const inventoryItems = await inventoryAPI.getAllInventory();
      
      const medicationItem = inventoryItems.find(item => 
        item.item?.itemName?.toLowerCase().includes(medicationName.toLowerCase())
      );

      if (medicationItem) {
        setInventoryInfo({
          found: true,
          itemName: medicationItem.item.itemName,
          currentQuantity: medicationItem.totalQuantity || 0,
          unit: medicationItem.item.unit || 'units',
          category: medicationItem.item.category,
          manufacturer: medicationItem.item.manufacturer,
          expiryDate: medicationItem.item.expiryDate,
          storageInstructions: medicationItem.item.storageInstructions
        });
      } else {
        setInventoryInfo({
          found: false,
          searchedName: medicationName
        });
      }
    } catch (error) {
      console.error('Error checking inventory:', error);
      setInventoryInfo(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'yellow', text: 'Pending' },
      'completed': { color: 'green', text: 'Completed' },
      'missed': { color: 'red', text: 'Missed' },
      'cancelled': { color: 'gray', text: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig['pending'];
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading schedule details...</span>
        </div>
      </div>
    );
  }

  if (error || !schedule) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
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
            {error || 'Schedule Not Found'}
          </h2>
          <p className="text-red-700">
            The medication schedule you're looking for could not be found or loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/nurseDashboard/medication-schedules')}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Medication Schedule Details
              </h1>
              <p className="text-gray-600 mt-1">
                Complete information about this medication schedule
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/nurseDashboard/medication-schedules/edit/${schedule.scheduleId}`)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Schedule</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Schedule Info */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Schedule Information</h2>
              <p className="text-gray-600 text-sm">Basic scheduling details</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Student</p>
                      <p className="text-lg font-semibold text-gray-900">{schedule.studentName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Scheduled Date</p>
                      <p className="text-lg font-semibold text-gray-900">{formatDate(schedule.scheduledDate)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Scheduled Time</p>
                      <p className="text-lg font-semibold text-gray-900">{formatTime(schedule.scheduledTime)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Administered By</p>
                      <p className="text-lg font-semibold text-gray-900">{schedule.administeredBy}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {schedule.notes && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Notes</p>
                      <p className="text-gray-900 leading-relaxed">{schedule.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Medication Request Details */}
          {medicationRequest && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Medication Request Details</h2>
                <p className="text-gray-600 text-sm">Information about the requested medication</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Pill className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Medication Name</p>
                        <p className="text-lg font-semibold text-gray-900">{medicationRequest.medicationName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <FileText className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Dosage</p>
                        <p className="text-lg font-semibold text-gray-900">{medicationRequest.dosage}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Quantity</p>
                        <p className="text-lg font-semibold text-gray-900">{medicationRequest.totalQuantity}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Clock className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Frequency</p>
                        <p className="text-lg font-semibold text-gray-900">{medicationRequest.frequency}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <p className="text-lg font-semibold text-green-600">{medicationRequest.confirmationStatus}</p>
                      </div>
                    </div>
                    
                    {medicationRequest.parentName && (
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Requested By</p>
                          <p className="text-lg font-semibold text-gray-900">{medicationRequest.parentName}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {medicationRequest.reason && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <FileText className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">Reason for Medication</p>
                        <p className="text-gray-900 leading-relaxed">{medicationRequest.reason}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Status</h3>
              <div className="text-center">
                {getStatusBadge(schedule.status || 'pending')}
                <p className="text-sm text-gray-600 mt-2">
                  Created on {formatDate(schedule.createdAt || schedule.scheduledDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Inventory Information */}
          {inventoryInfo && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Status</h3>
                
                {inventoryInfo.found ? (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${
                      inventoryInfo.currentQuantity > 0 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{inventoryInfo.itemName}</span>
                        <span className={`font-bold ${
                          inventoryInfo.currentQuantity > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {inventoryInfo.currentQuantity} {inventoryInfo.unit}
                        </span>
                      </div>
                      {inventoryInfo.currentQuantity === 0 && (
                        <p className="text-xs text-red-600">
                          ⚠️ Out of stock
                        </p>
                      )}
                      {inventoryInfo.currentQuantity > 0 && inventoryInfo.currentQuantity <= 5 && (
                        <p className="text-xs text-yellow-600">
                          ⚠️ Low stock warning
                        </p>
                      )}
                    </div>
                    
                    {inventoryInfo.category && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Category</p>
                        <p className="text-gray-900">{inventoryInfo.category}</p>
                      </div>
                    )}
                    
                    {inventoryInfo.manufacturer && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Manufacturer</p>
                        <p className="text-gray-900">{inventoryInfo.manufacturer}</p>
                      </div>
                    )}
                    
                    {inventoryInfo.expiryDate && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Expiry Date</p>
                        <p className="text-gray-900">{formatDate(inventoryInfo.expiryDate)}</p>
                      </div>
                    )}
                    
                    {inventoryInfo.storageInstructions && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Storage Instructions</p>
                        <p className="text-gray-900 text-sm">{inventoryInfo.storageInstructions}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                      <span className="font-medium text-yellow-800">Not Found in Inventory</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      "{inventoryInfo.searchedName}" was not found in the inventory system.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/nurseDashboard/medication-schedules/edit/${schedule.scheduleId}`)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Schedule</span>
                </button>
                
                <button
                  onClick={() => navigate('/nurseDashboard/medication-schedules')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to List</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationScheduleDetail;
