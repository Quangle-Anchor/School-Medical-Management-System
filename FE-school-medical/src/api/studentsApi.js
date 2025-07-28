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
        const response = await axiosInstance.get('/api/students/my');
        console.log('getMyStudents (parent) response:', response.data);
        return Array.isArray(response.data) ? response.data : [];
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

  // Get only confirmed students for current parent
  getMyConfirmedStudents: async () => {
    try {
      const response = await axiosInstance.get('/api/students/my');
      console.log('getMyConfirmedStudents response:', response.data);
      const allStudents = Array.isArray(response.data) ? response.data : [];
      // Filter only confirmed students
      return allStudents.filter(student => student.isConfirm === true);
    } catch (error) {
      console.error('Error in getMyConfirmedStudents:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      return []; // Return empty array on error
    }
  },

  // Confirm a student (for nurses/admins)
  confirmStudent: async (studentId) => {
    try {
      const response = await axiosInstance.put(`/api/students/${studentId}/confirm`);
      return response.data;
    } catch (error) {
      console.error('Error in confirmStudent:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw error;
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
      const response = await axiosInstance.post('/api/health-info', healthInfoData);
      return response.data;
    } catch (error) {
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
  getAllStudentsForNurse: async (page = 0, size = 20, sort = 'studentId,asc') => {
    try {
      // Use the general students endpoint with pagination
      const response = await axiosInstance.get(`/api/students?page=${page}&size=${size}&sort=${sort}`);
      console.log('getAllStudentsForNurse response:', response.data);
      return response.data; // Return the full page object
    } catch (error) {
      console.error('Error in getAllStudentsForNurse:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      return { content: [], totalElements: 0, totalPages: 0 }; // Return empty page structure on error
    }
  },

  // Get only confirmed students for health incidents and other operations
  getConfirmedStudents: async () => {
    try {
      const role = localStorage.getItem('role');
      
      if (role === 'Parent') {
        // For parents, use the existing getMyConfirmedStudents
        return await studentAPI.getMyConfirmedStudents();
      } else {
        // For nurses/admins, get all students and filter confirmed ones
        const response = await axiosInstance.get('/api/students?page=0&size=1000&sort=studentId,asc');
        console.log('getConfirmedStudents response:', response.data);
        
        const allStudents = response.data?.content || [];
        // Filter only confirmed students
        return allStudents.filter(student => student.isConfirm === true);
      }
    } catch (error) {
      console.error('Error in getConfirmedStudents:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      return []; // Return empty array on error
    }
  },
};

// Search student by code (for Health Lookup)
export const searchStudentByCode = async (studentCode) => {
  try {
    const response = await axiosInstance.get(`/api/students/code/${studentCode}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Student not found');
    }
    throw error;
  }
};

// Export default API object
export default {
  students: studentAPI,
  searchStudentByCode,
};