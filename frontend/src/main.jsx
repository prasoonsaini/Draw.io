import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoughRectangle from './RoughRectangle.jsx';
import App from './App.jsx'; // You can still import App for the "/" route
import './index.css';

// Create a simple component for the "/abcd" route if needed

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
