import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isBefore,
  isSameMonth,
  addMonths,
  subMonths
} from 'date-fns';
import { getReminders, addReminder } from '../lib/api';

const MomReminders = ({ userId }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    type: 'appointment'
  });

  const today = new Date();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getReminders();
        const normalized = (data || []).map(e => ({
          id: e.id,
          title: e.title || e.reminder_text,
          type: e.type,
          datetime: new Date(e.datetime)
        }));
        setEvents(normalized);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchEvents();
  }, [userId]);

  const handleDayClick = (day) => {
    if (isBefore(day, new Date(today.setHours(0, 0, 0, 0)))) {
      alert("You cannot add events to past dates.");
      return;
    }
    setSelectedDate(day);
    setShowModal(true);
  };

  const handleSaveEvent = async () => {
    if (!newEvent.title || !newEvent.time || !selectedDate) {
      alert("All fields are required.");
      return;
    }

    try {
      const eventData = {
        reminder_text: newEvent.title,
        reminder_date: format(selectedDate, 'yyyy-MM-dd'),
        reminder_time: newEvent.time,
        type: newEvent.type
      };

      const saved = await addReminder(eventData);
      setEvents(prev => [...prev, { ...saved, datetime: new Date(saved.datetime) }]);
      setShowModal(false);
      setNewEvent({ title: '', time: '', type: 'appointment' });
    } catch (err) {
      console.error("Save error:", err);
      alert("Could not save event.");
    }
  };

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isToday = isSameDay(cloneDay, new Date());
        const isPast = isBefore(cloneDay, new Date().setHours(0, 0, 0, 0));
        const hasEvent = events.some(event => isSameDay(event.datetime, cloneDay));
        days.push(
          <div
            key={cloneDay}
            className={`p-3 border text-center transition rounded
              ${!isSameMonth(cloneDay, monthStart) ? 'bg-gray-100 text-gray-400' : ''}
              ${isPast ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'cursor-pointer hover:bg-purple-50'}
              ${isToday ? 'bg-purple-100 border-purple-500 font-bold' : ''}
              ${hasEvent ? 'bg-purple-200 border-purple-300' : ''}`}
            onClick={isPast ? undefined : () => handleDayClick(cloneDay)}
          >
            {format(cloneDay, 'd')}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div key={day} className="grid grid-cols-7 gap-2">{days}</div>);
    }
    return rows;
  };

  return (
    <div className="max-w-5xl bg-white mx-auto p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl font-semibold text-purple-700 text-center mb-6">Mom Calendar</h2>

      <div className="flex justify-between items-center mb-6">
        <button onClick={prevMonth} className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-md">‹</button>
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-600">{format(currentMonth, 'MMMM yyyy')}</h3>
        <button onClick={nextMonth} className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-md">›</button>
      </div>

      <div className="grid grid-cols-7 text-center text-gray-600 font-semibold mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-purple-700">{day}</div>
        ))}
      </div>

      <div className="space-y-2 text-gray-600 font-medium">
        {renderDays()}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-cyan-200 bg-opacity-40 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-md relative">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-xl font-semibold text-gray-600 hover:text-purple-700">✕</button>
            <h3 className="text-xl font-semibold mb-4 text-gray-600">Add Event for {format(selectedDate, 'PPP')}</h3>

            <input type="text" placeholder="Title" className="w-full border border-cyan-200 bg-white text-gray-600 p-2 rounded-md mb-3" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />

            <input type="time" className="w-full border border-cyan-200 bg-white text-gray-600 p-2 rounded-md mb-3" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} />

            <select className="w-full border border-cyan-200 bg-white text-gray-600 p-2 rounded-md mb-3" value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}>
              <option value="appointment">Appointment</option>
              <option value="scan">Scan</option>
              <option value="class">Class</option>
            </select>

            <div className="flex justify-between space-x-2">
              <button onClick={() => setShowModal(false)} className="w-1/2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold p-2 rounded-md">Cancel</button>
              <button onClick={handleSaveEvent} className="w-1/2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold p-2 rounded-md">Save Event</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-600 mb-4">All Saved Events</h3>
        {events.length === 0 ? (
          <p className="text-gray-600">No saved events yet.</p>
        ) : (
          events
            .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
            .map((event, index) => (
              <div key={index} className="bg-cyan-100 border border-cyan-200 p-4 rounded-md mb-3">
                <h4 className="font-semibold text-purple-700">{event.title}</h4>
                <p className="capitalize text-gray-600 font-medium">{event.type}</p>
                <p className="text-gray-600">
                  {format(new Date(event.datetime), 'PPPP p')}
                </p>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default MomReminders;
