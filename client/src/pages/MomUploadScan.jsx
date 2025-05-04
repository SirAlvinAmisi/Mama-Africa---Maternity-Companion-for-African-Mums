import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MomUploadScan() {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState('');
  const [uploads, setUploads] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [doctors, setDoctors] = useState([]);
  const token = localStorage.getItem('access_token');

  const fetchUploads = async () => {
    try {
      const res = await axios.get('http://localhost:5000/mums/scans', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploads(res.data.uploads || []);
    } catch (err) {
      console.error("Failed to fetch scans:", err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/healthpros', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // setDoctors(res.data || []);
      setDoctors(res.data.specialists || []); 
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
    }
  };

  useEffect(() => {
    fetchUploads();
    fetchDoctors();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      } else if (url) {
        formData.append('file_url', url);
      }
      formData.append('notes', notes);
      formData.append('doctor_id', selectedDoctor);

      await axios.post('http://localhost:5000/mums/upload_scan', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      setMsg('✅ Scan uploaded!');
      setUrl('');
      setFile(null);
      setNotes('');
      setSelectedDoctor('');
      fetchUploads();
    } catch {
      setMsg('❌ Upload failed');
    }
  };

  const sendToDoctor = (scanId, doctorName) => {
    alert(`📤 Sent scan ID ${scanId} to ${doctorName} (simulate API call)`);
  };

  return (
    <div className="space-y-5 p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto bg-cyan-500 rounded-md shadow">
      <form onSubmit={submit} className="space-y-4">
        <h2 className="text-2xl font-semibold text-cyan-100">Upload Scan</h2>

        <input
          type="url"
          placeholder="Paste File URL"
          className="w-full px-4 py-2 border rounded bg-cyan-100 text-black"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setFile(null);
          }}
        />

        <input
          type="file"
          className="w-full px-4 py-2 border rounded bg-cyan-100 text-black"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setUrl('');
          }}
        />

        <textarea
          placeholder="Notes (optional)"
          className="w-full px-4 py-2 border rounded bg-cyan-100 text-black"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />

        {/* <select
          className="w-full px-4 py-2 border rounded bg-cyan text-black"
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
        >
          <option value="">Select Doctor</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>{doc.name}</option>
          ))}
        </select> */}
        <select
          className="w-full px-4 py-2 border rounded bg-cyan text-black"
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          required
        >
          <option value="">Select Doctor</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.full_name}
            </option>
          ))}
        </select>


        <button
          type="submit"
          className="bg-cyan-700 text-black font-bold px-4 py-2 rounded hover:bg-cyan-100"
        >
          Upload
        </button>

        {msg && <p className="text-white font-medium">{msg}</p>}
      </form>

      <hr className="my-4 border-cyan-300" />

      <div>
        <h3 className="text-xl font-bold text-black mb-2">Your Uploaded Scans</h3>
        {uploads.length === 0 ? (
          <p className="text-cyan-100">No scans uploaded yet.</p>
        ) : (
          <ul className="space-y-4">
            {uploads.map((scan) => (
              <li key={scan.id} className="border border-gray-200 rounded p-3 bg-cyan-200">
                <p className="text-sm font-bold text-black">📅 {scan.uploaded_at}</p>
                <a
                  href={scan.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline block"
                >
                  {scan.file_url}
                </a>
                <p className="text-sm text-black mt-1">📝 {scan.notes || 'No notes'}</p>
                <p className="text-sm text-black mt-1">👩‍⚕️ Sent to: {scan.doctor_name || 'Not sent'}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
