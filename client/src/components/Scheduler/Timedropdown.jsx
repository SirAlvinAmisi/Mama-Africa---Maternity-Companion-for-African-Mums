import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Clock } from 'lucide-react';

// Component for the scheduler's time selection dropdown

const TimeDropdown = ({ 
  label = "Appointment Time", 
  onChange = () => {}, 
  defaultValue = null,
  interval = 15 // minutes between time options
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(defaultValue);
  const dropdownRef = useRef(null);
  
  // Generate time options from 6:00 AM to 8:00 PM
  const generateTimeOptions = () => {
    const options = [];
    const startHour = 6; // 6 AM
    const endHour = 20; // 8 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const amPm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const displayMinute = minute.toString().padStart(2, '0');
        const timeValue = `${displayHour}:${displayMinute} ${amPm}`;
        options.push(timeValue);
      }
    }
    
    return options;
  };
  
  const timeOptions = generateTimeOptions();
  
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setIsOpen(false);
    onChange(time);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="w-full mb-4" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <button
          type="button"
          className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center">
            <Clock size={16} className="mr-2 text-cyan-600" />
            <span>{selectedTime || "Select time"}</span>
          </div>
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            <div className="py-1">
              {timeOptions.map((time, index) => (
                <button
                  key={index}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-cyan-100 flex items-center ${
                    selectedTime === time ? 'bg-cyan-50 text-cyan-700' : 'text-gray-700'
                  }`}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeDropdown;

