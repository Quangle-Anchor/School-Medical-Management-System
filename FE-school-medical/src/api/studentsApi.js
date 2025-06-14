const API_BASE_URL = 'http://localhost:8080/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
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
  }),
};

// Export default API object
export default {
  students: studentAPI,
};