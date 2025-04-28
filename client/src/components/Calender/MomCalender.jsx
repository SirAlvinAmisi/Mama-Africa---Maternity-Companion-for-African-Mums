import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import { format, isSameDay } from 'date-fns';

const MomCalendar = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date(),
    type: 'appointment'
  });

  useEffect(() => {
    const dummyEvents = [
      { id: 1, title: 'Prenatal Checkup', date: new Date('2025-04-30T10:00:00'), type: 'appointment', notes: 'Bring insurance card' },
      { id: 2, title: 'Ultrasound', date: new Date('2025-05-15T14:30:00'), type: 'scan', doctor: 'Dr. Smith' },
      { id: 3, title: 'Lamaze Class', date: new Date('2025-05-20T18:00:00'), type: 'class', location: 'Community Center' },
    ];
    setEvents(dummyEvents);
  }, [userId]);

  const handleDateSelect = (date) => {
    const eventsOnDay = events.filter(event => isSameDay(new Date(event.date), date));
    setSelectedEvent(eventsOnDay.length ? eventsOnDay : null);
  };

  const addNewEvent = () => {
    const eventToAdd = {
      id: Math.max(0, ...events.map(e => e.id)) + 1,
      ...newEvent
    };
    setEvents([...events, eventToAdd]);
    setShowAddForm(false);
    setNewEvent({
      title: '',
      date: new Date(),
      type: 'appointment'
    });
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
    if (selectedEvent?.id === id) setSelectedEvent(null);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-800 mb-6">My Pregnancy Calendar</h2>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <Calendar 
          userType="mom"
          events={events}
          onDateSelect={handleDateSelect}
        />
      </div>

      {selectedEvent && (
        <div className="mt-6 p-5 bg-purple-50 rounded-lg border border-purple-100">
          {selectedEvent.map(event => (
            <div key={event.id}>
              <h3 className="text-xl font-bold text-purple-900">{event.title}</h3>
              <p className="text-purple-700 mt-1">{format(new Date(event.date), 'EEEE, MMMM do yyyy • h:mm a')}</p>
              <p className="mt-2 capitalize"><span className="font-medium">Type:</span> {event.type}</p>
              {event.doctor && <p className="mt-1"><span className="font-medium">Doctor:</span> {event.doctor}</p>}
              {event.location && <p className="mt-1"><span className="font-medium">Location:</span> {event.location}</p>}
              {event.notes && <p className="mt-2"><span className="font-medium">Notes:</span> {event.notes}</p>}
              <button onClick={() => deleteEvent(event.id)} className="text-red-500 hover:text-red-700">
                <span className="material-icons">delete</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {showAddForm ? (
        <div className="mt-6 p-5 bg-white rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-bold text-purple-800 mb-4">Add New Reminder</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input type="text" className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-300" 
                value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
              <input type="datetime-local" className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-300"
                value={format(newEvent.date, "yyyy-MM-dd'T'HH:mm")} 
                onChange={(e) => setNewEvent({...newEvent, date: new Date(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-300" 
                value={newEvent.type} 
                onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}>
                <option value="appointment">Appointment</option>
                <option value="scan">Scan/Ultrasound</option>
                <option value="class">Class</option>
                <option value="medication">Medication</option>
                <option value="reminder">Reminder</option>
              </select>
            </div>
            <button onClick={addNewEvent} className="mt-4 w-full bg-purple-600 text-white p-2 rounded-lg shadow-md">
              Add Event
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAddForm(true)} className="mt-6 w-full bg-purple-600 text-white p-2 rounded-lg shadow-md">
          Add New Event
        </button>
      )}
    </div>
  );
};

export default MomCalendar;
