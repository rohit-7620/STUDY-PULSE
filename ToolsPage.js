import React from 'react';
import { Link } from 'react-router-dom'; // Or use nested routing
import './ToolsPage.css'; // Specific styles

// Placeholder Icons (Replace with actual icons)
const PlaceholderIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v-6h-2v6zm0-8h2V6h-2v2z"/>
  </svg>
);


function ToolsPage() {
  const tools = [
   
    {
      title: "Case Study Generator",
      description: "Explore AI-generated case studies.",
      icon: "💡",
      link: "/tools/case-study-ar"
    },
    {
      title: "AI Assignment Checker",
      description: "Get feedback on correctness, clarity, and potential plagiarism.",
      icon: "📝",
      link: "/assignment-checker"
    },
    // Add more tools as needed
  ];

  return (
    <div className="container tools-page" style={{ padding: '20px' }}>
      <h1>Tools</h1>
      <p>Here are some helpful tools available to enhance your learning:</p>
      
      <div className="tools-grid" style={{ marginTop: '20px', display: 'grid', gap: '20px' }}> 
        <div className="tool-card" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <h2>Media Summarizer</h2>
          <p>Generate transcripts and summaries from your media files.</p>
          <Link to="/tools/summarizer" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 12px', display: 'inline-block', marginTop: '10px' }}>
            Launch Summarizer
          </Link>
        </div>

        {/* Gamified Quizzes Card */}
        <div className="tool-card" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <h2>Gamified Quizzes</h2>
          <p>Test your knowledge with fun, interactive quizzes.</p>
          {/* Update Link to point to a specific quiz ID */}
          <Link to="/quizzes/1" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 12px', display: 'inline-block', marginTop: '10px' }}>
            Take Quiz (ID: 1)
          </Link>
        </div>

        {tools.map((tool, index) => (
          <Link key={index} to={tool.link} className="tool-card-link">
            <div className="tool-card card">
              <div className="tool-icon">{tool.icon || <PlaceholderIcon />}</div>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <span className="launch-tool-btn">Launch Tool &rarr;</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Placeholder: You might render specific tool components here based on sub-routes */}
      {/* Example using nested routes (requires setup in App.js): */}
      {/* <Routes>
        <Route path="video-summary" element={<VideoSummarizer />} />
        <Route path="ar-models" element={<ARViewer />} />
         Add routes for other tools
      </Routes> */}
    </div>
  );
}

export default ToolsPage; 