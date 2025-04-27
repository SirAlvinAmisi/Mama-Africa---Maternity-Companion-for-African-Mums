import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto p-8 leading-relaxed">
      
      {/* About Section */}
      <section className="mb-12">
        <h1 className="text-cyan-700 text-3xl font-bold mb-4">About Mama Afrika</h1>
        <p>
          Mama Afrika is a community-driven platform dedicated to supporting women during pregnancy and motherhood, 
          with a particular focus on African mothers and their unique needs.
        </p>
        
        <div className="mt-6 mb-6 p-4 border-l-4 border-cyan-700 bg-gray-50 italic text-lg">
          Our mission is to empower every mother with knowledge, support, and community throughout their 
          maternal journey, ensuring healthier outcomes for both mothers and babies.
        </div>
        
        <p>
          Founded in 2023, Mama Afrika bridges the gap in maternal healthcare access by connecting mothers 
          with specialists, resources, and fellow mothers who understand their experiences.
        </p>
      </section>

      {/* What We Offer */}
      <section className="mb-12">
        <h2 className="text-cyan-700 text-2xl font-semibold mb-4">What We Offer</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Expert advice from healthcare professionals specialized in maternal care</li>
          <li>Community forums for sharing experiences and seeking support</li>
          <li>Educational resources on pregnancy, childbirth, and early childcare</li>
          <li>Culturally relevant information centered on African mothers' needs</li>
          <li>Tracking tools for pregnancy milestones and baby development</li>
        </ul>
      </section>

      {/* Our Team */}
      <section className="mb-12">
        <h2 className="text-cyan-700 text-2xl font-semibold mb-4">Our Team</h2>
        <p>
          Mama Afrika is brought to you by a dedicated team of healthcare professionals, 
          community advocates, and technology experts passionate about maternal health.
        </p>

        <div className="flex flex-wrap justify-center gap-8 mt-8">
          {/* Team member placeholders */}
          <div className="w-48 text-center">
            <div className="w-36 h-36 rounded-full bg-gray-300 mx-auto mb-4"></div>
            <h3 className="font-semibold">Fadilatu Amana</h3>
            <p className="text-sm text-gray-600">Founder & CEO</p>
          </div>

          <div className="w-48 text-center">
            <div className="w-36 h-36 rounded-full bg-gray-300 mx-auto mb-4"></div>
            <h3 className="font-semibold">Dr. Sarah Mensah</h3>
            <p className="text-sm text-gray-600">Medical Director</p>
          </div>

          <div className="w-48 text-center">
            <div className="w-36 h-36 rounded-full bg-gray-300 mx-auto mb-4"></div>
            <h3 className="font-semibold">Kofi Adetokunbo</h3>
            <p className="text-sm text-gray-600">Community Lead</p>
          </div>
        </div>
      </section>

      {/* Join Community */}
      <section className="mb-12">
        <h2 className="text-cyan-700 text-2xl font-semibold mb-4">Join Our Community</h2>
        <p>
          Whether you're expecting, a new mother, or an experienced parent willing to share your wisdom, 
          Mama Afrika welcomes you. Together, we can support each other through the beautiful and 
          challenging journey of motherhood.
        </p>

        <button 
          onClick={() => navigate('/signup')}
          className="mt-6 px-6 py-3 bg-cyan-700 text-white rounded-md text-base hover:bg-cyan-800 transition"
        >
          Sign Up Today
        </button>
      </section>

    </div>
  );
};

export default About;
