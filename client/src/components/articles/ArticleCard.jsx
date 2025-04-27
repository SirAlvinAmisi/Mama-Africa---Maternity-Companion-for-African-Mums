export default function ArticleCard({ article, isAdmin = false }) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm relative hover:shadow-md transition-shadow">
      {/* Approval Status (Admin only) */}
      {isAdmin && article.is_medical && (
        <div className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full ${
          article.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {article.is_approved ? '✓ Approved' : 'Pending Approval'}
        </div>
      )}

      {/* Verified Badge */}
      {article.author?.role === 'health_pro' && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Verified Pro
        </div>
      )}

      {/* Article Cover Image */}
      <div className="bg-gray-100 h-48 flex items-center justify-center relative">
        {article.media_url ? (
          <img 
            src={article.media_url} 
            alt={article.title}
            className="object-cover h-full w-full"
          />
        ) : (
          <span className="text-gray-400">No preview available</span>
        )}
        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {article.file_type || 'Article'}
        </div>
      </div>

      {/* Article Content */}
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="inline-block px-2 py-1 text-xs bg-cyan-100 text-cyan-800 rounded-full">
            {article.category}
          </span>
          {article.is_medical && (
            <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
              Medical Content
            </span>
          )}
        </div>
        
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
          {article.content}
        </p>

        {/* Author/Date Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <div className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center mr-2">
              {article.author?.profile?.full_name?.charAt(0) || 'D'}
            </div>
            <span>Dr. {article.author?.profile?.full_name?.split(' ')[0] || 'Professional'}</span>
          </div>
          <span>{new Date(article.created_at).toLocaleDateString()}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between border-t pt-3">
          <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full">
            Read More
          </button>
          <div className="flex gap-2">
            <button className="text-gray-500 hover:text-blue-500 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button className="text-gray-500 hover:text-red-500 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="mt-3 pt-3 border-t flex justify-between">
            <button className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
              View Analytics
            </button>
            <button className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
              Remove Article
            </button>
          </div>
        )}
      </div>
    </div>
  );
}