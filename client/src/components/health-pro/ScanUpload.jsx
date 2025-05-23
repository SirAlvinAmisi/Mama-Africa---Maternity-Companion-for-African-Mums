
import { useState, useEffect } from 'react';
import { getHealthProScans, uploadHealthProScan } from '../../lib/api';

export default function ScanUpload() {
  const [scans, setScans] = useState([]);
  const [newScan, setNewScan] = useState({
    trimester: 'first',
    description: '',
    file: null
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const data = await getHealthProScans();
      setScans(data.scans || []);
    } catch (err) {
      console.error("Error fetching scans:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("trimester", newScan.trimester);
    formData.append("description", newScan.description);
    formData.append("file", newScan.file);

    try {
      await uploadHealthProScan(formData);
      await fetchScans();
      setNewScan({ trimester: 'first', description: '', file: null });
      setEditingId(null);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Scan upload failed.");
    }
  };

  const handleEdit = (scan) => {
    setNewScan({ trimester: scan.trimester, description: scan.description, file: null });
    setEditingId(scan.id);
  };

  const handleDelete = (id) => {
    setScans(scans.filter(scan => scan.id !== id));
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Trimester</label>
          <select
            value={newScan.trimester}
            onChange={(e) => setNewScan({ ...newScan, trimester: e.target.value })}
            className="w-full border bg-white text-gray-700 rounded p-2"
          >
            <option value="first">First Trimester</option>
            <option value="second">Second Trimester</option>
            <option value="third">Third Trimester</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Description</label>
          <input
            type="text"
            value={newScan.description}
            onChange={(e) => setNewScan({ ...newScan, description: e.target.value })}
            className="w-full border bg-white text-gray-700 rounded p-2"
            placeholder="E.g., Normal 12-week scan"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Scan Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewScan({ ...newScan, file: e.target.files[0] })}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editingId !== null ? 'Update Scan' : 'Upload Scan'}
        </button>
      </form>

      <div className="mt-6">
        <h3 className="font-semibold text-gray-800 mb-2">Uploaded Samples</h3>
        {scans.length > 0 ? (
          <ul className="space-y-2">
            {scans.map(scan => (
              <li key={scan.id} className="p-3 border rounded flex justify-between items-start space-x-4">
                <div className="flex-1">
                  <div className="capitalize text-gray-800 font-medium">{scan.trimester} trimester</div>
                  <p className="text-sm text-gray-700 mb-2">{scan.description}</p>
                  {scan.file_url && (
                    <img
                      src={scan.file_url}
                      alt="Scan"
                      className="w-32 h-32 object-cover rounded"
                    />
                  )}

                </div>
                <div className="space-x-2">
                  <button onClick={() => handleEdit(scan)} className="text-blue-600 text-sm">Edit</button>
                  <button onClick={() => handleDelete(scan.id)} className="text-red-600 text-sm">Delete</button>
                </div>
              </li>
            ))}

          </ul>
        ) : (
          <p className="text-gray-500">No scan samples uploaded yet</p>
        )}
      </div>
    </div>
  );
}
