import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getChats, sendMessage, reportMessage } from '../lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import socket from '../lib/socket'; // ✅ shared socket instance

const Chat = () => {
  const { receiverId } = useParams();
  const userId = localStorage.getItem('userId');
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [page, setPage] = useState(1);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  // Connect to Socket.IO
  useEffect(() => {
    if (!userId) return;

    socket.connect();
    const token = localStorage.getItem("access_token");
    if (token) socket.emit('join_room', { token });

    // Prevent duplicates
    socket.off('new_message');
    socket.on('new_message', (newMessage) => {
      queryClient.setQueryData(['chats', userId, receiverId, page], (old) => ({
        ...old,
        chats: [newMessage, ...(old?.chats || [])],
      }));
    });

    socket.off('user_typing');
    socket.on('user_typing', ({ sender_id }) => {
      if (sender_id === receiverId) {
        setTypingUser(sender_id);
        setTimeout(() => setTypingUser(null), 3000);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, receiverId, queryClient, page]);

  // Emit typing indicator
  useEffect(() => {
    if (!userId || !receiverId) return;

    const payload = {
      sender_id: userId,
      receiver_id: receiverId,
      is_typing: !!message,
    };

    socket.emit('typing', payload);
  }, [message, userId, receiverId]);

  // Fetch chat history
  const { data, isLoading, error } = useQuery({
    queryKey: ['chats', userId, receiverId, page],
    queryFn: () => getChats(userId, receiverId, page),
    keepPreviousData: true,
  });

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      setMessage('');
      setIsTyping(false);
      socket.emit('typing', {
        sender_id: userId,
        receiver_id: receiverId,
        is_typing: false,
      });
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    },
  });

  // Report message
  const reportMessageMutation = useMutation({
    mutationFn: ({ messageId, reason }) => reportMessage(messageId, { reason }),
    onSuccess: () => alert('Message reported successfully.'),
    onError: (error) => {
      console.error('Error reporting message:', error);
      alert('Failed to report message. Please try again.');
    },
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessageMutation.mutate({
        receiver_id: receiverId,
        message: message.trim(),
      });
    }
  };

  const handleReportMessage = (messageId) => {
    const reason = prompt('Enter reason for reporting this message:');
    if (reason) {
      reportMessageMutation.mutate({ messageId, reason });
    }
  };

  const handleLoadMore = () => {
    if (data?.pages > page) setPage((prev) => prev + 1);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data?.chats]);

  if (isLoading && page === 1) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error.message}</div>;

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-gray-100">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white text-center">
        <h1 className="text-xl font-semibold">Chat with User {receiverId}</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {data?.pages > page && (
          <button
            onClick={handleLoadMore}
            className="w-full py-2 mb-4 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Load More
          </button>
        )}
        {data?.chats?.length > 0 ? (
          data.chats.map((chat) => (
            <div
              key={chat.id}
              className={`mb-4 flex ${
                chat.sender_id === userId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  chat.sender_id === userId
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                <p>{chat.message}</p>
                <p className="text-xs mt-1 opacity-75">
                  {new Date(chat.created_at).toLocaleTimeString()}
                </p>
                {chat.sender_id !== userId && (
                  <button
                    onClick={() => handleReportMessage(chat.id)}
                    className="text-xs text-red-500 hover:underline mt-1"
                  >
                    Report
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet.</p>
        )}
        {typingUser && (
          <p className="text-sm text-gray-500 italic">User {typingUser} is typing...</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={sendMessageMutation.isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
