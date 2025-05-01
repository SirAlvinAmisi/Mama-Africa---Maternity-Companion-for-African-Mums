// src/store/Store.js
import { configureStore } from '@reduxjs/toolkit';
//import chatReducer from './chatSlice';
import threadReducer from './ThreadSlice';

export const store = configureStore({
  reducer: {
    //chat: chatReducer,
    thread: threadReducer,
  },
});
