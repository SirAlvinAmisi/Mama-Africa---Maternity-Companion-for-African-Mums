import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Needed to get the :id from URL
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export const HealthProfessional = () => {
  const { id } = useParams(); // Get id from URL
  const [profile, setProfile] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfileAndArticles = async () => {
      try {
        // Fetch specific health professional profile by ID
        const profileResponse = await axios.get(`http://localhost:5000/healthpros/${id}`);
        setProfile(profileResponse.data.health_professional);

        // Fetch only articles authored by this professional
        const articlesResponse = await axios.get(`http://localhost:5000/articles/author/${id}`);
        setArticles(articlesResponse.data.articles || []);
      } catch (error) {
        console.error('Error fetching profile or articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndArticles();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-2xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col min-h-screen w-full">
      {/* Main Section */}
      <main className="flex-1">
        {/* Profile Section */}
        <section className="container mx-auto px-6 pt-16 pb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Image */}
            <div className="w-[334px] h-[249px] rounded-[80px] overflow-hidden">
              <img
                src={profile?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'Profile')}`}
                alt={profile?.full_name || 'Profile'}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Profile Details */}
            {profile ? (
              <div className="flex flex-col gap-6">
                <div className="font-montserrat font-normal text-black text-[40px]">
                  Speciality: {profile.speciality || "Health Specialist"}
                </div>
                <div className="font-montserrat font-normal text-black text-[40px]">
                  Region: {profile.region}
                </div>
                <div className="font-montserrat font-medium text-green text-[40px]">
                  Verified
                </div>
              </div>
            ) : (
              <div>Loading profile...</div>
            )}
          </div>

          {/* Name */}
          {profile && (
            <h1 className="font-montserrat font-medium text-black text-[40px] mt-6">
              {profile.full_name}
            </h1>
          )}
        </section>

        {/* Published Articles Section */}
        <section className="w-full bg-cards-color rounded-[20px] p-12">
          <div className="flex flex-col items-center">
            <h2 className="font-montserrat font-medium text-[#665e5e] text-5xl mb-12">
              Published Articles
            </h2>

            <div className="flex flex-wrap gap-8 justify-center">
              {articles.length > 0 ? (
                articles.map((article) => (
                  <div 
                    key={article.id} 
                    className="w-[300px] bg-white rounded-2xl p-6 flex flex-col justify-between shadow-md hover:shadow-lg transition"
                  >
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-3 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {article.content ? article.content.slice(0, 100) + '...' : 'No preview available.'}
                      </p>
                    </div>
                    <div className="flex justify-end">
                    <button 
                      onClick={() => navigate(`/article/${article.id}`)}
                      className="text-xs bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-full transition"
                    >
                      Read More
                    </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-xl">No articles published yet.</p>
              )}
            </div>

          </div>
        </section>

      </main>
    </div>
  );
};
