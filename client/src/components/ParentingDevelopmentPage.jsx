import React, { useEffect, useState } from 'react';

const ParentingDevelopmentPage = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Hotcoded articles with images
    const dummyArticles = [
      {
        id: 1,
        title: "The Power of Responsive Parenting",
        content:
          "Children thrive when their caregivers are responsive. Research shows that children who receive consistent and warm responses from their parents develop better social and emotional skills.",
        image: "https://i.pinimg.com/736x/79/31/e2/7931e2dd9f9d4e4f54054f6de5414b1d.jpg", // replace with your own or local assets
      },
      {
        id: 2,
        title: "Play is Brain Work",
        content:
          "Unstructured play helps children develop cognitive flexibility and executive function. According to the American Academy of Pediatrics, play is essential to development because it contributes to cognitive, physical, social, and emotional well-being.",
        image: "https://i.pinimg.com/736x/1c/8f/89/1c8f899168970ca3bce5c60661ed835f.jpg",
      },
      {
        id: 3,
        title: "Early Attachment Shapes the Future",
        content:
          "Secure attachment in the first two years of life is linked to better academic performance and emotional regulation. Studies show that early bonding impacts future relationships and resilience.",
        image: "https://i.pinimg.com/736x/76/55/9e/76559e09a827fc0e0733c05435f85c3c.jpg",
      },
      {
        id: 4,
        title: "Reading Aloud Boosts Brain Development",
        content:
          "Reading to children from infancy stimulates brain growth and helps language acquisition. A 2015 study by the AAP found that reading aloud to children every day builds literacy and emotional connection.",
        image: "https://i.pinimg.com/736x/32/9e/7b/329e7b52bc63bd163632d865b73d8dff.jpg",
      },
      {
        id: 5,
        title: "Nutrition and Early Brain Growth",
        content:
          "The first 1,000 days (from conception to age 2) are critical for brain development. Proper nutrition during this period lays the foundation for lifelong learning and behavior.",
        image: "https://i.pinimg.com/736x/31/9c/65/319c65ee5aa534bae0de735bf158bab6.jpg",
      },
      {
        id: 6,
        title: "Parental Mental Health Affects Children",
        content:
          "Children of parents with untreated mental health issues are more likely to struggle emotionally and academically. Support for maternal mental health leads to better outcomes for both mother and child.",
        image: "https://i.pinimg.com/736x/4f/b6/52/4fb652c4ec3438ef56cdfdaf506da684.jpg",
      },
    ];

    setArticles(dummyArticles);
  }, []);
const ParentingDevelopment = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-cyan-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-cyan-700 mb-6">Parenting Development Articles</h1>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                <p className="text-gray-600">{article.content.slice(0, 100)}...</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentingDevelopment;
