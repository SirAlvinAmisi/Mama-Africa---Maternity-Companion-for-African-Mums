// NutritionDashboard.jsx

import React from 'react';

const nutritionArticles = [
  {
    id: 1,
    title: 'First Trimester Superfoods for African Mums',
    summary: 'Explore nutrient-rich foods like sukuma wiki, millet porridge, and indigenous greens that support early fetal development.',
    image: 'https://www.istockphoto.com/photo/african-pregnant-woman-eating-healthy-salad-gm1309328442-398275456',
    author: 'Dr. Achieng Odongo',
    publishedAt: 'May 10, 2025'
  },
  {
    id: 2,
    title: 'Iron-Rich African Diet for Expecting Mothers',
    summary: 'Learn how to incorporate beans, liver, and leafy greens into your diet to combat anemia during pregnancy.',
    image: 'https://www.istockphoto.com/photo/pregnant-african-woman-holding-bowl-of-vegetables-gm1279328442-398275456',
    author: 'Dr. Wanjiru Kamau',
    publishedAt: 'April 28, 2025'
  },
  {
    id: 3,
    title: 'Healthy Traditional Kenyan Meals for Pregnant Women',
    summary: 'Discover safe and nourishing ways to enjoy traditional dishes like ugali, fish stew, and arrowroots for maternal wellness.',
    image: 'https://www.istockphoto.com/photo/pregnant-woman-preparing-traditional-kenyan-meal-gm1279328442-398275456',
    author: 'Mama Grace (Community Health Volunteer)',
    publishedAt: 'April 15, 2025'
  }
];


const NutritionDashboard = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Nutrition Hub for African Mums</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {nutritionArticles.map(article => (
          <div key={article.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              <p className="text-gray-600 text-sm mb-3">{article.summary}</p>
              <div className="text-xs text-gray-500">
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
