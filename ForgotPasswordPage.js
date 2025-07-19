import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebaseConfig';
import './AuthForm.css';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent! Please check your inbox.');
        } catch (err) {
            console.error("Password reset error:", err);
            let friendlyError = "Failed to send reset email. Please try again.";
            if (err.code === 'auth/user-not-found') {
                friendlyError = "No account found with this email address.";
            } else if (err.code === 'auth/invalid-email') {
                friendlyError = "Please enter a valid email address.";
            }
            setError(friendlyError);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container card">
                <h1>Reset Your Password</h1>
                <p>Enter your email address and we'll send you a link to reset your password.</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <p className="error-message">{error}</p>}
                    {message && <p className="success-message">{message}</p>}
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
                    <button type="submit" className="btn-primary btn-block" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                <p className="switch-auth">
                    Remember your password? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default ForgotPasswordPage; 