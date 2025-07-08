import axiosInstance from "./axiosInstance";

export const userApi = {
  getAll: async () => {
    // Đúng endpoint BE: /api/admin/users
    const res = await axiosInstance.get("/api/admin/users");
    return res.data;
  },
  add: async (user) => {
    // BE yêu cầu: { username, password, email, phone, fullName, roleName }
    const req = {
      username: user.username,
      password: user.password,
      email: user.email,
      phone: user.phone,
      fullName: user.fullName,
      roleName: user.role || user.roleName,
    };
    const res = await axiosInstance.post("/api/admin/users", req);
    return res.data;
  },
  update: async (id, user) => {
    // BE yêu cầu: { email, phone, fullName, roleName }
    const req = {
      email: user.email,
      phone: user.phone,
      fullName: user.fullName,
      roleName: user.role || user.roleName,
    };
    const res = await axiosInstance.put(`/api/admin/users/${id}`, req);
    return res.data;
  },
  delete: async (id) => {
    await axiosInstance.delete(`/api/admin/users/${id}`);
    return true;
  },
};
