import { useState, useEffect } from "react";
import { Eye, Edit, Trash2, Bell, Calendar, Search, X } from "lucide-react";
import notificationApi from "../../api/notificationApi";
import NotificationForm from "../../components/NotificationForm";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";

const NotificationsView = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [viewing, setViewing] = useState(null);
  // Đã bỏ search/filter

  useEffect(() => {
    setLoading(true);
    // Nếu là parent hoặc nurse thì chỉ lấy notification của user đó
    if (user && (user.role === "Parent" || user.role === "Nurse")) {
      notificationApi
        .getMy(0, 30)
        .then((res) => setNotifications(res.data.content || []))
        .catch(() => setError("Không thể tải thông báo"))
        .finally(() => setLoading(false));
    } else {
      notificationApi
        .getAll(0, 30)
        .then((res) => setNotifications(res.data.content || []))
        .catch(() => setError("Không thể tải thông báo"))
        .finally(() => setLoading(false));
    }
  }, [formOpen, user]);

  const handleAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const handleEdit = (noti) => {
    setEditing(noti);
    setFormOpen(true);
  };
  const handleDelete = async (id) => {
    setDeleteId(id);
  };
  const confirmDelete = async () => {
    setLoading(true);
    try {
      await notificationApi.delete(deleteId);
      setNotifications((prev) =>
        prev.filter((n) => n.notificationId !== deleteId)
      );
      setDeleteId(null);
    } catch {
      setError("Xóa thất bại");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      if (editing) {
        await notificationApi.update(editing.notificationId, data);
      } else {
        if (user && user.role === "Principal") {
          await notificationApi.sendToNurses(data);
        } else {
          await notificationApi.create(data);
        }
      }
      setFormOpen(false);
      setEditing(null);
    } catch {
      setError("Lưu thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Xem chi tiết notification
  const handleView = (noti) => {
    setViewing(noti);
  };

  // Chỉ hiển thị thông báo phù hợp với từng role
  let filteredNotifications = notifications;
  if (user && user.role === "Nurse") {
    filteredNotifications = notifications.filter((n) => n.createdBy === 2);
  } else if (user && user.role === "Principal") {
    filteredNotifications = notifications.filter((n) => n.createdBy === 2);
  }

  const getTypeColor = (type) => {
    if (type === "ALERT") return "text-red-600 bg-red-100";
    if (type === "REMINDER") return "text-yellow-600 bg-yellow-100";
    return "text-blue-600 bg-blue-100";
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Bell className="w-6 h-6 mr-2 text-blue-600" />
            Notifications
          </h1>
          <p className="text-gray-600">
            Manage and view all system notifications
          </p>
        </div>
        {/* Chỉ Nurse/Admin mới có nút Add Notification */}
        {user && user.role !== "Parent" && (
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow"
          >
            <span className="text-xl mr-2">+</span> Add Notification
          </button>
        )}
      </div>

      {/* Notifications Table - chỉ hiển thị Title, Content, Created At, Actions */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : filteredNotifications.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No notifications found.
                  </td>
                </tr>
              ) : (
                filteredNotifications.map((n) => (
                  <tr key={n.notificationId} className="hover:bg-gray-50">
                    <td
                      className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 cursor-pointer"
                      onClick={() => handleView(n)}
                    >
                      {n.title}
                    </td>
                    <td
                      className="px-6 py-4 max-w-xs truncate text-gray-700 cursor-pointer"
                      onClick={() => handleView(n)}
                    >
                      {n.content}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {n.createdAt
                        ? new Date(n.createdAt).toLocaleString()
                        : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(n)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </button>
                        {/* Chỉ Nurse/Admin mới có Edit/Delete */}
                        {user && user.role !== "Parent" && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(n);
                              }}
                              className="text-green-600 hover:text-green-900 inline-flex items-center"
                            >
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(n.notificationId);
                              }}
                              className="text-red-600 hover:text-red-900 inline-flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {error && <div className="text-red-500 text-sm p-2">{error}</div>}
      </div>

      {/* Notification Form Modal */}
      {/* Chỉ Nurse/Admin mới có quyền thêm/sửa/xóa notification */}
      {user && user.role !== "Parent" && (
        <>
          <NotificationForm
            open={formOpen}
            onClose={() => {
              setFormOpen(false);
              setEditing(null);
            }}
            onSubmit={handleSubmit}
            initial={editing}
          />
          {/* Confirm Delete Modal */}
          <ConfirmDeleteModal
            open={!!deleteId}
            onClose={() => setDeleteId(null)}
            onConfirm={confirmDelete}
            title="Xác nhận xóa thông báo"
            message="Bạn có chắc chắn muốn xóa thông báo này?"
            confirmText="Xóa"
            cancelText="Hủy"
          />
        </>
      )}

      {/* Popup xem chi tiết notification - thêm icon chuông lớn cho đặc sắc */}
      {viewing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setViewing(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setViewing(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-10 h-10 text-blue-600" />
              <div>
                <div className="font-bold text-lg text-blue-900 mb-1">
                  {viewing.title}
                </div>
                <div className="text-xs text-gray-400 mb-2">
                  {viewing.createdAt
                    ? new Date(viewing.createdAt).toLocaleString()
                    : ""}
                </div>
              </div>
            </div>
            <div className="text-gray-800 mb-2 whitespace-pre-line">
              {viewing.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsView;
