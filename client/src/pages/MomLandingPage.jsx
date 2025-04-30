import { useState, useEffect } from 'react';
import axios from 'axios';

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

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    setWeeklyUpdate("This week your baby is the size of a mango! 🥭");
    setRecords([{ name: 'Scan Report.pdf', date: '2025-03-15' }]);
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };

    // Auto-calculate EDD (40 weeks from last period)
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
      console.log("Submitting form data:", formData);

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

      console.log("Response:", response.data);
      setMessage('Pregnancy details saved!');
    } catch (err) {
      console.error("Error during profile update:", err);
      if (err.response) {
        console.error("Response Data:", err.response.data);
        console.error("Status Code:", err.response.status);
        console.error("Headers:", err.response.headers);
        setMessage(`Error ${err.response.status}: ${err.response.data.error || 'Failed to update profile'}`);
      } else if (err.request) {
        console.error("No response received:", err.request);
        setMessage("No response from server. Please check your network.");
      } else {
        console.error("Error:", err.message);
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
        {['profile', 'weekly', 'records', 'questions', 'topics', 'appointments', 'groups'].map(tab => (
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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Complete Your Pregnancy Info</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Last Period Date</label>
              <input type="date" name="last_period_date" value={formData.last_period_date} onChange={handleChange} className="p-3 border rounded w-full" />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Expected Due Date (EDD)</label>
              <input name="edd" type="date" value={formData.edd} onChange={handleChange} className="p-3 border rounded w-full" disabled />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Gravida</label>
              <select name="gravida" value={formData.gravida} onChange={handleChange} className="p-3 border rounded w-full">
                <option value="">Select Gravida</option>
                <option value="Nulligravida">Nulligravida (Never been pregnant)</option>
                <option value="Primigravida">Primigravida (First time pregnant)</option>
                <option value="Multigravida">Multigravida (Pregnant More than once)</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Pregnancy Status</label>
              <select name="pregnancy_status" value={formData.pregnancy_status} onChange={handleChange} className="p-3 border rounded w-full">
                <option value="">Select Status</option>
                <option value="Normal">Normal</option>
                <option value="High Risk">High Risk</option>
                <option value="Complicated">Complicated</option>
                <option value="Postpartum">Postpartum</option>
                <option value="Early Pregnancy">Early Pregnancy</option>
              </select>
            </div>
            <button className="md:col-span-2 bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700">Save Pregnancy Info</button>
          </form>
          {message && <p className="text-green-600 mt-2">{message}</p>}
        </section>
      )}

      {activeTab === 'weekly' && (
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Weekly Baby Update</h3>
          <div className="p-4 bg-yellow-50 rounded text-gray-700 shadow-inner">{weeklyUpdate}</div>
        </section>
      )}

      {activeTab === 'records' && (
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Medical Records</h3>
          <input type="file" onChange={handleUpload} className="mb-2" />
          <ul className="list-disc pl-6 text-gray-700">
            {records.map((rec, i) => (
              <li key={i}>{rec.name} - <span className="text-sm text-gray-500">{rec.date}</span></li>
            ))}
          </ul>
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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Appointments</h3>
          <div className="p-4 border rounded text-gray-600">Upcoming scans and appointments will appear here.</div>
        </section>
      )}

      {activeTab === 'groups' && (
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Mum Groups</h3>
          <p className="text-gray-600">You can explore and join existing trimester-based communities here. (fetched from backend)</p>
        </section>
      )}
    </div>
  );
}