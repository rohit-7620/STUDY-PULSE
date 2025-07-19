import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; // Import Firebase auth functions
import { auth } from '../firebaseConfig'; // Import configured auth instance
import { useAuthStatus } from '../contexts/AuthContext'; // Import the hook
import './AuthForm.css'; // Shared styles

function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const navigate = useNavigate();
    const { user, loading } = useAuthStatus(); // Get auth status from context

    // Redirect if user is already logged in and auth state is loaded
    useEffect(() => {
        if (!loading && user) {
            console.log('User already logged in, redirecting from Signup page...');
            navigate('/dashboard', { replace: true });
        }
    }, [user, loading, navigate]);

    const handleSubmit = async (e) => { // Make function async
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) { // Firebase default minimum
            setError('Password should be at least 6 characters.');
            return;
        }

        setIsLoading(true);

        try {
            // Use Firebase to create user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Firebase Signup successful', userCredential.user);

            // Update the user's profile with the name
            // Note: This happens after creation, user might be logged in before name is set
            await updateProfile(userCredential.user, { displayName: name });
            console.log('Firebase Profile updated with name');

            // Navigate after successful signup and profile update
            console.log('Navigating to dashboard after signup...');
            navigate('/dashboard'); 

        } catch (err) {
            console.error("Firebase Signup Error:", err);
            // Provide user-friendly error messages
            let friendlyError = "Failed to sign up. Please try again.";
            if (err.code === 'auth/email-already-in-use') {
                friendlyError = "This email address is already registered.";
            } else if (err.code === 'auth/invalid-email') {
                friendlyError = "Please enter a valid email address.";
            } else if (err.code === 'auth/weak-password') {
                friendlyError = "Password is too weak. Please choose a stronger password.";
            }
            // Handle other specific errors
            setError(friendlyError);
        } finally {
            setIsLoading(false);
        }
    };

    // Optional: Show loading state while checking auth
    if (loading) {
        return <div className="auth-page"><div>Loading...</div></div>; 
    }

    return (
        <div className="auth-page">
            <div className="auth-container card">
                <h1>Create Your StudyPulse Account</h1>
                <p>Join us and start learning smarter today!</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            placeholder="Enter your full name"
                        />
                    </div>
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
                            minLength="8" // Example validation
                            placeholder="Create a password (min 8 chars)"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                            placeholder="Confirm your password"
                        />
                    </div>
                    <button type="submit" className="btn-primary btn-block" disabled={isLoading}>
                        {isLoading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
                <p className="switch-auth">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
                 {/* TODO: Add OAuth buttons */}
            </div>
        </div>
    );
}

export default SignupPage; 