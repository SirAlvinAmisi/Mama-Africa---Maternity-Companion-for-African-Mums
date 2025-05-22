// src/pages/HealthProDashboard.jsx
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import HealthProfCalendar from "../components/Calendar/HealthProfCalendar";
import ArticleForm from "../components/health-pro/ArticleForm";
import QAModeration from "../components/health-pro/QAModeration";
import ScanUpload from "../components/health-pro/ScanUpload";
import ClinicRecommendations from "../components/health-pro/ClinicRecommendations";

const tabs = [
  "Post Article",
  "Answer Questions",
  "Upload Scans",
  "Recommend Clinics",
  "My Articles",
  "Calendar"
];

const HealthProDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [articles, setArticles] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Post Article");
  const navigate = useNavigate();
  const [requestSent, setRequestSent] = useState(false);
  const [requestError, setRequestError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await api.get('/me');
        const articlesRes = await api.get('/healthpros/articles');
        const questionsRes = await api.get('/healthpros/questions');

        setProfile(profileRes.data);
        setArticles(articlesRes.data.articles || []);
        setQuestions(questionsRes.data.questions || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRequestVerification = async () => {
    try {
      await api.post('/healthpro/request-verification');
      setRequestSent(true);
    } catch (err) {
      if (err.response?.status === 400) {
        setRequestError("Verification already requested.");
      } else {
        setRequestError("Something went wrong. Try again later.");
      }
    }
  };

  const updateProfileDetails = async () => {
    try {
      await api.post('/healthpros/profile', {
        bio: profile.bio || "Default bio",
        region: profile.region || "Nairobi",
        profile_picture: profile.profile_picture || "",
        full_name: profile.profile?.full_name || "Dr. Jane Doe",
        license_number: profile.profile?.license_number || "MOH123456",
      });
      console.log("✅ Profile updated");
    } catch (err) {
      console.error("❌ Error updating profile", err.response?.data || err.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-2xl text-gray-600">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen p-10 bg-cyan-50">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-cyan-700 text-white flex flex-col justify-between p-6 z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 sm:static sm:block`}>
        <div>
          <div className="flex justify-between items-center mb-6 sm:hidden">
            <h2 className="text-xl font-bold">Health Pro Menu</h2>
            <button onClick={() => setSidebarOpen(false)}><X /></button>
          </div>
          <h2 className="text-2xl font-bold hidden sm:block mb-6">HealthPro Dashboard</h2>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSidebarOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 rounded-lg transition font-medium
                ${activeTab === tab ? 'bg-white text-cyan-700 shadow-md' : 'hover:bg-cyan-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-8 text-center">
          <div className="w-32 h-16 bg-cyan-900 text-cyan-700 flex items-center justify-center mx-auto font-bold rounded">
            Mama Africa
          </div>
        </div>
      </div>

      {/* Mobile Hamburger */}
      <div className="sm:hidden fixed top-4 left-4 z-70">
        <button onClick={() => setSidebarOpen(true)} className="text-cyan-700">
          <Menu size={28} />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-0 sm:ml-64 transition-all duration-300">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 text-center">
          Health Professional Dashboard
        </h1>

        {activeTab === "Post Article" && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Post New Article</h2>
            <p className="text-xl text-gray-700 mb-2">Share medical articles or videos with Mums.</p>
            <ArticleForm
              onSubmit={async (articleData) => {
                try {
                  await api.post('/healthpros/articles', articleData);
                  alert("Article posted!");
                  setActiveTab("My Articles");
                } catch (err) {
                  console.error("Submission error:", err);
                  alert("Failed to post article");
                }
              }}
            />
          </>
        )}

        {activeTab === "Answer Questions" && (
          <QAModeration questions={questions} setQuestions={setQuestions} />
        )}

        {activeTab === "Upload Scans" && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Upload example scans for educational awareness.
            </h2>
            <ScanUpload />
          </>
        )}

        {activeTab === "Recommend Clinics" && <ClinicRecommendations />}

        {activeTab === "My Articles" && (
          <>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">My Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.length > 0 ? (
                articles.map(article => (
                  <div key={article.id} className="bg-cyan-200 p-4 rounded shadow hover:shadow-md">
                    <h3 className="font-semibold text-cyan-900 text-lg mb-2">{article.title}</h3>
                    <p className="text-gray-700 line-clamp-3">{article.content.slice(0, 100)}...</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-700">No articles posted yet.</p>
              )}
            </div>
          </>
        )}

        {activeTab === "Calendar" && <HealthProfCalendar userId={profile.id} />}
      </main>
    </div>
  );
};

export default HealthProDashboard;
