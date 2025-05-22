import React, { useState, useEffect } from 'react';
import {
  getClinics,
  addClinic,
  toggleClinicRecommendation
} from '../../lib/api'; 

export default function ClinicRecommendations() {
  const [clinics, setClinics] = useState([]);
  const [allClinics, setAllClinics] = useState([]);
  const [filter, setFilter] = useState('all');
  const [newClinic, setNewClinic] = useState({
    name: '',
    location: '',
    country: '',
    region: 'east',
    specialty: ''
  });

  const regions = [
    { value: 'east', label: 'East Africa' },
    { value: 'west', label: 'West Africa' },
    { value: 'south', label: 'Southern Africa' },
    { value: 'north', label: 'North Africa' },
    { value: 'central', label: 'Central Africa' }
  ];

  useEffect(() => {
    getClinics()
      .then((data) => {
        setAllClinics(data.clinics);
        setClinics(data.clinics);
      })
      .catch((error) => console.error('Error fetching clinics:', error));
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setClinics(allClinics);
    } else {
      setClinics(allClinics.filter(clinic => clinic.region === filter));
    }
  }, [filter, allClinics]);

  const handleRecommend = async (id) => {
    try {
      const updated = await toggleClinicRecommendation(id);
      setClinics(prev =>
        prev.map(clinic =>
          clinic.id === id ? { ...clinic, recommended: updated.clinic.recommended } : clinic
        )
      );
    } catch (error) {
      console.error('Failed to toggle recommendation:', error);
    }
  };

  const handleAddClinic = async (e) => {
    e.preventDefault();
    const clinicData = {
      ...newClinic,
      recommended: true,
      services: ['antenatal'],
      languages: ['English'],
      contact_info: ''
    };

    try {
      const response = await addClinic(clinicData);
      setClinics([...clinics, response.clinic]);
      setNewClinic({
        name: '',
        location: '',
        country: '',
        region: 'east',
        specialty: ''
      });
    } catch (error) {
      console.error('Failed to add clinic:', error);
    }
  };

  return (
    <div className="p-6 bg-cyan-500 rounded-2xl shadow-md mt-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Clinic Recommendations</h2>

      {/* Region Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm rounded-full ${filter === 'all' ? 'bg-cyan-900 text-white font-bold' : 'bg-cyan-300'}`}>
          All Africa
        </button>
        {regions.map(r => (
          <button key={r.value} onClick={() => setFilter(r.value)}
            className={`px-4 py-2 text-sm rounded-full ${filter === r.value ? 'bg-cyan-900 text-white font-bold' : 'bg-cyan-300'}`}>
            {r.label}
          </button>
        ))}
      </div>

      {/* Add Clinic */}
      <form onSubmit={handleAddClinic} className="mb-6 bg-cyan-200 p-4 rounded-xl shadow-sm">
        <h3 className="font-bold text-black mb-2">Add Clinic</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {['name', 'location', 'country', 'specialty'].map(field => (
            <input key={field} type="text" placeholder={field}
              value={newClinic[field]}
              onChange={(e) => setNewClinic({ ...newClinic, [field]: e.target.value })}
              className="p-2 border rounded-md bg-gray-300 text-black" required />
          ))}
          <select value={newClinic.region}
            onChange={(e) => setNewClinic({ ...newClinic, region: e.target.value })}
            className="p-2 border rounded-md bg-gray-300 text-black">
            {regions.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-cyan-600 text-black font-bold rounded-lg">
          Add Clinic
        </button>
      </form>

      {/* Clinic Table */}
      <div className="overflow-x-auto bg-cyan-500 p-4 rounded-xl shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left text-black text-1xl"> 
            <tr>
              <th className="px-4 py-2">Clinic</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Specialty</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {clinics.map(clinic => (
              <tr key={clinic.id} className="border-t">
                <td className="px-4 py-2">{clinic.name}</td>
                <td className="px-4 py-2">{clinic.location}, {clinic.country}</td>
                <td className="px-4 py-2">{clinic.specialty}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleRecommend(clinic.id)}
                    className={`px-3 py-1 rounded-full font-bold text-1xl border ${
                      clinic.recommended ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                    {clinic.recommended ? '✓ Recommended' : 'Not Recommended'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clinics.length === 0 && (
          <p className="text-center p-4 text-gray-600">No clinics found.</p>
        )}
      </div>
    </div>
  );
}
