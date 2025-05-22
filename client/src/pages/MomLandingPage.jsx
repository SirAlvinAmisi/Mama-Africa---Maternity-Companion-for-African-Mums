// src/pages/MomLandingPage.jsx
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import api from '../lib/api';
import MomPage from "./MomPage";
import MomUploadScan from "./MomUploadScan";
import MomReminders from "./MomReminders";
import PopularGroups from '../components/PopularGroups';
import MomAskQuestion from './MomAskQuestion';
import { getRandomWeeklyUpdate, getWeeklyUpdateByDate } from '../utils/weeklyUpdateHelper';

export default function MomLandingPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    edd: '',
    gravida: '',
    pregnancy_status: '',
    last_period_date: ''
  });
  const [weeklyUpdate, setWeeklyUpdate] = useState('');
  const [records, setRecords] = useState([]);
  const [question, setQuestion] = useState('');
  const [activeTab, setActiveTab] = useState('Profile');
  const [message, setMessage] = useState('');
  const [groups, setGroups] = useState([]);
  const token = localStorage.getItem('access_token');
  const tabs = ['Profile', 'Weekly', 'Scan records', 'Questions', 'Appointments', 'Groups'];

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        if (!token) return;
        const res = await api.get("/mums/communities/joined", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGroups(res.data);
      } catch (err) {
        console.error("Error fetching joined communities:", err);
      }
    };

    if (activeTab === 'Groups') {
      fetchGroups();
    }
  }, [activeTab, token]);

  useEffect(() => {
    if (activeTab === 'Weekly') {
      const fetchAccurateWeeklyUpdate = async () => {
        try {
          const res = await api.get("/mums/pregnancy-info", {
            headers: { Authorization: `Bearer ${token}` }
          });

          const { last_period_date } = res.data;

          if (last_period_date) {
            const update = getWeeklyUpdateByDate(last_period_date);
            setWeeklyUpdate(update);
          } else {
            setWeeklyUpdate(getRandomWeeklyUpdate());
          }
        } catch (err) {
          console.error("Error fetching weekly update from saved LMP:", err);
          setWeeklyUpdate(getRandomWeeklyUpdate());
        }
      };

      fetchAccurateWeeklyUpdate();
    }
  }, [activeTab]);

  const handleChange = e => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };

    if (name === 'last_period_date') {
      const lpd = new Date(value);
      const eddDate = new Date(lpd.setDate(lpd.getDate() + 280));
      updatedForm.edd = eddDate.toISOString().split('T')[0];
    }

    setFormData(updatedForm);
  };

  const calculateWeeksSince = (dateStr) => {
    const today = new Date();
    const start = new Date(dateStr);
    const diff = today - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (!formData.last_period_date || !formData.edd) {
        setMessage("Please enter both EDD and Last Period Date.");
        return;
      }

      const pregnancyPayload = {
        last_period_date: formData.last_period_date,
        due_date: formData.edd,
        current_week: calculateWeeksSince(formData.last_period_date),
        pregnancy_status: formData.pregnancy_status
      };

      await api.post('/mums/pregnancy', pregnancyPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Pregnancy details saved!');
    } catch (err) {
      console.error("Error during profile update:", err);
      if (err.response) {
        setMessage(`Error ${err.response.status}: ${err.response.data.error || 'Failed to update profile'}`);
      } else if (err.request) {
        setMessage("No response from server. Please check your network.");
      } else {
        setMessage("Unexpected error occurred.");
      }
    }
  };

  const handleUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setRecords([...records, { name: file.name, date: new Date().toISOString().split('T')[0] }]);
  };

  const handleQuestionSubmit = async () => {
    setQuestion('');
    alert('Question submitted to community and health experts!');
  };

  return (
    <div className="flex min-h-screen p-8 bg-cyan-50">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-cyan-700 text-white p-6 z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 sm:static sm:block`}>
        <div className="flex justify-between items-center mb-6 sm:hidden">
          <h2 className="text-xl font-bold">Mama Menu</h2>
          <button onClick={() => setSidebarOpen(false)}><X /></button>
        </div>
        <h2 className="text-2xl font-bold hidden sm:block mb-6">Mama Dashboard</h2>
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
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Hamburger for mobile */}
      <div className="sm:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setSidebarOpen(true)} className="text-cyan-700">
          <Menu size={28} />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10 ml-0 sm:ml-64 transition-all duration-300">
        <h3 className="text-2xl font-bold text-cyan-700 text-center mb-6">
          Welcome, Mama!
        </h3>

        {activeTab === 'Profile' && <MomPage />}
        {activeTab === 'Weekly' && weeklyUpdate && (
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['👶 Baby Size', weeklyUpdate.babySize],
              ['🧠 Development', weeklyUpdate.development],
              ['🤰 Mama Tip', weeklyUpdate.mamaTip],
              ['🌿 Proverb', weeklyUpdate.proverb],
              ['🥗 Nutrition Tip', weeklyUpdate.nutritionTip],
              ['💬 Ask Your Midwife', weeklyUpdate.askMidwife]
            ].map(([label, value], index) => (
              <div key={index} className="bg-cyan-500 rounded shadow p-4">
                <p className="font-bold text-purple-800">{label}</p>
                <p>{value}</p>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'Scan records' && <MomUploadScan />}
        {activeTab === 'Questions' && <MomAskQuestion />}
        {activeTab === 'Appointments' && <MomReminders />}
        {activeTab === 'Groups' && <PopularGroups groups={groups} setGroups={setGroups} />}
      </main>
    </div>
  );
}