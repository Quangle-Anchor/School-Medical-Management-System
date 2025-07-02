import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { healthEventAPI } from '../api/healthEventApi';
import { formatEventDate, getCategoryStyle, safeDisplay } from '../utils/dashboardUtils';

const UpcomingHealthEventsCard = ({ 
  userRole = 'parent', 
  maxEvents = 4,
  onViewAll,
  className = ''
}) => {
  const [futureHealthEvents, setFutureHealthEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthEvents();
  }, [userRole]);

  const fetchHealthEvents = async () => {
    try {
      setLoading(true);
      let events = [];
      
      if (userRole === 'parent') {
        events = await healthEventAPI.getUpcomingEvents();
      } else {
        // For nurse, principal, admin - get future events
        events = await healthEventAPI.getFutureEvents();
      }
      
      setFutureHealthEvents(events || []);
    } catch (error) {
      console.error('Error fetching upcoming health events:', error);
      setFutureHealthEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getTitleByRole = () => {
    switch (userRole) {
      case 'parent':
        return {
          title: 'Upcoming Health Events',
          subtitle: 'Scheduled health events for your child'
        };
      case 'nurse':
        return {
          title: 'Upcoming Health Events',
          subtitle: 'Scheduled health events and medical appointments'
        };
      default:
        return {
          title: 'Upcoming Health Events',
          subtitle: 'Scheduled health events and medical appointments'
        };
    }
  };

  const texts = getTitleByRole();

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
        style={{
          background: 'radial-gradient(at center, #E8FEFF, #FFFFFF)'
        }}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{texts.title}</h3>
          <p className="text-sm text-gray-600">{texts.subtitle}</p>
        </div>
        <div className="text-center py-4">
          <div className="animate-pulse">Loading events...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      style={{
        background: 'radial-gradient(at center, #E8FEFF, #FFFFFF)'
      }}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{texts.title}</h3>
        <p className="text-sm text-gray-600">{texts.subtitle}</p>
      </div>
      <div className="space-y-4">
        {futureHealthEvents.length > 0 ? (
          futureHealthEvents.slice(0, maxEvents).map((event, index) => {
            const categoryStyle = getCategoryStyle(event.category);
            return (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-md hover:bg-white/20 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {safeDisplay(event.title || event.eventName)}
                  </p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text} mt-1`}>
                    {safeDisplay(event.category)}
                  </span>
                  <p className="text-xs text-gray-500">{formatEventDate(event.scheduleDate)}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No upcoming health events</p>
            <p className="text-xs text-gray-400">Health events will appear here when scheduled</p>
          </div>
        )}
        {futureHealthEvents.length > maxEvents && onViewAll && (
          <div className="text-center pt-2">
            <button 
              onClick={onViewAll}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
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
