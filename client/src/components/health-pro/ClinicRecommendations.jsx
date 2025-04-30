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

  // Filter clinics by region
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
    <div className="p-6 bg-white rounded-lg shadow mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Clinic Recommendations</h2>
      
      {/* Region Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button 
          className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}
          onClick={() => setFilter('all')}
        >
          All Africa
        </button>
        {regions.map(region => (
          <button 
            key={region.value}
            className={`px-3 py-1 rounded ${filter === region.value ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'}`}
            onClick={() => setFilter(region.value)}
          >
            {region.label}
          </button>
        ))}
      </div>

      {/* Add New Clinic Form */}
      <form onSubmit={handleAddClinic} className="mb-6 space-y-3 p-4 bg-gray-50 rounded">
        <h3 className="font-medium text-lg">Add New African Clinic</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Clinic Name*"
            value={newClinic.name}
            onChange={(e) => setNewClinic({...newClinic, name: e.target.value})}
            className="border rounded p-2"
            required
          />
          <input
            type="text"
            placeholder="Location (City)*"
            value={newClinic.location}
            onChange={(e) => setNewClinic({...newClinic, location: e.target.value})}
            className="border rounded p-2"
            required
          />
          <input
            type="text"
            placeholder="Country*"
            value={newClinic.country}
            onChange={(e) => setNewClinic({...newClinic, country: e.target.value})}
            className="border rounded p-2"
            required
          />
          <select
            value={newClinic.region}
            onChange={(e) => setNewClinic({...newClinic, region: e.target.value})}
            className="border rounded p-2"
          >
            {regions.map(region => (
              <option key={region.value} value={region.value}>{region.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Specialty*"
            value={newClinic.specialty}
            onChange={(e) => setNewClinic({...newClinic, specialty: e.target.value})}
            className="border rounded p-2"
            required
          />
        </div>
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Clinic
        </button>
      </form>

      {/* Clinics Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clinic</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Services</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clinics.map(clinic => (
              <tr key={clinic.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium">{clinic.name}</div>
                  <div className="text-sm text-gray-500">{clinic.contact}</div>
                </td>
                <td className="px-6 py-4">
                  <div>{clinic.location}</div>
                  <div className="text-sm text-gray-500">{clinic.country}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{clinic.specialty}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {clinic.services.slice(0, 3).map(service => (
                      <span key={service} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {service}
                      </span>
                    ))}
                    {clinic.services.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                        +{clinic.services.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleRecommend(clinic.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${clinic.recommended 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-gray-100 text-gray-800 border border-gray-200'}`}
                  >
                    {clinic.recommended ? 'Recommended ✓' : 'Not Recommended'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clinics.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No clinics found in this region
          </div>
        )}
      </div>
    </div>
  );
}