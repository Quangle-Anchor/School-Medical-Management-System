import React, { useState, useEffect } from "react";
import { medicationAPI } from "../../api/medicationApi";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  User,
  Pill,
  Calendar,
  AlertCircle,
  FileText,
  Download,
  X,
  RefreshCw,
  Trash2,
  Search,
  Filter,
} from "lucide-react";
import { useToast } from "../../hooks/useToast";
import {
  useConfirmation,
  getConfirmationConfig,
  handleBulkConfirmation,
} from "../../utils/confirmationUtils";
import ConfirmationModal from "../../components/ConfirmationModal";
import Pagination from "../../components/Pagination";

const NurseMedicationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]); // For tab counts and filtering
  const [filteredRequests, setFilteredRequests] = useState([]); // Paginated filtered results
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'pending', 'confirmed', 'unconfirmed'

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { showSuccess, showError, showWarning } = useToast();

  // Confirmation hook for medication requests
  const medicationConfirmation = useConfirmation(
    async (request) => {
      await medicationAPI.confirmMedicationRequest(request.requestId);
      await fetchAllRequests(); // Refresh the current list
    },
    showSuccess,
    showError
  );
  useEffect(() => {
    // Check if user is authenticated before fetching data
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      setError("Authentication required. Please login again.");
      setLoading(false);
      return;
    }

    if (role !== "Nurse") {
      setError("Access denied. Only nurses can view medication requests.");
      setLoading(false);
      return;
    }

    fetchAllRequests();

    // Only refresh when the window regains focus
    const handleFocus = () => {
      fetchAllRequests();
    };

    window.addEventListener("focus", handleFocus);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    applyFiltersAndPagination();
  }, [allRequests, filterStatus, searchTerm, currentPage, pageSize]);
  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user has token before making API call
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please login again.");
        return;
      }

      // Fetch all requests for filtering and pagination
      const response = await medicationAPI.getAllRequests();
      setAllRequests(response);
    } catch (err) {
      if (err.message.includes("401") || err.message.includes("403")) {
        setError("Access denied. Only nurses can view medication requests.");
      } else {
        setError("Failed to load medication requests. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndPagination = () => {
    let filtered = [...allRequests];

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (request) => request.confirmationStatus === filterStatus
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.studentName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.studentCode
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.parentName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.medicationName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Calculate pagination
    const totalFilteredElements = filtered.length;
    const totalFilteredPages = Math.ceil(totalFilteredElements / pageSize);

    // Reset to first page if current page is beyond total pages
    const safePage = currentPage >= totalFilteredPages ? 0 : currentPage;
    if (safePage !== currentPage) {
      setCurrentPage(safePage);
      return; // Let the effect run again with the new page
    }

    // Apply pagination
    const startIndex = safePage * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRequests = filtered.slice(startIndex, endIndex);

    // Update state
    setFilteredRequests(paginatedRequests);
    setRequests(paginatedRequests); // Keep for backward compatibility
    setTotalPages(totalFilteredPages);
    setTotalElements(totalFilteredElements);
  };

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(0); // Reset to first page when search changes
  };

  const handleFilterChange = (newFilter) => {
    setFilterStatus(newFilter);
    setCurrentPage(0); // Reset to first page when filter changes
  };

  const handleConfirmRequest = async (request) => {
    const config = getConfirmationConfig("medical-request", request);
    await medicationConfirmation.handleConfirm(request, {
      getItemId: config.getItemId,
      getItemName: config.getItemName,
      successMessage: `Medication request has been confirmed successfully. Parent will be notified.`,
      errorMessage:
        "Cannot confirm: Don't have medical which is request need in inventory. Please add to inventory first.",
      invalidIdMessage: "Cannot confirm request: Invalid request ID",
    });
  };

  const handleConfirmRequestClick = (request) => {
    medicationConfirmation.handleConfirmClick(request);
  };

  const handleRejectRequest = async () => {
    if (!rejectReason.trim()) {
      setError("Please provide a reason for rejection.");
      return;
    }

    try {
      setRejecting(selectedRequest.requestId);
      setError(null);
      await medicationAPI.rejectMedicationRequest(
        selectedRequest.requestId,
        rejectReason
      );
      showSuccess(
        "Medication request rejected successfully. Parent will be notified."
      );
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedRequest(null);
      await fetchAllRequests(); // Refresh the list
    } catch (error) {
      setError("Failed to reject medication request. Please try again.");
    } finally {
      setRejecting(null);
    }
  };

  const openRejectModal = (request) => {
    setSelectedRequest(request);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const handleDeleteRequest = async (request) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the medication request for ${request.studentName}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeleting(request.requestId);
      setError(null);
      await medicationAPI.deleteMedicationRequest(request.requestId);
      showSuccess("Medication request deleted successfully.");
      await fetchAllRequests(); // Refresh the list
    } catch (error) {
      console.error("Error deleting medication request:", error);
      setError("Failed to delete medication request. Please try again.");
      showError("Failed to delete medication request. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const getStatusBadge = (confirmationStatus, confirmedAt) => {
    if (confirmationStatus === "confirmed") {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Confirmed
        </span>
      );
    } else if (confirmationStatus === "unconfirmed") {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </span>
      );
    } else if (confirmationStatus === "in_progress") {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          <RefreshCw className="w-3 h-3 mr-1" />
          In Progress
        </span>
      );
    } else if (confirmationStatus === "done") {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Done
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
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityLevel = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const hoursDiff = (now - created) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      return {
        level: "high",
        text: "High Priority",
        color: "bg-red-100 text-red-800",
      };
    } else if (hoursDiff > 12) {
      return {
        level: "medium",
        text: "Medium Priority",
        color: "bg-yellow-100 text-yellow-800",
      };
    } else {
      return {
        level: "low",
        text: "Normal",
        color: "bg-green-100 text-green-800",
      };
    }
  };

  const handleViewPrescription = async (prescriptionFileUrl) => {
    try {
      if (!prescriptionFileUrl) {
        setError("No prescription file available.");
        return;
      }

      // Check if it's a Cloudinary URL (cloud-based storage)
      if (
        prescriptionFileUrl.startsWith("http://") ||
        prescriptionFileUrl.startsWith("https://")
      ) {
        // Direct URL - open in new tab
        const newTab = window.open(prescriptionFileUrl, "_blank");

        if (!newTab) {
          showWarning(
            "Please allow popups for this site to view prescription files."
          );
        }
        return;
      }

      // Legacy support for filename-based storage
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please login again.");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/medications/prescription/${prescriptionFileUrl}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const newTab = window.open(url, "_blank");

        // Clean up the URL after a short delay
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);

        if (!newTab) {
          showWarning(
            "Please allow popups for this site to view prescription files."
          );
        }
      } else {
        showError("Failed to load prescription file");
      }
    } catch (error) {
      showError("Error loading prescription file");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">
            Loading medication requests...
          </span>
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
                onClick={fetchAllRequests}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Try Again
              </button>
              {(error.includes("Authentication") ||
                error.includes("Session expired")) && (
                <button
                  onClick={() => (window.location.href = "/login")}
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Medication Requests
          </h1>
          <p className="text-gray-600">
            Review and confirm medication requests from parents
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-blue-700">
              Total Requests: {totalElements}
            </span>
          </div>
          <button
            onClick={fetchAllRequests}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            title="Refresh to check for new requests"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by student name, code, parent, or medication..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="unconfirmed">Rejected</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Results Info */}
          <div className="text-sm text-gray-600">
            Showing {filteredRequests.length} of {totalElements} requests
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  allRequests.filter((r) => r.confirmationStatus === "pending")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  allRequests.filter(
                    (r) => r.confirmationStatus === "confirmed"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <RefreshCw className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  allRequests.filter(
                    (r) => r.confirmationStatus === "in_progress"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Done</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  allRequests.filter((r) => r.confirmationStatus === "done")
                    .length
                }
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
                {
                  allRequests.filter(
                    (r) =>
                      r.confirmationStatus === "pending" &&
                      getPriorityLevel(r.createdAt).level === "high"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {(() => {
          if (filteredRequests.length === 0) {
            return (
              <div className="p-12 text-center">
                <Pill className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filterStatus !== "all"
                    ? "No matching requests found"
                    : "No medication requests found"}
                </p>
                <p className="text-gray-600">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "No medication requests have been submitted yet."}
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
                      Date Submitted
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
                              {request.studentName || "Unknown Student"}
                            </div>
                            <div className="text-sm text-gray-500">
                              Code: {request.studentCode || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              Parent: {request.parentName || "Unknown"}
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
                            {request.totalQuantity && (
                              <div className="text-sm text-gray-500">
                                Total: {request.totalQuantity}
                                {(request.morningQuantity ||
                                  request.noonQuantity ||
                                  request.eveningQuantity) && (
                                  <span className="ml-1">
                                    (
                                    {[
                                      request.morningQuantity &&
                                        `M:${request.morningQuantity}`,
                                      request.noonQuantity &&
                                        `N:${request.noonQuantity}`,
                                      request.eveningQuantity &&
                                        `E:${request.eveningQuantity}`,
                                    ]
                                      .filter(Boolean)
                                      .join(", ")}
                                    )
                                  </span>
                                )}
                              </div>
                            )}
                            {request.isSufficientStock !== undefined && (
                              <div
                                className={`text-xs mt-1 ${
                                  request.isSufficientStock
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {request.isSufficientStock
                                  ? "✅ Stock Available"
                                  : "⚠️ Low Stock"}
                              </div>
                            )}
                            {request.prescriptionFile && (
                              <div className="text-sm text-blue-600 flex items-center mt-1">
                                <FileText className="w-3 h-3 mr-1" />
                                Prescription attached
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${priority.color}`}
                          >
                            {priority.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(
                            request.confirmationStatus,
                            request.confirmedAt
                          )}
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
                            {request.confirmationStatus === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleConfirmRequestClick(request)
                                  }
                                  disabled={medicationConfirmation.isConfirming(
                                    request.requestId
                                  )}
                                  className="text-green-600 hover:text-green-900 inline-flex items-center disabled:opacity-50"
                                >
                                  {medicationConfirmation.isConfirming(
                                    request.requestId
                                  ) ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-1"></div>
                                  ) : (
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                  )}
                                  Confirm
                                </button>
                                <button
                                  onClick={() => openRejectModal(request)}
                                  disabled={rejecting === request.requestId}
                                  className="text-red-600 hover:text-red-900 inline-flex items-center disabled:opacity-50"
                                >
                                  {rejecting === request.requestId ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                                  ) : (
                                    <XCircle className="h-4 w-4 mr-1" />
                                  )}
                                  Reject
                                </button>
                              </>
                            )}
                            {(request.confirmationStatus === "confirmed" ||
                              request.confirmationStatus === "in_progress" ||
                              request.confirmationStatus === "done") && (
                              <button
                                onClick={() => handleDeleteRequest(request)}
                                disabled={deleting === request.requestId}
                                className="text-red-600 hover:text-red-900 inline-flex items-center disabled:opacity-50"
                              >
                                {deleting === request.requestId ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                                ) : (
                                  <Trash2 className="h-4 w-4 mr-1" />
                                )}
                                Delete
                              </button>
                            )}
                            {request.confirmationStatus === "unconfirmed" && (
                              <button
                                onClick={() =>
                                  handleConfirmRequestClick(request)
                                }
                                disabled={medicationConfirmation.isConfirming(
                                  request.requestId
                                )}
                                className="text-green-600 hover:text-green-900 inline-flex items-center disabled:opacity-50"
                              >
                                {medicationConfirmation.isConfirming(
                                  request.requestId
                                ) ? (
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

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          isFirst={currentPage === 0}
          isLast={currentPage >= totalPages - 1}
        />
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto my-4 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Medication Request Details
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
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
                    <span className="font-medium text-gray-600">
                      Student Name:
                    </span>
                    <span className="text-gray-900">
                      {selectedRequest.studentName || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Student Code:
                    </span>
                    <span className="text-gray-900 font-mono">
                      {selectedRequest.studentCode || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Class:</span>
                    <span className="text-gray-900">
                      {selectedRequest.studentClass || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Parent:</span>
                    <span className="text-gray-900">
                      {selectedRequest.parentName || "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Parent Email:
                    </span>
                    <span className="text-gray-900">
                      {selectedRequest.parentEmail || "N/A"}
                    </span>
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
                    <span className="font-medium text-gray-600">
                      Medication Name:
                    </span>
                    <span className="text-gray-900">
                      {selectedRequest.medicationName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Dosage:</span>
                    <span className="text-gray-900">
                      {selectedRequest.dosage}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Frequency:
                    </span>
                    <span className="text-gray-900">
                      {selectedRequest.frequency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Total Quantity:
                    </span>
                    <span className="text-gray-900">
                      {selectedRequest.totalQuantity || "N/A"}
                    </span>
                  </div>
                  {(selectedRequest.morningQuantity ||
                    selectedRequest.noonQuantity ||
                    selectedRequest.eveningQuantity) && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="font-medium text-gray-600 block mb-2">
                        Daily Distribution:
                      </span>
                      <div className="space-y-1 text-sm">
                        {selectedRequest.morningQuantity && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Morning:</span>
                            <span className="text-gray-900">
                              {selectedRequest.morningQuantity}
                            </span>
                          </div>
                        )}
                        {selectedRequest.noonQuantity && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Noon:</span>
                            <span className="text-gray-900">
                              {selectedRequest.noonQuantity}
                            </span>
                          </div>
                        )}
                        {selectedRequest.eveningQuantity && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Evening:</span>
                            <span className="text-gray-900">
                              {selectedRequest.eveningQuantity}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Priority:</span>
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        getPriorityLevel(selectedRequest.createdAt).color
                      }`}
                    >
                      {getPriorityLevel(selectedRequest.createdAt).text}
                    </span>
                  </div>
                  {selectedRequest.isSufficientStock !== undefined && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Stock Status:
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedRequest.isSufficientStock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedRequest.isSufficientStock
                          ? "✅ Sufficient Stock"
                          : "⚠️ Insufficient Stock"}
                      </span>
                    </div>
                  )}
                  {selectedRequest.prescriptionFile && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Prescription:
                      </span>
                      <button
                        onClick={() =>
                          handleViewPrescription(
                            selectedRequest.prescriptionFile
                          )
                        }
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
                  <span>
                    {getStatusBadge(
                      selectedRequest.confirmationStatus,
                      selectedRequest.confirmedAt
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Submitted:</span>
                  <span className="text-gray-900">
                    {formatDate(selectedRequest.createdAt)}
                  </span>
                </div>
                {selectedRequest.confirmedAt && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Confirmed:
                    </span>
                    <span className="text-gray-900">
                      {formatDate(selectedRequest.confirmedAt)}
                    </span>
                  </div>
                )}
                {selectedRequest.confirmationStatus === "unconfirmed" &&
                  selectedRequest.unconfirmReason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="font-medium text-red-700 block mb-1">
                            Rejection Reason:
                          </span>
                          <p className="text-red-600 text-sm leading-relaxed">
                            {selectedRequest.unconfirmReason}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {selectedRequest.confirmationStatus === "pending" && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleConfirmRequestClick(selectedRequest);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Request
                </button>
              )}
              {selectedRequest.confirmationStatus === "unconfirmed" && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleConfirmRequestClick(selectedRequest);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Reject Medication Request
              </h2>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedRequest(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                You are about to reject the medication request for:
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium">{selectedRequest.studentName}</p>
                <p className="text-sm text-gray-600">
                  {selectedRequest.medicationName}
                </p>
                <p className="text-sm text-gray-600">
                  Parent: {selectedRequest.parentName}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Please provide a clear reason for rejecting this medication request..."
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedRequest(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectRequest}
                disabled={rejecting || !rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {rejecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Medication Request Confirmation Modal */}
      <ConfirmationModal
        show={medicationConfirmation.showModal}
        onConfirm={handleConfirmRequest}
        onCancel={medicationConfirmation.cancelConfirm}
        item={medicationConfirmation.itemToConfirm}
        config={{
          ...getConfirmationConfig(
            "medical-request",
            medicationConfirmation.itemToConfirm || {}
          ),
          type: "medical-request",
        }}
        isConfirming={
          medicationConfirmation.itemToConfirm
            ? medicationConfirmation.isConfirming(
                medicationConfirmation.itemToConfirm.requestId
              )
            : false
        }
      />
    </div>
  );
};

export default NurseMedicationRequests;
