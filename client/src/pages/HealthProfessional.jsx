import { useEffect, useState } from 'react';
import axios from 'axios';

export const HealthProfessional = () => {
  const [profile, setProfile] = useState(null);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Fetch health professional profile
    axios.get('http://localhost:5000/healthpros') // Adjust backend URL if needed
      .then(response => {
        if (response.data.health_professionals.length > 0) {
          // Just pick the first health pro for now (or you can randomize)
          setProfile(response.data.health_professionals[0]);
        }
      })
      .catch(error => {
        console.error("Error fetching health professional:", error);
      });

    // Fetch articles
    axios.get('http://localhost:5000/articles')
      .then(response => {
        setArticles(response.data.articles || []);
      })
      .catch(error => {
        console.error("Error fetching articles:", error);
      });
  }, []);

  return (
    <div className="bg-white flex flex-col min-h-screen w-full">
      {/* Main Section */}
      <main className="flex-1">
        {/* Profile Section */}
        <section className="container mx-auto px-6 pt-16 pb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Image */}
            <div className="w-[334px] h-[249px] rounded-[80px] overflow-hidden">
              <img
                src="https://i.pinimg.com/736x/97/96/0f/97960f9d817738d322a6b1b02f05c6b7.jpg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Profile Details */}
            {profile ? (
              <div className="flex flex-col gap-6">
                <div className="font-montserrat font-normal text-black text-[40px]">
                  Speciality: {profile.bio || "Health Specialist"}
                </div>
                <div className="font-montserrat font-normal text-black text-[40px]">
                  Region: {profile.region}
                </div>
                <div className="font-montserrat font-medium text-green text-[40px]">
                  Verified
                </div>
              </div>
            ) : (
              <div>Loading profile...</div>
            )}
          </div>

          {/* Name */}
          {profile && (
            <h1 className="font-montserrat font-medium text-black text-[40px] mt-6">
              {profile.full_name}
            </h1>
          )}
        </section>

        {/* Published Articles Section */}
        <section className="w-full bg-cards-color rounded-[20px] p-12">
          <div className="flex flex-col items-center">
            <h2 className="font-montserrat font-medium text-[#665e5e] text-5xl mb-12">
              Published Articles
            </h2>

            <div className="flex flex-row gap-12 justify-center flex-wrap">
              {articles.length > 0 ? (
                articles.map((article, index) => (
                  <div
                    key={index}
                    className="w-[298px] h-[270px] bg-white rounded-[60px] flex flex-col items-center justify-center p-4 text-center shadow-md"
                  >
                    <span className="font-montserrat font-normal text-black text-2xl">
                      {article.title}
                    </span>
                    <p className="text-gray-500 text-sm mt-2">{article.category}</p>
                  </div>
                ))
              ) : (
                <p>No articles published yet.</p>
              )}
            </div>
          </div>
        </section>

        {/* New Articles Section */}
        <section className="w-full max-w-[930px] mx-auto my-8 bg-cards-color rounded-[20px] p-8">
          <div className="flex flex-col items-center">
            <h2 className="font-inria font-bold text-[#665e5e] text-5xl mb-6">
              New Articles
            </h2>

            <div className="w-full max-w-[681px] bg-white rounded-[60px] p-8">
              <div className="flex flex-col items-center pt-6">
                <p className="font-montserrat font-light text-black text-5xl mb-8">
                  Write new article
                </p>
                <div className="flex justify-end w-full">
                  <button className="bg-blue-button hover:bg-blue-button/90 rounded-[30px] h-[59px] px-10">
                    <span className="font-inria font-bold text-white text-4xl">
                      Post
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
