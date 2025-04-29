import { useNavigate } from 'react-router-dom';

export default function ArticleCard({ article, isAdmin = false }) {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm relative hover:shadow-md transition-shadow">
      {/* All your previous content */}
      
      {/* Replace the Read More button */}
      <div className="flex justify-between border-t pt-3">
        <button 
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full"
          onClick={() => navigate(`/article/${article.id}`)}
        >
          Read More
        </button>
        
        {/* Like and Share buttons */}
        <div className="flex gap-2">
          {/* Like and Share Buttons */}
        </div>
      </div>

      {/* Admin Actions */}
    </div>
  );
}
