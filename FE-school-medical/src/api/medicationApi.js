import axiosInstance from './axiosInstance';

const medicationAPI = {
  // Get my medication requests (for parents)
  getMyMedicationRequests: async () => {
    try {
      const response = await axiosInstance.get('/api/medications/my');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new medication request
  createMedicationRequest: async (medicationData, prescriptionFile) => {
    try {
      const formData = new FormData();
      formData.append('medicationRequest', JSON.stringify(medicationData));
      
      if (prescriptionFile) {
        formData.append('prescriptionFile', prescriptionFile);
      }

      const response = await axiosInstance.post('/api/medications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update medication request
  updateMedicationRequest: async (id, medicationData, prescriptionFile) => {
    try {
      const formData = new FormData();
      formData.append('medicationRequest', JSON.stringify(medicationData));
      
      if (prescriptionFile) {
        formData.append('prescriptionFile', prescriptionFile);
      }

      const response = await axiosInstance.put(`/api/medications/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete medication request
  deleteMedicationRequest: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/medications/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get medication history for a student
  getMedicationHistory: async (studentId) => {
    try {
      const response = await axiosInstance.get(`/api/medications/student/${studentId}/history`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Nurse: Get pending medication requests
  getPendingRequests: async () => {
    try {
      const response = await axiosInstance.get('/api/medications/nurse/pending');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Nurse: Get all medication requests (both pending and confirmed)
  getAllRequests: async () => {
    try {
      const response = await axiosInstance.get('/api/medications/nurse/all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Nurse: Confirm medication request
  confirmMedicationRequest: async (id) => {
    try {
      const response = await axiosInstance.put(`/api/medications/nurse/confirm/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Nurse: Reject medication request
  rejectMedicationRequest: async (id, reason) => {
    try {
      const response = await axiosInstance.put(`/api/medications/nurse/unconfirm/${id}`, {
        reason: reason
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export { medicationAPI };
