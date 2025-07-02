import React, { useState, useEffect } from 'react';
import { medicationAPI } from '../../api/medicationApi';
import { CheckCircle, Clock, Eye, User, Pill, Calendar, AlertCircle, FileText, Download, X, RefreshCw } from 'lucide-react';

const NurseMedicationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]); // For tab counts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [confirming, setConfirming] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'confirmed'
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

    // Also fetch all requests for tab counts
    fetchAllRequestsForCounts();

    // Set up automatic refresh every 2 minutes for nurse dashboard
    const refreshInterval = setInterval(() => {
      fetchPendingRequests();
      fetchAllRequestsForCounts();
    }, 120000);

    // Also refresh when the window regains focus
    const handleFocus = () => {
      fetchPendingRequests();
      fetchAllRequestsForCounts();
    };

    window.addEventListener('focus', handleFocus);

    // Cleanup interval and event listener on component unmount
    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [activeTab]); // Add activeTab as dependency
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
      
      // Fetch requests based on active tab
      const response = activeTab === 'pending' 
        ? await medicationAPI.getPendingRequests()
        : await medicationAPI.getAllRequests();
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

  const fetchAllRequestsForCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await medicationAPI.getAllRequests();
      setAllRequests(response);
    } catch (err) {
      // Silently fail for counts
      console.error('Failed to fetch all requests for counts:', err);
    }
  };

  const handleConfirmRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to confirm this medication request?')) {
      return;
    }

    try {
      setConfirming(requestId);
      setError(null);
      setSuccess(null);
      await medicationAPI.confirmMedicationRequest(requestId);
      setSuccess('Medication request confirmed successfully. Parent will be notified.');
      await fetchPendingRequests(); // Refresh the current list
      await fetchAllRequestsForCounts(); // Refresh counts
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
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
      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
          <p className="text-green-800 font-medium">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Medication Requests</h1>
          <p className="text-gray-600">Review and confirm medication requests from parents</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {activeTab === 'pending' 
              ? `${allRequests.filter(r => !(r.isConfirmed || r.confirmed)).length} pending requests`
              : `${allRequests.filter(r => (r.isConfirmed || r.confirmed)).length} confirmed requests`
            }
          </span>
          <button
            onClick={() => {
              fetchPendingRequests();
              fetchAllRequestsForCounts();
            }}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            title="Refresh to check for new requests"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Requests
              <span className="ml-2 bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full text-xs">
                {allRequests.filter(r => !(r.isConfirmed || r.confirmed)).length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('confirmed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'confirmed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Confirmed Requests
              <span className="ml-2 bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs">
                {allRequests.filter(r => (r.isConfirmed || r.confirmed)).length}
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Quick Stats - Only show for pending tab */}
      {activeTab === 'pending' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {requests.filter(r => !(r.isConfirmed || r.confirmed)).length}
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
                  {requests.filter(r => (r.isConfirmed || r.confirmed) && r.confirmedAt && 
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
                  {requests.filter(r => !(r.isConfirmed || r.confirmed) && getPriorityLevel(r.createdAt).level === 'high').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Requests List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {(() => {
          const filteredRequests = activeTab === 'pending' 
            ? requests.filter(r => !(r.isConfirmed || r.confirmed))
            : requests.filter(r => (r.isConfirmed || r.confirmed));
          
          if (filteredRequests.length === 0) {
            return (
              <div className="p-12 text-center">
                <Pill className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'pending' ? 'No pending requests' : 'No confirmed requests'}
                </p>
                <p className="text-gray-600">
                  {activeTab === 'pending' 
                    ? 'All medication requests have been processed.' 
                    : 'No requests have been confirmed yet.'
                  }
                </p>
              </div>
            );
          }

          return (
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
                      {activeTab === 'pending' ? 'Submitted' : 'Confirmed'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => {
                    const priority = getPriorityLevel(request.createdAt);
                  return (
                    <tr key={request.requestId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.studentName || 'Unknown Student'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {request.studentId || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            Parent: {request.parentName || 'Unknown'}
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
                        {getStatusBadge(request.isConfirmed || request.confirmed, request.confirmedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activeTab === 'pending' 
                          ? formatDate(request.createdAt)
                          : formatDate(request.confirmedAt || request.createdAt)
                        }
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
                          {!(request.isConfirmed || request.confirmed) && (
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
          );
        })()}
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
                    <span className="text-gray-900">{selectedRequest.studentName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Student ID:</span>
                    <span className="text-gray-900">{selectedRequest.studentId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Class:</span>
                    <span className="text-gray-900">{selectedRequest.studentClass || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Parent:</span>
                    <span className="text-gray-900">{selectedRequest.parentName || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Parent Email:</span>
                    <span className="text-gray-900">{selectedRequest.parentEmail || 'N/A'}</span>
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
                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch(`http://localhost:8080/api/medications/prescription/${selectedRequest.prescriptionFile}`, {
                              headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                              }
                            });
                            if (response.ok) {
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              window.open(url, '_blank');
                            } else {
                              alert('Failed to load prescription file');
                            }
                          } catch (error) {
                            alert('Error loading prescription file');
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        View File
                      </button>
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
                  <span>{getStatusBadge(selectedRequest.isConfirmed || selectedRequest.confirmed, selectedRequest.confirmedAt)}</span>
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
              {!(selectedRequest.isConfirmed || selectedRequest.confirmed) && (
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
