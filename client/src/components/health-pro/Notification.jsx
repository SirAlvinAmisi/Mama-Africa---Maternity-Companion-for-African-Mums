import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import './Notification.css';

// Sample data for development (replace with actual API call in production)
const sampleNotifications = [
  {
    id: 1,
    type: 'calendar',
    content: 'Community webinar tomorrow at 3PM',
    time: '2 hours ago',
    isRead: false
  },
  {
    id: 2,
    type: 'question',
    content: 'Jane Doe asked: "What vaccines are required for newborns?"',
    time: '1 day ago',
    isRead: true
  },
  {
    id: 3,
    type: 'access',
    content: 'Dr. Smith requested access to patient records',
    time: '2 days ago',
    isRead: false
  },
  {
    id: 4,
    type: 'calendar',
    content: 'Monthly maternal health webinar',
    time: '3 days ago',
    isRead: true
  }
];

const Notification = () => {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [activeTab, setActiveTab] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    return notification.type === activeTab;
  });

  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  // Count notifications by type
  const calendarCount = notifications.filter(notification => notification.type === 'calendar').length;
  const questionCount = notifications.filter(notification => notification.type === 'question').length;
  const accessCount = notifications.filter(notification => notification.type === 'access').length;

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Mark single notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };

  // Function to fetch notifications from API (to be implemented)
  const fetchNotifications = () => {
    // Replace with actual API call
    // For now, we'll use sample data
    // Example:
    // fetch('/api/notifications')
    //   .then(response => response.json())
    //   .then(data => setNotifications(data))
    //   .catch(error => console.error('Error fetching notifications:', error));
  };

  useEffect(() => {
    // Initial fetch of notifications
    fetchNotifications();

    // Set up polling for new notifications (every minute)
    const interval = setInterval(fetchNotifications, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Get icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'calendar':
        return <i className="fa fa-calendar-alt"></i>;
      case 'question':
        return <i className="fa fa-question-circle"></i>;
      case 'access':
        return <i className="fa fa-user-check"></i>;
      default:
        return <i className="fa fa-bell"></i>;
    }
  };

  return (
    <div className="notification-wrapper">
      <button 
        className="notification-btn" 
        onClick={toggleDropdown}
        aria-expanded={isDropdownOpen}
        aria-label="Notifications"
      >
        <Bell size={16} />
        <span className="notification-label">Notifications</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isDropdownOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <button 
              className="mark-all-read-btn"
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
          </div>
          
          <div className="notification-tabs">
            <button 
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All ({notifications.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              Calendar ({calendarCount})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'question' ? 'active' : ''}`}
              onClick={() => setActiveTab('question')}
            >
              Questions ({questionCount})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'access' ? 'active' : ''}`}
              onClick={() => setActiveTab('access')}
            >
              Access ({accessCount})
            </button>
          </div>
          
          <div className="notification-content">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.isRead ? 'notification-unread' : ''}`}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-text">{notification.content}</div>
                    <div className="notification-time">{notification.time}</div>
                  </div>
                  <div className="notification-actions">
                    <button 
                      className="mark-read-btn"
                      onClick={() => markAsRead(notification.id)}
                      aria-label="Mark as read"
                    >
                      <i className="fa fa-check"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-notifications">
                No notifications to display
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;