import { useState, useEffect } from 'react';
import {
  fetchAllSpecialists,
  getMumQuestions,
  createMumQuestion,
  updateMumQuestion
} from '../lib/api'; 

export default function MomAskQuestion() {
  const [questionText, setQuestionText] = useState('');
  const [anon, setAnon] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchDoctors();
    fetchQuestions();
  }, []);

  // const fetchDoctors = async () => {
  //   try {
  //     const doctors = await fetchAllSpecialists();
  //     setDoctors(doctors || []);
  //   } catch {
  //     setMsg('Failed to load doctors');
  //   }
  // };
  const fetchDoctors = async () => {
  try {
    const res = await fetchAllSpecialists(); // this returns { specialists: [...] }
    setDoctors(res.specialists || []); // ✅ Extract the correct array
  } catch {
    setMsg('Failed to load doctors');
  }
};


  const fetchQuestions = async () => {
    try {
      const data = await getMumQuestions();
      setQuestions(data || []);
    } catch (err) {
      console.error('❌ Failed to load questions:', err);
      setMsg('Failed to load questions');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMumQuestion({
          id: editingId,
          question_text: questionText,
        });
        setMsg('Question updated!');
        setEditingId(null);
      } else {
        await createMumQuestion({
          question_text: questionText,
          is_anonymous: anon,
          doctor_id: selectedDoctor
        });
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
    <div className="space-y-8 bg-cyan-100 p-6 sm:p-8 md:p-10 rounded-lg shadow-md w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-5">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-600">
          {editingId ? 'Edit Your Question' : 'Ask a Question'}
        </h2>

        <select
          className="w-full px-4 py-2 border border-cyan-200 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-200"
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
          className="w-full p-3 border border-cyan-200 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-200"
          value={questionText}
          onChange={e => setQuestionText(e.target.value)}
        />

        {!editingId && (
          <label className="flex items-center space-x-2 text-gray-600 font-medium">
            <input
              type="checkbox"
              checked={anon}
              onChange={e => setAnon(e.target.checked)}
              className="accent-cyan-600"
            />
            <span>Post anonymously</span>
          </label>
        )}

        <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-md font-semibold transition">
          {editingId ? 'Update Question' : 'Submit Question'}
        </button>

        {msg && <p className="text-gray-600 font-medium">{msg}</p>}
      </form>

      <div>
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-600 mt-8">Your Previous Questions</h3>
        <ul className="mt-4 space-y-4">
          {questions.map(q => (
            <li key={q.id} className="bg-cyan-200 border border-cyan-200 p-4 rounded-md shadow-sm">
              <p className="text-gray-600"><strong>To:</strong> {q.doctor_name}</p>
              <p className="text-gray-600"><strong>Q:</strong> {q.question_text}</p>
              <p className="text-gray-600"><strong>A:</strong> {q.answer_text || "Not answered yet."}</p>
              {!q.answer_text && (
                <button
                  onClick={() => handleEdit(q)}
                  className="mt-2 text-cyan-600 underline text-sm hover:text-cyan-700"
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
