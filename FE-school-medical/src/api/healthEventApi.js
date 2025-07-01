import axiosInstance from './axiosInstance';

// Health Event API functions
export const healthEventAPI = {
  // Get all health events
  getAllEvents: async () => {
    try {
      const response = await axiosInstance.get('/api/health-events');
      return response.data;
    } catch (error) {
      console.error('Error in getAllEvents:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      return [];
    }
  },

  // Get future health events (filter on frontend)
  getFutureEvents: async () => {
    try {
      const response = await axiosInstance.get('/api/health-events');
      const allEvents = response.data;
      
      // Filter for future events on the frontend
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      
      const futureEvents = allEvents.filter(event => {
        const eventDate = new Date(event.scheduleDate);
        return eventDate >= today;
      });
      
      // Sort by date
      futureEvents.sort((a, b) => new Date(a.scheduleDate) - new Date(b.scheduleDate));
      
      return futureEvents;
    } catch (error) {
      console.error('Error in getFutureEvents:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      return [];
    }
  },

  // Get future health events in a date range (filter on frontend)
  getFutureEventsInRange: async (startDate, endDate) => {
    try {
      const response = await axiosInstance.get('/api/health-events');
      const allEvents = response.data;
      
      // Filter events within the date range
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const eventsInRange = allEvents.filter(event => {
        const eventDate = new Date(event.scheduleDate);
        return eventDate >= start && eventDate <= end;
      });
      
      // Sort by date
      eventsInRange.sort((a, b) => new Date(a.scheduleDate) - new Date(b.scheduleDate));
      
      return eventsInRange;
    } catch (error) {
      console.error('Error in getFutureEventsInRange:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      return [];
    }
  },

  // Get health event by ID
  getEventById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/health-events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getEventById:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  // Create new health event
  createEvent: async (eventData) => {
    try {
      const response = await axiosInstance.post('/api/health-events', eventData);
      return response.data;
    } catch (error) {
      console.error('Error in createEvent:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  // Update health event
  updateEvent: async (id, eventData) => {
    try {
      const response = await axiosInstance.put(`/api/health-events/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error in updateEvent:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  // Delete health event
  deleteEvent: async (id) => {
    try {
      await axiosInstance.delete(`/api/health-events/${id}`);
      return true;
    } catch (error) {
      console.error('Error in deleteEvent:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  // Get events for calendar (next 30 days)
  getCalendarEvents: async () => {
    try {
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setDate(today.getDate() + 30);
      
      const startDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
      const endDate = nextMonth.toISOString().split('T')[0];
      
      return await healthEventAPI.getFutureEventsInRange(startDate, endDate);
    } catch (error) {
      console.error('Error in getCalendarEvents:', error);
      return [];
    }
  },

  // Get upcoming events (using backend endpoint)
  getUpcomingEvents: async () => {
    try {
      const response = await axiosInstance.get('/api/health-events/events/upcoming');
      return response.data;
    } catch (error) {
      console.error('Error in getUpcomingEvents:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      return [];
    }
  }
};
