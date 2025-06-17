const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to check if user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token !== null && token !== undefined && token !== '';
};

// Helper function to handle authentication errors
const handleAuthError = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  window.location.href = '/login';
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  // Check if user is authenticated for protected endpoints
  if (!isAuthenticated() && !endpoint.includes('/auth/')) {
    handleAuthError();
    throw new Error('Authentication required. Please login first.');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle unauthorized responses
    if (response.status === 401) {
      // Token is invalid or expired
      handleAuthError();
      throw new Error('Authentication required. Please login again.');
    }
    
    // Handle forbidden responses
    if (response.status === 403) {
      throw new Error('Access forbidden. You do not have permission to perform this action.');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Handle empty responses (like DELETE requests)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Student API functions
export const studentAPI = {
  // Authentication functions
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  // Get all students
  getAllStudents: () => apiRequest('/students'),
  
  // Get student by ID
  getStudentById: (id) => apiRequest(`/students/${id}`),
  
  // Create new student
  createStudent: (studentData) => apiRequest('/students', {
    method: 'POST',
    body: JSON.stringify(studentData),
  }),
  
  // Update student
  updateStudent: (id, studentData) => apiRequest(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(studentData),
  }),
    // Delete student
  deleteStudent: (id) => apiRequest(`/students/${id}`, {
    method: 'DELETE',
  }),  // Create health info
  createHealthInfo: (healthInfoData) => apiRequest('/health-info', {
    method: 'POST',
    body: JSON.stringify(healthInfoData),
  }),

  // Update health info
  updateHealthInfo: (id, healthInfoData) => apiRequest(`/health-info/${id}`, {
    method: 'PUT',
    body: JSON.stringify(healthInfoData),
  }),

  // Get health info by student ID
  getHealthInfoByStudentId: (studentId) => apiRequest(`/health-info/student/${studentId}`),

  // Get all health info
  getAllHealthInfo: () => apiRequest('/health-info'),
};

// Export default API object
export default {
  students: studentAPI,
};