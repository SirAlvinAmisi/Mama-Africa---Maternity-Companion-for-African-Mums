import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MomReminders() {
  const [userName, setUserName] = useState('');
  const [list, setList] = useState([]);
  const [pregnancyInfo, setPregnancyInfo] = useState(null);
  const [newReminder, setNewReminder] = useState('');
  const [reminderDate, setReminderDate] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserName(res.data.first_name); // or res.data.name depending on backend
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
  
    
    const fetchReminders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/mums/reminders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setList(res.data.reminders);
      } catch (err) {
        console.error("Failed to fetch reminders:", err);
      }
    };

    const fetchPregnancyInfo = async () => {
      try {
        const res = await axios.get('http://localhost:5000/mums/pregnancy-info', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPregnancyInfo(res.data);
      } catch (err) {
        console.error("Failed to fetch pregnancy info:", err);
      }
    };
    fetchUserProfile();
    fetchReminders();
    fetchPregnancyInfo();
  }, [token]);

  const tips = {
    first: '🌱 Take folic acid daily, drink water, and get rest. Avoid smoking and alcohol.',
    second: '🌼 Stay active with walking or light prenatal yoga. Attend mid-pregnancy scans.',
    third: '🎒 Prepare your hospital bag, birth plan, and make final doctor visits.'
  };

  const getCurrentTip = () => {
    if (!pregnancyInfo?.lmp) return null;
    const now = new Date();
    const start = new Date(pregnancyInfo.lmp);
    const diffWeeks = Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000));

    if (diffWeeks < 13) return tips.first;
    if (diffWeeks < 27) return tips.second;
    return tips.third;
  };

  const handleAddReminder = async () => {
    if (!newReminder || !reminderDate) return;

    const payload = { reminder_text: newReminder, reminder_date: reminderDate };

    try {
      await axios.post('http://localhost:5000/mums/reminders', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setList([...list, { text: newReminder, date: reminderDate }]);
      setNewReminder('');
      setReminderDate('');
    } catch (err) {
      console.error("Failed to add reminder:", err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-cyan-800 mb-4">
        🗓️ Hello {userName}, here are your pregnancy reminders
      </h2>

      {getCurrentTip() && (
        <div className="mb-5 p-4 border-l-4 border-green-500 bg-green-50 rounded shadow">
          <p className="font-medium text-green-800">💡 Tip of the Week:</p>
          <p>{getCurrentTip()}</p>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">➕ Add a New Reminder</h3>
        <input
          type="text"
          value={newReminder}
          onChange={(e) => setNewReminder(e.target.value)}
          placeholder="E.g., Visit Dr. Amina at 10AM"
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="date"
          value={reminderDate}
          onChange={(e) => setReminderDate(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <button
          onClick={handleAddReminder}
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
        >
          Add Reminder
        </button>
      </div>

      <h3 className="text-lg font-semibold mb-2">📋 Upcoming Reminders</h3>
      {list.length ? (
        list.map((r, i) => (
          <div key={i} className="mb-3 p-4 border-l-4 border-blue-500 bg-blue-50 rounded shadow">
            <p className="font-medium text-blue-800">{new Date(r.date).toLocaleDateString()}</p>
            <p>{r.text}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-600 italic">No reminders yet — you're all caught up! 🎉</p>
      )}
    </div>
  );
}
