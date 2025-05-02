export default function AdminCard({ user, onDeactivate, onDelete, onViewActivity }) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Card Header */}
      <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">{user.email}</h3>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            user.role === 'admin' 
              ? 'bg-purple-100 text-purple-800' 
              : user.role === 'health_pro'
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {user.role.replace('_', ' ')}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full ${
            user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {user.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="bg-cyan-100 text-cyan-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
            {user.profile?.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="font-medium">{user.profile?.full_name || 'No name'}</p>
            <p className="text-sm text-gray-500">
              Joined: {new Date(user.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
            {user.role === 'health_pro' && (
              <p className="text-xs text-gray-500 mt-1">
                {user.profile?.region || 'No region specified'}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4">
          <button 
            onClick={onDeactivate}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition ${
              user.is_active 
                ? 'bg-red-50 hover:bg-red-100 text-red-600' 
                : 'bg-green-50 hover:bg-green-100 text-green-600'
            }`}
          >
            {user.is_active ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${user.profile?.full_name || 'this user'}?`)) {
                onDelete();
              }
            }}
            className="flex-1 py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-medium transition"
          >
            Delete
          </button>
        </div>

        {/* Admin Tools */}
        {user.role === 'admin' && (
          <div className="mt-3 pt-3 border-t">
            <button 
              onClick={onViewActivity}
              className="text-xs text-blue-600 hover:text-blue-800 mr-3"
            >
              View Activity Log
            </button>
            <button 
              onClick={() => onResetPassword(user.id)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Reset Password
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
