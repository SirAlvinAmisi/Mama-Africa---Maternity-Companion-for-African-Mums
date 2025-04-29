export default function PeriodFields({ cycleLength, setCycleLength }) {
  return (
    <div className="mt-4">
      <label className="block text-gray-700">Average Cycle Length (days):</label>
      <input 
        type="number" 
        min="20" 
        max="45"
        value={cycleLength} 
        onChange={(e) => setCycleLength(e.target.value)} 
        className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-green-400"
      />
    </div>
  );
}
