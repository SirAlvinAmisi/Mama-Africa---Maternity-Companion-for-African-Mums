// src/components/admin/AdminCardList.jsx
import AdminCard from './AdminCard';

export default function AdminCardList() {
  // Mock data - will be replaced with props later
  const mockUsers = [
    {
      id: 1,
      email: "admin@mamaafrika.com",
      role: "admin",
      created_at: new Date(),
      profile: {
        full_name: "Admin User"
      }
    },
    {
      id: 2,
      email: "doctor@mamaafrika.com",
      role: "health_pro",
      created_at: new Date('2024-01-15'),
      profile: {
        full_name: "Dr. Kipsang"
      }
    }
  ];

  // Mock handlers
  const handleDeactivate = (userId) => {
    console.log(`Would deactivate user ${userId} in real implementation`);
  };

  const handleEdit = (userId) => {
    console.log(`Would edit user ${userId} in real implementation`);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {mockUsers.map(user => (
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