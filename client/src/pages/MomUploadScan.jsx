import { useState } from 'react';
import axios from 'axios';

export default function MomUploadScan() {
  const [url, setUrl]     = useState('');
  const [notes, setNotes] = useState('');
  const [msg, setMsg]     = useState('');
  const token = localStorage.token;

  const submit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/mums/upload_scan',
        { file_url: url, notes },
        { headers:{ Authorization:`Bearer ${token}` } }
      );
      setMsg('Scan uploaded!');
    } catch {
      setMsg('Upload failed');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h2 className="text-2xl font-semibold">Upload Scan</h2>
      <input
        type="url" placeholder="File URL"
        className="w-full p-3 border rounded"
        value={url} onChange={e => setUrl(e.target.value)}
      />
      <textarea
        placeholder="Notes (optional)"
        className="w-full p-3 border rounded"
        value={notes} onChange={e => setNotes(e.target.value)}
      />
      <button className="bg-blue-button text-white px-6 py-2 rounded font-inria">
        Upload
      </button>
      {msg && <p className="text-green mt-2">{msg}</p>}
    </form>
  );
}
