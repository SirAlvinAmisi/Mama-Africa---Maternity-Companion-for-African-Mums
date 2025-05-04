// src/components/calculator/CalculatorForm.jsx
import { useState } from "react";
import axios from "axios";

export default function CalculatorForm({ onCalculated }) {
  const [lmp, setLmp] = useState("");

  const handleSubmit = async () => {
    if (!lmp) return;

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
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4 text-cyan-700">
        Pregnancy Due Date Calculator
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Last Menstrual Period (LMP):</label>
        <input
          type="date"
          value={lmp}
          onChange={(e) => setLmp(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-cyan-400"
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
