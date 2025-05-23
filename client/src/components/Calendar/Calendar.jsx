import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';

const Calendar = ({ 
  userType = "mom", 
  events = [], 
  setEvents, 
  pregnancyInfo = null, 
  canAddEvents = true, 
  onAddEvent = null }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [eventText, setEventText] = useState("");

  const startOfCurrentMonth = startOfMonth(currentMonth);
  const endOfCurrentMonth = endOfMonth(currentMonth);
  const today = new Date();

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDateSelect = (date) => {
    if (date >= new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
    // if (canAddEvents && date >= new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      setSelectedDate(date);
      setShowModal(true);
    }
  };


  const handleAddEvent = () => {
    if (eventText.trim()) {
      setEvents([...events, { date: selectedDate, title: eventText.trim() }]);
      setShowModal(false);
      setEventText("");
    }
  };

  const renderHeader = () => {
    const headerColor = userType === "mom" ? "bg-cyan-700" : "bg-blue-400";
    return (
      <div className={`flex justify-between items-center p-4 ${headerColor} rounded-t-lg`}>
        <button onClick={prevMonth} className="p-2 rounded-full bg-cyan-500 hover:bg-cyan-200">
          &lt;
        </button>
        <h2 className="font-bold text-gray-800 text-lg">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button onClick={nextMonth} className="p-2 rounded-full bg-cyan-500 hover:bg-cyan-200">
          &gt;
        </button>
      </div>
    );
  };

  const renderDayNames = () => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 gap-1 p-2 bg-cyan-200 text-black font-medium text-center">
        {dayNames.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    const startDay = startOfCurrentMonth.getDay();
    const totalDays = endOfCurrentMonth.getDate();

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const eventsOnDay = events.filter(event => isSameDay(new Date(event.date), date));

      let trimesterClass = '';
      if (pregnancyInfo) {
        if (date >= pregnancyInfo.firstTrimester.start && date < pregnancyInfo.firstTrimester.end) {
          trimesterClass = 'bg-blue-50';
        } else if (date >= pregnancyInfo.secondTrimester.start && date < pregnancyInfo.secondTrimester.end) {
          trimesterClass = 'bg-purple-50';
        } else if (date >= pregnancyInfo.thirdTrimester.start && date <= pregnancyInfo.thirdTrimester.end) {
          trimesterClass = 'bg-pink-50';
        }
      }

      days.push(
        <div
          key={i}
          onClick={() => !isPast && handleDateSelect(date)}
          className={`p-2 h-16 flex flex-col items-center justify-center border 
            ${trimesterClass}
            ${eventsOnDay.length ? 'bg-purple-500 border-purple-300' : isPast ? 'bg-gray-100 text-gray-400' : 'bg-white'}
            ${!isPast ? 'cursor-pointer hover:bg-purple-50' : 'cursor-not-allowed'}
          `}
        >
          <div className={`font-bold ${isPast ? 'text-gray-400' : 'text-black'}`}>{i}</div>
          {eventsOnDay.length > 0 && (
            <div className="w-2 h-2 rounded-full bg-purple-600 mt-1"></div>
          )}
        </div>
      );
    }

    return days;
  };

  const renderEventList = () => {
    const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
    return (
      <div className="mt-6 bg-cyan-200 p-4 rounded shadow">
        <h3 className="font-bold mb-2 text-black">All Events</h3>
        {sorted.length === 0 ? (
          <p className="text-gray-500">No events yet.</p>
        ) : (
          <ul>
            {sorted.map((event, index) => (
              <li key={index} className="mb-1">
                <strong>{format(new Date(event.date), 'PPP')}:</strong> {event.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const renderModal = () => (
    showModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div className="bg-cyan-200 p-6 rounded-lg shadow-md w-80">
          <h2 className="text-lg font-bold mb-2">Add Event for {format(selectedDate, 'PPP')}</h2>
          <input
            type="text"
            className="w-full p-2 border rounded text-black mb-3"
            placeholder="Event details..."
            value={eventText}
            onChange={(e) => setEventText(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowModal(false)}
              className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleAddEvent}
              className="px-3 py-1 rounded bg-cyan-700 text-white hover:bg-cyan-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  );

  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="border rounded-lg bg-cyan-900 shadow overflow-hidden">
        {renderHeader()}
        {renderDayNames()}
        <div className="grid grid-cols-7 gap-px bg-cyan-600 p-1">
          {renderCalendarDays()}
        </div>
      </div>
      {renderEventList()}
      {renderModal()}
      {/* {canAddEvents && showModal && renderModal()} */}
    </div>
  );
};

export default Calendar;
