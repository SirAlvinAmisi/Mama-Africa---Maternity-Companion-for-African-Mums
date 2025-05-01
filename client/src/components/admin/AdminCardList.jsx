import AdminCard from './AdminCard';
import axios from 'axios';

export default function AdminCardList({ users, refreshUsers }) {
  const handleDeactivate = async (userId) => {
    try {
      await axios.patch(`http://localhost:5000/admin/deactivate_user/${userId}`);
      console.log(`User ${userId} deactivated`);
      refreshUsers();
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this user?");
      if (!confirmed) return;
  
      await axios.delete(`http://localhost:5000/admin/delete_user/${userId}`);
      refreshUsers(); // Re-fetch list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  

  const handleViewActivity = (userId) => {
    console.log(`Activity log for user ${userId}`);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {users.map(user => (
        <AdminCard
          key={user.id}
          user={user}
          onDeactivate={() => handleDeactivate(user.id)}
          onDelete={() => handleDelete(user.id)}
          onViewActivity={() => handleViewActivity(user.id)}
        />
      ))}
    </div>
  );
}
