// src/components/calculator/CalculatorForm.jsx
import { useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function CalculatorForm() {
  const [lmp, setLmp] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [milestones, setMilestones] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(null);

  const calculateDueDate = async () => {
    if (!lmp) return;

    const eddDate = new Date(lmp);
    eddDate.setDate(eddDate.getDate() + 280);
    const formattedEDD = eddDate.toISOString().split("T")[0];
    setDueDate(formattedEDD);

    const today = new Date();
    const start = new Date(lmp);
    const diffWeeks = Math.floor((today - start) / (7 * 24 * 60 * 60 * 1000));
    setCurrentWeek(diffWeeks);

    try {
      localStorage.setItem("token", response.data.token);

      const response = await axios.get("http://localhost:5000/mums/pregnancy-info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      const data = response.data;
      setMilestones(
        (data.appointments || []).map((m, i) => ({
          week: i * 8 + 8,
          label: m.title,
          desc: `Scheduled on ${m.date}`
        }))
      );
    } catch (error) {
      console.error("Failed to fetch milestones:", error);
    }
  }    

  const milestoneGraphData = milestones.map((m) => ({
    name: `W${m.week}`,
    label: m.label.length > 12 ? m.label.slice(0, 12) + "..." : m.label,
    week: m.week,
    completed: m.week <= currentWeek
  }));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4 text-cyan-700">Pregnancy Due Date Calculator</h2>

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
        onClick={calculateDueDate}
        className="bg-cyan-600 text-white w-full py-2 rounded-lg hover:bg-cyan-700 transition-colors"
      >
        Calculate Due Date
      </button>

      {dueDate && (
        <div className="mt-6 bg-cyan-50 p-4 rounded-xl text-center">
          <h3 className="text-xl font-bold text-cyan-700">Estimated Due Date</h3>
          <p className="text-lg text-gray-700">{dueDate}</p>
          {currentWeek !== null && (
            <p className="text-md text-cyan-800 mt-2">You are approximately <strong>{currentWeek}</strong> weeks pregnant</p>
          )}
        </div>
      )}

      {milestones.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-cyan-700 mb-2">Pregnancy Milestones</h3>
          <div className="space-y-3 mb-6">
            {milestones.map((milestone) => (
              <div
                key={milestone.id || milestone.week}
                className="border-l-4 border-cyan-400 pl-4 py-2"
              >
                <h4 className="font-semibold text-cyan-700">
                  Week {milestone.week}: {milestone.label}
                </h4>
                <p className="text-gray-600 text-sm">{milestone.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-cyan-50 p-4 rounded-xl">
            <h3 className="text-lg font-bold text-cyan-700 mb-2">Progress Chart</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={milestoneGraphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 40]} label={{ value: "Week", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  formatter={(value, name, props) => [`Week ${value}`, props.payload.label]}
                />
                <Line
                  type="monotone"
                  dataKey="week"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>

          </div>
        </div>
      )}
    </div>
  );
}