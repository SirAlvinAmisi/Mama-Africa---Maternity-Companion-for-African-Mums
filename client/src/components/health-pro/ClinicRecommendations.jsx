import React, { useState, useEffect } from 'react';

const africanClinics = [
  {
    id: 1,
    name: "Nairobi Women's Hospital",
    location: "Nairobi, Kenya",
    country: "Kenya",
    region: "east",
    specialty: "Comprehensive Maternity Care",
    contact: "+254 20 366 2000",
    languages: ["English", "Swahili"],
    services: ["antenatal", "delivery", "postnatal", "neonatal"],
    recommended: true
  },
  {
    id: 2,
    name: "Lagoon Hospitals",
    location: "Lagos, Nigeria",
    country: "Nigeria",
    region: "west",
    specialty: "High-Risk Pregnancy Unit",
    contact: "+234 1 270 4927",
    languages: ["English", "Yoruba"],
    services: ["high-risk", "ultrasound", "c-section"],
    recommended: true
  },
  {
    id: 3,
    name: "Ghana Fertility Center",
    location: "Accra, Ghana",
    country: "Ghana",
    region: "west",
    specialty: "Fertility & Prenatal Care",
    contact: "+233 30 222 6855",
    languages: ["English", "Twi"],
    services: ["ivf", "fertility", "prenatal"],
    recommended: false
  },
  {
    id: 4,
    name: "Aga Khan Hospital Dar es Salaam",
    location: "Dar es Salaam, Tanzania",
    country: "Tanzania",
    region: "east",
    specialty: "Maternal-Fetal Medicine",
    contact: "+255 22 211 5151",
    languages: ["English", "Swahili"],
    services: ["fetal", "genetic", "diabetes"],
    recommended: true
  },
  {
    id: 5,
    name: "Netcare Parklands Hospital",
    location: "Johannesburg, South Africa",
    country: "South Africa",
    region: "south",
    specialty: "High-Risk Deliveries",
    contact: "+27 11 480 5600",
    languages: ["English", "Zulu"],
    services: ["nicu", "emergency", "preterm"],
    recommended: true
  }
];

export default function ClinicRecommendations() {
  const [clinics, setClinics] = useState(africanClinics);
  const [filter, setFilter] = useState('all');
  const [newClinic, setNewClinic] = useState({
    name: '',
    location: '',
    country: '',
    region: 'east',
    specialty: ''
  });

  useEffect(() => {
    if (filter === 'all') {
      setClinics(africanClinics);
    } else {
      setClinics(africanClinics.filter(clinic => clinic.region === filter));
    }
  }, [filter]);

  const handleRecommend = (id) => {
    setClinics(clinics.map(clinic =>
      clinic.id === id ? { ...clinic, recommended: !clinic.recommended } : clinic
    ));
  };

  const handleAddClinic = (e) => {
    e.preventDefault();
    const clinicToAdd = {
      ...newClinic,
      id: clinics.length + 1,
      recommended: true,
      languages: ["English"],
      services: ["antenatal"],
      contact: ""
    };
    setClinics([...clinics, clinicToAdd]);
    setNewClinic({
      name: '',
      location: '',
      country: '',
      region: 'east',
      specialty: ''
    });
  };

  const regions = [
    { value: 'east', label: 'East Africa' },
    { value: 'west', label: 'West Africa' },
    { value: 'south', label: 'Southern Africa' },
    { value: 'north', label: 'North Africa' },
    { value: 'central', label: 'Central Africa' }
  ];

  return (
    <div className="p-6 bg-cyan rounded-2xl shadow-md mt-6 max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-6">Clinic Recommendations</h2>

      {/* Region Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm rounded-full transition ${
            filter === 'all' ? 'bg-cyan-600 text-black font-bold shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Africa
        </button>
        {regions.map(region => (
          <button
            key={region.value}
            onClick={() => setFilter(region.value)}
            className={`px-4 py-2 text-sm rounded-full transition ${
              filter === region.value ? 'bg-green-600 text-white shadow-sm' : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            {region.label}
          </button>
        ))}
      </div>

      {/* Add Clinic Form */}
      <form onSubmit={handleAddClinic} className="mb-8 bg-gray-50 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-medium mb-4">Add a New Clinic</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Clinic Name"
            value={newClinic.name}
            onChange={(e) => setNewClinic({ ...newClinic, name: e.target.value })}
            className="p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={newClinic.location}
            onChange={(e) => setNewClinic({ ...newClinic, location: e.target.value })}
            className="p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Country"
            value={newClinic.country}
            onChange={(e) => setNewClinic({ ...newClinic, country: e.target.value })}
            className="p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            required
          />
          <select
            value={newClinic.region}
            onChange={(e) => setNewClinic({ ...newClinic, region: e.target.value })}
            className="p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          >
            {regions.map(region => (
              <option key={region.value} value={region.value}>{region.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Specialty"
            value={newClinic.specialty}
            onChange={(e) => setNewClinic({ ...newClinic, specialty: e.target.value })}
            className="p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
        >
          Add Clinic
        </button>
      </form>

      {/* Clinics Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">Clinic</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Specialty</th>
              <th className="px-6 py-3 text-left">Services</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {clinics.map(clinic => (
              <tr key={clinic.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800">{clinic.name}</div>
                  <div className="text-xs text-gray-500">{clinic.contact}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-700">{clinic.location}</div>
                  <div className="text-xs text-gray-500">{clinic.country}</div>
                </td>
                <td className="px-6 py-4">{clinic.specialty}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {clinic.services.slice(0, 3).map(service => (
                      <span key={service} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {service}
                      </span>
                    ))}
                    {clinic.services.length > 3 && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded-full">
                        +{clinic.services.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleRecommend(clinic.id)}
                    className={`px-3 py-1 text-xs rounded-full font-medium border ${
                      clinic.recommended
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    } hover:shadow-sm transition`}
                  >
                    {clinic.recommended ? '✓ Recommended' : 'Not Recommended'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clinics.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No clinics found in this region.
          </div>
        )}
      </div>
    </div>
  );
}
