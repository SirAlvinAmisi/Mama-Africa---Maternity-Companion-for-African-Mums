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
  subMonths,
} from 'date-fns';
import { fetchHealthProEvents, createHealthProEvent } from '../../lib/api';

const HealthProfCalendar = ({ userId }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '', type: 'appointment' });

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchHealthProEvents();
        setEvents(data);
      } catch (err) {
        console.error("Error loading events:", err);
      }
    };
    loadEvents();
  }, []);

  const handleDayClick = (day) => {
    if (isBefore(day, new Date(new Date().setHours(0, 0, 0, 0)))) {
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

    const dateTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${newEvent.time}`);
    if (isNaN(dateTime.getTime())) {
      alert("Invalid date or time.");
      return;
    }

    try {
      const savedEvent = await createHealthProEvent({
        title: newEvent.title,
        type: newEvent.type,
        datetime: dateTime.toISOString()
      });
      setEvents(prev => [...prev, savedEvent]);
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
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    let day = start;
    const rows = [];

    while (day <= end) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isToday = isSameDay(cloneDay, new Date());
        const isPast = isBefore(cloneDay, new Date().setHours(0, 0, 0, 0));
        const hasEvent = events.some(event => isSameDay(new Date(event.datetime), cloneDay));

        week.push(
          <div
            key={cloneDay}
            className={`p-3 border text-center transition rounded
              ${!isSameMonth(cloneDay, start) ? 'bg-gray-100 text-gray-400' : ''}
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
      rows.push(<div key={day} className="grid grid-cols-7 gap-2">{week}</div>);
    }
    return rows;
  };

  const eventsForSelectedDate = selectedDate
    ? events.filter(event => isSameDay(new Date(event.datetime), selectedDate))
    : [];

  return (
    <div className="max-w-5xl bg-white mx-auto p-6">
      <h2 className="text-3xl font-bold text-purple-700 text-center mb-6">Health Professional Calendar</h2>

      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">&lt;</button>
        <h3 className="text-2xl font-bold text-cyan-900">{format(currentMonth, 'MMMM yyyy')}</h3>
        <button onClick={nextMonth} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">&gt;</button>
      </div>

      <div className="grid grid-cols-7 text-center font-bold mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-purple-700 font-bold">{day}</div>
        ))}
      </div>

      <div className="space-y-2 text-black font-bold">{renderDays()}</div>

      {showModal && (
        <div className="fixed inset-0 bg-cyan-900 bg-opacity-40 flex justify-center items-center z-20">
          <div className="bg-cyan-300 p-6 rounded-lg w-[90%] max-w-md relative shadow-lg">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-xl font-bold text-cyan-900 hover:text-red-600"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4 text-cyan-900">
              Add Event for {format(selectedDate, 'PPP')}
            </h3>
            <input
              type="text"
              placeholder="Title"
              className="w-full border p-2 rounded bg-gray-100 text-black mb-3"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <input
              type="time"
              className="w-full border bg-gray-100 text-black p-2 rounded mb-3"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
            />
            <select
              className="w-full border p-2 bg-gray-100 text-black rounded mb-3"
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
            >
              <option value="appointment">Appointment</option>
              <option value="scan">Scan</option>
              <option value="class">Class</option>
            </select>
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="w-[48%] bg-cyan-600 font-bold text-black hover:bg-red-600 p-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEvent}
                className="w-[48%] bg-cyan-600 font-bold text-black p-2 rounded hover:bg-purple-700"
              >
                Save Event
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedDate && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-cyan-900 mb-4">
            Events for {format(selectedDate, 'PPP')}
          </h3>
          {eventsForSelectedDate.length === 0 ? (
            <p className="text-black">No events on this date.</p>
          ) : (
            eventsForSelectedDate.map((event, index) => (
              <div key={index} className="bg-cyan-300 border p-4 rounded mb-2">
                <h4 className="font-bold text-purple-700">{event.title}</h4>
                <p className="capitalize font-black text-black">{event.type}</p>
                <p className='text-black'>{format(new Date(event.datetime), 'hh:mm a')}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default HealthProfCalendar;
