import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import { format } from 'date-fns';
import {
  getPregnancyInfo,
  getMumEvents,
  addMumEvent,
  addReminder,
} from '../../lib/api'; 
import { PregnancyService } from '../../services/PregnancyService';
import { NotificationService } from '../../services/NotificationService';

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
      const pregnancyData = await getPregnancyInfo();
      setLmp(pregnancyData.lmp);
      const calculatedEDD = new Date(pregnancyData.lmp);
      calculatedEDD.setDate(calculatedEDD.getDate() + 280);
      setEdd(calculatedEDD);
      const milestones = PregnancyService.calculateMilestones(calculatedEDD);
      setPregnancyInfo(milestones);

      const fetchedEvents = await getMumEvents();
      setEvents(fetchedEvents);
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
      <div className="mb-4 p-4 bg-indigo-50 rounded-lg shadow-sm">
        <p className="text-base sm:text-lg font-medium text-indigo-700">
          Current stage: <span className="font-semibold">{currentTrimester}</span>
        </p>
        <p className="text-sm sm:text-base text-gray-700">
          Due date: {format(pregnancyInfo.thirdTrimester.end, 'MMMM d, yyyy')}
        </p>
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
      const { event } = await addMumEvent(eventToAdd);
      setEvents([...events, event]);

      if (eventToAdd.type === 'reminder') {
        await addReminder({
          text: eventToAdd.title,
          date: eventToAdd.date,
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
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4 text-center">
        My Pregnancy Calendar
      </h2>

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
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 sm:mx-0 animate-fade-in-up">
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
              aria-label="Close"
            >
              ✕
            </button>
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
              Add New Event
            </h3>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              />
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              >
                <option value="appointment">Appointment</option>
                <option value="scan">Ultrasound Scan</option>
                <option value="class">Education Class</option>
                <option value="reminder">Reminder</option>
                <option value="checkup">Check-up</option>
              </select>
              <button
                onClick={handleSaveEvent}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm sm:text-base py-2.5 rounded-lg shadow-md transition transform active:scale-95"
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
