import axiosInstance from "./axiosInstance";

const studentsApi = {
    getStudents: async () => {
        try {
            const response = await axiosInstance.get('/api/students');
            return response.data; // axios returns data here
        } catch (error) {
            console.error('Catching error', error);
            throw error;
        }
    }
}
export default studentsApi;