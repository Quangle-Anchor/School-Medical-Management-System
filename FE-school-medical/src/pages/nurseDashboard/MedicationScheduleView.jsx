import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { medicationScheduleAPI } from "../../api/medicationScheduleApi";
import {
  Calendar,
  Clock,
  User,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Eye,
  Search,
  Filter,
} from "lucide-react";
import { useToast } from "../../hooks/useToast";
import Pagination from "../../components/Pagination";

const MedicationScheduleManagement = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [allSchedules, setAllSchedules] = useState([]); // For filtering and pagination
  const [filteredSchedules, setFilteredSchedules] = useState([]); // Paginated filtered results
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showSuccess } = useToast();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'upcoming', 'completed'

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchSchedules();

    // Only refresh when the window regains focus
    const handleFocus = () => {
      fetchSchedules();
    };

    window.addEventListener("focus", handleFocus);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    applyFiltersAndPagination();
  }, [allSchedules, filterStatus, searchTerm, currentPage, pageSize]);

  const fetchSchedules = async () => {
    try {
      const data = await medicationScheduleAPI.getAllSchedulesForNurse();
      const schedulesArray = Array.isArray(data) ? data : [];
      setAllSchedules(schedulesArray);
      setSchedules(schedulesArray);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setError("Failed to fetch medication schedules");
      setAllSchedules([]);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndPagination = () => {
    let filtered = [...allSchedules];

    // Apply status filter
    const now = new Date();
    if (filterStatus === "upcoming") {
      filtered = filtered.filter((schedule) => {
        const scheduleDateTime = new Date(
          `${schedule.scheduledDate}T${schedule.scheduledTime}`
        );
        return scheduleDateTime > now;
      });
    } else if (filterStatus === "completed") {
      filtered = filtered.filter((schedule) => {
        const scheduleDateTime = new Date(
          `${schedule.scheduledDate}T${schedule.scheduledTime}`
        );
        return scheduleDateTime <= now;
      });
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (schedule) =>
          schedule.studentName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          schedule.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          schedule.administeredBy
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
    const paginatedSchedules = filtered.slice(startIndex, endIndex);

    // Update state
    setFilteredSchedules(paginatedSchedules);
    setSchedules(paginatedSchedules); // Keep for backward compatibility
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

  const handleCreateSchedule = () => {
    navigate("/nurseDashboard/medication-schedules/create");
  };

  const handleEditSchedule = (schedule) => {
    navigate(
      `/nurseDashboard/medication-schedules/edit/${schedule.scheduleId}`
    );
  };

  const handleViewSchedule = (schedule) => {
    navigate(
      `/nurseDashboard/medication-schedules/view/${schedule.scheduleId}`
    );
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this medication schedule?"
      )
    ) {
      return;
    }

    try {
      await medicationScheduleAPI.deleteSchedule(scheduleId);
      showSuccess("Medication schedule deleted successfully");
      await fetchSchedules();
    } catch (error) {
      console.error("Error deleting schedule:", error);
      setError("Failed to delete medication schedule");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Clear error messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">
          Loading medication schedules...
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Medication Schedule Management
            </h1>
            <p className="text-gray-600 mt-2">
              Schedule and manage medication administration for students
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-blue-700">
                Total Schedules: {totalElements}
              </span>
            </div>
            <button
              onClick={handleCreateSchedule}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Medication</span>
            </button>
          </div>
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
              placeholder="Search by student name, notes, or nurse..."
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
              <option value="all">All Schedules</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Results Info */}
          <div className="text-sm text-gray-600">
            Showing {filteredSchedules.length} of {totalElements} schedules
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Schedules Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        {filteredSchedules.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== "all"
                ? "No matching schedules found"
                : "No Medication Schedules"}
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Create your first medication schedule to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scheduled Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Administered By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSchedules.map((schedule) => {
                  const scheduleDateTime = new Date(
                    `${schedule.scheduledDate}T${schedule.scheduledTime}`
                  );
                  const isUpcoming = scheduleDateTime > new Date();

                  return (
                    <tr key={schedule.scheduleId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">
                            {schedule.studentName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">
                            {formatDate(schedule.scheduledDate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">
                            {formatTime(schedule.scheduledTime)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600 text-sm">
                          {schedule.notes || "No notes"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900">
                          {schedule.administeredBy}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                            isUpcoming
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {isUpcoming ? "Upcoming" : "Completed"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewSchedule(schedule)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="View schedule details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditSchedule(schedule)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit schedule"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteSchedule(schedule.scheduleId)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete schedule"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

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
    </div>
  );
};

export default MedicationScheduleManagement;
