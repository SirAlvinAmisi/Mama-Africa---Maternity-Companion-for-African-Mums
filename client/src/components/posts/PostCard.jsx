export default function PostCard({ post, isAdmin = false }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
      {/* Author Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="bg-cyan-100 text-cyan-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
            {post.author?.profile?.full_name?.charAt(0) || 'A'}
          </div>
          <div>
            <h3 className="font-semibold">{post.author?.profile?.full_name || 'Anonymous'}</h3>
            <p className="text-xs text-gray-500">
              {new Date(post.created_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        {post.author?.role === 'health_pro' && (
          <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">
            Health Pro
          </span>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-3">
        <h4 className="font-bold text-lg mb-1">{post.title}</h4>
        <p className="text-gray-700">{post.content}</p>
      </div>

      {/* Category and Status */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
          post.is_medical ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {post.category}
        </span>
        
        {post.is_medical && (
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
            post.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {post.is_approved ? 'Approved' : 'Pending Approval'}
          </span>
        )}
      </div>

      {/* Admin Actions */}
      {isAdmin && post.is_medical && !post.is_approved && (
        <div className="flex gap-2 mb-3">
          <button className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
            Approve
          </button>
          <button className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
            Reject
          </button>
          <button className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600">
            Flag
          </button>
        </div>
      )}

      {/* Media Preview */}
      {post.media_url && (
        <div className="mb-3 rounded overflow-hidden bg-gray-100 h-40 flex items-center justify-center">
          {post.media_url.includes('.mp4') ? (
            <div className="flex items-center">
              <span className="mr-2">🎥</span> Video Content
            </div>
          ) : (
            <img 
              src={post.media_url} 
              alt="Post media" 
              className="object-cover h-full w-full"
            />
          )}
        </div>
      )}

      {/* Comment Section */}
      <div className="border-t pt-3 flex justify-between items-center">
        <button className="text-cyan-600 hover:text-cyan-800 text-sm flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {post.comments?.length || 0} comments
        </button>
        <button className="text-gray-500 hover:text-red-500 text-sm flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Like
        </button>
      </div>
    </div>
  );
}