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
    // If parent or nurse, only get notifications for that user
    if (user && (user.role === "Parent" || user.role === "Nurse")) {
      notificationApi
        .getMy(0, 30)
        .then((res) => setNotifications(res.data.content || []))
        .catch(() => setError("Unable to load notifications"))
        .finally(() => setLoading(false));
    } else {
      notificationApi
        .getAll(0, 30)
        .then((res) => setNotifications(res.data.content || []))
        .catch(() => setError("Unable to load notifications"))
        .finally(() => setLoading(false));
    }
  }, [formOpen, user]);

  const handleAdd = () => {
    setEditing(null);
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
      setError("Delete failed");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      if (user && user.role === "Principal") {
        await notificationApi.sendToNurses(data);
      } else {
        await notificationApi.create(data);
      }
      setFormOpen(false);
      setEditing(null);
    } catch {
      setError("Save failed");
    } finally {
      setLoading(false);
    }
  };

  // View notification details
  const handleView = (noti) => {
    setViewing(noti);
  };

  // Only show notifications appropriate for each role
  let filteredNotifications = notifications;

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
                    Loading...
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
                        {/* Only Nurse/Admin have Edit/Delete */}
                        {user && user.role !== "Parent" && (
                          <>
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
      {/* Only Nurse/Admin have permission to add/edit/delete notifications */}
      {user && user.role !== "Parent" && (
        <>
          <NotificationForm
            open={formOpen}
            onClose={() => {
              setFormOpen(false);
              setEditing(null);
            }}
            onSubmit={handleSubmit}
            initial={null}
          />
          {/* Confirm Delete Modal */}
          <ConfirmDeleteModal
            open={!!deleteId}
            onClose={() => setDeleteId(null)}
            onConfirm={confirmDelete}
            title="Confirm Delete Notification"
            message="Are you sure you want to delete this notification?"
            confirmText="Delete"
            cancelText="Cancel"
          />
        </>
      )}

      {/* Popup xem chi tiết notification - giao diện giống User Details */}
      {viewing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setViewing(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Notification Details
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setViewing(null)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bell className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {viewing.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {viewing.createdAt
                      ? new Date(viewing.createdAt).toLocaleString()
                      : ""}
                  </p>
                  <span className="inline-block px-2 py-1 text-xs rounded-full mt-1 bg-blue-100 text-blue-800">
                    Notification
                  </span>
                </div>
              </div>

              {/* Content Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Content
                </h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">
                    {viewing.content}
                  </p>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h4 className="text-xl font-medium text-gray-900 mb-6">
                  Details
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Created At</p>
                    <p className="text-gray-900 text-lg">
                      {viewing.createdAt
                        ? new Date(viewing.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Time</p>
                    <p className="text-gray-900 text-lg">
                      {viewing.createdAt
                        ? new Date(viewing.createdAt).toLocaleTimeString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-2">Type</p>
                    <p className="text-gray-900 text-lg break-words">
                      {viewing.notificationType || "General"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-2">Status</p>
                    <p className="text-gray-900 text-lg">
                      {viewing.readStatus ? "Read" : "Unread"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewing(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsView;
