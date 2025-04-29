import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/SignUp';
import Communities from './pages/Communities';
import CommunityDetail from './pages/CommunityDetail';
import Specialists from './pages/Specialists';
import { HealthProfessional } from './pages/HealthProfessional';
import { HealthProfessionalMom } from './pages/HealthProfessionalMom';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import CommunityGuidelines from './pages/CommunityGuidelines';
import HelpCenter from './pages/HelpCenter';
import { ArticleDetail } from './components/articles/ArticleDetail';
import MomLayout      from './components/Momlayout';
import MomRegister    from './pages/MomRegister';
import MomProfile     from './pages/MomProfile';
import MomPregnancy   from './pages/MomPregnancy';
import MomDevelopment from './pages/MomDevelopment';
import MomReminders   from './pages/MomReminders';
import MomUploadScan  from './pages/MomUploadScan';
import MomAskQuestion from './pages/MomAskQuestion';
import MomContent     from './pages/MomContent';
import ParentingDevelopmentPage from './components/ParentingDevelopmentPage';
import BabyCornerPage from './components/BabyCornerPage';

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
            {/* Existing public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/specialists" element={<Specialists />} />
            <Route path="/specialist/:id" element={<HealthProfessional />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/parenting-development" element={<ParentingDevelopmentPage />} />
            <Route path="/baby-corner" element={<BabyCornerPage />} />
            {/* <Route path="/health-professional" element={<HealthProfessional />} /> */}
            <Route path="/communities" element={<Communities />} />
            <Route path="/communities/:id" element={<CommunityDetail />} />
            <Route path="/health-professional-mom" element={<HealthProfessionalMom />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/community-guidelines" element={<CommunityGuidelines />} />
            <Route path="/help-center" element={<HelpCenter />} />

            {/* 👶 Mum section */}
            <Route path="/moms" element={<MomLayout />}>
              <Route index element={<MomRegister />} />
              <Route path="register"     element={<MomRegister />} />
              <Route path="profile"      element={<MomProfile />} />
              <Route path="pregnancy"    element={<MomPregnancy />} />
              <Route path="development"  element={<MomDevelopment />} />
              <Route path="reminders"    element={<MomReminders />} />
              <Route path="upload-scan"  element={<MomUploadScan />} />
              <Route path="ask-question" element={<MomAskQuestion />} />
              <Route path="content"      element={<MomContent />} />
            </Route>

            {/* Fallback 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
