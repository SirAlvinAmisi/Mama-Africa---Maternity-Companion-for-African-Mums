import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import { format } from 'date-fns';
import { PregnancyService } from '../../services/PregnancyService';
import { NotificationService } from '../../services/NotificationService';
import axios from 'axios';

const MomCalendar = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date(),
    type: 'appointment',
  });
  const [pregnancyInfo, setPregnancyInfo] = useState(null);
  const [lmp, setLmp] = useState('');
  const [edd, setEdd] = useState(null);

  const fetchPregnancyData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/mums/pregnancy-info`, {
        headers: { Authorization: `Bearer ${localStorage.token}` },
      });
      const pregnancyData = res.data;
      setLmp(pregnancyData.lmp);
      const calculatedEDD = new Date(pregnancyData.lmp);
      calculatedEDD.setDate(calculatedEDD.getDate() + 280);
      setEdd(calculatedEDD);
      const milestones = PregnancyService.calculateMilestones(calculatedEDD);
      setPregnancyInfo(milestones);

      const eventResponse = await axios.get(`http://localhost:5000/mums/events`, {
        headers: { Authorization: `Bearer ${localStorage.token}` },
      });
      setEvents(eventResponse.data.events);
    } catch (error) {
      console.error('Error fetching pregnancy data or events:', error);
    }
  };

  useEffect(() => {
    fetchPregnancyData();
  }, [userId]);

  const renderPregnancyInfo = () => {
    if (!pregnancyInfo) return null;

    const now = new Date();
    let currentTrimester = '';

    if (now >= pregnancyInfo.firstTrimester.start && now < pregnancyInfo.firstTrimester.end) {
      currentTrimester = 'First Trimester';
    } else if (now >= pregnancyInfo.secondTrimester.start && now < pregnancyInfo.secondTrimester.end) {
      currentTrimester = 'Second Trimester';
    } else if (now >= pregnancyInfo.thirdTrimester.start && now <= pregnancyInfo.thirdTrimester.end) {
      currentTrimester = 'Third Trimester';
    }

    return (
      <div className="mb-4 p-3 bg-purple-100 rounded-lg">
        <p className="font-bold">Current stage: {currentTrimester}</p>
        <p>Due date: {format(pregnancyInfo.thirdTrimester.end, 'MMMM d, yyyy')}</p>
      </div>
    );
  };

  const handleDateSelect = (date) => {
    setShowAddForm(true);
    setNewEvent((prev) => ({
      ...prev,
      date: date,
    }));
  };

  const handleSaveEvent = async () => {
    const eventToAdd = { ...newEvent };
    try {
      const res = await axios.post(`http://localhost:5000/mums/events`, eventToAdd, {
        headers: { Authorization: `Bearer ${localStorage.token}` },
      });
      setEvents([...events, res.data.event]);

      if (eventToAdd.type === 'reminder') {
        await axios.post('http://localhost:5000/mums/reminders', {
          text: eventToAdd.title,
          date: eventToAdd.date
        }, {
          headers: { Authorization: `Bearer ${localStorage.token}` }
        });
      }

      await NotificationService.sendNotificationToHealthProf(userId, eventToAdd);
      await NotificationService.sendNotificationToMom(userId, eventToAdd);
    } catch (error) {
      console.error('Error saving event:', error);
    }
    setShowAddForm(false);
    setNewEvent({ title: '', date: new Date(), type: 'appointment' });
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-800 mb-6">My Pregnancy Calendar</h2>

      {renderPregnancyInfo()}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <Calendar
          userType="mom"
          events={events}
          onDateSelect={handleDateSelect}
          pregnancyInfo={pregnancyInfo}
        />
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-96 relative animate-fade-in-up">
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4 text-purple-700">Add New Event</h3>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                <option value="appointment">Appointment</option>
                <option value="scan">Ultrasound Scan</option>
                <option value="class">Education Class</option>
                <option value="reminder">Reminder</option>
                <option value="checkup">Check-up</option>
              </select>
              <button
                onClick={handleSaveEvent}
                className="bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Save Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MomCalendar;
