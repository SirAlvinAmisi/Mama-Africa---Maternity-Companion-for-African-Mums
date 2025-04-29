import { useState } from "react";
import PeriodFields from "./PeriodFields";
import PregnancyFields from "./PregnancyFields";
import CalculatorResults from "./CalculatorResults";
import useCalculator from "./useCalculator";

export default function CalculatorForm() {
  const [mode, setMode] = useState("period"); // Default mode
  const { lmp, cycleLength, dueDate, milestones, setLmp, setCycleLength, calculatePregnancy, resetCalculator } = useCalculator();

  const handleSubmit = (e) => {
    e.preventDefault();
    calculatePregnancy(mode);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4 text-purple-700">Maternity Calculator</h2>

      <div className="flex justify-around mb-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input 
            type="radio" 
            name="mode" 
            checked={mode === "period"}
            onChange={() => setMode('period')} 
            className="accent-purple-600"
          />
          <span className="hover:text-purple-700">Period Tracking</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input 
            type="radio" 
            name="mode" 
            checked={mode === "pregnancy"}
            onChange={() => setMode('pregnancy')} 
            className="accent-purple-600"
          />
          <span className="hover:text-purple-700">Pregnancy</span>
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-gray-700">Last Period (LMP):</label>
        <input 
          type="date" 
          value={lmp} 
          onChange={(e) => setLmp(e.target.value)} 
          className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-purple-400"
        />

        {mode === "period" ? (
          <PeriodFields cycleLength={cycleLength} setCycleLength={setCycleLength} />
        ) : (
          <PregnancyFields />
        )}

        <button 
          type="submit" 
          className="bg-purple-600 text-white w-full py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Calculate
        </button>

        <button 
          type="button" 
          onClick={resetCalculator}
          className="bg-gray-200 text-gray-700 w-full py-2 rounded-lg hover:bg-gray-300 transition-colors mt-2"
        >
          Reset
        </button>
      </form>

      <CalculatorResults dueDate={dueDate} milestones={milestones} />
    </div>
  );
}
