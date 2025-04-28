import { useState } from 'react';
import axios from 'axios';

export default function MomAskQuestion() {
  const [q, setQ]         = useState('');
  const [anon, setAnon]   = useState(false);
  const [msg, setMsg]     = useState('');
  const token = localStorage.token;

  const submit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/mums/questions',
        { question_text: q, is_anonymous: anon },
        { headers:{ Authorization:`Bearer ${token}` } }
      );
      setMsg('Question posted!');
    } catch {
      setMsg('Error posting');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h2 className="text-2xl font-semibold">Ask a Question</h2>
      <textarea
        required placeholder="Your question..."
        className="w-full p-3 border rounded"
        value={q} onChange={e => setQ(e.target.value)}
      />
      <label className="flex items-center space-x-2">
        <input
          type="checkbox" checked={anon}
          onChange={e => setAnon(e.target.checked)}
        />
        <span>Post anonymously</span>
      </label>
      <button className="bg-blue-button text-white px-6 py-2 rounded font-inria">
        Submit
      </button>
      {msg && <p className="text-green mt-2">{msg}</p>}
    </form>
  );
}
