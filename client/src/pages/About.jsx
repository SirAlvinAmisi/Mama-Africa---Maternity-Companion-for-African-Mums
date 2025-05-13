import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      
      {/* About Section */}
      <section className="mb-12 bg-cyan-50 rounded-xl shadow-sm p-6">
        <h1 className="text-4xl font-bold text-cyan-900 mb-4">About Mama Afrika</h1>
        <p className="text-gray-700 leading-relaxed">
          Mama Afrika is a community-driven platform dedicated to supporting women during pregnancy and motherhood, 
          with a particular focus on African mothers and their unique needs.
        </p>
        
        <div className="mt-6 mb-6 p-4 border-l-4 border-cyan-800 bg-cyan-100 italic text-lg rounded-md">
          Our mission is to empower every mother with knowledge, support, and community throughout their 
          maternal journey, ensuring healthier outcomes for both mothers and babies.
        </div>
        
        <p className="text-gray-700 leading-relaxed">
          Founded in 2023, Mama Afrika bridges the gap in maternal healthcare access by connecting mothers 
          with specialists, resources, and fellow mothers who understand their experiences.
        </p>
      </section>

      {/* What We Offer */}
      <section className="mb-12 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-3xl font-semibold text-cyan-900 mb-4">What We Offer</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Expert advice from healthcare professionals specialized in maternal care</li>
          <li>Community forums for sharing experiences and seeking support</li>
          <li>Educational resources on pregnancy, childbirth, and early childcare</li>
          <li>Culturally relevant information centered on African mothers' needs</li>
          <li>Tracking tools for pregnancy milestones and baby development</li>
        </ul>
      </section>

      {/* Our Team */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-cyan-900 mb-6">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { name: 'Alvin Amisi', role: 'Chief Executive Officer (CEO)', image: '/images/Alvin.jpeg' },
            { name: 'Sayfudin Sheikh', role: 'Chief Financial Officer (CFO)', image: '/images/Seif.jpeg' },
            { name: 'Mwangi Martha', role: 'Chief Operations Officer (COO)', image: '/images/Martha.jpg' },
            { name: 'Margaret Gathoni', role: 'Head of Innovation & Creativity', image: '/images/margret.jpg' },
            { name: 'Damaris Ngari', role: 'Director of Community Engagement (DCE)', image: '/images/damah.jpeg' },
            { name: 'Dennis Kipsang', role: 'Chief Technology Officer (CTO)', image: '/images/kipsang.jpeg' },
          ].map((member, idx) => (
            <div key={idx} className="text-center rounded-xl bg-white shadow-md p-6 hover:shadow-lg hover:bg-cyan-50 transition">
              <img
                src={member.image}
                alt={member.name}
                className="w-36 h-36 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="font-bold text-lg text-cyan-900">{member.name}</h3>
              <p className="text-sm text-gray-600 font-medium">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Join Community */}
      <section className="mb-12 bg-cyan-50 rounded-xl shadow-sm p-6 text-center">
        <h2 className="text-3xl font-semibold text-cyan-900 mb-4">Join Our Community</h2>
        <p className="text-gray-700 max-w-3xl mx-auto">
          Whether you're expecting, a new mother, or an experienced parent willing to share your wisdom, 
          Mama Afrika welcomes you. Together, we can support each other through the beautiful and 
          challenging journey of motherhood.
        </p>

        <button 
          onClick={() => navigate('/signup')}
          className="mt-6 px-6 py-3 bg-cyan-700 text-white rounded-full text-base hover:bg-cyan-800 transition shadow-md"
        >
          Sign Up Today
        </button>
      </section>

    </div>
  );
};

export default About;
