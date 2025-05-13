import React from 'react';
import { useNavigate } from 'react-router-dom';

const Divider = () => (
  <div className="h-1 bg-gradient-to-r from-cyan-700 via-cyan-400 to-cyan-700 rounded-full my-8 animate-pulse"></div>
);

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto p-8 leading-relaxed bg-cyan-300 rounded-lg shadow-md border-l-4 border-cyan-800">
      
      {/* About Section */}
      <section className="mb-12 bg-cyan-100 p-6 rounded-md shadow-inner">
        <h1 className="text-cyan-900 text-3xl font-bold mb-4 flex items-center gap-2">🌍 About Mama Afrika</h1>
        <p className="text-black text-lg font-semibold mb-4">
          Mama Afrika is a community-driven platform dedicated to supporting women during pregnancy and motherhood, 
          with a particular focus on African mothers and their unique needs.
        </p>
        <div className="mt-6 mb-6 p-4 border-l-4 border-cyan-900 bg-cyan-50 italic text-black text-lg rounded-lg shadow-md">
          Our mission is to empower every mother with knowledge, support, and community throughout their 
          maternal journey, ensuring healthier outcomes for both mothers and babies.
        </div>
        <p className="text-black text-lg font-semibold mb-4">
          Founded in 2023, Mama Afrika bridges the gap in maternal healthcare access by connecting mothers 
          with specialists, resources, and fellow mothers who understand their experiences.
        </p>
      </section>

      <Divider />

      {/* What We Offer */}
      <section className="mb-12 bg-cyan-200 p-6 rounded-md shadow-inner">
        <h2 className="text-cyan-900 text-3xl font-bold mb-4 flex items-center gap-2">🎁 What We Offer</h2>
        <ul className="list-disc list-inside space-y-2 text-black text-lg bg-cyan-100 p-4 rounded-lg shadow-md">
          <li>Expert advice from healthcare professionals specialized in maternal care</li>
          <li>Community forums for sharing experiences and seeking support</li>
          <li>Educational resources on pregnancy, childbirth, and early childcare</li>
          <li>Culturally relevant information centered on African mothers' needs</li>
          <li>Tracking tools for pregnancy milestones and baby development</li>
        </ul>
      </section>

      <Divider />

      {/* Our Team */}
      <section className="mb-12 bg-cyan-100 p-6 rounded-md shadow-inner">
        <h2 className="text-cyan-900 text-3xl font-bold mb-4 flex items-center gap-2">🤝 Our Team</h2>
        <p className="text-black text-lg font-semibold mb-6">
          Mama Afrika is built by a visionary team of founders and developers, each bringing unique leadership, creativity, and passion to empower mothers through technology and community.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 bg-cyan-200 p-4 rounded-lg shadow-md">
          {[
            { name: 'Alvin Amisi', role: 'Chief Executive Officer (CEO)', img: '/images/Alvin.jpeg' },
            { name: 'Sayfudin Sheikh', role: 'Chief Financial Officer (CFO)', img: '/images/Seif.jpeg' },
            { name: 'Mwangi Martha', role: 'Chief Operations Officer (COO)', img: '/images/Martha.jpg' },
            { name: 'Margaret Gathoni', role: 'Head of Innovation & Creativity', img: '/images/margret.jpg' },
            { name: 'Damaris Ngari', role: 'Director of Community Engagement (DCE)', img: '/images/damah.jpeg' },
            { name: 'Dennis Kipsang', role: 'Chief Technology Officer (CTO)', img: '/images/kipsang.jpeg' }
          ].map((person, index) => (
            <div key={index} className="text-center rounded-xl shadow-md p-6 hover:shadow-xl hover:bg-cyan-100 transition">
              <img
                src={person.img}
                alt={person.name}
                className="w-36 h-36 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="font-bold text-lg text-cyan-900">{person.name}</h3>
              <p className="text-sm text-gray-600 font-bold">{person.role}</p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* Join Community */}
      <section className="mb-12 bg-cyan-200 p-6 rounded-md shadow-inner">
        <h2 className="text-cyan-900 text-3xl font-bold mb-4 flex items-center gap-2">👩🏾‍🤝‍👩🏽 Join Our Community</h2>
        <p className="text-black text-lg mb-6 bg-cyan-100 p-4 rounded-lg shadow-md">
          Whether you're expecting, a new mother, or an experienced parent willing to share your wisdom, 
          Mama Afrika welcomes you. Together, we can support each other through the beautiful and 
          challenging journey of motherhood.
        </p>

        <button 
          onClick={() => navigate('/signup')}
          className="px-6 py-3 bg-cyan-700 text-white font-bold rounded-md text-base hover:bg-cyan-800 transition"
        >
          Sign Up Today
        </button>
      </section>
    </div>
  );
};

export default About;
