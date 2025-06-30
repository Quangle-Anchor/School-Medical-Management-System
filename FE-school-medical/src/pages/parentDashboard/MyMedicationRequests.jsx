import React, { useState, useEffect } from 'react';
import { medicationAPI } from '../../api/medicationApi';
import { Plus, Eye, Edit, Trash2, Clock, CheckCircle, XCircle, Pill, Calendar, User } from 'lucide-react';
import MedicationRequestForm from '../../components/MedicationRequestForm';

const MyMedicationRequests = ({ onRequestAdded }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  useEffect(() => {
    // Check if user is authenticated before fetching data
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
      setError('Authentication required. Please login again.');
      setLoading(false);
      return;
    }
    
    if (role !== 'Parent') {
      setError('Access denied. Only parents can view medication requests.');
      setLoading(false);
      return;
    }
    
    fetchMyRequests();
  }, []);
  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user has token before making API call
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }
      
      const response = await medicationAPI.getMyMedicationRequests();
      setRequests(response);
    } catch (err) {
      if (err.message.includes('401') || err.message.includes('Authentication')) {
        setError('Session expired. Please login again.');
      } else if (err.message.includes('403')) {
        setError('Access denied. You do not have permission to view medication requests.');
      } else {
        setError('Failed to load medication requests. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = () => {
    setEditingRequest(null);
    setShowForm(true);
  };

  const handleEditRequest = (request) => {
    setEditingRequest(request);
    setShowForm(true);
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this medication request?')) {
      return;
    }

    try {
      await medicationAPI.deleteMedicationRequest(requestId);
      await fetchMyRequests(); // Refresh the list
      
      // Call parent callback to update the dashboard count
      if (onRequestAdded) {
        onRequestAdded();
      }
    } catch (error) {
      setError('Failed to delete medication request. Please try again.');
    }
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleRequestSubmitted = () => {
    setShowForm(false);
    setEditingRequest(null);
    fetchMyRequests(); // Refresh the list
    
    // Call parent callback to update the dashboard count
    if (onRequestAdded) {
      onRequestAdded();
    }
  };

  const getStatusBadge = (isConfirmed, confirmedAt) => {
    if (isConfirmed) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Confirmed
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading medication requests...</span>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <XCircle className="h-5 w-5 text-red-600 mr-3" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Error Loading Requests</p>
            <p className="text-red-600 text-sm">{error}</p>
            <div className="mt-3 flex space-x-2">
              <button 
                onClick={fetchMyRequests}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Try Again
              </button>
              {(error.includes('Authentication') || error.includes('Session expired')) && (
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Login Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Medication Requests</h1>
          <p className="text-gray-600">Manage medication requests for your children</p>
        </div>
        <button
          onClick={handleCreateRequest}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </button>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-12 text-center">
            <Pill className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">No medication requests</p>
            <p className="text-gray-600 mb-4">You haven't submitted any medication requests yet.</p>
            <button
              onClick={handleCreateRequest}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Request
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student & Medication
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dosage & Quantities
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request.requestId || request.request_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.student?.fullName || request.student?.full_name || 'Unknown Student'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.medicationName || request.medication_name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{request.dosage}</div>
                      <div className="text-xs text-gray-500 space-y-1">
                        {request.totalQuantity || request.total_quantity ? (
                          <div>Total: {request.totalQuantity || request.total_quantity}</div>
                        ) : null}
                        <div className="flex gap-2">
                          {(request.morningQuantity || request.morning_quantity) ? (
                            <span>M: {request.morningQuantity || request.morning_quantity}</span>
                          ) : null}
                          {(request.noonQuantity || request.noon_quantity) ? (
                            <span>A: {request.noonQuantity || request.noon_quantity}</span>
                          ) : null}
                          {(request.eveningQuantity || request.evening_quantity) ? (
                            <span>E: {request.eveningQuantity || request.evening_quantity}</span>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.frequency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.isConfirmed || request.is_confirmed, request.confirmedAt || request.confirmed_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.createdAt || request.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewRequest(request)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        {!(request.isConfirmed || request.is_confirmed) && (
                          <>
                            <button
                              onClick={() => handleEditRequest(request)}
                              className="text-green-600 hover:text-green-900 inline-flex items-center"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteRequest(request.requestId || request.request_id)}
                              className="text-red-600 hover:text-red-900 inline-flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Medication Request Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Student Information */}
              <div>
                <h3 className="font-semibold text-lg border-b pb-2 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Student Information
                </h3>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Student Name:</span>
                    <span className="text-gray-900">{selectedRequest.student?.fullName || selectedRequest.student?.full_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Student ID:</span>
                    <span className="text-gray-900">{selectedRequest.student?.studentId || selectedRequest.student?.student_id || selectedRequest.studentId || selectedRequest.student_id || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Medication Information */}
              <div>
                <h3 className="font-semibold text-lg border-b pb-2 flex items-center">
                  <Pill className="w-5 h-5 mr-2" />
                  Medication Information
                </h3>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Medication Name:</span>
                    <span className="text-gray-900">{selectedRequest.medicationName || selectedRequest.medication_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Dosage:</span>
                    <span className="text-gray-900">{selectedRequest.dosage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Frequency:</span>
                    <span className="text-gray-900">{selectedRequest.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Total Quantity:</span>
                    <span className="text-gray-900">{selectedRequest.totalQuantity || selectedRequest.total_quantity || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div className="text-center">
                      <span className="block text-sm font-medium text-gray-600">Morning</span>
                      <span className="text-lg font-semibold text-blue-600">{selectedRequest.morningQuantity || selectedRequest.morning_quantity || 'N/A'}</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-sm font-medium text-gray-600">Afternoon</span>
                      <span className="text-lg font-semibold text-orange-600">{selectedRequest.noonQuantity || selectedRequest.noon_quantity || 'N/A'}</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-sm font-medium text-gray-600">Evening</span>
                      <span className="text-lg font-semibold text-purple-600">{selectedRequest.eveningQuantity || selectedRequest.evening_quantity || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Request Status */}
              <div>
                <h3 className="font-semibold text-lg border-b pb-2 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Request Status
                </h3>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Status:</span>
                    <span>{getStatusBadge(selectedRequest.isConfirmed || selectedRequest.is_confirmed, selectedRequest.confirmedAt || selectedRequest.confirmed_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Created:</span>
                    <span className="text-gray-900">{formatDate(selectedRequest.createdAt || selectedRequest.created_at)}</span>
                  </div>
                  {(selectedRequest.confirmedAt || selectedRequest.confirmed_at) && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Confirmed:</span>
                      <span className="text-gray-900">{formatDate(selectedRequest.confirmedAt || selectedRequest.confirmed_at)}</span>
                    </div>
                  )}
                  {(selectedRequest.requestedBy || selectedRequest.requested_by) && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Requested By ID:</span>
                      <span className="text-gray-900">{selectedRequest.requestedBy || selectedRequest.requested_by}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {!(selectedRequest.isConfirmed || selectedRequest.is_confirmed) && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEditRequest(selectedRequest);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Medication Request Form */}
      <MedicationRequestForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingRequest(null);
        }}
        onRequestSubmitted={handleRequestSubmitted}
        editingRequest={editingRequest}
        isEditing={!!editingRequest}
      />
    </div>
  );
};

export default MyMedicationRequests;
