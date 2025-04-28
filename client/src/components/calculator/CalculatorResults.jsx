export default function CalculatorResults({ dueDate, milestones }) {
  if (!dueDate) return null;

  return (
    <div className="mt-6 p-4 border rounded-xl shadow-inner bg-purple-50">
      <h3 className="text-lg font-semibold text-purple-700 mb-2">Results</h3>

      <p><strong>Estimated Due Date (EDD):</strong> {dueDate}</p>

      <h4 className="mt-4 mb-2 font-semibold text-green-700">Key Milestones:</h4>
      <ul className="list-disc list-inside space-y-1">
        {milestones.map((milestone, index) => (
          <li key={index}>
            {milestone.name} — <span className="text-gray-600">{milestone.date}</span>
            <span className="text-sm text-gray-400 ml-2">(Reminder Email Scheduled)</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
