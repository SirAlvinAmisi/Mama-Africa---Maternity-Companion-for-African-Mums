// import React, { useState, useEffect } from 'react';
// import { NotificationService } from '../../services/NotificationService';
// import Calendar from './Calendar';
// import { format } from 'date-fns';

// const HealthProfCalendar = ({ userId }) => {
//   const [events, setEvents] = useState([]);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [newEvent, setNewEvent] = useState({
//     title: '',
//     date: new Date(),
//     type: 'appointment',
//   });

//   useEffect(() => {
//     const dummyEvents = [
//       { id: 1, title: 'Prenatal Checkup', date: new Date('2025-04-30T10:00:00'), type: 'appointment', notes: 'Bring insurance card' },
//       { id: 2, title: 'Ultrasound', date: new Date('2025-05-15T14:30:00'), type: 'scan', doctor: 'Dr. Smith' },
//       { id: 3, title: 'Lamaze Class', date: new Date('2025-05-20T18:00:00'), type: 'class', location: 'Community Center' },
//     ];
//     setEvents(dummyEvents);
//   }, [userId]);

//   const handleSaveEvent = async () => {
//     const newId = events.length ? Math.max(...events.map((ev) => ev.id)) + 1 : 1;
//     setEvents([...events, { ...newEvent, id: newId }]);
//     setShowAddForm(false);
//     setNewEvent({ title: '', date: new Date(), type: 'appointment' });

//     await NotificationService.sendNotificationToHealthProf(userId, newEvent);
//     await NotificationService.sendNotificationToMom(userId, newEvent);
//   };

//   return (
//     <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
//       <h5 className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-purple-700 mb-6">
//   Health Professional Calendar
// </h5>


//       {/* Calendar container */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//         <Calendar userType="health-prof" events={events} onDateSelect={setShowAddForm} />
//       </div>

//       {/* Modal for new event */}
//       {showAddForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md relative animate-fade-in-up">
//             <button
//               onClick={() => setShowAddForm(false)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
//             >
//               ✕
//             </button>
//             <h3 className="text-xl sm:text-2xl font-semibold text-purple-700 mb-4 text-center">
//               Add New Event
//             </h3>
//             <div className="flex flex-col gap-4">
//               <input
//                 type="text"
//                 placeholder="Event Title"
//                 value={newEvent.title}
//                 onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
//                 className="border border-gray-300 p-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-400"
//               />
//               <select
//                 value={newEvent.type}
//                 onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
//                 className="border border-gray-300 p-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-400"
//               >
//                 <option value="appointment">Appointment</option>
//                 <option value="scan">Scan</option>
//                 <option value="class">Class</option>
//               </select>
//               <button
//                 onClick={handleSaveEvent}
//                 className="bg-purple-600 hover:bg-purple-700 text-white text-base font-medium py-2 rounded-lg transition"
//               >
//                 Save Event
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Upcoming Events */}
//       <div className="mt-8">
//         <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Upcoming Events</h3>
//         <div className="space-y-4">
//           {events.map((event) => (
//             <div
//               key={event.id}
//               className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition"
//             >
//               <h4 className="font-semibold text-lg sm:text-xl text-purple-700">{event.title}</h4>
//               <p className="text-sm sm:text-base text-gray-600 capitalize">{event.type}</p>
//               <p className="text-sm sm:text-base text-gray-500">
//                 {format(event.date, 'MMMM dd, yyyy')} at {format(event.date, 'hh:mm a')}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HealthProfCalendar;
import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isBefore, isSameMonth, addMonths, subMonths } from 'date-fns';

const HealthProfCalendar = ({ userId }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '', type: 'appointment' });

  const today = new Date();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('access_token');
        // const res = await fetch(`http://localhost:5000/healthpros/events/${userId}`, {
        const res = await fetch('http://localhost:5000/healthpros/events', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data.events || []);
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
  
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const dateTimeString = `${dateString}T${newEvent.time}`;
  
    const dateTime = new Date(dateTimeString);
    if (isNaN(dateTime.getTime())) {
      alert("Invalid date or time.");
      return;
    }
  
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`http://localhost:5000/healthpros/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          // ...newEvent,
          // datetime: dateTime.toISOString(),
          // user_id: userId
          title: newEvent.title,
          type: newEvent.type,
          datetime: dateTime.toISOString()
        })
      });
  
      if (!res.ok) throw new Error("Failed to save");
  
      const saved = await res.json();
      // setEvents([...events, saved.event]);
      setEvents((prev) => [...prev, saved.event]);
      setShowModal(false);
      setNewEvent({ title: '', time: '', type: 'appointment' });
    } catch (err) {
      console.error("Save error:", err);
      alert("Could not save event.");
    }
  };

  // Function to go to the previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Function to go to the next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
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
        const hasEvent = events.some(event => isSameDay(new Date(event.datetime), cloneDay));
        days.push(
          <div
            key={cloneDay}
            className={`p-3 border text-center transition rounded
              ${!isSameMonth(cloneDay, monthStart) ? 'bg-gray-100 text-gray-400' : ''}
              ${isPast ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'cursor-pointer hover:bg-purple-50'}
              ${isToday ? 'bg-purple-100 border-purple-500 font-bold' : ''}
              ${hasEvent ? 'bg-purple-200 border-purple-300' : ''}
              `}
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

  const eventsForSelectedDate = selectedDate
    ? events.filter(event => isSameDay(new Date(event.datetime), selectedDate))
    : [];

  return (
    <div className="max-w-5xl bg-white mx-auto p-6">
      <h2 className="text-3xl font-bold text-purple-700 text-center mb-6">Health Professional Calendar</h2>

      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={prevMonth}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
        >
          &lt;
        </button>
        
        <h3 className="text-2xl font-bold text-cyan-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        
        <button 
          onClick={nextMonth}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 text-center font-bold mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-purple-700 font-bold">{day}</div>
        ))}
      </div>

      <div className="space-y-2 text-black font-bold">{renderDays()}</div>
     
      {/* Modal */}
      {showModal && (
      <div className="fixed inset-0 bg-cyan-900 bg-opacity-40 flex justify-center items-center z-20">
        <div className="bg-cyan-300 p-6 rounded-lg w-[90%] max-w-md relative shadow-lg">
          {/* Close Button */}
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-2 right-2 text-xl font-bold text-cyan-900 hover:text-red-600"
          >
            ✕
          </button>

          {/* Modal Title */}
          <h3 className="text-xl font-bold mb-4 text-cyan-900">
            Add Event for {format(selectedDate, 'PPP')}
          </h3>

          {/* Title Input */}
          <input
            type="text"
            placeholder="Title"
            className="w-full border p-2 rounded bg-gray-100 text-black mb-3"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />

          {/* Time Input */}
          <input
            type="time"
            className="w-full border bg-gray-100 text-black p-2 rounded mb-3"
            value={newEvent.time}
            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
          />

          {/* Event Type Dropdown */}
          <select
            className="w-full border p-2 bg-gray-100 text-black rounded mb-3"
            value={newEvent.type}
            onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
          >
            <option value="appointment">Appointment</option>
            <option value="scan">Scan</option>
            <option value="class">Class</option>
          </select>

          {/* Action Buttons */}
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

    
      {/* Event List */}
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