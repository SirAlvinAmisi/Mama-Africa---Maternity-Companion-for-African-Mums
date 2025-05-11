// import { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function MomAskQuestion() {
//   const [questionText, setQuestionText] = useState('');
//   const [anon, setAnon] = useState(false);
//   const [selectedDoctor, setSelectedDoctor] = useState('');
//   const [doctors, setDoctors] = useState([]);
//   const [questions, setQuestions] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [msg, setMsg] = useState('');

//   // const token = localStorage.token;
//   const token = localStorage.getItem("access_token");

//   const axiosConfig = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     },
//     withCredentials: true
//   };
//   const axiosAuthHeaders = {
//     headers: {
//       Authorization: `Bearer ${token}`
//     },
//     withCredentials: true
//   };

//   const axiosPostPatchHeaders = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     },
//     withCredentials: true
//   };



//   useEffect(() => {
//     fetchDoctors();
//     fetchQuestions();
//   }, []);

//   const fetchDoctors = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/healthpros', axiosConfig);
//       // setDoctors(res.data.doctors || []);
//       setDoctors(res.data.specialists || []); 
//     } catch {
//       setMsg('Failed to load doctors');
//     }
//   };

//   const fetchQuestions = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/mums/questions', axiosAuthHeaders);
//       setQuestions(res.data);
//     } catch {
//       setMsg('Failed to load questions');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingId) {
//         await axios.patch('http://localhost:5000/mums/questions', {
//           id: editingId,
//           question_text: questionText,
//         }, axiosPostPatchHeaders);
//         setMsg('Question updated!');
//         setEditingId(null);
//       } else {
//         await axios.post('http://localhost:5000/mums/questions', {
//           question_text: questionText,
//           is_anonymous: anon,
//           doctor_id: selectedDoctor
//         }, axiosConfig);
//         setMsg('Question posted!');
//       }

//       setQuestionText('');
//       setAnon(false);
//       setSelectedDoctor('');
//       fetchQuestions();
//     } catch {
//       setMsg('Error posting or updating question');
//     }
//   };

//   const handleEdit = (q) => {
//     setQuestionText(q.question_text);
//     setSelectedDoctor(q.doctor_id);
//     setEditingId(q.id);
//     setAnon(false);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   return (
//     <div className="space-y-6 bg-cyan-200 p-6 rounded-lg shadow-md">
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <h2 className="text-2xl font-bold text-cyan-900">
//           {editingId ? 'Edit Your Question' : 'Ask a Question'}
//         </h2>

//         <select
//           className="w-full px-4 py-2 border rounded bg-gray-200 text-black"
//           value={selectedDoctor}
//           onChange={(e) => setSelectedDoctor(e.target.value)}
//           required
//         >
//           <option value="">Select Doctor</option>
//           {doctors.map((doc) => (
//             <option key={doc.id} value={doc.id}>
//               {doc.full_name}
//             </option>
//           ))}
//         </select>

//         <textarea
//           required
//           placeholder="Your question..."
//           className="w-full p-3 border rounded text-black bg-gray-200"
//           value={questionText}
//           onChange={e => setQuestionText(e.target.value)}
//         />

//         {!editingId && (
//           <label className="flex items-center space-x-2 font-bold text-cyan-900">
//             <input
//               type="checkbox"
//               checked={anon}
//               onChange={e => setAnon(e.target.checked)}
//             />
//             <span>Post anonymously</span>
//           </label>
//         )}

//         <button className="bg-cyan-900 text-black px-6 py-2 rounded font-bold">
//           {editingId ? 'Update Question' : 'Submit Question'}
//         </button>

//         {msg && <p className="text-cyan-900 font-bold mt-2">{msg}</p>}
//       </form>

//       <div>
//         <h3 className="text-xl mt-6 font-bold text-cyan-900">Your Previous Questions</h3>
//         <ul className="mt-2 space-y-3 bg-gray-100 p-4 rounded-lg">
//           {questions.map(q => (
//             <li key={q.id} className="border p-3 rounded bg-cyan-500 text-black">
//               <p><strong>To:</strong> {q.doctor_name}</p>
//               <p><strong>Q:</strong> {q.question_text}</p>
//               <p><strong>A:</strong> {q.answer_text || "Not answered yet."}</p>
//               {!q.answer_text && (
//                 <button
//                   onClick={() => handleEdit(q)}
//                   className="mt-2 text-blue-600 underline text-sm"
//                 >
//                   Edit
//                 </button>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MomAskQuestion() {
  const [questionText, setQuestionText] = useState('');
  const [anon, setAnon] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');

  const token = localStorage.getItem("access_token");

  // ✅ Configs
  const getHeaders = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    withCredentials: true
  };

  const postPatchHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    withCredentials: true
  };

  useEffect(() => {
    fetchDoctors();
    fetchQuestions();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/healthpros', getHeaders);
      setDoctors(res.data.specialists || []);
    } catch {
      setMsg('Failed to load doctors');
    }
  };

  // const fetchQuestions = async () => {
  //   try {
  //     const res = await axios.get('http://localhost:5000/mums/questions', getHeaders);
  //     setQuestions(res.data);
  //   } catch {
  //     setMsg('Failed to load questions');
  //   }
  // };
  const fetchQuestions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/mums/questions', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      setQuestions(res.data);
    } catch (err) {
      console.error('❌ Failed to load questions:', err);
      setMsg('Failed to load questions');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.patch('http://localhost:5000/mums/questions', {
          id: editingId,
          question_text: questionText,
        }, postPatchHeaders);
        setMsg('Question updated!');
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/mums/questions', {
          question_text: questionText,
          is_anonymous: anon,
          doctor_id: selectedDoctor
        }, postPatchHeaders);
        setMsg('Question posted!');
      }

      setQuestionText('');
      setAnon(false);
      setSelectedDoctor('');
      fetchQuestions();
    } catch {
      setMsg('Error posting or updating question');
    }
  };

  const handleEdit = (q) => {
    setQuestionText(q.question_text);
    setSelectedDoctor(q.doctor_id);
    setEditingId(q.id);
    setAnon(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 bg-cyan-200 p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-cyan-900">
          {editingId ? 'Edit Your Question' : 'Ask a Question'}
        </h2>

        <select
          className="w-full px-4 py-2 border rounded bg-gray-200 text-black"
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

        <textarea
          required
          placeholder="Your question..."
          className="w-full p-3 border rounded text-black bg-gray-200"
          value={questionText}
          onChange={e => setQuestionText(e.target.value)}
        />

        {!editingId && (
          <label className="flex items-center space-x-2 font-bold text-cyan-900">
            <input
              type="checkbox"
              checked={anon}
              onChange={e => setAnon(e.target.checked)}
            />
            <span>Post anonymously</span>
          </label>
        )}

        <button className="bg-cyan-900 text-white px-6 py-2 rounded font-bold">
          {editingId ? 'Update Question' : 'Submit Question'}
        </button>

        {msg && <p className="text-cyan-900 font-bold mt-2">{msg}</p>}
      </form>

      <div>
        <h3 className="text-xl mt-6 font-bold text-cyan-900">Your Previous Questions</h3>
        <ul className="mt-2 space-y-3 bg-gray-100 p-4 rounded-lg">
          {questions.map(q => (
            <li key={q.id} className="border p-3 rounded bg-cyan-500 text-black">
              <p><strong>To:</strong> {q.doctor_name}</p>
              <p><strong>Q:</strong> {q.question_text}</p>
              <p><strong>A:</strong> {q.answer_text || "Not answered yet."}</p>
              {!q.answer_text && (
                <button
                  onClick={() => handleEdit(q)}
                  className="mt-2 text-blue-600 underline text-sm"
                >
                  Edit
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
