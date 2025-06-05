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
  }
};

export default authApi;
