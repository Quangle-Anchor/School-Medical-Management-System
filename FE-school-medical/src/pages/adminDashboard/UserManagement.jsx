import React, { useEffect, useState } from "react";
import { userApi } from "../../api/userApi";
import AddUserForm from "./AddUserForm";
import UserDetailModal from "./UserDetailModal";
import { Eye, Edit, Trash2, Plus } from "lucide-react";

const UserManagement = ({ viewOnly = false }) => {
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
  };

  const handleEditUser = async (user) => {
    await userApi.update(editingUser.userId, user);
    setEditingUser(null);
    setShowEditForm(false);
    fetchUsers();
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((u) => (
            <div key={u.id} className="bg-white rounded-lg shadow p-6 relative">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-2xl font-bold text-blue-600">
                    {u.fullName?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-lg">{u.fullName}</div>
                </div>
                {/* Nút xóa, sửa, xem chi tiết */}
                {!viewOnly && (
                  <>
                    <button
                      className="absolute top-4 right-20 flex items-center gap-1 text-gray-400 hover:text-blue-600 px-2 py-1 rounded"
                      title="View Details"
                      onClick={() => {
                        setDetailUser(u);
                        setShowDetailModal(true);
                      }}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      className="absolute top-4 right-12 flex items-center gap-1 text-gray-400 hover:text-yellow-500 px-2 py-1 rounded"
                      title="Edit"
                      onClick={() => {
                        setEditingUser(u);
                        setShowEditForm(true);
                      }}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      className="absolute top-4 right-4 flex items-center gap-1 text-gray-400 hover:text-red-600 px-2 py-1 rounded"
                      title="Delete"
                      onClick={() => handleDelete(u.id || u.userId)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              <div className="mb-2 text-sm text-gray-700 space-y-1">
                <div>
                  <b>Full Name:</b> {u.fullName}
                </div>
                <div>
                  <b>Email:</b> {u.email}
                </div>
                <div>
                  <b>Phone:</b> {u.phone}
                </div>
                <div>
                  <b>Username:</b> {u.username}
                </div>
                <div>
                  <b>Role:</b> {u.role || "N/A"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
