// src/pages/Specialists.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Specialists = () => {
  const navigate = useNavigate();
  const [specialists, setSpecialists] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const specialistsResponse = await axios.get('http://localhost:5000/healthpros');
        setSpecialists(specialistsResponse.data.specialists || []);

        const articlesResponse = await axios.get('http://localhost:5000/articles?limit=5');
        setArticles(articlesResponse.data.articles || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-xl sm:text-2xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Specialization Section */}
      <section className="py-16 px-4 sm:px-8 bg-cyan-50">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-cyan-700 mb-10">
          Areas We Specialize In
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">

  {[
    "Nutrition", "Mental Health", "Fitness", "Lactation Support",
    "Childbirth Education", "Postpartum Care", "Family Planning", "Pregnancy Fitness"
  ].map((specialty, index) => (
    <div
      key={index}
      className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center text-sm sm:text-base md:text-lg font-semibold text-cyan-700 text-center"
    >
      {specialty}
    </div>
  ))}
</div>

      </section>

      {/* Meet Our Specialists */}
      <section className="py-16 px-4 sm:px-8 bg-gray-50">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-cyan-700 mb-10">
          Meet Our Specialists
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {specialists.map((specialist) => (
            <div
              key={specialist.id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/specialist/${specialist.id}`)}
            >
              <img
                src={specialist.profile_picture || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 text-center">
                {specialist.full_name}
              </h3>
              <p className="text-sm sm:text-base text-gray-500 text-center">
                {specialist.speciality}
              </p>
              <div className="flex gap-4">
                <button className="bg-cyan-600 text-white rounded-full px-4 py-2 mt-4 hover:bg-cyan-700 text-xs sm:text-sm">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-16 px-4 sm:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-cyan-700 mb-10">
          Latest Articles
        </h2>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3">
                    {article.content.slice(0, 100)}...
                  </p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => navigate(`/article/${article.id}`)}
                    className="text-xs sm:text-sm bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-full transition"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg sm:text-xl">
            No articles available yet.
          </p>
        )}
      </section>
    </div>
  );
};

export default Specialists;
