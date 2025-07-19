import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useAuthStatus } from '../contexts/AuthContext'; // Correct path assumed
import './AssignmentCheckerPage.css'; // We'll create this file next

function AssignmentCheckerPage() {
    const { user, loading: authLoading } = useAuthStatus();
    const [assignmentText, setAssignmentText] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!assignmentText.trim() || isLoading || !user) return;

        setIsLoading(true);
        setError(null);
        setFeedback('');

        try {
            const token = await user.getIdToken();
            if (!token) {
                throw new Error("Authentication token not available.");
            }

            const response = await axios.post('/api/assignment-checker/', {
                assignment_text: assignmentText
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data && response.data.feedback) {
                setFeedback(response.data.feedback);
            } else {
                throw new Error('Invalid response format from API');
            }

        } catch (err) {
            console.error("Error checking assignment:", err);
            let errorMessage = 'Failed to get feedback.';
            if (err.message === "Authentication token not available.") {
                 errorMessage = "Could not authenticate. Please try logging in again.";
            } else if (err.response) {
                console.error("API Error Response:", err.response.data);
                errorMessage = `Error ${err.response.status}: ${err.response.data.error || 'Server error'}`;
            } else if (err.request) {
                errorMessage = 'No response received from server.';
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading) {
        return <div className="checker-container"><div className="loading-indicator">Loading...</div></div>;
    }

    if (!user) {
         return (
            <div className="checker-container">
                <h2>AI Assignment Checker</h2>
                <p>Please log in to use the assignment checker.</p>
            </div>
        );
    }

    return (
        <div className="checker-container">
            <h2>AI Assignment Checker</h2>
            <p>Paste your assignment text below to get feedback on correctness, clarity, and originality.</p>
            <form onSubmit={handleSubmit} className="checker-form">
                <textarea
                    value={assignmentText}
                    onChange={(e) => setAssignmentText(e.target.value)}
                    placeholder="Paste your assignment text here..."
                    rows="15"
                    disabled={isLoading}
                    required
                />
                <button type="submit" disabled={isLoading || !assignmentText.trim()}>
                    {isLoading ? 'Checking...' : 'Get Feedback'}
                </button>
            </form>

            {error && <div className="error-message">Error: {error}</div>}

            {feedback && (
                <div className="feedback-area">
                    <h3>Feedback:</h3>
                    <ReactMarkdown>{feedback}</ReactMarkdown>
                </div>
            )}
        </div>
    );
}

export default AssignmentCheckerPage; 