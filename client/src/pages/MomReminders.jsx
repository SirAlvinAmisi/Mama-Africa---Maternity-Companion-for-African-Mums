import { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from '../components/Calendar/Calendar'; 
import Modal from 'react-modal';

export default function MomReminders() {
  const [userName, setUserName] = useState('');
  const [list, setList] = useState([]);
  const [pregnancyInfo, setPregnancyInfo] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [newReminderText, setNewReminderText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [profileRes, remindersRes, pregRes] = await Promise.all([
          axios.get('http://localhost:5000/me', { headers }),
          axios.get('http://localhost:5000/mums/reminders', { headers }),
          axios.get('http://localhost:5000/mums/pregnancy-info', { headers }),
        ]);
        setUserName(profileRes.data.first_name);
        setList(remindersRes.data.reminders);
        setPregnancyInfo({
          ...pregRes.data,
          firstTrimester: {
            start: new Date(pregRes.data.last_period_date),
            end: new Date(new Date(pregRes.data.last_period_date).getTime() + 13 * 7 * 24 * 60 * 60 * 1000)
          },
          secondTrimester: {
            start: new Date(new Date(pregRes.data.last_period_date).getTime() + 13 * 7 * 24 * 60 * 60 * 1000),
            end: new Date(new Date(pregRes.data.last_period_date).getTime() + 27 * 7 * 24 * 60 * 60 * 1000)
          },
          thirdTrimester: {
            start: new Date(new Date(pregRes.data.last_period_date).getTime() + 27 * 7 * 24 * 60 * 60 * 1000),
            end: new Date(new Date(pregRes.data.last_period_date).getTime() + 40 * 7 * 24 * 60 * 60 * 1000)
          }
        });
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    fetchAll();
  }, [token]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleAddReminder = async () => {
    if (!newReminderText || !selectedDate) return;
    const reminderDate = selectedDate.toISOString().split('T')[0];
    const payload = { reminder_text: newReminderText, reminder_date: reminderDate };
    try {
      await axios.post('http://localhost:5000/mums/reminders', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setList(prev => [...prev, { text: newReminderText, date: reminderDate }]);
      setNewReminderText('');
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to add reminder:", err);
    }
  };

  return (
    <div>
      <Calendar
        userType="mom"
        events={list}
        onDateSelect={handleDateClick}
        pregnancyInfo={pregnancyInfo}
      />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        ariaHideApp={false}
        className="bg-cyan-600 text-black p-6 rounded shadow-xl w-full max-w-md mx-auto mt-10"
      >
        <h3 className="text-lg font-semibold mb-2">
          Add Reminder for {selectedDate?.toDateString()}
        </h3>
        <input
          type="text"
          value={newReminderText}
          onChange={(e) => setNewReminderText(e.target.value)}
          placeholder="E.g., Clinic visit at 9AM"
          className="border p-2 w-full mb-4 rounded"
        />
        <button
          onClick={handleAddReminder}
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
        >
          Save Reminder
        </button>
      </Modal>

      <h3 className="text-lg font-bold text-cyan mt-6 mb-2">📋 Upcoming Reminders</h3>
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
