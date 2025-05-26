import AdminCard from './AdminCard';
import {
  deactivateUser,
  activateUser,
  deleteUser,
  resetUserPasswordById,
  approveHealthPro,
  promoteUserToAdmin,
} from '../../lib/api';

export default function AdminCardList({ users, refreshUsers }) {
  const handleDeactivate = async (user) => {
    try {
      if (user.is_active) {
        await deactivateUser(user.id);
      } else {
        await activateUser(user.id);
      }
      refreshUsers();
    } catch (error) {
      console.error('Error changing user status:', error);
      alert(error?.response?.data?.error || 'Status update failed');
    }
  };

  const handleDelete = async (userId) => {
    try {
      const confirmed = window.confirm('Delete user?');
      if (!confirmed) return;
      await deleteUser(userId);
      refreshUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(err?.response?.data?.error || 'Delete failed');
    }
  };

  const handleResetPassword = async (userId) => {
    try {
      await resetUserPasswordById(userId);
      alert('Password reset email sent.');
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  const handleViewActivity = (userId) => {
    window.location.href = `/profile/${userId}`;
  };

  const handleApproveHealthPro = async (userId) => {
    try {
      const confirmed = window.confirm('Have you confirmed the license number is valid?');
      if (!confirmed) return;
      await approveHealthPro(userId);
      alert('Health pro verified.');
      refreshUsers();
    } catch (error) {
      console.error('Error approving health professional:', error);
      alert(error?.response?.data?.error || 'Verification failed');
    }
  };

  const handlePromote = async (userId) => {
    try {
      const confirmed = window.confirm('Promote this user to admin?');
      if (!confirmed) return;
      await promoteUserToAdmin(userId);
      alert('User promoted to admin.');
      refreshUsers();
    } catch (error) {
      console.error('Error promoting user:', error);
      alert(error?.response?.data?.error || 'Promotion failed');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-cyan-50 rounded-xl shadow-inner">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {users.map(user => (
          <AdminCard
            key={user.id}
            user={user}
            onDeactivate={() => handleDeactivate(user)}
            onDelete={() => handleDelete(user.id)}
            onViewActivity={() => handleViewActivity(user.id)}
            onResetPassword={() => handleResetPassword(user.id)}
            onApproveHealthPro={() => handleApproveHealthPro(user.id)}
            onPromote={() => handlePromote(user.id)}
          />
        ))}
      </div>
    </div>
  );
}
