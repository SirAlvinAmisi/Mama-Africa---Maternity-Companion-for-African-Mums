import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layout & Common UI
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './components/Login';
import Signup from './components/SignUp';
import ViewPage from './pages/ViewPage';
import Notification from './components/Notification';

// Authentication & User Profile
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

// Admin Pages
import Admin from './pages/Admin';

// Health Professionals
import Specialists from './pages/Specialists';
import { HealthProfessional } from './pages/HealthProfessional';
import { HealthProfessionalMom } from './pages/HealthProfessionalMom';
import HealthProDashboard from './pages/HealthProDashboard';

// Articles & Content
import { ArticleDetail } from './components/articles/ArticleDetail';
import ParentingDevelopmentPage from './components/ParentingDevelopmentPage';
import BabyCornerPage from './components/BabyCornerPage';

// Communities
import Communities from './pages/Communities';
import CommunityDetail from './pages/CommunityDetail';
import Nutrition from './components/Nutrition';

// Mum Layout & Pages
import MomLandingPage from './pages/MomLandingPage';
import MomLayout from './components/Momlayout';
import MomRegister from './pages/MomRegister';
import MomProfile from './pages/MomProfile';
import MomPregnancy from './pages/MomPregnancy';
import MomDevelopment from './pages/MomDevelopment';
import MomReminders from './pages/MomReminders';
import MomUploadScan from './pages/MomUploadScan';
import MomAskQuestion from './pages/MomAskQuestion';
import MomContent from './pages/MomContent';

// Legal & Support
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import CommunityGuidelines from './pages/CommunityGuidelines';
import HelpCenter from './pages/HelpCenter';
import Questions from './pages/Questions';
import ChatList from './components/chat/ChatList';

// Topics
import Topics from './pages/Topics';

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-5xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-gray-600 dark:text-gray-300">Page Not Found</p>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
          <Navbar />
          {/* <Notification /> */}
          <main className="flex-grow">
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Health Professionals */}
              <Route path="/specialists" element={<Specialists />} />
              <Route path="/specialist/:id" element={<HealthProfessional />} />
              <Route path="/healthpro/dashboard" element={<HealthProDashboard />} />
              <Route path="/health-professional-mom" element={<HealthProfessionalMom />} />

              {/* Articles */}
              <Route path="/article/:id" element={<ArticleDetail />} />
              <Route path="/parenting-development" element={<ParentingDevelopmentPage />} />
              <Route path="/baby-corner" element={<BabyCornerPage />} />
              {/* <Route path="/view" element={<ViewPage />} /> */}

              {/* Communities */}
              <Route path="/communities" element={<Communities />} />
              <Route path="/communities/:id" element={<CommunityDetail />} />

              {/* Topics */}
              <Route path="/topics" element={<Topics />} />
              <Route path="/nutrition" element={<Nutrition />} />

              {/* Admin & Profile */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />

              {/* Mum Section */}
              <Route path="/mom" element={<MomLandingPage />} />
              <Route path="/moms" element={<MomLayout />}>
                <Route index element={<MomRegister />} />
                <Route path="register" element={<MomRegister />} />
                <Route path="profile" element={<MomProfile />} />
                <Route path="pregnancy" element={<MomPregnancy />} />
                <Route path="development" element={<MomDevelopment />} />
                <Route path="reminders" element={<MomReminders />} />
                <Route path="upload-scan" element={<MomUploadScan />} />
                <Route path="ask-question" element={<MomAskQuestion />} />
                <Route path="content" element={<MomContent />} />
              </Route>

              {/* Legal & Support */}
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/community-guidelines" element={<CommunityGuidelines />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/questions" element={<Questions />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/chat" element={<ChatList />} />
              <Route path="/topics" element={<Topics />} />
              {/* <Route path="/chat/:specialistId" element={<ChatList />} /> */}
              <Route path="/chat/:id" element={<ChatList />} />
              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
