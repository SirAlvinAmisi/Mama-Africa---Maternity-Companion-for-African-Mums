import { useEffect, useState, useRef } from 'react';
import { Bell, Calendar, MessageCircle, UserPlus, X } from 'lucide-react';
import { io } from "socket.io-client";


// const socket = io(
//   import.meta.env.PROD
//     ? "https://mama-africa-api.onrender.com"
//     : "http://localhost:5000",
//   {
//     transports: ["polling"],
//     withCredentials: true
//   }
// );
const socket = io("https://mama-africa-api.onrender.com", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});
const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  // 🔐 Join socket room using stored JWT
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      socket.emit("join_room", { token });
    }
  }, []);

  // Handle real-time events
  useEffect(() => {
    const addNotification = (type, message, metadata = {}) => {
      setNotifications(prev => [
        ...prev,
        {
          type,
          message,
          date: new Date().toISOString(),
          unread: true,
          ...metadata,
        }
      ]);
    };

    socket.on('new_message', (data) => {
      addNotification('message', `New message: ${data.message}`);
    });

    socket.on('new_answer', (data) => {
      addNotification('question', `Your question was answered: ${data.question_text}`);
    });

    socket.on('new_comment', (data) => {
      addNotification('comment', `New comment on: ${data.content}`);
    });

    socket.on('verification_request', (data) => {
      addNotification(
        'accessRequest',
        `Verification request from ${data.full_name} (${data.license_number}) in ${data.region}`
      );
    });

    socket.on('new_notification', (data) => {
      // General fallback handler
      console.log("🛎 New notification received:", data);
      addNotification('general', data.message, { link: data.link });
    });

    return () => {
      socket.off('new_message');
      socket.off('new_answer');
      socket.off('new_comment');
      socket.off('verification_request');
      socket.off('new_notification');
    };
  }, []);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'reminder':
        return <Calendar size={16} className="text-cyan-600" />;
      case 'question':
        return <MessageCircle size={16} className="text-cyan-600" />;
      case 'accessRequest':
        return <UserPlus size={16} className="text-cyan-600" />;
      case 'message':
      case 'comment':
      default:
        return <Bell size={16} className="text-cyan-600" />;
    }
  };

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed right-8 top-24 z-50" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-cyan-500 rounded-full shadow p-2 hover:bg-cyan-400"
      >
        <Bell className="w-6 h-6 text-white" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center">No new notifications</div>
          ) : (
            <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
              {notifications.map((n, idx) => (
                <li key={idx} className={`flex items-start gap-2 p-4 ${n.unread ? 'bg-cyan-50' : ''}`}>
                  <div>{getIcon(n.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(n.date)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="p-3 border-t bg-gray-50 text-center">
            <button className="text-sm text-cyan-600 hover:underline" onClick={() => console.log('Go to all notifications')}>
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
