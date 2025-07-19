import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // Specific styles for Landing Page

// Placeholder Icons (replace with actual icons, e.g., from react-icons)
const PlaceholderIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
  </svg>
);

function LandingPage() {
  const [backendMessage, setBackendMessage] = useState('Connecting to backend...');

  useEffect(() => {
    const fetchBackendMessage = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/hello/');
        setBackendMessage(response.data.message);
      } catch (error) {
        console.error("Error fetching from backend:", error);
        setBackendMessage('Failed to connect to backend. Is it running?');
      }
    };

    fetchBackendMessage();
  }, []);

  return (
    <div className="landing-page">
      <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#eee', fontWeight: 'bold' }}>
        Backend Status: {backendMessage}
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content container">
          <div className="hero-text">
            <h1>Your AI Powered Smart Learning Partner</h1>
            <p className="tagline">Study Smarter with StudyPulse</p>
            <p>Revolutionizing traditional learning with personalized guidance, AI tools, and interactive experiences. Track your progress and achieve your goals efficiently.</p>
            <div className="hero-buttons">
              <Link to="/signup" className="btn-primary btn-large">Get Started</Link>
              <Link to="/login" className="btn-outline btn-large">Login</Link>
            </div>
          </div>
          <div className="hero-animation">
            {/* Placeholder for Animation/Illustration */}
            <div className="animation-placeholder">
              {/* Replace with an actual image, animation, or component */}
              <img src="/placeholder-hero-graphic.svg" alt="Futuristic Learning Animation" style={{ maxWidth: '100%', height: 'auto' }} />
              {/* You might use Lottie animations or a custom SVG animation here */}
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title text-center">Key Features</h2>
          <div className="features-grid">
            {/* Feature Card 1 */}
            <div className="feature-card card">
              <div className="feature-icon"><PlaceholderIcon size={40} /></div>
              <h3>Personalized Learning</h3>
              <p>AI-driven career roadmaps and tailored recommendations.</p>
            </div>
            {/* Feature Card 2 */}
            <div className="feature-card card">
              <div className="feature-icon"><PlaceholderIcon size={40} /></div>
              <h3>AI Chatbot</h3>
              <p>Instant doubt resolution and resource suggestions via Gemini API.</p>
            </div>
            {/* Feature Card 3 */}
            <div className="feature-card card">
              <div className="feature-icon"><PlaceholderIcon size={40} /></div>
              <h3>Progress Tracker</h3>
              <p>Monitor performance with smart tables, graphs, and leaderboards.</p>
            </div>
            {/* Feature Card 4 */}
            <div className="feature-card card">
              <div className="feature-icon"><PlaceholderIcon size={40} /></div>
              <h3>AR/3D Learning</h3>
              <p>Explore complex topics with interactive AR and 3D models.</p>
            </div>
            {/* Feature Card 5 */}
            <div className="feature-card card">
              <div className="feature-icon"><PlaceholderIcon size={40} /></div>
              <h3>Gamified Quizzes</h3>
              <p>Engaging quizzes with levels, XP, rewards, and leaderboards.</p>
            </div>
            {/* Feature Card 6 */}
            <div className="feature-card card">
              <div className="feature-icon"><PlaceholderIcon size={40} /></div>
              <h3>Voice & Video Tools</h3>
              <p>AI summaries, transcription, and voice assistant integration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Add other sections like Testimonials, How it Works, Call to Action etc. if needed */}

    </div>
  );
}

export default LandingPage; 