import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Styles for the Footer

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container container">
        <div className="footer-section about">
          <h4>StudyPulse ✨</h4>
          <p>Your AI Powered Smart Learning Partner. Study smarter, not harder.</p>
          {/* Add Social Media Icons here */}
        </div>
        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/learn">Learn</Link></li>
            <li><Link to="/track-progress">Track Progress</Link></li>
            <li><Link to="/tools">Tools</Link></li>
          </ul>
        </div>
        <div className="footer-section legal">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/terms">Terms of Use</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
        <div className="footer-section subscribe">
          <h4>Stay Updated</h4>
          <p>Get the latest updates and features.</p>
          <form className="subscribe-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit" className="btn-primary">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} StudyPulse. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer; 