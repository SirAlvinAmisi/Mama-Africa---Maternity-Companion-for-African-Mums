import { useState, useEffect } from 'react';
import axios from 'axios';
import MomPage from "./MomPage";
import MomPregnancy from "./MomPregnancy";
import MomUploadScan from "./MomUploadScan";
import MomReminders from "./MomReminders";
import MomCalendar from "../components/Calendar/MomCalendar";
import PopularGroups from '../components/PopularGroups';
import { getRandomWeeklyUpdate, getWeeklyUpdateByDate } from '../utils/weeklyUpdateHelper';
import Notification  from '../components/Notification';

export default function MomLandingPage() {
  const [formData, setFormData] = useState({
    edd: '',
    gravida: '',
    pregnancy_status: '',
    last_period_date: ''
  });
  const [weeklyUpdate, setWeeklyUpdate] = useState('');
  const [records, setRecords] = useState([]);
  const [question, setQuestion] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState('');
  const [groups, setGroups] = useState([]);
  const token = localStorage.getItem('access_token');

  // Fetch 
  useEffect(() => {
    // Set a random weekly update while profile is not yet configured
    const random = getRandomWeeklyUpdate();
    setWeeklyUpdate(random);

    // Temporary record just to simulate file list
    setRecords([{ name: 'Scan Report.pdf', date: '2025-03-15' }]);

    // Fetch mum groups from the backend
    const fetchGroups = async () => {
      try {
        const res = await axios.get('http://localhost:5000/communities', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("Fetched groups:", res.data);
        setGroups(res.data.groups || res.data); // Adjust depending on actual backend structure
      } catch (err) {
        console.error("Failed to fetch groups:", err);
      }
    };

    fetchGroups();
  }, []);


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

      const response = await axios.post('http://localhost:5000/mums/pregnancy', pregnancyPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
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
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-cyan-700 text-center mb-6">Welcome, Mama!</h2>

      <div className="flex gap-4 mb-6 border-b pb-2">
        {['profile', 'weekly', 'records', 'questions', 'topics', 'appointments', 'groups', 'notifications'].map(tab => (
          <button
            key={tab}
            className={`capitalize px-4 py-2 rounded-t ${activeTab === tab ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">My Tracker</h3>
          <MomPage />
        </section>
      )}

      {/* {activeTab === 'weekly' && (
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Weekly Baby Update</h3>
          <div className="p-4 bg-yellow-50 rounded text-gray-700 shadow-inner">{weeklyUpdate}</div>
          
        </section>
      )} */}
      {activeTab === 'weekly' && weeklyUpdate && (
      <section>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Week {weeklyUpdate.week} Baby Update</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-yellow-50 rounded shadow p-4">
            <p className="font-semibold text-purple-800">👶 Baby Size</p>
            <p>{weeklyUpdate.babySize}</p>
          </div>
          <div className="bg-yellow-50 rounded shadow p-4">
            <p className="font-semibold text-purple-800">🧠 Development</p>
            <p>{weeklyUpdate.development}</p>
          </div>
          <div className="bg-yellow-50 rounded shadow p-4">
            <p className="font-semibold text-purple-800">🤰 Mama Tip</p>
            <p>{weeklyUpdate.mamaTip}</p>
          </div>
          <div className="bg-yellow-50 rounded shadow p-4">
            <p className="font-semibold text-purple-800">🌿 Proverb</p>
            <p>{weeklyUpdate.proverb}</p>
          </div>
          <div className="bg-yellow-50 rounded shadow p-4">
            <p className="font-semibold text-purple-800">🥗 Nutrition Tip</p>
            <p>{weeklyUpdate.nutritionTip}</p>
          </div>
          <div className="bg-yellow-50 rounded shadow p-4">
            <p className="font-semibold text-purple-800">💬 Ask Your Midwife</p>
            <p>{weeklyUpdate.askMidwife}</p>
          </div>
        </div>
      </section>
    )}

      {activeTab === 'records' && (
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Medical Records</h3>
          <MomUploadScan />
        </section>
      )}

      {activeTab === 'questions' && (
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Ask the Community / Experts</h3>
          <textarea
            placeholder="Ask your question here..."
            value={question}
            onChange={e => setQuestion(e.target.value)}
            className="w-full p-3 border rounded"
          />
          <button onClick={handleQuestionSubmit} className="mt-2 bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700">
            Submit Question
          </button>
        </section>
      )}

      {activeTab === 'topics' && (
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Follow Topics by Trimester</h3>
          <p className="text-gray-600">Coming soon: personalized topic suggestions based on your trimester.</p>
        </section>
      )}

      {activeTab === 'appointments' && (
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">My Appointments</h3>
          <MomCalendar />
          <MomReminders />
        </section>
      )}

      {activeTab === 'groups' && (
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Mum Groups</h3>
          <p className="text-gray-600">You can explore communities here.</p>
          {/* {groups.length === 0 ? (
            <p className="text-gray-400 italic">No groups available or still loading...</p>
          ) : (
            <PopularGroups groups={groups} />
          )} */}
        </section>
      )}

      {activeTab === 'notifications' && (
          <Notification />
      )}
    </div>
  );
}
