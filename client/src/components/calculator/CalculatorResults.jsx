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
  const [overdueMessage, setOverdueMessage] = useState("");


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
        setOverdueMessage(data.overdue_message || "");

        const lmpDate = new Date(data.last_period_date);
        const msPerWeek = 7 * 24 * 60 * 60 * 1000;

        const futureMilestones = (data.appointments || [])
          .map((appointment) => {
            const milestoneDate = new Date(appointment.date);
            const weeksFromLMP = Math.floor((milestoneDate - lmpDate) / msPerWeek);

            return {
              week: weeksFromLMP,
              label: appointment.title,
              desc: `Scheduled on ${appointment.date}`,
            };
          })
          // .filter((m) => m.week >= (data.current_week ?? 0));
          .filter((m) => m.week >= (data.current_week ?? 0) && m.week <= 40);
          console.log("Pregnancy info response:", data);
        // setMilestones(futureMilestones);
        const seen = new Set();
        const deduped = futureMilestones.filter(m => {
          const key = `${m.week}-${m.label}`;
          return seen.has(key) ? false : seen.add(key);
        });
        setMilestones(deduped);

      } catch (err) {
        console.error("❌ Failed to fetch results:", err);
      }
    };

    fetchData();
  }, [trigger]);

  if (!dueDate) return null;

  const milestoneGraphData = milestones.map((m) => ({
    name: `W${m.week}`,
    label: m.label.length > 12 ? m.label.slice(0, 12) + "..." : m.label,
    week: m.week,
    completed: m.week <= currentWeek,
  }));

  return (
    <div className="w-full max-w-screen-xl mx-auto mt-6 p-4 border rounded-xl shadow-inner bg-cyan-300">
      <h3 className="text-lg font-bold text-purple-900 mb-2"><strong>Results</strong></h3>
      <p className="text-lg font-semibold text-purple-900 mb-2"><strong>Estimated Due Date:</strong> {dueDate}</p>
      <p className="text-lg font-semibold text-purple-900 mb-2"><strong>Current Week:</strong> {currentWeek}</p>
      {overdueMessage && (
        <p className="text-red-600 font-bold mt-2">
          {overdueMessage}
        </p>
      )}

      <h4 className="mt-4 mb-2 font-bold text-purple-900"><strong>Key Milestones:</strong></h4>
      <ul className="list-disc list-inside space-y-1 font-bold text-purple-900">
        {milestones.map((m, i) => (
          <li key={i}>
            Week {m.week}: {m.label} — <span className="text-black">{m.desc}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 bg-cyan-50 p-4 rounded-xl mx-auto shadow-md">
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
