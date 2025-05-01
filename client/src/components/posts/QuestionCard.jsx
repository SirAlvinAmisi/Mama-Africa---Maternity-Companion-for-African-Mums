// src/components/posts/QuestionCard.jsx
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import  api  from '../../lib/api';

const QuestionCard = ({ question, onCommentSubmit }) => {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const [shareMsg, setShareMsg] = useState('');

  const shareMutation = useMutation({
    mutationFn: ({ contentType, contentId, recipientEmail }) =>
      recipientEmail
        ? api.shareViaEmail(contentType, contentId, recipientEmail)
        : api.shareContent(contentType, contentId),
    onSuccess: () => {
      setShareMsg('Content shared successfully!');
      setTimeout(() => setShareMsg(''), 3000);
    },
    onError: () => {
      setShareMsg('Error sharing content');
      setTimeout(() => setShareMsg(''), 3000);
    },
  });

  const handleShare = (recipientEmail = null) => {
    shareMutation.mutate({ contentType: 'question', contentId: question.id, recipientEmail });
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold">
        {question.is_anonymous ? 'Anonymous' : 'User'} asked:
      </h3>
      <p className="text-gray-600 mb-2">{question.question_text}</p>
      {question.answer_text && (
        <div className="bg-gray-100 p-3 rounded mb-2">
          <p className="font-semibold">Health Professional Answer:</p>
          <p>{question.answer_text}</p>
        </div>
      )}
      <div className="flex gap-4 mb-4">
        <button
          className="bg-cyan-600 text-white px-4 py-1 rounded hover:bg-cyan-700"
          onClick={() => handleShare()}
        >
          Share
        </button>
        <button
          className="bg-cyan-600 text-white px-4 py-1 rounded hover:bg-cyan-700"
          onClick={() => {
            const email = prompt('Enter recipient email:');
            if (email) handleShare(email);
          }}
        >
          Share via Email
        </button>
      </div>
      <textarea
        className="w-full p-3 border rounded mb-2"
        placeholder="Add a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <button
        className="bg-blue-button text-white px-4 py-2 rounded"
        onClick={() => {
          onCommentSubmit(question.id, commentText);
          setCommentText('');
        }}
      >
        Comment
      </button>
      {shareMsg && (
        <p className={`mt-2 ${shareMsg.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {shareMsg}
        </p>
      )}
    </div>
  );
};

export default QuestionCard;