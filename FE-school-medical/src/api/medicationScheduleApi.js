import axiosInstance from './axiosInstance';

const medicationScheduleAPI = {
  // Get all schedules for nurse
  getAllSchedulesForNurse: async () => {
    try {
      const response = await axiosInstance.get('/api/schedules/nurse/all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get schedules for parent's students
  getSchedulesForMyStudents: async () => {
    try {
      const response = await axiosInstance.get('/api/schedules/my-students');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new medication schedule
  createSchedule: async (scheduleData) => {
    try {
      const response = await axiosInstance.post('/api/schedules', scheduleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new medication schedule with inventory export
  createScheduleWithInventory: async (payload) => {
    try {
      const response = await axiosInstance.post('/api/schedules/with-inventory', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update medication schedule
  updateSchedule: async (id, scheduleData) => {
    try {
      const response = await axiosInstance.put(`/api/schedules/${id}`, scheduleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete medication schedule
  deleteSchedule: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/schedules/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get medication schedule by ID
  getScheduleById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/schedules/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export { medicationScheduleAPI };
