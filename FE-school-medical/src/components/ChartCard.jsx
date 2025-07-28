import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { healthEventAPI } from '../api/healthEventApi';

const ChartCard = ({ userRole = 'parent', onCreateEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(() => {
    // Initialize selectedDate to today to avoid selecting past dates by default
    const today = new Date();
    return today;
  });
  const [healthEvents, setHealthEvents] = useState({});
  const [loading, setLoading] = useState(true);

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get first day of the month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Fetch health events when component mounts or month changes
  useEffect(() => {
    fetchHealthEvents();
  }, [currentMonth, currentYear, userRole]);

  const fetchHealthEvents = async () => {
    try {
      setLoading(true);
      // Get events for the current month
      const startDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
      const endDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;
      
      // Use appropriate API method based on user role
      let events = [];
      if (userRole === 'parent') {
        events = await healthEventAPI.getFutureEventsInRange(startDate, endDate);
      } else {
        // For nurse, principal, admin - get all events
        events = await healthEventAPI.getAllEventsInRange(startDate, endDate);
      }
      
      // Convert events array to date-keyed object for easy lookup
      const eventsMap = {};
      events.forEach(event => {
        const dateKey = event.scheduleDate; // Already in YYYY-MM-DD format
        if (!eventsMap[dateKey]) {
          eventsMap[dateKey] = [];
        }
        eventsMap[dateKey].push({
          type: event.category?.toLowerCase() || 'checkup',
          title: event.title || event.eventName || 'Health Event',
          id: event.id
        });
      });
      
      setHealthEvents(eventsMap);
    } catch (error) {
      console.error('Error fetching health events:', error);
      setHealthEvents({});
    } finally {
      setLoading(false);
    }
  };
  
  // Days of the week
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Navigate months
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // Check if date has events
  const getDateEvents = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return healthEvents[dateStr] || [];
  };

  // Get background color for date with events
  const getDateBackgroundColor = (events) => {
    if (events.length === 0) return '';
    
    // Get the primary event type for coloring
    const primaryEvent = events[0];
    const colors = {
      'vaccination': 'bg-blue-50 border border-blue-200',
      'general checkup': 'bg-green-50 border border-green-200', 
      'dental': 'bg-sky-50 border border-sky-200',
      'vision': 'bg-orange-50 border border-orange-200',
      'physical': 'bg-red-50 border border-red-200',
      'mental health': 'bg-indigo-50 border border-indigo-200',
      'checkup': 'bg-green-50 border border-green-200',
      'treatment': 'bg-orange-50 border border-orange-200',
      'emergency': 'bg-red-50 border border-red-200',
      'other': 'bg-gray-50 border border-gray-200',
      'default': 'bg-gray-50 border border-gray-200'
    };
    return colors[primaryEvent.type] || colors.default;
  };

  // Check if date is today
  const isToday = (day) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === currentMonth && 
           today.getFullYear() === currentYear;
  };

  // Check if date is in the past
  const isPastDate = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    const checkDate = new Date(currentYear, currentMonth, day);
    return checkDate < today;
  };

  // Check if date is selected
  const isSelected = (day) => {
    return selectedDate.getDate() === day &&
           selectedDate.getMonth() === currentMonth &&
           selectedDate.getFullYear() === currentYear;
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      const prevMonthDay = new Date(currentYear, currentMonth, -firstDayWeekday + i + 1).getDate();
      days.push(
        <div key={`prev-${i}`} className="p-2 text-slate-300 text-sm text-center">
          {prevMonthDay}
        </div>
      );
    }
    
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const events = getDateEvents(day);
      const hasEvents = events.length > 0;
      const isPast = isPastDate(day);
      const todayClass = isToday(day) ? 'bg-sky-500 text-white shadow-sm' : '';
      const selectedClass = isSelected(day) ? 'ring-2 ring-sky-400' : '';
      const eventBackgroundClass = hasEvents && !isToday(day) ? getDateBackgroundColor(events) : '';
      const pastDateClass = isPast ? 'text-slate-300 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50';
      
      days.push(
        <div
          key={day}
          onClick={() => !isPast && setSelectedDate(new Date(currentYear, currentMonth, day))}
          className={`p-2 text-sm rounded-lg transition-all duration-200 relative text-center ${todayClass} ${selectedClass} ${eventBackgroundClass} ${pastDateClass}`}
        >
          <span className={`${hasEvents && !isToday(day) && !isPast ? 'font-semibold text-slate-700' : isPast ? 'text-slate-300' : 'text-slate-700'}`}>
            {day}
          </span>
          {hasEvents && events.length > 1 && !isPast && (
            <div className="absolute -top-1 -right-1">
              <span className="text-xs bg-gradient-to-tl from-slate-600 to-slate-400 text-white rounded-full px-1 shadow-sm">
                {events.length}
              </span>
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white shadow-md rounded-2xl bg-clip-border">
      <div className="p-6 pb-2 mb-2 bg-white border-b border-slate-100 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <h6 className="mb-0 text-base font-semibold text-slate-700">Calendar</h6>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          {userRole === 'parent' ? 'Health events and medical appointments calendar' :
           userRole === 'nurse' ? 'Health events and medical appointments calendar' :
           userRole === 'principal' ? 'Health events and medical appointments calendar' :
           'Health events and medical appointments calendar'}
        </p>
      </div>
      
      <div className="flex-auto pb-0">
        <div className="p-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-slate-700">
                {months[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="inline-block px-4 py-2 mb-0 text-xs font-bold text-center text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-sm bg-sky-500 leading-pro ease-soft-in tracking-tight-soft shadow-sm"
              >
                Today
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="inline-block p-2 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="inline-block p-2 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-slate-400">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {generateCalendarDays()}
          </div>

          {/* Event Legend */}
          <div className="flex justify-center space-x-6 text-sm mb-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gradient-to-tl from-green-600 to-lime-400 rounded-full mr-2"></div>
              <span className="text-slate-700">Health Checkups</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gradient-to-tl from-blue-600 to-cyan-400 rounded-full mr-2"></div>
              <span className="text-slate-700">Vaccinations</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gradient-to-tl from-orange-500 to-yellow-400 rounded-full mr-2"></div>
              <span className="text-slate-700">Treatments</span>
            </div>
          </div>

          {/* Selected Date Events */}
          {selectedDate && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h6 className="font-semibold text-slate-700">
                  Events for {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h6>
                {onCreateEvent && (
                  <button
                    onClick={() => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const selected = new Date(selectedDate);
                      selected.setHours(0, 0, 0, 0);
                      
                      if (selected >= today) {
                        onCreateEvent(selectedDate);
                      }
                    }}
                    disabled={(() => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const selected = new Date(selectedDate);
                      selected.setHours(0, 0, 0, 0);
                      return selected < today;
                    })()}
                    className={`px-3 py-1 text-sm font-semibold rounded-lg transition ${
                      (() => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const selected = new Date(selectedDate);
                        selected.setHours(0, 0, 0, 0);
                        return selected < today;
                      })()
                        ? 'text-gray-400 bg-gray-200 cursor-not-allowed' 
                        : 'text-white bg-sky-500 hover:bg-sky-600'
                    }`}
                  >
                    <span className="mr-1">+</span>
                    Add Event
                  </button>
                )}
              </div>
              {(() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const selected = new Date(selectedDate);
                selected.setHours(0, 0, 0, 0);
                const isPastSelected = selected < today;
                
                if (isPastSelected) {
                  return (
                    <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-700">
                        ⚠️ Cannot create events for past dates. Please select today or a future date.
                      </p>
                    </div>
                  );
                }
                return null;
              })()}
              {getDateEvents(selectedDate.getDate()).length > 0 ? (
                <div className="space-y-2">
                  {getDateEvents(selectedDate.getDate()).map((event, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        event.type === 'checkup' ? 'bg-gradient-to-tl from-green-600 to-lime-400' :
                        event.type === 'vaccination' ? 'bg-gradient-to-tl from-blue-600 to-cyan-400' :
                        'bg-gradient-to-tl from-orange-500 to-yellow-400'
                      }`} />
                      <span className="text-sm text-slate-700">{event.title}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No events scheduled</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartCard;