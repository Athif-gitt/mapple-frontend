import { useEffect, useState, useRef } from "react";
import { getNotifications, markNotificationRead } from "@/api/notifications";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const socketRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // 1️⃣ Load existing notifications (REST)
  useEffect(() => {
    getNotifications().then(res => {
      setNotifications(res.data);
    });
  }, []);

  // 2️⃣ WebSocket for real-time notifications
  useEffect(() => {
    const token = localStorage.getItem("access-token");

socketRef.current = new WebSocket(
  `ws://127.0.0.1:8000/ws/notifications/?token=${token}`
);


    socketRef.current.onmessage = (e) => {
      const notification = JSON.parse(e.data);

      setNotifications(prev => {
        if (prev.some(n => n.id === notification.id)) return prev;
        return [notification, ...prev];
      });
    };

    return () => socketRef.current?.close();
  }, []);

  const handleRead = async (id) => {
    await markNotificationRead(id);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
  };

  return (
    <div className="relative">
      {/* 🔔 Bell */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 📜 Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-xl overflow-hidden z-50">
          {notifications.length === 0 && (
            <div className="p-4 text-sm text-slate-500">
              No notifications
            </div>
          )}

          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => handleRead(n.id)}
              className={`p-4 border-b cursor-pointer ${
                n.is_read ? "bg-white" : "bg-slate-50"
              }`}
            >
              <p className="font-semibold text-sm">{n.title}</p>
              <p className="text-sm text-slate-600">{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
