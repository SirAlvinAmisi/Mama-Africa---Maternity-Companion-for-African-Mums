import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import AdminCardList from '../components/admin/AdminCardList';
import ArticlesReview from '../components/admin/ArticlesReview';
import PostReview from '../components/admin/PostReview';
import CommunityReview from '../components/admin/CommunityReview';
import CreateCommunity from '../components/admin/CreateCommunity';
import ResetUserPassword from '../components/admin/ResetUserPassword';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
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

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !newUserEmail || !password || !confirmPassword) return alert("Fill all required fields.");
    if (password !== confirmPassword) return alert("Passwords do not match!");
    if (newUserRole === "health_pro") {
      const licenseRegex = /^[a-zA-Z]{2,}\/\d{4}\/\d{3,10}$/;
      if (!licenseRegex.test(newUserLicenseNumber)) return alert("License must be like ABC/2025/1234567");
      if (newUserLicenseNumber.split("/")[1] !== new Date().getFullYear().toString()) return alert("License year may be expired.");
    }

    const payload = new FormData();
    payload.append("first_name", firstName);
    payload.append("middle_name", middleName);
    payload.append("last_name", lastName);
    payload.append("email", newUserEmail);
    payload.append("role", newUserRole);
    payload.append("county", newUserRegion);
    payload.append("password", password);
    if (newUserRole === "health_pro") payload.append("license_number", newUserLicenseNumber);

    try {
      const response = await api.post('/admin/add_user', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.status === 201) {
        alert(`User created with ID: ${response.data.user_id}`);
        setShowAddUserModal(false);
        fetchUsers();
        setFirstName(''); setMiddleName(''); setLastName('');
        setNewUserEmail(''); setNewUserRole('mum'); setNewUserRegion('');
        setNewUserLicenseNumber(''); setPassword(''); setConfirmPassword('');
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || "Failed to add user"}`);
    }
  };

  const tabs = [
    { key: 'users', label: 'Manage Users' },
    { key: 'articles', label: 'Review Articles' },
    { key: 'posts', label: 'Review Posts' },
    { key: 'communities', label: 'Approve Communities' },
    { key: 'create_community', label: 'Create Community' },
    { key: 'reset_password', label: 'Reset Password' }
  ];

  return (
    <>
      <div className="flex bg-cyan-100 min-h-screen">
        {/* Sidebar */}
        <aside className={`fixed top-0 left-3 w-64 h-full bg-cyan-700 text-white font-bold flex flex-col justify-between p-10 z-40 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 sm:static`}>
          <div>
            <div className="flex justify-between items-center mb-6 sm:hidden">
              <h2 className="text-xl font-bold">Admin Menu</h2>
              <button onClick={() => setSidebarOpen(false)}><X /></button>
            </div>
            <h2 className="text-2xl font-bold hidden sm:block mb-6">Admin Dashboard</h2>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSidebarOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition font-medium
                  ${activeTab === tab.key ? 'bg-white text-cyan-700 shadow-md' : 'hover:bg-cyan-600'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="mt-8 text-center">
            <div className="w-32 h-16 bg-cyan-900 text-white flex items-center justify-center mx-auto font-bold rounded">
              Mama Africa
            </div>
          </div>
        </aside>

        {/* Mobile Hamburger */}
        <div className="sm:hidden fixed top-4 left-4 z-50">
          <button onClick={() => setSidebarOpen(true)} className="text-cyan-700">
            <Menu size={28} />
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:ml-64 sm:p-6 lg:p-10 transition-all duration-300">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center mb-6">
            Admin Dashboard
          </h1>

          <div className="bg-white rounded-xl shadow-md p-6 min-h-[300px]">
            {loading ? (
              <div className="text-center text-gray-700">Loading...</div>
            ) : (
              <>
                {activeTab === 'users' && (
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                      <select
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full sm:w-48 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-700"
                      >
                        <option value="all">All Roles</option>
                        <option value="mum">Mums</option>
                        <option value="health_pro">Health Professionals</option>
                      </select>

                      <button
                        onClick={() => setShowAddUserModal(true)}
                        className="w-full sm:w-auto bg-cyan-700 hover:bg-cyan-800 text-white font-medium px-5 py-2 rounded-lg shadow-md transition"
                      >
                        ➕ Add New User
                      </button>
                    </div>

                    <AdminCardList
                      users={users.filter(u => filter === 'all' || u.role === filter)}
                      refreshUsers={fetchUsers}
                    />
                  </div>
                )}
                {activeTab === 'articles' && <ArticlesReview />}
                {activeTab === 'posts' && <PostReview />}
                {activeTab === 'communities' && <CommunityReview />}
                {activeTab === 'create_community' && <CreateCommunity />}
                {activeTab === 'reset_password' && <ResetUserPassword />}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-cyan-300 rounded-xl shadow-xl w-full max-w-xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute top-3 right-3 text-black hover:text-red-500 text-xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold text-cyan-700 mb-4">Add New User</h2>

            <form onSubmit={handleAddUser} className="grid gap-4 text-sm text-black">
              <div className="grid sm:grid-cols-2 gap-4">
                <input placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input" required />
                <input placeholder="Middle Name" value={middleName} onChange={(e) => setMiddleName(e.target.value)} className="input" />
                <input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="input" required />
                <input type="email" placeholder="Email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} className="input" required />
              </div>

              <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} className="input font-bold">
                <option value="mum">Mum</option>
                <option value="health_pro">Health Professional</option>
              </select>

              {newUserRole === 'health_pro' && (
                <>
                  <input placeholder="Region/County" value={newUserRegion} onChange={(e) => setNewUserRegion(e.target.value)} className="input" />
                  <input placeholder="License Number (ABC/2025/123456)" value={newUserLicenseNumber} onChange={(e) => setNewUserLicenseNumber(e.target.value)} className="input" />
                </>
              )}

              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" required />
              <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input" required />

              <div className="flex justify-end mt-4">
                <button type="submit" className="bg-cyan-600 text-black px-6 py-2 rounded-lg hover:bg-cyan-700 transition">
                  ✅ Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Admin;
