import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { fetchChats, sendMessage } from '../../store/chatSlice';
import axios from 'axios';

const ChatList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState(null); // ✅ useState instead of immediate JSON.parse
  const [userId, setUserId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [usePolling, setUsePolling] = useState(false);

  // ✅ Get user from localStorage after component mounts
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setUserId(parsed.id);
      } else {
        console.warn("No user found in localStorage");
      }
    } catch (err) {
      console.error("Failed to parse user:", err);
    }
  }, []);

  const { messages = [], status, error } = useSelector((state) => state.chat);

  const { data: specialists, isLoading: specialistsLoading } = useQuery({
    queryKey: ['specialists'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:5000/healthpros');
      return res.data;
    },
  });

  useEffect(() => {
    if (userId && id) {
      dispatch(fetchChats({ userId, receiverId: id }));
    }
  }, [userId, id, dispatch]);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected');
      newSocket.emit('join', { user_id: userId });
      setUsePolling(false);
    });

    newSocket.on('connect_error', () => {
      console.warn('⚠️ WebSocket failed, using polling');
      setUsePolling(true);
    });

    newSocket.on('new_message', (message) => {
      if (message.sender_id === parseInt(id) && message.receiver_id === userId) {
        dispatch(fetchChats({ userId, receiverId: id }));
      }
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [userId, id, dispatch]);

  useEffect(() => {
    if (!usePolling || !userId || !id) return;
    const interval = setInterval(() => {
      dispatch(fetchChats({ userId, receiverId: id }));
    }, 10000);
    return () => clearInterval(interval);
  }, [usePolling, userId, id, dispatch]);

  const selectedSpecialist = specialists?.specialists?.find(
    (specialist) => specialist.id === parseInt(id)
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      dispatch(sendMessage({ receiverId: id, message: newMessage }));
      setNewMessage('');
    }
  };

  if (!userId) {
    return (
      <div className="p-4 text-red-600">
        Please log in to chat.
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
