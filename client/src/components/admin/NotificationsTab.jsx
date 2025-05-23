import React, { useEffect, useState } from 'react';
import { Clock, UserCheck, AlertCircle } from 'lucide-react';
import {
  fetchAdminNotifications,
  approveHealthProfessional,
  rejectHealthProfessional
} from '../../lib/api'; 

const NotificationsTab = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await fetchAdminNotifications(); // ✅ centralized API call
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await approveHealthProfessional(userId); // ✅ centralized API call
      alert('Health professional approved!');
      fetchNotifications();
    } catch (error) {
      console.error('Approval error:', error);
      alert('Failed to approve');
    }
  };

  const handleReject = async (userId) => {
    try {
      await rejectHealthProfessional(userId); // ✅ centralized API call
      alert('Health professional rejected!');
      fetchNotifications();
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
              key={notification.id || `${notification.user_id}-${notification.type}`}
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

              {notification.type === 'health_pro_request' && (
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => handleApprove(notification.user_id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
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
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsTab;
