// src/pages/HealthProfessional.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const HealthProfessional = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [articles, setArticles] = useState([]);
  const [recommendedClinics, setRecommendedClinics] = useState([]);
  const [uploadedScans, setUploadedScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const profileRes = await axios.get(`http://localhost:5000/healthpros/${id}`);
        setProfile(profileRes.data.health_professional);

        const articlesRes = await axios.get(`http://localhost:5000/articles/author/${id}`);
        setArticles(articlesRes.data.articles || []);

        const clinicsRes = await axios.get(`http://localhost:5000/clinics/healthpro/${id}`);
        setRecommendedClinics(clinicsRes.data.clinics || []);

        const scansRes = await axios.get(`http://localhost:5000/uploads/healthpro/${id}`);
        setUploadedScans(scansRes.data.uploads || []);
      } catch (err) {
        console.error("Error loading profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-2xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col min-h-screen w-full">
      <main className="flex-1">
        <section className="container mx-auto px-6 pt-16 pb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-[334px] h-[249px] rounded-[80px] overflow-hidden">
              <img
                src={profile?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'Profile')}`}
                alt={profile?.full_name || 'Profile'}
                className="w-full h-full object-cover"
              />
            </div>
            {profile && (
              <div className="flex flex-col gap-6">
                <div className="font-montserrat font-normal text-black text-[40px]">
                  Speciality: {profile.speciality || "Health Specialist"}
                </div>
                <div className="font-montserrat font-normal text-black text-[40px]">
                  Region: {profile.region}
                </div>
                <div className="font-montserrat font-medium text-green text-[40px]">
                  Verified
                </div>
                {/* 
                <button
                  className="bg-cyan-600 text-white rounded-full px-4 py-2 mt-4 hover:bg-cyan-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/chat/${profile.id}`);
                  }}
                >
                  Chat
                </button>
                */}
              </div>
            )}
          </div>
          {profile && (
            <h1 className="font-montserrat font-medium text-black text-[40px] mt-6">
              {profile.full_name}
            </h1>
          )}
        </section>

        {/* Published Articles */}
        <section className="w-full bg-cards-color rounded-[20px] p-12">
          <h2 className="text-center text-[#665e5e] text-5xl mb-12">Published Articles</h2>
          <div className="flex flex-wrap gap-8 justify-center">
            {articles.length > 0 ? articles.map((a) => (
              <div key={a.id} className="w-[300px] bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3 line-clamp-2">{a.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{a.content?.slice(0, 100)}...</p>
                <button
                  onClick={() => navigate(`/article/${a.id}`)}
                  className="text-xs bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-full"
                >
                  Read More
                </button>
              </div>
            )) : <p>No articles yet.</p>}
          </div>
        </section>

        {/* Flagged Articles */}
        <section className="w-full bg-gray-100 rounded-[20px] p-12 mt-8">
          <h2 className="text-center text-[#665e5e] text-5xl mb-12">Flagged Articles</h2>
          <FlaggedArticles />
        </section>

        {/* Recommended Clinics */}
        <section className="w-full bg-blue-50 rounded-[20px] p-12 mt-8">
          <h2 className="text-center text-cyan-700 text-5xl mb-12">Recommended Clinics</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {recommendedClinics.map((clinic) => (
              <div key={clinic.id} className="bg-white p-4 rounded shadow">
                <h3 className="text-xl font-bold text-gray-800">{clinic.name}</h3>
                <p className="text-sm text-gray-600">{clinic.address}, {clinic.country}</p>
                <p className="text-sm text-gray-600">Phone: {clinic.contact_info}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Uploaded Scans */}
        <section className="w-full bg-gray-50 rounded-[20px] p-12 mt-8">
          <h2 className="text-center text-gray-800 text-5xl mb-12">Uploaded Scans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {uploadedScans.map((scan) => (
              <div key={scan.id} className="bg-white p-4 rounded shadow text-center">
                <p className="text-gray-700 text-sm">{scan.file_type}</p>
                <a href={scan.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xs">View Scan</a>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const FlaggedArticles = () => {
  const [flaggedArticles, setFlaggedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlaggedArticles = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://localhost:5000/articles/flagged", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFlaggedArticles(response.data.flagged_articles || []);
      } catch (error) {
        console.error("Error fetching flagged articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlaggedArticles();
  }, []);

  if (loading) return <p>Loading flagged articles...</p>;
  if (flaggedArticles.length === 0) return <p>No flagged articles found!</p>;

  return (
    <div className="space-y-4 bg-gray-100 p-4 rounded-lg shadow-md">
      {flaggedArticles.map((article) => (
        <div key={article.id} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-bold text-black">{article.title}</h3>
          <p className="text-black">{article.content}</p>
          <p className="text-sm text-red-600 font-semibold mt-2">🚩 This article has been flagged.</p>
        </div>
      ))}
    </div>
  );
};

export default HealthProfessional;
