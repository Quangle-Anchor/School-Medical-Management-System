import React, { useState, useEffect, useCallback } from 'react';
import { healthIncidentAPI } from '../../api/healthIncidentApi';
import { Plus, Eye, Edit, Trash2, Calendar, AlertTriangle, User, Search, Filter, FileText, X } from 'lucide-react';
import HealthIncidentForm from '../../components/HealthIncidentForm';

const HealthIncidentsView = ({ isParentView = false, students = [] }) => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Define callback functions first to avoid hoisting issues
  const fetchHealthIncidents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user has token before making API call
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      console.log('Fetching health incidents - Token present:', !!token, 'Role:', role);
      
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }
      
      const response = await healthIncidentAPI.getAllHealthIncidents();
      console.log('Health incidents response:', response);
      setIncidents(response);
    } catch (err) {
      console.error('Error fetching health incidents:', err);
      
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view health incidents.');
      } else if (err.response?.status === 404) {
        setError('Health incidents endpoint not found. Please contact support.');
      } else {
        setError(`Failed to load health incidents: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHealthIncidentsByStudent = useCallback(async (studentId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await healthIncidentAPI.getHealthIncidentsByStudent(studentId);
      setIncidents(response || []);
    } catch (err) {
      if (err.message.includes('401') || err.message.includes('Authentication')) {
        setError('Session expired. Please login again.');
      } else if (err.message.includes('403')) {
        setError('Access denied. You do not have permission to view this information.');
      } else {
        setError('Failed to load health incidents. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize component based on view type and authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
      setError('Authentication required. Please login again.');
      setLoading(false);
      return;
    }

    if (isParentView) {
      // Parent view logic
      if (role !== 'Parent') {
        setError('Access denied. Only parents can view their child\'s health incidents.');
        setLoading(false);
        return;
      }
      
      if (students.length === 1) {
        setSelectedStudent(students[0]);
      } else if (students.length === 0) {
        setError('No children registered. Please add your child\'s information first.');
        setLoading(false);
        return;
      } else {
        setLoading(false);
      }
    } else {
      // Nurse view logic
      if (role !== 'Nurse' && role !== 'Admin' && role !== 'Manager') {
        setError('Access denied. Only nurses, admins, and managers can view health incidents.');
        setLoading(false);
        return;
      }
    }
  }, [isParentView, students.length]);

  // Separate effect for nurse data fetching to prevent loops
  useEffect(() => {
    if (!isParentView && !error && incidents.length === 0 && loading) {
      fetchHealthIncidents();
    }
  }, [isParentView, error, incidents.length, loading, fetchHealthIncidents]);  // Fetch incidents when student is selected (parent view)
  useEffect(() => {
    if (isParentView && selectedStudent && selectedStudent.studentId) {
      fetchHealthIncidentsByStudent(selectedStudent.studentId);
    }
  }, [selectedStudent?.studentId, isParentView, fetchHealthIncidentsByStudent]); // Only depend on studentId

  const handleCreateIncident = () => {
    setEditingIncident(null);
    setShowForm(true);
  };

  const handleEditIncident = (incident) => {
    setEditingIncident(incident);
    setShowForm(true);
  };
  const handleDeleteIncident = async (incidentId) => {
    if (!window.confirm('Are you sure you want to delete this health incident?')) {
      return;
    }

    try {
      await healthIncidentAPI.deleteHealthIncident(incidentId);
      // Refresh the appropriate list based on view type
      if (isParentView && selectedStudent) {
        await fetchHealthIncidentsByStudent(selectedStudent.studentId);
      } else {
        await fetchHealthIncidents();
      }
    } catch (error) {
      setError('Failed to delete health incident. Please try again.');
    }
  };

  const handleViewIncident = (incident) => {
    setSelectedIncident(incident);
    setShowDetailModal(true);
  };
  const handleIncidentSaved = () => {
    setShowForm(false);
    setEditingIncident(null);
    // Refresh the appropriate list based on view type
    if (isParentView && selectedStudent) {
      fetchHealthIncidentsByStudent(selectedStudent.studentId);
    } else {
      fetchHealthIncidents();
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingIncident(null);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedIncident(null);
  };

  // Filter incidents based on search term and date
  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.student?.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = dateFilter === '' || incident.incidentDate === dateFilter;
    
    return matchesSearch && matchesDate;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('emergency') || desc.includes('severe') || desc.includes('urgent')) {
      return 'text-red-600 bg-red-100';
    } else if (desc.includes('moderate') || desc.includes('pain') || desc.includes('injury')) {
      return 'text-yellow-600 bg-yellow-100';
    } else {
      return 'text-green-600 bg-green-100';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <span className="ml-3 text-gray-600">Loading health incidents...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Error Loading Health Incidents</p>
            <p className="text-red-600 text-sm">{error}</p>            <div className="mt-3 flex space-x-2">
              <button 
                onClick={() => {
                  setError(null);
                  setIncidents([]); // Clear incidents to trigger refetch
                  setLoading(true);
                  if (isParentView && selectedStudent) {
                    fetchHealthIncidentsByStudent(selectedStudent.studentId);
                  } else if (!isParentView) {
                    fetchHealthIncidents();
                  }
                }}
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
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2 text-orange-600" />
            {isParentView ? "Child's Health Incidents" : "Health Incidents"}
          </h1>
          <p className="text-gray-600">
            {isParentView 
              ? "View your child's health incident records" 
              : "Record and manage student health incidents"
            }
          </p>
        </div>
        {!isParentView && (
          <button
            onClick={handleCreateIncident}
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Record Incident
          </button>
        )}
      </div>

      {/* Student Selection for Parent View */}
      {isParentView && students.length > 1 && (
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <h3 className="text-lg font-medium mb-3">Select Child</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {students.map((student) => (
              <button
                key={student.studentId}
                onClick={() => setSelectedStudent(student)}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  selectedStudent?.studentId === student.studentId
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-orange-300 hover:bg-orange-50'
                }`}
              >
                <div className="font-medium">{student.fullName}</div>
                <div className="text-sm text-gray-600">ID: {student.studentId}</div>
                <div className="text-sm text-gray-600">Grade: {student.grade || 'N/A'}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Show selected student info for parent view */}
      {isParentView && selectedStudent && (
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <h3 className="text-lg font-medium mb-2">Health Incidents for {selectedStudent.fullName}</h3>
          <div className="text-sm text-gray-600">
            Student ID: {selectedStudent.studentId} | Grade: {selectedStudent.grade || 'N/A'} | Class: {selectedStudent.className || 'N/A'}
          </div>
        </div>
      )}

      {/* Only show the rest if not parent view or if parent view and student is selected */}
      {(!isParentView || (isParentView && selectedStudent)) && (
        <>
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name, ID, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent min-w-[180px]"
            />
          </div>

          {/* Results Count */}
          <div className="flex items-center text-sm text-gray-600">
            Showing {filteredIncidents.length} of {incidents.length} incidents
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Incident Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recorded By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium">No health incidents found</p>
                      <p className="text-sm">Try adjusting your search or date filter</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => (
                  <tr key={incident.incidentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-orange-800">
                              {incident.student?.fullName?.charAt(0) || 'N'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {incident.student?.fullName || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {incident.student?.studentId || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(incident.incidentDate)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {incident.description}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(incident.description)}`}>
                        {incident.description.toLowerCase().includes('emergency') || incident.description.toLowerCase().includes('severe') ? 'High' :
                         incident.description.toLowerCase().includes('moderate') || incident.description.toLowerCase().includes('pain') ? 'Medium' : 'Low'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{incident.createdBy?.fullName || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(incident.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewIncident(incident)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {isParentView ? 'View Details' : 'View'}
                        </button>
                        {!isParentView && (
                          <>
                            <button
                              onClick={() => handleEditIncident(incident)}
                              className="text-green-600 hover:text-green-900 inline-flex items-center"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteIncident(incident.incidentId)}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2 text-orange-600" />
                Health Incident Details
              </h2>
              <button
                onClick={handleCloseDetailModal}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Student Information */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Student Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Name:</span>
                    <p className="text-sm text-gray-900">{selectedIncident.student?.fullName || 'Unknown'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Student ID:</span>
                    <p className="text-sm text-gray-900">{selectedIncident.student?.studentId || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Class:</span>
                    <p className="text-sm text-gray-900">{selectedIncident.student?.className || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Grade:</span>
                    <p className="text-sm text-gray-900">{selectedIncident.student?.grade || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Incident Details */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Incident Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Incident Date:</span>
                    <p className="text-sm text-gray-900">{formatDate(selectedIncident.incidentDate)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Description:</span>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedIncident.description}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Severity Level:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${getSeverityColor(selectedIncident.description)}`}>
                      {selectedIncident.description.toLowerCase().includes('emergency') || selectedIncident.description.toLowerCase().includes('severe') ? 'High' :
                       selectedIncident.description.toLowerCase().includes('moderate') || selectedIncident.description.toLowerCase().includes('pain') ? 'Medium' : 'Low'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Record Information */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Record Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Recorded By:</span>
                    <p className="text-sm text-gray-900">{selectedIncident.createdBy?.fullName || 'Unknown'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Created At:</span>
                    <p className="text-sm text-gray-900">{formatDateTime(selectedIncident.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCloseDetailModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {!isParentView && (
                <button
                  onClick={() => {
                    handleCloseDetailModal();
                    handleEditIncident(selectedIncident);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Incident
                </button>
              )}
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {/* Form Modal - Only show for nurse view */}
      {!isParentView && (
        <HealthIncidentForm
          isOpen={showForm}
          onClose={handleCloseForm}
          onIncidentSaved={handleIncidentSaved}
          editingIncident={editingIncident}
          isEditing={!!editingIncident}
        />
      )}
    </div>
  );
};

export default HealthIncidentsView;
