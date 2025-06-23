import React, { useState, useEffect } from 'react';
import { medicationAPI } from '../../api/medicationApi';
import { CheckCircle, Clock, Eye, User, Pill, Calendar, AlertCircle, FileText, Download, X } from 'lucide-react';

const NurseMedicationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [confirming, setConfirming] = useState(null);
  useEffect(() => {
    // Check if user is authenticated before fetching data
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
      setError('Authentication required. Please login again.');
      setLoading(false);
      return;
    }
    
    if (role !== 'Nurse') {
      setError('Access denied. Only nurses can view medication requests.');
      setLoading(false);
      return;
    }
    
    fetchPendingRequests();
  }, []);
  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user has token before making API call
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }
      
      const response = await medicationAPI.getPendingRequests();
      setRequests(response);
    } catch (err) {
      if (err.message.includes('401') || err.message.includes('403')) {
        setError('Access denied. Only nurses can view medication requests.');
      } else {
        setError('Failed to load medication requests. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to confirm this medication request?')) {
      return;
    }

    try {
      setConfirming(requestId);
      await medicationAPI.confirmMedicationRequest(requestId);
      await fetchPendingRequests(); // Refresh the list
    } catch (error) {
      setError('Failed to confirm medication request. Please try again.');
    } finally {
      setConfirming(null);
    }
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
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

  const getPriorityLevel = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const hoursDiff = (now - created) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      return { level: 'high', text: 'High Priority', color: 'bg-red-100 text-red-800' };
    } else if (hoursDiff > 12) {
      return { level: 'medium', text: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { level: 'low', text: 'Normal', color: 'bg-green-100 text-green-800' };
    }
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
          <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Error Loading Requests</p>
            <p className="text-red-600 text-sm">{error}</p>
            <div className="mt-3 flex space-x-2">
              <button 
                onClick={fetchPendingRequests}
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Medication Requests</h1>
          <p className="text-gray-600">Review and confirm medication requests from parents</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {requests.filter(r => !r.isConfirmed).length} pending requests
          </span>
          <button
            onClick={fetchPendingRequests}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => !r.isConfirmed).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Confirmed Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => r.isConfirmed && r.confirmedAt && 
                  new Date(r.confirmedAt).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => !r.isConfirmed && getPriorityLevel(r.createdAt).level === 'high').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-12 text-center">
            <Pill className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">No medication requests</p>
            <p className="text-gray-600">All medication requests have been processed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student & Parent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medication Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => {
                  const priority = getPriorityLevel(request.createdAt);
                  return (
                    <tr key={request.requestId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.student?.fullName || 'Unknown Student'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {request.student?.studentId || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            Parent: {request.requestedBy?.fullName || 'Unknown'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.medicationName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.dosage} - {request.frequency}
                          </div>
                          {request.prescriptionFile && (
                            <div className="text-sm text-blue-600 flex items-center mt-1">
                              <FileText className="w-3 h-3 mr-1" />
                              Prescription attached
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${priority.color}`}>
                          {priority.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(request.isConfirmed, request.confirmedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(request.createdAt)}
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
                          {!request.isConfirmed && (
                            <button
                              onClick={() => handleConfirmRequest(request.requestId)}
                              disabled={confirming === request.requestId}
                              className="text-green-600 hover:text-green-900 inline-flex items-center disabled:opacity-50"
                            >
                              {confirming === request.requestId ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-1"></div>
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              )}
                              Confirm
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Medication Request Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student & Parent Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Student & Parent Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Student Name:</span>
                    <span className="text-gray-900">{selectedRequest.student?.fullName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Student ID:</span>
                    <span className="text-gray-900">{selectedRequest.student?.studentId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Class:</span>
                    <span className="text-gray-900">{selectedRequest.student?.className || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Parent:</span>
                    <span className="text-gray-900">{selectedRequest.requestedBy?.fullName || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Parent Email:</span>
                    <span className="text-gray-900">{selectedRequest.requestedBy?.email || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Medication Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2 flex items-center">
                  <Pill className="w-5 h-5 mr-2" />
                  Medication Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Medication Name:</span>
                    <span className="text-gray-900">{selectedRequest.medicationName}</span>
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
                    <span className="font-medium text-gray-600">Priority:</span>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getPriorityLevel(selectedRequest.createdAt).color}`}>
                      {getPriorityLevel(selectedRequest.createdAt).text}
                    </span>
                  </div>
                  {selectedRequest.prescriptionFile && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Prescription:</span>
                      <a
                        href={selectedRequest.prescriptionFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        View File
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Request Status */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg border-b pb-2 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Request Status
              </h3>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Status:</span>
                  <span>{getStatusBadge(selectedRequest.isConfirmed, selectedRequest.confirmedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Submitted:</span>
                  <span className="text-gray-900">{formatDate(selectedRequest.createdAt)}</span>
                </div>
                {selectedRequest.confirmedAt && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Confirmed:</span>
                    <span className="text-gray-900">{formatDate(selectedRequest.confirmedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {!selectedRequest.isConfirmed && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleConfirmRequest(selectedRequest.requestId);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseMedicationRequests;
