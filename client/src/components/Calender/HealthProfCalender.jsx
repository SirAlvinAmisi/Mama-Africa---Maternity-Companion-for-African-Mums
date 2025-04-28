import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import { format, isSameDay } from 'date-fns';

const HealthProfCalendar = ({ profId }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  useEffect(() => {
    const dummyAppointments = [
      { id: 1, patientName: 'Sarah Johnson', date: new Date(2025, 3, 29, 10), time: '10:00 AM', type: 'checkup' },
      { id: 2, patientName: 'Mary Williams', date: new Date(2025, 3, 30, 14, 30), time: '2:30 PM', type: 'ultrasound' },
      { id: 3, patientName: 'Aisha Mwangi', date: new Date(2025, 4, 2, 9), time: '9:00 AM', type: 'consultation' },
    ];
    setAppointments(dummyAppointments);
  }, [profId]);

  const handleDateSelect = (date) => {
    const appointmentsOnDay = appointments.filter(appt => 
      isSameDay(new Date(appt.date), date)
    );
    setSelectedAppointment(appointmentsOnDay.length ? appointmentsOnDay : null);
  };

  const setAvailability = (date, timeSlots) => {
    console.log("Setting availability for", date, timeSlots);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-blue-800 mb-4">Professional Schedule</h2>
      <Calendar 
        userType="healthProf"
        events={appointments}
        onDateSelect={handleDateSelect}
      />
      
      {selectedAppointment && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold">Appointment with {selectedAppointment[0].patientName}</h3>
          <p>{format(new Date(selectedAppointment[0].date), 'MMMM d, yyyy')} at {selectedAppointment[0].time}</p>
          <p>Type: {selectedAppointment[0].type}</p>
        </div>
      )}
      
      <button 
        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700"
        onClick={() => setAvailability(new Date(), [])}
      >
        Set Availability
      </button>
    </div>
  );
};

export default HealthProfCalendar;
