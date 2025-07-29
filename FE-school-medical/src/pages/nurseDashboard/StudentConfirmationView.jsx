import React, { useState, useEffect } from "react";
import {
  User,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  X,
  MessageSquare,
  Search,
  Filter,
  Heart,
  FileText,
} from "lucide-react";
import { studentAPI } from "../../api/studentsApi";
import { useToast } from "../../hooks/useToast";
import {
  useConfirmation,
  getConfirmationConfig,
} from "../../utils/confirmationUtils";
import ConfirmationModal from "../../components/ConfirmationModal";
import Pagination from "../../components/Pagination";

const StudentConfirmationView = () => {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]); // Store all students for filtering
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [healthInfo, setHealthInfo] = useState({}); // Store health information for students

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Statistics states
  const [statistics, setStatistics] = useState({
    pending: 0,
    confirmed: 0,
    unconfirmed: 0,
    total: 0,
  });

  const { showSuccess, showError } = useToast();

  // Student confirmation hook
  const studentConfirmation = useConfirmation(
    async (student) => {
      await studentAPI.confirmStudent(student.studentId);
      fetchAllStudents(); // Refresh all students data
      fetchStatistics(); // Refresh statistics
    },
    showSuccess,
    showError
  );

  useEffect(() => {
    fetchAllStudents();
    fetchStatistics();

    // Set up automatic refresh every 30 seconds for nurse dashboard
    // More frequent than default to catch new student requests quickly
    const refreshInterval = setInterval(() => {
      fetchAllStudents();
      fetchStatistics();
    }, 30000);

    // Also refresh when the window regains focus
    const handleFocus = () => {
      fetchAllStudents();
      fetchStatistics();
    };

    window.addEventListener("focus", handleFocus);

    // Cleanup interval and event listener on component unmount
    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    applyFiltersAndPagination();
  }, [allStudents, filterStatus, searchTerm, currentPage, pageSize]);

  useEffect(() => {
    // Update statistics when allStudents data changes
    if (allStudents.length > 0) {
      const stats = {
        pending: allStudents.filter((s) => s.confirmationStatus === "pending")
          .length,
        confirmed: allStudents.filter(
          (s) => s.confirmationStatus === "confirmed"
        ).length,
        unconfirmed: allStudents.filter(
          (s) => s.confirmationStatus === "unconfirmed"
        ).length,
        total: allStudents.length,
      };
      setStatistics(stats);
    }
  }, [allStudents]);

  const fetchStatistics = async () => {
    try {
      // Use allStudents if available, otherwise fetch fresh data
      let studentsForStats = allStudents;

      if (allStudents.length === 0) {
        const allStudentsResponse = await studentAPI.getAllStudents(0, 10000);
        studentsForStats = Array.isArray(allStudentsResponse.content)
          ? allStudentsResponse.content
          : Array.isArray(allStudentsResponse)
          ? allStudentsResponse
          : [];
      }

      const stats = {
        pending: studentsForStats.filter(
          (s) => s.confirmationStatus === "pending"
        ).length,
        confirmed: studentsForStats.filter(
          (s) => s.confirmationStatus === "confirmed"
        ).length,
        unconfirmed: studentsForStats.filter(
          (s) => s.confirmationStatus === "unconfirmed"
        ).length,
        total: studentsForStats.length,
      };

      setStatistics(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const fetchAllStudents = async () => {
    try {
      setLoading(true);
      // Fetch all students at once for client-side filtering and pagination
      const response = await studentAPI.getAllStudents(0, 10000);

      let studentsData = [];
      if (response.content) {
        // Paginated response
        studentsData = response.content;
      } else {
        // Non-paginated response
        studentsData = Array.isArray(response) ? response : [];
      }

      setAllStudents(studentsData);

      // Fetch health info for each student
      const healthData = {};
      for (const student of studentsData) {
        try {
          // Try to fetch health info from the separate health-info API
          const healthInfoResponse = await studentAPI.getHealthInfoByStudentId(
            student.studentId
          );

          // If health info exists, use it; otherwise use default values
          if (healthInfoResponse && healthInfoResponse.length > 0) {
            const healthInfo = healthInfoResponse[0]; // Get the first/latest health info record
            healthData[student.studentId] = {
              bloodType: student.bloodType,
              heightCm: student.heightCm,
              weightKg: student.weightKg,
              medicalConditions: healthInfo.medicalConditions || "None",
              allergies: healthInfo.allergies || "None",
              notes: healthInfo.notes || "",
              lastCheckup: healthInfo.updatedAt
                ? new Date(healthInfo.updatedAt).toLocaleDateString()
                : "Not available",
            };
          } else {
            // No health info found, use student data and defaults
            healthData[student.studentId] = {
              bloodType: student.bloodType,
              heightCm: student.heightCm,
              weightKg: student.weightKg,
              medicalConditions: "None",
              allergies: "None",
              notes: "",
              lastCheckup: "Not available",
            };
          }
        } catch (error) {
          console.error(
            `Error fetching health info for student ${student.studentId}:`,
            error
          );
          // Use defaults if health info fetch fails
          healthData[student.studentId] = {
            bloodType: student.bloodType,
            heightCm: student.heightCm,
            weightKg: student.weightKg,
            medicalConditions: "None",
            allergies: "None",
            notes: "",
            lastCheckup: "Not available",
          };
        }
      }
      setHealthInfo(healthData);
    } catch (error) {
      showError("Failed to load students");
      console.error("Error fetching students:", error);
      setAllStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndPagination = () => {
    let filtered = [...allStudents];

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (student) => student.confirmationStatus === filterStatus
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentCode
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.className?.toLowerCase().includes(searchTerm.toLowerCase())
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
    const paginatedStudents = filtered.slice(startIndex, endIndex);

    // Update state
    setFilteredStudents(paginatedStudents);
    setStudents(paginatedStudents); // Keep for backward compatibility
    setTotalPages(totalFilteredPages);
    setTotalElements(totalFilteredElements);
  };

  const handleConfirmStudent = async (student) => {
    const config = getConfirmationConfig("student", student);
    await studentConfirmation.handleConfirm(student, {
      getItemId: config.getItemId,
      getItemName: config.getItemName,
      successMessage: `Student ${student.fullName} has been confirmed successfully!`,
      errorMessage: "Failed to confirm student. Please try again.",
      invalidIdMessage: "Cannot confirm student: Invalid student ID",
    });
  };

  const handleConfirmStudentClick = (student) => {
    studentConfirmation.handleConfirmClick(student);
  };

  const handleFilterChange = (newFilter) => {
    setFilterStatus(newFilter);
    setCurrentPage(0); // Reset to first page when filter changes
  };

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(0); // Reset to first page when search changes
  };

  const handleRejectStudent = async () => {
    if (!showRejectModal || !rejectReason.trim()) {
      showError("Please provide a reason for rejection");
      return;
    }

    try {
      setRejectingId(showRejectModal.studentId);
      await studentAPI.rejectStudent(showRejectModal.studentId, rejectReason);
      showSuccess("Student marked as unconfirmed and parent notified");
      setShowRejectModal(null);
      setRejectReason("");
      fetchAllStudents(); // Refresh all students data
      fetchStatistics(); // Refresh statistics
    } catch (error) {
      showError("Failed to reject student");
      console.error("Error rejecting student:", error);
    } finally {
      setRejectingId(null);
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <div className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </div>
        );
      case "unconfirmed":
        return (
          <div className="flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            <AlertCircle className="w-3 h-3 mr-1" />
            Unconfirmed
          </div>
        );
      default:
        return (
          <div className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Student Confirmations
          </h1>
          <p className="text-gray-600">
            Review and confirm student registrations
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, student code, or class..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Students</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="unconfirmed">Unconfirmed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-lg font-bold text-yellow-600">
                  {statistics.pending}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-lg font-bold text-green-600">
                  {statistics.confirmed}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Unconfirmed</p>
                <p className="text-lg font-bold text-red-600">
                  {statistics.unconfirmed}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-lg font-bold text-blue-600">
                  {statistics.total}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Students List */}
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No students found
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No students registered yet"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registered
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.studentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.studentCode || "No code assigned"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.className || "Not assigned"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {calculateAge(student.dateOfBirth)} years
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(student.confirmationStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(student.updatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {/* View Details Button */}
                          <div className="relative group">
                            <button
                              onClick={() => setSelectedStudent(student)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                              View Details
                            </div>
                          </div>

                          {student.confirmationStatus === "pending" && (
                            <>
                              {/* Confirm Button */}
                              <div className="relative group">
                                <button
                                  onClick={() =>
                                    handleConfirmStudentClick(student)
                                  }
                                  disabled={studentConfirmation.isConfirming(
                                    student.studentId
                                  )}
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                  title="Confirm Student"
                                >
                                  {studentConfirmation.isConfirming(
                                    student.studentId
                                  ) ? (
                                    <div className="animate-spin w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4" />
                                  )}
                                </button>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                  Confirm Student
                                </div>
                              </div>

                              {/* Reject Button */}
                              <div className="relative group">
                                <button
                                  onClick={() => setShowRejectModal(student)}
                                  disabled={rejectingId === student.studentId}
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                  title="Mark as Unconfirmed"
                                >
                                  {rejectingId === student.studentId ? (
                                    <div className="animate-spin w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full" />
                                  ) : (
                                    <AlertCircle className="w-4 h-4" />
                                  )}
                                </button>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                  Mark as Unconfirmed
                                </div>
                              </div>
                            </>
                          )}

                          {student.confirmationStatus === "confirmed" && (
                            <div className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Confirmed
                            </div>
                          )}

                          {student.confirmationStatus === "unconfirmed" && (
                            <div className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Unconfirmed
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                isFirst={currentPage === 0}
                isLast={currentPage >= totalPages - 1}
              />
            )}
          </div>
        )}

        {/* Student Detail Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedStudent.fullName}
                </h2>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Full Name:
                      </span>
                      <span className="text-gray-900">
                        {selectedStudent.fullName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Date of Birth:
                      </span>
                      <span className="text-gray-900">
                        {formatDate(selectedStudent.dateOfBirth)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Age:</span>
                      <span className="text-gray-900">
                        {calculateAge(selectedStudent.dateOfBirth)} years
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Gender:</span>
                      <span className="text-gray-900">
                        {selectedStudent.gender || "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Confirmation Status:
                      </span>
                      <div>
                        {getStatusBadge(selectedStudent.confirmationStatus)}
                      </div>
                    </div>
                  </div>

                  {/* School Information */}
                  <h3 className="font-semibold text-lg border-b pb-2 mt-6 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    School Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Class:</span>
                      <span className="text-gray-900">
                        {selectedStudent.className || "Not assigned"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Student Code:
                      </span>
                      <span className="text-gray-900">
                        {selectedStudent.studentCode || "Not assigned"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Health Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2 flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Health Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Blood Type:
                      </span>
                      <span className="text-gray-900">
                        {selectedStudent.bloodType || "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Height:</span>
                      <span className="text-gray-900">
                        {selectedStudent.heightCm
                          ? `${selectedStudent.heightCm} cm`
                          : "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Weight:</span>
                      <span className="text-gray-900">
                        {selectedStudent.weightKg
                          ? `${selectedStudent.weightKg} kg`
                          : "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Medical Conditions:
                      </span>
                      <span className="text-gray-900">
                        {healthInfo[selectedStudent.studentId]
                          ?.medicalConditions || "None"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Allergies:
                      </span>
                      <span className="text-gray-900">
                        {healthInfo[selectedStudent.studentId]?.allergies ||
                          "None"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Last Checkup:
                      </span>
                      <span className="text-gray-900">
                        {healthInfo[selectedStudent.studentId]?.lastCheckup ||
                          "Not available"}
                      </span>
                    </div>
                  </div>

                  {/* Additional Notes Section */}
                  {healthInfo[selectedStudent.studentId]?.notes && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">
                        Additional Notes:
                      </h4>
                      <div className="p-3 bg-gray-50 rounded-md border">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                          {healthInfo[selectedStudent.studentId].notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="inline-flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </button>

                {selectedStudent.confirmationStatus === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedStudent(null);
                        handleConfirmStudentClick(selectedStudent);
                      }}
                      disabled={studentConfirmation.isConfirming(
                        selectedStudent.studentId
                      )}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
                    >
                      {studentConfirmation.isConfirming(
                        selectedStudent.studentId
                      ) ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Confirming...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirm Student
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStudent(null);
                        setShowRejectModal(selectedStudent);
                      }}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Mark as Unconfirmed
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Mark as Unconfirmed
                </h3>
                <button
                  onClick={() => {
                    setShowRejectModal(null);
                    setRejectReason("");
                  }}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  You are about to mark{" "}
                  <strong>{showRejectModal.fullName}</strong> as unconfirmed.
                  Please provide a reason that will be sent to the parent via
                  email.
                </p>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter reason for not confirming this student..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(null);
                    setRejectReason("");
                  }}
                  className="inline-flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleRejectStudent}
                  disabled={
                    !rejectReason.trim() ||
                    rejectingId === showRejectModal.studentId
                  }
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
                >
                  {rejectingId === showRejectModal.studentId ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send & Mark Unconfirmed
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Student Confirmation Modal */}
        <ConfirmationModal
          show={studentConfirmation.showModal}
          onConfirm={handleConfirmStudent}
          onCancel={studentConfirmation.cancelConfirm}
          item={studentConfirmation.itemToConfirm}
          config={{
            ...getConfirmationConfig(
              "student",
              studentConfirmation.itemToConfirm || {}
            ),
            type: "student",
          }}
          isConfirming={
            studentConfirmation.itemToConfirm
              ? studentConfirmation.isConfirming(
                  studentConfirmation.itemToConfirm.studentId
                )
              : false
          }
        />
      </div>
    </div>
  );
};

export default StudentConfirmationView;
