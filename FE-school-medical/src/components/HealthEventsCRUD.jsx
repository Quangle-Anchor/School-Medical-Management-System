import React, { useState, useEffect } from "react";
import { Calendar, Plus, Edit, Trash2, X } from "lucide-react";
import { healthEventAPI } from "../api/healthEventApi";
import {
  formatEventDate,
  getCategoryStyle,
  safeDisplay,
} from "../utils/dashboardUtils";
import {
  getMinScheduleDate,
  getMaxScheduleDate,
  validateScheduleDate,
  formatDateForInput,
} from "../utils/dateUtils";
import ChartCard from "./ChartCard";
import { useToast } from "../hooks/useToast";

const HealthEventsCRUD = ({ title, description }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [dateError, setDateError] = useState("");
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduleDate: "",
    category: "Checkup",
  });

  useEffect(() => {
    fetchEvents();

    // Refresh when the window regains focus
    const handleFocus = () => {
      fetchEvents();
    };

    window.addEventListener("focus", handleFocus);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await healthEventAPI.getAllEvents();
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate date input
    if (name === "scheduleDate") {
      const validation = validateScheduleDate(value);
      setDateError(validation.isValid ? "" : validation.error);
    }
  };

  const openCreateModal = (selectedDate = null) => {
    const defaultDate = selectedDate
      ? formatDateForInput(selectedDate)
      : getMinScheduleDate(); // Default to today

    setFormData({
      title: "",
      description: "",
      scheduleDate: defaultDate,
      category: "Checkup",
    });
    setIsEditing(false);
    setDateError("");
    setShowEventModal(true);
  };

  const openEditModal = (event) => {
    setFormData({
      title: event.title || event.eventName || "",
      description: event.description || "",
      scheduleDate: formatDateForInput(event.scheduleDate),
      category: event.category || "Checkup",
    });
    setCurrentEvent(event);
    setIsEditing(true);
    setDateError("");
    setShowEventModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate date before submission
    const dateValidation = validateScheduleDate(formData.scheduleDate);
    if (!dateValidation.isValid) {
      setDateError(dateValidation.error);
      return;
    }

    try {
      if (isEditing && currentEvent) {
        await healthEventAPI.updateEvent(currentEvent.eventId, formData);
      } else {
        await healthEventAPI.createEvent(formData);
      }
      setShowEventModal(false);
      setDateError("");
      fetchEvents();
      showSuccess(
        `Health event ${isEditing ? "updated" : "created"} successfully!`
      );
    } catch (error) {
      console.error("Error saving event:", error);
      showError("Failed to save the event. Please try again.");
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await healthEventAPI.deleteEvent(eventId);
      setConfirmDelete(null);
      fetchEvents();
      showSuccess("Health event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      showError("Failed to delete the event. Please try again.");
    }
  };

  // Get final title and description with defaults
  const finalTitle = title || "Health Events Management";
  const finalDescription =
    description || "Create, view, update, and delete health events";

  // Render event modal
  const renderEventModal = () => {
    if (!showEventModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {isEditing ? "Edit Health Event" : "Create Health Event"}
            </h2>
            <button
              onClick={() => setShowEventModal(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date *</label>
              <input
                type="date"
                name="scheduleDate"
                value={formData.scheduleDate}
                onChange={handleInputChange}
                min={getMinScheduleDate()}
                max={getMaxScheduleDate()}
                className={`w-full px-3 py-2 border rounded-md ${
                  dateError
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                required
              />
              {dateError && (
                <p className="mt-1 text-sm text-red-600">{dateError}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Select a date from today up to 5 years in the future
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="Checkup">Checkup</option>
                <option value="Vaccination">Vaccination</option>
                <option value="Emergency">Emergency</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowEventModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {isEditing ? "Update Event" : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Render delete confirmation modal
  const renderDeleteConfirmation = () => {
    if (!confirmDelete) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
          <p className="mb-6">
            Are you sure you want to delete this health event? This action
            cannot be undone.
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setConfirmDelete(null)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(confirmDelete)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{finalTitle}</h1>
          <p className="text-gray-600 mt-2">{finalDescription}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center py-4">Loading health events...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Overview */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Event Calendar Overview</h2>
          <p className="text-gray-600 text-sm mt-1">
            Monthly view of all scheduled health events
          </p>
        </div>
        <div className="p-6">
          <ChartCard onCreateEvent={openCreateModal} />
        </div>
      </div>

      {/* Health Events List with CRUD */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-6 flex justify-between items-center border-b">
          <div>
            <h2 className="text-xl font-semibold">Scheduled Health Events</h2>
            <p className="text-gray-600 text-sm mt-1">
              Manage all scheduled health events in the system
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Event
          </button>
        </div>

        <div className="divide-y">
          {events.length > 0 ? (
            events.map((event) => {
              const categoryStyle = getCategoryStyle(event.category);
              const eventDate = new Date(event.scheduleDate);
              const today = new Date();
              const isToday = eventDate.toDateString() === today.toDateString();
              const isPast = eventDate < today;

              let statusColor = isPast ? "green" : isToday ? "blue" : "yellow";
              let statusText = isPast
                ? "Completed"
                : isToday
                ? "Today"
                : "Upcoming";

              return (
                <div key={event.eventId} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">
                        {safeDisplay(event.title || event.eventName)}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {safeDisplay(event.description)}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}
                        >
                          {safeDisplay(event.category)}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {eventDate.toLocaleDateString()}
                        </span>

                        <span
                          className={`px-2 py-1 bg-${statusColor}-100 text-${statusColor}-800 text-xs rounded-full`}
                        >
                          {statusText}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditModal(event)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                        title="Edit event"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(event.eventId)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                        title="Delete event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-1">
                No health events scheduled
              </h3>
              <p className="text-gray-500">
                Create your first health event using the button above.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {renderEventModal()}
      {renderDeleteConfirmation()}
    </div>
  );
};

export default HealthEventsCRUD;
