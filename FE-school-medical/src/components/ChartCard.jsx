import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { healthEventAPI } from '../api/healthEventApi';

const ChartCard = ({ userRole = 'parent', onCreateEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
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
          title: event.title || event.eventName,
          description: event.description,
          id: event.eventId
        });
      });
      
      setHealthEvents(eventsMap);
    } catch (error) {
      console.error('Error fetching health events for calendar:', error);
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
      'vaccination': 'bg-blue-100',
      'general checkup': 'bg-green-100', 
      'dental': 'bg-purple-100',
      'vision': 'bg-orange-100',
      'physical': 'bg-red-100',
      'mental health': 'bg-indigo-100',
      'checkup': 'bg-green-100',
      'treatment': 'bg-orange-100',
      'emergency': 'bg-red-100',
      'other': 'bg-gray-100',
      'default': 'bg-gray-100'
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
        <div key={`prev-${i}`} className="p-2 text-gray-400 text-sm">
          {prevMonthDay}
        </div>
      );
    }
    
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const events = getDateEvents(day);
      const hasEvents = events.length > 0;
      const todayClass = isToday(day) ? 'bg-blue-500 text-white' : '';
      const selectedClass = isSelected(day) ? 'ring-2 ring-blue-500' : '';
      const eventBackgroundClass = hasEvents && !isToday(day) ? getDateBackgroundColor(events) : '';
      
      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
          className={`p-2 text-sm cursor-pointer hover:bg-blue-50 rounded transition-colors relative ${todayClass} ${selectedClass} ${eventBackgroundClass}`}
        >
          <span className={`${hasEvents && !isToday(day) ? 'font-semibold text-gray-800' : ''}`}>
            {day}
          </span>
          {hasEvents && events.length > 1 && (
            <div className="absolute top-1 right-1">
              <span className="text-xs bg-gray-600 text-white rounded-full px-1">
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
    <div className="bg-white rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
    style={{
        background: 'radial-gradient(at center, #E8FEFF, #FFFFFF)'
      }}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Calendar</h3>
        <p className="text-sm text-muted-foreground">
          {userRole === 'parent' ? 'Health events and medical appointments calendar' :
           userRole === 'nurse' ? 'Health events and medical appointments calendar' :
           userRole === 'principal' ? 'Health events and medical appointments calendar' :
           'Health events and medical appointments calendar'}
        </p>
      </div>
      
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">
            {months[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
          >
            Today
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {generateCalendarDays()}
      </div>

      {/* Event Legend */}
      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span>Health Checkups</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span>Vaccinations</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
          <span>Treatments</span>
        </div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">
              Events for {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h4>
            {onCreateEvent && (
              <button
                onClick={() => onCreateEvent(selectedDate)}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <span className="mr-1">+</span>
                Add Event
              </button>
            )}
          </div>
          {getDateEvents(selectedDate.getDate()).length > 0 ? (
            <div className="space-y-1">
              {getDateEvents(selectedDate.getDate()).map((event, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    event.type === 'checkup' ? 'bg-green-500' :
                    event.type === 'vaccination' ? 'bg-blue-500' :
                    'bg-orange-500'
                  }`} />
                  <span className="text-sm">{event.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No events scheduled</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChartCard;