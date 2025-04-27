import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login';
import Signup from './components/SignUp';
import Communities from './pages/Communities';
import Specialists from './pages/Specialists';
import { HealthProfessional } from './pages/HealthProfessional';
import { HealthProfessionalMom } from './pages/HealthProfessionalMom';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import CommunityGuidelines from './pages/CommunityGuidelines';
import HelpCenter from './pages/HelpCenter';

function NotFound() {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-white">
      <h1 className="text-5xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-gray-600">Page Not Found</p>
    </div>
  );
}
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/specialists" element={<Specialists />} />
              {/* <Route path="/health-professional" element={<HealthProfessional />} /> */}
              <Route path="/communities" element={<Communities />}/>
              <Route path="/health-professional-mom" element={<HealthProfessionalMom />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/community-guidelines" element={<CommunityGuidelines />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        <Footer />
      </div>
    </Router>
  );
}
export default App;

