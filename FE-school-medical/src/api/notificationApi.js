import axiosInstance from "./axiosInstance";

const notificationApi = {
  // Lấy tất cả notification (cho Nurse/Principal)
  getAll: (page = 0, size = 15, sort = "createdAt,desc") =>
    axiosInstance.get(`/api/notifications`, {
      params: { page, size, sort },
    }),

  // Lấy notification của user hiện tại (cho Parent)
  getMy: (page = 0, size = 15, sort = "createdAt,desc") =>
    axiosInstance.get(`/api/notifications/my`, {
      params: { page, size, sort },
    }),

  // Thêm notification
  create: (data) => axiosInstance.post(`/api/notifications`, data),

  // Sửa notification
  update: (id, data) => axiosInstance.put(`/api/notifications/${id}`, data),

  // Xóa notification
  delete: (id) => axiosInstance.delete(`/api/notifications/${id}`),

  // Cập nhật trạng thái đã đọc cho notification
  updateReadStatus: (notificationId, read) =>
    axiosInstance.put(
      `/api/notifications/${notificationId}/read-status`,
      null,
      {
        params: { read },
      }
    ),
};

export default notificationApi;
