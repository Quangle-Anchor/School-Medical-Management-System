import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  UserPlus,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Filter,
  X,
  Search,
} from "lucide-react";
import { healthEventAPI } from "../../api/healthEventApi";
import { eventSignupAPI } from "../../api/eventSignupApi";
import {
  formatEventDate,
  getCategoryStyle,
  safeDisplay,
} from "../../utils/dashboardUtils";
import {
  useConfirmation,
  getConfirmationConfig,
  handleBulkConfirmation,
} from "../../utils/confirmationUtils";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useToast } from "../../hooks/useToast";

const NurseHealthEventsView = ({ title, description }) => {
  const [healthEvents, setHealthEvents] = useState([]);
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [signupsLoading, setSignupsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("events"); // 'events' or 'signups'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showSignupDetails, setShowSignupDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'pending', 'confirmed', 'rejected'
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state

  // Toast hook
  const { showSuccess, showError } = useToast();

  // Confirmation hook for event signup confirmations
  const signupConfirmation = useConfirmation(
    async (signup) => {
      await eventSignupAPI.updateStatus(signup.signupId, "APPROVED");

      // Update the signup in the local state
      setSignups((prev) =>
        prev.map((s) =>
          s.signupId === signup.signupId ? { ...s, status: "APPROVED" } : s
        )
      );
    },
    showSuccess,
    showError
  );

  // Confirmation hook for rejection
  const rejectionConfirmation = useConfirmation(
    async (signup) => {
      await eventSignupAPI.updateStatus(signup.signupId, "REJECTED");

      // Update the signup in the local state
      setSignups((prev) =>
        prev.map((s) =>
          s.signupId === signup.signupId ? { ...s, status: "REJECTED" } : s
        )
      );
    },
    showSuccess,
    showError
  );

  useEffect(() => {
    fetchHealthEvents();
    if (activeTab === "signups") {
      fetchAllSignups();
    }

    // Refresh when the window regains focus
    const handleFocus = () => {
      fetchHealthEvents();
      if (activeTab === "signups") {
        fetchAllSignups();
      }
    };

    window.addEventListener("focus", handleFocus);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [activeTab]);

  const fetchHealthEvents = async () => {
    try {
      setLoading(true);
      const events = await healthEventAPI.getAllEvents();
      setHealthEvents(events || []);
    } catch (error) {
      console.error("Error fetching health events:", error);
      setHealthEvents([]);
      showError("Failed to load health events");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSignups = async () => {
    try {
      setSignupsLoading(true);
      // Get all events first, then fetch signups for each
      const events =
        healthEvents.length > 0
          ? healthEvents
          : await healthEventAPI.getAllEvents();
      const allSignups = [];

      for (const event of events) {
        try {
          const eventSignups = await eventSignupAPI.getSignupsByEvent(
            event.eventId
          );
          // Add event information to each signup
          const signupsWithEvent = eventSignups.map((signup) => ({
            ...signup,
            eventTitle: event.title || event.eventName,
            eventDate: event.scheduleDate,
            eventCategory: event.category,
            eventLocation: event.location,
          }));
          allSignups.push(...signupsWithEvent);
        } catch (error) {
          console.error(
            `Error fetching signups for event ${event.eventId}:`,
            error
          );
        }
      }

      setSignups(allSignups);
    } catch (error) {
      console.error("Error fetching signups:", error);
      showError("Failed to load event signups");
      setSignups([]);
    } finally {
      setSignupsLoading(false);
    }
  };

  const handleSignupStatusUpdate = async (signup, newStatus) => {
    if (newStatus === "APPROVED") {
      const config = getConfirmationConfig("event-signup", signup);
      await signupConfirmation.handleConfirm(signup, {
        getItemId: config.getItemId,
        getItemName: config.getItemName,
        successMessage: `Event signup confirmed successfully for ${
          signup.studentName || "student"
        }`,
        errorMessage: "Failed to confirm signup",
        invalidIdMessage: "Cannot confirm signup: Invalid signup ID",
      });
    } else if (newStatus === "REJECTED") {
      const config = getConfirmationConfig("event-signup-reject", signup);
      await rejectionConfirmation.handleConfirm(signup, {
        getItemId: config.getItemId,
        getItemName: config.getItemName,
        successMessage: `Event signup rejected for ${
          signup.studentName || "student"
        }`,
        errorMessage: "Failed to reject signup",
        invalidIdMessage: "Cannot reject signup: Invalid signup ID",
      });
    }
  };

  const handleConfirmSignupClick = (signup) => {
    signupConfirmation.handleConfirmClick(signup);
  };

  const handleRejectSignupClick = (signup) => {
    rejectionConfirmation.handleConfirmClick(signup);
  };

  const handleConfirmAllPending = async () => {
    // Get all pending signups (filtered by selected event if any)
    const pendingSignups = signups.filter((s) => {
      const isPending = s.status?.toUpperCase() === "PENDING";
      return selectedEvent
        ? s.eventId === selectedEvent.eventId && isPending
        : isPending;
    });

    if (pendingSignups.length === 0) {
      showError("No pending signups to confirm");
      return;
    }

    await handleBulkConfirmation(
      pendingSignups,
      async (signup) => {
        await eventSignupAPI.updateStatus(signup.signupId, "APPROVED");
        // Update local state
        setSignups((prev) =>
          prev.map((s) =>
            s.signupId === signup.signupId ? { ...s, status: "APPROVED" } : s
          )
        );
      },
      {
        confirmMessage: `Are you sure you want to confirm all ${
          pendingSignups.length
        } pending signup(s)${
          selectedEvent
            ? ` for ${selectedEvent.title || selectedEvent.eventName}`
            : ""
        }? This action cannot be undone.`,
        showSuccessToast: showSuccess,
        showErrorToast: showError,
      }
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            <X className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      case "PENDING":
      default:
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

  const filteredSignups = signups.filter((signup) => {
    // First filter by selected event if one is selected
    if (selectedEvent && signup.eventId !== selectedEvent.eventId) {
      return false;
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        (signup.studentName &&
          String(signup.studentName).toLowerCase().includes(searchLower)) ||
        (signup.studentCode &&
          String(signup.studentCode).toLowerCase().includes(searchLower)) ||
        (signup.studentId &&
          String(signup.studentId).toLowerCase().includes(searchLower)) ||
        (signup.eventTitle &&
          String(signup.eventTitle).toLowerCase().includes(searchLower)) ||
        (signup.parentName &&
          String(signup.parentName).toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;
    }

    // Then filter by status
    if (filterStatus === "all") return true;
    if (filterStatus === "confirmed") {
      return (
        signup.status?.toUpperCase() === "APPROVED" ||
        signup.status?.toUpperCase() === "CONFIRMED"
      );
    }
    return signup.status?.toUpperCase() === filterStatus.toUpperCase();
  });

  const pendingCount = signups.filter((s) => {
    const isPending = s.status?.toUpperCase() === "PENDING";
    return selectedEvent
      ? s.eventId === selectedEvent.eventId && isPending
      : isPending;
  }).length;
  const confirmedCount = signups.filter((s) => {
    const isConfirmed =
      s.status?.toUpperCase() === "APPROVED" ||
      s.status?.toUpperCase() === "CONFIRMED";
    return selectedEvent
      ? s.eventId === selectedEvent.eventId && isConfirmed
      : isConfirmed;
  }).length;
  const rejectedCount = signups.filter((s) => {
    const isRejected = s.status?.toUpperCase() === "REJECTED";
    return selectedEvent
      ? s.eventId === selectedEvent.eventId && isRejected
      : isRejected;
  }).length;

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Health Events Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage health events and event signups
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center py-4">Loading health events...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {title || "Health Events Management"}
        </h1>
        <p className="text-gray-600 mt-2">
          {description ||
            "Manage health events and review parent signup requests"}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("events")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "events"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Health Events
              <span className="ml-2 bg-blue-100 text-blue-800 py-1 px-2 rounded-full text-xs">
                {healthEvents.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("signups")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "signups"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Event Signups
              <span className="ml-2 bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full text-xs">
                {pendingCount}
              </span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "events" ? (
            /* Health Events List */
            <div>
              <div className="space-y-4">
                {healthEvents.length > 0 ? (
                  healthEvents.map((event, index) => {
                    const categoryStyle = getCategoryStyle(event.category);
                    const eventDate = new Date(event.scheduleDate);
                    const today = new Date();
                    const isToday =
                      eventDate.toDateString() === today.toDateString();
                    const isPast = eventDate < today;
                    const isFuture = eventDate > today;

                    let statusColor = "gray";
                    let statusText = "Scheduled";
                    if (isPast) {
                      statusColor = "green";
                      statusText = "Completed";
                    } else if (isToday) {
                      statusColor = "blue";
                      statusText = "Today";
                    } else if (isFuture) {
                      statusColor = "yellow";
                      statusText = "Upcoming";
                    }

                    return (
                      <div
                        key={event.eventId || index}
                        onClick={() => {
                          setSelectedEvent(event);
                          setActiveTab("signups");
                        }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="flex items-start justify-between">
                          {/* Left Content */}
                          <div className="flex-1 min-w-0 pr-6">
                            <div className="flex items-start space-x-3 mb-3">
                              <div className="flex-shrink-0">
                                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                  {safeDisplay(event.title || event.eventName)}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {safeDisplay(event.description)}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}
                              >
                                {safeDisplay(event.category)}
                              </span>

                              {event.location && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                  {safeDisplay(event.location)}
                                </div>
                              )}

                              {event.createdBy && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                  {safeDisplay(event.createdBy)}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right Content */}
                          <div className="flex flex-col items-end space-y-3 text-right">
                            <div>
                              <p className="text-lg font-bold text-gray-900">
                                {formatEventDate(event.scheduleDate)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {eventDate.toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>

                            <span
                              className={`px-3 py-1 bg-${statusColor}-100 text-${statusColor}-800 text-xs rounded-full font-medium`}
                            >
                              {statusText}
                            </span>

                            <div className="flex items-center text-xs text-blue-600 group-hover:text-blue-700 font-medium">
                              <Users className="w-4 h-4 mr-1" />
                              View Signups
                              <svg
                                className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No health events found
                    </h3>
                    <p className="text-gray-600">
                      Health events will appear here when they are created.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Event Signups Management */
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedEvent
                      ? `Signups for: ${
                          selectedEvent.title || selectedEvent.eventName
                        }`
                      : "Event Signups"}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedEvent
                      ? `Review signups for the ${
                          selectedEvent.title || selectedEvent.eventName
                        } event`
                      : "Review and manage parent signup requests"}
                  </p>
                  {selectedEvent && (
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      ← Back to all signups
                    </button>
                  )}
                </div>

                {/* Filter and Search Controls */}
                <div className="flex items-center space-x-3">
                  {/* Confirm All Pending Button */}
                  {pendingCount > 0 && (
                    <button
                      onClick={handleConfirmAllPending}
                      disabled={
                        signupsLoading ||
                        signupConfirmation.confirmingItems.size > 0
                      }
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {signupsLoading ||
                      signupConfirmation.confirmingItems.size > 0 ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Confirm All Pending ({pendingCount})
                    </button>
                  )}

                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <Filter className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>

                  <button
                    onClick={fetchAllSignups}
                    disabled={signupsLoading}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 transition-colors"
                  >
                    {signupsLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    ) : (
                      <Calendar className="w-4 h-4 mr-2" />
                    )}
                    Refresh
                  </button>
                </div>
              </div>

              {/* Search Box */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by student name, code, event title, or parent name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
                {searchTerm && (
                  <p className="mt-2 text-sm text-gray-600">
                    Showing {filteredSignups.length} result
                    {filteredSignups.length !== 1 ? "s" : ""} for "{searchTerm}"
                  </p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-yellow-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-yellow-800">
                        Pending
                        {selectedEvent
                          ? ` (${
                              selectedEvent.title || selectedEvent.eventName
                            })`
                          : ""}
                      </p>
                      <p className="text-2xl font-bold text-yellow-900">
                        {pendingCount}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Confirmed
                        {selectedEvent
                          ? ` (${
                              selectedEvent.title || selectedEvent.eventName
                            })`
                          : ""}
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        {confirmedCount}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <X className="h-8 w-8 text-red-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">
                        Rejected
                        {selectedEvent
                          ? ` (${
                              selectedEvent.title || selectedEvent.eventName
                            })`
                          : ""}
                      </p>
                      <p className="text-2xl font-bold text-red-900">
                        {rejectedCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signups Table */}
              {signupsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading signups...</p>
                </div>
              ) : filteredSignups.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event & Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event Date
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
                      {filteredSignups.map((signup) => (
                        <tr key={signup.signupId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {signup.eventTitle || "Unknown Event"}
                              </div>
                              <div className="text-sm text-gray-500">
                                Student: {signup.studentName || "Unknown"}
                              </div>
                              <div className="text-sm text-gray-500">
                                Code:{" "}
                                {signup.studentCode ||
                                  signup.studentId ||
                                  "N/A"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(signup.eventDate)}
                            </div>
                            {signup.eventLocation && (
                              <div className="text-sm text-gray-500">
                                📍 {signup.eventLocation}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(signup.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(signup.signupDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-3">
                              {(signup.status?.toUpperCase() === "PENDING" ||
                                !signup.status) && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleConfirmSignupClick(signup)
                                    }
                                    disabled={signupConfirmation.isConfirming(
                                      signup.signupId
                                    )}
                                    className="text-green-600 hover:text-green-900 inline-flex items-center disabled:opacity-50 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors border border-green-200"
                                  >
                                    {signupConfirmation.isConfirming(
                                      signup.signupId
                                    ) ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-1"></div>
                                    ) : (
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                    )}
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleRejectSignupClick(signup)
                                    }
                                    disabled={rejectionConfirmation.isConfirming(
                                      signup.signupId
                                    )}
                                    className="text-red-600 hover:text-red-900 inline-flex items-center disabled:opacity-50 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors border border-red-200"
                                  >
                                    {rejectionConfirmation.isConfirming(
                                      signup.signupId
                                    ) ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                                    ) : (
                                      <X className="h-4 w-4 mr-1" />
                                    )}
                                    Reject
                                  </button>
                                </>
                              )}

                              {(signup.status?.toUpperCase() === "APPROVED" ||
                                signup.status?.toUpperCase() ===
                                  "CONFIRMED") && (
                                <span className="text-green-600 inline-flex items-center bg-green-50 px-3 py-1 rounded-md border border-green-200">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Confirmed
                                </span>
                              )}

                              {signup.status?.toUpperCase() === "REJECTED" && (
                                <span className="text-red-600 inline-flex items-center bg-red-50 px-3 py-1 rounded-md border border-red-200">
                                  <X className="h-4 w-4 mr-1" />
                                  Rejected
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm
                      ? `No signups found for "${searchTerm}"`
                      : filterStatus === "all"
                      ? "No signups found"
                      : `No ${filterStatus} signups`}
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm
                      ? "Try adjusting your search terms or clear the search to see all signups."
                      : filterStatus === "all"
                      ? "Event signups will appear here when parents submit requests."
                      : filterStatus === "pending"
                      ? "No pending signups at this time."
                      : filterStatus === "confirmed"
                      ? "No confirmed signups at this time."
                      : "No rejected signups at this time."}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear Search
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Event Signup Confirmation Modal */}
      <ConfirmationModal
        show={signupConfirmation.showModal}
        onConfirm={(signup) => handleSignupStatusUpdate(signup, "APPROVED")}
        onCancel={signupConfirmation.cancelConfirm}
        item={signupConfirmation.itemToConfirm}
        config={{
          ...getConfirmationConfig(
            "event-signup",
            signupConfirmation.itemToConfirm || {}
          ),
          type: "event-signup",
        }}
        isConfirming={
          signupConfirmation.itemToConfirm
            ? signupConfirmation.isConfirming(
                signupConfirmation.itemToConfirm.signupId
              )
            : false
        }
      />

      {/* Event Signup Rejection Modal */}
      <ConfirmationModal
        show={rejectionConfirmation.showModal}
        onConfirm={(signup) => handleSignupStatusUpdate(signup, "REJECTED")}
        onCancel={rejectionConfirmation.cancelConfirm}
        item={rejectionConfirmation.itemToConfirm}
        config={{
          ...getConfirmationConfig(
            "event-signup-reject",
            rejectionConfirmation.itemToConfirm || {}
          ),
          type: "event-signup-reject",
        }}
        isConfirming={
          rejectionConfirmation.itemToConfirm
            ? rejectionConfirmation.isConfirming(
                rejectionConfirmation.itemToConfirm.signupId
              )
            : false
        }
      />
    </div>
  );
};

export default NurseHealthEventsView;
