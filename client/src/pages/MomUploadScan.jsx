import { useState } from 'react';
import axios from 'axios';

export default function MomUploadScan() {
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState('');
  const token = localStorage.token;

  const submit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/mums/upload_scan',
        { file_url: url, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg('✅ Scan uploaded!');
    } catch {
      setMsg('❌ Upload failed');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5 p-4 sm:p-6 lg:p-8 max-w-xl mx-auto">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-normal text-gray-800">
        Upload Scan
      </h2>

      <input
        type="url"
        placeholder="File URL"
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        value={url}
        onChange={e => setUrl(e.target.value)}
      />

      <textarea
        placeholder="Notes (optional)"
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        rows={4}
      />

      <button
        type="submit"
        className="bg-white text-blue-700 border border-blue-600 rounded-md px-6 py-2 text-sm sm:text-base font-medium shadow hover:bg-blue-50 active:bg-blue-100 transition"
      >
        Upload
      </button>

      {msg && <p className="text-green-600 text-sm sm:text-base">{msg}</p>}
    </form>
  );
}
