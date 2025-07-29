import React, { useState, useEffect } from "react";
import { medicationScheduleAPI } from "../../api/medicationScheduleApi";
import {
  Calendar,
  Clock,
  User,
  Pill,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const ParentMedicationSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSchedules();

    // Set up automatic refresh every 30 seconds for parent medication schedules
    // This ensures schedules are updated when nurses create/modify them
    const refreshInterval = setInterval(() => {
      fetchSchedules();
    }, 30000);

    // Also refresh when the window regains focus
    const handleFocus = () => {
      fetchSchedules();
    };

    window.addEventListener("focus", handleFocus);

    // Cleanup interval and event listener on component unmount
    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const fetchSchedules = async () => {
    try {
      const data = await medicationScheduleAPI.getSchedulesForMyStudents();
      setSchedules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setError("Failed to fetch medication schedules");
      setSchedules([]);
    } finally {
      setLoading(false);
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

  const isUpcoming = (dateString, timeString) => {
    const scheduleDateTime = new Date(`${dateString}T${timeString}`);
    return scheduleDateTime > new Date();
  };

  const groupSchedulesByStudent = (schedules) => {
    return schedules.reduce((groups, schedule) => {
      const studentName = schedule.studentName;
      if (!groups[studentName]) {
        groups[studentName] = [];
      }
      groups[studentName].push(schedule);
      return groups;
    }, {});
  };

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

  const groupedSchedules = groupSchedulesByStudent(schedules);

  return (
    <div className="bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          My Children's Medication Schedules
        </h1>
        <p className="text-gray-600 mt-2">
          View scheduled medication administration for your children
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Schedules by Student */}
      {Object.keys(groupedSchedules).length === 0 ? (
        <div className="bg-white shadow-md rounded-xl p-4 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Medication Schedules
          </h3>
          <p className="text-gray-600">
            No medication schedules found for your children.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSchedules).map(
            ([studentName, studentSchedules]) => (
              <div
                key={studentName}
                className="bg-white shadow-md rounded-xl p-4"
              >
                {/* Student Header */}
                <div className="px-2 py-2 border-b bg-gray-50 -mx-4 mb-4">
                  <div className="flex items-center px-4">
                    <User className="w-5 h-5 text-gray-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      {studentName}
                    </h2>
                    <span className="ml-2 text-sm text-gray-500">
                      ({studentSchedules.length} schedule
                      {studentSchedules.length !== 1 ? "s" : ""})
                    </span>
                  </div>
                </div>

                {/* Schedules List */}
                <div className="">
                  <div className="grid gap-4">
                    {studentSchedules
                      .sort(
                        (a, b) =>
                          new Date(`${a.scheduledDate}T${a.scheduledTime}`) -
                          new Date(`${b.scheduledDate}T${b.scheduledTime}`)
                      )
                      .map((schedule) => {
                        const upcoming = isUpcoming(
                          schedule.scheduledDate,
                          schedule.scheduledTime
                        );
                        return (
                          <div
                            key={schedule.scheduleId}
                            className={`bg-white shadow-md rounded-xl p-4 ${
                              upcoming ? "border-blue-200 border-2" : ""
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <Pill className="w-4 h-4 text-gray-500 mr-2" />
                                  <span className="font-medium text-gray-900">
                                    Medication Administration
                                  </span>
                                  {upcoming && (
                                    <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                      Upcoming
                                    </span>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-gray-700">
                                      {formatDate(schedule.scheduledDate)}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-gray-700">
                                      {formatTime(schedule.scheduledTime)}
                                    </span>
                                  </div>
                                </div>

                                {schedule.notes && (
                                  <div className="mb-3">
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">
                                        Notes:
                                      </span>{" "}
                                      {schedule.notes}
                                    </p>
                                  </div>
                                )}

                                <div className="flex items-center text-sm text-gray-500">
                                  <span>
                                    Administered by: {schedule.administeredBy}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Summary Section */}
      {Object.keys(groupedSchedules).length > 0 && (
        <div className="mt-8 bg-white shadow-md rounded-xl p-4">
          <div className="flex items-center mb-4">
            <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-blue-900">
              Schedule Summary
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {schedules.length}
              </div>
              <div className="text-sm text-blue-700">Total Schedules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {
                  schedules.filter((s) =>
                    isUpcoming(s.scheduledDate, s.scheduledTime)
                  ).length
                }
              </div>
              <div className="text-sm text-blue-700">Upcoming</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {Object.keys(groupedSchedules).length}
              </div>
              <div className="text-sm text-blue-700">Children</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentMedicationSchedules;
