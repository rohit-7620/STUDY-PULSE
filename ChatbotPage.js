import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // To make API calls to backend
import { useAuthStatus } from '../contexts/AuthContext'; // Import the custom hook
import './ChatbotPage.css'; // Specific styles

// Placeholder Icon (replace with actual icons)
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3.4 20.4l17.45-7.48c.81-.35.81-1.49 0-1.84L3.4 3.6c-.66-.29-1.39.2-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z"/></svg>
);
const MicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>
);

function ChatbotPage() {
    // Use the custom hook to get user status
    const { user, loading: authLoading } = useAuthStatus(); // Get user object and loading state

    const [history, setHistory] = useState([
        { role: 'model', parts: [{ text: "Hi! I'm StudyPulse AI. How can I help you learn today?" }] }
    ]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const chatEndRef = useRef(null); // Ref for scrolling

    // Scroll to bottom whenever history changes
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleSendMessage = async (e) => {
        e.preventDefault(); // Prevent form submission page reload
        if (!message.trim() || isLoading || !user) return; // Prevent sending if no message, loading, or not logged in

        const userMessage = { role: 'user', parts: [{ text: message }] };
        const currentHistory = [...history, userMessage];

        setHistory(currentHistory); // Optimistically add user message to history
        const messageToSend = message; // Store message before clearing
        setMessage(''); // Clear input field
        setIsLoading(true);
        setError(null);

        try {
            // Get the token *inside* the async function, right before the call
            const token = await user.getIdToken();
            if (!token) {
                throw new Error("Authentication token not available.");
            }

            // Prepare history for the API (only roles and parts)
            const apiHistory = history.map(({ role, parts }) => ({ role, parts }));

            const response = await axios.post('/api/chatbot/message/', {
                message: messageToSend, // Use the stored message
                history: apiHistory // Send the history *before* the user's current message
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Use the fetched token
                }
            });

            if (response.data && response.data.reply) {
                const botMessage = { role: 'model', parts: [{ text: response.data.reply }] };
                setHistory(prevHistory => [...prevHistory, botMessage]); // Add bot reply to history
            } else {
                throw new Error('Invalid response format from API');
            }

        } catch (err) {
            console.error("Error sending message:", err);
            let errorMessage = 'Failed to get response from AI.';
            if (err.message === "Authentication token not available.") {
                 errorMessage = "Could not authenticate. Please try logging in again.";
            } else if (err.response) {
                console.error("API Error Response:", err.response.data);
                errorMessage = `Error ${err.response.status}: ${err.response.data.error || 'Server error'}`;
            } else if (err.request) {
                errorMessage = 'No response received from server.';
            }
            setError(errorMessage);
            setHistory(prevHistory => [...prevHistory, { role: 'model', parts: [{ text: `Sorry, I encountered an error: ${errorMessage}` }] }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle voice input (requires browser permissions and Web Speech API)
    const handleVoiceInput = () => {
        // **TODO: Implement Voice Input using Web Speech API**
        alert('Voice input functionality not yet implemented.');
        // 1. Check for browser support (window.SpeechRecognition || window.webkitSpeechRecognition)
        // 2. Create recognition instance
        // 3. Set language, continuous, interimResults etc.
        // 4. Start recognition
        // 5. Handle results (onresult event) -> update inputText or send message
        // 6. Handle errors (onerror event)
        // 7. Potentially provide visual feedback while listening
    };

    // Display loading message if auth is still loading
    if (authLoading) {
        return <div className="chatbot-page-container"><div className="loading-indicator">Loading Chat...</div></div>;
    }

    // Display message if user is not logged in
    if (!user) {
         return (
            <div className="chatbot-page-container">
                <div className="chatbot-header"><h2>StudyPulse AI Chat</h2></div>
                <div className="chat-history-area" style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <p>Please log in to use the chatbot.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chatbot-page-container">
            <div className="chatbot-header">
                <h2>StudyPulse AI Chat</h2>
            </div>
            <div className="chat-history-area">
                {history.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.role}`}>
                        <p><strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.parts[0].text}</p>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            {isLoading && <div className="loading-indicator">AI is thinking...</div>}
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSendMessage} className="chat-input-form">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !message.trim() || !user}>
                    {isLoading ? <span className="sending-dots"></span> : <SendIcon />}
                </button>
                <button type="button" onClick={handleVoiceInput} className="mic-button" disabled={isLoading}>
                    <MicIcon />
                </button>
            </form>
        </div>
    );
}

export default ChatbotPage; 