import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase auth function
import { auth } from '../firebaseConfig'; // Import configured auth instance
import { useAuthStatus } from '../contexts/AuthContext'; // Import the hook
import './AuthForm.css'; // Shared styles for Login and Signup

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const navigate = useNavigate();
    const { user, loading } = useAuthStatus(); // Get auth status from context

    // Redirect if user is already logged in and auth state is loaded
    useEffect(() => {
        if (!loading && user) {
            console.log('User already logged in, redirecting from Login page...');
            navigate('/dashboard', { replace: true });
        }
    }, [user, loading, navigate]);

    const handleSubmit = async (e) => { // Make function async
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Use Firebase to sign in
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Firebase Login successful, navigating...');
            // Navigate after successful login
            navigate('/dashboard'); 
        } catch (err) {
            console.error("Firebase Login Error:", err);
            // Provide user-friendly error messages
            let friendlyError = "Failed to login. Please check your credentials.";
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                friendlyError = "Invalid email or password.";
            } else if (err.code === 'auth/invalid-email') {
                friendlyError = "Please enter a valid email address.";
            }
            // Handle other specific errors: auth/too-many-requests, etc.
            setError(friendlyError);
        } finally {
            setIsLoading(false);
        }
    };

    // Optional: Show loading state while checking auth
    if (loading) {
        return <div className="auth-page"><div>Loading...</div></div>; 
    }
    
    // If user is logged in after loading, this component shouldn't render (due to useEffect redirect)
    // But as a fallback, we could return null or redirect here too.
    // if (user) return null; // Or <Navigate to="/dashboard" replace />

    return (
        <div className="auth-page">
            <div className="auth-container card">
                <h1>Login to StudyPulse</h1>
                <p>Welcome back! Please enter your details.</p>
                <form onSubmit={handleSubmit} className="auth-form">
                     {error && <p className="error-message">{error}</p>}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            placeholder="you@example.com"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            placeholder="Enter your password"
                        />
                        <div className="forgot-password">
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </div>
                    </div>
                    <button type="submit" className="btn-primary btn-block" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'} 
                    </button>
                </form>
                <p className="switch-auth">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
                 {/* TODO: Add OAuth buttons (Google, GitHub, etc.) */}
            </div>
        </div>
    );
}

export default LoginPage; 