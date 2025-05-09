import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function QAModeration({ questions, setQuestions }) {
  const [activeTab, setActiveTab] = useState('unanswered');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/questions')
      .then(response => {
        setQuestions(response.data.questions);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch questions", error);
        setLoading(false);
      });
  }, []);

  const handleAnswer = (id, answer) => {
    axios.patch(`http://localhost:5000/api/questions/${id}/answer`, { answer })
      .then(() => {
        setQuestions(prev =>
          prev.map(q => q.id === id ? { ...q, answered: true, answer } : q)
        );
      })
      .catch(error => console.error("Error submitting answer", error));
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
            <li key={q.id} className="p-6 bg-blue-50 rounded-xl shadow">
              <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                <span className="font-medium">{q.user}</span>
                <span>{q.date}</span>
              </div>
              <p className="text-lg text-gray-800 mb-4">{q.question}</p>

              {q.answered ? (
                <div className="bg-green-100 p-4 rounded-md border border-green-300">
                  <p className="font-medium text-green-700 mb-1">Your Answer:</p>
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
