// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [featuredMum, setFeaturedMum] = useState(null);

  useEffect(() => {
    // Fetch profiles (only mums) from backend
    axios.get('/profile')
      .then(response => {
        const mums = response.data.users.filter(user => user.bio && user.bio.toLowerCase().includes("mum"));
        const randomMum = mums[Math.floor(Math.random() * mums.length)];
        setFeaturedMum(randomMum);
      })
      .catch(error => {
        console.error("Error fetching profiles:", error);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Intro Section */}
      <section className="flex flex-col items-center justify-center py-16 bg-cyan-100">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome to Mama Afrika</h1>
        <p className="text-gray-600 max-w-2xl text-center text-lg">
          Empowering African mothers and healthcare workers with trusted support, knowledge, and community.
        </p>
      </section>

      {/* Meet Mama Africa Section */}
      {featuredMum && (
        <section className="flex flex-col md:flex-row items-center justify-center py-16 px-6 gap-12">
          {/* Mum's Photo */}
          <div className="w-64 h-64 bg-cyan-200 rounded-full overflow-hidden shadow-md">
            <img
              src="https://source.unsplash.com/featured/?african,woman,motherhood"
              alt="Mum"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Mum's Details */}
          <div className="flex flex-col items-start text-left max-w-md">
            <h2 className="text-3xl font-bold text-cyan-700 mb-2">Meet {featuredMum.full_name}</h2>
            <p className="text-gray-600 mb-2"><strong>Region:</strong> {featuredMum.region}</p>
            <p className="text-gray-600"><strong>About:</strong> {featuredMum.bio}</p>
          </div>
        </section>
      )}
    </div>
  );
}
