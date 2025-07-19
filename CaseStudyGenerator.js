import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuthStatus } from '../contexts/AuthContext'; // Import the hook
// import './CaseStudyGenerator.css'; // Optional styling

function CaseStudyGenerator() {
  // --- State for Case Study --- 
  const [caseStudyPrompt, setCaseStudyPrompt] = useState('');
  const [caseStudyText, setCaseStudyText] = useState('');
  const [isCaseStudyLoading, setIsCaseStudyLoading] = useState(false);
  const [caseStudyError, setCaseStudyError] = useState(null);

  // --- State for Model Description from Prompt --- (REMOVING)
  // const [objPrompt, setObjPrompt] = useState('');
  // const [objDescription, setObjDescription] = useState('');
  // const [isObjDescLoading, setIsObjDescLoading] = useState(false);
  // const [objDescError, setObjDescError] = useState('');

  // --- State for Model Viewer --- 
  // const defaultModel = "/models/solar_system.glb"; 
  // const [modelSrc, setModelSrc] = useState(defaultModel);
  // const modelInputRef = useRef(null); 
  // const [modelError, setModelError] = useState(''); 
  // const [modelDescFromViewer, setModelDescFromViewer] = useState(''); // State for description of VIEWED model
  // const [isViewerDescLoading, setIsViewerDescLoading] = useState(false); 
  // const [viewerDescError, setViewerDescError] = useState(''); 

  const { user, loading: loadingAuth } = useAuthStatus();

  // --- Handler for Case Study --- 
  const handleCaseStudySubmit = async (event) => { 
      event.preventDefault();
      if (!caseStudyPrompt.trim()) { setCaseStudyError('Please enter a topic or prompt.'); return; }
      if (!user) { setCaseStudyError('Please log in.'); return; }
      setIsCaseStudyLoading(true); setCaseStudyError(null); setCaseStudyText('');
      try {
          const token = await user.getIdToken();
          const response = await axios.post('/api/tools/generate-case-study/', 
                { prompt: caseStudyPrompt.trim() }, 
                { headers: { 'Authorization': `Bearer ${token}` }, timeout: 200000 });
          setCaseStudyText(response.data.case_study_text || 'No text returned.');
      } catch (err) { 
            console.error("Case study generation error:", err);
            let errorMsg = 'Failed to generate case study.';
            // Improved error display
            if (err.response) {
              errorMsg = err.response.data?.error || `Server error: ${err.response.status}`;
            } else if (err.request) {
              errorMsg = 'Could not connect to server. Check network or timeout.';
            } else {
              errorMsg = err.message;
            }
            setCaseStudyError(errorMsg);
      } finally { setIsCaseStudyLoading(false); }
  };

  // --- Handler for Model Description from Prompt --- (REMOVING)
  // const handleObjDescSubmit = async (event) => {
  //     ...
  // };

  // --- Handler for Loading Model in Viewer --- 
  // const handleLoadModel = () => {
  //   const newSrc = modelInputRef.current.value.trim();
  //   if (newSrc) {
  //     setModelSrc(newSrc);
  //     setModelError(''); 
  //     setModelDescFromViewer(''); // Clear description when loading new model
  //     setViewerDescError('');
  //   } else {
  //     setModelError('Please enter a valid URL or path for the model.');
  //   }
  // }; 

  // --- Handler for Getting Description of Viewed Model --- 
  // const handleGetViewerDescription = async () => { 
  //   // Renamed this handler and its state variables
  //   if (!modelSrc) { setViewerDescError('No model source available to describe.'); return; }
  //   if (!user) { setViewerDescError('Please log in to get a description.'); return; }
  //   setIsViewerDescLoading(true); setViewerDescError(null); setModelDescFromViewer('');
  //   try {
  //     const token = await user.getIdToken();
  //     const response = await axios.post('/api/tools/describe-model/',
  //       { model_src: modelSrc }, // Use the state modelSrc
  //       { headers: { 'Authorization': `Bearer ${token}` }, timeout: 70000 }
  //     );
  //     setModelDescFromViewer(response.data.description || 'No description returned.');
  //   } catch (err) { /* ... error handling for viewer description ... */ 
  //       console.error("Viewer model description error:", err);
  //       let errorMsg = 'Failed to get description.';
  //       // ... (setViewerDescError(errorMsg)) ...
  //   } finally { setIsViewerDescLoading(false); }
  // };

  if (loadingAuth) { 
      return <div className="container">Loading authentication...</div>; 
  }

  return (
    <div className="container ai-case-study-generator" style={{ padding: '20px' }}> 
        <h1>AI Case Study Generator</h1>
        <p>Enter a topic, scenario, or specific request to generate a case study.</p>
        
        {!user && (
            <p style={{ color: 'red' }}>Please log in to use this feature.</p>
        )}

        {/* Case Study Form */}
        <form onSubmit={handleCaseStudySubmit} style={{ marginBottom: '15px' }}>
            <label htmlFor="case-study-prompt" style={{ display: 'block', marginBottom: '5px' }}>
                Topic/Prompt:
            </label>
            <textarea 
                id="case-study-prompt"
                rows="5"
                value={caseStudyPrompt}
                onChange={(e) => setCaseStudyPrompt(e.target.value)}
                disabled={isCaseStudyLoading || !user}
                placeholder="e.g., Describe a case study about implementing agile methodology in a traditional manufacturing company."
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                required
            />
            <button type="submit" disabled={isCaseStudyLoading || !user || !caseStudyPrompt.trim()} style={{ padding: '10px 15px', marginTop: '10px' }}>
                {isCaseStudyLoading ? 'Generating...' : 'Generate Case Study'}
            </button>
        </form>

        {/* Case Study Display Area */} 
        {isCaseStudyLoading && <p>Generating case study...</p>} 
        {caseStudyError && <p style={{ color: 'red' }}>Error: {caseStudyError}</p>}
        {caseStudyText && (
            <div style={{ marginTop: '20px', border: '1px solid #eee', padding: '15px', borderRadius: '8px', background: '#f9f9f9' }}>
                <h2>Generated Case Study</h2>
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'inherit' }}>
                  {caseStudyText}
                </pre>
            </div>
        )}

      {/* --- AR/3D Model Viewer Section --- (REMOVING) */}
      {/* 
       <section style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
            ...
       </section>
       */}
    </div>
  );
}

export default CaseStudyGenerator; 