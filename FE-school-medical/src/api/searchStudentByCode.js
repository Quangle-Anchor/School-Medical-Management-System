// Search student by code (for Health Lookup)
import axiosInstance from './axiosInstance';

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
