import { useState } from "react";
import { differenceInWeeks, addWeeks, parseISO } from "date-fns";
import { addPregnancyDetails } from "../../lib/api"; // ✅ adjust path as needed

export default function CalculatorForm({ onCalculated }) {
  const [lmp, setLmp] = useState("");

  const handleSubmit = async () => {
    if (!lmp) return;

    const lmpDate = parseISO(lmp);
    const today = new Date();
    const currentWeek = differenceInWeeks(today, lmpDate);
    const edd = addWeeks(lmpDate, 40);

    if (currentWeek > 40) {
      alert(
        "⚠️ Based on your input, you're over 40 weeks pregnant. You may have already delivered. Please confirm your LMP."
      );
      return;
    }

    try {
      await addPregnancyDetails({ last_period_date: lmp }); // ✅ Replaces axios.post
      onCalculated(); // Notify parent to refresh results
    } catch (error) {
      console.error("❌ Error submitting LMP:", error);
    }
  };

  return (
    <div className="bg-cyan-100 p-6 rounded-2xl shadow-md w-full mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-4 text-gray-600">
        Pregnancy Due Date Calculator
      </h2>

      <div className="mb-4">
        <label className="block text-purple-700 font-medium mb-1">Last Menstrual Period (LMP):</label>
        <input
          type="date"
          value={lmp}
          onChange={(e) => setLmp(e.target.value)}
          className="border border-cyan-200 rounded-lg p-2 text-gray-600 w-full bg-white focus:ring-2 focus:ring-cyan-400"
          placeholder="YYYY-MM-DD"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-cyan-600 hover:bg-cyan-700 text-white w-full py-2 rounded-lg font-semibold transition-colors"
      >
        Submit
      </button>
    </div>
  );
}
