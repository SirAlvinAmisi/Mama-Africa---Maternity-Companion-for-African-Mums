import React, { useState, useEffect } from 'react';
import AdminCardList from '../components/admin/AdminCardList';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ArticlesReview from '../components/admin/ArticlesReview';
import PostReview from '../components/admin/PostReview';
import CommunityReview from '../components/admin/CommunityReview';
import CategoryReview from '../components/admin/CategoryReview';
import Notification from '../components/Notification';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:5000/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'users', label: 'Manage Users' },
    { key: 'articles', label: 'Review Articles' },
    { key: 'posts', label: 'Review Posts' },
    { key: 'communities', label: 'Approve Communities' },
    { key: 'notifications', label: 'Notifications' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-cyan-100 rounded-lg shadow-md">
      <h1 className="text-2xl sm:text-3xl font-bold text-cyan-700 text-center sm:text-left mb-6">
        Admin Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-200
              ${
                activeTab === tab.key
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-cyan-600 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-md p-6 min-h-[300px]">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <>
            {activeTab === 'users' && <AdminCardList users={users} refreshUsers={fetchUsers} />}
            {activeTab === 'articles' && <ArticlesReview />}
            {activeTab === 'posts' && <PostReview />}
            {activeTab === 'communities' && <CommunityReview />}
            {activeTab === 'notifications' && <Notification />}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
