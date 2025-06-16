import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Sample health events data
const healthEvents = {
  '2025-06-05': [{ type: 'checkup', title: 'Annual Health Checkup' }],
  '2025-06-12': [{ type: 'vaccination', title: 'COVID-19 Booster' }],
  '2025-06-18': [{ type: 'treatment', title: 'Dental Cleaning' }],
  '2025-06-25': [{ type: 'checkup', title: 'Eye Examination' }],
  '2025-06-28': [{ type: 'vaccination', title: 'Flu Shot' }],
  '2025-07-03': [{ type: 'checkup', title: 'Regular Checkup' }],
  '2025-07-15': [{ type: 'treatment', title: 'Physical Therapy' }],
};

const ChartCard = ({ userRole = 'doctor' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const isParentView = userRole === 'parent';

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get first day of the month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  
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
      
      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
          className={`p-2 text-sm cursor-pointer hover:bg-blue-50 rounded transition-colors relative ${todayClass} ${selectedClass}`}
        >
          <span className={`${hasEvents && !isToday(day) ? 'font-semibold text-blue-600' : ''}`}>
            {day}
          </span>
          {hasEvents && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {events.map((event, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full ${
                    event.type === 'checkup' ? 'bg-green-500' :
                    event.type === 'vaccination' ? 'bg-blue-500' :
                    'bg-orange-500'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  // If not parent view, show original chart (simplified version)
  if (!isParentView) {
    return (
      <div className="rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
        style={{
          background: `linear-gradient(
            45deg,
            rgba(142,197,252,1)   0%,
            rgba(141,211,255,1)  25%,
            rgba(161,216,255,1)  50%,
            rgba(193,210,255,1)  75%,
            rgba(224,195,255,1) 100%
          )`
        }}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Patient Visits</h3>
          <p className="text-sm text-muted-foreground">Monthly patient visits for this year</p>
        </div>
        <div className="h-80 flex items-center justify-center text-white">
          <p>Chart view for medical staff</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
    style={{
          background: `linear-gradient(
            45deg,
            rgba(142,197,252,1)   0%,
            rgba(141,211,255,1)  25%,
            rgba(161,216,255,1)  50%,
            rgba(193,210,255,1)  75%,
            rgba(224,195,255,1) 100%
          )`
        }}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Calendar</h3>
        <p className="text-sm text-muted-foreground">
          Health checkups and medical events for your child
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
          <h4 className="font-medium mb-2">
            Events for {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h4>
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