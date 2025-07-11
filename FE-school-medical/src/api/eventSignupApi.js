import axiosInstance from './axiosInstance';

const eventSignupAPI = {
  // Create a new event signup
  createSignup: async (signupData) => {
    try {
      const response = await axiosInstance.post('/api/event-signups', signupData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get my signups (for current user)
  getMySignups: async () => {
    try {
      const response = await axiosInstance.get('/api/event-signups/my');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get signups for a specific event
  getSignupsByEvent: async (eventId) => {
    try {
      const response = await axiosInstance.get(`/api/event-signups/event/${eventId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update signup status
  updateStatus: async (signupId, status) => {
    try {
      const response = await axiosInstance.put(`/api/event-signups/${signupId}/status`, null, {
        params: { status }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export { eventSignupAPI };
