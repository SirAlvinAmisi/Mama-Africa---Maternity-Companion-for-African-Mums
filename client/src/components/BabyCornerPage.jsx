import React from 'react';

const babyGrowthData = [
  {
    week: 8,
    size: 'Size of a groundnut',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Peanuts_in_shell.jpg',
  },
  {
    week: 12,
    size: 'Size of a nduma (arrowroot)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Arrowroot.JPG',
  },
  {
    week: 16,
    size: 'Size of a mango',
    image: 'https://images.unsplash.com/photo-1576402187874-38c6a1d23ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
  },
  {
    week: 20,
    size: 'Size of a maize cob',
    image: 'https://images.unsplash.com/photo-1590077195243-5fd8c6e8826c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
  },
  {
    week: 24,
    size: 'Size of a sweet potato',
    image: 'https://images.unsplash.com/photo-1606819655600-6cd4c5e88d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
  },
  {
    week: 28,
    size: 'Size of a coconut',
    image: 'https://images.unsplash.com/photo-1597633362234-05b7cb3292b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
  },
  {
    week: 32,
    size: 'Size of a papaya',
    image: 'https://images.unsplash.com/photo-1615475164786-f0d928e9a79b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
  },
  {
    week: 36,
    size: 'Size of a watermelon',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
  },
  {
    week: 40,
    size: 'Ready to meet you!',
    image: 'https://images.unsplash.com/photo-1595433562696-17e4b3ddbd0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
  },
];

const BabyCornerPage = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-cyan-900 mb-6">Baby Corner</h1>
      <p className="mb-6 text-gray-700">
        Track your baby's growth week by week with familiar African analogies.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {babyGrowthData.map((item, index) => (
          <div key={index} className="bg-cyan-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img src={item.image} alt={item.size} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-cyan-900 mb-2">Week {item.week}</h2>
              <p className="text-gray-700">{item.size}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BabyCornerPage;
