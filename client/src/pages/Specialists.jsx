// CombinedCommunityPage.js
import React, { useState, useEffect } from 'react';

const Specialists = () => {

  const [specialists, setSpecialists] = useState([]);
  const [currentSpecialistIndex, setCurrentSpecialistIndex] = useState(0);
  

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [articles, setArticles] = useState([]);
  

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {

        const specialistsRes = await fetch('/api/specialists');
        const specialistsData = await specialistsRes.json();
        setSpecialists(specialistsData);


        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    if (!selectedCategory) return;
    
    const fetchArticles = async () => {
      try {
        const res = await fetch(`/api/articles?category=${selectedCategory}`);
        const data = await res.json();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, [selectedCategory]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="specialists-page">
      <div className="specialist-profile">
        <h2 className="profile-heading">Profile</h2>
        {specialists.length > 0 && (
          <div className="profile-card">
            <button className="left-button" onClick={() => 
              setCurrentSpecialistIndex(prev => (prev - 1 + specialists.length) % specialists.length)
            }>
              ⬅️
            </button>
            <img
              className="profile-image"
              src={specialists[currentSpecialistIndex]?.profile_picture}
              alt="Profile"
            />
            <div>
              <h3 className="profile-name">{specialists[currentSpecialistIndex]?.name}</h3>
              <p className="specialist-speciality">{specialists[currentSpecialistIndex]?.speciality}</p>
              <button className="specialist-card-btn">Consult</button>
            </div>
            <button className="right-button" onClick={() => 
              setCurrentSpecialistIndex(prev => (prev + 1) % specialists.length)
            }>
              ➡️
            </button>
          </div>
        )}
      </div>
      <div className="specialists-list">
        <h1>Meet Mama Africa Specialists</h1>
        <div className="all-specialists-card">
          {specialists.map((specialist, index) => (
            <div className='specialist-card' key={index}>
              <img 
                className='specialist-card-image' 
                src={specialist.profile_picture} 
                alt='Profile'
              />
              <h2 className='specialist-card-title'>{specialist.name}</h2>
              <p className='specialist-card-speciality'>{specialist.speciality}</p>
              <button className='specialist-card-btn'>Consult</button>
            </div>
          ))}
        </div>
      </div>

      <div className="articles-section">
        <h2 className="category-heading">Articles</h2>
        <div className="category-list">
          {categories.map((category, index) => (
            <button 
              key={index} 
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="articles-list">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <div key={index} className="article-card">
                <h3>{article.title}</h3>
                <p>{article.description}</p>
              </div>
            ))
          ) : (
            <p>Select a category to view articles</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Specialists;