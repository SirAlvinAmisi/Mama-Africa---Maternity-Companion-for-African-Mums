import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HealthProfessional } from './pages/HealthProfessional';
import { HealthProfessionalMom } from './pages/HealthProfessionalMom';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/health-professional" element={<HealthProfessional />} />
        <Route path="/health-professional-mom" element={<HealthProfessionalMom />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </Router>
  );
}

export default App;
