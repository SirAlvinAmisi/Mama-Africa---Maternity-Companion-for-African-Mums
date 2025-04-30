import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HealthProDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [articles, setArticles] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        console.log("🔑 Token:", token);
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

      {/* Profile Section */}
      <section className="bg-white shadow rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>
        <p><strong>Name:</strong> {profile.profile?.full_name || 'N/A'}</p>
        <p><strong>Region:</strong> {profile.profile?.region || 'N/A'}</p>
        <p><strong>Status:</strong> <span className="text-green-600 font-bold">Verified</span></p>
      </section>

      {/* Actions Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Post Article */}
        <div className="bg-cyan-100 p-6 rounded shadow hover:shadow-md transition">
          <h3 className="text-xl font-bold mb-3">Post New Article</h3>
          <p>Share medical articles or educational videos with Mums.</p>
          <button onClick={() => navigate('/healthpro/post-article')} className="mt-4 bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700">Post Article</button>
        </div>

        {/* Answer Questions */}
        <div className="bg-green-100 p-6 rounded shadow hover:shadow-md transition">
          <h3 className="text-xl font-bold mb-3">Answer User Questions</h3>
          <p>Help guide Mums by answering their questions.</p>
          <button onClick={() => navigate('/healthpro/answer-questions')} className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">View Questions</button>
        </div>

        {/* Upload Trimester Scans */}
        <div className="bg-purple-100 p-6 rounded shadow hover:shadow-md transition">
          <h3 className="text-xl font-bold mb-3">Upload Trimester Scan Samples</h3>
          <p>Upload example scans to educate Mums.</p>
          <button onClick={() => navigate('/healthpro/upload-scan')} className="mt-4 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">Upload Scan</button>
        </div>

        {/* Recommend Clinics */}
        <div className="bg-yellow-100 p-6 rounded shadow hover:shadow-md transition">
          <h3 className="text-xl font-bold mb-3">Recommend Clinics</h3>
          <p>Recommend trusted clinics for prenatal care.</p>
          <button onClick={() => navigate('/healthpro/recommend-clinic')} className="mt-4 bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700">Recommend Clinic</button>
        </div>
      </section>

      {/* My Published Articles */}
      <section className="mt-12">
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
      </section>
    </div>
  );
}
export default HealthProDashboard