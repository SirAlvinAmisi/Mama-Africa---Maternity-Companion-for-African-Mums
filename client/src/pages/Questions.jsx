// src/pages/Questions.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import  api  from '../lib/api';
import PostList from '../components/posts/PostList';
import QuestionCard from '../components/posts/QuestionCard';
import CommentThread from '../components/CommentThread';

export default function Questions() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all'); // all, my, unanswered

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions', filter],
    queryFn: () => {
      if (filter === 'my') return api.getQuestions(true).then(res => res.data);
      if (filter === 'unanswered') return api.getQuestions().then(res => res.data.filter(q => !q.answer_text));
      return api.getQuestions().then(res => res.data);
    },
  });

  const commentMutation = useMutation({
    mutationFn: ({ questionId, comment }) => api.commentOnQuestion(questionId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries(['questions']);
    },
  });

  const handleCommentSubmit = (questionId, commentText) => {
    if (!commentText.trim()) return;
    commentMutation.mutate({ questionId, comment: { content: commentText } });
  };

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Community Questions</h2>
      <div className="mb-4 flex gap-4">
        <button
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-cyan-700 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('all')}
        >
          All Questions
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'my' ? 'bg-cyan-700 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('my')}
        >
          My Questions
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'unanswered' ? 'bg-cyan-700 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('unanswered')}
        >
          Unanswered
        </button>
      </div>
      <div className="space-y-4">
        {questions?.map((question) => (
          <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
            <QuestionCard question={question} onCommentSubmit={handleCommentSubmit} />
            {question.comments?.length > 0 && (
              <CommentThread comments={question.comments} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}