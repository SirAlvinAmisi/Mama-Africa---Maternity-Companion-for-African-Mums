// src/components/posts/QuestionCard.jsx
export default function QuestionCard({ question }) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 border-cyan-500">
        <div className="flex items-start mb-3">
          <div className="bg-cyan-100 text-cyan-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
            Q
          </div>
          <div>
            <h3 className="font-semibold">
              {question.is_anonymous ? "Anonymous" : question.asker.profile.full_name}
            </h3>
            <p className="text-gray-500 text-sm">
              Asked on {new Date(question.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
  
        <div className="mb-4">
          <p className="text-gray-800">{question.question_text}</p>
        </div>
  
        {question.answer_text && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center mb-2">
              <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                A
              </div>
              <span className="font-medium">Dr. {question.responder.profile.full_name}</span>
            </div>
            <p className="text-gray-700">{question.answer_text}</p>
          </div>
        )}
      </div>
    );
  }