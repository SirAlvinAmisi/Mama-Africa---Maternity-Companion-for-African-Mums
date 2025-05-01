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
  onDateSelect,
  pregnancyInfo = null 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const startOfCurrentMonth = startOfMonth(currentMonth);
  const endOfCurrentMonth = endOfMonth(currentMonth);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const renderHeader = () => {
    const headerColor = userType === "mom" ? "bg-purple-100" : "bg-blue-100";
    return (
      <div className={`flex justify-between items-center p-4 ${headerColor} rounded-t-lg`}>
        <button 
          onClick={prevMonth} 
          className="p-2 rounded-full hover:bg-gray-200"
          aria-label="Previous month"
        >
          <span className="material-icons">Previous</span>
        </button>
        <h2 className="font-bold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button 
          onClick={nextMonth} 
          className="p-2 rounded-full hover:bg-gray-200"
          aria-label="Next month"
        >
          <span className="material-icons">Next</span>
        </button>
      </div>
    );
  };

  const renderDayNames = () => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 gap-1 p-2 bg-gray-50">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
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
      
      // Check if this date falls in any trimester (if pregnancyInfo is provided)
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
          className={`p-2 h-12 flex flex-col items-center justify-center border ${trimesterClass} ${
            eventsOnDay.length ? 'bg-purple-100 border-purple-300' : 'bg-white'
          } hover:bg-purple-50 cursor-pointer transition-colors`}
          onClick={() => onDateSelect(date)}
        >
          <div className="text-center">{i}</div>
          {eventsOnDay.length > 0 && (
            <div className="w-2 h-2 rounded-full bg-purple-500 mt-1"></div>
          )}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      {renderHeader()}
      {renderDayNames()}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar;