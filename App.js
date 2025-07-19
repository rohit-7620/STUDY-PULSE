import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebaseConfig';
import './App.css'; // App-specific styles

// Import Layout Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Import Page Components (Create these later)
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import PersonalizedLearning from './pages/PersonalizedLearning';
import ProgressTracker from './pages/ProgressTracker';
import ToolsPage from './pages/ToolsPage'; // Placeholder for combined tools or specific tool pages
import ChatbotPage from './pages/ChatbotPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFoundPage from './pages/NotFoundPage'; // For 404 routes
import CourseDetailPage from './pages/CourseDetailPage'; // Import the new page
import VideoSummarizer from './pages/VideoSummarizer'; // Import the new component
import CaseStudyGenerator from './pages/CaseStudyGenerator'; // Import the new component
import QuizPage from './pages/QuizPage'; // Import the new component
import AssignmentCheckerPage from './pages/AssignmentCheckerPage'; // Import AssignmentCheckerPage
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import { AuthProvider, useAuthStatus } from './contexts/AuthContext';

// Placeholder components for features - You'll build these out
// import AICareerGuidance from './components/Features/AICareerGuidance';
// import Leaderboard from './components/Features/Leaderboard';
// import SmartTable from './components/Features/SmartTable';
// import VoiceVideoTools from './components/Features/VoiceVideoTools';
// import CaseStudyAR from './components/Features/CaseStudyAR';
// import GamifiedQuizzes from './components/Features/GamifiedQuizzes';
// import AssignmentChecker from './components/Features/AssignmentChecker';

// Helper component for protected routes
function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStatus();
  const location = useLocation();

  if (loading) {
    // Optional: Show a loading spinner while checking auth state
    return <div>Loading...</div>; 
  }

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  // Pass user state down to Navbar (optional, could also use context)
  // We modify Navbar later to accept this prop
  // Since we removed the hook call above, we can't pass user/loading directly here
  // Navbar will need to use the context itself if it needs the user state.
  
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          {/* Navbar now needs to get user from context if needed */}
          <Navbar /> 
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              {/* Redirect logic might need adjustment if based on the removed user variable */}
              {/* A better approach for redirects is often inside the LoginPage/SignupPage components */}
              <Route path="/login" element={<LoginPage />} /> 
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Protected Routes - Use the ProtectedRoute component */}
              <Route 
                path="/dashboard" 
                element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
              />
              <Route 
                path="/learn" 
                element={<ProtectedRoute><PersonalizedLearning /></ProtectedRoute>}
              />
              <Route 
                path="/courses/:courseId" 
                element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>}
              />
              <Route 
                path="/track-progress" 
                element={<ProtectedRoute><ProgressTracker /></ProtectedRoute>}
              />
               <Route 
                path="/tools/*" // Allow nested routes for tools if needed later
                element={<ProtectedRoute><ToolsPage /></ProtectedRoute>}
              />
               <Route 
                path="/chatbot" 
                element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>}
              />
              <Route 
                path="/profile" 
                element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
              />
              <Route 
                path="/tools/summarizer" 
                element={<ProtectedRoute><VideoSummarizer /></ProtectedRoute>}
              />
              <Route 
                path="/tools/case-study-ar" 
                element={<ProtectedRoute><CaseStudyGenerator /></ProtectedRoute>}
              />
              <Route 
                path="/quizzes/:quizId" 
                element={<ProtectedRoute><QuizPage /></ProtectedRoute>}
              />
              <Route 
                path="/assignment-checker" 
                element={<ProtectedRoute><AssignmentCheckerPage /></ProtectedRoute>}
              />

              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 