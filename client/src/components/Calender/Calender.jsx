import React, { useState } from 'react';
import { format, isSameDay, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import 'material-icons/iconfont/material-icons.css';

const Calendar = ({ userType = "mom", events = [], onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Initialize currentMonth state

  // Get the start and end of the current month
  const startOfCurrentMonth = startOfMonth(currentMonth);
  const endOfCurrentMonth = endOfMonth(currentMonth);

  const renderHeader = () => {
    const headerColor = userType === "mom" ? "bg-purple-100" : "bg-blue-100";
    return (
      <div className={`flex justify-between items-center p-4 ${headerColor} rounded-t-lg`}>
        <button 
          onClick={prevMonth} 
          className="p-2 rounded-full hover:bg-gray-200"
          aria-label="Previous month"
        >
          <span className="material-icons">chevron_left</span>
        </button>
        <h2 className="font-bold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button 
          onClick={nextMonth} 
          className="p-2 rounded-full hover:bg-gray-200"
          aria-label="Next month"
        >
          <span className="material-icons">chevron_right</span>
        </button>
      </div>
    );
  };

  const renderCalendarDays = () => {
    const daysInMonth = endOfCurrentMonth.getDate();
    const startDate = startOfCurrentMonth.getDay();
    
    const days = [];
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startDate; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Render actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const eventsOnDay = events.filter(event => isSameDay(new Date(event.date), date));

      days.push(
        <div 
          key={i} 
          className={`p-2 ${eventsOnDay.length ? 'bg-purple-200' : 'bg-white'} rounded-full hover:bg-purple-100`}
          onClick={() => onDateSelect(date)}
        >
          <div className="text-center">{i}</div>
          {eventsOnDay.length > 0 && <div className="text-xs text-center text-purple-600">•</div>}
        </div>
      );
    }

    return days;
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className="border rounded-lg shadow-sm">
      {renderHeader()}
      <div className="grid grid-cols-7 gap-2 p-4">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar;
