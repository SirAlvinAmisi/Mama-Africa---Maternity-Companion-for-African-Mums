import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function QAModeration({questions, setQuestions}) {
  // const [questions, setQuestions] = useState([]);
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
      .then(response => {
        setQuestions(prev =>
          prev.map(q => q.id === id ? { ...q, answered: true, answer } : q)
        );
      })
      .catch(error => console.error("Error submitting answer", error));
  };

  const filteredQuestions = questions.filter(q => 
    activeTab === 'unanswered' ? !q.answered : q.answered
  );

  if (loading) return <p className="p-6 text-gray-500">Loading questions...</p>;

  return (
    <div className="p-6 bg-cyan-100 rounded-lg shadow mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Q&A Moderation</h2>

      <div className="flex border-b mb-4">
        {['unanswered', 'answered'].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({questions.filter(q => tab === 'unanswered' ? !q.answered : q.answered).length})
          </button>
        ))}
      </div>

      {filteredQuestions.length > 0 ? (
        <ul className="space-y-4">
          {filteredQuestions.map(q => (
            <li key={q.id} className="p-4 border rounded">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{q.user}</span>
                <span className="text-sm text-gray-500">{q.date}</span>
              </div>
              <p className="mb-3">{q.question}</p>

              {q.answered ? (
                <div className="bg-green-50 p-3 rounded">
                  <p className="font-medium text-green-800">Your Answer:</p>
                  <p>{q.answer}</p>
                </div>
              ) : (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleAnswer(q.id, e.target.answer.value);
                }} className="mt-2">
                  <textarea
                    name="answer"
                    rows="3"
                    className="w-full border rounded p-2 mb-2"
                    placeholder="Type your professional answer..."
                    required
                  />
                  <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">
                    Submit Answer
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">
          {activeTab === 'unanswered' ? 'No unanswered questions' : 'No answered questions yet'}
        </p>
      )}
    </div>
  );
}

// import React, { useState } from 'react';

// const mockQuestions = [
//   {
//     id: 1,
//     user: "Mary Karanja.",
//     question: "Is it normal to have back pain in the first trimester?",
//     date: "2023-10-12",
//     answered: false
//   },
//   {
//     id: 2,
//     user: "Fatuma Daudi.",
//     question: "What foods should I avoid during pregnancy?",
//     date: "2023-10-10",
//     answered: true,
//     answer: "Avoid raw fish, unpasteurized dairy, and limit caffeine to 200mg per day."
//   }
// ];

// export default function QAModeration() {
//   const [questions, setQuestions] = useState(mockQuestions);
//   const [activeTab, setActiveTab] = useState('unanswered');

//   const filteredQuestions = questions.filter(q => 
//     activeTab === 'unanswered' ? !q.answered : q.answered
//   );

//   const handleAnswer = (id, answer) => {
//     setQuestions(questions.map(q => 
//       q.id === id ? { ...q, answered: true, answer } : q
//     ));
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow mt-6">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">Q&A Moderation</h2>
      
//       <div className="flex border-b mb-4">
//         <button 
//           className={`px-4 py-2 ${activeTab === 'unanswered' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
//           onClick={() => setActiveTab('unanswered')}
//         >
//           Unanswered ({questions.filter(q => !q.answered).length})
//         </button>
//         <button 
//           className={`px-4 py-2 ${activeTab === 'answered' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
//           onClick={() => setActiveTab('answered')}
//         >
//           Answered ({questions.filter(q => q.answered).length})
//         </button>
//       </div>

//       {filteredQuestions.length > 0 ? (
//         <ul className="space-y-4">
//           {filteredQuestions.map(q => (
//             <li key={q.id} className="p-4 border rounded">
//               <div className="flex justify-between mb-2">
//                 <span className="font-medium">{q.user}</span>
//                 <span className="text-sm text-gray-500">{q.date}</span>
//               </div>
//               <p className="mb-3">{q.question}</p>
              
//               {q.answered ? (
//                 <div className="bg-green-50 p-3 rounded">
//                   <p className="font-medium text-green-800">Your Answer:</p>
//                   <p>{q.answer}</p>
//                 </div>
//               ) : (
//                 <form onSubmit={(e) => {
//                   e.preventDefault();
//                   handleAnswer(q.id, e.target.answer.value);
//                 }} className="mt-2">
//                   <textarea
//                     name="answer"
//                     rows="3"
//                     className="w-full border rounded p-2 mb-2"
//                     placeholder="Type your professional answer..."
//                     required
//                   />
//                   <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">
//                     Submit Answer
//                   </button>
//                 </form>
//               )}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-gray-500">
//           {activeTab === 'unanswered' ? 'No unanswered questions' : 'No answered questions yet'}
//         </p>
//       )}
//     </div>
//   );
// }