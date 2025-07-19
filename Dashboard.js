import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStatus } from '../contexts/AuthContext'; // Assuming context provides user info
import './Dashboard.css'; // Specific styles for Dashboard

// Placeholder Chart Component (replace with actual Chart.js implementation)
const PlaceholderChart = () => (
  <div style={{ height: '250px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
    Chart Placeholder
  </div>
);

// Placeholder data - replace with actual data fetched from backend
const recentActivity = [
  { id: 1, type: 'course', title: 'Advanced React Patterns', status: 'In Progress (65%)' },
  { id: 2, type: 'quiz', title: 'Python Fundamentals Quiz', status: 'Completed (Score: 90%)' },
  { id: 3, type: 'tool', title: 'Used Video Summarizer', status: '5 minutes ago' },
];

const recommendedContent = [
  { id: 101, type: 'course', title: 'Introduction to Machine Learning' },
  { id: 102, type: 'lesson', title: 'Understanding Async/Await in JS' },
  { id: 103, type: 'quiz', title: 'Data Structures Challenge' },
];

function Dashboard() {
  const { user } = useAuthStatus(); // Get user info if needed

  // Handle case where user might not be loaded yet (though ProtectedRoute should handle it)
  const userName = user?.displayName || user?.email || 'Learner';

  // Placeholder data - replace with data fetched from backend
  const quickStats = [
    { title: 'Courses Started', value: 5, icon: '📚' },
    { title: 'Quizzes Taken', value: 12, icon: '📝' },
    { title: 'XP Earned', value: 1250, icon: '⭐' },
    { title: 'Current Rank', value: '#8', icon: '🏆' },
  ];

  const recommendedTopics = [
    { title: 'Advanced React Hooks', progress: 60 },
    { title: 'Python Async Fundamentals', progress: 30 },
    { title: 'Machine Learning Basics', progress: 0 },
  ];

  return (
    <div className="dashboard-container container">
      <h1>Welcome back, {userName}!</h1>
      <p className="dashboard-subtitle">Ready to continue your learning journey?</p>

      {/* Futuristic Learning Animation Image - REMOVED
      <div className="dashboard-animation-container">
          <img 
              src="https://placehold.co/800x300/8E2DE2/FFFFFF?text=Futuristic+Learning+Animation&font=montserrat" 
              alt="Futuristic learning animation concept" 
              className="dashboard-animation-image"
          />
      </div>
      */}

      {/* Quick Stats Section */}
      <section className="quick-stats">
        {quickStats.map((stat, index) => (
          <div key={index} className="stat-card card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-title">{stat.title}</div>
          </div>
        ))}
      </section>

      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="dashboard-column-left">
          {/* Recommended Learning Topics */}
          <section className="recommended-topics card">
            <h2>Recommended For You</h2>
            <ul>
              {recommendedTopics.map((topic, index) => (
                <li key={index} className="topic-item">
                  <span>{topic.title}</span>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${topic.progress}%` }}></div>
                  </div>
                  <span>{topic.progress}%</span>
                </li>
              ))}
            </ul>
            <Link to="/learn" className="btn-secondary view-all-btn">View All Recommendations</Link>
          </section>

          {/* AI Generated Career Roadmap (Placeholder) */}
          <section className="career-roadmap card">
            <h2>Your AI Career Roadmap</h2>
            <p>Based on your interests and progress, here's a suggested path:</p>
            {/* Placeholder for roadmap visualization */}
            <div className="roadmap-placeholder">AI Roadmap Visualization Coming Soon...</div>
            <Link to="/learn" className="btn-secondary">Explore Roadmap</Link>
          </section>
        </div>

        {/* Right Column */}
        <div className="dashboard-column-right">
          {/* Progress Chart */}
          <section className="progress-chart-section card">
            <h2>Your Weekly Progress</h2>
            <PlaceholderChart />
            <Link to="/track-progress" className="btn-secondary view-details-btn">View Detailed Progress</Link>
          </section>

          {/* Quick Access */}
          <section className="quick-access card">
            <h2>Quick Access</h2>
            <div className="quick-access-buttons">
              <Link to="/chatbot" className="quick-access-btn">
                <span role="img" aria-label="chatbot">🤖</span> Ask Chatbot
              </Link>
              <Link to="/tools/video-summary" className="quick-access-btn">
                <span role="img" aria-label="video">🎬</span> Summarize Video
              </Link>
              <Link to="/tools/ar-models" className="quick-access-btn">
                <span role="img" aria-label="ar">🕶️</span> View AR Models
              </Link>
              <Link to="/quizzes" className="quick-access-btn">
                 <span role="img" aria-label="quiz">❓</span> Take a Quiz
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Section 1: Recent Activity */}
      <section className="dashboard-section recent-activity card">
        <h2>Recent Activity</h2>
        {recentActivity.length > 0 ? (
          <ul>
            {recentActivity.map(activity => (
              <li key={activity.id} className={`activity-item type-${activity.type}`}>
                <span className="activity-title">{activity.title}</span>
                <span className="activity-status">{activity.status}</span>
                {/* Optional: Add a link based on type */}
                {/* <Link to={`/${activity.type}s/${activity.id}`}>View</Link> */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent activity yet.</p>
        )}
         <Link to="/learn" className="view-all-link">View All Courses</Link>
      </section>

      {/* Section 2: Recommendations */}
      <section className="dashboard-section recommendations card">
        <h2>Recommended For You</h2>
         {recommendedContent.length > 0 ? (
          <ul>
            {recommendedContent.map(item => (
              <li key={item.id} className={`recommendation-item type-${item.type}`}>
                <span className="recommendation-title">{item.title}</span>
                {/* Optional: Add a link based on type */}
                <Link to={item.type === 'course' ? `/courses/${item.id}` : '#'} className="start-learning-link">Start Learning</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recommendations right now.</p>
        )}
      </section>

      {/* Section 3: Quick Access / Tools (Example) */}
      <section className="dashboard-section quick-access card">
        <h2>Quick Access Tools</h2>
        <div className="tool-links">
           <Link to="/chatbot" className="tool-link-item">AI Chatbot</Link>
           <Link to="/tools/summarizer" className="tool-link-item">Video Summarizer</Link>
           <Link to="/assignment-checker" className="tool-link-item">Assignment Checker</Link>
           <Link to="/tools" className="tool-link-item view-all-link">View All Tools</Link>
        </div>
      </section>

       {/* Section 4: Progress Overview (Example) */}
      <section className="dashboard-section progress-overview card">
        <h2>Your Progress</h2>
        {/* Simple placeholder - replace with actual progress viz */}
        <div className="progress-placeholder">
           <p>Level: <strong>12</strong> | XP: <strong>4500</strong></p>
           <p>Courses Completed: <strong>5/15</strong></p>
           {/* Add a simple progress bar or chart */}
           <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{width: '66%'}}>66% Overall</div>
           </div>
           <Link to="/track-progress" className="view-all-link">View Full Progress</Link>
        </div>
      </section>
    </div>
  );
}

export default Dashboard; 