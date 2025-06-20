import axiosInstance from './axiosInstance';

const authApi = {
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  signup: async (signupData) => {
    try {
      const response = await axiosInstance.post('/api/auth/signup', signupData);
      return response.data;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }
};

export default authApi;
