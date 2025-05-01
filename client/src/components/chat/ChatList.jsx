// src/components/chat/ChatList.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { fetchChats, sendMessage } from '../../store/chatSlice';
import  api  from '../../lib/api';

const ChatList = () => {
  const { id } = useParams(); // Specialist ID
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user')); // Assuming user is stored in localStorage after login
  const userId = user?.id;

  // Redux state for chat messages
  const { messages, status, error } = useSelector((state) => state.chat);

  // State for new message input and WebSocket connection
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [usePolling, setUsePolling] = useState(false); // Fallback to polling if WebSocket fails

  // Fetch specialists using React Query
  const { data: specialists, isLoading: specialistsLoading } = useQuery({
    queryKey: ['specialists'],
    queryFn: api.getHealthPros,
  });

  // Fetch initial chat messages
  useEffect(() => {
    if (userId && id) {
      dispatch(fetchChats({ userId, receiverId: id }));
    }
  }, [userId, id, dispatch]);

  // Set up WebSocket connection
  useEffect(() => {
    if (!userId) return;

    const newSocket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      newSocket.emit('join', { user_id: userId });
      setUsePolling(false); // WebSocket connected, disable polling
    });

    newSocket.on('connect_error', () => {
      console.log('WebSocket connection failed, falling back to polling');
      setUsePolling(true); // Fallback to polling
    });

    newSocket.on('new_message', (message) => {
      if (message.sender_id === parseInt(id) && message.receiver_id === userId) {
        // Add the new message to Redux state
        dispatch(fetchChats({ userId, receiverId: id }));
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId, id, dispatch]);

  // Polling fallback if WebSocket fails
  useEffect(() => {
    if (!usePolling || !userId || !id) return;

    const interval = setInterval(() => {
      dispatch(fetchChats({ userId, receiverId: id }));
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [usePolling, userId, id, dispatch]);

  // Find the selected specialist
  const selectedSpecialist = specialists?.specialists?.find(
    (specialist) => specialist.id === parseInt(id)
  );

  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      dispatch(sendMessage({ receiverId: id, message: newMessage }));
      setNewMessage('');
    }
  };

  if (!userId) {
    return (
      <div className="p-4">
        <p>Please log in to chat with specialists.</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Log In
        </button>
      </div>
    );
  }

  if (specialistsLoading) {
    return <div className="p-4">Loading specialists...</div>;
  }

  if (!selectedSpecialist) {
    return (
      <div className="p-4">
        <p>Specialist not found.</p>
        <button
          onClick={() => navigate('/specialists')}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Back to Specialists
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Chat with {selectedSpecialist.full_name}
      </h1>

      {/* Chat messages */}
      <div className="border rounded-lg p-4 mb-4 h-96 overflow-y-auto">
        {status === 'loading' && <p>Loading messages...</p>}
        {status === 'failed' && <p>Error: {error}</p>}
        {status === 'succeeded' && messages.length === 0 && (
          <p>No messages yet. Start the conversation!</p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 p-2 rounded-lg ${
              msg.sender_id === userId
                ? 'bg-blue-100 ml-auto'
                : 'bg-gray-100 mr-auto'
            } max-w-xs`}
          >
            <p>{msg.message}</p>
            <p className="text-xs text-gray-500">
              {new Date(msg.created_at).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Send
        </button>
      </form>

      <button
        onClick={() => navigate('/specialists')}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
      >
        Back to Specialists
      </button>
    </div>
  );
};

export default ChatList;

