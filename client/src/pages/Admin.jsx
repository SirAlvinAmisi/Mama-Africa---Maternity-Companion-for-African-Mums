import React, { useState, useEffect } from 'react';
import AdminCardList from '../components/admin/AdminCardList';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ArticlesReview from '../components/admin/ArticlesReview';
import PostReview from '../components/admin/PostReview';
import CommunityReview from '../components/admin/CommunityReview';
// import Notification from '../components/Notification';
import CreateCategory from '../components/admin/CreateCategory';
import CreateCommunity from '../components/admin/CreateCommunity';
import ResetUserPassword from '../components/admin/ResetUserPassword';
// import NotificationsTab from '../components/admin/NotificationsTab';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  // const [notifications, setNotifications] = useState([]); // State for notifications
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // State for user filter
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [firstName, setFirstName] = useState(''); 
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('mum');
  const [newUserRegion, setNewUserRegion] = useState('');
  const [newUserLicenseNumber, setNewUserLicenseNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  // Fetch notifications
  // useEffect(() => {
  //   if (activeTab === 'notifications') {
  //     const fetchNotifications = async () => {
  //       try {
  //         const token = localStorage.getItem('access_token');
  //         const response = await axios.get('http://localhost:5000/admin/notifications', {
  //           headers: { Authorization: `Bearer ${token}` },
  //         });
  //         setNotifications(response.data.notifications || []);
  //       } catch (error) {
  //         console.error('Error fetching notifications:', error);
  //       }
  //     };

  //     fetchNotifications();
  //   }
  // }, [activeTab]);

  const tabs = [
    { key: 'users', label: 'Manage Users' },
    { key: 'articles', label: 'Review Articles' },
    { key: 'posts', label: 'Review Posts' },
    { key: 'communities', label: 'Approve Communities' },
    { key: 'create_community', label: 'Create Community' },
    { key: 'create_category', label: 'Create Category' },
    { key: 'reset_password', label: 'Reset Password' }
    // { key: 'notifications', label: 'Notifications' }, // Updated label
  ];
  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !newUserEmail || !password || !confirmPassword) {
      alert("Please fill all required fields.");
      return;
    }

    if (newUserRole === "health_pro") {
      const licenseRegex = /^[a-zA-Z]{2,}\/\d{4}\/\d{3,10}$/;
      if (!licenseRegex.test(newUserLicenseNumber)) {
        alert("License number format must be like ABC/2025/1234567");
        return;
      }

      const yearMatch = newUserLicenseNumber.split("/")[1];
      const currentYear = new Date().getFullYear().toString();
      if (yearMatch !== currentYear) {
        alert(`License year (${yearMatch}) may be expired.`);
        return;
      }
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const payload = new FormData();
    payload.append("first_name", firstName);
    payload.append("middle_name", middleName);
    payload.append("last_name", lastName);
    payload.append("email", newUserEmail);
    payload.append("role", newUserRole);
    payload.append("county", newUserRegion);
    payload.append("password", password);
    if (newUserRole === "health_pro") {
      payload.append("license_number", newUserLicenseNumber);
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "http://localhost:5000/admin/add_user",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.status === 201) {
        alert(`User created with ID: ${response.data.user_id}`);
        setShowAddUserModal(false);
        fetchUsers();
        // Reset fields
        setFirstName('');
        setMiddleName('');
        setLastName('');
        setNewUserEmail('');
        setNewUserRole('mum');
        setNewUserRegion('');
        setNewUserLicenseNumber('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to add user";
      alert(`Error: ${errorMsg}`);
      console.error("Add user error:", error);
    }
};

  // const handleAddUser = async (e) => {
  //   e.preventDefault();
    
  //   // Basic validation
  //   if (!newUserName || !newUserEmail) {
  //     alert('Please fill all fields');
  //     return;
  //   }
  
  //   try {
  //     const token = localStorage.getItem("access_token");
  //     const response = await axios.post(
  //       "http://localhost:5000/admin/add_user",
  //       {
  //         name: newUserName,
  //         email: newUserEmail,
  //         role: newUserRole,
  //         region: newUserRegion,
  //         license_number: newUserLicenseNumber,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
      
  //     if (response.status === 201) {
  //       alert(`User created with ID: ${response.data.user_id}`);
  //       setShowAddUserModal(false);
  //       setNewUserName('');
  //       setNewUserEmail('');
  //       setNewUserRole('mum');
  //       fetchUsers();
  //     }
  //   } catch (error) {
  //     const errorMsg = error.response?.data?.error || "Failed to add user";
  //     alert(`Error: ${errorMsg}`);
  //     console.error("Add user error:", error);
  //   }
  // };
  
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
            {activeTab === 'users' && (
              <div>
                {/* Buttons and Dropdown */}
                <div className="flex justify-between items-center mb-4">
                  {/* Dropdown Filter */}
                  <select
                    onChange={(e) => setFilter(e.target.value)}
                    className="p-2 border rounded text-gray-800"
                  >
                    <option value="all">All</option>
                    <option value="mum">Mums</option>
                    <option value="health_pro">Health Professionals</option>
                    
                  </select>

                  {/* Add User Button */}
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Add User
                  </button>
                </div>

                {/* Filtered Users */}
                <AdminCardList
                  users={users.filter(
                    (u) => filter === 'all' || u.role === filter
                  )}
                  refreshUsers={fetchUsers}
                />
              </div>
            )}
            {activeTab === 'articles' && <ArticlesReview />}
            {activeTab === 'posts' && <PostReview />}
            {activeTab === 'communities' && <CommunityReview />}
            {activeTab === 'create_community' && <CreateCommunity />}
            {activeTab === 'create_category' && <CreateCategory />}
            {activeTab === 'reset_password' && <ResetUserPassword />}
            {/* {activeTab === 'notifications' && <Notification />} */}
            
            {/* {activeTab === 'notifications' && <NotificationsTab />} */}
          </>
        )}
      </div>

      {showAddUserModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <form onSubmit={handleAddUser}>
                <input
                  name="firstName"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="p-3 bg-cyan-100 text-gray-800 border border-cyan-300 rounded-md w-full mb-3 font-semibold"
                />

                <input
                  name="middleName"
                  placeholder="Middle Name"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className="p-3 bg-cyan-100 text-gray-800 border border-cyan-300 rounded-md w-full mb-3 font-semibold"
                />

                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="p-3 bg-cyan-100 text-gray-800 border border-cyan-300 rounded-md w-full mb-3 font-semibold"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="p-3 bg-cyan-100 text-gray-800 border border-cyan-300 rounded-md w-full mb-3 font-semibold"
                />

                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="p-3 bg-cyan-100 text-gray-800 border border-cyan-300 rounded-md w-full mb-3 font-semibold"
                >
                  <option value="" disabled>Select Role</option>
                  <option value="mum">Mum</option>
                  <option value="health_pro">Health Professional</option>
                </select>

                <input
                  type="text"
                  placeholder="Region"
                  value={newUserRegion}
                  onChange={(e) => setNewUserRegion(e.target.value)}
                  className="p-3 bg-cyan-100 text-gray-800 border border-cyan-300 rounded-md w-full mb-3 font-semibold"
                />

                {newUserRole === "health_pro" && (
                  <input
                    type="text"
                    placeholder="License Number"
                    value={newUserLicenseNumber}
                    onChange={(e) => setNewUserLicenseNumber(e.target.value)}
                    className="p-3 bg-cyan-100 text-gray-800 border border-cyan-300 rounded-md w-full mb-3 font-semibold"
                />
                )}

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-3 bg-cyan-100 text-gray-800 border border-cyan-300 rounded-md w-full mb-3 font-semibold"
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="p-3 bg-cyan-100 text-gray-800 border border-cyan-300 rounded-md w-full mb-3 font-semibold"
                />


              {/* <input
                type="text"
                placeholder="Name"
                className="border p-2 rounded w-full mb-4 text-gray-800"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              /> */}
              {/* <input
                type="email"
                placeholder="Email"
                className="border p-2 rounded w-full mb-4 text-gray-800"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
              <select
                className="border p-2 rounded w-full mb-4 text-gray-800"
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
              >
                <option value="" disabled>
                  Category
                </option>
                <option value="mum">Mum</option> */}
                {/* <option value="health_pro">Health Professional</option> */}
                {/* <option value="admin">Admin</option> */}
              {/* </select>
              <input
                type="text"
                placeholder="Region"
                className="border p-2 rounded w-full mb-4 text-gray-800"
                value={newUserRegion}
                onChange={(e) => setNewUserRegion(e.target.value)}
              />
              <input
                type="text"
                placeholder="License Number"
                className="border p-2 rounded w-full mb-4 text-gray-800"
                value={newUserLicenseNumber}
                onChange={(e) => setNewUserLicenseNumber(e.target.value)}
              /> */}
              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Add User
                </button>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
