import { useState } from 'react';
import axios from 'axios';

export default function MomPregnancy() {
  const [lastPeriod, setLastPeriod] = useState('');
  const [dueDate, setDueDate]       = useState('');
  const [week, setWeek]             = useState('');
  const [msg, setMsg]               = useState('');
  const token = localStorage.getItem('token');

  const submit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/mums/pregnancy',
        { last_period_date: lastPeriod, due_date: dueDate, current_week: week },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg('Pregnancy details saved!');
    } catch {
      setMsg('Error saving details');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h2 className="text-2xl font-semibold">Pregnancy Details</h2>
      <input
        type="date"
        className="w-full p-3 border rounded"
        value={lastPeriod} onChange={e => setLastPeriod(e.target.value)}
      />
      <input
        type="date"
        className="w-full p-3 border rounded"
        value={dueDate} onChange={e => setDueDate(e.target.value)}
      />
      <input
        type="number"
        placeholder="Current week"
        className="w-full p-3 border rounded"
        value={week} onChange={e => setWeek(e.target.value)}
      />
      <button className="bg-blue-button text-white px-6 py-2 rounded font-inria">
        Submit
      </button>
      {msg && <p className="text-green mt-2">{msg}</p>}
    </form>
  );
}
