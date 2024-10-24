import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoughRectangle from './RoughRectangle.jsx';
import App from './App.jsx'; // You can still import App for the "/" route
import './index.css';

// Create a simple component for the "/abcd" route if needed
function AbcdPage() {
  return <h1>Welcome to the /abcd route!</h1>;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Route for "/" - you can use RoughRectangle here or any other component */}
        <Route path="/" element={<RoughRectangle />} />
        {/* Route for "/abcd" - you can use another component here */}
        <Route path="/abcd" element={<RoughRectangle />} />
      </Routes>
    </Router>
  </StrictMode>,
);
