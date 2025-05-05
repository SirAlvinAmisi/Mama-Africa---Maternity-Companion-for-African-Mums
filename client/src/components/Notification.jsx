// src/components/Notification.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    socket.on('new_message', (data) => {
      setNotifications((prev) => [...prev, `New message: ${data.message}`]);
    });

    socket.on('new_answer', (data) => {
      setNotifications((prev) => [...prev, `Your question was answered: ${data.question_text}`]);
    });

    socket.on('new_comment', (data) => {
      setNotifications((prev) => [...prev, `New comment on: ${data.content}`]);
    });

    socket.on('verification_request', (data) => {
      setNotifications(prev => [
        ...prev,
        `Verification request from ${data.full_name} (${data.license_number}) in ${data.region}`
      ]);
    });
    
    return () => {
      socket.off('new_message');
      socket.off('new_answer');
      socket.off('new_comment');
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed right-20 top-40 z-50 " ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-cyan-500 rounded-full shadow p-2 hover:bg-cyan-200"
      >
        <Bell className="w-6 h-6 text-cyan-700" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-2 w-80 bg-white rounded-lg shadow-xl p-4">
          <h3 className="text-lg font-bold text-black mb-2">Notifications</h3>
          {notifications.length === 0 ? (
            <p className="text-gray-600">No new notifications</p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {notifications.map((notification, index) => (
                <li key={index} className="text-gray-700 border-b py-2">
                  {notification}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
