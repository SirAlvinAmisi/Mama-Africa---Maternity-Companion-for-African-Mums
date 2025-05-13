import React from 'react';

const parentingArticles = [
  {
    id: 1,
    title: 'Bonding with Your Newborn: African Motherhood Traditions',
    summary: 'Discover time-honored African practices for bonding with your newborn, from skin-to-skin contact to lullabies in native languages.',
    author: 'Mama Grace (Community Health Volunteer)',
    publishedAt: 'May 12, 2025'
  },
  {
    id: 2,
    title: 'Early Childhood Development Milestones You Should Know',
    summary: 'Learn about key developmental milestones for your baby’s first year, explained in simple terms for mums.',
    author: 'Dr. Achieng Odongo',
    publishedAt: 'May 5, 2025'
  },
  {
    id: 3,
    title: 'Traditional African Remedies for Common Baby Discomforts',
    summary: 'Explore safe and effective traditional remedies passed down through generations to ease common baby ailments.',
    author: 'Dr. Wanjiru Kamau',
    publishedAt: 'April 30, 2025'
  }
];

const ParentingDevelopment = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <h1 className="text-4xl font-bold text-cyan-900 mb-4">Parenting & Development</h1>
      <p className="text-gray-700 mb-8 text-lg">
        Empowering African mums with knowledge on parenting, child development, and wellness practices.
      </p>

      <div className="space-y-6">
        {parentingArticles.map(article => (
          <div key={article.id} className="bg-cyan-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-cyan-900 mb-2 hover:underline cursor-pointer">
              {article.title}
            </h2>
            <p className="text-gray-700 text-base mb-3">
              {article.summary}
            </p>
            <div className="text-sm text-gray-500">
              By {article.author} • {article.publishedAt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentingDevelopment;
