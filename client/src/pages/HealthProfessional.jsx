// src/pages/HealthProfessional.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchHealthProById,
  fetchArticlesByAuthorId,
  fetchClinicsByHealthProId,
  fetchUploadsByHealthProId,
  fetchFlaggedArticles
} from '../lib/api';

const HealthProfessional = () => {
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
        const profileRes = await fetchHealthProById(id);
        setProfile(profileRes.health_professional);

        const articlesRes = await fetchArticlesByAuthorId(id);
        setArticles(articlesRes.articles || []);

        const clinicsRes = await fetchClinicsByHealthProId(id);
        setRecommendedClinics(clinicsRes.clinics || []);

        const scansRes = await fetchUploadsByHealthProId(id);
        setUploadedScans(scansRes.uploads || []);
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
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="bg-cyan-600 text-white w-full lg:w-1/4 p-6 space-y-4 lg:min-h-screen shadow-lg">
        <div className="text-center">
          <img
            src={profile?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'Profile')}`}
            alt={profile?.full_name || 'Profile'}
            className="w-40 h-40 mx-auto rounded-full object-cover border-4 border-white"
          />
          <h2 className="text-2xl text-black font-bold mt-4">{profile.full_name}</h2>
          <p className="text-xl text-black font-bold">{profile.speciality}</p>
          <p className="text-xl text-black font-bold">{profile.region}</p>
          <span className="text-green-900 font-bold">Verified</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-cyan-50 p-6 space-y-12">
        {/* Articles */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Published Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.length > 0 ? articles.map((a) => (
              <div key={a.id} className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">{a.title}</h3>
                <p className="text-gray-600 text-sm mt-2 line-clamp-3">{a.content?.slice(0, 100)}...</p>
                <button
                  onClick={() => navigate(`/article/${a.id}`)}
                  className="mt-4 text-sm bg-cyan-300 hover:bg-cyan-400 text-black px-4 py-2 rounded-full"
                >
                  Read More
                </button>
              </div>
            )) : <p className="text-gray-700">No articles yet.</p>}
          </div>
        </section>

        {/* Flagged Articles */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Flagged Articles</h2>
          <FlaggedArticles />
        </section>

        {/* Recommended Clinics */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Recommended Clinics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedClinics.map((clinic) => (
              <div key={clinic.id} className="bg-white p-4 rounded shadow">
                <h3 className="text-xl font-bold text-gray-800">{clinic.name}</h3>
                <p className="text-sm text-gray-700">{clinic.address}, {clinic.country}</p>
                <p className="text-sm text-gray-700">Phone: {clinic.contact_info}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Uploaded Scans */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Uploaded Scans</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploadedScans.map((scan) => (
              <div key={scan.id} className="bg-white p-4 rounded shadow text-center">
                <p className="text-gray-700 text-sm mb-2">{scan.file_type}</p>
                {scan.file_type.startsWith('image') ? (
                  <img
                    src={scan.file_url}
                    alt="Uploaded Scan"
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                ) : (
                  <a
                    href={scan.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-xs"
                  >
                    View Scan
                  </a>
                )}
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
    const fetchData = async () => {
      try {
        const data = await fetchFlaggedArticles();
        setFlaggedArticles(data.flagged_articles || []);
      } catch (error) {
        console.error("Error fetching flagged articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-gray-700">Loading flagged articles...</p>;
  if (flaggedArticles.length === 0) return <p className="text-gray-700">No flagged articles found!</p>;

  return (
    <div className="space-y-4">
      {flaggedArticles.map((article) => (
        <div key={article.id} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-semibold text-gray-800">{article.title}</h3>
          <p className="text-gray-700">{article.content}</p>
          <p className="text-sm text-red-600 font-semibold mt-2">🚩 This article has been flagged.</p>
        </div>
      ))}
    </div>
  );
};

export default HealthProfessional;