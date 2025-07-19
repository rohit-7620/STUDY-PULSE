import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth"; // Import Firebase sign out
import { auth } from '../../firebaseConfig'; // Adjust path as needed
import { useAuthStatus } from '../../contexts/AuthContext'; // Import the hook
import './Navbar.css'; // Styles for the Navbar

function Navbar() { // Remove user prop
  const navigate = useNavigate();
  const { user, loading } = useAuthStatus(); // Use the hook to get user state

  // Determine auth status based on the context user
  const isAuthenticated = !!user;
  const userName = user?.displayName || user?.email || "User";

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      navigate('/'); // Redirect to homepage after logout
    } catch (error) {
      console.error("Error signing out: ", error);
      // Handle logout errors if necessary
    }
  };

  // Optional: Render nothing or a minimal navbar while loading auth state
  if (loading) {
      // Return null or a loading indicator placeholder if desired
      return (
          <nav className="navbar">
            <div className="navbar-container container">
                 <Link to="/" className="navbar-logo">StudyPulse ✨</Link>
                 {/* Optional: Add a loading indicator here */}
            </div>
        </nav>
      );
  }

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo">
          StudyPulse ✨
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => "nav-links" + (isActive ? " activated" : "")} end>
              Home
            </NavLink>
          </li>
          {isAuthenticated && (
            <>
              <li className="nav-item">
                <NavLink to="/dashboard" className={({ isActive }) => "nav-links" + (isActive ? " activated" : "")}>
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/learn" className={({ isActive }) => "nav-links" + (isActive ? " activated" : "")}>
                  Learn
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/track-progress" className={({ isActive }) => "nav-links" + (isActive ? " activated" : "")}>
                  Track Progress
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/tools" className={({ isActive }) => "nav-links" + (isActive ? " activated" : "")}>
                  Tools
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/chatbot" className={({ isActive }) => "nav-links" + (isActive ? " activated" : "")}>
                  Chatbot
                </NavLink>
              </li>
            </>
          )}
        </ul>

        <ul className="nav-menu-right">
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <NavLink to="/profile" className="nav-links profile-link" title="View Profile">
                   👤 {userName}
                </NavLink>
              </li>
              <li className="nav-item">
                 <button onClick={handleLogout} className="btn-outline logout-btn">
                   Logout
                 </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-btn">
                <Link to="/login" className="btn-outline">
                  Login
                </Link>
              </li>
              <li className="nav-btn">
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
        {/* Add Mobile Menu Toggle Icon here */}
      </div>
    </nav>
  );
}

export default Navbar; 