import React, { useState, useEffect } from 'react';
import AdminCardList from '../components/admin/AdminCardList';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ArticleReview from '../components/admin/ArticlesReview';
import PostReview from '../components/admin/PostReview';
import CommunityReview from '../components/admin/CommunityReview';
import CategoryReview from '../components/admin/CategoryReview';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers(); // default load users first
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:5000/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Fetched users:', response.data.users); // 👈 Add this
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
    { key: 'communities', label: 'Approve Communities' }
    // { key: 'categories', label: 'Manage Categories' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-cyan-700 mb-6">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-2 px-4 rounded ${
              activeTab === tab.key ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {activeTab === 'users' && (
            <AdminCardList users={users} />
          )}
          {activeTab === 'articles' && <ArticleReview />}
          {activeTab === 'posts' && <PostReview />}
          {activeTab === 'communities' && <CommunityReview />}
          {activeTab === 'categories' && <CategoryReview />}
          {activeTab === 'articles' && (
            <div>Article review section coming soon!</div>
          )}
          {activeTab === 'posts' && (
            <div>Post review section coming soon!</div>
          )}
          {activeTab === 'communities' && (
            <div>Community approval section coming soon!</div>
          )}
          {/* {activeTab === 'categories' && (
            <div>Category management section coming soon!</div>
          )} */}

        </>
      )}
    </div>
  );
};

export default Admin;
