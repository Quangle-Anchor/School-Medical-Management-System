import axiosInstance from './axiosInstance';

const healthIncidentAPI = {
  // Get all health incidents
  getAllHealthIncidents: async () => {
    try {
      const response = await axiosInstance.get('/api/health-incidents');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get health incident by ID
  getHealthIncidentById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/health-incidents/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new health incident
  createHealthIncident: async (incidentData) => {
    try {
      const response = await axiosInstance.post('/api/health-incidents', incidentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update health incident
  updateHealthIncident: async (id, incidentData) => {
    try {
      const response = await axiosInstance.put(`/api/health-incidents/${id}`, incidentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete health incident
  deleteHealthIncident: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/health-incidents/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get health incidents by student ID
  getHealthIncidentsByStudent: async (studentId) => {
    try {
      const response = await axiosInstance.get(`/api/health-incidents?studentId=${studentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export { healthIncidentAPI };
