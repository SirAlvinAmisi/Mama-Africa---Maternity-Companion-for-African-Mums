import React, { useState, useEffect } from 'react';
import { FaFileMedical } from 'react-icons/fa';
import {
  getHealthProQuestions,
  getCurrentUser,
  submitHealthProAnswer
} from '../../lib/api'; 

export default function QAModeration({ questions, setQuestions }) {
  const [activeTab, setActiveTab] = useState('unanswered');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHealthProQuestions();
        setQuestions(res.questions);
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setQuestions]);

  const handleAnswer = async (id, answer) => {
    try {
      await submitHealthProAnswer(id, answer);
      const res = await getHealthProQuestions();
      setQuestions(res.questions);
    } catch (error) {
      console.error("Error submitting answer", error);
      alert("Failed to submit answer.");
    }
  };

  const filteredQuestions = questions.filter(q =>
    activeTab === 'unanswered' ? !q.answered : q.answered
  );

  if (loading) return <p className="p-6 text-gray-500 animate-pulse">Loading questions...</p>;

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl mt-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Q&A Moderation</h2>

      <div className="flex justify-center gap-6 mb-6 border-b pb-2">
        {['unanswered', 'answered'].map(tab => (
          <button
            key={tab}
            className={`pb-2 text-lg font-semibold transition-all duration-300 ${
              activeTab === tab
                ? 'border-b-4 border-blue-600 text-blue-700'
                : 'text-gray-500 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} (
            {questions.filter(q => tab === 'unanswered' ? !q.answered : q.answered).length})
          </button>
        ))}
      </div>

      {filteredQuestions.length > 0 ? (
        <ul className="space-y-6">
          {filteredQuestions.map(q => (
            <li key={q.id} className="p-6 bg-cyan-200 rounded-xl shadow">
              <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                <span className="font-medium">
                  <span className="text-blue-700">Question by:</span> {q.user}
                </span>
                <span>{q.date}</span>
              </div>

              <p className="text-lg text-gray-800 mb-4 flex flex-col gap-1">
                {q.question.startsWith("[Scan Upload]") && (
                  <span className="inline-flex items-center gap-1 text-sm text-cyan-800 font-medium px-2 py-1 bg-cyan-100 border border-cyan-300 rounded w-max">
                    <FaFileMedical /> Scan Upload
                  </span>
                )}
                <span>{q.question.replace("[Scan Upload]", "").trim()}</span>

                {q.scan_file_url && (
                  <a
                    href={q.scan_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm underline mt-1"
                  >
                    🔗 View Uploaded Scan
                  </a>
                )}
              </p>

              {q.answered ? (
                <div className="bg-gray-300 p-4 rounded-md border border-green-300">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-black">Answer:</p>
                    <span className="text-sm text-gray-600">
                      <span className="font-medium text-green-700">Answered by:</span> {q.answeredBy || 'Health Professional'}
                    </span>
                  </div>
                  <p className="text-gray-800">{q.answer}</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAnswer(q.id, e.target.answer.value);
                    e.target.reset();
                  }}
                  className="mt-2"
                >
                  <textarea
                    name="answer"
                    rows="3"
                    className="w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    placeholder="Type your professional answer..."
                    required
                  />
                  <button
                    type="submit"
                    className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow"
                  >
                    Submit Answer
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-6">
          {activeTab === 'unanswered'
            ? 'No unanswered questions at the moment.'
            : 'No answered questions yet.'}
        </p>
      )}
    </div>
  );
}
