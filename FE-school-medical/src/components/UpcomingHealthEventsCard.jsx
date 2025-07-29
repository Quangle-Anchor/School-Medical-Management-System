import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { healthEventAPI } from "../api/healthEventApi";
import {
  formatEventDate,
  getCategoryStyle,
  safeDisplay,
} from "../utils/dashboardUtils";

const UpcomingHealthEventsCard = ({
  userRole = "parent",
  maxEvents = 4,
  onViewAll,
  className = "",
}) => {
  const [futureHealthEvents, setFutureHealthEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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
      events = await healthEventAPI.getFutureEvents();
      setFutureHealthEvents(events || []);
    } catch (error) {
      console.error("Error fetching health events:", error);
      setFutureHealthEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getTitleByRole = () => {
    switch (userRole) {
      case "parent":
        return {
          title: "Upcoming Health Events",
          subtitle: "Scheduled health events for your child",
        };
      case "nurse":
        return {
          title: "Upcoming Health Events",
          subtitle: "Scheduled health events and medical appointments",
        };
      case "principal":
        return {
          title: "Upcoming Health Events",
          subtitle: "Scheduled health events for the school",
        };
      case "admin":
        return {
          title: "Upcoming Health Events",
          subtitle:
            "Scheduled health events for the school and administrative purposes",
        };
    }
  };

  const texts = getTitleByRole();

  if (loading) {
    return (
      <div className={`bg-white shadow-md rounded-xl ${className}`}>
        <div className="p-6 border-b border-slate-100">
          <h6 className="text-base font-semibold text-slate-700">
            {texts.title}
          </h6>
          <p className="mt-1 text-sm text-slate-400">{texts.subtitle}</p>
        </div>
        <div className="p-6 text-center">
          <div className="animate-pulse text-slate-400">Loading events...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white shadow-md rounded-xl transition-all duration-200 ${className}`}
    >
      <div className="p-6 border-b border-slate-100">
        <h6 className="text-base font-semibold text-slate-700">
          {texts.title}
        </h6>
        <p className="mt-1 text-sm text-slate-400">{texts.subtitle}</p>
      </div>
      <div className="p-6">
        {futureHealthEvents.length > 0 ? (
          <div className="space-y-4">
            {futureHealthEvents.slice(0, maxEvents).map((event, index) => {
              const categoryStyle = getCategoryStyle(event.category);
              return (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="flex items-center justify-center w-8 h-8 text-center bg-sky-500 shadow-sm rounded-xl">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h6 className="mb-1 text-sm font-semibold leading-normal text-slate-700">
                      {safeDisplay(event.title || event.eventName)}
                    </h6>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text} mb-1`}
                    >
                      {safeDisplay(event.category)}
                    </span>
                    <p className="mb-0 text-xs leading-tight text-slate-400">
                      {formatEventDate(event.scheduleDate)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-center bg-gray-500 shadow-sm rounded-xl">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm text-slate-400 mb-1">
              No upcoming health events
            </p>
            <p className="text-xs text-slate-300">
              Health events will appear here when scheduled
            </p>
          </div>
        )}
        {futureHealthEvents.length > maxEvents && onViewAll && (
          <div className="text-center pt-4 border-t border-gray-100">
            <button
              onClick={onViewAll}
              className="inline-block px-6 py-2 mb-0 text-xs font-bold text-center uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-sm bg-sky-500 leading-pro text-white ease-soft-in tracking-tight-soft shadow-sm"
            >
              View all {futureHealthEvents.length} events →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingHealthEventsCard;
