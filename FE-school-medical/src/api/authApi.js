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
  },

  googleLogin: async (token) => {
    try {
      const response = await axiosInstance.post('/api/auth/google-login', { token });
      return response.data;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/api/users/me');
      return response.data;
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  },

  validateToken: async () => {
    try {
      const response = await axiosInstance.get('/api/auth/validate-token');
      return response.status === 200;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
    },

  updateProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put('/api/users/me', profileData);
      return response.data;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await axiosInstance.put('/api/users/me/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  },

  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await axiosInstance.post('/api/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Upload avatar error:", error);
      throw error;
    }
  }
};

export default authApi;
