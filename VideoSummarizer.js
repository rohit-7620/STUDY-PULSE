import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebaseConfig'; // For getting the token
import { useAuthStatus } from '../contexts/AuthContext'; // Import the hook from context
// Import a CSS file for styling if needed
// import './VideoSummarizer.css';

function VideoSummarizer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(''); // For progress like "Uploading...", "Processing..."
  const { user, loading: loadingAuth } = useAuthStatus();

  // Model selection (optional - start with default on backend)
  // const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  // const availableModels = ['gemini-1.5-flash', 'gemini-1.5-pro'];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      // Reset results when a new file is selected
      setTranscript('');
      setSummary('');
      setError(null);
      setStatusMessage('');
    } else {
      setSelectedFile(null);
      setFileName('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (!selectedFile) {
      setError('Please select a video or audio file first.');
      return;
    }
    if (!user) {
      setError('Please log in to use the summarizer.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTranscript('');
    setSummary('');
    setStatusMessage('Preparing upload...');

    try {
      // 1. Get Firebase Auth Token
      const token = await user.getIdToken();
      setStatusMessage('Uploading file...');

      // 2. Create FormData
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (customPrompt.trim()) {
        formData.append('prompt', customPrompt.trim());
      }
      // Optionally add model selection if UI is added
      // formData.append('model_name', selectedModel);

      // 3. Make API Call
      const response = await axios.post(
        'http://127.0.0.1:8000/api/tools/summarize/', // Your backend endpoint
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setStatusMessage(`Uploading: ${percentCompleted}%`);
          }
        }
      );

      // 4. Process Response
      setStatusMessage('Processing complete!');
      setTranscript(response.data.transcript || 'No transcript returned.');
      setSummary(response.data.summary || 'No summary returned.');
      
      // Clear status message after a delay
      setTimeout(() => setStatusMessage(''), 3000);

    } catch (err) {
      console.error("Summarization error:", err);
      let errorMsg = 'An unexpected error occurred.';
      if (err.response) {
        // Error from backend API
        errorMsg = err.response.data?.error || `Server error: ${err.response.status}`;
        if (err.response.status === 401 || err.response.status === 403) {
          errorMsg = "Authentication failed. Please log in again.";
        }
      } else if (err.request) {
        // Network error
        errorMsg = 'Could not connect to the server. Please check your network.';
      } else {
        // Other errors (e.g., getting token)
        errorMsg = err.message;
      }
      setError(errorMsg);
      setStatusMessage(''); // Clear status on error
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingAuth) {
    return <div className="container">Loading authentication status...</div>;
  }

  return (
    <div className="container video-summarizer" style={{ padding: '20px' }}>
      <h1>Video/Audio Summarizer</h1>
      <p>Upload a media file to get a transcript and summary.</p>

      {!user && (
        <p style={{ color: 'red' }}>Please log in to use this feature.</p>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        {/* File Input */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="file-upload" style={{ display: 'block', marginBottom: '5px' }}>
            Select File:
          </label>
          <input 
            id="file-upload"
            type="file" 
            accept="video/*,audio/*" // Accept common video/audio types
            onChange={handleFileChange} 
            disabled={isLoading || !user}
            style={{ display: 'block' }}
          />
          {fileName && <span style={{ marginLeft: '10px', fontStyle: 'italic' }}>Selected: {fileName}</span>}
        </div>

        {/* Custom Prompt Input (Optional) */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="custom-prompt" style={{ display: 'block', marginBottom: '5px' }}>
            Custom Prompt (Optional - leave blank for default summary): 
          </label>
          <textarea
            id="custom-prompt"
            rows="4"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={isLoading || !user}
            placeholder="e.g., Focus on the key decisions made in the meeting."
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isLoading || !selectedFile || !user}
          style={{ padding: '10px 15px', cursor: isLoading ? 'wait' : 'pointer' }}
        >
          {isLoading ? 'Processing...' : 'Summarize Media'}
        </button>
      </form>

      {/* Status/Progress Message */}
      {statusMessage && <p style={{ color: 'blue' }}>{statusMessage}</p>}

      {/* Error Message Display */}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</p>}

      {/* Results Display */}
      {(transcript || summary) && (
        <div style={{ display: 'flex', marginTop: '20px', gap: '20px' }}>
          {/* Transcript Area */}
          <div style={{ flex: 1 }}>
            <h2>Transcript</h2>
            <textarea 
              readOnly 
              value={transcript} 
              style={{ width: '100%', height: '300px', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc' }}
            />
          </div>

          {/* Summary Area */}
          <div style={{ flex: 1 }}>
            <h2>Summary</h2>
            <textarea 
              readOnly 
              value={summary} 
              style={{ width: '100%', height: '300px', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoSummarizer; 