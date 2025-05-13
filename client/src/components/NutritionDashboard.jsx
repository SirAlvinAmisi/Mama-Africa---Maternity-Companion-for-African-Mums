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
    <div className="p-6 max-w-6xl mx-auto font-sans bg-cyan-200 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-cyan-900 mb-6">Nutrition Hub for African Mums</h1>
      <p className="mb-6 text-cyan-900 font-bold">
       Explore all things nutrition.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {nutritionArticles.map((item, index) => (
          <div
            key={index}
            className="flex flex-col bg-cyan-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full"
          >
            <img
              src={item.image}
              alt={item.summary}
              className="w-full h-48 text-black object-cover"
            />
            <div className="flex flex-col justify-between p-8 flex-grow p-4">
              <div>
                <h2 className="text-xl font-semibold text-cyan-900 mb-2">
                  Week {item.id}
                </h2>
                <p className="text-gray-700 mb-4">{item.summary}</p>
              </div>
              <div className="text-sm text-gray-600 mt-auto">
                <p className="italic">By {item.author}</p>
                <p className="text-xs">{item.publishedAt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
export default NutritionDashboard;
