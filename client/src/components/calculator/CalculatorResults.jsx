// src/components/calculator/CalculatorResults.jsx
import { useEffect, useState } from "react";
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

export default function CalculatorResults({ trigger }) {
  const [dueDate, setDueDate] = useState("");
  const [milestones, setMilestones] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/mums/pregnancy-info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;
        setDueDate(data.due_date);
        setCurrentWeek(data.current_week);
        setMilestones(
          (data.appointments || []).map((m, i) => ({
            week: i * 8 + 8,
            label: m.title,
            desc: `Scheduled on ${m.date}`,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch results:", err);
      }
    };

    fetchData();
  }, [trigger]); // Refetch when trigger changes

  if (!dueDate) return null;

  const milestoneGraphData = milestones.map((m) => ({
    name: `W${m.week}`,
    label: m.label.length > 12 ? m.label.slice(0, 12) + "..." : m.label,
    week: m.week,
    completed: m.week <= currentWeek,
  }));

  return (
    // <div className="w-full mt-6 p-4 border rounded-xl shadow-inner bg-cyan-300">
    <div className="w-full max-w-3xl mx-auto mt-6 p-4 border rounded-xl shadow-inner bg-cyan-300">
      <h3 className="text-lg font-semibold text-purple-700 mb-2">Results</h3>

      <p><strong>Estimated Due Date:</strong> {dueDate}</p>
      <p><strong>Current Week:</strong> {currentWeek}</p>

      <h4 className="mt-4 mb-2 font-semibold text-green-900">Key Milestones:</h4>
      <ul className="list-disc list-inside space-y-1">
        {milestones.map((m, i) => (
          <li key={i}>
            Week {m.week}: {m.label} — <span className="text-gray-600">{m.desc}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 bg-cyan-50 p-4 rounded-xl">
        <h3 className="text-lg font-bold text-cyan-700 mb-2">Progress Chart</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={milestoneGraphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 40]} label={{ value: "Week", angle: -90, position: "insideLeft" }} />
            <Tooltip formatter={(v, name, props) => [`Week ${v}`, props.payload.label]} />
            <Line
              type="monotone"
              dataKey="week"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
