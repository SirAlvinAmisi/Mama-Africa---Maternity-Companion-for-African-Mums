import { ShieldCheck, ShieldX, UserCheck, UserX, Trash2, Star } from 'lucide-react';

export default function AdminCard({
  user,
  onDeactivate,
  onDelete,
  onViewActivity,
  onResetPassword,
  onApproveHealthPro,
  onPromote,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition hover:shadow-lg">
      {/* Header */}
      <div className="bg-cyan-100 px-4 py-3 border-b flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-800 truncate">{user.email}</h3>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs font-bold rounded-full capitalize ${
              user.role === 'admin'
                ? 'bg-purple-300 text-purple-900'
                : user.role === 'health_pro'
                ? 'bg-green-100 text-black'
                : 'bg-blue-100 text-black'
            }`}
          >
            {user.role.replace('_', ' ')}
          </span>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              user.is_active ? 'bg-white text-black' : 'bg-red-100 text-red-800'
            }`}
          >
            {user.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 text-sm">
        <div className="flex items-center mb-4">
          <div className="bg-cyan-200 text-cyan-800 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-3">
            {user.profile?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="leading-tight">
            <p className="font-medium text-gray-800">{user.profile?.full_name || 'No name provided'}</p>
            <p className="text-gray-600 text-xs">
              Joined: {new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            {user.role === 'health_pro' && (
              <>
                <p className="text-xs text-black mt-1">Region: {user.profile?.region || '—'}</p>
                <p className="text-xs text-black">License: {user.profile?.license_number || '—'}</p>
                <p className={`text-xs mt-1 font-bold ${user.profile?.is_verified ? 'text-black' : 'text-yellow-600'}`}>
                  {user.profile?.is_verified ? '✅ Verified' : '❌ Not Verified'}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={onDeactivate}
            className={`flex items-center justify-center gap-1 px-3 py-2 rounded text-xs font-bold transition ${
              user.is_active
                ? 'bg-red-50 hover:bg-red-100 text-red-600'
                : 'bg-green-50 hover:bg-green-100 text-green-600'
            }`}
          >
            {user.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
            {user.is_active ? 'Deactivate' : 'Activate'}
          </button>

          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${user.profile?.full_name || 'this user'}?`)) {
                onDelete();
              }
            }}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-red-300 hover:bg-red-200 text-red-700 rounded text-xs font-bold transition"
          >
            <Trash2 size={16} />
            Delete
          </button>

          <button
            onClick={onPromote}
            className="col-span-2 flex items-center justify-center gap-1 px-3 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded text-xs font-bold transition"
          >
            <Star size={16} />
            Promote to Admin
          </button>
        </div>

        {/* Health Pro Verification */}
        {user.role === 'health_pro' && !user.profile?.is_verified && (
          <div className="mt-4 border-t pt-3">
            <button
              onClick={onApproveHealthPro}
              className="flex items-center justify-center gap-1 w-full text-xs font-bold text-cyan-700 bg-cyan-100 hover:bg-cyan-200 py-2 rounded transition"
            >
              <ShieldCheck size={16} />
              Mark as Verified (after manual check)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
