import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllSpecialists, fetchRecentArticles } from '../lib/api';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: 'spring', stiffness: 80 }
  })
};

const Specialists = () => {
  const navigate = useNavigate();
  const [specialists, setSpecialists] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const specialistsResponse = await fetchAllSpecialists();
        setSpecialists(specialistsResponse.specialists || []);

        const articlesResponse = await fetchRecentArticles(5);
        setArticles(articlesResponse.articles || []);
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
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-gray-600 text-xl sm:text-2xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white p-10 text-gray-800">

      {/* Specializations */}
      <section className="py-16 px-6 sm:px-10 md:px-16 lg:px-24 bg-gradient-to-r from-cyan-50 to-cyan-100">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-cyan-800 mb-12">
          Areas We Specialize In
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            "Nutrition", "Mental Health", "Fitness", "Lactation Support",
            "Childbirth Education", "Postpartum Care", "Family Planning", "Pregnancy Fitness"
          ].map((specialty, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl text-center font-medium text-cyan-700 transition-all text-sm sm:text-base md:text-lg"
            >
              {specialty}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Meet Our Specialists */}
      <section className="py-16 px-6 sm:px-10 md:px-16 lg:px-24 bg-gray-50">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-cyan-800 mb-12">
          Meet Our Specialists
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {specialists.map((specialist, index) => (
            <motion.div
              key={specialist.id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transition cursor-pointer"
              onClick={() => navigate(`/specialist/${specialist.id}`)}
            >
              <img
                src={specialist.profile_picture || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-top object-cover mb-4 border-4 border-cyan-300 bg-gray-100"
              />
              <h3 className="text-xl sm:text-2xl font-semibold mb-1">
                {specialist.full_name}
              </h3>
              <p className="text-sm sm:text-base text-gray-500">
                {specialist.speciality}
              </p>
              <button className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-full text-sm sm:text-base font-medium shadow-md">
                View Profile
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-16 px-6 sm:px-10 md:px-16 lg:px-24 bg-white">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-cyan-800 mb-12">
          Latest Articles
        </h2>
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="bg-cyan-50 rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition"
              >
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-cyan-800 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3">
                    {article.content.slice(0, 120)}...
                  </p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => navigate(`/article/${article.id}`)}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-full text-sm font-medium"
                  >
                    Read More
                  </button>
                </div>
              </motion.div>
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
