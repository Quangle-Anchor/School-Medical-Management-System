import React, { useEffect, useState } from "react";
import { userApi } from "../api/userApi";

const emptyUser = {
  username: "",
  email: "",
  fullName: "",
  role: "parent",
};

const UserManagement = ({ viewOnly = false }) => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyUser);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await userApi.getAll();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm(user);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this user?")) {
      await userApi.delete(id);
      fetchUsers();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingUser) {
      await userApi.update(editingUser.id, form);
    } else {
      await userApi.add(form);
    }
    setForm(emptyUser);
    setEditingUser(null);
    fetchUsers();
  };

  const handleCancel = () => {
    setForm(emptyUser);
    setEditingUser(null);
  };

  return (
    <div>
      {/* Ẩn form thêm/sửa nếu chỉ xem */}
      {!viewOnly && (
        <form
          className="mb-4 flex flex-wrap gap-2 items-end"
          onSubmit={handleSubmit}
        >
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="border p-2 rounded"
            required
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 rounded"
            required
          />
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="border p-2 rounded"
            required
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="parent">Parent</option>
            <option value="student">Student</option>
            <option value="nurse">Nurse</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editingUser ? "Update" : "Add"}
          </button>
          {editingUser && (
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </form>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Username</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Full Name</th>
              <th className="border px-2 py-1">Role</th>
              {/* Ẩn cột Actions nếu chỉ xem */}
              {!viewOnly && <th className="border px-2 py-1">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="border px-2 py-1">{u.username}</td>
                <td className="border px-2 py-1">{u.email}</td>
                <td className="border px-2 py-1">{u.fullName}</td>
                <td className="border px-2 py-1">{u.role}</td>
                {/* Ẩn nút Sửa/Xóa nếu chỉ xem */}
                {!viewOnly && (
                  <td className="border px-2 py-1">
                    <button
                      className="mr-2 px-2 py-1 bg-yellow-400 rounded"
                      onClick={() => handleEdit(u)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;
