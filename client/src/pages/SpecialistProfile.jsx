import React, { useState } from 'react';

const SpecialistProfile = () => {
  const [activeTab, setActiveTab] = useState('articles');

  // Enhanced mock data with Central and North African clinics
  const profile = {
    // ... (keep existing profile data unchanged)
    
    recommendedClinics: [
      // Existing clinics
      {
        id: 1,
        name: "Nairobi Women's Hospital",
        phone: "+254 20 366 2000",
        address: "Nairobi, Kenya",
        country: "Kenya",
        services: ["antenatal", "delivery", "postnatal"],
        specialty: "Comprehensive Maternity Care",
        rating: 4.9,
        review_count: 215,
        recommendation_note: "Excellent culturally-sensitive maternity services with 24/7 emergency OB care",
        recommended_at: "2025-05-10T00:00:00"
      },
      {
        id: 2,
        name: "Lagoon Hospitals",
        phone: "+234 1 270 4927",
        address: "Lagos, Nigeria",
        country: "Nigeria",
        services: ["high-risk", "ultrasound", "c-section"],
        specialty: "High-Risk Pregnancy Unit",
        rating: 4.7,
        review_count: 184,
        recommendation_note: "Best equipped for complicated pregnancies in West Africa",
        recommended_at: "2025-04-28T00:00:00"
      },

      // New Central Africa addition
      {
        id: 6,
        name: "Bangui Community Maternal Center",
        phone: "+236 21 612 345",
        address: "Bangui, Central African Republic",
        country: "Central Africa",
        services: ["community birth", "postpartum support", "nutrition"],
        specialty: "Community-Based Maternal Care",
        rating: 4.3,
        review_count: 78,
        recommendation_note: "Outstanding grassroots maternity care with traditional midwife partnerships",
        recommended_at: "2025-06-15T00:00:00"
      },

      // New North Africa additions
      {
        id: 7,
        name: "Casablanca Royal Maternity Hospital",
        phone: "+212 522 543 210",
        address: "Casablanca, Morocco",
        country: "North Africa",
        services: ["high-risk", "fertility", "neonatal"],
        specialty: "Advanced Obstetric Care",
        rating: 4.8,
        review_count: 192,
        recommendation_note: "State-of-the-art facilities with French-trained specialists",
        recommended_at: "2025-05-22T00:00:00"
      },
      {
        id: 8,
        name: "Tunis Women's Health Pavilion",
        phone: "+216 71 234 567",
        address: "Tunis, Tunisia",
        country: "North Africa",
        services: ["minimally-invasive", "water birth", "lactation"],
        specialty: "Gentle Birth Center",
        rating: 4.6,
        review_count: 145,
        recommendation_note: "Pioneers in low-intervention births with excellent success rates",
        recommended_at: "2025-04-10T00:00:00"
      }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* ... (keep existing header and tab navigation unchanged) ... */}

      {/* Clinics Tab */}
      {activeTab === 'clinics' && (
        <div className="p-6">
          {profile.recommendedClinics.map(clinic => (
            <div key={clinic.id} className="mb-6 p-6 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{clinic.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 font-medium">{clinic.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">({clinic.review_count} reviews)</span>
                  </div>
                  <p className="text-cyan-600 font-medium mt-2">{clinic.specialty}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    ✓ Recommended
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Location:</span> {clinic.address}, {clinic.country}
                  </p>
                  <p className="text-gray-600 mt-1">
                    <span className="font-medium">Phone:</span> {clinic.phone}
                  </p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-2">
                    {clinic.services.map(service => (
                      <span key={service} className="px-2 py-1 bg-cyan-50 text-cyan-600 rounded-full text-xs">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Dr. Ngozi's note:</span> {clinic.recommendation_note}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Recommended on {new Date(clinic.recommended_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpecialistProfile;