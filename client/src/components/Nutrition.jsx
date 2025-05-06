import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentWeek } from '../utils/weeklyUpdateHelper';  //how did we get this week?
// e.g. from mom’s pregnancy-info
import { useAuth } from '../store/Store'; // also implement auth context
export default function Nutrition() {
  const { token } = useAuth();
  const week = getCurrentWeek();  // e.g. from mom’s pregnancy-info
  const { data, isLoading, error } = useQuery(
    ['nutrition', week],
    () =>
      fetch(`/api/nutrition?week=${week}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json()),
    { enabled: !!token }
  );

  if (isLoading) return <div>Loading nutrition…</div>;
  if (error || data.error) return <div>Error fetching nutrition</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2">Nutrition for Week {data.week}</h2>
      <ul className="text-gray-700 mb-4">
        {Object.entries(data.nutrients).map(([nutrient, amt]) => (
          <li key={nutrient}>
            <strong>{nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}:</strong> {amt}
          </li>
        ))}
      </ul>
      <h3 className="font-semibold mb-1">Try these foods:</h3>
      <ul className="list-disc list-inside text-gray-600">
        {data.food_suggestions.map(food => (
          <li key={food}>{food}</li>
        ))}
      </ul>
    </div>
  );
}
