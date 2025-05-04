// src/store/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import  api  from '../lib/api';

// export const fetchChats = createAsyncThunk(
//   'chat/fetchChats',
//   async (userId) => {
//     const response = await api.getChats(userId);
//     return response.data;
//   }
// );
export const fetchChats = createAsyncThunk(
  'chat/fetchChats',
  async ({ userId, receiverId }) => {
    const response = await api.getChats(userId, receiverId);
    return response.data;
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message) => {
    const response = await api.sendMessage(message);
    return response.data;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.unshift(action.payload);
      });
  },
});

export default chatSlice.reducer;

