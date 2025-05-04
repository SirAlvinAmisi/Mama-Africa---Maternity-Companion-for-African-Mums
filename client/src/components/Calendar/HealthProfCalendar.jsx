import React, { useState, useEffect } from 'react';
import { NotificationService } from '../../services/NotificationService';
import Calendar from './Calendar';
import { format } from 'date-fns';

const HealthProfCalendar = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date(),
    type: 'appointment',
  });

  useEffect(() => {
    const dummyEvents = [
      { id: 1, title: 'Prenatal Checkup', date: new Date('2025-04-30T10:00:00'), type: 'appointment', notes: 'Bring insurance card' },
      { id: 2, title: 'Ultrasound', date: new Date('2025-05-15T14:30:00'), type: 'scan', doctor: 'Dr. Smith' },
      { id: 3, title: 'Lamaze Class', date: new Date('2025-05-20T18:00:00'), type: 'class', location: 'Community Center' },
    ];
    setEvents(dummyEvents);
  }, [userId]);

  const handleSaveEvent = async () => {
    const newId = events.length ? Math.max(...events.map((ev) => ev.id)) + 1 : 1;
    setEvents([...events, { ...newEvent, id: newId }]);
    setShowAddForm(false);
    setNewEvent({ title: '', date: new Date(), type: 'appointment' });

    await NotificationService.sendNotificationToHealthProf(userId, newEvent);
    await NotificationService.sendNotificationToMom(userId, newEvent);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      <h5 className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-purple-700 mb-6">
  Health Professional Calendar
</h5>


      {/* Calendar container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <Calendar userType="health-prof" events={events} onDateSelect={setShowAddForm} />
      </div>

      {/* Modal for new event */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md relative animate-fade-in-up">
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
            <h3 className="text-xl sm:text-2xl font-semibold text-purple-700 mb-4 text-center">
              Add New Event
            </h3>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="appointment">Appointment</option>
                <option value="scan">Scan</option>
                <option value="class">Class</option>
              </select>
              <button
                onClick={handleSaveEvent}
                className="bg-purple-600 hover:bg-purple-700 text-white text-base font-medium py-2 rounded-lg transition"
              >
                Save Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      <div className="mt-8">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h4 className="font-semibold text-lg sm:text-xl text-purple-700">{event.title}</h4>
              <p className="text-sm sm:text-base text-gray-600 capitalize">{event.type}</p>
              <p className="text-sm sm:text-base text-gray-500">
                {format(event.date, 'MMMM dd, yyyy')} at {format(event.date, 'hh:mm a')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthProfCalendar;
