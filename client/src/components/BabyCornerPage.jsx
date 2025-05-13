import React from 'react';

const babyGrowthData = [
  {
    week: 8,
    size: 'Size of a groundnut',
    image: 'https://i.pinimg.com/736x/d8/19/6f/d8196f7c10e91d9e1fc880eb3c861a85.jpg',
  },
  {
    week: 12,
    size: 'Size of a nduma (arrowroot)',
    image: 'https://i.pinimg.com/736x/06/5d/b8/065db85001f59e10d7890b4bede9d843.jpg',
  },
  {
    week: 16,
    size: 'Size of a mango',
    image: 'https://i.pinimg.com/736x/c4/41/60/c44160336851753abc03b27896af17b4.jpg',
  },
  {
    week: 20,
    size: 'Size of a maize cob',
    image: 'https://i.pinimg.com/736x/1c/09/8d/1c098de09433dfd928107f372640d969.jpg',
  },
  {
    week: 24,
    size: 'Size of a sweet potato',
    image: 'hhttps://i.pinimg.com/736x/a6/6a/0c/a66a0c5327d43c709525083489b0955e.jpg',
  },
  {
    week: 28,
    size: 'Size of a coconut',
    image: 'https://i.pinimg.com/736x/29/2c/11/292c11d8fce55366be9edf5608ff285e.jpg',
  },
  {
    week: 32,
    size: 'Size of a papaya',
    image: 'https://i.pinimg.com/736x/9d/1c/e6/9d1ce66a82f7354aeb6fdb47e75220da.jpg',
  },
  {
    week: 36,
    size: 'Size of a watermelon',
    image: 'https://i.pinimg.com/736x/25/e9/47/25e9471c8dac786c505ff3d4a5dc1114.jpg',
  },
  {
    week: 40,
    size: 'Ready to meet you!',
    image: 'https://i.pinimg.com/736x/e0/48/1c/e0481cb8f58d9ad8d161212a3fb8ba5a.jpg',
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
