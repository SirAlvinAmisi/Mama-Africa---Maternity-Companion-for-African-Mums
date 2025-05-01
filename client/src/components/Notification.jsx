// src/components/Notification.jsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

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

    return () => {
      socket.off('new_message');
      socket.off('new_answer');
      socket.off('new_comment');
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 w-80 bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Notifications</h3>
      {notifications.length === 0 ? (
        <p className="text-gray-600">No new notifications</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification, index) => (
            <li key={index} className="text-gray-600 border-b py-2">
              {notification}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;
