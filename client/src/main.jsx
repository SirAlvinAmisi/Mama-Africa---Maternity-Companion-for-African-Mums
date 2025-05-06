// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/Store';
import { AuthProvider } from "./context/AuthContext";
import App from './App';
import './App.css'; // ✅ keep your styles

// ✅ Use 'app' since your index.html has <div id="app"></div>
createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);
