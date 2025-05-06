// client/src/components/admin/NotificationsTab.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, UserCheck, AlertCircle } from 'lucide-react';

const NotificationsTab = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:5000/admin/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(
        `http://localhost:5000/admin/approve_healthpro/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
      alert('Health professional approved!');
    } catch (error) {
      console.error('Approval error:', error);
      alert('Failed to approve');
    }
  };

  const handleReject = async (userId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(
        `http://localhost:5000/admin/reject_healthpro/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
      alert('Health professional rejected!');
    } catch (error) {
      console.error('Rejection error:', error);
      alert('Failed to reject');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading notifications...</div>;

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Pending Approvals</h3>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No pending requests</p>
      ) : (
        <div className="space-y-3">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className="p-3 border rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  {notification.type === 'health_pro_request' ? (
                    <UserCheck className="text-blue-600" size={20} />
                  ) : (
                    <AlertCircle className="text-yellow-600" size={20} />
                  )}
                </div>
                <div className="flex-1">
                  {/* Updated text color for better visibility */}
                  <p className="font-medium text-blue-800">{notification.message}</p>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Clock size={14} className="mr-1" />
                    {new Date(notification.created_at).toLocaleString()}
                  </div>
                  {notification.user_data?.license && (
                    <p className="text-xs bg-gray-100 text-gray-700 p-1 rounded mt-1">
                      License: {notification.user_data.license}
                    </p>
                  )}
                </div>
              </div>
              {/* Buttons Section */}
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => handleApprove(notification.user_id)}
                  className="bg-cyan-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(notification.user_id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsTab;