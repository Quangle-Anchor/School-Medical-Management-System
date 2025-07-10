import axiosInstance from './axiosInstance';

// Student API functions
export const studentAPI = {
  // Authentication functions
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all students (admin/nurse/principal only)
  getAllStudents: async (page = 0, size = 10, sort = 'studentId,asc') => {
    try {
      const response = await axiosInstance.get(`/api/students?page=${page}&size=${size}&sort=${sort}`);
      console.log('getAllStudents response:', response.data);
      // Handle paginated response - return the Page object directly
      return response.data;
    } catch (error) {
      console.error('Error in getAllStudents:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      return { content: [], totalElements: 0, totalPages: 0 }; // Return empty page structure on error
    }
  },

  // Get current user's students (automatically filtered by role and parent)
  getMyStudents: async () => {
    try {
      const userRole = localStorage.getItem('role');
      
      if (userRole === 'Parent') {
        // Use the /my endpoint that automatically filters by authenticated parent
        const response = await axiosInstance.get('/api/students/my');
        console.log('getMyStudents (parent) response:', response.data);
        return Array.isArray(response.data) ? response.data : [];
      } else {
        // For other roles, get all students with pagination
        const response = await axiosInstance.get('/api/students?page=0&size=100');
        console.log('getMyStudents (other roles) response:', response.data);
        // Handle paginated response - extract content array
        return response.data.content || [];
      }
    } catch (error) {
      console.error('Error in getMyStudents:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      return []; // Return empty array on error
    }
  },
  
  // Get student by ID
  getStudentById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/students/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getStudentById:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  // Create new student (parent is automatically assigned by backend from JWT token)
  createStudent: async (studentData) => {
    try {
      const response = await axiosInstance.post('/api/students', studentData);
      return response.data;
    } catch (error) {
      console.error('Error in createStudent:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  // Update student (parent ownership is checked by backend)
  updateStudent: async (id, studentData) => {
    try {
      const response = await axiosInstance.put(`/api/students/${id}`, studentData);
      return response.data;
    } catch (error) {
      console.error('Error in updateStudent:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  // Delete student (parent ownership is checked by backend)
  deleteStudent: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/students/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in deleteStudent:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  // Create health info
  createHealthInfo: async (healthInfoData) => {
    try {
      console.log('Creating health info with data:', healthInfoData);
      const response = await axiosInstance.post('/api/health-info', healthInfoData);
      console.log('Health info creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in createHealthInfo:', error);
      console.error('Error response:', error.response?.data);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  // Update health info
  updateHealthInfo: async (id, healthInfoData) => {
    try {
      console.log(`Updating health info ${id} with data:`, healthInfoData);
      const response = await axiosInstance.put(`/api/health-info/${id}`, healthInfoData);
      console.log('Health info update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in updateHealthInfo:', error);
      console.error('Error response:', error.response?.data);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  // Get health info by student ID
  getHealthInfoByStudentId: async (studentId) => {
    try {
      console.log(`Fetching health info for student ${studentId}`);
      const response = await axiosInstance.get(`/api/health-info/student/${studentId}`);
      console.log('Health info fetch response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getHealthInfoByStudentId:', error);
      console.error('Error response:', error.response?.data);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  // Get all health info
  getAllHealthInfo: async () => {
    try {
      const response = await axiosInstance.get('/api/health-info');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error in getAllHealthInfo:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      return [];
    }
  },

  // Get all students for nurse (nurse-specific endpoint if available)
  getAllStudentsForNurse: async () => {
    try {
      // Use the general students endpoint with pagination
      const response = await axiosInstance.get('/api/students?page=0&size=100');
      console.log('getAllStudentsForNurse response:', response.data);
      return response.data.content || [];
    } catch (error) {
      console.error('Error in getAllStudentsForNurse:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      return []; // Return empty array on error
    }
  },
};

// Export default API object
export default {
  students: studentAPI,
};