// client/src/components/admin/AdminCardList.jsx
import AdminCard from './AdminCard';
import axios from 'axios';

export default function AdminCardList({ users, refreshUsers }) {
  const token = localStorage.getItem('access_token');
  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    withCredentials: true
  };

  
  const handleDeactivate = async (user) => {
    try {
      const endpoint = user.is_active
        ? `/admin/deactivate/${user.id}`
        : `/admin/activate/${user.id}`;
      await axios.patch(`http://localhost:5000${endpoint}`, {}, authHeaders);
      refreshUsers();
    } catch (error) {
      console.error('Error deactivating user:', error);
      alert(error?.response?.data?.error || "Deactivation failed");
    }
  };


  const handleDelete = async (userId) => {
    try {
      const confirmed = window.confirm("Delete user?");
      if (!confirmed) return;

      await axios.delete(`http://localhost:5000/admin/delete_user/${userId}`, authHeaders);
      refreshUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err?.response?.data?.error || "Delete failed");
    }
  };

  const handleResetPassword = async (userId) => {
    try {
      await axios.post(`http://localhost:5000/admin/reset_password/${userId}`, {}, authHeaders);
      alert("Password reset email sent.");
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  const handleViewActivity = (userId) => {
    window.location.href = `/profile/${userId}`;
  };

  const handleApproveHealthPro = async (userId) => {
    try {
      const confirmed = window.confirm("Have you confirmed the license number is valid?");
      if (!confirmed) return;

      // ✅ Send POST request to approve a health professional
      await axios.post(`http://localhost:5000/admin/approve_healthpro/${userId}`, {}, authHeaders);
      alert("Health pro verified.");
      refreshUsers();
    } catch (error) {
      console.error("Error approving health professional:", error);
      alert(error.response?.data?.error || "Verification failed");
    }
  };
  const handlePromote = async (userId) => {
    try {
      const confirmed = window.confirm("Promote this user to admin?");
      if (!confirmed) return;

      await axios.patch(`http://localhost:5000/admin/promote/${userId}`, {}, authHeaders);
      alert("User promoted to admin.");
      refreshUsers();
    } catch (error) {
      console.error("Error promoting user:", error);
      alert(error?.response?.data?.error || "Promotion failed");
    }
  };


  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 text-black bg-cyan-100 font-semibold p-4 rounded-lg shadow-md">
      {users.map(user => (
        <AdminCard
          key={user.id}
          user={user}
          onDeactivate={() => handleDeactivate(user)}
          onDelete={() => handleDelete(user.id)}
          onViewActivity={() => handleViewActivity(user.id)}
          onResetPassword={() => handleResetPassword(user.id)}
          onApproveHealthPro={() => handleApproveHealthPro(user.id)} // ✅ Approve button visible for health pros
          onPromote={() => handlePromote(user.id)}
        />
      ))}
    </div>
  );
}