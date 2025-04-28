import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MomReminders() {
  const [list, setList] = useState([]);
  useEffect(() => {
    axios
      .get('http://localhost:5000/mums/reminders', {
        headers:{ Authorization:`Bearer ${localStorage.token}` }
      })
      .then(res => setList(res.data.reminders))
      .catch(console.error);
  }, []);
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your Reminders</h2>
      {list.map((r,i) => (
        <div
          key={i}
          className="mb-3 p-4 border-l-4 border-blue-button bg-blue-50 rounded"
        >
          <p className="font-medium">{new Date(r.date).toLocaleDateString()}</p>
          <p>{r.text}</p>
        </div>
      ))}
      {!list.length && <p className="text-gray-600">No reminders yet.</p>}
    </div>
  );
}
