import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import { format, isSameDay } from 'date-fns';

const HealthProfCalendar = ({ profId }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    date: new Date(),
    time: '09:00',
    type: 'checkup',
    notes: ''
  });

  useEffect(() => {
    const dummyAppointments = [
      { 
        id: 1, 
        patientName: 'Sarah Johnson', 
        date: new Date(2025, 3, 29, 10), 
        time: '10:00 AM', 
        type: 'checkup',
        motherId: 101,
        createdBy: profId,
        editable: true
      },
      { 
        id: 2, 
        patientName: 'Mary Williams', 
        date: new Date(2025, 3, 30, 14, 30), 
        time: '2:30 PM', 
        type: 'ultrasound',
        motherId: 102,
        createdBy: 201, // Another doctor
        editable: true
      },
      { 
        id: 3, 
        patientName: 'Aisha Mwangi', 
        date: new Date(2025, 4, 2, 9), 
        time: '9:00 AM', 
        type: 'consultation',
        motherId: 103,
        createdBy: profId,
        editable: true
      },
    ];
    setAppointments(dummyAppointments);
  }, [profId]);

  const handleDateSelect = (date) => {
    const appointmentsOnDay = appointments.filter(appt =>
      isSameDay(new Date(appt.date), date)
    );
    setSelectedAppointment(appointmentsOnDay.length ? appointmentsOnDay : null);
    setEditingAppointment(null); // Reset editing state
  };

  const startEditing = (appointment) => {
    setEditingAppointment(appointment);
    setNewAppointment({
      ...appointment,
      date: new Date(appointment.date)
    });
    setShowAddForm(true);
  };

  const saveAppointment = () => {
    if (editingAppointment) {
      // Update existing appointment
      const updatedAppointments = appointments.map(appt => 
        appt.id === editingAppointment.id ? {...newAppointment, id: appt.id} : appt
      );
      setAppointments(updatedAppointments);
      setEditingAppointment(null);
    } else {
      // Add new appointment
      const appointmentToAdd = {
        id: Math.max(0, ...appointments.map(a => a.id)) + 1,
        ...newAppointment,
        createdBy: profId,
        editable: true
      };
      setAppointments([...appointments, appointmentToAdd]);
    }
    
    // Reset form
    setShowAddForm(false);
    setNewAppointment({
      patientName: '',
      date: new Date(),
      time: '09:00',
      type: 'checkup',
      notes: ''
    });
  };

  const deleteAppointment = (id) => {
    setAppointments(appointments.filter(appt => appt.id !== id));
    if (selectedAppointment?.some(appt => appt.id === id)) {
      setSelectedAppointment(selectedAppointment.filter(appt => appt.id !== id));
      if (selectedAppointment.length === 1) {
        setSelectedAppointment(null);
      }
    }
  };

  const setAvailability = (date, timeSlots) => {
    console.log("Setting availability for", date, timeSlots);
    // Implement availability setting logic
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">Professional Schedule</h2>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <Calendar
          userType="healthProf"
          events={appointments}
          onDateSelect={handleDateSelect}
        />
      </div>
      
      {selectedAppointment && (
        <div className="mt-6 p-5 bg-blue-50 rounded-lg border border-blue-100">
          {selectedAppointment.map(appt => (
            <div key={appt.id} className="mb-4 pb-4 border-b border-blue-100 last:border-b-0 last:mb-0 last:pb-0">
              <div className="flex justify-between">
                <h3 className="text-xl font-bold text-blue-900">Appointment with {appt.patientName}</h3>
                <div className="flex space-x-2">
                  {/* Show edit for all appointments (health professionals can edit any appointment) */}
                  <button 
                    onClick={() => startEditing(appt)} 
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <span className="material-icons">edit</span>
                  </button>
                  {/* Only allow deletion if created by this professional */}
                  {appt.createdBy === profId && (
                    <button 
                      onClick={() => deleteAppointment(appt.id)} 
                      className="text-red-500 hover:text-red-700"
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  )}
                </div>
              </div>
              <p className="text-blue-700 mt-1">
                {format(new Date(appt.date), 'EEEE, MMMM do yyyy')} at {appt.time}
              </p>
              <p className="mt-2 capitalize"><span className="font-medium">Type:</span> {appt.type}</p>
              {appt.notes && <p className="mt-2"><span className="font-medium">Notes:</span> {appt.notes}</p>}
            </div>
          ))}
        </div>
      )}
      
      {showAddForm ? (
        <div className="mt-6 p-5 bg-white rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-bold text-blue-800 mb-4">
            {editingAppointment ? "Edit Appointment" : "Add New Appointment"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
              <input type="text" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300" 
                value={newAppointment.patientName} 
                onChange={(e) => setNewAppointment({...newAppointment, patientName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300"
                value={format(newAppointment.date, "yyyy-MM-dd")} 
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setNewAppointment({...newAppointment, date});
                }} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input type="time" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300"
                value={newAppointment.time.includes(':') ? newAppointment.time : `${newAppointment.time} AM`} 
                onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
              <select className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300" 
                value={newAppointment.type} 
                onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value})}>
                <option value="checkup">Regular Checkup</option>
                <option value="ultrasound">Ultrasound</option>
                <option value="consultation">Consultation</option>
                <option value="follow-up">Follow-up</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300" 
                value={newAppointment.notes || ''} 
                onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                rows="3"></textarea>
            </div>
            <button onClick={saveAppointment} className="mt-4 w-full bg-blue-600 text-white p-2 rounded-lg shadow-md">
              {editingAppointment ? "Update Appointment" : "Add Appointment"}
            </button>
            {editingAppointment && (
              <button 
                onClick={() => {
                  setEditingAppointment(null);
                  setShowAddForm(false);
                  setNewAppointment({
                    patientName: '',
                    date: new Date(),
                    time: '09:00',
                    type: 'checkup',
                    notes: ''
                  });
                }} 
                className="mt-2 w-full bg-gray-300 text-gray-700 p-2 rounded-lg shadow-md"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button onClick={() => setShowAddForm(true)} className="flex-1 bg-blue-600 text-white p-2 rounded-lg shadow-md">
            Add New Appointment
          </button>
          <button onClick={() => setAvailability(new Date(), [])} className="flex-1 bg-green-600 text-white p-2 rounded-lg shadow-md">
            Set Availability
          </button>
        </div>
      )}
    </div>
  );
};

export default HealthProfCalendar;