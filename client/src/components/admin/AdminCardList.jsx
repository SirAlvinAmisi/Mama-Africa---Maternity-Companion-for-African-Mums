import { useState } from 'react';
import AdminCard from './AdminCard';

export default function AdminCardList() {
  const [localUsers, setLocalUsers] = useState([
    {
      id: 1,
      email: 'admin@mama.africa',
      role: 'admin',
      is_active: true,
      profile: {
        full_name: 'Admin User',
        region: 'Nairobi',
        phone: '123-456-7890',
      },
      created_at: '2025-04-30T12:00:00Z',
    },
    {
      id: 2,
      email: 'dr.ouma@mama.africa',
      role: 'health_pro',
      is_active: false,
      profile: {
        full_name: 'Dr. Auma Ouma',
        region: 'Kisumu',
        phone: '987-654-3210',
      },
      created_at: '2025-04-30T12:00:00Z',
    },
    {
      id: 3,
      email: 'mum.jane@mama.africa',
      role: 'mum',
      is_active: true,
      profile: {
        full_name: 'Jane Doe',
        region: 'Mombasa',
        phone: '555-555-5555',
      },
      created_at: '2025-04-30T12:00:00Z',
    },
  ]);

  const fetchNewUsers = () => {
    const generateMockUser = (id) => ({
      id,
      email: `user${id}@mama.africa`,
      role: id % 2 === 0 ? 'health_pro' : 'mum',
      is_active: id % 2 === 0,
      profile: {
        full_name: `User ${id}`,
        region: `Region ${id}`,
        phone: `123-456-${String(id).padStart(4, '0')}`,
      },
      created_at: new Date().toISOString(),
    });

    const newUsers = Array.from({ length: 5 }, (_, i) => generateMockUser(localUsers.length + i + 1));

    setLocalUsers((prevUsers) => [...prevUsers, ...newUsers]);
    console.log('Fetched new users:', newUsers);
  };

  const handleDeactivate = (userId) => {
    setLocalUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, is_active: !user.is_active } : user
      )
    );
    console.log(`Toggled active status for user ID: ${userId}`);
  };

  const handleSave = (updatedUser) => {
    setLocalUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    console.log(`Saved changes for user ID: ${updatedUser.id}`);
  };

  const handleDelete = (userId) => {
    setLocalUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    console.log(`Deleted user ID: ${userId}`);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={fetchNewUsers}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Fetch New Users
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {localUsers.map((user) => (
          <AdminCard
            key={user.id}
            user={user}
            onDeactivate={() => handleDeactivate(user.id)}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
