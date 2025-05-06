import { useState } from "react";
import axios from "axios";
import { differenceInWeeks, addWeeks, parseISO } from "date-fns";

export default function CalculatorForm({ onCalculated }) {
  const [lmp, setLmp] = useState("");

  const handleSubmit = async () => {
    if (!lmp) return;

    const lmpDate = parseISO(lmp);
    const today = new Date();
    const currentWeek = differenceInWeeks(today, lmpDate);
    const edd = addWeeks(lmpDate, 40);

    // Check if currentWeek > 40 (EDD passed)
    if (currentWeek > 40) {
      alert(
        "⚠️ Based on your input, you're over 40 weeks pregnant. You may have already delivered. Please confirm your LMP."
      );
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      await axios.post(
        "http://localhost:5000/mums/pregnancy",
        { last_period_date: lmp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onCalculated(); // Notify parent to refresh results
    } catch (error) {
      console.error("❌ Error submitting LMP:", error);
    }
  };

  return (
    <div className="bg-cyan-300 p-6 rounded-2xl shadow-lg w-full mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4 text-cyan-900">
        Pregnancy Due Date Calculator
      </h2>

      <div className="mb-4">
        <label className="block text-purple-900 font-black mb-1">Last Menstrual Period (LMP):</label>
        <input
          type="date"
          value={lmp}
          onChange={(e) => setLmp(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 text-black w-full focus:ring-2 focus:ring-cyan-400"
          placeholder="YYYY-MM-DD"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-cyan-600 text-white w-full py-2 rounded-lg hover:bg-cyan-700 transition-colors"
      >
        Submit
      </button>
    </div>
  );
}
