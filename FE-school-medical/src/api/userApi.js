import axiosInstance from "./axiosInstance";

export const userApi = {
  getAll: async () => {
    const res = await axiosInstance.get("/api/users");
    return res.data;
  },
  add: async (user) => {
    const res = await axiosInstance.post("/api/users", user);
    return res.data;
  },
  update: async (id, user) => {
    const res = await axiosInstance.put(`/api/users/${id}`, user);
    return res.data;
  },
  delete: async (id) => {
    await axiosInstance.delete(`/api/users/${id}`);
    return true;
  },
};
