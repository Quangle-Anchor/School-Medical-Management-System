import { useState, useEffect, useRef, Fragment } from "react";
import ReactDOM from "react-dom";
import { BellIcon } from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import notificationApi from "../api/notificationApi";

function formatTime(dateString) {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const diff = (now - date) / 1000; // seconds
  if (diff < 60) return `${Math.floor(diff)} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 172800) return "Hôm qua";
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function groupNotifications(notifications) {
  const now = new Date();
  const today = now.toDateString();
  const yesterday = new Date(now.getTime() - 86400000).toDateString();
  const groups = { moi: [], homNay: [], truocDo: [] };
  notifications.forEach((n) => {
    const d = new Date(n.createdAt);
    if (d.toDateString() === today) {
      if ((now - d) / 1000 < 3600 * 6) {
        groups.moi.push(n);
      } else {
        groups.homNay.push(n);
      }
    } else if (d.toDateString() === yesterday) {
      groups.truocDo.push(n);
    } else if (d < now) {
      groups.truocDo.push(n);
    }
  });
  return groups;
}

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

  // Lấy notification từ API
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const fetchData = async () => {
      try {
        let res;
        if (user.role === "Parent") {
          res = await notificationApi.getMy(0, 20);
        } else {
          res = await notificationApi.getAll(0, 20);
        }
        setNotifications(res.data.content || []);
      } catch {
        setError("Không thể tải thông báo");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Đánh dấu đã đọc (giả lập, cần API nếu có)
  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.notificationId === id ? { ...n, readStatus: true } : n
      )
    );
    // TODO: Gọi API cập nhật trạng thái nếu backend hỗ trợ
  };

  // Lọc notification theo quyền
  const filteredNotifications =
    user.role === "Parent"
      ? notifications.filter((n) => n.userId === user.id)
      : notifications;
  const unread = filteredNotifications.filter((n) => !n.readStatus);
  const unreadCount = unread.length;

  // Gom nhóm thông báo
  const groups = groupNotifications(filteredNotifications);

  // Xem chi tiết thông báo (popup tại chỗ, không chuyển trang)
  const handleViewDetail = (n) => {
    setSelected(n);
    setShowList(false);
    if (!n.readStatus) handleMarkRead(n.notificationId);
  };

  // Xem tất cả
  const handleViewAll = () => {
    setShowList(false);
    if (user.role === "Parent") {
      navigate("/parentDashboard/notifications");
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
            Thông báo
            <button
              onClick={handleViewAll}
              className="text-xs text-blue-500 hover:underline"
            >
              Xem tất cả
            </button>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-gray-500 text-sm">Đang tải...</div>
            ) : (
              <>
                {groups.moi.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-blue-600 flex justify-between items-center">
                      Mới
                    </div>
                    {groups.moi.map((n) => (
                      <div
                        key={n.notificationId}
                        className="flex items-start gap-3 px-4 py-3 border-b last:border-0 bg-white group hover:bg-blue-50 transition relative cursor-pointer"
                        onClick={() => handleViewDetail(n)}
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                          <span>🔔</span>
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
                            title="Đánh dấu đã đọc"
                          ></button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {groups.homNay.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-700">
                      Hôm nay
                    </div>
                    {groups.homNay.map((n) => (
                      <div
                        key={n.notificationId}
                        className="flex items-start gap-3 px-4 py-3 border-b last:border-0 bg-white group hover:bg-blue-50 transition relative cursor-pointer"
                        onClick={() => handleViewDetail(n)}
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                          <span>🔔</span>
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
                            title="Đánh dấu đã đọc"
                          ></button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {groups.truocDo.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500">
                      Trước đó
                    </div>
                    {groups.truocDo.map((n) => (
                      <div
                        key={n.notificationId}
                        className="flex items-start gap-3 px-4 py-3 border-b last:border-0 bg-white group hover:bg-blue-50 transition relative cursor-pointer"
                        onClick={() => handleViewDetail(n)}
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                          <span>🔔</span>
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
                            title="Đánh dấu đã đọc"
                          ></button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {groups.moi.length === 0 &&
                  groups.homNay.length === 0 &&
                  groups.truocDo.length === 0 && (
                    <div className="p-4 text-gray-500 text-sm">
                      Không có thông báo nào.
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
