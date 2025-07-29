import React, { useState, useEffect } from "react";
import { Calendar, UserPlus, Users } from "lucide-react";
import { healthEventAPI } from "../api/healthEventApi";
import {
  formatEventDate,
  getCategoryStyle,
  safeDisplay,
} from "../utils/dashboardUtils";
import EventSignupForm from "./EventSignupForm";
import { useToast } from "../hooks/useToast";

const HealthEventsView = ({ userRole = "parent", title, description }) => {
  const [healthEvents, setHealthEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [signupFormOpen, setSignupFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { showError } = useToast();

  useEffect(() => {
    fetchHealthEvents();

    // Refresh when the window regains focus
    const handleFocus = () => {
      fetchHealthEvents();
    };

    window.addEventListener("focus", handleFocus);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [userRole]);

  const fetchHealthEvents = async () => {
    try {
      setLoading(true);
      let events = [];

      if (userRole === "parent") {
        events = await healthEventAPI.getUpcomingEvents();
      } else {
        events = await healthEventAPI.getAllEvents();
      }

      setHealthEvents(events || []);
    } catch (error) {
      showError("Failed to load health events. Please try again.");
      setHealthEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupAllClick = (event) => {
    setSelectedEvent(event);
    setSignupFormOpen(true);
  };

  const handleSignupSuccess = () => {
    // Optionally refresh events or show success message
    fetchHealthEvents();
  };

  const handleCloseSignupForm = () => {
    setSignupFormOpen(false);
    setSelectedEvent(null);
  };

  const getDefaultTexts = () => {
    switch (userRole) {
      case "parent":
        return {
          title: "Health Events",
          description:
            "View upcoming health events and appointments for your children",
          subtitle: "Upcoming Health Events",
          subtitleDesc: "Scheduled health events for your children",
          emptyTitle: "No upcoming health events",
          emptyDesc:
            "Health events will appear here when they are scheduled by healthcare staff.",
        };
      case "nurse":
        return {
          title: "Health Events",
          description:
            "View and manage all health events and appointments (past and upcoming)",
          subtitle: "All Health Events",
          subtitleDesc:
            "Manage all health events and appointments - past and upcoming",
          emptyTitle: "No health events found",
          emptyDesc: "Health events will appear here when they are created.",
        };
      default:
        return {
          title: "Health Events",
          description: "View all scheduled health events and appointments",
          subtitle: "Scheduled Health Events",
          subtitleDesc: "All scheduled health events in the system",
          emptyTitle: "No health events scheduled",
          emptyDesc: "Health events will appear here when they are created.",
        };
    }
  };

  const texts = getDefaultTexts();
  const finalTitle = title || texts.title;
  const finalDescription = description || texts.description;

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
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
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{finalTitle}</h1>
            <p className="text-gray-600 mt-2">{finalDescription}</p>
          </div>
        </div>
      </div>

      {/* Health Events List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {texts.subtitle}
          </h2>
          <p className="text-sm text-gray-600 mt-1">{texts.subtitleDesc}</p>
        </div>

        <div className="divide-y divide-gray-200">
          {healthEvents.length > 0 ? (
            healthEvents.map((event, index) => {
              const categoryStyle = getCategoryStyle(event.category);
              const eventDate = new Date(event.scheduleDate);
              const today = new Date();
              const isToday = eventDate.toDateString() === today.toDateString();
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
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {safeDisplay(event.title || event.eventName)}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {safeDisplay(event.description)}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}
                            >
                              {safeDisplay(event.category)}
                            </span>
                            {event.createdBy && (
                              <span className="text-sm text-gray-500">
                                Created by {safeDisplay(event.createdBy)}
                              </span>
                            )}
                            {event.location && (
                              <span className="text-sm text-gray-500">
                                Location: {safeDisplay(event.location)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end space-y-2">
                          <div>
                            <p className="text-lg font-semibold text-gray-900">
                              {formatEventDate(event.scheduleDate)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {eventDate.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span
                              className={`px-2 py-1 bg-${statusColor}-100 text-${statusColor}-800 text-xs rounded-full font-medium`}
                            >
                              {statusText}
                            </span>
                            {userRole === "parent" && !isPast && (
                              <div className="flex flex-col space-y-1">
                                <button
                                  onClick={() => handleSignupAllClick(event)}
                                  className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors"
                                >
                                  <Users className="w-3 h-3 mr-1" />
                                  Sign Up All Children
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {texts.emptyTitle}
              </h3>
              <p className="text-gray-600">{texts.emptyDesc}</p>
            </div>
          )}
        </div>
      </div>

      {/* Event Signup Modal */}
      <EventSignupForm
        isOpen={signupFormOpen}
        onClose={handleCloseSignupForm}
        event={selectedEvent}
        onSignupSuccess={handleSignupSuccess}
        signupAllMode={true}
      />
    </div>
  );
};

export default HealthEventsView;
