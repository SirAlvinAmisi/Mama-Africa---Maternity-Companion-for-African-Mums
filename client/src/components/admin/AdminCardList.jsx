// src/components/admin/AdminCardList.jsx
import AdminCard from './AdminCard';

export default function AdminCardList({ users }) {
  // Handlers passed down to each AdminCard
  const handleDeactivate = (userId) => {
    console.log(`Would deactivate user ${userId} in real implementation`);
  };

  const handleEdit = (userId) => {
    console.log(`Would edit user ${userId} in real implementation`);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {users.map(user => (
        <AdminCard
          key={user.id}
          user={user}
          onDeactivate={() => handleDeactivate(user.id)}
          onEdit={() => handleEdit(user.id)}
        />
      ))}
    </div>
  );
}
