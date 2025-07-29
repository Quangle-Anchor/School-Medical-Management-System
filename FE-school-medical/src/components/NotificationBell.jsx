import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { BellIcon } from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import notificationApi from "../api/notificationApi";

function groupNotifications(notifications) {
  const now = new Date();
  const today = now.toDateString();
  const yesterday = new Date(now.getTime() - 86400000).toDateString();
  const groups = { new: [], today: [], earlier: [] };

  notifications.forEach((n) => {
    const d = new Date(n.createdAt);
    const notificationDate = d.toDateString();

    // Áp dụng logic giống nhau cho tất cả loại thông báo
    if (notificationDate === today) {
      // Thông báo trong vòng 6 tiếng được coi là "new"
      const timeDiff = (now - d) / 1000; // seconds
      if (timeDiff < 3600 * 6) {
        // 6 hours
        groups.new.push(n);
      } else {
        groups.today.push(n);
      }
    } else if (notificationDate === yesterday) {
      groups.earlier.push(n);
    } else if (d < now) {
      groups.earlier.push(n);
    }
  });

  return groups;
}

// Sửa lại hàm formatTime để xử lý đồng nhất tất cả loại thông báo
function formatTime(dateString) {
  if (!dateString) return "";

  try {
    // Parse date và convert về Vietnam timezone
    const date = new Date(dateString);
    const now = new Date();

    // Đảm bảo cả hai đều ở cùng timezone
    const vietnamNow = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
    );
    const vietnamDate = new Date(
      date.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
    );

    // Check if date is valid
    if (isNaN(vietnamDate.getTime())) return "";

    const diff = Math.floor((vietnamNow - vietnamDate) / 1000); // seconds

    // Áp dụng cùng threshold cho tất cả loại thông báo
    if (diff < 300) return "Just now";  

    // Minutes
    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

    // Hours
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    // Days
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;

    // Date format cho trường hợp cũ hơn - áp dụng cho tất cả
    return vietnamDate.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

// Thêm function để kiểm tra loại thông báo và xử lý đồng nhất
const getNotificationIcon = (notificationType) => {
  switch (notificationType) {
    case "HEALTH_INCIDENT":
      return "⚠️";
    case "HEALTH_EVENT":
      return "📅";
    case "MEDICATION_REQUEST":
      return "💊";
    case "REMINDER":
      return "⏰";
    case "ALERT":
      return "🚨";
    default:
      return "🔔";
  }
};

const NotificationBell = ({ user, show, setShow }) => {
  // Nếu truyền prop show/setShow thì dùng, nếu không thì fallback về state nội bộ (giúp tương thích)
  const [internalShow, internalSetShow] = useState(false);
  const showList = typeof show === "boolean" ? show : internalShow;
  const setShowList = typeof setShow === "function" ? setShow : internalSetShow;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const bellRef = useRef();
  const popupRef = useRef();

  // Đặt ở đầu component, trước return hoặc trước renderContent
  // Lấy notification từ API
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const fetchData = async () => {
      try {
        let res;
        // Changed to use getMy for Principal instead of getAll
        if (["Parent", "Nurse", "Principal"].includes(user.role)) {
          res = await notificationApi.getMy(0, 20);
        } else {
          res = await notificationApi.getAll(0, 20);
        }
        const notifications = res.data.content || [];
        setNotifications(notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Unable to load notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Lọc notification theo quyền - sửa lại logic
  let filteredNotifications = notifications;
  if (user && user.role === "Parent") {
    // Parent có thể xem tất cả notifications được gửi cho họ
    // Không cần lọc theo userId vì API getMy() đã trả về đúng notifications
    filteredNotifications = notifications;
  }

  const unread = filteredNotifications.filter((n) => n.readStatus === false); // Thêm điều kiện rõ ràng
  const unreadCount = unread.length;

  // Mark as read (call API to update read status)
  const handleMarkRead = async (id) => {
    try {
      await notificationApi.updateReadStatus(id, true);
      setNotifications((prev) =>
        prev.map((n) => {
          if (n.notificationId === id) {
            return { ...n, readStatus: true };
          }
          return n;
        })
      );
    } catch (error) {
      console.error("Error marking as read:", error);
      setError("Unable to mark as read");
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      // Get all unread notifications
      const unreadNotifications = notifications.filter((n) => !n.readStatus);

      // Mark all as read in parallel
      await Promise.all(
        unreadNotifications.map((n) =>
          notificationApi.updateReadStatus(n.notificationId, true)
        )
      );

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, readStatus: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
      setError("Unable to mark all as read");
    }
  };

  // Group notifications
  const groups = groupNotifications(filteredNotifications);

  // Xem chi tiết thông báo (vừa hiện popup vừa link tới trang tương ứng nếu có notificationType)
  const handleViewDetail = async (n) => {
    setShowList(false);
    try {
      if (!n.readStatus) {
        await handleMarkRead(n.notificationId);
        // Đảm bảo cập nhật state ngay sau khi mark as read
        setNotifications((prev) =>
          prev.map((item) =>
            item.notificationId === n.notificationId
              ? { ...item, readStatus: true }
              : item
          )
        );
      }
      setSelected(n);
      // Nếu có notificationType, điều hướng tới trang tương ứng
      if (user.role === "Nurse" && n.notificationType) {
        if (n.notificationType === "HEALTH_INCIDENT") {
          navigate("/nurseDashboard/health-incidents");
          return;
        } else if (n.notificationType === "HEALTH_EVENT") {
          navigate("/nurseDashboard/health-events");
          return;
        } else if (n.notificationType === "MEDICATION_REQUEST") {
          navigate("/nurseDashboard/medication-requests");
          return;
        }
        navigate("/nurseDashboard/notifications");
        return;
      }
      if (user.role === "Principal" && n.notificationType) {
        if (n.notificationType === "HEALTH_INCIDENT") {
          navigate("/principalDashboard/health-incidents");
          return;
        } else if (n.notificationType === "HEALTH_EVENT") {
          navigate("/principalDashboard/health-events");
          return;
        } else if (n.notificationType === "MEDICATION_REQUEST") {
          navigate("/principalDashboard/medication-requests");
          return;
        }
        navigate("/principalDashboard/notifications");
        return;
      }
      if (user.role === "Parent" && n.notificationType) {
        if (n.notificationType === "HEALTH_INCIDENT") {
          navigate("/parentDashboard/medical-records");
          return;
        } else if (n.notificationType === "HEALTH_EVENT") {
          navigate("/parentDashboard/health-event");
          return;
        }
        navigate("/parentDashboard/notifications");
        return;
      }
    } catch (error) {
      console.error("Error handling notification:", error);
    }
  };

  // View all
  const handleViewAll = () => {
    setShowList(false);
    if (user.role === "Parent") {
      navigate("/parentDashboard/notifications");
    } else if (user.role === "Principal") {
      navigate("/principalDashboard/notifications");
    } else {
      navigate("/nurseDashboard/notifications");
    }
  };

  // Click-away: đóng popup khi click ra ngoài
  useEffect(() => {
    if (!showList) return;
    const handleClick = (e) => {
      if (
        bellRef.current &&
        !bellRef.current.contains(e.target) &&
        popupRef.current &&
        !popupRef.current.contains(e.target)
      ) {
        setShowList(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showList, setShowList]);

  return (
    <div className="relative">
      <button
        ref={bellRef}
        className={`relative p-2 rounded-full transition ${
          showList ? "bg-blue-100 ring-2 ring-blue-400" : "hover:bg-blue-100"
        }`}
        onClick={() => setShowList((v) => !v)}
        aria-label="Notifications"
        tabIndex={0}
      >
        <BellIcon
          className={`h-7 w-7 ${showList ? "text-blue-600" : "text-blue-500"}`}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 shadow">
            {unreadCount}
          </span>
        )}
      </button>
      <Transition
        as="div"
        show={showList}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div
          ref={popupRef}
          className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg z-50 border border-gray-200"
        >
          <div className="p-4 font-semibold border-b text-lg flex justify-between items-center">
            Notification
            <div className="flex gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-blue-500 hover:underline"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={handleViewAll}
                className="text-xs text-blue-500 hover:underline"
              >
                View all
              </button>
            </div>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-gray-500 text-sm">Loading...</div>
            ) : (
              <>
                {groups.new.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-blue-600 flex justify-between items-center">
                      New
                    </div>
                    {groups.new.map((n) => (
                      <div
                        key={n.notificationId}
                        className="flex items-start gap-3 px-4 py-3 border-b last:border-0 bg-white group hover:bg-blue-50 transition relative cursor-pointer"
                        onClick={() => handleViewDetail(n)}
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                          <span>{getNotificationIcon(n.notificationType)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-blue-900 truncate">
                            {n.title}
                          </div>
                          <div className="text-sm text-gray-700 truncate">
                            {n.content}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {formatTime(n.createdAt)}
                          </div>
                        </div>
                        {!n.readStatus && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkRead(n.notificationId);
                            }}
                            className="w-3 h-3 rounded-full bg-blue-500 mt-2 ml-2 border-2 border-white shadow"
                            title="Mark as read"
                          ></button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {groups.today.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-700">
                      Today
                    </div>
                    {groups.today.map((n) => (
                      <div
                        key={n.notificationId}
                        className="flex items-start gap-3 px-4 py-3 border-b last:border-0 bg-white group hover:bg-blue-50 transition relative cursor-pointer"
                        onClick={() => handleViewDetail(n)}
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                          <span>{getNotificationIcon(n.notificationType)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-blue-900 truncate">
                            {n.title}
                          </div>
                          <div className="text-sm text-gray-700 truncate">
                            {n.content}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {formatTime(n.createdAt)}
                          </div>
                        </div>
                        {!n.readStatus && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkRead(n.notificationId);
                            }}
                            className="w-3 h-3 rounded-full bg-blue-500 mt-2 ml-2 border-2 border-white shadow"
                            title="Mark as read"
                          ></button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {groups.earlier.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500">
                      Earlier
                    </div>
                    {groups.earlier.map((n) => (
                      <div
                        key={n.notificationId}
                        className="flex items-start gap-3 px-4 py-3 border-b last:border-0 bg-white group hover:bg-blue-50 transition relative cursor-pointer"
                        onClick={() => handleViewDetail(n)}
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                          <span>{getNotificationIcon(n.notificationType)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-blue-900 truncate">
                            {n.title}
                          </div>
                          <div className="text-sm text-gray-700 truncate">
                            {n.content}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {formatTime(n.createdAt)}
                          </div>
                        </div>
                        {!n.readStatus && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkRead(n.notificationId);
                            }}
                            className="w-3 h-3 rounded-full bg-blue-500 mt-2 ml-2 border-2 border-white shadow"
                            title="Mark as read"
                          ></button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {groups.new.length === 0 &&
                  groups.today.length === 0 &&
                  groups.earlier.length === 0 && (
                    <div className="p-4 text-gray-500 text-sm">
                      No notifications.
                    </div>
                  )}
              </>
            )}
          </div>
          {error && <div className="text-red-500 text-sm p-2">{error}</div>}
        </div>
      </Transition>

      {/* Popup chi tiết notification - giao diện giống Facebook, dùng Portal để tránh bị giới hạn khung */}
      {selected &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30"
            onClick={() => setSelected(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-0 relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl">
                    <svg
                      width="32"
                      height="32"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </span>
                  <div>
                    <div className="font-bold text-lg text-blue-900 mb-1">
                      {selected.title}
                    </div>
                    <div className="text-xs text-gray-400">
                      {selected.createdAt
                        ? new Date(selected.createdAt).toLocaleString()
                        : ""}
                    </div>
                  </div>
                </div>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                  onClick={() => setSelected(null)}
                >
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {/* Content */}
              <div className="px-6 py-6">
                <div className="text-gray-800 text-base whitespace-pre-line">
                  {selected.content}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default NotificationBell;
