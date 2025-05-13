import React from 'react';

const nutritionArticles = [
  {
    id: 1,
    title: 'First Trimester Superfoods for African Mums',
    summary: 'Explore nutrient-rich foods like sukuma wiki, millet porridge, and indigenous greens that support early fetal development.',
    image: 'https://i.pinimg.com/736x/30/bb/93/30bb93d89f5eeee3f199c0ffe9191467.jpg',
    author: 'Dr. Achieng Odongo',
    publishedAt: 'May 10, 2025'
  },
  {
    id: 2,
    title: 'Iron-Rich African Diet for Expecting Mothers',
    summary: 'Learn how to incorporate beans, liver, and leafy greens into your diet to combat anemia during pregnancy.',
    image: 'https://i.pinimg.com/736x/db/09/ed/db09edf4115f6870bf4327a55bd06739.jpg',
    author: 'Dr. Wanjiru Kamau',
    publishedAt: 'April 28, 2025'
  },
  {
    id: 3,
    title: 'Healthy Traditional Kenyan Meals for Pregnant Women',
    summary: 'Discover safe and nourishing ways to enjoy traditional dishes like ugali, fish stew, and arrowroots for maternal wellness.',
    image: 'https://i.pinimg.com/736x/53/a9/69/53a969d32288138a9fcbaa5058a2948b.jpg',
    author: 'Mama Grace (Community Health Volunteer)',
    publishedAt: 'April 15, 2025'
  }
];

const NutritionDashboard = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-cyan-900 mb-6">Nutrition Hub for African Mums</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {nutritionArticles.map(article => (
          <div key={article.id} className="bg-cyan-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-cyan-900 mb-2">{article.title}</h2>
              <p className="text-gray-700 text-sm mb-3">{article.summary}</p>
              <div className="text-xs text-gray-600">
                By {article.author} • {article.publishedAt}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionDashboard;
