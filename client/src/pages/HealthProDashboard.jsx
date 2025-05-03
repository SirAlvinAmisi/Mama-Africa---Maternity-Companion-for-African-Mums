import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HealthProfCalendar from "../components/Calendar/HealthProfCalendar";
import HealthProfessionalScheduler from "../components/Scheduler/HealthProfessionalScheduler";
import Notification  from '../components/Notification';
import ArticleForm from "../components/health-pro/ArticleForm";
import QAModeration from "../components/health-pro/QAModeration";
import ScanUpload from "../components/health-pro/ScanUpload";
import ClinicRecommendations from "../components/health-pro/ClinicRecommendations";

const tabs = [
  "Profile",
  "Post Article",
  "Answer Questions",
  "Upload Scans",
  "Recommend Clinics",
  "Flag Misinformation",
  "My Articles",
  "Calendar",
  "Notifications"
];

const HealthProDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [articles, setArticles] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Profile"); // Tab State
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const profileRes = await axios.get('http://localhost:5000/me', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });

        const articlesRes = await axios.get('http://localhost:5000/healthpros/articles', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });

        const questionsRes = await axios.get('http://localhost:5000/healthpros/questions', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });

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

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-2xl">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-cyan-700 mb-6">Health Professional Dashboard</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-8">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 rounded ${
              activeTab === tab
                ? "bg-cyan-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-cyan-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded shadow">
        {activeTab === "Profile" && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>
            <p><strong>Name:</strong> {profile.profile?.full_name || 'N/A'}</p>
            <p><strong>Region:</strong> {profile.profile?.region || 'N/A'}</p>
            {profile.profile?.is_verified ? (
              <p><strong>Status:</strong> <span className="text-green-600 font-bold">Verified</span></p>
            ) : (
              <div className="text-red-500 mt-2">
                <p><strong>Status:</strong> Not Verified</p>
                <button
                  onClick={() => navigate('/healthpro/verify')}
                  className="mt-2 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                >
                  Request Verification
                </button>
              </div>
            )}
          </>
        )}

        {/* {activeTab === "Post Article" && (
          <>
            <h2 className="text-xl font-bold mb-2">Post New Article</h2>
            <p>Share medical articles or videos with Mums.</p>
            <button onClick={() => navigate('/healthpro/post-article')} className="mt-4 bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700">
              Post Article
            </button>
          </>
        )} */}
        {activeTab === "Post Article" && (
          <>
            <h2 className="text-xl font-bold mb-2">Post New Article</h2>
            <p>Share medical articles or videos with Mums.</p>
            
            <ArticleForm onSubmit={(articleData) => {
              const token = localStorage.getItem("access_token");

              axios.post('http://127.0.0.1:5000/api/articles', articleData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json"
                },
                withCredentials: true
              })
              .then(() => {
                alert("Article posted!");
                navigate('/healthpro/my-articles'); // or wherever you want to redirect
              })
              .catch(err => {
                console.error("Submission error:", err);
                alert("Failed to post article");
              });
            }} />

          </>
        )}

        {/* {activeTab === "Answer Questions" && (
          <>
            <h2 className="text-xl font-bold mb-2">Answer Questions</h2>
            <p>Help guide Mums by answering their questions.</p>
            <button onClick={() => navigate('/healthpro/answer-questions')} className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
              View Questions
            </button>
          </>
        )} */}
        {activeTab === "Answer Questions" && (
          <>
            <h2 className="text-xl font-bold mb-2">Answer Questions</h2>
            <p>Help guide Mums by answering their questions.</p>
            <QAModeration questions={questions} setQuestions={setQuestions} />
            {/* <button 
              onClick={() => navigate('/healthpro/answer-questions')}
              className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              View Questions
            </button> */}
          </>
        )}

        {activeTab === "Upload Scans" && (
          <>
            <h2 className="text-xl font-bold mb-2">Upload example scans for educational awareness.</h2>
            <ScanUpload />
            {/* <button onClick={() => navigate('/healthpro/upload-scan')} className="mt-4 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
              Upload Scan
            </button> */}
          </>
        )}

        {activeTab === "Recommend Clinics" && (
          <>
            <h2 className="text-xl font-bold mb-2">Recommend Clinics</h2>
            <p>Recommend local clinics for prenatal and postnatal care.</p>
            <ClinicRecommendations />
          </>
        )}

        {activeTab === "Flag Misinformation" && (
          <>
            <h2 className="text-xl font-bold mb-2">Flag Misinformation</h2>
            <p>Help maintain safety by flagging incorrect health information.</p>
            <button onClick={() => navigate('/healthpro/flag-misinformation')} className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">
              Review & Flag Content
            </button>
          </>
        )}

        {activeTab === "My Articles" && (
          <>
            <h2 className="text-2xl font-bold mb-4">My Published Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.length > 0 ? (
                articles.map(article => (
                  <div key={article.id} className="bg-white p-4 rounded shadow hover:shadow-md">
                    <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                    <p className="text-gray-600 line-clamp-3">{article.content.slice(0, 100)}...</p>
                  </div>
                ))
              ) : (
                <p>No articles posted yet.</p>
              )}
            </div>
          </>
        )}

        {activeTab === "Calendar" && (
          <>
            <h2 className="text-2xl font-bold mb-4">My Availability & Appointments</h2>
            <HealthProfCalendar userId={profile.id} />
            <HealthProfessionalScheduler />
          </>
        )}
        {activeTab === 'Notifications' && (
            <Notification />
        )}
      </div>
    </div>
  );
};

export default HealthProDashboard;
