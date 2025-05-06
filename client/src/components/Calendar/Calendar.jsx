import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';

const Calendar = ({ userType = "mom", events = [], onDateSelect, pregnancyInfo = null }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const startOfCurrentMonth = startOfMonth(currentMonth);
  const endOfCurrentMonth = endOfMonth(currentMonth);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const renderHeader = () => {
    const headerColor = userType === "mom" ? "bg-cyan-700" : "bg-blue-400";
    return (
      <div className={`flex justify-between items-center p-4 ${headerColor} rounded-t-lg`}>
        <button onClick={prevMonth} className="p-2 rounded-full bg-cyan-500 hover:bg-cyan-200">
          <span className="material-icons text-black font-bold">Previous</span>
        </button>
        <h2 className="font-bold text-gray-800 text-lg">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button onClick={nextMonth} className="p-2 rounded-full bg-cyan-500 hover:bg-cyan-200">
          <span className="material-icons text-black font-bold">Next</span>
        </button>
      </div>
    );
  };

  const renderDayNames = () => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 gap-1 p-2 bg-cyan-200 text-gray-600 text-sm font-medium">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-black font-bold">{day}</div>
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
          onClick={() => onDateSelect(date)}
          className={`p-2 h-16 flex flex-col items-center justify-center border cursor-pointer ${trimesterClass} ${
            eventsOnDay.length ? 'bg-purple-100 border-purple-300' : 'bg-white'
          } hover:bg-purple-50`}
        >
          <div className="font-bold text-black font-bold">{i}</div>
          {eventsOnDay.length > 0 && (
            <div className="w-2 h-2 rounded-full bg-purple-600 mt-1"></div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="border rounded-lg bg-cyan-900 shadow overflow-hidden">
      {renderHeader()}
      {renderDayNames()}
      <div className="grid grid-cols-7 gap-px bg-cyan-600 p-1">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar;
