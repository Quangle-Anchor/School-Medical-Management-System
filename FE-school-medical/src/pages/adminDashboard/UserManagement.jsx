import React, { useEffect, useState } from "react";
import { userApi } from "../../api/userApi";
import AddUserForm from "./AddUserForm";
import UserDetailModal from "./UserDetailModal";
import { Eye, Edit, Trash2, Plus } from "lucide-react";

const UserManagement = ({ viewOnly = false, onUserUpdated }) => {
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [errorModal, setErrorModal] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    const data = await userApi.getAll();
    // Chuẩn hóa dữ liệu: map roleName -> role để đồng bộ UI
    const usersWithRole = data.map((u) => ({
      ...u,
      role: u.role || u.roleName || "N/A",
      fullName: u.fullName || u.name || "",
      username: u.username,
      email: u.email,
      phone: u.phone,
    }));
    setUsers(usersWithRole);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (user) => {
    await userApi.add(user);
    fetchUsers();
    // Gọi callback để cập nhật total users ở dashboard
    if (onUserUpdated) {
      onUserUpdated();
    }
  };

  const handleEditUser = async (user) => {
    await userApi.update(editingUser.userId, user);
    setEditingUser(null);
    setShowEditForm(false);
    fetchUsers();
    // Gọi callback để cập nhật total users ở dashboard
    if (onUserUpdated) {
      onUserUpdated();
    }
  };

  const handleDelete = (id) => {
    if (!id) {
      setErrorModal("User ID is invalid. Cannot delete user.");
      return;
    }
    setDeleteUserId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteUserId) {
      try {
        await userApi.delete(deleteUserId);
        fetchUsers();
        // Gọi callback để cập nhật total users ở dashboard
        if (onUserUpdated) {
          onUserUpdated();
        }
      } catch (err) {
        // Hiển thị lỗi BE trả về nếu xóa không thành công (ví dụ lỗi ràng buộc khoá ngoại)
        // Lấy thông báo lỗi chi tiết nhất từ backend, ưu tiên message hoặc detail hoặc lỗi mặc định
        setErrorModal(
          err?.response?.data?.message ||
            err?.response?.data?.detail ||
            err?.message ||
            "Failed to delete user. This user may be referenced by other data (e.g. as a parent of a student, or creator of a health event, etc)."
        );
      }
    }
    setShowDeleteModal(false);
    setDeleteUserId(null);
  };

  return (
    <div>
      {/* Modal xác nhận xóa user (Custom) */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Confirm Delete</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
            <div className="mb-4">
              Are you sure you want to delete this user?
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal báo lỗi (Custom) */}
      {errorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Error</h2>
              <button
                onClick={() => setErrorModal("")}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
            <div className="mb-4">{errorModal}</div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setErrorModal("")}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Nút Add User ở góc phải */}
      {!viewOnly && (
        <div className="flex justify-between items-center mb-6">
          <div className="font-bold text-xl">User List</div>
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => {
              setShowAddForm(true);
              // Reset editingUser để form add luôn rỗng
              setEditingUser(null);
            }}
          >
            <Plus className="w-5 h-5" /> Add User
          </button>
        </div>
      )}
      {/* Form thêm user dạng modal */}
      <AddUserForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onUserAdded={handleAddUser}
      />
      {/* Form sửa user dạng modal */}
      <AddUserForm
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false);
          setEditingUser(null);
        }}
        onUserAdded={handleEditUser}
        isEditing={true}
        editingUser={editingUser}
      />
      {/* Modal xem chi tiết user */}
      <UserDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setDetailUser(null);
        }}
        user={detailUser}
      />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-lg font-bold text-blue-600">
                          {u.fullName?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {u.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{u.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{u.email}</div>
                    <div className="text-sm text-gray-500">{u.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {u.role || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => {
                          setDetailUser(u);
                          setShowDetailModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setShowEditForm(true);
                        }}
                        className="text-green-600 hover:text-green-900 inline-flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u.id || u.userId)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
