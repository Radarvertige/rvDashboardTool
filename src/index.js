import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Get the root DOM element where you want to mount your React app
const container = document.getElementById('root');

// Create a root using createRoot
const root = createRoot(container);

// Render your app using the root.render method
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Run reportWebVitals
reportWebVitals();
