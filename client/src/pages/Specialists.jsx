// src/pages/Specialists.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Specialists = () => {
  const [specialists, setSpecialists] = useState([]);
  const [currentSpecialistIndex, setCurrentSpecialistIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const response = await axios.get('http://localhost:5000/healthpros'); 
        setSpecialists(response.data.specialists || []);
      } catch (error) {
        console.error('Error fetching specialists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialists();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-2xl">Loading...</p>
      </div>
    );
  }

  return (
         
    <div className="flex flex-col min-h-screen bg-white w-full">
      {/* Top Profile Carousel */}
      <section className="flex flex-col items-center justify-center bg-cyan-100 py-12 px-4 w-full">
        <h2 className="text-4xl font-bold text-cyan-700 mb-10">Featured Specialist</h2>

        {specialists.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <button
              onClick={() =>
                setCurrentSpecialistIndex(
                  (prev) => (prev - 1 + specialists.length) % specialists.length
                )
              }
              className="text-3xl text-cyan-700"
            >
              ⬅️
            </button>

            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
              <img
                src={specialists[currentSpecialistIndex].profile_picture || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover mb-4"
              />
              <h3 className="text-2xl font-semibold text-gray-800">{specialists[currentSpecialistIndex].full_name}</h3>
              <p className="text-gray-500 mb-2">{specialists[currentSpecialistIndex].speciality}</p>
              <button className="bg-cyan-600 text-white rounded-full px-6 py-2 mt-4 hover:bg-cyan-700 w-full">
                Consult
              </button>
            </div>

            <button
              onClick={() =>
                setCurrentSpecialistIndex(
                  (prev) => (prev + 1) % specialists.length
                )
              }
              className="text-3xl text-cyan-700"
            >
              ➡️
            </button>
          </div>
        )}
      </section>

      {/* All Specialists Grid */}
      <section className="py-16 px-6 bg-gray-50 w-full">
        <h2 className="text-4xl font-bold text-center text-cyan-700 mb-10">Meet Our Specialists</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto w-full">
          {specialists.map((specialist, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <img
                src={specialist.profile_picture || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 text-center">{specialist.full_name}</h3>
              <p className="text-gray-500 text-center">{specialist.speciality}</p>
              <button className="bg-cyan-600 text-white rounded-full px-4 py-2 mt-4 hover:bg-cyan-700 w-full">
                Consult
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Specialist Articles */}
      <section className="py-16 px-6 w-full">
        <h2 className="text-4xl font-bold text-center text-cyan-700 mb-10">Articles by {specialists[currentSpecialistIndex]?.full_name}</h2>

        {specialists[currentSpecialistIndex]?.articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {specialists[currentSpecialistIndex].articles.map((article, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{article.title}</h3>
                <p className="text-gray-600">{article.category}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-xl">No articles published yet.</p>
        )}
      </section>
    </div>
  );
};

export default Specialists;
