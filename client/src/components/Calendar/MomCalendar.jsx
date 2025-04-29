import React, { useState, useEffect } from 'react';
import Calendar from './Calendar'; 
import { format } from 'date-fns';
import { PregnancyService } from '../services/PregnancyService';

const MomCalendar = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date(),
    type: 'appointment'
  });
  const [pregnancyInfo, setPregnancyInfo] = useState(null);

  useEffect(() => {
    const fetchPregnancyData = async () => {
      // Mock API call
      const mockEDD = new Date('2025-12-15'); // Example EDD

      const milestones = PregnancyService.calculateMilestones(mockEDD);
      setPregnancyInfo(milestones);

      setEvents(prevEvents => [
        ...prevEvents,
        ...milestones.recommendedAppointments.map((appt, index) => ({
          ...appt,
          id: 1000 + index,
          isRecommended: true
        }))
      ]);
    };

    fetchPregnancyData();

    // Dummy existing events
    const dummyEvents = [
      { id: 1, title: 'Prenatal Checkup', date: new Date('2025-04-30T10:00:00'), type: 'appointment', notes: 'Bring insurance card' },
      { id: 2, title: 'Ultrasound', date: new Date('2025-05-15T14:30:00'), type: 'scan', doctor: 'Dr. Smith' },
      { id: 3, title: 'Lamaze Class', date: new Date('2025-05-20T18:00:00'), type: 'class', location: 'Community Center' },
    ];
    setEvents(dummyEvents);
  }, [userId]);

  const renderPregnancyInfo = () => {
    if (!pregnancyInfo) return null;

    const now = new Date();
    let currentTrimester = "";

    if (now >= pregnancyInfo.firstTrimester.start && now < pregnancyInfo.firstTrimester.end) {
      currentTrimester = "First Trimester";
    } else if (now >= pregnancyInfo.secondTrimester.start && now < pregnancyInfo.secondTrimester.end) {
      currentTrimester = "Second Trimester";
    } else if (now >= pregnancyInfo.thirdTrimester.start && now <= pregnancyInfo.thirdTrimester.end) {
      currentTrimester = "Third Trimester";
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
    setNewEvent(prev => ({
      ...prev,
      date: date
    }));
  };

  const handleSaveEvent = () => {
    const newId = events.length ? Math.max(...events.map(ev => ev.id)) + 1 : 1;
    setEvents([...events, { ...newEvent, id: newId }]);
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

      {/* Add Event Modal */}
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
                <option value="scan">Scan</option>
                <option value="class">Class</option>
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
