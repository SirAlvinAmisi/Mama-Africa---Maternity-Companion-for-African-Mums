import { useState, useEffect } from 'react';
import axios from 'axios';
const mockScans = [
  { id: 1, trimester: 'first', description: 'Normal 8-week scan' },
  { id: 2, trimester: 'second', description: '20-week anatomy scan' }
];

export default function ScanUpload() {
  const [scans, setScans] = useState(mockScans);
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
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://localhost:5000/scans", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setScans(response.data.scans || []);
      } catch (err) {
        console.error("Error fetching scans:", err);
      }
    };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const formData = new FormData();
  //   formData.append("trimester", newScan.trimester);
  //   formData.append("description", newScan.description);
  //   formData.append("file", newScan.file);

  //   try {
  //     const token = localStorage.getItem("access_token");
  //     await axios.post("http://localhost:5000/upload_scan", formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     // After upload, fetch latest scans
  //     fetchScans();
  //     setNewScan({ trimester: 'first', description: '', file: null });
  //     setEditingId(null);
  //   } catch (err) {
  //     console.error("Upload failed:", err);
  //     alert("Scan upload failed.");
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId !== null) {
      // Update existing scan
      setScans(scans.map(scan =>
        scan.id === editingId ? { ...scan, ...newScan } : scan
      ));
      setEditingId(null);
    } else {
      // Add new scan
      setScans([...scans, { ...newScan, id: scans.length + 1 }]);
    }

    // Reset form
    setNewScan({ trimester: 'first', description: '', file: null });
  };
  const handleEdit = (scan) => {
    setNewScan({ trimester: scan.trimester, description: scan.description, file: null });
    setEditingId(scan.id);
  };

  // const handleDelete = (id) => {
  //   setScans(scans.filter(scan => scan.id !== id));
  //   // setScans([...scans, { ...newScan, id: scans.length + 1 }]);
  //   // setNewScan({ trimester: 'first', description: '', file: null });
  // };

  // return (
  //   <div>
  //     <form onSubmit={handleSubmit} className="space-y-4">
  //       <div>
  //         <label className="block text-sm font-bold  text-cyan-900 mb-1">Trimester</label>
  //         <select
  //           value={newScan.trimester}
  //           onChange={(e) => setNewScan({...newScan, trimester: e.target.value})}
  //           className="w-full border bg-gray-300 text-black rounded p-2"
  //         >
  //           <option value="first">First Trimester</option>
  //           <option value="second">Second Trimester</option>
  //           <option value="third">Third Trimester</option>
  //         </select>
  //       </div>

  //       <div>
  //         <label className="block text-sm font-bold text-cyan-900 mb-1">Description</label>
  //         <input
  //           type="text"
  //           value={newScan.description}
  //           onChange={(e) => setNewScan({...newScan, description: e.target.value})}
  //           className="w-full border bg-gray-300 text-black rounded p-2"
  //           placeholder="E.g., Normal 12-week scan"
  //         />
  //       </div>

  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-1">Scan Image</label>
  //         <input
  //           type="file"
  //           accept="image/*"
  //           onChange={(e) => setNewScan({...newScan, file: e.target.files[0]})}
  //           className="w-full"
  //         />
  //       </div>

  //       <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
  //         Upload Scan
  //       </button>
  //     </form>

  //     <div className="mt-6">
  //       <h3 className="font-medium mb-2">Uploaded Samples</h3>
  //       {scans.length > 0 ? (
  //         <ul className="space-y-2">
  //           {scans.map(scan => (
  //             <li key={scan.id} className="p-3 border rounded flex justify-between">
  //               <div className="text-cyan-900 font-bold">
  //                 <span className="capitalize text-cyan-900 font-bold">{scan.trimester}</span> trimester
  //                 <p className="text-sm text-black">{scan.description}</p>
  //               </div>
  //               <button className="text-red-600 text-sm">Delete</button>
  //             </li>
  //           ))}
  //         </ul>
  //       ) : (
  //         <p className="text-gray-500">No scan samples uploaded yet</p>
  //       )}
  //     </div>
  //   </div>
  // );
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
            <li key={scan.id} className="p-3 border rounded flex justify-between items-start">
              <div>
                <div className="capitalize text-gray-800 font-medium">{scan.trimester} trimester</div>
                <p className="text-sm text-gray-700">{scan.description}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(scan)}
                  className="text-blue-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(scan.id)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
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