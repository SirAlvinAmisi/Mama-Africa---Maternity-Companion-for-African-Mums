// import AdminCard from './AdminCard';
// import axios from 'axios';

// export default function AdminCardList({ users, refreshUsers }) {
//   const handleDeactivate = async (userId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.patch(`http://localhost:5000/admin/deactivate_user/${userId}`, {}, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       refreshUsers();
//     } catch (error) {
//       console.error('Error deactivating user:', error);
//       alert(error?.response?.data?.error || "Deactivation failed");
//     }
//   };
  

//   const handleDelete = async (userId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return alert("No token");
  
//       const confirmed = window.confirm("Delete user?");
//       if (!confirmed) return;
  
//       await axios.delete(`http://localhost:5000/admin/delete_user/${userId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       refreshUsers();
//     } catch (err) {
//       console.error("Error deleting user:", err);
//       alert(err?.response?.data?.error || "Delete failed");
//     }
//   };
  
  
//   const handleResetPassword = async (userId) => {
//     try {
//       await axios.post(`http://localhost:5000/admin/reset_password/${userId}`);
//       alert("Password reset email sent.");
//     } catch (error) {
//       console.error("Error resetting password:", error);
//     }
//   };

//   const handleViewActivity = (userId) => {
//     window.location.href = `/profile/${userId}`;
//   };

//   const handleApproveHealthPro = async (userId) => {
//     try {
//       const confirmed = window.confirm("Have you confirmed the license number is valid?");
//       if (!confirmed) return;

//       const res = await axios.post(`http://localhost:5000/admin/approve_healthpro/${userId}`);
//       alert(res.data.message);
//       refreshUsers();
//     } catch (error) {
//       alert(error.response?.data?.error || "Verification failed");
//     }
//   };

//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//       {users.map(user => (
//         <AdminCard
//           key={user.id}
//           user={user}
//           onDeactivate={() => handleDeactivate(user.id)}
//           onDelete={() => handleDelete(user.id)}
//           onViewActivity={() => handleViewActivity(user.id)}
//           onResetPassword={() => handleResetPassword(user.id)}
//           onApproveHealthPro={() => handleApproveHealthPro(user.id)}
//         />
//       ))}
//     </div>
//   );
// }
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

  const handleDeactivate = async (userId) => {
    try {
      await axios.patch(`http://localhost:5000/admin/deactivate_user/${userId}`, {}, authHeaders);
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

      await axios.post(`http://localhost:5000/admin/approve_healthpro/${userId}`, {}, authHeaders);
      alert("Health pro verified.");
      refreshUsers();
    } catch (error) {
      alert(error.response?.data?.error || "Verification failed");
    }
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
          onResetPassword={() => handleResetPassword(user.id)}
          onApproveHealthPro={() => handleApproveHealthPro(user.id)}
        />
      ))}
    </div>
  );
}
